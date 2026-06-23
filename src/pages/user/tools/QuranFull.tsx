import React, { useState, useEffect } from 'react';
import { BookOpen, ArrowLeft, Search, Play, Pause, ChevronDown, AlignJustify, Settings, Type } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

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

  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
  const [showArabic, setShowArabic] = useState(true);
  const [showFrench, setShowFrench] = useState(true);
  const [showEnglish, setShowEnglish] = useState(false);
  const [showHausa, setShowHausa] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const getArabicSizeClass = () => {
    switch(fontSize) {
      case 'sm': return 'text-2xl sm:text-3xl leading-[2]';
      case 'md': return 'text-3xl sm:text-4xl leading-[2.2]';
      case 'lg': return 'text-4xl sm:text-5xl leading-[2.4]';
      case 'xl': return 'text-5xl sm:text-6xl leading-[2.6]';
      default: return 'text-3xl sm:text-4xl leading-[2.2]';
    }
  };

  const getTranslationSizeClass = () => {
    switch(fontSize) {
      case 'sm': return 'text-sm sm:text-base';
      case 'md': return 'text-base sm:text-lg';
      case 'lg': return 'text-lg sm:text-xl';
      case 'xl': return 'text-xl sm:text-2xl';
      default: return 'text-base sm:text-lg';
    }
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

  const loadSurah = async (number: number) => {
    setActiveSurah(number);
    setLoadingSurah(true);
    setSurahArabic(null);
    setSurahFrench(null);
    setSurahEnglish(null);
    setSurahHausa(null);
    
    try {
      const [arRes, frRes, enRes, haRes] = await Promise.all([
        fetch(`https://api.alquran.cloud/v1/surah/${number}/ar.alafasy`),
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
              Retour aux Outils
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <BookOpen className="text-emerald-500" />
              Le Saint Coran (Al-Qur'an)
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Lisez, étudiez et méditez sur les paroles d'Allah. Textes en arabe et traduction française.
            </p>
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
               Retour
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

             <button 
               onClick={() => setShowSettings(!showSettings)}
               className={`p-2 rounded-xl transition-colors shadow-sm border ${showSettings ? 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400' : 'bg-white border-gray-200 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300'}`}
             >
               <Settings size={20} />
             </button>
           </div>

           <AnimatePresence>
             {showSettings && (
               <motion.div 
                 initial={{ height: 0, opacity: 0 }}
                 animate={{ height: 'auto', opacity: 1 }}
                 exit={{ height: 0, opacity: 0 }}
                 className="overflow-hidden mb-6"
               >
                 <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 sm:p-6 shadow-sm">
                   <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Paramètres d'affichage</h3>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                         <Type size={16} /> Taille du texte
                       </label>
                       <div className="flex bg-gray-100 dark:bg-gray-900 rounded-xl p-1">
                         {['sm', 'md', 'lg', 'xl'].map(size => (
                           <button
                             key={size}
                             onClick={() => setFontSize(size as any)}
                             className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${fontSize === size ? 'bg-white dark:bg-gray-800 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                           >
                             {size.toUpperCase()}
                           </button>
                         ))}
                       </div>
                     </div>
                     
                     <div>
                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                         <AlignJustify size={16} /> Langues
                       </label>
                       <div className="flex flex-wrap gap-2">
                         <button onClick={() => setShowArabic(!showArabic)} className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${showArabic ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400' : 'bg-white border-gray-200 text-gray-500 dark:bg-gray-800 dark:border-gray-700'}`}>
                           Arabe
                         </button>
                         <button onClick={() => setShowFrench(!showFrench)} className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${showFrench ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400' : 'bg-white border-gray-200 text-gray-500 dark:bg-gray-800 dark:border-gray-700'}`}>
                           Français
                         </button>
                         <button onClick={() => setShowEnglish(!showEnglish)} className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${showEnglish ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400' : 'bg-white border-gray-200 text-gray-500 dark:bg-gray-800 dark:border-gray-700'}`}>
                           English
                         </button>
                         <button onClick={() => setShowHausa(!showHausa)} className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${showHausa ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400' : 'bg-white border-gray-200 text-gray-500 dark:bg-gray-800 dark:border-gray-700'}`}>
                           Hausa
                         </button>
                       </div>
                     </div>
                   </div>
                 </div>
               </motion.div>
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
                    <p className={`font-arabic ${getArabicSizeClass()} text-gray-900 dark:text-white leading-[2] mb-2`}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
                  </div>
                )}
                
                {surahArabic.ayahs.map((ayah, i) => {
                  const frAyah = surahFrench?.ayahs[i];
                  const enAyah = surahEnglish?.ayahs[i];
                  const haAyah = surahHausa?.ayahs[i];
                  
                  return (
                    <div key={ayah.number} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 sm:p-8 shadow-sm flex flex-col space-y-6">
                       <div className="flex justify-between items-start">
                         <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex items-center justify-center font-bold text-gray-500 shrink-0 mt-2">
                           {ayah.numberInSurah}
                         </div>
                         {showArabic && (
                           <div className="flex-1 ml-4" dir="rtl">
                             <p className={`font-arabic ${getArabicSizeClass()} text-gray-900 dark:text-white text-justify`}>
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
                               <p className={`text-gray-600 dark:text-gray-300 font-serif leading-relaxed ${getTranslationSizeClass()}`}>
                                 {frAyah.text}
                               </p>
                             </div>
                           )}
                           {showEnglish && enAyah && (
                             <div>
                               <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1 block">English</span>
                               <p className={`text-gray-600 dark:text-gray-300 font-serif leading-relaxed ${getTranslationSizeClass()}`}>
                                 {enAyah.text}
                               </p>
                             </div>
                           )}
                           {showHausa && haAyah && (
                             <div>
                               <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1 block">Hausa</span>
                               <p className={`text-gray-600 dark:text-gray-300 font-serif leading-relaxed ${getTranslationSizeClass()}`}>
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
