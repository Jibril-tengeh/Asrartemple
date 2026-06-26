const fs = require('fs');
let content = fs.readFileSync('src/pages/user/tools/QuranFull.tsx', 'utf-8');

const replacement = `
            {playlistModalAyah && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-6 shadow-xl max-w-md w-full relative"
                >
                  <h3 className="font-bold text-xl text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                    <ListPlus className="text-emerald-500" /> Ajouter à la Playlist Roqya
                  </h3>
                  <div className="space-y-4">
                    {roqyaPlaylists.length > 0 ? (
                      <div className="space-y-2">
                        {roqyaPlaylists.map(p => (
                          <button
                            key={p.id}
                            onClick={() => {
                              if (!p.ayahs.some(a => a.ayahNumberInSurah === playlistModalAyah.numberInSurah && a.surahNumber === (playlistModalAyah.surah?.number || activeSurah))) {
                                setRoqyaPlaylists(prev => prev.map(pl => pl.id === p.id ? { ...pl, ayahs: [...pl.ayahs, { surahNumber: playlistModalAyah.surah?.number || activeSurah, ayahNumberInSurah: playlistModalAyah.numberInSurah, text: playlistModalAyah.text }] } : pl));
                              }
                              setPlaylistModalAyah(null);
                            }}
                            className="w-full text-left p-3 rounded-xl bg-gray-50 hover:bg-emerald-50 dark:bg-gray-900 dark:hover:bg-emerald-900/30 transition-colors"
                          >
                            {p.name} ({p.ayahs.length} versets)
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">Aucune playlist existante.</p>
                    )}
                    
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                      <input 
                        type="text" 
                        placeholder="Nouvelle playlist..." 
                        value={newPlaylistName}
                        onChange={(e) => setNewPlaylistName(e.target.value)}
                        className="w-full p-2 mb-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-emerald-500 text-gray-900 dark:text-white"
                      />
                      <button 
                        onClick={() => {
                          if (newPlaylistName.trim()) {
                            setRoqyaPlaylists([...roqyaPlaylists, { id: Date.now().toString(), name: newPlaylistName.trim(), ayahs: [{ surahNumber: playlistModalAyah.surah?.number || activeSurah, ayahNumberInSurah: playlistModalAyah.numberInSurah, text: playlistModalAyah.text }] }]);
                            setNewPlaylistName("");
                            setPlaylistModalAyah(null);
                          }
                        }}
                        className="w-full bg-emerald-500 text-white p-2 rounded-lg"
                      >
                        Créer et ajouter
                      </button>
                    </div>
                  </div>
                  <button onClick={() => setPlaylistModalAyah(null)} className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white">
                    <X size={20} />
                  </button>
                </motion.div>
              </div>
            )}

            {showPlaylistsModal && (
              <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-6 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white flex items-center gap-2">
                      <ListMusic className="text-emerald-500" /> Playlists Roqya
                    </h3>
                    <button onClick={() => setShowPlaylistsModal(false)} className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white">
                      <X size={20} />
                    </button>
                  </div>
                  {roqyaPlaylists.length === 0 ? (
                    <p className="text-gray-500">Aucune playlist créée. Ajoutez des versets pour commencer.</p>
                  ) : (
                    <div className="space-y-4">
                      {roqyaPlaylists.map(p => (
                        <div key={p.id} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-bold text-gray-900 dark:text-white">{p.name}</h4>
                            <div className="flex gap-2">
                              <button onClick={() => {
                                const text = p.name + '\\n\\n' + p.ayahs.map(a => \`Surah \${a.surahNumber}, Ayah \${a.ayahNumberInSurah}: \\n\${a.text}\`).join('\\n\\n');
                                const blob = new Blob([text], { type: 'text/plain' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = \`Roqya_\${p.name}.txt\`;
                                a.click();
                              }} className="p-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:text-emerald-500" title="Télécharger le texte de la playlist">
                                <Download size={16} />
                              </button>
                              <button onClick={() => setRoqyaPlaylists(roqyaPlaylists.filter(pl => pl.id !== p.id))} className="p-2 bg-white dark:bg-gray-800 text-red-500 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700" title="Supprimer la playlist">
                                <X size={16} />
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">{p.ayahs.length} verset(s)</p>
                          {p.ayahs.length > 0 && (
                            <button 
                              onClick={() => {
                                setPlayingPlaylist(p);
                                setShowPlaylistsModal(false);
                              }}
                              className="mt-3 w-full bg-emerald-500 text-white p-2 rounded-lg flex items-center justify-center gap-2 font-semibold"
                            >
                              <Play size={18} /> Lire la playlist
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </div>
            )}`;

const targetLine = '            </AnimatePresence>';
content = content.replace(targetLine, replacement + '\n' + targetLine);
fs.writeFileSync('src/pages/user/tools/QuranFull.tsx', content);
