const fs = require('fs');

let content = fs.readFileSync('src/components/ProjectMenu.tsx', 'utf8');

const oldMenuStr = `<div className="grid grid-cols-2 gap-1 w-full relative group/tools">
            <button 
              onClick={handleBackToProjects} 
              className="w-10 h-10 sm:w-12 sm:h-12 bg-button-bg text-text-main rounded-xl flex justify-center items-center hover:bg-button-hover hover:text-text-main transition-colors text-xs font-semibold" 
              title="Back to Projects"
            >
              <LayoutGrid size={20} />
            </button>
            <button 
              onClick={handleSaveToLocalStorage} 
              className="w-10 h-10 sm:w-12 sm:h-12 bg-button-bg text-text-main rounded-xl flex justify-center items-center hover:bg-button-hover hover:text-text-main transition-colors text-xs font-semibold" 
              title="Save Project"
            >
              <Save size={20} />
            </button>

            <label className="w-10 h-10 sm:w-12 sm:h-12 bg-button-bg text-text-main rounded-xl flex justify-center items-center hover:bg-button-hover hover:text-text-main transition-colors cursor-pointer" title="Import JSON">
               <Upload size={20} />
               <input type="file" accept=".json" className="hidden" onChange={handleImportJSON} />
            </label>
            <button 
              onClick={handleExportJSON} 
              className="w-10 h-10 sm:w-12 sm:h-12 bg-button-bg text-text-main rounded-xl flex justify-center items-center hover:bg-button-hover hover:text-text-main transition-colors text-xs font-semibold" 
              title="Export JSON"
            >
              <Download size={20} />
            </button>
            <button 
              onClick={() => {
                setShowAboutModal(true);
                setIsOpen(false);
              }} 
              className="col-span-2 w-full h-10 sm:h-12 bg-button-bg text-text-main rounded-xl flex justify-center items-center gap-2 hover:bg-button-hover hover:text-text-main transition-colors text-xs font-semibold uppercase tracking-wider" 
              title="About Script Mage"
            >
              <Info size={16} /> About
            </button>
          </div>`;

const newMenuStr = `<div className="flex flex-col gap-1.5 w-full relative group/tools">
            <button 
              onClick={handleBackToProjects} 
              className="w-full h-10 sm:h-12 px-3 bg-button-bg text-text-main rounded-xl flex items-center gap-3 hover:bg-button-hover hover:text-text-main transition-colors text-xs font-semibold" 
            >
              <LayoutGrid size={18} />
              <span>Projects</span>
            </button>
            <button 
              onClick={handleSaveToLocalStorage} 
              className="w-full h-10 sm:h-12 px-3 bg-button-bg text-text-main rounded-xl flex items-center gap-3 hover:bg-button-hover hover:text-text-main transition-colors text-xs font-semibold" 
            >
              <Save size={18} />
              <span>Save Project</span>
            </button>

            <label className="w-full h-10 sm:h-12 px-3 bg-button-bg text-text-main rounded-xl flex items-center gap-3 hover:bg-button-hover hover:text-text-main transition-colors cursor-pointer text-xs font-semibold m-0">
               <Upload size={18} />
               <span>Import JSON</span>
               <input type="file" accept=".json" className="hidden" onChange={handleImportJSON} />
            </label>
            <button 
              onClick={handleExportJSON} 
              className="w-full h-10 sm:h-12 px-3 bg-button-bg text-text-main rounded-xl flex items-center gap-3 hover:bg-button-hover hover:text-text-main transition-colors text-xs font-semibold" 
            >
              <Download size={18} />
              <span>Export JSON</span>
            </button>
            <button 
              onClick={() => {
                setShowAboutModal(true);
                setIsOpen(false);
              }} 
              className="w-full h-10 sm:h-12 px-3 bg-button-bg text-text-main rounded-xl flex items-center justify-center gap-2 hover:bg-button-hover hover:text-text-main transition-colors text-xs font-semibold uppercase tracking-wider mt-1 border border-panel-border/50" 
            >
              <Info size={16} /> <span>About Script Mage</span>
            </button>
          </div>`;

content = content.replace(oldMenuStr, newMenuStr);
// And also change the width of the dropdown to be less bulky but fit words
content = content.replace(/w-\[280px\]/, 'w-[200px]');

fs.writeFileSync('src/components/ProjectMenu.tsx', content);

