const fs = require('fs');

function updateFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Add useStore().geminiApiKey logic
  if (!content.includes('const geminiApiKey = useStore')) {
    if (file.includes('ExportButton.tsx')) {
        content = content.replace(/const elements = useStore\(state => state\.elements\);/g, "const elements = useStore(state => state.elements);\n  const geminiApiKey = useStore(state => state.geminiApiKey);");
    } else if (file.includes('TTSModal.tsx')) {
        content = content.replace(/const updateElement = useStore\(\(state\) => state\.updateElement\);/g, "const updateElement = useStore((state) => state.updateElement);\n  const geminiApiKey = useStore(state => state.geminiApiKey);");
    } else if (file.includes('App.tsx')) {
        content = content.replace(/const elements = useStore\(\(state\) => state\.elements\);/g, "const elements = useStore((state) => state.elements);\n  const geminiApiKey = useStore(state => state.geminiApiKey);");
    }
  }

  // Add apiKey parameter to Gemini TTS
  content = content.replace(/\$\{voiceParam\}/g, "${voiceParam}${geminiApiKey ? '&apiKey=' + encodeURIComponent(geminiApiKey) : ''}");
  
  fs.writeFileSync(file, content);
}

updateFile('src/components/ExportButton.tsx');
updateFile('src/components/TTSModal.tsx');
updateFile('src/App.tsx');
