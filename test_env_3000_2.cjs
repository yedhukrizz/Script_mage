const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');
content = content.replace('app.get("/api/check-env", (req, res) => { res.send(process.env.GEMINI_API_KEY ? "YES" : "NO"); });', 
  'app.get("/api/check-env", (req, res) => { res.send(process.env.GEMINI_API_KEY || "NONE"); });');
fs.writeFileSync('server.ts', content);
