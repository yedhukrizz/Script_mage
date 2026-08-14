const fs = require('fs');

let content = fs.readFileSync('server.ts', 'utf8');

const ttsRouteOld = /try \{\s*const ai = new GoogleGenAI\(\{\s*apiKey: key,\s*httpOptions: \{\s*headers: \{ 'User-Agent': 'aistudio-build' \}\s*\}\s*\}\);\s*const response = await ai\.models\.generateContent\(\{[\s\S]*?res\.status\(500\)\.send\(e\.message \|\| "Error generating voice"\);\s*\}\s*\}/m;

const ttsRouteNew = `    try {
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
            console.log("User API key invalid, falling back to server key...");
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
    }`;

content = content.replace(ttsRouteOld, ttsRouteNew);
fs.writeFileSync('server.ts', content);
