const fs = require('fs');
let content = fs.readFileSync('src/components/TTSModal.tsx', 'utf8');

content = content.replace(/if \(res\.ok\) \{\s*const arrayBuffer = await res\.arrayBuffer\(\);\s*const audioCtx = new \(window\.AudioContext \|\| \(window as any\)\.webkitAudioContext\)\(\);\s*const audioBuffer = await audioCtx\.decodeAudioData\(arrayBuffer\);\s*const duration = \(audioBuffer\.duration \* 1000\) \+ timeBuffer;\s*addLog\(\`  -> Real duration: \$\{Math\.round\(duration\)\}ms\`\);\s*return duration;\s*\}/, 
`if (res.ok) {
          const arrayBuffer = await res.arrayBuffer();
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
          const duration = (audioBuffer.duration * 1000) + timeBuffer;
          addLog(\`  -> Real duration: \${Math.round(duration)}ms\`);
          return duration;
        } else {
          const err = await res.text();
          if (err.includes('API key not valid') || err.includes('API_KEY_INVALID')) {
             throw new Error('Invalid Gemini API Key! Please check your Settings.');
          }
          throw new Error(err);
        }`);
fs.writeFileSync('src/components/TTSModal.tsx', content);
