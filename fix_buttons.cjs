const fs = require('fs');

const path = 'src/pages/user/tools/QuranFull.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldStructure = `                       <button
                         onClick={(e) => {
                           e.stopPropagation();
                           const textToCopy = \`\${zoomedAyah.text} ﴿\${toArabicNumeral(zoomedAyah.numberInSurah)}﴾\`;
                           navigator.clipboard.writeText(textToCopy);
                           alert('Verset copié dans le presse-papier !');
                         }}
                         className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-emerald-600 transition-colors"
                         title="Copier le verset"
                       >
                         <Copy size={20} />
                       </button>
                       
                       </div>
                       
                       <button
                         onClick={(e) => {
                           e.stopPropagation();
                           generateZoomedVideo();
                         }}
                         className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 text-emerald-500 hover:text-emerald-600 transition-colors flex items-center gap-2"
                         title="Enregistrer comme vidéo"
                       >
                         {isGeneratingVideo ? <span className="animate-spin text-xl">⏳</span> : <span className="text-xl">🎥</span>}
                       </button>

                       <button
                         onClick={(e) => {
                           e.stopPropagation();
                           const node = document.getElementById('zoomed-ayah-capture');`;

const newStructure = `                       <button
                         onClick={(e) => {
                           e.stopPropagation();
                           const textToCopy = \`\${zoomedAyah.text} ﴿\${toArabicNumeral(zoomedAyah.numberInSurah)}﴾\`;
                           navigator.clipboard.writeText(textToCopy);
                           alert('Verset copié dans le presse-papier !');
                         }}
                         className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-emerald-600 transition-colors"
                         title="Copier le verset"
                       >
                         <Copy size={20} />
                       </button>
                       
                       <button
                         onClick={(e) => {
                           e.stopPropagation();
                           generateZoomedVideo();
                         }}
                         className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 text-emerald-500 hover:text-emerald-600 transition-colors flex items-center gap-2"
                         title="Enregistrer comme vidéo"
                       >
                         {isGeneratingVideo ? <span className="animate-spin text-xl">⏳</span> : <span className="text-xl">🎥</span>}
                       </button>

                       <button
                         onClick={(e) => {
                           e.stopPropagation();
                           const node = document.getElementById('zoomed-ayah-capture');`;

content = content.replace(oldStructure, newStructure);
fs.writeFileSync(path, content);
