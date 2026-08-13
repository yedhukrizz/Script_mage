const fs = require('fs');
let file = 'src/components/Toolbar.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/\{isOpen && \(\s*<div className="fixed inset-0 z-\[140\]"/g, '{isOpen && (\n          <>\n          <div className="fixed inset-0 z-[140]"');

content = content.replace(/<\/div>\s*\}\)\s*\{\/\* Add Section \*\/\}/g, '</div>\n          </>\n        )}\n\n        {/* Add Section */}');

// Let's just use string replace for the end tag since I don't know exactly what comes after the </motion.div>
// Wait, the end tag is before </AnimatePresence>

content = content.replace(/<\/motion\.div>\s*<\/motion\.div>\s*\)\}\s*<\/AnimatePresence>/m, '</motion.div>\n            </motion.div>\n          </>\n        )}\n      </AnimatePresence>');

fs.writeFileSync(file, content);
