const fs = require('fs');

const path = 'src/pages/user/tools/QuranFull.tsx';
let content = fs.readFileSync(path, 'utf8');

const lines = content.split('\n');

let startIdx = -1;
let endIdx = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('{playlistModalAyah && (')) {
    startIdx = i;
  }
  if (startIdx !== -1 && i > startIdx + 10 && lines[i].includes('</AnimatePresence>')) {
    // Look backwards from AnimatePresence to find the end of showPlaylistsModal
    // Usually it's the `)}` right before it.
    endIdx = i - 2; // Because i-1 is empty line, i-2 is `           )}`
    break;
  }
}

console.log("Found start at", startIdx, "end at", endIdx);

if (startIdx !== -1 && endIdx !== -1) {
  const extracted = lines.slice(startIdx, endIdx + 1).join('\n');
  
  lines.splice(startIdx, endIdx - startIdx + 1);
  
  let newContent = lines.join('\n');
  
  const insertTarget = '{/* Global Download Progress Toast */}';
  const insertIdx = newContent.indexOf(insertTarget);
  
  if (insertIdx !== -1) {
    newContent = newContent.slice(0, insertIdx) + extracted + '\n\n      ' + newContent.slice(insertIdx);
    fs.writeFileSync(path, newContent);
    console.log("Successfully moved modals");
  } else {
    console.log("Could not find insert target");
  }
} else {
  console.log("Could not find start or end index");
}
