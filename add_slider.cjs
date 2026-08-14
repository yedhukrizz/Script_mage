const fs = require('fs');
let content = fs.readFileSync('src/components/TextGallery.tsx', 'utf8');

if (!content.includes('import { ThickSlider }')) {
  content = content.replace("import { CustomSelect } from './CustomSelect';", "import { CustomSelect } from './CustomSelect';\nimport { ThickSlider } from './ThickSlider';");
}

if (!content.includes('globalTextScale = useStore')) {
  content = content.replace(
    "const updateElement = useStore((state) => state.updateElement);",
    "const updateElement = useStore((state) => state.updateElement);\n  const globalTextScale = useStore((state) => state.globalTextScale);\n  const setGlobalTextScale = useStore((state) => state.setGlobalTextScale);"
  );
}

const newBulkPanel = `        {/* Global Scale */}
        <div className="flex-1 min-w-[200px] px-4 py-2 border-l border-panel-border flex flex-col justify-center">
          <span className="text-[10px] text-text-muted opacity-80 font-bold uppercase tracking-wider mb-2">Global Size</span>
          <ThickSlider 
             label="Global Scale"
             value={globalTextScale}
             min={0.1}
             max={3}
             step={0.05}
             onChange={setGlobalTextScale}
             unit="x"
          />
        </div>
        <div className="hidden lg:block w-px bg-button-bg my-2" />`;

if (!content.includes('Global Size')) {
  content = content.replace(
    `<div className="hidden lg:block w-px bg-button-bg my-2" />`,
    `<div className="hidden lg:block w-px bg-button-bg my-2" />\n${newBulkPanel}`
  );
}

fs.writeFileSync('src/components/TextGallery.tsx', content);
