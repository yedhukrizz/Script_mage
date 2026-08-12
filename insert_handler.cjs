const fs = require('fs');
let file = 'src/components/Toolbar.tsx';
let content = fs.readFileSync(file, 'utf8');

const anchor = '  const filteredFonts = fontSearch ? allFonts.filter(f => f.toLowerCase().includes(fontSearch.toLowerCase())) : allFonts;';
const toAdd = `
  const handleSliderStart = () => {
    setIsDraggingSlider(true);
    
    // Snap to nearest text element in time
    const textElements = elements.filter(e => e.type === 'text' || e.type === 'caption');
    if (textElements.length > 0) {
      let closestText = textElements[0];
      let minDistance = Infinity;
      
      textElements.forEach(el => {
        let distance;
        if (currentTime >= el.startTime && currentTime <= el.endTime) {
           distance = 0;
        } else {
           distance = Math.min(Math.abs(currentTime - el.startTime), Math.abs(currentTime - el.endTime));
        }
        if (distance < minDistance) {
           minDistance = distance;
           closestText = el;
        }
      });
      
      if (currentTime < closestText.startTime || currentTime > closestText.endTime) {
        // Jump to center of the closest text element
        setCurrentTime(closestText.startTime + (closestText.endTime - closestText.startTime) / 2);
      }
    }
  };

  const handleSliderEnd = () => {
    setIsDraggingSlider(false);
  };
`;

if (!content.includes('const handleSliderStart')) {
  content = content.replace(anchor, anchor + "\n" + toAdd);
  fs.writeFileSync(file, content);
  console.log("Inserted handlers");
} else {
  console.log("Handlers already exist");
}
