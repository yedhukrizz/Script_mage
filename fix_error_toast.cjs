const fs = require('fs');

function updateFile(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Replace TTS fetch error handling to extract server message
  content = content.replace(/fetch\(audioUrl\)\.then\(res => \{\s*if \(\!res\.ok\) throw new Error\('TTS fetch failed'\);/g, `fetch(audioUrl).then(async res => {
                    if (!res.ok) {
                        const errText = await res.text();
                        if (errText.includes('API key not valid')) {
                             // Assuming addToast is available in scope or via store
                             if (typeof addToast !== 'undefined') addToast('Invalid Gemini API Key in Settings', 'error');
                             else if (typeof useStore !== 'undefined') useStore.getState().addToast('Invalid Gemini API Key in Settings', 'error');
                        }
                        throw new Error('TTS fetch failed: ' + errText);
                    }`);

  fs.writeFileSync(file, content);
}

updateFile('src/App.tsx');
