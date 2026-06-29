const fs = require('fs');
let content = fs.readFileSync('src/pages/user/tools/Ruqyah.tsx', 'utf8');

// 1. Add handleDownloadOffline
const downloadLogic = \`
  const handleDownloadOffline = async (playlist: any) => {
    if (!playlist.tracks || playlist.tracks.length === 0) return;
    
    // Flatten subtracks if any
    let urlsToDownload: string[] = [];
    playlist.tracks.forEach((t: any) => {
      if (t.isCollection && t.subTracks) {
        urlsToDownload = [...urlsToDownload, ...t.subTracks.map((st: any) => st.url).filter(Boolean)];
      } else if (t.url) {
        urlsToDownload.push(t.url);
      }
    });
    
    if (urlsToDownload.length === 0) return;
    
    setDownloadingPlaylists(prev => ({ ...prev, [playlist.id]: 0 }));
    
    await downloadAudioForOffline(urlsToDownload, (progress, total) => {
      setDownloadingPlaylists(prev => ({ ...prev, [playlist.id]: progress / total }));
    });
    
    setTimeout(() => {
      setDownloadingPlaylists(prev => {
        const next = { ...prev };
        delete next[playlist.id];
        return next;
      });
      alert('Téléchargement terminé pour accès hors-ligne !');
    }, 1000);
  };
\`;

content = content.replace(
  "  const handlePlayToggle = (audio: any, tracksContext: any[], index: number) => {",
  downloadLogic + "\n  const handlePlayToggle = (audio: any, tracksContext: any[], index: number) => {"
);

// 2. Fix the wrong playlist reference in Collections
content = content.replace(
  "handleDownloadOffline(playlist);",
  "handleDownloadOffline(collection);"
);

fs.writeFileSync('src/pages/user/tools/Ruqyah.tsx', content);
