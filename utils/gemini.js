const { GoogleGenerativeAI } = require("@google/generative-ai");

// Pastikan Anda punya API KEY di .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getGeminiResponse = async (prompt) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error Gemini AI:", error);
        throw new Error("Gagal mengambil data dari AI");
    }
};

module.exports = { getGeminiResponse };