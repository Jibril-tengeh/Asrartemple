const fs = require('fs');
let content = fs.readFileSync('src/pages/user/tools/QuranFull.tsx', 'utf8');

const regex = /<button\s+onClick=\{\(e\) => \{\s+e\.stopPropagation\(\);\s+setZoomedAyah\(null\);\s+setPlaylistModalAyah\(\{/g;

const match = regex.exec(content);

if (match) {
  const replacement = `                           <button
                             onClick={(e) => {
                               e.stopPropagation();
                               setZoomedAyah(null);
                               setSelectionMode(true);
                               setSelectedAyahs([{
                                 number: zoomedAyah.ayahNumber!,
                                 text: zoomedAyah.text,
                                 numberInSurah: zoomedAyah.numberInSurah,
                                 surah: {
                                   number: zoomedAyah.surahNumber!,
                                   name: zoomedAyah.surahName!
                                 }
                               }]);
                             }}
                             className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-blue-600 transition-colors"
                             title="Sélectionner plusieurs versets"
                           >
                             <CheckSquare size={20} />
                           </button>\n` + match[0];
                           
  content = content.replace(regex, replacement);
  fs.writeFileSync('src/pages/user/tools/QuranFull.tsx', content);
  console.log("Successfully added CheckSquare to zoomedAyah modal!");
} else {
  console.log("Target regex not found.");
}
