const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

const oldPanel = `<div className="absolute inset-0 pointer-events-none z-50 flex flex-col justify-end items-center pb-[100px] sm:pb-8">
            <div className="pointer-events-auto">
              <PropertiesPanel />
            </div>
          </div>`;

const newPanel = `<div className="absolute top-16 sm:top-20 right-4 sm:right-6 bottom-[100px] sm:bottom-[120px] pointer-events-none z-50 flex flex-col items-end justify-start overflow-y-auto hide-scrollbar">
            <div className="pointer-events-auto">
              <PropertiesPanel />
            </div>
          </div>`;

app = app.replace(oldPanel, newPanel);
fs.writeFileSync('src/App.tsx', app);
