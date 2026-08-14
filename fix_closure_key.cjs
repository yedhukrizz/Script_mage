const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// replace geminiApiKey inside the audioUrl construction with useStore.getState().geminiApiKey
content = content.replace(/geminiApiKey \? '&apiKey=' \+ encodeURIComponent\(geminiApiKey\) : ''/g, "(useStore.getState().geminiApiKey ? '&apiKey=' + encodeURIComponent(useStore.getState().geminiApiKey) : '')");

fs.writeFileSync('src/App.tsx', content);

let contentExport = fs.readFileSync('src/components/ExportButton.tsx', 'utf8');
contentExport = contentExport.replace(/geminiApiKey \? '&apiKey=' \+ encodeURIComponent\(geminiApiKey\) : ''/g, "(useStore.getState().geminiApiKey ? '&apiKey=' + encodeURIComponent(useStore.getState().geminiApiKey) : '')");
fs.writeFileSync('src/components/ExportButton.tsx', contentExport);
