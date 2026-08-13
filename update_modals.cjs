const fs = require('fs');

// TEXT GALLERY
let textGallery = fs.readFileSync('src/components/TextGallery.tsx', 'utf8');

textGallery = textGallery.replace(
  /const \[bulkEffect, setBulkEffect\] = useState<string>\(''\);/,
  "const [bulkEffect, setBulkEffect] = useState<string>('');\n  const [showBulkEdit, setShowBulkEdit] = useState<boolean>(false);"
);

// Wrapper
textGallery = textGallery.replace(
  /<motion\.div \n\s*initial=\{\{ opacity: 0 \}\}\n\s*animate=\{\{ opacity: 1 \}\}\n\s*exit=\{\{ opacity: 0 \}\}\n\s*className="fixed inset-0 bg-black\/80  z-\[150\] flex flex-col"\n\s*>/,
  `<motion.div 
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
      >`
);

// End tags
textGallery = textGallery.replace(
  /<\/div>\n\s*<\/motion\.div>\n\s*\);\n\}/,
  `      </div>\n      </motion.div>\n    </motion.div>\n  );\n}`
);

// Header
textGallery = textGallery.replace(
  /<div className="shrink-0 border-b border-panel-border bg-app-bg px-6 py-4 flex items-center justify-between z-20">([\s\S]*?)<button \n\s*onClick=\{onClose\}\n\s*className="p-2 bg-button-bg hover:bg-button-hover text-text-muted hover:text-text-main rounded-xl transition-colors"\n\s*>\n\s*<X size=\{20\} \/>\n\s*<\/button>\n\s*<\/div>/,
  `<div className="shrink-0 border-b border-panel-border bg-panel-bg px-6 py-4 flex items-center justify-between z-20">$1<div className="flex items-center gap-2">
          <button
            onClick={() => setShowBulkEdit(!showBulkEdit)}
            className={\`px-4 py-2 text-sm font-semibold rounded-xl transition-all border \${showBulkEdit ? 'bg-[var(--color-accent)] text-white border-transparent' : 'bg-button-bg text-text-muted hover:text-text-main border-panel-border hover:bg-button-hover'}\`}
          >
            Bulk Edit
          </button>
          <button 
            onClick={onClose}
            className="p-2 bg-button-bg hover:bg-button-hover text-text-muted hover:text-text-main rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>`
);

// Bulk Edit Panel Toggle & Style
textGallery = textGallery.replace(
  /<div className="shrink-0 border-b border-panel-border bg-gradient-to-b from-\[#18181b\] to-black px-6 py-6 flex flex-col items-center z-20 shadow-2xl relative overflow-hidden">/,
  `{showBulkEdit && (
        <div className="shrink-0 border-b border-panel-border bg-app-bg px-6 py-6 flex flex-col items-center z-20 relative">`
);
textGallery = textGallery.replace(
  /\{showBulkEdit && \([\s\S]*?\{textElements\.length === 0 \? \(/,
  (match) => {
    // we just want to close the conditional wrap before the {/* List */} div
    return match.replace(/<\/div>\n\s*\{\/\* List \*\/\}/, '</div>\n      )}\n\n      {/* List */}');
  }
);
// Remove subtle background glow
textGallery = textGallery.replace(/<div className="absolute top-0 left-1\/2 -translate-x-1\/2 w-\[600px\] h-\[300px\] bg-transparent pointer-events-none rounded-full" \/>/, '');

fs.writeFileSync('src/components/TextGallery.tsx', textGallery);


// PLACEHOLDER GALLERY
let placeholderGallery = fs.readFileSync('src/components/PlaceholderGallery.tsx', 'utf8');

placeholderGallery = placeholderGallery.replace(
  /<motion\.div \n\s*initial=\{\{ opacity: 0 \}\}\n\s*animate=\{\{ opacity: 1 \}\}\n\s*exit=\{\{ opacity: 0 \}\}\n\s*transition=\{\{ duration: 0\.2 \}\}\n\s*className="fixed inset-0 bg-black\/90  flex flex-col z-\[150\]"\n\s*>/,
  `<motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
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
      >`
);

placeholderGallery = placeholderGallery.replace(
  /<\/div>\n\s*<\/motion\.div>\n\s*\);\n\}/,
  `      </div>\n      </motion.div>\n    </motion.div>\n  );\n}`
);

// Header bg color
placeholderGallery = placeholderGallery.replace(
  /bg-app-bg shrink-0 flex-wrap gap-4/,
  'bg-panel-bg shrink-0 flex-wrap gap-4'
);

fs.writeFileSync('src/components/PlaceholderGallery.tsx', placeholderGallery);

