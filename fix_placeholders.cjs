const fs = require('fs');
let content = fs.readFileSync('src/components/PlaceholderGallery.tsx', 'utf8');

content = content.replace(/if \(!res\.ok\) \{\s*throw new Error\(await res\.text\(\)\);\s*\}/, `if (!res.ok) {
        const errText = await res.text();
        if (errText.includes('API key not valid') || errText.includes('API_KEY_INVALID')) {
           throw new Error('Invalid Gemini API Key! Please check your Settings.');
        }
        throw new Error(errText);
      }`);

fs.writeFileSync('src/components/PlaceholderGallery.tsx', content);
