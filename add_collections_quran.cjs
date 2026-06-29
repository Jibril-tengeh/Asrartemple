const fs = require('fs');
let content = fs.readFileSync('src/pages/user/tools/QuranFull.tsx', 'utf8');

// Add ruqyahCollections state
content = content.replace(
  "const [roqyaPlaylists, setRoqyaPlaylists] = useState<RuqyahPlaylist[]>([]);",
  `const [roqyaPlaylists, setRoqyaPlaylists] = useState<RuqyahPlaylist[]>([]);
  const [ruqyahCollections, setRuqyahCollections] = useState<any[]>([]);`
);

content = content.replace(
  "setRoqyaPlaylists(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RuqyahPlaylist)));",
  `setRoqyaPlaylists(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RuqyahPlaylist)));
    });
    
    const qCol = query(collection(db, 'ruqyah_collections'), where('userId', '==', user.uid));
    const unsubscribeCol = onSnapshot(qCol, (snapshot) => {
      setRuqyahCollections(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));`
);

content = content.replace(
  "return () => unsubscribe();",
  `return () => { unsubscribe(); unsubscribeCol(); };`
);

// Update playlist modal UI
const oldUI = `                      <motion.div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-6 shadow-xl max-w-md w-full relative">
                        <h3 className="font-bold text-xl text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                          <ListPlus className="text-emerald-500" /> Ajouter à la Playlist Roqya
                        </h3>
                        <div className="space-y-4">
                          {!user ? (
                            <p className="text-gray-500 text-sm">Veuillez vous connecter pour gérer vos playlists.</p>
                          ) : roqyaPlaylists.length > 0 ? (
                            <div className="space-y-2">
                              {roqyaPlaylists.map(p => (
                                <button 
                                  key={p.id} 
                                  onClick={async () => {
                                    const surahId = playlistModalAyah.surah?.number || activeSurah;
                                    const newTrack = {
                                      id: \`quran-\${surahId}-\${playlistModalAyah.numberInSurah}\`,
                                      surahNumber: surahId,
                                      ayahNumber: playlistModalAyah.numberInSurah,
                                      title: \`Surah \${surahTranslations[surahId]?.fr || surahId} - Ayah \${playlistModalAyah.numberInSurah}\`,
                                      url: \`https://cdn.islamic.network/quran/audio/128/ar.alafasy/\${playlistModalAyah.number}.mp3\`,
                                      artist: "Mishary Rashid Alafasy",
                                      isQuranVerse: true
                                    };
                                    if (!p.tracks || !p.tracks.some(t => t.id === newTrack.id)) {
                                      await updateDoc(doc(db, 'ruqyah_playlists', p.id), {
                                        tracks: [...(p.tracks || []), newTrack]
                                      });
                                    }
                                    setPlaylistModalAyah(null);
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
                          {user && (
                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                              <input type="text" placeholder="Nouvelle playlist..." value={newPlaylistName} onChange={(e) => setNewPlaylistName(e.target.value)} className="w-full p-2 mb-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-emerald-500 text-gray-900 dark:text-white" />
                              <button onClick={async () => {
                                if (newPlaylistName.trim()) {
                                  const surahId = playlistModalAyah.surah?.number || activeSurah;
                                  const newTrack = {
                                    id: \`quran-\${surahId}-\${playlistModalAyah.numberInSurah}\`,
                                    surahNumber: surahId,
                                    ayahNumber: playlistModalAyah.numberInSurah,
                                    title: \`Surah \${surahTranslations[surahId]?.fr || surahId} - Ayah \${playlistModalAyah.numberInSurah}\`,
                                    url: \`https://cdn.islamic.network/quran/audio/128/ar.alafasy/\${playlistModalAyah.number}.mp3\`,
                                    artist: "Mishary Rashid Alafasy",
                                    isQuranVerse: true
                                  };
                                  await addDoc(collection(db, 'ruqyah_playlists'), {
                                    userId: user.uid,
                                    name: newPlaylistName.trim(),
                                    tracks: [newTrack],
                                    createdAt: serverTimestamp()
                                  });
                                  setNewPlaylistName("");
                                  setPlaylistModalAyah(null);
                                }
                              }} className="w-full bg-emerald-500 text-white p-2 rounded-lg">Créer et ajouter</button>
                            </div>
                          )}`;

const newUI = `                      <motion.div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-6 shadow-xl max-w-md w-full relative max-h-[80vh] overflow-y-auto">
                        <h3 className="font-bold text-xl text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                          <ListPlus className="text-emerald-500" /> Ajouter l'audio
                        </h3>
                        <div className="space-y-6">
                          {!user ? (
                            <p className="text-gray-500 text-sm">Veuillez vous connecter pour gérer.</p>
                          ) : (
                            <>
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Mes Playlists</h4>
                                {roqyaPlaylists.length > 0 ? (
                                  <div className="space-y-2">
                                    {roqyaPlaylists.map(p => (
                                      <button 
                                        key={p.id} 
                                        onClick={async () => {
                                          const surahId = playlistModalAyah.surah?.number || activeSurah;
                                          const newTrack = {
                                            id: \`quran-\${surahId}-\${playlistModalAyah.numberInSurah}\`,
                                            surahNumber: surahId,
                                            ayahNumber: playlistModalAyah.numberInSurah,
                                            title: \`Surah \${surahTranslations[surahId]?.fr || surahId} - Ayah \${playlistModalAyah.numberInSurah}\`,
                                            url: \`https://cdn.islamic.network/quran/audio/128/ar.alafasy/\${playlistModalAyah.number}.mp3\`,
                                            artist: "Mishary Rashid Alafasy",
                                            isQuranVerse: true
                                          };
                                          if (!p.tracks || !p.tracks.some(t => t.id === newTrack.id)) {
                                            await updateDoc(doc(db, 'ruqyah_playlists', p.id), {
                                              tracks: [...(p.tracks || []), newTrack]
                                            });
                                          }
                                          setPlaylistModalAyah(null);
                                        }} 
                                        className="w-full text-left p-3 rounded-xl bg-gray-50 hover:bg-emerald-50 dark:bg-gray-900 dark:hover:bg-emerald-900/30 transition-colors"
                                      >
                                        {p.name} ({p.tracks?.length || 0} tracks)
                                      </button>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-gray-500 text-sm">Aucune playlist.</p>
                                )}
                              </div>

                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Mes Collections</h4>
                                {ruqyahCollections.length > 0 ? (
                                  <div className="space-y-2">
                                    {ruqyahCollections.map(c => (
                                      <button 
                                        key={c.id} 
                                        onClick={async () => {
                                          const surahId = playlistModalAyah.surah?.number || activeSurah;
                                          const newTrack = {
                                            id: \`quran-\${surahId}-\${playlistModalAyah.numberInSurah}\`,
                                            surahNumber: surahId,
                                            ayahNumber: playlistModalAyah.numberInSurah,
                                            title: \`Surah \${surahTranslations[surahId]?.fr || surahId} - Ayah \${playlistModalAyah.numberInSurah}\`,
                                            url: \`https://cdn.islamic.network/quran/audio/128/ar.alafasy/\${playlistModalAyah.number}.mp3\`,
                                            artist: "Mishary Rashid Alafasy",
                                            isQuranVerse: true
                                          };
                                          if (!c.tracks || !c.tracks.some(t => t.id === newTrack.id)) {
                                            await updateDoc(doc(db, 'ruqyah_collections', c.id), {
                                              tracks: [...(c.tracks || []), newTrack]
                                            });
                                          }
                                          setPlaylistModalAyah(null);
                                        }} 
                                        className="w-full text-left p-3 rounded-xl bg-gray-50 hover:bg-emerald-50 dark:bg-gray-900 dark:hover:bg-emerald-900/30 transition-colors"
                                      >
                                        {c.name} ({c.tracks?.length || 0} tracks)
                                      </button>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-gray-500 text-sm">Aucune collection.</p>
                                )}
                              </div>

                              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                <input type="text" placeholder="Nouveau nom..." value={newPlaylistName} onChange={(e) => setNewPlaylistName(e.target.value)} className="w-full p-2 mb-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-emerald-500 text-gray-900 dark:text-white" />
                                <div className="flex gap-2">
                                  <button onClick={async () => {
                                    if (newPlaylistName.trim()) {
                                      const surahId = playlistModalAyah.surah?.number || activeSurah;
                                      const newTrack = {
                                        id: \`quran-\${surahId}-\${playlistModalAyah.numberInSurah}\`,
                                        surahNumber: surahId,
                                        ayahNumber: playlistModalAyah.numberInSurah,
                                        title: \`Surah \${surahTranslations[surahId]?.fr || surahId} - Ayah \${playlistModalAyah.numberInSurah}\`,
                                        url: \`https://cdn.islamic.network/quran/audio/128/ar.alafasy/\${playlistModalAyah.number}.mp3\`,
                                        artist: "Mishary Rashid Alafasy",
                                        isQuranVerse: true
                                      };
                                      await addDoc(collection(db, 'ruqyah_playlists'), {
                                        userId: user.uid,
                                        name: newPlaylistName.trim(),
                                        tracks: [newTrack],
                                        createdAt: serverTimestamp()
                                      });
                                      setNewPlaylistName("");
                                      setPlaylistModalAyah(null);
                                    }
                                  }} className="flex-1 bg-emerald-500 text-white p-2 rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors">Créer Playlist</button>
                                  <button onClick={async () => {
                                    if (newPlaylistName.trim()) {
                                      const surahId = playlistModalAyah.surah?.number || activeSurah;
                                      const newTrack = {
                                        id: \`quran-\${surahId}-\${playlistModalAyah.numberInSurah}\`,
                                        surahNumber: surahId,
                                        ayahNumber: playlistModalAyah.numberInSurah,
                                        title: \`Surah \${surahTranslations[surahId]?.fr || surahId} - Ayah \${playlistModalAyah.numberInSurah}\`,
                                        url: \`https://cdn.islamic.network/quran/audio/128/ar.alafasy/\${playlistModalAyah.number}.mp3\`,
                                        artist: "Mishary Rashid Alafasy",
                                        isQuranVerse: true
                                      };
                                      await addDoc(collection(db, 'ruqyah_collections'), {
                                        userId: user.uid,
                                        name: newPlaylistName.trim(),
                                        tracks: [newTrack],
                                        createdAt: serverTimestamp()
                                      });
                                      setNewPlaylistName("");
                                      setPlaylistModalAyah(null);
                                    }
                                  }} className="flex-1 bg-blue-500 text-white p-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">Créer Collection</button>
                                </div>
                              </div>
                            </>
                          )}`;

content = content.replace(oldUI, newUI);
fs.writeFileSync('src/pages/user/tools/QuranFull.tsx', content);
