const fs = require('fs');
let content = fs.readFileSync('src/components/TextGallery.tsx', 'utf8');

// replace motion.div wrapper
content = content.replace(
`    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-[150] flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-panel w-full max-w-5xl max-h-[85vh] flex flex-col rounded-[24px] overflow-hidden relative shadow-2xl"
      >`,
`    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 bg-panel-bg z-[100] flex flex-col overflow-hidden pointer-events-auto"
    >`
);

content = content.replace(
`      </motion.div>
    </motion.div>`,
`    </motion.div>`
);

fs.writeFileSync('src/components/TextGallery.tsx', content);
