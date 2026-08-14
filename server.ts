import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import https from "https";
import url from "url";
import { GoogleGenAI, Modality } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

    app.all("/api/gemini-tts", async (req, res) => {
    const text = req.method === "POST" ? req.body.text : req.query.text;
    const voice = req.method === "POST" ? req.body.voice : req.query.voice;
    const model = req.method === "POST" ? req.body.model : req.query.model;
    const apiKey = req.method === "POST" ? req.body.apiKey : req.query.apiKey;
    
    if (!text) return res.status(400).send("Text is required");
    
    let key = apiKey || process.env.GEMINI_API_KEY;
    if (key === "undefined" || key === "null") key = process.env.GEMINI_API_KEY;
    if (!key) {
      return res.status(401).send("Gemini API key is required");
    }

        try {
      const doRequest = async (useKey) => {
        const ai = new GoogleGenAI({
          apiKey: useKey.trim(),
          httpOptions: {
            headers: { 'User-Agent': 'aistudio-build' }
          }
        });
        return await ai.models.generateContent({
          model: model || "gemini-3.1-flash-tts-preview",
          contents: [{ parts: [{ text: text }] }],
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: voice || 'Kore' },
              },
            },
          },
        });
      };

      let response;
      try {
        response = await doRequest(key);
      } catch (e) {
        // If the key is invalid and it's not the server's default key, try falling back to the server key
        if (e.message && (e.message.includes('API key not valid') || e.message.includes('API_KEY_INVALID'))) {
          const serverKey = process.env.GEMINI_API_KEY;
          if (serverKey && serverKey !== key) {
            console.log("User API key invalid, falling back to server key. Server key exists:", !!serverKey);
            response = await doRequest(serverKey);
          } else {
            throw e;
          }
        } else {
          throw e;
        }
      }

      const inlineData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData;
      const base64Audio = inlineData?.data;
      if (base64Audio) {
        let audioData = base64Audio;
        if (inlineData.mimeType && inlineData.mimeType.includes("audio/pcm")) {
            const pcmBuffer = Buffer.from(base64Audio, 'base64');
            const sampleRate = 24000;
            const numChannels = 1;
            const bitsPerSample = 16;
            
            const wavHeader = Buffer.alloc(44);
            wavHeader.write('RIFF', 0);
            wavHeader.writeUInt32LE(36 + pcmBuffer.length, 4);
            wavHeader.write('WAVE', 8);
            wavHeader.write('fmt ', 12);
            wavHeader.writeUInt32LE(16, 16);
            wavHeader.writeUInt16LE(1, 20);
            wavHeader.writeUInt16LE(numChannels, 22);
            wavHeader.writeUInt32LE(sampleRate, 24);
            wavHeader.writeUInt32LE(sampleRate * numChannels * (bitsPerSample / 8), 28);
            wavHeader.writeUInt16LE(numChannels * (bitsPerSample / 8), 32);
            wavHeader.writeUInt16LE(bitsPerSample, 34);
            wavHeader.write('data', 36);
            wavHeader.writeUInt32LE(pcmBuffer.length, 40);
            
            const wavBuffer = Buffer.concat([wavHeader, pcmBuffer]);
            audioData = wavBuffer.toString('base64');
        }
        
        if (req.method === "GET") {
          const buffer = Buffer.from(audioData, 'base64');
          res.writeHead(200, {
            'Content-Type': 'audio/wav',
            'Content-Length': buffer.length
          });
          res.end(buffer);
        } else {
          res.json({ audio: audioData });
        }
      } else {
        res.status(500).send("No audio data returned from Gemini");
      }
    } catch (e) {
      console.error("Gemini TTS Error:", e);
      res.status(400).send(e.message || "Error generating voice");
    }
  });

  app.get("/api/check-env", (req, res) => { res.send(process.env.GEMINI_API_KEY || "NONE"); });
  app.get("/api/tts", async (req, res) => {
    const text = req.query.text as string;
    const lang = req.query.lang || "en";
    
    if (!text) {
      return res.status(400).send("Text is required");
    }

    try {
      const fetchTTSChunk = (chunk, chunkLang) => {
        return new Promise((resolve, reject) => {
          const targetUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(chunk)}&tl=${chunkLang}&client=tw-ob`;
          https.get(targetUrl, (proxyRes) => {
            if (proxyRes.statusCode !== 200) {
              return reject(new Error(`Google TTS failed with status ${proxyRes.statusCode}`));
            }
            const data = [];
            proxyRes.on("data", c => data.push(c));
            proxyRes.on("end", () => resolve(Buffer.concat(data)));
          }).on("error", reject);
        });
      };

      const chunks = [];
      let currentChunk = "";
      const words = text.split(" ");
      for (const word of words) {
        if (currentChunk.length + word.length > 150) {
          chunks.push(currentChunk);
          currentChunk = word + " ";
        } else {
          currentChunk += word + " ";
        }
      }
      if (currentChunk) chunks.push(currentChunk);
      
      const buffers = [];
      for (const chunk of chunks) {
         buffers.push(await fetchTTSChunk(chunk.trim(), lang));
      }
      
      const combined = Buffer.concat(buffers);
      res.writeHead(200, {
        "Content-Type": "audio/mpeg",
        "Content-Length": combined.length,
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      });
      res.end(combined);
    } catch (e) {
      console.error("TTS Proxy Error:", e);
      res.status(500).send("Error generating TTS");
    }
  });
  app.get("/api/translate", (req, res) => {
    const text = req.query.text as string;
    const targetLang = (req.query.tl as string) || "en";
    const sourceLang = (req.query.sl as string) || "auto";

    if (!text) {
      return res.status(400).send("Text is required");
    }

    const targetUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;

    https.get(targetUrl, (proxyRes) => {
      let data = '';
      proxyRes.on('data', chunk => {
        data += chunk;
      });
      proxyRes.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          let translatedText = '';
          if (parsed && parsed[0]) {
            parsed[0].forEach((item: any) => {
              if (item && item[0]) {
                translatedText += item[0];
              }
            });
          }
          res.json({ translation: translatedText });
        } catch (e) {
          console.error("Translation parsing error:", e);
          res.status(500).send("Error parsing translation");
        }
      });
    }).on('error', (err) => {
      console.error('Translation Proxy Error:', err);
      res.status(500).send("Error translating text");
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
