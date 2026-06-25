import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, ArrowLeft, Search, Play, Pause, ChevronDown, AlignJustify, Settings, Type, Volume2, FastForward, Headphones, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { useAudio } from '../../../contexts/AudioContext';

const QURAN_RECITERS = [
  { id: 'alafasy', name: 'Mishary Rashid Alafasy', server: 'https://server8.mp3quran.net/afs/', apiId: 'ar.alafasy' },
  { id: 'sudais', name: 'Abdur Rahman As-Sudais', server: 'https://server11.mp3quran.net/sds/', apiId: 'ar.abdurrahmaansudais' },
  { id: 'shuraym', name: 'Saud Al-Shuraim', server: 'https://server7.mp3quran.net/shur/', apiId: 'ar.saoodshuraym' },
  { id: 'husary', name: 'Mahmoud Khalil Al-Husary', server: 'https://server13.mp3quran.net/husr/', apiId: 'ar.husary' },
  { id: 'maher', name: 'Maher Al Muaiqly', server: 'https://server12.mp3quran.net/maher/', apiId: 'ar.mahermuaiqly' }
];

interface SurahMeta {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean | object;
  audio?: string;
  audioSecondary?: string[];
}

interface SurahData {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  ayahs: Ayah[];
}

export const QuranFull: React.FC = () => {
  const { t } = useLanguage();
  const [surahs, setSurahs] = useState<SurahMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  
  const [activeSurah, setActiveSurah] = useState<number | null>(null);
  const [surahArabic, setSurahArabic] = useState<SurahData | null>(null);
  const [surahFrench, setSurahFrench] = useState<SurahData | null>(null);
  const [surahEnglish, setSurahEnglish] = useState<SurahData | null>(null);
  const [surahHausa, setSurahHausa] = useState<SurahData | null>(null);
  const [loadingSurah, setLoadingSurah] = useState(false);

  const [fontSize, setFontSize] = useState<number>(20);
  const [showArabic, setShowArabic] = useState(true);
  const [showFrench, setShowFrench] = useState(true);
  const [showEnglish, setShowEnglish] = useState(false);
  const [showHausa, setShowHausa] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [selectedReciterId, setSelectedReciterId] = useState(QURAN_RECITERS[0].id);
  const { playTrack, playPlaylist, currentTrack, isPlaying: globalIsPlaying, pause: globalPause, resume: globalResume } = useAudio();

  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlayNext, setAutoPlayNext] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ayahRefs = useRef<{[key: number]: HTMLDivElement | null}>({});

  const getArabicStyle = () => {
    return { fontSize: `${15 + fontSize}px`, lineHeight: '2.2' };
  };

  const getTranslationStyle = () => {
    return { fontSize: `${11 + (fontSize * 0.4)}px`, lineHeight: '1.6' };
  };

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const response = await fetch('https://api.alquran.cloud/v1/surah');
        const data = await response.json();
        if (data.code === 200) {
          setSurahs(data.data);
        } else {
          setError('Erreur lors du chargement des sourates.');
        }
      } catch (err) {
        setError('Impossible de se connecter à l\'API du Coran.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSurahs();
  }, []);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (activeSurah) {
      const reciterApiId = QURAN_RECITERS.find(r => r.id === selectedReciterId)?.apiId || 'ar.alafasy';
      fetch(`https://api.alquran.cloud/v1/surah/${activeSurah}/${reciterApiId}`)
        .then(res => res.json())
        .then(data => {
          if (data.code === 200) {
            setSurahArabic(data.data);
          }
        })
        .catch(console.error);
    }
  }, [selectedReciterId]);

  const playAudio = (ayah: Ayah) => {
    if (!ayah.audio) return;
    
    if (audioRef.current) {
      audioRef.current.pause();
    }

    if (playingAyah === ayah.number && isPlaying) {
      setIsPlaying(false);
      setPlayingAyah(null);
      return;
    }

    const audio = new Audio(ayah.audio);
    audioRef.current = audio;
    
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        setIsPlaying(true);
        setPlayingAyah(ayah.number);
        
        // Auto-scroll to active ayah
        if (ayahRefs.current[ayah.number]) {
          ayahRefs.current[ayah.number]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }).catch(err => {
        if (err.name !== 'AbortError') {
          console.error("Audio playback error:", err);
        }
      });
    }

    audio.onended = () => {
      if (autoPlayNext && surahArabic) {
        const currentIndex = surahArabic.ayahs.findIndex(a => a.number === ayah.number);
        if (currentIndex !== -1 && currentIndex < surahArabic.ayahs.length - 1) {
          const nextAyah = surahArabic.ayahs[currentIndex + 1];
          playAudio(nextAyah);
        } else {
          setIsPlaying(false);
          setPlayingAyah(null);
        }
      } else {
        setIsPlaying(false);
        setPlayingAyah(null);
      }
    };
  };

  const loadSurah = async (number: number) => {
    setActiveSurah(number);
    setLoadingSurah(true);
    setSurahArabic(null);
    setSurahFrench(null);
    setSurahEnglish(null);
    setSurahHausa(null);
    
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
        setPlayingAyah(null);
      }

      const reciterApiId = QURAN_RECITERS.find(r => r.id === selectedReciterId)?.apiId || 'ar.alafasy';
      const [arRes, frRes, enRes, haRes] = await Promise.all([
        fetch(`https://api.alquran.cloud/v1/surah/${number}/${reciterApiId}`),
        fetch(`https://api.alquran.cloud/v1/surah/${number}/fr.hamidullah`),
        fetch(`https://api.alquran.cloud/v1/surah/${number}/en.sahih`),
        fetch(`https://api.alquran.cloud/v1/surah/${number}/ha.gumi`)
      ]);
      
      const arData = await arRes.json();
      const frData = await frRes.json();
      const enData = await enRes.json();
      const haData = await haRes.json();
      
      if (arData.code === 200) setSurahArabic(arData.data);
      if (frData.code === 200) setSurahFrench(frData.data);
      if (enData.code === 200) setSurahEnglish(enData.data);
      if (haData.code === 200) setSurahHausa(haData.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSurah(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const playGlobalSurah = () => {
    if (!surahArabic || !activeSurah) return;
    
    // Stop local ayah player
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setPlayingAyah(null);
    }

    const reciter = QURAN_RECITERS.find(r => r.id === selectedReciterId) || QURAN_RECITERS[0];
    const trackId = `surah-${activeSurah}-${reciter.id}`;
    
    if (currentTrack?.id === trackId) {
      if (globalIsPlaying) {
        globalPause();
      } else {
        globalResume();
      }
    } else {
      const playlist = surahs.map(s => {
        const surahNumStr = String(s.number).padStart(3, '0');
        return {
          id: `surah-${s.number}-${reciter.id}`,
          title: `Sourate ${s.englishName}`,
          artist: reciter.name,
          url: `${reciter.server}${surahNumStr}.mp3`
        };
      });
      const startIndex = surahs.findIndex(s => s.number === activeSurah);
      
      if (startIndex !== -1) {
        playPlaylist(playlist, startIndex);
      } else {
        const surahNumStr = String(activeSurah).padStart(3, '0');
        playTrack({
          id: trackId,
          title: `Sourate ${surahArabic.englishName}`,
          artist: reciter.name,
          url: `${reciter.server}${surahNumStr}.mp3`
        });
      }
    }
  };

  const filteredSurahs = surahs.filter(s => 
    s.englishName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.englishNameTranslation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.number.toString() === searchTerm
  );

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24">
      {/* Header */}
      {!activeSurah ? (
        <>
          <div className="mb-8">
            <Link to="/tools" className="inline-flex items-center text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium mb-4">
              <ArrowLeft className="mr-2" size={20} />
              {t("common.backToTools")}
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <BookOpen className="text-emerald-500" />
              Le Saint Coran (Al-Qur'an)
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">{t("tools.quran.description")}</p>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher une sourate (ex: Ya-Sin, 36, L'Aube)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-4 border border-gray-200 dark:border-gray-700 rounded-2xl leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm shadow-sm transition-all"
            />
          </div>

          {loading ? (
            <div className="flex justify-center p-12">
              <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-center">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSurahs.map((surah, i) => (
                <motion.button
                  key={surah.number}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.05, 0.5) }}
                  onClick={() => loadSurah(surah.number)}
                  className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 flex items-center justify-between hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-800 transition-all text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-800/30">
                      {surah.number}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">{surah.englishName}</h3>
                      <p className="text-xs text-gray-500 line-clamp-1">{surah.englishNameTranslation}</p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="font-arabic text-xl font-bold text-gray-900 dark:text-white mb-1">{surah.name.replace('سُورَةُ ', '')}</span>
                    <span className="text-[10px] uppercase font-bold text-gray-400">{surah.numberOfAyahs} V.</span>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="sticky top-0 z-20 bg-gray-50/90 dark:bg-gray-900/90 backdrop-blur-md pt-4 pb-4 mb-6 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
             <button 
               onClick={() => setActiveSurah(null)}
               className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm font-medium"
             >
               <ArrowLeft className="mr-2" size={18} />
               {t("common.back")}
             </button>
             
             {surahArabic && (
               <div className="text-center sm:text-right flex-1 w-full flex flex-col items-center sm:items-end">
                 <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-arabic">
                   {surahArabic.name}
                 </h2>
                 <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                   Sourate {surahArabic.englishName} • {surahArabic.numberOfAyahs} Versets
                 </p>
               </div>
             )}

             <div className="flex flex-wrap items-center justify-center gap-2">
               {surahArabic && (
                 <>
                   <button 
                     onClick={() => {
                       if (isPlaying && playingAyah) {
                         if (audioRef.current) audioRef.current.pause();
                         setIsPlaying(false);
                         setPlayingAyah(null);
                       } else if (surahArabic.ayahs.length > 0) {
                         playAudio(surahArabic.ayahs[0]);
                       }
                     }}
                     className={`px-3 py-2 rounded-xl transition-colors shadow-sm border flex items-center gap-2 text-sm font-medium ${isPlaying ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400' : 'bg-white border-gray-200 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300'}`}
                     title={isPlaying ? "Mettre en pause la lecture par verset" : "Lecture par verset (suivie)"}
                   >
                     {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                     <span className="hidden sm:inline">Verset</span>
                   </button>
                   
                   <button 
                     onClick={playGlobalSurah}
                     className={`px-3 py-2 rounded-xl transition-colors shadow-sm border flex items-center gap-2 text-sm font-medium ${currentTrack?.id === `surah-${activeSurah}-${selectedReciterId}` && globalIsPlaying ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-gray-200 text-gray-700 hover:text-emerald-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:text-emerald-400'}`}
                     title="Écouter la sourate en arrière-plan"
                   >
                     {currentTrack?.id === `surah-${activeSurah}-${selectedReciterId}` && globalIsPlaying ? <Pause size={18} /> : <Headphones size={18} />}
                     <span className="hidden sm:inline">Arrière-plan</span>
                   </button>
                 </>
               )}

               <button 
                 onClick={() => setShowSettings(true)}
                 className={`p-2 rounded-xl transition-colors shadow-sm border bg-white border-gray-200 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300`}
               >
                 <Settings size={20} />
               </button>
             </div>
           </div>

           <AnimatePresence>
             {showSettings && (
               <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.95 }}
                   className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-6 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                 >
                   <div className="flex items-center justify-between mb-6">
                     <h3 className="font-bold text-xl text-gray-900 dark:text-white">Paramètres</h3>
                     <button 
                       onClick={() => setShowSettings(false)}
                       className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-700/50 rounded-full transition-colors"
                     >
                       <X size={20} />
                     </button>
                   </div>
                   
                   <div className="space-y-8">
                     <div>
                       <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                         <Headphones size={18} className="text-emerald-500" /> Récitateur (Arrière-plan & Versets)
                       </label>
                       <select
                         value={selectedReciterId}
                         onChange={(e) => setSelectedReciterId(e.target.value)}
                         className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                       >
                         {QURAN_RECITERS.map(r => (
                           <option key={r.id} value={r.id}>{r.name}</option>
                         ))}
                       </select>
                     </div>

                     <div>
                       <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                         <Type size={18} className="text-emerald-500" /> Taille du texte
                       </label>
                       <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800">
                         <span className="text-sm font-medium text-gray-500">A</span>
                         <input
                           type="range"
                           min="1"
                           max="40"
                           value={fontSize}
                           onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                           className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-emerald-500"
                         />
                         <span className="text-xl font-bold text-gray-500">A</span>
                       </div>
                     </div>
                     
                     <div>
                       <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                         <AlignJustify size={18} className="text-emerald-500" /> Langues affichées
                       </label>
                       <div className="flex flex-wrap gap-3">
                         <button onClick={() => setShowArabic(!showArabic)} className={`px-4 py-2 rounded-xl text-sm font-bold border transition-colors ${showArabic ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm' : 'bg-white border-gray-200 text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 hover:border-emerald-300'}`}>
                           Arabe
                         </button>
                         <button onClick={() => setShowFrench(!showFrench)} className={`px-4 py-2 rounded-xl text-sm font-bold border transition-colors ${showFrench ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm' : 'bg-white border-gray-200 text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 hover:border-emerald-300'}`}>
                           Français
                         </button>
                         <button onClick={() => setShowEnglish(!showEnglish)} className={`px-4 py-2 rounded-xl text-sm font-bold border transition-colors ${showEnglish ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm' : 'bg-white border-gray-200 text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 hover:border-emerald-300'}`}>
                           English
                         </button>
                         <button onClick={() => setShowHausa(!showHausa)} className={`px-4 py-2 rounded-xl text-sm font-bold border transition-colors ${showHausa ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm' : 'bg-white border-gray-200 text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 hover:border-emerald-300'}`}>
                           Hausa
                         </button>
                       </div>
                     </div>

                     <div>
                       <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                         <Volume2 size={18} className="text-emerald-500" /> Lecture Audio (Verset par Verset)
                       </label>
                       <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800">
                         <label className="flex items-center gap-3 cursor-pointer">
                           <input 
                             type="checkbox" 
                             checked={autoPlayNext}
                             onChange={(e) => setAutoPlayNext(e.target.checked)}
                             className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600"
                           />
                           <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Passer automatiquement au verset suivant</span>
                         </label>
                       </div>
                     </div>
                   </div>
                 </motion.div>
               </div>
             )}
           </AnimatePresence>

           {loadingSurah ? (
             <div className="flex flex-col items-center justify-center py-20">
               <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
               <p className="text-gray-500">Chargement de la sourate...</p>
             </div>
           ) : surahArabic && (
             <div className="space-y-6">
                {(surahArabic.number !== 1 && surahArabic.number !== 9) && showArabic && (
                  <div className="text-center py-8 mb-4 border-b border-gray-100 dark:border-gray-800">
                    <p className="font-arabic text-gray-900 dark:text-white leading-[2] mb-2" style={getArabicStyle()}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
                  </div>
                )}
                
                {surahArabic.ayahs.map((ayah, i) => {
                  const frAyah = surahFrench?.ayahs[i];
                  const enAyah = surahEnglish?.ayahs[i];
                  const haAyah = surahHausa?.ayahs[i];
                  
                  return (
                    <div 
                      key={ayah.number} 
                      ref={(el) => ayahRefs.current[ayah.number] = el}
                      className={`bg-white dark:bg-gray-800 border ${playingAyah === ayah.number ? 'border-emerald-500 dark:border-emerald-500 ring-2 ring-emerald-500/20 shadow-md' : 'border-gray-100 dark:border-gray-700'} rounded-2xl p-5 sm:p-8 shadow-sm flex flex-col space-y-6 transition-all duration-300`}
                    >
                       <div className="flex justify-between items-start">
                         <div className="flex flex-col items-center gap-3 mt-2 shrink-0">
                           <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex items-center justify-center font-bold text-gray-500">
                             {ayah.numberInSurah}
                           </div>
                           {ayah.audio && (
                             <button 
                               onClick={() => playAudio(ayah)}
                               className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${playingAyah === ayah.number ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-emerald-500 dark:bg-gray-900 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-emerald-400'}`}
                             >
                               {playingAyah === ayah.number ? <Pause size={18} /> : <Play size={18} className="ml-1" />}
                             </button>
                           )}
                         </div>
                         {showArabic && (
                           <div className="flex-1 ml-4" dir="rtl">
                             <p className="font-arabic text-gray-900 dark:text-white text-justify" style={getArabicStyle()}>
                               {ayah.text.replace('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ', '')} 
                               <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-sm mx-2">
                                 {ayah.numberInSurah.toLocaleString('ar-SA')}
                               </span>
                             </p>
                           </div>
                         )}
                       </div>
                       
                       {(showFrench || showEnglish || showHausa) && (
                         <div className="pt-4 border-t border-gray-100 dark:border-gray-700 space-y-4">
                           {showFrench && frAyah && (
                             <div>
                               <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1 block">Français</span>
                               <p className="text-gray-600 dark:text-gray-300 font-serif leading-relaxed" style={getTranslationStyle()}>
                                 {frAyah.text}
                               </p>
                             </div>
                           )}
                           {showEnglish && enAyah && (
                             <div>
                               <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1 block">English</span>
                               <p className="text-gray-600 dark:text-gray-300 font-serif leading-relaxed" style={getTranslationStyle()}>
                                 {enAyah.text}
                               </p>
                             </div>
                           )}
                           {showHausa && haAyah && (
                             <div>
                               <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1 block">Hausa</span>
                               <p className="text-gray-600 dark:text-gray-300 font-serif leading-relaxed" style={getTranslationStyle()}>
                                 {haAyah.text}
                               </p>
                             </div>
                           )}
                         </div>
                       )}
                    </div>
                  );
                })}
             </div>
           )}
        </div>
      )}
    </div>
  );
};
