const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Remove from old location
content = content.replace(
  "{showPlaceholderGallery && <PlaceholderGallery onClose={() => setShowPlaceholderGallery(false)} />}",
  ""
);

// Add to new location
const timelineOld = `<div className="flex-1 min-h-0 flex flex-col relative">
          <Timeline />
          <AnimatePresence>
            {showTextGallery && <TextGallery onClose={() => setShowTextGallery(false)} />}
          </AnimatePresence>
        </div>`;

const timelineNew = `<div className="flex-1 min-h-0 flex flex-col relative">
          <Timeline />
          <AnimatePresence>
            {showTextGallery && <TextGallery onClose={() => setShowTextGallery(false)} />}
            {showPlaceholderGallery && <PlaceholderGallery onClose={() => setShowPlaceholderGallery(false)} />}
          </AnimatePresence>
        </div>`;

content = content.replace(timelineOld, timelineNew);

fs.writeFileSync('src/App.tsx', content);
