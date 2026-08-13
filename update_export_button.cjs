const fs = require('fs');
let file = 'src/components/ExportButton.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add exportLogs state
content = content.replace(
  /const \[progress, setProgress\] = useState\(0\);/,
  'const [progress, setProgress] = useState(0);\n  const [exportLogs, setExportLogs] = useState<string[]>([]);\n  const scrollRef = React.useRef<HTMLDivElement>(null);'
);

// 2. Add scroll to bottom effect for logs
content = content.replace(
  /const handleExport = async \(\) => \{/,
  `React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [exportLogs]);

  const handleExport = async () => {`
);

// 3. Clear logs on start
content = content.replace(
  /setIsExporting\(true\);\n\s*setProgress\(0\);/,
  "setIsExporting(true);\n      setProgress(0);\n      setExportLogs(['> Initializing export pipeline...']);"
);

// 4. Add some intermediate logs
content = content.replace(
  /const renderCanvas = document.getElementById\('render-canvas'\);/,
  "setExportLogs(prev => [...prev, '> Targeting render canvas for frame extraction...']);\n      const renderCanvas = document.getElementById('render-canvas');"
);

content = content.replace(
  /const ctx = hiddenCanvas\.getContext\('2d', \{ willReadFrequently: true \}\);/,
  "setExportLogs(prev => [...prev, `> Setting up hidden canvas context (\${targetWidth}x\${targetHeight})...`]);\n      const ctx = hiddenCanvas.getContext('2d', { willReadFrequently: true });"
);

content = content.replace(
  /muxer \= new Muxer\(\{/,
  "setExportLogs(prev => [...prev, '> Initializing MP4 muxer...']);\n      muxer = new Muxer({"
);

content = content.replace(
  /let videoEncoder \= new VideoEncoder\(\{/,
  "setExportLogs(prev => [...prev, '> Configuring hardware/software video encoder...']);\n      let videoEncoder = new VideoEncoder({"
);

content = content.replace(
  /videoEncoder\.configure\(\{/,
  "setExportLogs(prev => [...prev, '> Video encoder configured. Starting frame generation...']);\n      videoEncoder.configure({"
);

content = content.replace(
  /setProgress\(i \/ totalFrames\);/g,
  `setProgress(i / totalFrames);
        if (i % 30 === 0) {
          setExportLogs(prev => [...prev, \`> Rendered frame \${i} of \${totalFrames}\`]);
        }`
);

content = content.replace(
  /await videoEncoder\.flush\(\);/g,
  `setExportLogs(prev => [...prev, '> Flushing remaining video frames...']);
      await videoEncoder.flush();`
);

content = content.replace(
  /muxer\.finalize\(\);/g,
  `setExportLogs(prev => [...prev, '> Finalizing MP4 container...']);
      muxer.finalize();`
);

content = content.replace(
  /const blob \= new Blob\(\[buffer\], \{ type: 'video\/mp4' \}\);/g,
  `setExportLogs(prev => [...prev, '> Creating video blob...']);
      const blob = new Blob([buffer], { type: 'video/mp4' });`
);

content = content.replace(
  /const url \= URL\.createObjectURL\(blob\);/g,
  `setExportLogs(prev => [...prev, '> Export complete. Triggering download...']);
      const url = URL.createObjectURL(blob);`
);

// 5. Render the logs UI inside the modal
const uiLogs = `              <div className="w-full bg-[var(--theme-input-bg)] rounded-full h-3 mb-2 overflow-hidden border border-panel-border">
                <div 
                  className="bg-[var(--color-accent)] h-full transition-all duration-300 ease-out rounded-full"
                  style={{ width: \`\${Math.round(progress * 100)}%\` }}
                />
              </div>
              <span className="text-sm font-semibold mb-4">{Math.round(progress * 100)}%</span>
              
              <div 
                ref={scrollRef}
                className="w-full h-32 bg-black/60 rounded-xl p-3 overflow-y-auto text-left flex flex-col gap-1 border border-panel-border/30 custom-scrollbar mt-2"
              >
                {exportLogs.map((log, i) => (
                  <span key={i} className="text-[10px] font-mono text-emerald-400 opacity-90 break-words leading-tight">
                    {log}
                  </span>
                ))}
              </div>`;

content = content.replace(
  /<div className="w-full bg-\[var\(--theme-input-bg\)\].*?<\/div>\s*<span.*?<\/span>/s,
  uiLogs
);

// We need to also fix modal dimensions for Export to fit the logs
content = content.replace(/max-w-sm rounded-\[32px\] flex flex-col p-8/, 'max-w-md rounded-[32px] flex flex-col p-6 sm:p-8');

fs.writeFileSync(file, content);
