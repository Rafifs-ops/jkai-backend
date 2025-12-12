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

  const prompt = `Buatkan rencana perjalanan wisata ke ${destination} selama ${days} hari dengan budget ${budget}. 
  Start dari stasiun: ${start_station}.
  
  INSTRUKSI KHUSUS (WAJIB DIPATUHI):
  1. **Transportasi:** Tampilkan rute lengkap. Wajib sertakan "cost" (estimasi harga tiket kereta/bus per orang dalam Rupiah).
  2. **Kuliner:** Wajib sertakan rekomendasi tempat makan. 
     - Field "social_link": Berikan link Google Maps atau Instagram yang valid. Jika benar-benar tidak ada, isi dengan string kosong "" (jangan null).
     - Field "estimated_cost": Wajib ada estimasi harga per porsi (misal: "Rp 25.000/porsi").
  3. **Landmark:** Sertakan tempat wisata ikonik.

  OUTPUT HARUS JSON ARRAY MURNI (Tanpa Markdown ````json) Format:
      [
        {
          "day": 1,
          "date": "Hari 1",
          "transport_detail": {
            "route": "Gambir -> Bandung",
            "mode": "Kereta Argo Parahyangan",
            "cost": "Rp 150.000"
          },
          "activities": [
            {
              "time": "12:00",
              "place_name": "Sate Maranggi Cibungur",
              "category": "Kuliner",
              "description": "Sate sapi empuk yang legendaris.",
              "social_link": "[https://maps.google.com/?q=Sate+Maranggi+Cibungur](https://maps.google.com/?q=Sate+Maranggi+Cibungur)",
              "estimated_cost": "Rp 50.000/org"
            }
          ]
        }
      ]`;

  try {
    let response = await getGeminiResponse(prompt);
    // Bersihkan markdown formatting jika AI masih membandel memberikannya
    response = response.replace(/```json/g, '').replace(/```/g, '').trim();

    // Validasi JSON parse untuk mencegah error di frontend
    let jsonResponse;
    try {
      jsonResponse = JSON.parse(response);
    } catch (e) {
      console.error("AI Response Error:", response);
      throw new Error("Format AI tidak valid, silakan coba lagi.");
    }

    res.json({ plan: jsonResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal membuat trip plan. Coba lagi.' });
  }
};

// 3. Analisis Review Pariwisata
exports.analyzeReviews = async (req, res) => {
  // Kita tidak lagi butuh array 'reviews' dari database lokal
  // Kita butuh Nama Tempat dan Lokasinya agar AI bisa mencari di knowledge base-nya
  const { place_name, location } = req.body;

  if (!place_name) {
    return res.status(400).json({ error: "Nama tempat diperlukan" });
  }

  // Prompt yang diperbarui untuk memaksa AI bertindak sebagai peneliti review
  const prompt = `
  Bertindaklah sebagai analis data pariwisata ahli.
  Tugas: Analisis sentimen publik terbaru, ulasan Google Maps, dan diskusi media sosial mengenai tempat wisata: "${place_name}" yang berlokasi di "${location}".
  
  Gunakan pengetahuan luasmu tentang tempat ini untuk merangkum apa yang dikatakan orang-orang (turis lokal maupun asing).
  
  Output WAJIB dalam format JSON valid (tanpa markdown code block) dengan struktur berikut:
  {
    "sentiment_summary": "Ringkasan sentimen umum (misal: Sangat Positif/Campuran/Negatif)",
    "pros": ["Poin positif 1 (dari ulasan publik)", "Poin positif 2"],
    "cons": ["Poin negatif 1 (keluhan umum)", "Poin negatif 2"],
    "summary": "Kesimpulan paragraf singkat mengenai pengalaman turis di sini berdasarkan tren ulasan daring."
  }
  `;

  try {
    let response = await getGeminiResponse(prompt);
    // Bersihkan format markdown jika AI memberikannya (misal ```json ... ```)
    response = response.replace(/```json/g, '').replace(/```/g, '').trim();

    res.json(JSON.parse(response));
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: 'Gagal menganalisis review dari sumber publik.' });
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