const express = require('express');
const app = express();
app.get('/test', (req, res) => {
  const apiKey = req.query.apiKey;
  const key = apiKey || 'SERVER_KEY';
  res.send(`apiKey: ${apiKey}, key: ${key}`);
});
const server = app.listen(3003, async () => {
  const res = await fetch('http://localhost:3003/test');
  console.log(await res.text());
  server.close();
});
