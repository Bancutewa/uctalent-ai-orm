import "server-only";

export const geminiConfig = {
  apiKey: process.env.GEMINI_API_KEY || "",
  model: process.env.GEMINI_MODEL || "gemini-2.5-flash-lite",
  temperature: 0.7,
};
