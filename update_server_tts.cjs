const fs = require('fs');

let content = fs.readFileSync('server.ts', 'utf8');

const ttsRouteRegex = /app\.get\("\/api\/tts", \(req, res\) => \{[\s\S]*?\}\);\n/m;

const newTTSRoute = `  app.get("/api/tts", async (req, res) => {
    const text = req.query.text;
    const lang = req.query.lang || "en";
    
    if (!text) {
      return res.status(400).send("Text is required");
    }

    try {
      const fetchTTSChunk = (chunk, chunkLang) => {
        return new Promise((resolve, reject) => {
          const targetUrl = \`https://translate.google.com/translate_tts?ie=UTF-8&q=\${encodeURIComponent(chunk)}&tl=\${chunkLang}&client=tw-ob\`;
          https.get(targetUrl, (proxyRes) => {
            if (proxyRes.statusCode !== 200) {
              return reject(new Error(\`Google TTS failed with status \${proxyRes.statusCode}\`));
            }
            const data = [];
            proxyRes.on('data', c => data.push(c));
            proxyRes.on('end', () => resolve(Buffer.concat(data)));
          }).on('error', reject);
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
        'Content-Type': 'audio/mpeg',
        'Content-Length': combined.length,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      res.end(combined);
    } catch (e) {
      console.error('TTS Proxy Error:', e);
      res.status(500).send("Error generating TTS");
    }
  });\n`;

content = content.replace(ttsRouteRegex, newTTSRoute);

fs.writeFileSync('server.ts', content);
