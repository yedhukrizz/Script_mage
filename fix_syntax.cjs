const fs = require('fs');
let file = 'src/components/PlaceholderGallery.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(`    function handleClickOutside(event: MouseEvent) {
      if (enhancersMenuRef.current && !enhancersMenuRef.current.contains(event.target as Node)) {
        setShowEnhancersMenu(false);
      }
      if (bulkMenuRef.current && !bulkMenuRef.current.contains(event.target as Node)) {
        setShowBulkMenu(false);
      }
      }
    }`, `    function handleClickOutside(event: MouseEvent) {
      if (enhancersMenuRef.current && !enhancersMenuRef.current.contains(event.target as Node)) {
        setShowEnhancersMenu(false);
      }
      if (bulkMenuRef.current && !bulkMenuRef.current.contains(event.target as Node)) {
        setShowBulkMenu(false);
      }
    }`);

fs.writeFileSync(file, content);
