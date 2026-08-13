const fs = require('fs');

let content = fs.readFileSync('src/components/Toolbar.tsx', 'utf8');

// 1. Fix the messed up header that has activeSubMenu === 'effect' nested inside the <span> title.
const headerRegex = /<span className="text-xs font-bold text-text-main capitalize">([\s\S]*?)<\/span>/;
const headerMatch = content.match(headerRegex);

if (headerMatch) {
  const newHeaderInner = `
                      {activeSubMenu === 'font' && 'Global Font'}
                      {activeSubMenu === 'effect' && 'Global Text Effect'}
                      {activeSubMenu === 'background' && 'Canvas Background'}
                      {activeSubMenu === 'export' && 'Export Video'}
                      {activeSubMenu === 'settings' && 'Settings'}
                      {activeSubMenu === 'defaultText' && 'Text Defaults'}
                      {activeSubMenu === 'defaultImage' && 'Image Defaults'}
                      {activeSubMenu === 'defaultShape' && 'Shape Defaults'}
                      {activeSubMenu === 'defaultPlaceholder' && 'Placeholder Defaults'}
                      {activeSubMenu === 'aspectRatio' && 'Aspect Ratio'}
                      {activeSubMenu === 'overlay' && 'Overlays'}
                      {activeSubMenu === 'speed' && 'Transition Settings'}
                      {activeSubMenu === 'prompts' && 'AI Scripts'}
`;
  content = content.replace(headerMatch[0], `<span className="text-xs font-bold text-text-main capitalize">${newHeaderInner}</span>`);
}

// 2. We need to move the `aspectRatio` that was placed OUTSIDE the scrollable area INTO the scrollable area.
const aspectRatioRegex = /{activeSubMenu === 'aspectRatio' && \([\s\S]*?\}\)[\s\n]*\}/;
const aspectRatioMatch = content.match(aspectRatioRegex);
if (aspectRatioMatch) {
  content = content.replace(aspectRatioMatch[0], ''); // Remove from outside
}

// 3. Now we inject unified implementations for all submenus inside the scrollable area!
// Wait, rather than parsing/replacing each one, we can replace all submenus inside the scrollable area.
