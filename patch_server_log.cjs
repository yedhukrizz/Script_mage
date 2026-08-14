const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');
content = content.replace('console.log("User API key invalid, falling back to server key...");', 
'console.log("User API key invalid, falling back to server key. Server key exists:", !!serverKey);');
fs.writeFileSync('server.ts', content);
