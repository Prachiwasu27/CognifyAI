const axios = require("axios");

// 🔥 Prompt Builder Function
function buildPrompt(mode, userPrompt) {

  switch (mode) {

    case "summarize":
      return `Summarize the following content clearly and concisely:\n\n${userPrompt}`;

    case "quiz":
      return `Generate 5 quiz questions with answers from this topic:\n\n${userPrompt}`;

    case "flashcards":
      return `Create flashcards in Q&A format from this content:\n\n${userPrompt}`;

    case "explain":
    default:
      return `Explain this topic clearly in simple language:\n\n${userPrompt}`;
  }
}

exports.getAIResponse = async (prompt, mode = "explain") => {
  try {

    const finalPrompt = buildPrompt(mode, prompt);

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3-8b-instruct",
        messages: [
          {
            role: "user",
            content: finalPrompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5000",
          "X-Title": "StudyGenie-AI"
        }
      }
    );

    return response.data.choices[0].message.content;

  } catch (error) {
    console.error("========== OpenRouter ERROR ==========");
    console.error(error.response?.data || error.message);
    console.error("======================================");
    throw new Error("AI service failed");
  }
};
