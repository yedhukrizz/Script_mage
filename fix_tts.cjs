const fs = require('fs');
let content = fs.readFileSync('src/components/TTSModal.tsx', 'utf8');

content = content.replace(/if \(!res\.ok\) \{\s*const errText = await res\.text\(\);\s*if \(errText\.includes\('API key not valid'\)\) \{\s*addToast\('Invalid Gemini API Key! Please check your Settings.', 'error'\);\s*\}\s*throw new Error\('Failed to fetch audio: ' \+ errText\);\s*\}/g, `if (!res.ok) {
        const errText = await res.text();
        if (errText.includes('API key not valid') || errText.includes('API_KEY_INVALID')) {
            throw new Error('Invalid Gemini API Key! Please check your Settings.');
        }
        throw new Error('Failed to fetch audio: ' + errText);
      }`);

fs.writeFileSync('src/components/TTSModal.tsx', content);
