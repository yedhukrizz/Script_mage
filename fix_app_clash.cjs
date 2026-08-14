const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const propOld = `{selectedElementId && (
          <div className="absolute inset-0 pointer-events-none z-50 flex flex-col justify-end items-center pb-8">
            <div className="pointer-events-auto">
              <PropertiesPanel />
            </div>
          </div>
        )}`;

const propNew = `{selectedElementId && (
          <div className="absolute inset-0 pointer-events-none z-50 flex flex-col justify-end items-center pb-[100px] sm:pb-8">
            <div className="pointer-events-auto">
              <PropertiesPanel />
            </div>
          </div>
        )}`;

content = content.replace(propOld, propNew);
fs.writeFileSync('src/App.tsx', content);
