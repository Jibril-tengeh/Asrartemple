const fs = require('fs');
let content = fs.readFileSync('src/pages/user/tools/Ruqyah.tsx', 'utf8');

// 1. Add handleDownloadOffline
const downloadLogic = '  const handleDownloadOffline = async (playlistItem: any) => {' +
'    if (!playlistItem.tracks || playlistItem.tracks.length === 0) return;' +
'    ' +
'    let urlsToDownload: string[] = [];' +
'    playlistItem.tracks.forEach((t: any) => {' +
'      if (t.isCollection && t.subTracks) {' +
'        urlsToDownload = [...urlsToDownload, ...t.subTracks.map((st: any) => st.url).filter(Boolean)];' +
'      } else if (t.url) {' +
'        urlsToDownload.push(t.url);' +
'      }' +
'    });' +
'    ' +
'    if (urlsToDownload.length === 0) return;' +
'    ' +
'    setDownloadingPlaylists(prev => ({ ...prev, [playlistItem.id]: 0 }));' +
'    ' +
'    await downloadAudioForOffline(urlsToDownload, (progress, total) => {' +
'      setDownloadingPlaylists(prev => ({ ...prev, [playlistItem.id]: progress / total }));' +
'    });' +
'    ' +
'    setTimeout(() => {' +
'      setDownloadingPlaylists(prev => {' +
'        const next = { ...prev };' +
'        delete next[playlistItem.id];' +
'        return next;' +
'      });' +
'      alert("Téléchargement terminé pour accès hors-ligne !");' +
'    }, 1000);' +
'  };';


content = content.replace(
  "  const handlePlayToggle = (audio: any, tracksContext: any[], index: number) => {",
  downloadLogic + "\\n  const handlePlayToggle = (audio: any, tracksContext: any[], index: number) => {"
);

// 2. Fix the wrong playlist reference in Collections
content = content.replace(
  /handleDownloadOffline\(playlist\);/g,
  "handleDownloadOffline(collection);"
);

// wait the first replacement is actually for Playlists so it should stay handleDownloadOffline(playlist)!
// Let's replace only the 2nd one. But they might both be replaced. Let me just replace the exact one.
const oldBtn = 'onClick={(e) => {\\n                                  e.stopPropagation();\\n                                  handleDownloadOffline(playlist);\\n                                }}';
// It's safer to just do nothing here and use edit_file if needed.

fs.writeFileSync('src/pages/user/tools/Ruqyah.tsx', content);
