import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
//import nodemailer from "nodemailer";
import crypto from "crypto";

import User from "./models/User.js";
import Document from "./models/Document.js";

import { extractText } from "./services/extractor.js";
import { summarizeText } from "./services/summarizer.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

// =============================
// EMAIL OTP AUTHENTICATION
// =============================

const otpStore = new Map();
//const users = new Map();
// removing below because render deployment dont supoort SMTP gmail verification
// const mailTransporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// }); 

const hashPassword = (
  password,
  salt = crypto.randomBytes(16).toString("hex"),
) => {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");

  return {
    salt,
    hash,
  };
};

const verifyPassword = (password, storedHash, salt) => {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");

  return crypto.timingSafeEqual(
    Buffer.from(hash, "hex"),
    Buffer.from(storedHash, "hex"),
  );
};

// =============================
// HEALTH
// =============================

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    message: "Document Summary API is running",
  });
});

// =============================
// SEND OTP
// =============================

app.post("/api/auth/send-otp", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    if (!email.toLowerCase().endsWith("@gmail.com")) {
      return res.status(400).json({
        message: "Please use a Gmail address.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must contain at least 6 characters.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const existingOtp = otpStore.get(normalizedEmail);

    if (existingOtp && Date.now() - existingOtp.createdAt < 60 * 1000) {
      return res.status(429).json({
        message: "Please wait 60 seconds before requesting another OTP.",
      });
    }

    const otp = crypto.randomInt(100000, 1000000).toString();

    otpStore.set(normalizedEmail, {
      otp,
      name: name?.trim() || "",
      password,
      createdAt: Date.now(),
      expiresAt: Date.now() + 10 * 60 * 1000,
    });

    const brevoResponse = await fetch(
  "https://api.brevo.com/v3/smtp/email",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: {
        name: "Document Summary Assistant",
        email: process.env.EMAIL_USER,
      },
      to: [
        {
          email: normalizedEmail,
        },
      ],
      subject: "Your Document Summary Assistant OTP",

      textContent:
        `Your verification OTP is ${otp}. ` +
        `It expires in 10 minutes.`,

      htmlContent: `
        <div style="
          font-family:Arial,sans-serif;
          max-width:600px;
          margin:auto;
          padding:30px;
          color:#17243a;
        ">

          <h2 style="color:#17243a">
            Document Summary Assistant
          </h2>

          <p>
            Use the following OTP to verify your email:
          </p>

          <div style="
            font-size:32px;
            font-weight:bold;
            letter-spacing:10px;
            padding:20px;
            background:#f4f5f7;
            text-align:center;
            margin:25px 0;
          ">
            ${otp}
          </div>

          <p>
            This OTP expires in
            <b>10 minutes</b>.
          </p>

          <p style="color:#777">
            If you did not request this code,
            you can safely ignore this email.
          </p>

        </div>
      `,
    }),
  },
);

if (!brevoResponse.ok) {
  const brevoError = await brevoResponse.text();

  console.error("Brevo OTP error:", brevoError);

  return res.status(500).json({
    message: "Unable to send OTP. Please try again.",
  });
}

    res.json({
      message: `OTP sent to ${normalizedEmail}. Check your inbox.`,
    });
  } catch (error) {
    console.error("OTP email error:", error);

    res.status(500).json({
      message: "Unable to send OTP. Check your email configuration.",
    });
  }
});

// =============================
// VERIFY OTP + CREATE ACCOUNT
// =============================

app.post("/api/auth/verify-otp", async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;

    const normalizedEmail = email?.toLowerCase().trim();

    if (!normalizedEmail || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required.",
      });
    }

    const record = otpStore.get(normalizedEmail);

    if (!record) {
      return res.status(400).json({
        message: "OTP not found. Please request a new OTP.",
      });
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(normalizedEmail);

      return res.status(400).json({
        message: "OTP has expired. Please request a new OTP.",
      });
    }

    if (record.otp !== otp) {
      return res.status(400).json({
        message: "Incorrect OTP. Please try again.",
      });
    }

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const passwordData = hashPassword(password);

    const user = await User.create({
      name: name?.trim() || record.name,

      email: normalizedEmail,

      passwordHash: passwordData.hash,

      passwordSalt: passwordData.salt,
    });

    otpStore.delete(normalizedEmail);

    res.json({
      message: "Account created successfully.",

      user: {
        id: user._id.toString(),

        name: user.name,

        email: user.email,

        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("OTP verification error:", error);

    res.status(500).json({
      message: "Unable to verify OTP.",
    });
  }
});

// =============================
// LOGIN
// =============================

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = email?.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        message: "No account found with this email.",
      });
    }

    const validPassword = verifyPassword(
      password,
      user.passwordHash,
      user.passwordSalt,
    );

    if (!validPassword) {
      return res.status(401).json({
        message: "Incorrect password.",
      });
    }

    res.json({
      message: "Login successful.",

      user: {
        id: user._id.toString(),

        name: user.name,

        email: user.email,

        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Unable to login.",
    });
  }
});

// =============================
// SAVE DOCUMENT TO HISTORY
// =============================

app.post("/api/history", async (req, res) => {
  try {
    const { userId, fileName, fileType, length, summary, keyPoints, method } =
      req.body;

    if (!userId || !fileName || !summary) {
      return res.status(400).json({
        message: "User, file name, and summary are required.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User account not found.",
      });
    }

    const document = await Document.create({
      userId,

      fileName,

      fileType: fileType || "application/octet-stream",

      length: length || "short",

      summary,

      keyPoints: Array.isArray(keyPoints) ? keyPoints : [],

      method: method || "unknown",
    });

    res.status(201).json({
      message: "Document saved to history.",

      history: {
        id: document._id.toString(),

        name: document.fileName,

        fileName: document.fileName,

        fileType: document.fileType,

        length: document.length,

        summary: document.summary,

        keyPoints: document.keyPoints,

        method: document.method,

        createdAt: document.createdAt,

        date: document.createdAt.toLocaleDateString("en-IN"),
      },
    });
  } catch (error) {
    console.error("Save history error:", error);

    res.status(500).json({
      message: "Unable to save document history.",
    });
  }
});

// =============================
// GET USER HISTORY
// =============================

app.get("/api/history/:userId", async (req, res) => {
  try {
    const documents = await Document.find({
      userId: req.params.userId,
    }).sort({
      createdAt: -1,
    });

    const history = documents.map((document) => ({
      id: document._id.toString(),

      name: document.fileName,

      fileName: document.fileName,

      fileType: document.fileType,

      length: document.length,

      summary: document.summary,

      keyPoints: document.keyPoints,

      method: document.method,

      createdAt: document.createdAt,

      date: document.createdAt.toLocaleDateString("en-IN"),
    }));

    res.json({
      history,
    });
  } catch (error) {
    console.error("Load history error:", error);

    res.status(500).json({
      message: "Unable to load document history.",
    });
  }
});

// =============================
// DELETE ONE HISTORY ITEM
// =============================

app.delete("/api/history/:id", async (req, res) => {
  try {
    const deleted = await Document.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        message: "History item not found.",
      });
    }

    res.json({
      message: "History item deleted successfully.",
    });
  } catch (error) {
    console.error("Delete history error:", error);

    res.status(500).json({
      message: "Unable to delete history item.",
    });
  }
});

// =============================
// SUMMARIZE DOCUMENT
// =============================

app.post("/api/summarize", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded.",
      });
    }

    const length = req.body.length || "medium";

    if (!["short", "medium", "long"].includes(length)) {
      return res.status(400).json({
        message: "Invalid summary length.",
      });
    }

    const extracted = await extractText(req.file);

    if (!extracted.text.trim()) {
      return res.status(422).json({
        message: "No readable text was found in this document.",
      });
    }

    const result = await summarizeText(extracted.text, length);

    res.json({
      fileName: req.file.originalname,

      method: extracted.method,

      summary: result.summary,

      keyPoints: result.keyPoints,

      extractedText: extracted.text,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message || "Failed to process document.",
    });
  }
});

// =============================
// MULTER / SERVER ERROR
// =============================

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({
      message: "File size must be 10 MB or less.",
    });
  }

  res.status(500).json({
    message: "Server error.",
  });
});

// =============================
// START SERVER
// =============================

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);

    process.exit(1);
  }
};

startServer();
