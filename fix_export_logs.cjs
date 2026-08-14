const fs = require('fs');
let content = fs.readFileSync('src/components/ExportButton.tsx', 'utf8');

content = content.replace("setExportLogs(prev => [...prev, `> Setting up hidden canvas context (${targetWidth}x${targetHeight})...`]);", 
"setExportLogs(prev => [...prev, `> Setting up hidden canvas context...`, `> Resolution: ${targetWidth}x${targetHeight}`, `> Framerate: ${fps} fps`]);");

content = content.replace("setExportLogs(prev => [...prev, '> Targeting render canvas for frame extraction...']);", 
"setExportLogs(prev => [...prev, '> Targeting render canvas for frame extraction...', `> Processing ${elements.length} timeline elements...`]);");

content = content.replace("setExportLogs(prev => [...prev, `> Rendered frame ${i} of ${totalFrames}`]);",
"const pct = Math.round((i / totalFrames) * 100);\n          setExportLogs(prev => [...prev, `> Rendered frame ${i}/${totalFrames} (${pct}%) - Size: ${targetWidth}x${targetHeight}`]);");

fs.writeFileSync('src/components/ExportButton.tsx', content);
