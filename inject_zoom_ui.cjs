const fs = require('fs');

const path = 'src/pages/user/tools/QuranFull.tsx';
let content = fs.readFileSync(path, 'utf8');

// The main div for Zoomed Ayah:
// <motion.div ... className={`w-full max-w-5xl ${ZOOM_BACKGROUNDS[zoomedAyahBg].class} ${ZOOM_TEXT_COLORS[zoomedAyahColor].class} rounded-3xl p-6 sm:p-12 shadow-2xl overflow-hidden relative transition-colors duration-300`}
const targetDivStart = 'className={`w-full max-w-5xl ${ZOOM_BACKGROUNDS[zoomedAyahBg].class} ${ZOOM_TEXT_COLORS[zoomedAyahColor].class} rounded-3xl p-6 sm:p-12 shadow-2xl overflow-hidden relative transition-colors duration-300`}';

const replacementDivStart = 'id="zoomed-ayah-capture"\n                   className={`w-full max-w-5xl ${ZOOM_BACKGROUNDS[zoomedAyahBg].class} ${ZOOM_TEXT_COLORS[zoomedAyahColor].class} rounded-3xl p-6 sm:p-12 shadow-2xl overflow-hidden relative transition-colors duration-300 ${zoomedAyahAspectRatio !== "auto" ? "aspect-[" + zoomedAyahAspectRatio.replace(":", "/") + "] flex flex-col justify-center items-center" : ""}`}';

content = content.replace(targetDivStart, replacementDivStart);


// The font size injection
const fontSizeTarget = "fontSize: zoomedAyah.text.length < 50 ? 'clamp(2.5rem, 8vw, 6rem)' : zoomedAyah.text.length < 150 ? 'clamp(2rem, 6vw, 4rem)' : zoomedAyah.text.length < 300 ? 'clamp(1.5rem, 5vw, 3rem)' : zoomedAyah.text.length < 600 ? 'clamp(1.2rem, 4vw, 2.5rem)' : 'clamp(1rem, 3vw, 1.8rem)',";
const fontSizeReplacement = "fontSize: zoomedArabicSize + 'px',";
content = content.replace(fontSizeTarget, fontSizeReplacement);


// The translation injection
const translationInjection = `
                     {zoomedAyahTranslationLang !== 'none' && (
                       <div className="mt-6 text-center w-full" style={{ fontSize: zoomedTranslationSize + 'px' }}>
                         <p className="font-sans font-medium text-current opacity-80">
                           {zoomedAyahTranslationLang === 'fr' && surahFrench?.ayahs.find(a => a.numberInSurah === zoomedAyah.numberInSurah)?.text}
                           {zoomedAyahTranslationLang === 'en' && surahEnglish?.ayahs.find(a => a.numberInSurah === zoomedAyah.numberInSurah)?.text}
                           {zoomedAyahTranslationLang === 'ha' && surahHausa?.ayahs.find(a => a.numberInSurah === zoomedAyah.numberInSurah)?.text}
                         </p>
                       </div>
                     )}
`;

content = content.replace(
  '{zoomedAyah.isTajweed ? (',
  translationInjection + '\n                       {zoomedAyah.isTajweed ? ('
);


// The sliders and options injection
const optionsInjection = `
                       <div className="w-full flex flex-col gap-4 mb-4">
                         <div className="flex items-center gap-4 flex-wrap">
                           <div className="flex items-center gap-2">
                             <span className="text-sm font-medium">Traduction:</span>
                             <select 
                               className="bg-transparent border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
                               value={zoomedAyahTranslationLang}
                               onChange={e => setZoomedAyahTranslationLang(e.target.value as any)}
                             >
                               <option value="none">Aucune</option>
                               <option value="fr">Français</option>
                               <option value="en">English</option>
                               <option value="ha">Hausa</option>
                             </select>
                           </div>
                           
                           <div className="flex items-center gap-2">
                             <span className="text-sm font-medium">Format:</span>
                             <select 
                               className="bg-transparent border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
                               value={zoomedAyahAspectRatio}
                               onChange={e => setZoomedAyahAspectRatio(e.target.value as any)}
                             >
                               <option value="auto">Auto</option>
                               <option value="1:1">Carré (1:1)</option>
                               <option value="9:16">Story (9:16)</option>
                               <option value="16:9">Paysage (16:9)</option>
                             </select>
                           </div>
                         </div>
                         
                         <div className="flex items-center gap-4 flex-wrap">
                           <div className="flex items-center gap-2 w-full sm:w-auto flex-1 min-w-[200px]">
                             <span className="text-sm font-medium whitespace-nowrap">Taille Arabe:</span>
                             <input type="range" min="16" max="72" value={zoomedArabicSize} onChange={e => setZoomedArabicSize(Number(e.target.value))} className="w-full" />
                           </div>
                           <div className="flex items-center gap-2 w-full sm:w-auto flex-1 min-w-[200px]">
                             <span className="text-sm font-medium whitespace-nowrap">Taille Trad:</span>
                             <input type="range" min="12" max="48" value={zoomedTranslationSize} onChange={e => setZoomedTranslationSize(Number(e.target.value))} className="w-full" />
                           </div>
                         </div>
                       </div>
`;

content = content.replace(
  '<div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10 flex items-center justify-center gap-4 w-full flex-wrap relative z-10" id="zoomed-ayah-actions">',
  '<div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10 flex flex-col gap-4 w-full relative z-10" id="zoomed-ayah-actions">' + optionsInjection + '\n<div className="flex items-center justify-center gap-4 w-full flex-wrap">'
);

content = content.replace(
  '<div className="flex flex-col gap-3 mr-auto">',
  '<div className="flex flex-col gap-3 mr-auto">\n'
);

content = content.replace(
  '<button\n                         onClick={(e) => {\n                           e.stopPropagation();\n                           const node = document.querySelector(\'.max-w-5xl\') as HTMLElement;',
  `</div>
                       
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
                           const node = document.getElementById('zoomed-ayah-capture');`
);

fs.writeFileSync(path, content);
