const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const timelineOld = `<div className="flex-1 min-h-0 flex flex-col relative">
          <Timeline />
          <AnimatePresence>
            {showTextGallery && <TextGallery onClose={() => setShowTextGallery(false)} />}
            {showPlaceholderGallery && <PlaceholderGallery onClose={() => setShowPlaceholderGallery(false)} />}
          </AnimatePresence>
        </div>`;
const timelineNew = `<div className="flex-1 min-h-0 flex flex-col">
          <Timeline />
        </div>`;
content = content.replace(timelineOld, timelineNew);

const globalModalsOld = `{showGlobalTranslateModal && <TranslateModal onClose={() => setShowGlobalTranslateModal(false)} />}`;
const globalModalsNew = `{showGlobalTranslateModal && <TranslateModal onClose={() => setShowGlobalTranslateModal(false)} />}
        {showPlaceholderGallery && <PlaceholderGallery onClose={() => setShowPlaceholderGallery(false)} />}
        {showTextGallery && <TextGallery onClose={() => setShowTextGallery(false)} />}`;
content = content.replace(globalModalsOld, globalModalsNew);

fs.writeFileSync('src/App.tsx', content);
