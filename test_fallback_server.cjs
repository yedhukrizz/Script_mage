const express = require('express');
const { GoogleGenAI, Modality } = require("@google/genai");

const app = express();
app.get('/test', async (req, res) => {
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
          console.log("SERVER KEY IS:", serverKey ? serverKey.substring(0,5) : null);
          if (serverKey && serverKey !== key) {
            console.log("User API key invalid, falling back to server key...");
            response = await doRequest(serverKey);
          } else {
            throw e;
          }
        } else {
          throw e;
        }
    }
    res.send("SUCCESS");
});

const server = app.listen(3005, async () => {
    try {
        const r = await fetch('http://localhost:3005/test');
        console.log(await r.text());
    } catch(e) {
        console.log("FETCH ERROR", e);
    }
    server.close();
});
