const fs = require('fs');
const file = 'src/pages/user/tools/QuranFull.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStart = `<div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10 flex flex-col gap-4 w-full relative z-10" id="zoomed-ayah-actions">`;
const targetEnd = `Verset {zoomedAyah.numberInSurah}
                       </span>`;

const replacement = `<div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10 flex flex-col gap-4 w-full relative z-10" id="zoomed-ayah-actions">
                        <div className="flex items-center justify-between w-full mb-2">
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
                          
                          <button 
                            onClick={(e) => { e.stopPropagation(); setShowZoomSettings(!showZoomSettings); }}
                            className={\`p-2 rounded-full transition-colors \${showZoomSettings ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}\`}
                            title="Paramètres d'affichage"
                          >
                            <Settings size={20} />
                          </button>
                        </div>

                        <AnimatePresence>
                          {showZoomSettings && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden flex flex-col gap-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
                              onClick={(e) => e.stopPropagation()}
                            >
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
                              
                              {zoomedAyahTranslationLang !== 'none' && (
                                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Alignement Trad:</span>
                                  <div className="flex gap-2 bg-white dark:bg-gray-900 rounded-lg p-1">
                                    {['left', 'center', 'right', 'justify'].map(align => (
                                      <button
                                        key={align}
                                        onClick={() => setZoomedAyahTextAlign(align as any)}
                                        className={\`px-3 py-1 text-sm rounded \${zoomedAyahTextAlign === align ? 'bg-emerald-500 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}\`}
                                      >
                                        {align === 'left' ? 'Gauche' : align === 'center' ? 'Centre' : align === 'right' ? 'Droite' : 'Justifié'}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}

                              <div className="flex flex-col gap-3 mt-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Arrière-plan et Couleurs:</span>
                                <div className="flex flex-wrap gap-4">
                                  <div className="flex items-center gap-2" id="zoomed-bg-selector">
                                    {ZOOM_BACKGROUNDS.map((bg, idx) => (
                                      <button
                                        key={bg.id}
                                        onClick={(e) => { e.stopPropagation(); setZoomedAyahBg(idx); }}
                                        className={\`w-8 h-8 rounded-full shadow-sm transition-transform \${zoomedAyahBg === idx ? 'scale-110 ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-gray-900' : 'hover:scale-105'} \${bg.iconClass}\`}
                                        title={\`Arrière-plan \${bg.id}\`}
                                      />
                                    ))}
                                  </div>
                                  <div className="flex items-center gap-2" id="zoomed-color-selector">
                                    {ZOOM_TEXT_COLORS.map((color, idx) => (
                                      <button
                                        key={color.id}
                                        onClick={(e) => { e.stopPropagation(); setZoomedAyahColor(idx); }}
                                        className={\`w-6 h-6 rounded-full shadow-sm transition-transform \${zoomedAyahColor === idx ? 'scale-125 ring-2 ring-emerald-500 ring-offset-1 dark:ring-offset-gray-900' : 'hover:scale-110'} \${color.iconClass}\`}
                                        title={\`Couleur \${color.id}\`}
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="flex items-center justify-center gap-4 w-full flex-wrap mt-2">
                          <span className="px-4 py-2 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 rounded-full text-lg font-bold font-arabic mr-auto">
                            Verset {zoomedAyah.numberInSurah}
                          </span>`;

const idx1 = content.indexOf(targetStart);
const idx2 = content.indexOf(targetEnd, idx1);

if (idx1 !== -1 && idx2 !== -1) {
  // To handle leading whitespace on idx1
  let actualStart = idx1;
  while(actualStart > 0 && (content[actualStart-1] === ' ' || content[actualStart-1] === '\\t')) actualStart--;
  
  const finalContent = content.substring(0, actualStart) + '                      ' + replacement + content.substring(idx2 + targetEnd.length);
  fs.writeFileSync(file, finalContent);
  console.log("Success");
} else {
  console.log("Failed to find boundaries", idx1, idx2);
}
