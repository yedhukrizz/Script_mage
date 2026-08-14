const fs = require('fs');
let content = fs.readFileSync('src/components/ExportButton.tsx', 'utf8');

// Add imports
if (!content.includes('CustomSelect')) {
  content = content.replace(/import { X, Film/g, "import { X, Film, Settings");
  content = content.replace(/import React, { useState } from 'react';/, "import React, { useState, useRef } from 'react';\nimport { CustomSelect } from './CustomSelect';");
}

// Add state variables
const stateInsertion = `
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [resolution, setResolution] = useState('1080p');
  const [fps, setFps] = useState(30);
  const cancelRef = useRef(false);
`;
content = content.replace('const [isExporting, setIsExporting] = useState(false);', stateInsertion + '\n  const [isExporting, setIsExporting] = useState(false);');

fs.writeFileSync('src/components/ExportButton.tsx', content);
