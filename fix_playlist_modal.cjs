const fs = require('fs');

let content = fs.readFileSync('src/pages/user/tools/QuranFull.tsx', 'utf8');

const startIndex = content.indexOf('{!user ? (');
const endIndexStr = '<div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">';
const endIndex = content.indexOf(endIndexStr);

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = `{!user ? (
                            <p className="text-gray-500 text-sm">Veuillez vous connecter pour gérer vos playlists et collections.</p>
                          ) : (
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Playlists existantes</h4>
                                {roqyaPlaylists.length > 0 ? (
                                  <div className="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                                    {roqyaPlaylists.map(p => (
                                      <button 
                                        key={p.id} 
                                        onClick={async () => {
                                          const ayahsToAdd = selectionMode && selectedAyahs.length > 0 ? selectedAyahs : [playlistModalAyah];
                                          const newTracks = ayahsToAdd.map(ayah => {
                                            const surahId = ayah.surah?.number || activeSurah;
                                            return {
                                              id: \`quran-\${surahId}-\${ayah.numberInSurah}-\${Date.now()}\`,
                                              surahNumber: surahId,
                                              ayahNumber: ayah.numberInSurah,
                                              title: \`Surah \${surahTranslations[surahId]?.fr || surahId} - Ayah \${ayah.numberInSurah}\`,
                                              url: \`https://cdn.islamic.network/quran/audio/128/ar.alafasy/\${ayah.number}.mp3\`,
                                              artist: "Mishary Rashid Alafasy",
                                              isQuranVerse: true
                                            };
                                          });
                                          
                                          const existingTrackIds = p.tracks?.map(t => t.id) || [];
                                          const tracksToAdd = newTracks.filter(t => !existingTrackIds.some(existing => existing.includes(\`quran-\${t.surahNumber}-\${t.ayahNumber}\`)));

                                          if (tracksToAdd.length > 0) {
                                            await updateDoc(doc(db, 'ruqyah_playlists', p.id), {
                                              tracks: [...(p.tracks || []), ...tracksToAdd]
                                            });
                                          }
                                          setPlaylistModalAyah(null);
                                          if (selectionMode) {
                                            setSelectionMode(false);
                                            setSelectedAyahs([]);
                                          }
                                        }} 
                                        className="w-full text-left p-3 rounded-xl bg-gray-50 hover:bg-emerald-50 dark:bg-gray-900 dark:hover:bg-emerald-900/30 transition-colors"
                                      >
                                        {p.name} ({p.tracks?.length || 0} versets)
                                      </button>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-gray-500 text-sm">Aucune playlist existante.</p>
                                )}
                              </div>
                              
                              <div>
                                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Collections existantes</h4>
                                {ruqyahCollections.length > 0 ? (
                                  <div className="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                                    {ruqyahCollections.map(c => (
                                      <button 
                                        key={c.id} 
                                        onClick={async () => {
                                          const ayahsToAdd = selectionMode && selectedAyahs.length > 0 ? selectedAyahs : [playlistModalAyah];
                                          const newTracks = ayahsToAdd.map(ayah => {
                                            const surahId = ayah.surah?.number || activeSurah;
                                            return {
                                              id: \`quran-\${surahId}-\${ayah.numberInSurah}-\${Date.now()}\`,
                                              surahNumber: surahId,
                                              ayahNumber: ayah.numberInSurah,
                                              title: \`Surah \${surahTranslations[surahId]?.fr || surahId} - Ayah \${ayah.numberInSurah}\`,
                                              url: \`https://cdn.islamic.network/quran/audio/128/ar.alafasy/\${ayah.number}.mp3\`,
                                              artist: "Mishary Rashid Alafasy",
                                              isQuranVerse: true
                                            };
                                          });
                                          
                                          const existingTrackIds = c.tracks?.map(t => t.id) || [];
                                          const tracksToAdd = newTracks.filter(t => !existingTrackIds.some(existing => existing.includes(\`quran-\${t.surahNumber}-\${t.ayahNumber}\`)));

                                          if (tracksToAdd.length > 0) {
                                            await updateDoc(doc(db, 'ruqyah_collections', c.id), {
                                              tracks: [...(c.tracks || []), ...tracksToAdd]
                                            });
                                          }
                                          setPlaylistModalAyah(null);
                                          if (selectionMode) {
                                            setSelectionMode(false);
                                            setSelectedAyahs([]);
                                          }
                                        }} 
                                        className="w-full text-left p-3 rounded-xl bg-gray-50 hover:bg-blue-50 dark:bg-gray-900 dark:hover:bg-blue-900/30 transition-colors"
                                      >
                                        {c.name} ({c.tracks?.length || 0} versets)
                                      </button>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-gray-500 text-sm">Aucune collection existante.</p>
                                )}
                              </div>
                            </div>
                          )}
                          {user && (
                            `;
  
  content = content.substring(0, startIndex) + replacement + content.substring(endIndex);
  fs.writeFileSync('src/pages/user/tools/QuranFull.tsx', content);
  console.log("Successfully updated modal lists");
} else {
  console.log("Could not find start or end index");
}
