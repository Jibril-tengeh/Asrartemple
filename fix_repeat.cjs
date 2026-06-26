const fs = require('fs');
let content = fs.readFileSync('src/pages/user/tools/QuranFull.tsx', 'utf-8');

const target = `<div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                          <Volume2 size={18} className="text-emerald-500" /> Lecture Audio (Verset par Verset)`;

const replacement = `<div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                          <Volume2 size={18} className="text-emerald-500" /> Répétition Globale (Section courante)
                        </label>
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800">
                          <div className="flex flex-col gap-3">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Répéter la page, le ruku, ou le juz courant :</p>
                            <div className="flex flex-wrap gap-2">
                              {ROQYA_REPEAT_COUNTS.map(count => (
                                <button
                                  key={\`content-\${count}\`}
                                  onClick={() => setContentRepeatCount(count)}
                                  className={\`px-3 py-1.5 rounded-lg text-sm font-bold border transition-colors \${contentRepeatCount === count ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm' : 'bg-white border-gray-200 text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 hover:border-emerald-300'}\`}
                                >
                                  {count === 0 ? 'Aucune' : \`\${count}x\`}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                          <Volume2 size={18} className="text-emerald-500" /> Lecture Audio (Verset par Verset)`;

content = content.replace(target, replacement);

const target2 = `} else if (surahArabic.ayahs.length > 0) {
                              playAudio(surahArabic.ayahs[0]);
                            }`;

const replacement2 = `} else if (surahArabic.ayahs.length > 0) {
                              contentRepeatLeftRef.current = contentRepeatCount > 0 ? contentRepeatCount - 1 : 0;
                              playAudio(surahArabic.ayahs[0]);
                            }`;

content = content.replace(target2, replacement2);

fs.writeFileSync('src/pages/user/tools/QuranFull.tsx', content);
