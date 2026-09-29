import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize GoogleGenAI server-side client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const DEFAULT_SYSTEM_INSTRUCTION = `Anda adalah Asisten Cerdas & Konsultan Gizi Resmi untuk "Rarumi Healthy & Organic Kitchen".
Tugas utama Anda:
1. Membantu kasir dan pelanggan memahami menu sehat bebas gluten (GF), bebas telur (EF), bebas susu sapi (DF), vegan plant-based, dan daging sapi grassfed pilihan.
2. Memberikan rekomendasi menu harian berdasarkan kebutuhan alergi pelanggan (misal: alergi telur & gluten, diet autisme/GFCF, diet keto tanpa tepung).
3. Menjelaskan instruksi penyimpanan & reheat:
   - Roti sourdough bisa disimpan di freezer dan direheat kembali dengan cara dikukus -+ 5 menit sebelum dinikmati agar tetap lembut dan fluffy.
   - Frozen food disimpan beku di freezer.
   - Raw milk & fermented beverages simpan di kulkas/chiller.
4. Membantu menyusun atau merangkum pesanan pelanggan untuk dikirimkan ke nomor WhatsApp resmi Rarumi Kitchen (0812-9876-5432).
5. Gaya bahasa: Ramah, santun, islami ("Bismillah", "Alhamdulillah", "Jazakumullah Khairan"), profesional, dan mengutamakan kesehatan dan kehalalan.`;

// Gemini Multi-turn Chat API
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, model = 'gemini-3.5-flash', systemInstruction } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Array pesan tidak boleh kosong.' });
    }

    // Supported models per user prompt & instructions:
    // gemini-3.5-flash (general tasks)
    // gemini-3.1-flash-lite (fast tasks)
    // gemini-3.1-pro-preview (complex tasks)
    let selectedModel = model;
    const allowedModels = ['gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-3.1-pro-preview', 'gemini-3.8-flash'];
    if (!allowedModels.includes(selectedModel)) {
      selectedModel = 'gemini-3.5-flash';
    }

    // Convert messages to Gemini contents format
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents,
      config: {
        systemInstruction: systemInstruction || DEFAULT_SYSTEM_INSTRUCTION,
      },
    });

    const reply = response.text || 'Maaf, saya tidak dapat memproses jawaban saat ini.';
    return res.json({ reply, modelUsed: selectedModel });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    const errorMessage = error?.message || 'Terjadi kesalahan pada layanan AI.';
    return res.status(500).json({ error: errorMessage });
  }
});

// Setup Vite middlewares for development, or serve static dist in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
