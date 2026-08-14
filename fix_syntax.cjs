const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');
content = content.replace(/res\.status\(400\)\.send\(e\.message \|\| "Error generating voice"\);\n    \}\);\n  app\.get\("\/api\/tts"/g, `res.status(400).send(e.message || "Error generating voice");\n    }\n  });\n  app.get("/api/tts"`);
if(content.includes('res.status(400).send(e.message || "Error generating voice");\n    });')) {
  console.log("Found another variation!");
  content = content.replace(/res\.status\(400\)\.send\(e\.message \|\| "Error generating voice"\);\n    \}\);/g, `res.status(400).send(e.message || "Error generating voice");\n    }\n  });`);
}
fs.writeFileSync('server.ts', content);
