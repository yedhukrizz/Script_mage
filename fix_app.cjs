const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/if \(!res\.ok\) \{\s*const errText = await res\.text\(\);\s*if \(errText\.includes\('API key not valid'\)\) \{\s*\/\/ Assuming addToast is available in scope or via store\s*if \(typeof addToast !== 'undefined'\) addToast\('Invalid Gemini API Key in Settings', 'error'\);\s*else if \(typeof useStore !== 'undefined'\) useStore\.getState\(\)\.addToast\('Invalid Gemini API Key in Settings', 'error'\);\s*\}\s*throw new Error\('TTS fetch failed: ' \+ errText\);\s*\}/,
`if (!res.ok) {
                        const errText = await res.text();
                        if (errText.includes('API key not valid') || errText.includes('API_KEY_INVALID')) {
                             if (typeof addToast !== 'undefined') addToast('Invalid Gemini API Key! Please check your Settings.', 'error');
                             else if (typeof useStore !== 'undefined') useStore.getState().addToast('Invalid Gemini API Key! Please check your Settings.', 'error');
                             throw new Error('Invalid Gemini API Key! Please check your Settings.');
                        }
                        throw new Error(errText);
                    }`);
fs.writeFileSync('src/App.tsx', content);
