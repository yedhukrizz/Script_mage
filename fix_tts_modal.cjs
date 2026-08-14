const fs = require('fs');

let content = fs.readFileSync('src/components/TTSModal.tsx', 'utf8');

content = content.replace(/if \(\!res\.ok\) throw new Error\('Failed to fetch audio'\);/g, `if (!res.ok) {
        const errText = await res.text();
        if (errText.includes('API key not valid')) {
            addToast('Invalid Gemini API Key! Please check your Settings.', 'error');
        }
        throw new Error('Failed to fetch audio: ' + errText);
      }`);

fs.writeFileSync('src/components/TTSModal.tsx', content);
