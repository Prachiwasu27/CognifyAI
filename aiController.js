const { getAIResponse } = require('./aiService');

exports.generateResponse = async (req, res) => {
  try {

    const { prompt, mode } = req.body;

    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({
        reply: "Please enter some content."
      });
    }

    // 🔥 Mode pass karna important hai
    const aiReply = await getAIResponse(prompt, mode);

    if (!aiReply) {
      return res.status(500).json({
        reply: "AI did not return any response."
      });
    }

    res.status(200).json({
      reply: aiReply
    });

  } catch (error) {

    console.error("Controller Error:", error.message);

    res.status(500).json({
      reply: "AI service failed. Please try again."
    });
  }
};

