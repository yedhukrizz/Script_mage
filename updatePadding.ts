import fs from 'fs';
import path from 'path';

const replaceInFile = (filePath: string) => {
  let content = fs.readFileSync(filePath, 'utf8');
  // replace px-2 py-1 with px-3 py-2 globally
  content = content.replace(/px-2 py-1/g, 'px-3 py-2');
  // replace smaller padding in specific places
  content = content.replace(/px-1 py-0\.5/g, 'px-2 py-1');
  
  // also look at some buttons with p-1 or p-2 and make them p-2 or p-3
  content = content.replaceAll(/w-16/g, 'w-20');
  content = content.replaceAll(/p-1/g, 'p-2');
  content = content.replaceAll(/p-2/g, 'p-3 text-lg');
  
  fs.writeFileSync(filePath, content);
};

const componentsDir = path.join(process.cwd(), 'src', 'components');
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  try {
    let content = fs.readFileSync(path.join(componentsDir, file), 'utf8');
    content = content.replace(/px-2 py-1/g, 'px-3 py-2');
    fs.writeFileSync(path.join(componentsDir, file), content);
  } catch(e) {}
}

const appPath = path.join(process.cwd(), 'src', 'App.tsx');
try {
  let appCont = fs.readFileSync(appPath, 'utf8');
  appCont = appCont.replace(/px-2 py-1/g, 'px-3 py-2');
  fs.writeFileSync(appPath, appCont);
} catch(e) {}

console.log('Padding updated');
