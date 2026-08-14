const fs = require('fs');
let content = fs.readFileSync('src/components/Canvas.tsx', 'utf8');

const overlaysRegex = /\{gridOverlay !== 'none'[\s\S]*?\{postProcessingFx !== 'none'[\s\S]*?\}\)/;

let match = content.match(overlaysRegex);
if (match) {
    let overlays = match[0];
    
    // We will place overlays AFTER the elements (which have z-10).
    // Let's remove overlays from their current position.
    content = content.replace(overlays, '');
    
    // Change z-0 to z-20 in gridOverlay and keylight
    overlays = overlays.replace(/z-0/g, 'z-20');
    
    // Now place it after normalElements.
    content = content.replace(/(<div className="absolute inset-0 z-10 pointer-events-none">\s*\{normalElements\.map[\s\S]*?\}\s*<\/div>)/, `$1\n\n        ${overlays}`);
    
    fs.writeFileSync('src/components/Canvas.tsx', content);
    console.log("Replaced overlays in Canvas.tsx");
} else {
    console.log("Could not find overlays regex");
}
