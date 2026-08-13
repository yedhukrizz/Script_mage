const fs = require('fs');
let file = 'src/components/Toolbar.tsx';
let content = fs.readFileSync(file, 'utf8');

const replacement = `
          <div className="fixed inset-0 z-[140]" onClick={() => setIsOpen(false)} />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed right-4 sm:right-6 bottom-20 sm:bottom-24 z-[150] flex flex-col justify-end items-end origin-bottom-right"
          >
            <motion.div `;

content = content.replace(
  /<motion\.div \n\s*initial=\{\{ opacity: 0 \}\}\n\s*animate=\{\{ opacity: 1 \}\}\n\s*exit=\{\{ opacity: 0 \}\}\n\s*transition=\{\{ duration: 0\.2 \}\}\n\s*className=\{\`fixed right-4 sm:right-6 bottom-20 sm:bottom-24 z-\[150\] flex flex-col justify-end items-end origin-bottom-right transition-all duration-300 \$\{isDraggingSlider \? "bg-transparent " : "bg-transparent "\}\`\}\n\s*onClick=\{\(\) => setIsOpen\(false\)\}\n\s*>\n\s*<motion\.div /m,
  replacement
);

fs.writeFileSync(file, content);
