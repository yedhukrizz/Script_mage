const fs = require('fs');
let content = fs.readFileSync('src/components/ExportButton.tsx', 'utf8');
content = content.replace("import { Download,", "import { Share, Download,");
content = content.replace("<Download size={iconSize} />", "<Share size={iconSize} />");
fs.writeFileSync('src/components/ExportButton.tsx', content);
