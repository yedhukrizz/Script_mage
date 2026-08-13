const fs = require('fs');

let file = 'src/components/TextGallery.tsx';
let content = fs.readFileSync(file, 'utf8');

const bulkStartStr = '{showBulkEdit && (';
const listStartStr = '{/* List */}\n      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">';

let p1 = content.indexOf(bulkStartStr);
let p2 = content.indexOf(listStartStr);
if (p1 !== -1 && p2 !== -1 && p1 < p2) {
  let bulkEditCode = content.substring(p1, p2);
  
  // Clean up the formatting and remove the fixed height constraints from the bulk edit div
  bulkEditCode = bulkEditCode.replace(
    'shrink-0 border-b border-panel-border bg-app-bg px-6 py-6 flex flex-col items-center z-20 relative overflow-y-auto max-h-[40vh] custom-scrollbar',
    'border border-panel-border bg-button-bg/30 px-6 py-6 flex flex-col items-center z-20 relative rounded-2xl mb-6 shadow-inner'
  );

  content = content.substring(0, p1) + 
            listStartStr + '\n        ' + 
            bulkEditCode +
            content.substring(p2 + listStartStr.length);
            
  fs.writeFileSync(file, content);
  console.log("TextGallery updated!");
} else {
  console.log("Positions not found");
}
