const fs = require('fs');
let content = fs.readFileSync('src/pages/user/tools/QuranFull.tsx', 'utf8');

// Add Shield to imports
const importRegex = /import \{ BookOpen, (.*?) \} from 'lucide-react';/;
if (content.match(importRegex) && !content.includes('Shield,')) {
  content = content.replace(importRegex, "import { BookOpen, Shield, $1 } from 'lucide-react';");
}

// Replace RefreshCw with Shield in the repeat button
const target = `<RefreshCw size={22} className={repeatCount > 0 ? "animate-spin-slow" : ""} style={{ animationDuration: '3s' }} />`;
const replacement = `<Shield size={22} className={repeatCount > 0 ? "animate-pulse" : ""} style={{ animationDuration: '3s' }} />`;
content = content.replace(target, replacement);

fs.writeFileSync('src/pages/user/tools/QuranFull.tsx', content);
console.log("Replaced RefreshCw with Shield");
