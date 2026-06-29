const fs = require('fs');

let content = fs.readFileSync('src/pages/user/tools/QuranFull.tsx', 'utf8');

// 1. Add state for selection mode
content = content.replace(
  "const [fontFamily, setFontFamily] = useState<string>('Amiri');",
  `const [fontFamily, setFontFamily] = useState<string>('Amiri');
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedAyahs, setSelectedAyahs] = useState<any[]>([]);
  const [downloadingSurah, setDownloadingSurah] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);`
);

content = content.replace(
  "import { Share } from '@capacitor/share';",
  "import { Share } from '@capacitor/share';\nimport { downloadAudioForOffline } from '../../../lib/offlineAudio';\nimport { DownloadCloud, CheckSquare } from 'lucide-react';"
);

// 2. Modify Ayah click behavior
// Find onContextMenu and onTouchStart and add onClick for selection Mode
// Wait, currently onClick is not directly on the Ayah span, it's on context menu or touch.
// But there is an onClick on the word maybe? No, the Ayah text is rendered inside a span.

const ayahSpanRegex = /<span\s+key=\{ayah\.number\}\s+id=\{`ayah-\$\{ayah\.number\}`\}/g;

content = content.replace(
  `                                  ref={(el) => ayahRefs.current[ayah.number] = el}`,
  `                                  ref={(el) => ayahRefs.current[ayah.number] = el}
                                  onClick={(e) => {
                                    if (selectionMode) {
                                      e.preventDefault();
                                      const isSelected = selectedAyahs.some(a => a.number === ayah.number);
                                      if (isSelected) {
                                        setSelectedAyahs(prev => prev.filter(a => a.number !== ayah.number));
                                      } else {
                                        setSelectedAyahs(prev => [...prev, { ...ayah, surah: surahInfo }]);
                                      }
                                    }
                                  }}`
);

content = content.replace(
  `className={\`inline transition-colors \${playingAyah === ayah.number ? 'bg-emerald-100/80 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-100 rounded-lg px-1' : ''}\`}`,
  `className={\`inline transition-colors \${playingAyah === ayah.number ? 'bg-emerald-100/80 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-100 rounded-lg px-1' : ''} \${selectionMode && selectedAyahs.some(a => a.number === ayah.number) ? 'bg-blue-100 dark:bg-blue-900/40 outline outline-2 outline-blue-500 rounded px-1 cursor-pointer' : ''} \${selectionMode ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded px-1' : ''}\`}`
);

// We have TWO places where Ayah is rendered (one for translated layout and one for arabic only layout)
content = content.replace(
  `onClick={() => {
                                if (selectionMode) {`,
  `onClick={(e) => {
                                if (selectionMode) {`
);

// For the row-based layout (translated)
content = content.replace(
  `                            <div className="flex-1 w-full" dir="ltr">`,
  `                            <div 
                              className="flex-1 w-full cursor-pointer" 
                              dir="ltr"
                              onClick={(e) => {
                                if (selectionMode) {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  const isSelected = selectedAyahs.some(a => a.number === ayah.number);
                                  if (isSelected) {
                                    setSelectedAyahs(prev => prev.filter(a => a.number !== ayah.number));
                                  } else {
                                    setSelectedAyahs(prev => [...prev, { ...ayah, surah: surahInfo }]);
                                  }
                                }
                              }}
                            >`
);

content = content.replace(
  `                          <div 
                            key={ayah.number}
                            id={\`ayah-\${ayah.number}\`}
                            data-ayah-number={ayah.number}
                            className={\`group flex flex-col items-end gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl transition-all duration-500 \${playingAyah === ayah.number ? 'bg-emerald-50 dark:bg-emerald-900/20 shadow-sm border border-emerald-100 dark:border-emerald-800/30' : 'hover:bg-gray-50/80 dark:hover:bg-gray-800/50'}\`}
                          >`,
  `                          <div 
                            key={ayah.number}
                            id={\`ayah-\${ayah.number}\`}
                            data-ayah-number={ayah.number}
                            className={\`group flex flex-col items-end gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl transition-all duration-500 \${playingAyah === ayah.number ? 'bg-emerald-50 dark:bg-emerald-900/20 shadow-sm border border-emerald-100 dark:border-emerald-800/30' : 'hover:bg-gray-50/80 dark:hover:bg-gray-800/50'} \${selectionMode && selectedAyahs.some(a => a.number === ayah.number) ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''}\`}
                          >`
);

// Add the selection toolbar and download button to Header
const topActionsInjection = `
                <div className="flex items-center gap-2">
                  <button
                    onClick={async () => {
                      const surahAudioId = QURAN_RECITERS.find(r => r.id === reciter)?.apiId || 'ar.alafasy';
                      const urls = surahArabic?.ayahs.map(a => \`https://cdn.islamic.network/quran/audio/128/\${surahAudioId}/\${a.number}.mp3\`) || [];
                      if (urls.length === 0) return;
                      
                      setDownloadingSurah(true);
                      setDownloadProgress(0);
                      
                      await downloadAudioForOffline(urls, (progress, total) => {
                        setDownloadProgress(progress / total);
                      });
                      
                      setTimeout(() => {
                        setDownloadingSurah(false);
                        alert('Sourate téléchargée pour accès hors-ligne !');
                      }, 1000);
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors text-sm font-medium"
                    title="Télécharger pour hors-ligne"
                  >
                    {downloadingSurah ? (
                      <span className="flex items-center gap-1">
                        <span className="animate-spin">⏳</span> {Math.round(downloadProgress * 100)}%
                      </span>
                    ) : (
                      <><DownloadCloud size={16} /> <span className="hidden sm:inline">Hors-ligne</span></>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setSelectionMode(!selectionMode);
                      if (selectionMode) setSelectedAyahs([]);
                    }}
                    className={\`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium \${selectionMode ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}\`}
                  >
                    <CheckSquare size={16} /> 
                    <span className="hidden sm:inline">{selectionMode ? 'Annuler la sélection' : 'Sélectionner'}</span>
                  </button>
`;

content = content.replace(
  `                  <div className="flex-1 max-w-xl mx-4">`,
  topActionsInjection + `</div>\n                  <div className="flex-1 max-w-xl mx-4">`
);

// Bottom Float Bar for Selection
const floatBar = `
      {selectionMode && selectedAyahs.length > 0 && (
        <div className="fixed bottom-[4rem] sm:bottom-[5rem] left-0 right-0 z-50 flex justify-center p-4 pointer-events-none">
          <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-4 border border-blue-200 dark:border-blue-900/50 flex flex-col sm:flex-row items-center gap-4 pointer-events-auto min-w-[300px]">
            <div className="flex items-center gap-2">
              <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">{selectedAyahs.length}</span>
              <span className="font-medium text-gray-900 dark:text-white">verset(s) sélectionné(s)</span>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button 
                onClick={() => {
                  // We can re-use playlist modal
                  // The modal expects a single ayah, but we can adapt it to handle multiple
                  // For now, let's trigger the modal for a dummy ayah, and inside the modal we check if there are selectedAyahs
                  setPlaylistModalAyah({
                    number: selectedAyahs[0].number,
                    text: selectedAyahs[0].text,
                    numberInSurah: selectedAyahs[0].numberInSurah,
                    surah: selectedAyahs[0].surah,
                    juz: 0,
                    page: 0,
                    hizbQuarter: 0,
                    sajda: false
                  });
                }}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
              >
                Ajouter à une Collection/Playlist
              </button>
            </div>
          </div>
        </div>
      )}
`;

content = content.replace(
  "      {showBookmarkModal && bookmarkModalAyah && (",
  floatBar + "\n      {showBookmarkModal && bookmarkModalAyah && ("
);

// Adapt the Add to Playlist Modal for multiple verses
const oldAddToPlaylistBody = `
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
                                      setPlaylistModalAyah(null);`;

const newAddToPlaylistBodyPlaylists = `
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
                                          }`;

content = content.replace(
  /const surahId = playlistModalAyah\.surah\?\.number \|\| activeSurah;\s*const newTrack = {[\s\S]*?setPlaylistModalAyah\(null\);/g,
  newAddToPlaylistBodyPlaylists
);


// But wait, there are multiple occurrences of this in the modal (for playlists, collections, new playlist, new collection)
// I used regex to replace them all!

fs.writeFileSync('src/pages/user/tools/QuranFull.tsx', content);
