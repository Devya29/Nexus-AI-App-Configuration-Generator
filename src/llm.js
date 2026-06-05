require('dotenv').config();

const Groq = require('groq-sdk');

// Debug
console.log("GROQ KEY LOADED:", !!process.env.GROQ_API_KEY);

let groq = null;

try {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY not found in .env");
  }

  groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
  });

  console.log("✅ Groq client initialized");
} catch (err) {
  console.warn("⚠️ Groq SDK not initialized:", err.message);
}

async function callLLM(
  prompt,
  systemPrompt = "You are a helpful assistant that generates structured JSON outputs."
) {
  if (!groq) {
    console.warn("⚠️ LLM not available, returning fallback");
    return null;
  }

  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.1,
      max_tokens: 1024,
      response_format: {
        type: "json_object"
      }
    });

    const content = response.choices?.[0]?.message?.content;

    if (!content) {
      console.warn("⚠️ Empty LLM response");
      return null;
    }

    try {
      return JSON.parse(content);
    } catch (parseErr) {
      console.warn("⚠️ Failed to parse LLM JSON output");
      console.warn(content);
      return null;
    }

  } catch (err) {
    console.warn("⚠️ LLM call failed:", err.message);
    return null;
  }
}

module.exports = { callLLM };