const fs = require('fs');
let content = fs.readFileSync('src/components/ExportButton.tsx', 'utf8');
content = content.replace("import { Share, Download,", "import { Upload, Share, Download,");
content = content.replace("<Share size={iconSize} />", "<Upload size={iconSize} />");
fs.writeFileSync('src/components/ExportButton.tsx', content);
