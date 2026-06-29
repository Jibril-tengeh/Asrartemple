const fs = require('fs');

let content = fs.readFileSync('src/pages/user/tools/QuranFull.tsx', 'utf8');
content = content.replace(
  "const [downloadProgress, setDownloadProgress] = useState(0);",
  "const [surahDownloadProgress, setSurahDownloadProgress] = useState(0);"
);

content = content.replace(
  "setDownloadProgress(progress / total);",
  "setSurahDownloadProgress(progress / total);"
);

content = content.replace(
  " <span className=\"animate-spin\">⏳</span> {Math.round(downloadProgress * 100)}%",
  " <span className=\"animate-spin\">⏳</span> {Math.round(surahDownloadProgress * 100)}%"
);

fs.writeFileSync('src/pages/user/tools/QuranFull.tsx', content);
