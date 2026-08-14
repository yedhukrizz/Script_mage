const fs = require('fs');

let props = fs.readFileSync('src/components/PropertiesPanel.tsx', 'utf8');

// Insert the import
if (!props.includes('import { XYPad }')) {
  props = props.replace(
    "import { TTSModal } from './TTSModal';",
    "import { TTSModal } from './TTSModal';\nimport { XYPad } from './XYPad';"
  );
}

// Replace the X/Y sliders for text with XYPad
// Wait, the user specifically requested it "on the text property where the x and y is there make it as a small track pad that appear above the timeline so the screen is seen."
// Also we need to ensure the pill appears in the right place.

props = props.replace(
  `{activeTab === 'transform' && (
              <>
                {selectedElement.type !== 'audio' && (
                  <>
                    <ThickSlider label="X Position" value={selectedElement.x} min={0} max={1920} onChange={(v: number) => handleChange('x', v, true)} onChangeStart={handleStart} unit="px" />
                    <ThickSlider label="Y Position" value={selectedElement.y} min={0} max={1080} onChange={(v: number) => handleChange('y', v, true)} onChangeStart={handleStart} unit="px" />
                    <ThickSlider label="Width" value={selectedElement.width} min={10} max={1000} onChange={(v: number) => handleChange('width', v, true)} onChangeStart={handleStart} unit="px" />
                    <ThickSlider label="Height" value={selectedElement.height} min={10} max={1000} onChange={(v: number) => handleChange('height', v, true)} onChangeStart={handleStart} unit="px" />
                    <ThickSlider label="Rotation" value={selectedElement.rotation} min={-180} max={180} onChange={(v: number) => handleChange('rotation', v, true)} onChangeStart={handleStart} unit="°" />
                    <ThickSlider label="Opacity" value={selectedElement.opacity} min={0} max={1} step={0.01} onChange={(v: number) => handleChange('opacity', v, true)} onChangeStart={handleStart} />
                  </>`,
  `{activeTab === 'transform' && (
              <>
                {selectedElement.type !== 'audio' && (
                  <>
                    {selectedElement.type === 'text' ? (
                       <>
                         <XYPad element={selectedElement} />
                         <ThickSlider label="Opacity" value={selectedElement.opacity} min={0} max={1} step={0.01} onChange={(v: number) => handleChange('opacity', v, true)} onChangeStart={handleStart} />
                       </>
                    ) : (
                       <>
                         <ThickSlider label="X Position" value={selectedElement.x} min={0} max={1920} onChange={(v: number) => handleChange('x', v, true)} onChangeStart={handleStart} unit="px" />
                         <ThickSlider label="Y Position" value={selectedElement.y} min={0} max={1080} onChange={(v: number) => handleChange('y', v, true)} onChangeStart={handleStart} unit="px" />
                         <ThickSlider label="Width" value={selectedElement.width} min={10} max={1000} onChange={(v: number) => handleChange('width', v, true)} onChangeStart={handleStart} unit="px" />
                         <ThickSlider label="Height" value={selectedElement.height} min={10} max={1000} onChange={(v: number) => handleChange('height', v, true)} onChangeStart={handleStart} unit="px" />
                         <ThickSlider label="Rotation" value={selectedElement.rotation} min={-180} max={180} onChange={(v: number) => handleChange('rotation', v, true)} onChangeStart={handleStart} unit="°" />
                         <ThickSlider label="Opacity" value={selectedElement.opacity} min={0} max={1} step={0.01} onChange={(v: number) => handleChange('opacity', v, true)} onChangeStart={handleStart} />
                       </>
                    )}
                  </>`
);

fs.writeFileSync('src/components/PropertiesPanel.tsx', props);

