const express = require('express');
const app = express();
app.get('/test', (req, res) => {
    const apiKey = req.query.apiKey;
    const key = apiKey || 'DEFAULT_KEY';
    res.json({ apiKey: apiKey, key: key, typeOfApiKey: typeof apiKey });
});
const server = app.listen(3001, () => {
    fetch('http://localhost:3001/test?apiKey=undefined')
    .then(r => r.json())
    .then(data => { console.log("With apiKey=undefined:", data); })
    .then(() => fetch('http://localhost:3001/test?apiKey='))
    .then(r => r.json())
    .then(data => { console.log("With apiKey empty:", data); })
    .then(() => fetch('http://localhost:3001/test'))
    .then(r => r.json())
    .then(data => { console.log("Without apiKey:", data); server.close(); });
});
