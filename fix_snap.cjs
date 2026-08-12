const fs = require('fs');
let file = 'src/components/Toolbar.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldSnap = `      if (currentTime < closestText.startTime || currentTime > closestText.endTime) {
        // Jump to center of the closest text element
        setCurrentTime(closestText.startTime + (closestText.endTime - closestText.startTime) / 2);
      }`;
      
const newSnap = `      // Jump to center of the closest text element
      setCurrentTime(closestText.startTime + (closestText.endTime - closestText.startTime) / 2);`;

content = content.replace(oldSnap, newSnap);

fs.writeFileSync(file, content);
