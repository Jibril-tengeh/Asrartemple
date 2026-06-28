import React, { useState, useEffect, useRef } from 'react';
import { Menu, Search, Crown, Heart, Plus, ListMusic, Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, ChevronDown, MoreVertical, AlignJustify, Volume2, AlarmClock, Settings2, Gauge, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAudio } from '../../../contexts/AudioContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { db } from '../../../lib/firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';

const QURAN_RECITERS = [
  { id: 'alafasy', name: 'Mishary Rashid Alafasy', server: 'https://server8.mp3quran.net/afs/', apiId: 'ar.alafasy' }
];

export const Ruqyah: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { playPlaylist, currentTrack, isPlaying: globalIsPlaying, pause: globalPause, resume: globalResume } = useAudio();
  
  const [activeTab, setActiveTab] = useState<'songs' | 'playlists' | 'folders' | 'artists'>('playlists');
  const [isFullPlayer, setIsFullPlayer] = useState(false);
  const [adminAudios, setAdminAudios] = useState<any[]>([]);

  // We use admin audios as our main songs
  useEffect(() => {
    const q = query(collection(db, 'ruqyah_audios'), where('isActive', '==', true));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAdminAudios(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      console.error("Ruqyah onSnapshot error:", error);
    });
    
    return () => unsubscribe();
  }, []);

  const handlePlayToggle = (audio: any) => {
    if (currentTrack?.url === audio.url && globalIsPlaying) {
      globalPause();
    } else if (currentTrack?.url === audio.url && !globalIsPlaying) {
      globalResume();
    } else {
      const title = audio[`title_${language}`] || audio.title || "coran_et_remede";
      playPlaylist([{ id: `admin-${audio.id}`, title: title, artist: "<unknown>", url: audio.url }], 0);
    }
  };

  const handleGlobalPlayToggle = () => {
    if (globalIsPlaying) globalPause();
    else globalResume();
  };

  // UI colors mimicking the screenshot:
  // Background: dark green/glass with soccer field vibes (we use a deep dark theme here)
  return (
    <div className="fixed inset-0 z-50 bg-[#121c17] text-white flex flex-col font-sans overflow-hidden bg-[url('https://images.unsplash.com/photo-1518605368461-1ee7c532066d?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center">
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      <div className="relative z-10 flex flex-col h-full w-full max-w-md mx-auto shadow-2xl">
        <AnimatePresence mode="wait">
          {!isFullPlayer ? (
            <motion.div 
              key="library"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: 100 }}
              className="flex-1 flex flex-col h-full"
            >
              {/* Header */}
              <div className="px-5 py-4 flex items-center justify-between pt-safe">
                <button onClick={() => navigate('/tools')} className="text-white/90 p-2 -ml-2"><Menu size={24} /></button>
                <div className="flex items-center gap-4 text-white/90">
                  <button><Search size={22} /></button>
                  <button className="text-amber-400"><Crown size={22} /></button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex items-center px-2 mb-4 overflow-x-auto no-scrollbar">
                {['Songs', 'Playlists', 'Folders', 'Artists'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase() as any)}
                    className={`px-4 py-2 text-lg whitespace-nowrap transition-all ${activeTab === tab.toLowerCase() ? 'text-white font-bold border-b-2 border-[#41c5c5]' : 'text-white/60 font-medium'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-5 pb-32">
                {activeTab === 'playlists' && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="flex justify-between items-center mb-4 mt-2">
                      <h2 className="text-xl font-semibold">My Playlist</h2>
                      <button><AlignJustify size={20} className="text-white/70" /></button>
                    </div>

                    <div className="space-y-4">
                      {/* Create Playlist */}
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#41c5c5] to-indigo-500 flex items-center justify-center">
                          <Plus size={28} className="text-white" />
                        </div>
                        <span className="text-lg font-medium">Create Playlist</span>
                      </div>

                      {/* Favorite Songs */}
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center">
                          <Heart size={28} fill="currentColor" className="text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium">Favorite Songs</h3>
                          <p className="text-sm text-white/50">0 Song</p>
                        </div>
                      </div>

                      {/* Dummy Playlists from screenshot */}
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-blue-900 overflow-hidden relative">
                           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=200')] bg-cover"></div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-medium">ROUQYA</h3>
                          <p className="text-sm text-white/50">2 Songs</p>
                        </div>
                        <button><MoreVertical size={20} className="text-white/50" /></button>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-600 overflow-hidden relative">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Music size={24} className="text-white/50" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-medium">Kai September</h3>
                          <p className="text-sm text-white/50">17 Songs</p>
                        </div>
                        <button><MoreVertical size={20} className="text-white/50" /></button>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-purple-600 overflow-hidden flex items-center justify-center">
                           <Music size={24} className="text-white/50" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-medium">les compagnons</h3>
                          <p className="text-sm text-white/50">12 Songs</p>
                        </div>
                        <button><MoreVertical size={20} className="text-white/50" /></button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'songs' && (
                  <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                    <div className="flex items-center gap-3 mb-6 mt-2">
                      <button className="flex items-center gap-2 bg-[#2c4035]/80 hover:bg-[#344b3f] backdrop-blur-md px-5 py-2.5 rounded-full text-[#41c5c5] font-semibold transition-colors">
                        <Play size={18} fill="currentColor" /> Play
                      </button>
                      <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-full text-white font-semibold transition-colors">
                        <Shuffle size={18} /> Shuffle
                      </button>
                      <div className="flex-1"></div>
                      <button className="text-white/70"><Settings2 size={20} /></button>
                      <button className="text-white/70"><ListMusic size={20} /></button>
                    </div>

                    <div className="space-y-4">
                      {adminAudios.length === 0 ? (
                        <div className="text-center text-white/50 py-10">Aucun audio disponible</div>
                      ) : (
                        adminAudios.map((audio, idx) => {
                          const title = audio[`title_${language}`] || audio.title;
                          const isPlayingThis = currentTrack?.url === audio.url;
                          return (
                            <div key={idx} className="flex items-center gap-4 group cursor-pointer" onClick={() => handlePlayToggle(audio)}>
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${isPlayingThis ? 'bg-[#41c5c5]/20' : 'bg-white/5 group-hover:bg-white/10'}`}>
                                {isPlayingThis && globalIsPlaying ? (
                                  <div className="flex gap-1">
                                    <div className="w-1 h-3 bg-[#41c5c5] animate-pulse"></div>
                                    <div className="w-1 h-4 bg-[#41c5c5] animate-pulse delay-75"></div>
                                    <div className="w-1 h-2 bg-[#41c5c5] animate-pulse delay-150"></div>
                                  </div>
                                ) : (
                                  <Music size={20} className={isPlayingThis ? 'text-[#41c5c5]' : 'text-white/40'} />
                                )}
                              </div>
                              <div className="flex-1 overflow-hidden">
                                <h4 className={`text-base font-medium truncate ${isPlayingThis ? 'text-[#41c5c5]' : 'text-white'}`}>{title}</h4>
                                <p className="text-xs text-white/50 truncate">&lt;unknown&gt; - {audio.duration || "0:00"}</p>
                              </div>
                              <button className="text-white/40 p-2"><MoreVertical size={18} /></button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Nav (App mockup inside the UI) */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#16221c] border-t border-white/5 flex justify-around items-center px-2 pb-safe">
                <div onClick={() => navigate('/')} className="flex flex-col items-center gap-1 opacity-50 cursor-pointer p-2"><span className="text-[10px]">Home</span></div>
                <div className="flex flex-col items-center gap-1 text-[#41c5c5] p-2"><span className="text-[10px]">Music</span></div>
                <div className="flex flex-col items-center gap-1 opacity-50 p-2"><span className="text-[10px]">Video</span></div>
                <div onClick={() => navigate('/profile')} className="flex flex-col items-center gap-1 opacity-50 cursor-pointer p-2"><span className="text-[10px]">Mine</span></div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="player"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="flex-1 flex flex-col h-full bg-[#121c17]/90 backdrop-blur-xl"
            >
              <div className="px-5 py-4 pt-safe flex items-center justify-between">
                <button onClick={() => setIsFullPlayer(false)} className="text-white p-2 -ml-2">
                  <ChevronDown size={28} />
                </button>
                <div className="text-lg font-medium flex gap-4">
                  <span className="text-white">Playing...</span>
                  <span className="text-white/40">|</span>
                  <span className="text-white/40">Lyrics</span>
                </div>
                <div className="flex items-center gap-4 text-white">
                  <button><Crown size={22} /></button>
                  <button><MoreVertical size={24} /></button>
                </div>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center px-8">
                {/* Artwork */}
                <div className="w-full aspect-square max-w-[320px] rounded-[32px] overflow-hidden relative shadow-2xl bg-black mb-8">
                  <div className="absolute inset-0 flex">
                    <div className="w-1/2 bg-[url('https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=500')] bg-cover bg-center"></div>
                    <div className="w-1/2 bg-[#2a2a2a] relative overflow-hidden flex items-center justify-start">
                       {/* Vinyl record half */}
                       <div className="absolute -left-1/2 w-full h-[100%] rounded-full border-[20px] border-black/90 flex items-center justify-center shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
                         <div className="w-1/3 h-1/3 rounded-full bg-orange-600 border-4 border-black/50"></div>
                       </div>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center">
                    <AlignJustify size={18} className="text-white" />
                  </div>
                </div>

                <div className="w-full flex items-center justify-between mb-8">
                  <div className="flex-1 overflow-hidden pr-4">
                    <h2 className="text-2xl font-bold truncate text-white">
                      {currentTrack?.title || "coran_et_remede"}
                    </h2>
                  </div>
                  <div className="flex items-center gap-6">
                    <button className="text-white/70 hover:text-white transition-colors"><Heart size={24} /></button>
                    <button className="text-white/70 hover:text-white transition-colors"><Plus size={24} /></button>
                  </div>
                </div>

                {/* Secondary controls */}
                <div className="w-full flex justify-between items-center px-2 mb-8 text-white/50">
                  <button><Settings2 size={20} /></button>
                  <button><Volume2 size={20} /></button>
                  <button><AlarmClock size={20} /></button>
                  <button className="flex flex-col items-center"><Gauge size={20} /><span className="text-[10px] mt-1">1.0x</span></button>
                  <button><ListMusic size={20} /></button>
                </div>

                {/* Progress (Dummy since we don't have real progress exposed easily, we just simulate the UI) */}
                <div className="w-full mb-8">
                  <div className="h-1 bg-white/20 rounded-full mb-3 relative">
                    <div className="absolute left-0 top-0 h-full w-1/3 bg-white rounded-full"></div>
                    <div className="absolute left-1/3 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <div className="flex justify-between text-xs text-white/50 font-medium">
                    <span>00:07</span>
                    <span>10:00</span>
                  </div>
                </div>

                {/* Main controls */}
                <div className="w-full flex justify-between items-center px-2">
                  <button className="text-white/70"><Shuffle size={22} /></button>
                  <button className="text-[#41c5c5]"><SkipBack size={28} fill="currentColor" /></button>
                  <button 
                    onClick={handleGlobalPlayToggle}
                    className="w-20 h-20 bg-[#41c5c5] rounded-full flex items-center justify-center text-black shadow-lg shadow-[#41c5c5]/20 hover:scale-105 transition-transform"
                  >
                    {globalIsPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                  </button>
                  <button className="text-[#41c5c5]"><SkipForward size={28} fill="currentColor" /></button>
                  <button className="text-white/70"><Repeat size={22} /></button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mini Player */}
        {!isFullPlayer && (
          <div className="absolute bottom-16 left-0 right-0 px-2 pb-2 z-20">
            <div 
              onClick={() => setIsFullPlayer(true)}
              className="bg-gradient-to-r from-[#19a5a5] to-[#0f6b6b] rounded-full p-2 pr-4 flex items-center gap-3 cursor-pointer shadow-lg"
            >
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center overflow-hidden shrink-0">
                <Music className="text-white/70" size={20} />
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="text-white font-medium truncate">{currentTrack?.title || "coran_et_remede"}</div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); handleGlobalPlayToggle(); }} 
                className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white shrink-0 hover:bg-white/10"
              >
                {globalIsPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
              </button>
              <button className="text-white/90 p-1 shrink-0">
                <ListMusic size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
