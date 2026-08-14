const fs = require('fs');
let content = fs.readFileSync('src/index.css', 'utf8');

content = content.replace(
  "text-shadow: 0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor;",
  "text-shadow: 0 0 10px var(--effect-color, currentColor), 0 0 20px var(--effect-color, currentColor), 0 0 30px var(--effect-color, currentColor);"
);

content = content.replace(
  "text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 20px currentColor, 0 0 40px currentColor, 0 0 80px currentColor;",
  "text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 20px var(--effect-color, currentColor), 0 0 40px var(--effect-color, currentColor), 0 0 80px var(--effect-color, currentColor);"
);

content = content.replace(
  "-webkit-text-stroke: 1px currentColor;",
  "-webkit-text-stroke: 1px var(--effect-color, currentColor);"
);

fs.writeFileSync('src/index.css', content);
