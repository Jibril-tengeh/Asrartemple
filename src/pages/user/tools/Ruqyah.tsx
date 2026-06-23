import React, { useState, useEffect, useRef } from 'react';
import { Shield, ArrowLeft, Play, RotateCcw, CheckCircle, Info, Volume2, Square, Plus, Save, Trash2, ListMusic, Repeat } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

interface Verse {
  id?: string;
  title: string;
  arabic: string;
  phonetic: string;
  translation: string;
}

interface Playlist {
  id: string;
  name: string;
  verses: Verse[];
  isCustom?: boolean;
}

const defaultRuqyahTypes: Playlist[] = [
  {
    id: 'sihr',
    name: "Annulation de Sorcellerie (Sihr)",
    verses: [
      {
        id: 'y-81',
        title: "Sourate Yunus (81-82)",
        arabic: "فَلَمَّا أَلْقَوْا قَالَ مُوسَىٰ مَا جِئْتُم بِهِ السِّحْرُ ۖ إِنَّ اللَّهَ سَيُبْطِلُهُ ۖ إِنَّ اللَّهَ لَا يُصْلِحُ عَمَلَ الْمُفْسِدِينَ * وَيُحِقُّ اللَّهُ الْحَقَّ بِكَلِمَاتِهِ وَلَوْ كَرِهَ الْمُجْرِمُونَ",
        phonetic: "Falamma alqaw qala moosa ma ji'tum bihi assihru inna Allaha sayubtiluhu, inna Allaha la yuslihu a'mala almufsideen...",
        translation: "Puis, lorsqu'ils eurent jeté, Moïse dit : « Ce que vous avez produit, c'est de la magie ! Certes, Allah l'annulera. Allah ne fait pas prospérer l'œuvre des fauteurs de désordre. »"
      },
      {
        id: 'a-117',
        title: "Sourate Al-A'raf (117-119)",
        arabic: "وَأَوْحَيْنَا إِلَىٰ مُوسَىٰ أَنْ أَلْقِ عَصَاكَ ۖ فَإِذَا هِيَ تَلْقَفُ مَا يَأْفِكُونَ * فَوَقَعَ الْحَقُّ وَبَطَلَ مَا كَانُوا يَعْمَلُونَ",
        phonetic: "Wa awhayna ila moosa an alqi 'asaka fa-itha hiya talqafu ma ya'fikoon. Fawaqa'a alhaqqu wabatala ma kanoo ya'maloon.",
        translation: "Et Nous révélâmes à Moïse : « Jette ton bâton. » Et voilà que celui-ci avalait ce qu'ils avaient fabriqué. La vérité s'est ainsi manifestée et ce qu'ils ont fait fut vain."
      }
    ]
  },
  {
    id: 'ayn',
    name: "Mauvais Œil & Jalousie ('Ayn / Hasad)",
    verses: [
      {
        id: 'q-51',
        title: "Sourate Al-Qalam (51-52)",
        arabic: "وَإِن يَكَادُ الَّذِينَ كَفَرُوا لَيُزْلِقُونَكَ بِأَبْصَارِهِمْ لَمَّا سَمِعُوا الذِّكْرَ وَيَقُولُونَ إِنَّهُ لَمَجْنُونٌ",
        phonetic: "Wa in yakadu allatheena kafaroo layuzliqoonaka bi absarihim lamma sami'oo ath-thikra...",
        translation: "Peu s'en faut que ceux qui mécroient ne te transpercent par leurs regards, quand ils entendent le Coran, et ils disent : « Il est certes fou ! »"
      },
      {
        id: 'muawidhat',
        title: "Al-Mu'awwidhatayn (Falaq & Nas)",
        arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ... قُلْ أَعُوذُ بِرَبِّ النَّاسِ...",
        phonetic: "Qul a'outhu birabbi alfalaq... Qul a'outhu birabbi annas...",
        translation: "Dis : Je cherche protection auprès du Seigneur de l'aube naissante... Dis : Je cherche protection auprès du Seigneur des hommes..."
      }
    ]
  },
  {
    id: 'general',
    name: "Protection Globale & Guérison",
    verses: [
      {
        id: 'kursi',
        title: "Ayat Al-Kursi (Le Trône)",
        arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ...",
        phonetic: "Allahu la ilaha illa huwa alhayyu alqayyoomu, la ta'khuthuhu sinatun wala nawm...",
        translation: "Allah ! Point de divinité à part Lui, le Vivant, Celui qui subsiste par lui-même. Ni somnolence ni sommeil ne le saisissent..."
      },
      {
        id: 'fatiha',
        title: "Sourate Al-Fatiha",
        arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ * الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
        phonetic: "Bismillahi ar-rahmani ar-raheem. Alhamdu lillahi rabbi al'alameen...",
        translation: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux. Louange à Allah, Seigneur de l'univers..."
      }
    ]
  }
];

// Extract a unique master list of all verses for the playlist builder
const allVersesInfo = Array.from(
  new Map(defaultRuqyahTypes.flatMap(t => t.verses).map(v => [v.id, v])).values()
);

const repetitions = [1, 3, 7, 11, 21, 33, 41, 71, 73, 77, 100, 111, 313, 666, 786, 1000];

export const Ruqyah: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>(defaultRuqyahTypes);
  const [selectedType, setSelectedType] = useState<Playlist | null>(null);
  const [selectedRepetition, setSelectedRepetition] = useState(7);
  const [activeVerseIndex, setActiveVerseIndex] = useState(0);
  
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [count, setCount] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  
  // Custom playlist builder
  const [isBuildingPlaylist, setIsBuildingPlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistVerses, setNewPlaylistVerses] = useState<Verse[]>([]);

  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('custom_ruqyah_playlists');
    if (saved) {
      try {
        const custom = JSON.parse(saved);
        setPlaylists([...defaultRuqyahTypes, ...custom]);
      } catch (e) {
        console.error("Error loading custom playlists", e);
      }
    }
    
    // Auto-select first
    if (!selectedType && defaultRuqyahTypes.length > 0) {
      setSelectedType(defaultRuqyahTypes[0]);
    }
    
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const saveCustomPlaylist = () => {
    if (!newPlaylistName || newPlaylistVerses.length === 0) return;
    
    const newPlaylist: Playlist = {
      id: `custom-${Date.now()}`,
      name: newPlaylistName,
      verses: newPlaylistVerses,
      isCustom: true
    };
    
    const updatedCustom = playlists.filter(p => p.isCustom).concat(newPlaylist);
    localStorage.setItem('custom_ruqyah_playlists', JSON.stringify(updatedCustom));
    
    const newPlaylists = [...defaultRuqyahTypes, ...updatedCustom];
    setPlaylists(newPlaylists);
    setSelectedType(newPlaylist);
    setIsBuildingPlaylist(false);
    setNewPlaylistName('');
    setNewPlaylistVerses([]);
  };

  const deleteCustomPlaylist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedCustom = playlists.filter(p => p.isCustom && p.id !== id);
    localStorage.setItem('custom_ruqyah_playlists', JSON.stringify(updatedCustom));
    const newPlaylists = [...defaultRuqyahTypes, ...updatedCustom];
    setPlaylists(newPlaylists);
    if (selectedType?.id === id) {
      setSelectedType(newPlaylists[0]);
    }
  };

  const playVerse = (autoContinue = false) => {
    if (!('speechSynthesis' in window) || !selectedType) return;
    
    window.speechSynthesis.cancel();
    
    const utteranceAr = new SpeechSynthesisUtterance(selectedType.verses[activeVerseIndex].arabic);
    utteranceAr.lang = 'ar-SA';
    utteranceAr.rate = 0.8;
    
    utteranceAr.onstart = () => setIsPlaying(true);
    utteranceAr.onend = () => {
      setIsPlaying(false);
      // Auto-play logic
      if (autoContinue) {
        handleAutoContinue();
      }
    };
    utteranceAr.onerror = () => setIsPlaying(false);
    
    speechRef.current = utteranceAr;
    window.speechSynthesis.speak(utteranceAr);
  };

  const handleAutoContinue = () => {
    setCount(prev => {
      const newCount = prev + 1;
      if (newCount < selectedRepetition) {
        // Play strictly next repetition of same verse
        setTimeout(() => playVerse(true), 500); 
        return newCount;
      } else {
        // Move to next verse if available
        setActiveVerseIndex(currentVerseIndex => {
          if (selectedType && currentVerseIndex < selectedType.verses.length - 1) {
             const nextIdx = currentVerseIndex + 1;
             setTimeout(() => {
                // Play new verse, resetting count is handled in the effect or directly here
                // We must reset count to 0 in standard flow, but setCount is asynchronous.
             }, 100);
             return nextIdx;
          } else {
             // Session complete
             setIsAutoPlaying(false);
             return currentVerseIndex;
          }
        });
        return selectedRepetition; // Max out
      }
    });
  };

  // Listen to activeVerseIndex changes during auto play to trigger next verse
  useEffect(() => {
    if (isAutoPlaying && isSessionActive && count === selectedRepetition) {
      // It means index changed and we are ready for next verse
      if (selectedType && activeVerseIndex < selectedType.verses.length) {
         setCount(0); // reset count
         setTimeout(() => playVerse(true), 1500); // give a brief pause between verses
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeVerseIndex]);

  const stopVerse = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsAutoPlaying(false);
    }
  };

  const toggleAutoPlay = () => {
    if (isAutoPlaying) {
      stopVerse();
    } else {
      setIsAutoPlaying(true);
      playVerse(true);
    }
  };

  const handleStart = () => {
    if (!selectedType || selectedType.verses.length === 0) return;
    
    // Gamification
    const stats = JSON.parse(localStorage.getItem('asrar_stats') || '{}');
    stats.tools_used = (stats.tools_used || 0) + 1;
    localStorage.setItem('asrar_stats', JSON.stringify(stats));

    setCount(0);
    setActiveVerseIndex(0);
    setIsSessionActive(true);
  };

  const handleCount = () => {
    if (count < selectedRepetition && !isAutoPlaying) {
      setCount(prev => prev + 1);
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50);
      }
    }
  };

  const nextVerse = () => {
    stopVerse();
    if (selectedType && activeVerseIndex < selectedType.verses.length - 1) {
      setActiveVerseIndex(prev => prev + 1);
      setCount(0);
    }
  };

  const endSession = () => {
    stopVerse();
    setIsSessionActive(false);
    setCount(0);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24 border-none min-h-screen">
      {!isSessionActive ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex items-center gap-4 mb-6">
            <Link 
              to="/tools" 
              className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
            >
              <ArrowLeft size={24} />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Shield className="text-blue-500" />
                Ruqyah & Playlists
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Séances de traitement spirituel intensif</p>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/50 rounded-2xl p-5 mb-8 flex items-start gap-4">
            <Info className="text-blue-500 shrink-0 mt-0.5" size={24} />
            <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed font-medium">
              La Ruqyah exige pureté rituelle (Wudu), concentration et certitude (Yaqin) en la guérison d'Allah. Vous pouvez activer la Lecture Continue pour une écoute immersive, ou créer vos propres playlists.
            </p>
          </div>

          {isBuildingPlaylist ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 mb-8 z-10 relative">
               <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Créer une Playlist Personnalisée</h2>
               <input
                  type="text"
                  placeholder="Nom de la playlist (ex: Protection Nocturne)"
                  value={newPlaylistName}
             onChange={(e) => setNewPlaylistName(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-gray-900 dark:text-white mb-6 focus:ring-2 focus:ring-blue-500"
               />
               <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Sélectionner des versets :</h3>
               <div className="space-y-2 mb-6 max-h-60 overflow-y-auto pr-2">
                 {allVersesInfo.map(verse => {
                   const isSelected = newPlaylistVerses.some(v => v.id === verse.id);
                   return (
                     <div 
                       key={verse.id} 
                       onClick={() => {
                         if (isSelected) {
                            setNewPlaylistVerses(newPlaylistVerses.filter(v => v.id !== verse.id));
                         } else {
                            setNewPlaylistVerses([...newPlaylistVerses, verse]);
                         }
                       }}
                       className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${isSelected ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750'}`}
                     >
                       <span className="font-bold text-sm text-gray-800 dark:text-gray-200">{verse.title}</span>
                       {isSelected && <CheckCircle size={18} className="text-blue-500" />}
                     </div>
                   );
                 })}
               </div>
               
               {newPlaylistVerses.length > 0 && (
                 <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                   <p className="text-xs font-bold text-gray-500 uppercase mb-2">Aperçu :</p>
                   <p className="text-sm text-gray-800 dark:text-gray-200">{newPlaylistVerses.length} versets sélectionnés</p>
                 </div>
               )}

               <div className="flex gap-4">
                 <button onClick={() => setIsBuildingPlaylist(false)} className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 font-bold text-gray-600 dark:text-gray-300">
                   Annuler
                 </button>
                 <button onClick={saveCustomPlaylist} disabled={!newPlaylistName || newPlaylistVerses.length === 0} className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold disabled:opacity-50 flex items-center justify-center gap-2">
                   <Save size={18} /> Sauvegarder
                 </button>
               </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">1. Protocole & Playlist</h2>
                    <button onClick={() => setIsBuildingPlaylist(true)} className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:text-blue-700 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full">
                      <Plus size={16} /> Créer
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {playlists.map(type => (
                      <div
                        key={type.id}
                        onClick={() => setSelectedType(type)}
                        className={`w-full text-left p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                          selectedType?.id === type.id 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                            : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-200'
                        }`}
                      >
                        <h3 className={`font-bold pr-8 ${selectedType?.id === type.id ? 'text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-white'}`}>
                          {type.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">{type.verses.length} versets {type.isCustom ? "(Perso)" : ""}</p>
                        
                        {type.isCustom && (
                          <button 
                            onClick={(e) => deleteCustomPlaylist(type.id, e)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 p-2"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">2. Cycle de Répétition</h2>
                  <div className="flex flex-wrap gap-2">
                    {repetitions.map(rep => (
                      <button
                        key={rep}
                        onClick={() => setSelectedRepetition(rep)}
                        className={`px-4 py-2 rounded-xl border-2 font-bold transition-all ${
                          selectedRepetition === rep 
                            ? 'border-blue-500 bg-blue-500 text-white' 
                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-blue-300'
                        }`}
                      >
                        {rep}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleStart}
                  disabled={!selectedType || selectedType.verses.length === 0}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Play fill="currentColor" size={20} />
                  Démarrer la Séance
                </button>
              </div>

              {selectedType && (
                <div className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 h-fit">
                  <h3 className="uppercase tracking-widest text-xs font-bold text-gray-400 mb-6 flex items-center gap-2">
                    <ListMusic size={14} /> 
                    Contenu de la playlist
                  </h3>
                  <div className="space-y-6">
                    {selectedType.verses.map((verse, idx) => (
                      <div key={idx} className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-[-24px] before:w-px before:bg-blue-200 dark:before:bg-blue-900 last:before:hidden">
                        <div className="absolute left-[-4px] top-1.5 w-2 h-2 rounded-full bg-blue-500"></div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-2">{verse.title}</h4>
                        <p className="font-arabic text-xl leading-loose text-gray-700 dark:text-gray-300 mb-2" dir="rtl">
                          {verse.arabic}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      ) : (
        /* Active Session View */
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto text-center"
        >
          {selectedType && (
            <>
              <div className="flex justify-between items-center mb-8">
                <button onClick={endSession} className="text-gray-500 hover:text-red-500 font-medium px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl transition-colors">
                  Interrompre
                </button>
                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                  Verset {activeVerseIndex + 1} / {selectedType.verses.length}
                </span>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-100 dark:border-gray-700 mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                
                <h2 className="text-blue-500 dark:text-blue-400 font-bold mb-6">{selectedType.verses[activeVerseIndex].title}</h2>
                
                {audioEnabled && (
                  <div className="flex justify-center gap-3 mb-6">
                    {!isPlaying && !isAutoPlaying ? (
                      <button onClick={() => playVerse(false)} className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full font-bold text-sm transition-colors hover:bg-gray-200 dark:hover:bg-gray-700">
                        <Volume2 size={16} /> Écouter
                      </button>
                    ) : (
                      <button onClick={stopVerse} className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full font-bold text-sm transition-colors hover:bg-red-100 dark:hover:bg-red-900/50">
                        <Square size={16} fill="currentColor" /> Arrêter
                      </button>
                    )}

                    <button 
                      onClick={toggleAutoPlay} 
                      className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-colors ${isAutoPlaying ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50'}`}
                    >
                      <Repeat size={16} /> 
                      {isAutoPlaying ? 'Lecture Continue Active' : 'Lecture Continue'}
                    </button>
                  </div>
                )}
                
                <p className={`font-arabic text-3xl sm:text-5xl leading-relaxed text-gray-900 dark:text-white mb-8 select-none transition-opacity ${isPlaying ? 'opacity-100' : 'opacity-80'}`} dir="rtl">
                  {selectedType.verses[activeVerseIndex].arabic}
                </p>
                
                <p className="text-gray-500 dark:text-gray-400 italic mb-4">
                  "{selectedType.verses[activeVerseIndex].translation}"
                </p>
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Progression {isAutoPlaying && "(Auto)"}</div>
                <div className="text-5xl sm:text-7xl font-extrabold text-blue-600 dark:text-blue-400 mb-8 tabular-nums">
                  {count} <span className="text-3xl text-gray-300 dark:text-gray-700">/ {selectedRepetition}</span>
                </div>

                {count < selectedRepetition ? (
                  <button
                    onClick={handleCount}
                    disabled={isAutoPlaying}
                    className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white shadow-[0_0_40px_rgba(59,130,246,0.3)] flex items-center justify-center transition-transform active:scale-95"
                  >
                    {isAutoPlaying ? (
                       <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
                          <RotateCcw size={32} />
                       </motion.div>
                    ) : (
                       <span className="text-2xl font-bold uppercase tracking-widest opacity-80">Tap</span>
                    )}
                  </button>
                ) : (
                  <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-500 mb-2">
                      <CheckCircle size={40} />
                    </div>
                    {activeVerseIndex < selectedType.verses.length - 1 ? (
                      <button onClick={nextVerse} className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-bold hover:shadow-lg transition-all">
                        Passer au verset suivant
                      </button>
                    ) : (
                      <button onClick={endSession} className="px-8 py-4 bg-emerald-500 text-white rounded-2xl font-bold hover:shadow-lg transition-all border border-emerald-400">
                        Terminer la séance
                      </button>
                    )}
                  </motion.div>
                )}
              </div>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
};
