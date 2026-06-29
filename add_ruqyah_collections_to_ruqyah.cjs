const fs = require('fs');

let content = fs.readFileSync('src/pages/user/tools/Ruqyah.tsx', 'utf8');

// Add userCollections state
content = content.replace(
  "const [userPlaylists, setUserPlaylists] = useState<any[]>([]);",
  `const [userPlaylists, setUserPlaylists] = useState<any[]>([]);
  const [userCollections, setUserCollections] = useState<any[]>([]);
  const [showAddToPlaylistModal, setShowAddToPlaylistModal] = useState<any | null>(null);`
);

// Fetch userCollections
content = content.replace(
  `    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUserPlaylists(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      console.error("Playlists onSnapshot error:", error);
    });
    
    return () => unsubscribe();`,
  `    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUserPlaylists(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      console.error("Playlists onSnapshot error:", error);
    });

    const qCol = query(collection(db, 'ruqyah_collections'), where('userId', '==', user.uid));
    const unsubscribeCol = onSnapshot(qCol, (snapshot) => {
      setUserCollections(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    
    return () => { unsubscribe(); unsubscribeCol(); };`
);

// Add logic to Folders tab
const foldersTabContent = `
                {activeTab === 'folders' && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="flex justify-between items-center mb-4 mt-2">
                      <h2 className="text-xl font-semibold">Mes Collections</h2>
                    </div>

                    <div className="space-y-4">
                      {userCollections.length === 0 ? (
                        <p className="text-white/50 text-center py-10">Aucune collection existante.</p>
                      ) : (
                        userCollections.map((collection, idx) => (
                          <div key={collection.id || idx} className="flex flex-col gap-2 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                            <div className="flex justify-between items-center cursor-pointer" onClick={() => {
                              setOpenedPlaylist(collection);
                              setActiveTab('songs');
                            }}>
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-600/50 flex items-center justify-center">
                                  <ListMusic size={24} className="text-blue-300" />
                                </div>
                                <div>
                                  <h3 className="text-lg font-medium">{collection.name}</h3>
                                  <p className="text-sm text-white/50">{collection.tracks?.length || 0} tracks</p>
                                </div>
                              </div>
                            </div>
                            <div className="pt-2 border-t border-white/10 mt-2 flex justify-end">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowAddToPlaylistModal(collection);
                                }}
                                className="text-sm flex items-center gap-2 bg-[#41c5c5]/20 hover:bg-[#41c5c5]/40 text-[#41c5c5] px-3 py-1.5 rounded-lg transition-colors"
                              >
                                <Plus size={16} /> Ajouter à une Playlist
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
`;

content = content.replace(
  "{activeTab === 'songs' && (",
  foldersTabContent + "\n                {activeTab === 'songs' && ("
);

// Add the modal for adding collection to playlist
const importUpdateDoc = "import { collection, onSnapshot, query, where, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';";
content = content.replace(
  "import { collection, onSnapshot, query, where, addDoc, serverTimestamp } from 'firebase/firestore';",
  importUpdateDoc
);

const modalContent = `
        {showAddToPlaylistModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#1e2a22] border border-white/10 rounded-3xl p-6 shadow-2xl max-w-sm w-full relative">
              <h3 className="font-bold text-xl text-white mb-4">Ajouter à la Playlist</h3>
              <p className="text-white/70 mb-4 text-sm">Choisissez une playlist pour y ajouter la collection "{showAddToPlaylistModal.name}" comme un seul track.</p>
              
              <div className="space-y-2 mb-6">
                {userPlaylists.length > 0 ? userPlaylists.map(p => (
                  <button 
                    key={p.id}
                    onClick={async () => {
                      const newTrack = {
                        id: \`collection-\${showAddToPlaylistModal.id}-\${Date.now()}\`,
                        title: showAddToPlaylistModal.name,
                        url: "",
                        artist: "Collection",
                        isCollection: true,
                        subTracks: showAddToPlaylistModal.tracks || []
                      };
                      
                      try {
                        await updateDoc(doc(db, 'ruqyah_playlists', p.id), {
                          tracks: [...(p.tracks || []), newTrack]
                        });
                        alert('Collection ajoutée avec succès !');
                        setShowAddToPlaylistModal(null);
                      } catch (e) {
                        console.error(e);
                        alert("Erreur lors de l'ajout.");
                      }
                    }}
                    className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-[#41c5c5]/20 text-white transition-colors"
                  >
                    {p.name}
                  </button>
                )) : (
                  <p className="text-white/50 text-sm">Aucune playlist existante.</p>
                )}
              </div>
              <button 
                onClick={() => setShowAddToPlaylistModal(null)}
                className="w-full p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
`;

content = content.replace(
  "      </div>\n    </div>\n  );\n};",
  modalContent
);

fs.writeFileSync('src/pages/user/tools/Ruqyah.tsx', content);
