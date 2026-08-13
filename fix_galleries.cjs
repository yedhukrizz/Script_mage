const fs = require('fs');
['src/components/TextGallery.tsx', 'src/components/PlaceholderGallery.tsx'].forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/z-\[100\]/g, 'z-[150]');
  fs.writeFileSync(file, content);
});

// Also fix UnsavedModal in App.tsx (if it exists)
let app = fs.readFileSync('src/App.tsx', 'utf8');
app = app.replace(/className="fixed inset-0 bg-black\/80 flex items-center justify-center z-50  p-4"/, 
  'className="fixed inset-0 bg-black/80 flex items-center justify-center z-[150] p-4"');
fs.writeFileSync('src/App.tsx', app);
