const fs = require('fs');
let file = 'src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('const timelineMinimized = useStore((state) => state.timelineMinimized);')) {
  content = content.replace(/const timelineExpanded = useStore\(\(state\) => state\.timelineExpanded\);/, 
    'const timelineExpanded = useStore((state) => state.timelineExpanded);\n  const timelineMinimized = useStore((state) => state.timelineMinimized);');
}

content = content.replace(/timelineExpanded \? 'hidden' : 'max-h-\[65vh\] sm:max-h-\[50vh\]'/,
  "timelineExpanded ? 'hidden' : timelineMinimized ? 'max-h-[48px]' : 'max-h-[65vh] sm:max-h-[50vh]'");

fs.writeFileSync(file, content);
