const fs = require('fs');
let content = fs.readFileSync('src/components/Toolbar.tsx', 'utf8');

const anchor = "import { ThickSlider } from './ThickSlider';";
const insert = "import { ThickSlider } from './ThickSlider';\nimport { CustomSelect } from './CustomSelect';";

if (content.includes(anchor) && !content.includes("import { CustomSelect }")) {
  content = content.replace(anchor, insert);
  fs.writeFileSync('src/components/Toolbar.tsx', content);
  console.log("Added CustomSelect import.");
}
