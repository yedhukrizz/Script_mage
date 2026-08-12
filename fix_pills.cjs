const fs = require('fs');
let file = 'src/components/Toolbar.tsx';
let content = fs.readFileSync(file, 'utf8');

// Update theme segment buttons
content = content.replace(/uiTheme === 'light' \? 'bg-white text-black shadow-sm' : 'text-text-muted hover:text-text-main hover:bg-button-hover'/g, 
  "uiTheme === 'light' ? 'bg-panel-bg text-text-main shadow-sm border border-panel-border' : 'text-text-muted hover:text-text-main hover:bg-button-hover'");

content = content.replace(/uiTheme === 'dark' \? 'bg-\[#27272a\] text-white shadow-sm border border-panel-border' : 'text-text-muted hover:text-text-main hover:bg-button-hover'/g, 
  "uiTheme === 'dark' ? 'bg-panel-bg text-text-main shadow-sm border border-panel-border' : 'text-text-muted hover:text-text-main hover:bg-button-hover'");

content = content.replace(/uiTheme === 'black' \? 'bg-black text-white shadow-sm border border-panel-border' : 'text-text-muted hover:text-text-main hover:bg-button-hover'/g, 
  "uiTheme === 'black' ? 'bg-panel-bg text-text-main shadow-sm border border-panel-border' : 'text-text-muted hover:text-text-main hover:bg-button-hover'");

fs.writeFileSync(file, content);
