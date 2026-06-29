const fs = require('fs');

let content = fs.readFileSync('src/pages/user/tools/QuranFull.tsx', 'utf8');

const targetStr = \`                             <input type="text" placeholder="Nouvelle playlist..."\`;
const endStr = \`>Créer et ajouter</button>\`;

const startIndex = content.indexOf(targetStr);
const endIndex = content.indexOf(endStr, startIndex) + endStr.length;

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = \`                             <input type="text" placeholder="Nouvelle playlist/collection..." value={newPlaylistName} onChange={(e) => setNewPlaylistName(e.target.value)} className="w-full p-2 mb-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-emerald-500 text-gray-900 dark:text-white" />
                             <div className="flex gap-2">
                               <button onClick={async () => {
                                 if (newPlaylistName.trim()) {
                                   const ayahsToAdd = selectionMode && selectedAyahs.length > 0 ? selectedAyahs : [playlistModalAyah];
                                   const newTracks = ayahsToAdd.map(ayah => {
                                     const surahId = ayah.surah?.number || activeSurah;
                                     return {
                                       id: \\\`quran-\\\${surahId}-\\\${ayah.numberInSurah}-\\\${Date.now()}\\\`,
                                       surahNumber: surahId,
                                       ayahNumber: ayah.numberInSurah,
                                       title: \\\`Surah \\\${surahTranslations[surahId]?.fr || surahId} - Ayah \\\${ayah.numberInSurah}\\\`,
                                       url: \\\`https://cdn.islamic.network/quran/audio/128/ar.alafasy/\\\${ayah.number}.mp3\\\`,
                                       artist: "Mishary Rashid Alafasy",
                                       isQuranVerse: true
                                     };
                                   });
                                   
                                   await addDoc(collection(db, 'ruqyah_playlists'), {
                                     userId: user.uid,
                                     name: newPlaylistName.trim(),
                                     tracks: newTracks,
                                     createdAt: serverTimestamp()
                                   });
                                   setNewPlaylistName("");
                                   setPlaylistModalAyah(null);
                                   if (selectionMode) {
                                     setSelectionMode(false);
                                     setSelectedAyahs([]);
                                   }
                                 }
                               }} className="flex-1 bg-emerald-500 text-white p-2 rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors">Créer Playlist</button>
                               <button onClick={async () => {
                                 if (newPlaylistName.trim()) {
                                   const ayahsToAdd = selectionMode && selectedAyahs.length > 0 ? selectedAyahs : [playlistModalAyah];
                                   const newTracks = ayahsToAdd.map(ayah => {
                                     const surahId = ayah.surah?.number || activeSurah;
                                     return {
                                       id: \\\`quran-\\\${surahId}-\\\${ayah.numberInSurah}-\\\${Date.now()}\\\`,
                                       surahNumber: surahId,
                                       ayahNumber: ayah.numberInSurah,
                                       title: \\\`Surah \\\${surahTranslations[surahId]?.fr || surahId} - Ayah \\\${ayah.numberInSurah}\\\`,
                                       url: \\\`https://cdn.islamic.network/quran/audio/128/ar.alafasy/\\\${ayah.number}.mp3\\\`,
                                       artist: "Mishary Rashid Alafasy",
                                       isQuranVerse: true
                                     };
                                   });
                                   
                                   await addDoc(collection(db, 'ruqyah_collections'), {
                                     userId: user.uid,
                                     name: newPlaylistName.trim(),
                                     tracks: newTracks,
                                     createdAt: serverTimestamp()
                                   });
                                   setNewPlaylistName("");
                                   setPlaylistModalAyah(null);
                                   if (selectionMode) {
                                     setSelectionMode(false);
                                     setSelectedAyahs([]);
                                   }
                                 }
                               }} className="flex-1 bg-blue-500 text-white p-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">Créer Collection</button>
                             </div>\`;
                              
  content = content.substring(0, startIndex) + replacement + content.substring(endIndex);
  fs.writeFileSync('src/pages/user/tools/QuranFull.tsx', content);
  console.log("Replaced successfully");
} else {
  console.log("Could not find string");
}
