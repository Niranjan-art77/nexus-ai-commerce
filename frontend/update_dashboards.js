const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (dirFile.endsWith('.tsx')) filelist.push(dirFile);
    }
  });
  return filelist;
};

const files = walkSync('src/dashboards');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/bg-white/g, 'glass-effect');
  content = content.replace(/bg-gray-50/g, 'bg-black/40');
  content = content.replace(/border-gray-200/g, 'border-white/10');
  content = content.replace(/border-gray-100/g, 'border-white/5');
  content = content.replace(/text-gray-900/g, 'text-white');
  content = content.replace(/text-gray-800/g, 'text-gray-200');
  content = content.replace(/text-gray-500/g, 'text-gray-400');
  content = content.replace(/bg-gray-100/g, 'bg-white/10');
  fs.writeFileSync(file, content);
  console.log('Updated', file);
});
