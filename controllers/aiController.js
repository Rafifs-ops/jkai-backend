const { getGeminiResponse } = require('../utils/gemini');

// 1. Rekomendasi Umum (Chatbot/Form)
exports.getRecommendation = async (req, res) => {
    const { query, language = 'id' } = req.body;
    const prompt = `Bertindaklah sebagai pemandu wisata ahli dari PT KAI (Kereta Api Indonesia). 
  User bertanya: "${query}". 
  Jawablah dengan ramah, informatif, dan fokus pada pariwisata Indonesia. 
  Gunakan bahasa: ${language}.`;

    try {
        const response = await getGeminiResponse(prompt);
        res.json({ result: response });
    } catch (error) {
        res.status(500).json({ error: 'Gagal mendapatkan rekomendasi' });
    }
};

// 2. AI Trip Planner (Output WAJIB JSON Array)
exports.tripPlanner = async (req, res) => {
    const { destination, days, budget, start_station } = req.body;

    // Prompt Engineering yang ketat agar outputnya JSON bersih
    const prompt = `Buatkan rencana perjalanan wisata ke ${destination} selama ${days} hari dengan budget ${budget}. 
  Start dari stasiun: ${start_station}.
  
  PENTING: Output HANYA boleh berupa JSON Array murni tanpa teks pembuka/penutup markdown.
  Format JSON harus seperti ini:
  [
    {
      "day": 1,
      "date": "Hari 1",
      "activities": [
        {
          "time": "08:00",
          "place_name": "Nama Tempat",
          "description": "Deskripsi singkat aktivitas",
          "estimated_cost": "Rp 50.000"
        }
      ],
      "transport_recommendation": "Nama Kereta & Perkiraan Harga Tiket"
    }
  ]`;

    try {
        let response = await getGeminiResponse(prompt);
        // Bersihkan markdown formatting jika AI memberikan ```json ... ```
        response = response.replace(/```json/g, '').replace(/```/g, '').trim();

        const jsonResponse = JSON.parse(response); // Validasi parsing JSON
        res.json({ plan: jsonResponse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Gagal membuat trip plan. Coba lagi.' });
    }
};

// 3. Analisis Review Pariwisata
exports.analyzeReviews = async (req, res) => {
    const { reviews } = req.body; // Array of strings (review user)

    const prompt = `Berikut adalah beberapa review dari pengunjung tentang tempat wisata ini:
  "${reviews.join(' | ')}"
  
  Tolong berikan analisis singkat dalam format JSON:
  {
    "sentiment_summary": "Ringkasan sentimen (Positif/Netral/Negatif)",
    "pros": ["Poin positif 1", "Poin positif 2"],
    "cons": ["Poin negatif 1", "Poin negatif 2"],
    "summary": "Kesimpulan satu paragraf tentang tempat ini berdasarkan review."
  }`;

    try {
        let response = await getGeminiResponse(prompt);
        response = response.replace(/```json/g, '').replace(/```/g, '').trim();
        res.json(JSON.parse(response));
    } catch (error) {
        res.status(500).json({ error: 'Gagal menganalisis review' });
    }
};

// 4. Penjelasan Blog (Tanya AI tentang Blog ini)
exports.explainBlog = async (req, res) => {
    const { blogContent, question } = req.body;

    const prompt = `Berdasarkan artikel blog berikut:
  "${blogContent.substring(0, 1500)}..." (dipotong agar tidak terlalu panjang)
  
  Jawablah pertanyaan user: "${question}"
  Jawab dengan singkat dan padat.`;

    try {
        const response = await getGeminiResponse(prompt);
        res.json({ answer: response });
    } catch (error) {
        res.status(500).json({ error: 'Gagal menjelaskan blog' });
    }
};