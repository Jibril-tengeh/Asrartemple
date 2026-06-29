const fs = require('fs');

let content = fs.readFileSync('src/pages/user/tools/Ruqyah.tsx', 'utf8');

content = content.replace(
  "import { collection, onSnapshot, query, where, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';",
  "import { collection, onSnapshot, query, where, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';\nimport { downloadAudioForOffline } from '../../../lib/offlineAudio';\nimport { DownloadCloud } from 'lucide-react';"
);

content = content.replace(
  "const [showAddToPlaylistModal, setShowAddToPlaylistModal] = useState<any | null>(null);",
  "const [showAddToPlaylistModal, setShowAddToPlaylistModal] = useState<any | null>(null);\n  const [downloadingPlaylists, setDownloadingPlaylists] = useState<{[key: string]: number}>({});"
);

// Add the download function
const downloadLogic = `
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
`;

content = content.replace(
  "const handlePlay = (tracks: any[], startIndex = 0) => {",
  downloadLogic + "\n  const handlePlay = (tracks: any[], startIndex = 0) => {"
);

// Add download button for userPlaylists
const playlistBtnReplace = `
                            <div className="pt-2 border-t border-white/10 mt-2 flex justify-between items-center">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownloadOffline(playlist);
                                }}
                                className="text-sm flex items-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 px-3 py-1.5 rounded-lg transition-colors"
                              >
                                {downloadingPlaylists[playlist.id] !== undefined ? (
                                  <span className="flex items-center gap-2">
                                    <span className="animate-spin text-lg">⏳</span> {Math.round(downloadingPlaylists[playlist.id] * 100)}%
                                  </span>
                                ) : (
                                  <><DownloadCloud size={16} /> Hors-ligne</>
                                )}
                              </button>
                              
                              <button 
`;

content = content.replace(
  `                            <div className="pt-2 border-t border-white/10 mt-2 flex justify-end">
                              <button `,
  playlistBtnReplace
);

// Add download button for userCollections
const collectionBtnReplace = `
                            <div className="pt-2 border-t border-white/10 mt-2 flex justify-between items-center">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownloadOffline(collection);
                                }}
                                className="text-sm flex items-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 px-3 py-1.5 rounded-lg transition-colors"
                              >
                                {downloadingPlaylists[collection.id] !== undefined ? (
                                  <span className="flex items-center gap-2">
                                    <span className="animate-spin text-lg">⏳</span> {Math.round(downloadingPlaylists[collection.id] * 100)}%
                                  </span>
                                ) : (
                                  <><DownloadCloud size={16} /> Hors-ligne</>
                                )}
                              </button>
                              <button 
`;

content = content.replace(
  `                            <div className="pt-2 border-t border-white/10 mt-2 flex justify-end">
                              <button `,
  collectionBtnReplace
);

fs.writeFileSync('src/pages/user/tools/Ruqyah.tsx', content);
