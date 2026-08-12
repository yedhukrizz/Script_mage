const fs = require('fs');
let file = 'src/components/Toolbar.tsx';
let content = fs.readFileSync(file, 'utf8');

// Find the start of motion.div
const motionStart = content.indexOf('<motion.div \n              initial={{ opacity: 0, scale: 0.9, y: 20 }}');
if (motionStart === -1) {
  console.log("Could not find motion div");
  process.exit(1);
}

// Replace the parent className
content = content.replace(
  `className="bg-panel-bg/95 backdrop-blur-xl border border-panel-border p-3 rounded-[24px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] max-h-[85vh] overflow-y-auto custom-scrollbar w-[320px] sm:w-[360px] select-none"`,
  `className="bg-panel-bg/95 backdrop-blur-xl border border-panel-border rounded-[24px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] flex flex-col max-h-[85vh] w-[320px] sm:w-[360px] select-none overflow-hidden"`
);

// We need to group the activeSubMenu headers and MAIN MENU VIEW headers outside the scroll area,
// and wrap the rest in a scrollable div.
