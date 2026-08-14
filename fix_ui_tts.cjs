const fs = require('fs');

function replaceTTS(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/\/api\/tts\?text=/g, "${voiceConfig?.category === 'Gemini' ? '/api/gemini-tts' : '/api/tts'}?text=");
  fs.writeFileSync(file, content);
}

replaceTTS('src/components/ExportButton.tsx');
replaceTTS('src/components/TTSModal.tsx');
replaceTTS('src/App.tsx');
