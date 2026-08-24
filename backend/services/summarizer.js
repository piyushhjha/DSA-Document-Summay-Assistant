export async function summarizeText(text, length) {
  const limits = {
    short: "about 70 words",
    medium: "about 140 words",
    long: "about 240 words",
  };

  const trimmed = text.slice(0, 30000);

  const prompt = `Analyze and summarize this document in ${
    limits[length] || limits.medium
  }.

FIRST, detect the language of the document.

IMPORTANT LANGUAGE RULES:

1. If the document is written in English:
   - Return the summary in English.
   - Return the key points in English.
   - Do NOT generate an additional English translation.
   - Set "englishSummary" to null.
   - Set "englishKeyPoints" to [].

2. If the document is NOT written in English:
   - Return the main summary in the ORIGINAL detected language.
   - Return the key points in the ORIGINAL detected language.
   - Also provide an English translation of the summary.
   - Also provide English translations of the key points.

3. Support any language that you can understand, including but not limited to:
   Japanese, Chinese, German, French, Spanish, Italian, Portuguese,
   Korean, Arabic, Hindi and other languages.

4. Preserve important names, dates, numbers, technical terms and factual information.

5. Do not invent information that is not present in the document.

6. The original-language summary and key points must remain in the
   detected language. Do not automatically convert them to English.

Return ONLY valid JSON in exactly this format:

{
  "detectedLanguage": "English",
  "summary": "...",
  "keyPoints": ["...", "..."],
  "englishSummary": null,
  "englishKeyPoints": []
}

For a non-English document, use:

{
  "detectedLanguage": "German",
  "summary": "...German summary...",
  "keyPoints": ["...German point...", "...German point..."],
  "englishSummary": "...English summary...",
  "englishKeyPoints": ["...English point...", "...English point..."]
}

Document:
${trimmed}`;

  const errors = [];

  // =========================================================
  // 1. GEMINI - PRIMARY
  // =========================================================

  if (process.env.GEMINI_API_KEY) {
    try {
      console.log("Trying Gemini...");

      const result = await callGemini(prompt);

      console.log("Summary generated using Gemini.");

      return {
        ...result,
        provider: "Gemini",
      };
    } catch (error) {
      console.error("Gemini failed:", error.message);
      errors.push(`Gemini: ${error.message}`);
    }
  } else {
    console.log("GEMINI_API_KEY not configured. Skipping Gemini.");
  }

  // =========================================================
  // 2. GROQ - FALLBACK
  // =========================================================

  if (process.env.GROQ_API_KEY) {
    try {
      console.log("Trying Groq...");

      const result = await callGroq(prompt);

      console.log("Summary generated using Groq.");

      return {
        ...result,
        provider: "Groq",
      };
    } catch (error) {
      console.error("Groq failed:", error.message);
      errors.push(`Groq: ${error.message}`);
    }
  } else {
    console.log("GROQ_API_KEY not configured. Skipping Groq.");
  }

  // =========================================================
  // 3. OPENROUTER - FINAL FALLBACK
  // =========================================================

  if (process.env.OPENROUTER_API_KEY) {
    try {
      console.log("Trying OpenRouter...");

      const result = await callOpenRouter(prompt);

      console.log("Summary generated using OpenRouter.");

      return {
        ...result,
        provider: "OpenRouter",
      };
    } catch (error) {
      console.error("OpenRouter failed:", error.message);
      errors.push(`OpenRouter: ${error.message}`);
    }
  } else {
    console.log(
      "OPENROUTER_API_KEY not configured. Skipping OpenRouter."
    );
  }

  // =========================================================
  // 4. LOCAL FALLBACK
  // =========================================================

  console.log("All AI providers failed. Using local summary.");

  if (errors.length > 0) {
    console.error("AI provider errors:", errors.join(" | "));
  }

  return {
    ...localSummary(text, length),
    provider: "Local",
    detectedLanguage: "Unknown",
    englishSummary: null,
    englishKeyPoints: [],
  };
}


// =========================================================
// GEMINI
// =========================================================

async function callGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    const body = await response.text();

    throw new Error(
      `Gemini API error (${response.status}): ${body}`
    );
  }

  const data = await response.json();

  const raw =
    data.candidates?.[0]?.content?.parts?.[0]?.text || "";

  if (!raw.trim()) {
    throw new Error("Gemini returned an empty response.");
  }

  return parseAIResponse(raw);
}


// =========================================================
// GROQ
// =========================================================

async function callGroq(prompt) {
  const apiKey = process.env.GROQ_API_KEY;

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },

      body: JSON.stringify({
        model: "openai/gpt-oss-20b",

        messages: [
          {
            role: "system",
            content:
              "You are a multilingual document summarization assistant. Detect the document language and follow the requested JSON format exactly. Never invent information.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: 0.2,

        max_completion_tokens: 1500,
      }),
    }
  );

  if (!response.ok) {
    const body = await response.text();

    throw new Error(
      `Groq API error (${response.status}): ${body}`
    );
  }

  const data = await response.json();

  const raw =
    data.choices?.[0]?.message?.content || "";

  if (!raw.trim()) {
    throw new Error("Groq returned an empty response.");
  }

  return parseAIResponse(raw);
}


// =========================================================
// OPENROUTER
// =========================================================

async function callOpenRouter(prompt) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "Document Summary Assistant",
      },

      body: JSON.stringify({
        model: "openrouter/free",

        messages: [
          {
            role: "system",
            content:
              "You are a multilingual document summarization assistant. Detect the document language and follow the requested JSON format exactly. Never invent information.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: 0.2,

        max_tokens: 1500,
      }),
    }
  );

  if (!response.ok) {
    const body = await response.text();

    throw new Error(
      `OpenRouter API error (${response.status}): ${body}`
    );
  }

  const data = await response.json();

  const raw =
    data.choices?.[0]?.message?.content || "";

  if (!raw.trim()) {
    throw new Error("OpenRouter returned an empty response.");
  }

  return parseAIResponse(raw);
}


// =========================================================
// AI RESPONSE PARSER
// =========================================================

function parseAIResponse(raw) {
  let clean = raw
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  // Sometimes a model adds text before/after the JSON.
  const firstBrace = clean.indexOf("{");
  const lastBrace = clean.lastIndexOf("}");

  if (firstBrace !== -1 && lastBrace !== -1) {
    clean = clean.slice(firstBrace, lastBrace + 1);
  }

  try {
    const parsed = JSON.parse(clean);

    const detectedLanguage =
      typeof parsed.detectedLanguage === "string"
        ? parsed.detectedLanguage.trim()
        : "Unknown";

    const summary =
      typeof parsed.summary === "string"
        ? parsed.summary.trim()
        : "";

    const keyPoints = Array.isArray(parsed.keyPoints)
      ? parsed.keyPoints
          .filter((point) => typeof point === "string")
          .map((point) => point.trim())
          .filter(Boolean)
      : [];

    const englishSummary =
      typeof parsed.englishSummary === "string"
        ? parsed.englishSummary.trim()
        : null;

    const englishKeyPoints =
      Array.isArray(parsed.englishKeyPoints)
        ? parsed.englishKeyPoints
            .filter((point) => typeof point === "string")
            .map((point) => point.trim())
            .filter(Boolean)
        : [];

    return {
      detectedLanguage,
      summary,
      keyPoints,
      englishSummary:
        detectedLanguage.toLowerCase() === "english"
          ? null
          : englishSummary,
      englishKeyPoints:
        detectedLanguage.toLowerCase() === "english"
          ? []
          : englishKeyPoints,
    };
  } catch (error) {
    console.error(
      "Unable to parse AI JSON response:",
      raw
    );

    // If the AI returned plain text instead of JSON,
    // still show the generated response rather than failing.
    return {
      detectedLanguage: "Unknown",
      summary: clean,
      keyPoints: [],
      englishSummary: null,
      englishKeyPoints: [],
    };
  }
}


// =========================================================
// LOCAL FALLBACK
// =========================================================

function localSummary(text, length) {
  const sentences =
    text
      .replace(/\s+/g, " ")
      .match(/[^.!?]+[.!?]+/g) || [text];

  const count =
    length === "short"
      ? 3
      : length === "long"
        ? 9
        : 5;

  const selected = sentences
    .slice(0, count)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  return {
    summary: selected.join(" "),
    keyPoints: selected.slice(0, 5),
  };
}
