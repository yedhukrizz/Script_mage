const fs = require('fs');
let content = fs.readFileSync('src/components/Toolbar.tsx', 'utf8');

const easings = {
  'linear': 'Linear',
  'ease-in': 'Ease In',
  'ease-out': 'Ease Out',
  'ease-in-out': 'Ease In Out'
};
const animations = [
  { value: 'none', label: 'None' },
  { value: 'fade', label: 'Fade' },
  { value: 'slide', label: 'Slide' },
  { value: 'scale', label: 'Scale' },
  { value: 'fade-slide', label: 'Fade & Slide' },
  { value: 'fade-slide-up', label: 'Fade & Slide Up' },
  { value: 'zoom-in', label: 'Zoom In' },
  { value: 'fade-zoom-in', label: 'Fade & Zoom In' },
  { value: 'fade-zoom-out', label: 'Fade & Zoom Out' },
  { value: 'typewriter', label: 'Write Out (Typewriter)' },
  { value: 'fly-in', label: 'Fly In (Bounce)' }
];
const textEffects = [
  { value: 'none', label: 'None' },
  { value: 'write-on', label: 'Write On (Typewriter)' },
  { value: 'fade-words', label: 'Appearing Words' },
  { value: 'fly-words', label: 'Flying Words' },
  { value: 'zoom-words', label: 'Zooming Words' },
  { value: 'shiver', label: 'Shiver (Continuous)' },
  { value: 'flicker', label: 'Flicker (Continuous)' },
  { value: 'bloom', label: 'Bloom (Continuous)' },
  { value: 'neon', label: 'Neon Glow (Continuous)' },
  { value: 'glitch', label: 'Glitch (Continuous)' }
];
const mediaEffects = [
  { value: 'none', label: 'None' },
  { value: 'parallax-zoom-in', label: 'Parallax Zoom In' },
  { value: 'parallax-zoom-out', label: 'Parallax Zoom Out' }
];
const easingOptions = Object.entries(easings).map(([k,v])=>({value:k, label:v}));

const newContent = `
          {['defaultText', 'defaultImage', 'defaultShape', 'defaultPlaceholder'].includes(activeSubMenu) && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-text-muted uppercase font-semibold mb-1">In Animation</label>
                <CustomSelect 
                  value={defaults[activeSubMenu.replace('default', '').toLowerCase()]?.animationIn || 'none'} 
                  onChange={(val) => updateDefaults(activeSubMenu.replace('default', '').toLowerCase() as any, { animationIn: val })}
                  options={[
                    { value: 'none', label: 'None' },
                    { value: 'fade', label: 'Fade' },
                    { value: 'slide', label: 'Slide' },
                    { value: 'scale', label: 'Scale' },
                    { value: 'fade-slide', label: 'Fade & Slide' },
                    { value: 'fade-slide-up', label: 'Fade & Slide Up' },
                    { value: 'zoom-in', label: 'Zoom In' },
                    { value: 'fade-zoom-in', label: 'Fade & Zoom In' },
                    { value: 'fade-zoom-out', label: 'Fade & Zoom Out' },
                    ...(activeSubMenu === 'defaultText' ? [{ value: 'typewriter', label: 'Write Out (Typewriter)' }, { value: 'fly-in', label: 'Fly In (Bounce)' }] : [])
                  ]}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-text-muted uppercase font-semibold mb-1">Out Animation</label>
                <CustomSelect 
                  value={defaults[activeSubMenu.replace('default', '').toLowerCase()]?.animationOut || 'none'} 
                  onChange={(val) => updateDefaults(activeSubMenu.replace('default', '').toLowerCase() as any, { animationOut: val })}
                  options={[
                    { value: 'none', label: 'None' },
                    { value: 'fade', label: 'Fade' },
                    { value: 'slide', label: 'Slide' },
                    { value: 'scale', label: 'Scale' },
                    { value: 'fade-slide', label: 'Fade & Slide' },
                    { value: 'fade-slide-up', label: 'Fade & Slide Up' },
                    { value: 'zoom-out', label: 'Zoom Out' },
                    { value: 'fade-zoom-in', label: 'Fade & Zoom In' },
                    { value: 'fade-zoom-out', label: 'Fade & Zoom Out' }
                  ]}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-text-muted uppercase font-semibold mb-1">Easing</label>
                <CustomSelect 
                  value={defaults[activeSubMenu.replace('default', '').toLowerCase()]?.easing || 'linear'} 
                  onChange={(val) => updateDefaults(activeSubMenu.replace('default', '').toLowerCase() as any, { easing: val })}
                  options={[
                    { value: 'linear', label: 'Linear' },
                    { value: 'ease-in', label: 'Ease In' },
                    { value: 'ease-out', label: 'Ease Out' },
                    { value: 'ease-in-out', label: 'Ease In Out' }
                  ]}
                />
              </div>
              {activeSubMenu === 'defaultText' && (
                <>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-text-muted uppercase font-semibold mb-1">Font Family</label>
                    <CustomSelect 
                      value={defaults.text?.fontFamily || 'Inter'} 
                      onChange={(val) => updateDefaults('text', { fontFamily: val })}
                      options={STANDARD_FONTS.map(f => ({ value: f, label: f }))}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-text-muted uppercase font-semibold mb-1">Default Text Effect</label>
                    <CustomSelect 
                      value={defaults.text?.textEffect || 'none'} 
                      onChange={(val) => updateDefaults('text', { textEffect: val })}
                      options={[
                        { value: 'none', label: 'None' },
                        { value: 'write-on', label: 'Write On (Typewriter)' },
                        { value: 'fade-words', label: 'Appearing Words' },
                        { value: 'fly-words', label: 'Flying Words' },
                        { value: 'zoom-words', label: 'Zooming Words' },
                        { value: 'shiver', label: 'Shiver (Continuous)' },
                        { value: 'flicker', label: 'Flicker (Continuous)' },
                        { value: 'bloom', label: 'Bloom (Continuous)' },
                        { value: 'neon', label: 'Neon Glow (Continuous)' },
                        { value: 'glitch', label: 'Glitch (Continuous)' }
                      ]}
                    />
                  </div>
                </>
              )}
              {(activeSubMenu === 'defaultImage' || activeSubMenu === 'defaultShape' || activeSubMenu === 'defaultPlaceholder') && (
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] text-text-muted uppercase font-semibold mb-1">Continuous Effect</label>
                  <CustomSelect 
                    value={defaults[activeSubMenu.replace('default', '').toLowerCase()]?.mediaEffect || 'none'} 
                    onChange={(val) => updateDefaults(activeSubMenu.replace('default', '').toLowerCase() as any, { mediaEffect: val })}
                    options={[
                      { value: 'none', label: 'None' },
                      { value: 'parallax-zoom-in', label: 'Parallax Zoom In' },
                      { value: 'parallax-zoom-out', label: 'Parallax Zoom Out' }
                    ]}
                  />
                </div>
              )}
            </div>
          )}
`;

const target = "{activeSubMenu === 'settings' && (";

if (content.includes(target) && !content.includes("['defaultText', 'defaultImage', 'defaultShape', 'defaultPlaceholder'].includes(activeSubMenu)")) {
  content = content.replace(target, newContent + "\n          " + target);
  fs.writeFileSync('src/components/Toolbar.tsx', content);
  console.log("Submenus injected.");
}
