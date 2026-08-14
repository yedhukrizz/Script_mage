const express = require('express');
const app = express();
app.get('/test-env', (req, res) => res.json({ key: process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 5) : 'NONE' }));
const server = app.listen(3004, async () => {
  const r = await fetch('http://localhost:3004/test-env');
  console.log(await r.text());
  server.close();
});
