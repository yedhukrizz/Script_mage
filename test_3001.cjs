const express = require('express');
const { GoogleGenAI, Modality } = require("@google/genai");

const app = express();
app.get('/test', async (req, res) => {
    try {
      const doRequest = async (useKey) => {
        const ai = new GoogleGenAI({
          apiKey: useKey.trim(),
          httpOptions: {
            headers: { 'User-Agent': 'aistudio-build' }
          }
        });
        return await ai.models.generateContent({
          model: "gemini-3.1-flash-tts-preview",
          contents: [{ parts: [{ text: "Hello" }] }],
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: 'Kore' },
              },
            },
          },
        });
      };

      let key = "BAD_KEY";
      let response;
      try {
        response = await doRequest(key);
      } catch (e) {
        if (e.message && (e.message.includes('API key not valid') || e.message.includes('API_KEY_INVALID'))) {
          const serverKey = process.env.GEMINI_API_KEY;
          if (serverKey && serverKey !== key) {
            response = await doRequest(serverKey);
          } else {
            throw e;
          }
        } else {
          throw e;
        }
      }
      res.send("SUCCESS!");
    } catch (e) {
      res.status(400).send(e.message);
    }
});

const server = app.listen(3001, async () => {
    try {
        const r = await fetch('http://localhost:3001/test');
        console.log(await r.text());
    } catch(e) {
        console.log(e);
    }
    server.close();
});
