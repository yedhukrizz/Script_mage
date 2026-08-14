const fs = require('fs');
let content = fs.readFileSync('src/components/ExportButton.tsx', 'utf8');

content = content.replace(
  "import { Download, Loader2, Film } from 'lucide-react';",
  "import { Download, Loader2, Film, Settings, X } from 'lucide-react';"
);

fs.writeFileSync('src/components/ExportButton.tsx', content);
