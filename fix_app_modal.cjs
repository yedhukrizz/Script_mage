const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');
app = app.replace(/className="fixed inset-0 bg-black\/60  z-\[100\] flex items-center justify-center p-4"/, 
  'className="fixed inset-0 bg-black/60 z-[150] flex items-center justify-center p-4"');
fs.writeFileSync('src/App.tsx', app);
