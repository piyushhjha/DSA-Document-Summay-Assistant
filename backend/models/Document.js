import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    fileName: {
      type: String,
      required: true,
      trim: true,
    },

    fileType: {
      type: String,
      default: "application/octet-stream",
    },

    length: {
      type: String,
      enum: ["short", "medium", "long"],
      default: "short",
    },

    summary: {
      type: String,
      required: true,
    },

    keyPoints: {
      type: [String],
      default: [],
    },

    method: {
      type: String,
      default: "unknown",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Document = mongoose.model("Document", documentSchema);

export default Document;
