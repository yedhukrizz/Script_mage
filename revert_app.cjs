const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');
app = app.replace(
  '<div className="absolute left-1/2 -translate-x-1/2 bottom-[240px] sm:bottom-[280px] pointer-events-none z-50 flex flex-col items-center justify-end overflow-y-visible hide-scrollbar">',
  '<div className="absolute top-24 sm:top-28 right-4 sm:right-6 bottom-[100px] sm:bottom-[120px] pointer-events-none z-50 flex flex-col items-end justify-center overflow-y-visible hide-scrollbar">'
);
fs.writeFileSync('src/App.tsx', app);
