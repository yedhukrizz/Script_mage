const fs = require('fs');
let content = fs.readFileSync('src/components/TextGallery.tsx', 'utf8');

const stateOld = `  const [bulkFont, setBulkFont] = useState<string>('');
  const [bulkColor, setBulkColor] = useState<string>('');
  const [bulkEffect, setBulkEffect] = useState<string>('');`;

const stateNew = `  const [bulkFont, setBulkFont] = useState<string>('');
  const [bulkColor, setBulkColor] = useState<string>('');
  const [bulkEffect, setBulkEffect] = useState<string>('');
  const [bulkEffect2, setBulkEffect2] = useState<string>('');
  const [bulkEffect3, setBulkEffect3] = useState<string>('');`;

content = content.replace(stateOld, stateNew);

const applyOld = `    if (!bulkFont && !bulkColor && !bulkEffect) {
      addToast('Select at least one property to apply', 'info');
      return;
    }
    
    textElements.forEach(el => {
      const updates: any = {};
      if (bulkFont) updates.fontFamily = bulkFont;
      if (bulkColor) updates.color = bulkColor;
      if (bulkEffect) updates.textEffect = bulkEffect;
      updateElement(el.id, updates);
    });`;

const applyNew = `    if (!bulkFont && !bulkColor && !bulkEffect && !bulkEffect2 && !bulkEffect3) {
      addToast('Select at least one property to apply', 'info');
      return;
    }
    
    textElements.forEach(el => {
      const updates: any = {};
      if (bulkFont) updates.fontFamily = bulkFont;
      if (bulkColor) updates.color = bulkColor;
      if (bulkEffect) updates.textEffect = bulkEffect;
      if (bulkEffect2) updates.textEffect2 = bulkEffect2;
      if (bulkEffect3) updates.textEffect3 = bulkEffect3;
      updateElement(el.id, updates);
    });`;

content = content.replace(applyOld, applyNew);

const bulkSelectOld = `          <div className="flex-1 min-w-[200px] px-2 py-1 flex flex-col justify-center">
            <span className="text-[10px] text-text-muted opacity-80 font-bold uppercase tracking-wider mb-1">Target Effect</span>
            <CustomSelect 
              value={bulkEffect || 'unchanged'}
              onChange={(val) => setBulkEffect(val === 'unchanged' ? '' : val)}
              options={[
                { value: 'unchanged', label: '— Unchanged —' },
                ...EFFECTS
              ]}
            />
          </div>`;

const bulkSelectNew = `          <div className="flex-1 min-w-[150px] px-2 py-1 flex flex-col justify-center">
            <span className="text-[10px] text-text-muted opacity-80 font-bold uppercase tracking-wider mb-1">Target Effect 1</span>
            <CustomSelect 
              value={bulkEffect || 'unchanged'}
              onChange={(val) => setBulkEffect(val === 'unchanged' ? '' : val)}
              options={[{ value: 'unchanged', label: '— Unchanged —' }, ...EFFECTS]}
            />
            <span className="text-[10px] text-text-muted opacity-80 font-bold uppercase tracking-wider mt-2 mb-1">Target Effect 2</span>
            <CustomSelect 
              value={bulkEffect2 || 'unchanged'}
              onChange={(val) => setBulkEffect2(val === 'unchanged' ? '' : val)}
              options={[{ value: 'unchanged', label: '— Unchanged —' }, ...EFFECTS]}
            />
            <span className="text-[10px] text-text-muted opacity-80 font-bold uppercase tracking-wider mt-2 mb-1">Target Effect 3</span>
            <CustomSelect 
              value={bulkEffect3 || 'unchanged'}
              onChange={(val) => setBulkEffect3(val === 'unchanged' ? '' : val)}
              options={[{ value: 'unchanged', label: '— Unchanged —' }, ...EFFECTS]}
            />
          </div>`;

content = content.replace(bulkSelectOld, bulkSelectNew);

const individualSelectOld = `                   <div className="flex flex-col gap-1">
                     <span className="text-[10px] text-text-muted uppercase font-semibold flex items-center gap-1"><Sparkles size={10}/> Effect</span>
                     <CustomSelect 
                       value={el.textEffect || 'none'}
                       onChange={(val) => updateElement(el.id, { textEffect: val })}
                       options={EFFECTS}
                     />
                   </div>`;

const individualSelectNew = `                   <div className="flex flex-col gap-1">
                     <span className="text-[10px] text-text-muted uppercase font-semibold flex items-center gap-1"><Sparkles size={10}/> Effect 1</span>
                     <CustomSelect 
                       value={el.textEffect || 'none'}
                       onChange={(val) => updateElement(el.id, { textEffect: val })}
                       options={EFFECTS}
                     />
                     <span className="text-[10px] text-text-muted uppercase font-semibold flex items-center gap-1 mt-1"><Sparkles size={10}/> Effect 2</span>
                     <CustomSelect 
                       value={el.textEffect2 || 'none'}
                       onChange={(val) => updateElement(el.id, { textEffect2: val })}
                       options={EFFECTS}
                     />
                     <span className="text-[10px] text-text-muted uppercase font-semibold flex items-center gap-1 mt-1"><Sparkles size={10}/> Effect 3</span>
                     <CustomSelect 
                       value={el.textEffect3 || 'none'}
                       onChange={(val) => updateElement(el.id, { textEffect3: val })}
                       options={EFFECTS}
                     />
                   </div>`;

content = content.replace(individualSelectOld, individualSelectNew);

fs.writeFileSync('src/components/TextGallery.tsx', content);
