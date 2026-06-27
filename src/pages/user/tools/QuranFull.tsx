import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, ArrowLeft, ArrowRight, Search, Play, Pause, ChevronDown, AlignJustify, Settings, Type, Volume2, FastForward, Headphones, X, Download, Check, Bookmark, BookmarkCheck, Share2, RefreshCw, Moon, Sun, Activity, Clock, TrendingUp, Copy, Image as ImageIcon, Maximize, Minimize2, ListPlus, ListMusic, GripVertical, Database, CloudOff } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { toPng } from 'html-to-image';
import { useAudio } from '../../../contexts/AudioContext';
import { get, set } from 'idb-keyval';

const QURAN_RECITERS = [
  { id: 'alafasy', name: 'Mishary Rashid Alafasy', server: 'https://server8.mp3quran.net/afs/', apiId: 'ar.alafasy' },
  { id: 'sudais', name: 'Abdur Rahman As-Sudais', server: 'https://server11.mp3quran.net/sds/', apiId: 'ar.abdurrahmaansudais' },
  { id: 'shuraym', name: 'Saud Al-Shuraim', server: 'https://server7.mp3quran.net/shur/', apiId: 'ar.saoodshuraym' },
  { id: 'husary', name: 'Mahmoud Khalil Al-Husary', server: 'https://server13.mp3quran.net/husr/', apiId: 'ar.husary' },
  { id: 'maher', name: 'Maher Al Muaiqly', server: 'https://server12.mp3quran.net/maher/', apiId: 'ar.mahermuaiqly' }
];

const MUSHAF_OPTIONS = [
  { id: 'Amiri Quran', name: 'Uthmani (Amiri)', desc: 'Standard Uthmani script', preview: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\n\nأَرَءَيْتَ ٱلَّذِى يُكَذِّبُ بِٱلدِّينِ ﴿١﴾', style: {fontFamily: '"Amiri Quran", "Amiri", serif'} },
  { id: 'Tajweed', name: 'Mushaf Tajweed', desc: 'Color coded tajweed rules', preview: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\n\nأَرَءَيْتَ ٱلَّذِى يُكَذِّبُ بِٱلدِّينِ ﴿١﴾', style: {fontFamily: '"Amiri Quran", "Amiri", serif'}, isTajweed: true },
  { id: 'Amiri', name: 'Amiri', desc: 'Classic Madani script', preview: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\n\nأَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ ﴿١﴾', style: {fontFamily: '"Amiri", serif'} },
  { id: 'Lateef', name: 'Lateef', desc: 'Clear and readable', preview: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\n\nأَرَءَيْتَ ٱلَّذِى يُكَذِّبُ بِٱلدِّينِ ﴿١﴾', style: {fontFamily: '"Lateef", serif', fontSize: '1.2em'} },
  { id: 'Scheherazade New', name: 'IndoPak', desc: 'Popular in South Asia', preview: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\n\nأَرَءَيْتَ ٱلَّذِى يُكَذِّبُ بِٱلدِّينِ ﴿١﴾', style: {fontFamily: '"Scheherazade New", serif'} },
  { id: 'Noto Naskh Arabic', name: 'Naskh', desc: 'Alternative modern script', preview: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\n\nأَرَءَيْتَ ٱلَّذِى يُكَذِّبُ بِٱلدِّينِ ﴿١﴾', style: {fontFamily: '"Noto Naskh Arabic", serif'} },
  { id: 'KFGQPC Uthman Taha Naskh', name: 'Adwa (Uthman Taha)', desc: 'Standard printed script', preview: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\n\nأَرَءَيْتَ ٱلَّذِى يُكَذِّبُ بِٱلدِّينِ ﴿١﴾', style: {fontFamily: '"KFGQPC Uthman Taha Naskh", "Amiri", serif'} }
];

const toArabicNumeral = (num: number | undefined | null) => {
  if (num === null || num === undefined) return '';
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().split('').map(digit => arabicNumbers[parseInt(digit)]).join('');
};

const TAJWEED_COLORS: Record<string, string> = {
  h: 'text-gray-400', // silent
  l: 'text-gray-400', 
  s: 'text-gray-400', 
  a: 'text-gray-400', 
  w: 'text-gray-400', 
  n: 'text-pink-600 dark:text-pink-400', // normal madd
  p: 'text-pink-600 dark:text-pink-400', // madd
  m: 'text-red-600 dark:text-red-500', // madd lazim
  q: 'text-blue-500 dark:text-blue-400', // qalqalah
  i: 'text-blue-500 dark:text-blue-400', // iqlab
  u: 'text-blue-500 dark:text-blue-400', 
  g: 'text-orange-500 dark:text-orange-400', // ghunnah
  f: 'text-emerald-600 dark:text-emerald-500', // ikhfa
  c: 'text-emerald-600 dark:text-emerald-500', 
  o: 'text-teal-600 dark:text-teal-400', // idgham
  d: 'text-teal-600 dark:text-teal-400',
};

const renderTajweed = (text: string) => {
  if (!text) return null;
  const parts = text.split(/(\[[a-z][^\[]*\[[^\]]+\])/g);
  return parts.map((part, i) => {
    if (part.startsWith('[') && part.endsWith(']')) {
      const match = part.match(/\[([a-z])[^\[]*\[([^\]]+)\]/);
      if (match) {
        const [, code, letter] = match;
        const colorClass = TAJWEED_COLORS[code] || '';
        return <span key={i} className={colorClass}>{letter}</span>;
      }
    }
    return <span key={i}>{part}</span>;
  });
};

const SurahBanner = ({ number, name, numberOfAyahs, fontFamily, fontSizePx }: { number: number, name: string, numberOfAyahs: number, fontFamily?: string, fontSizePx?: number }) => {
  return (
    <div className="w-full mb-8 flex items-center justify-between relative overflow-hidden select-none px-2 sm:px-4 py-8">
      {/* Left box: Surah number */}
      <div className="flex flex-col items-center justify-center z-10 w-20 sm:w-24 shrink-0" dir="rtl">
         <span className="text-[10px] sm:text-xs font-arabic text-emerald-600 dark:text-emerald-400 mb-1">ترتيبها</span>
         <span className="font-arabic text-xl sm:text-3xl text-gray-800 dark:text-gray-200">{toArabicNumeral(number)}</span>
      </div>

      {/* Center: Surah Name */}
      <div className="flex-1 flex items-center justify-center z-10 px-2 sm:px-6 text-center">
        <h2 className="font-arabic text-emerald-800 dark:text-emerald-300 leading-relaxed font-bold" style={{ fontFamily: fontFamily || '"Amiri Quran", serif', fontSize: fontSizePx ? `${fontSizePx + 8}px` : 'clamp(2rem, 5vw, 3rem)' }}>
          {name}
        </h2>
      </div>

      {/* Right box: Ayah count */}
      <div className="flex flex-col items-center justify-center z-10 w-20 sm:w-24 shrink-0" dir="rtl">
         <span className="text-[10px] sm:text-xs font-arabic text-emerald-600 dark:text-emerald-400 mb-1">آياتها</span>
         <span className="font-arabic text-xl sm:text-3xl text-gray-800 dark:text-gray-200">{toArabicNumeral(numberOfAyahs)}</span>
      </div>
      
      <div className="absolute inset-x-[15%] bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>
      <div className="absolute inset-x-[15%] top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>
    </div>
  );
};


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

interface AyahBookmark {
  surahNumber: number;
  ayahNumber: number;
  ayahNumberInSurah: number;
  surahName: string;
  note: string;
  timestamp: number;
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
  const [isPlayingFromCache, setIsPlayingFromCache] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  
  const [activeSurah, setActiveSurah] = useState<number | null>(null);
  const [surahArabic, setSurahArabic] = useState<SurahData | null>(null);
  const [surahTajweed, setSurahTajweed] = useState<SurahData | null>(null);
  const [surahFrench, setSurahFrench] = useState<SurahData | null>(null);
  const [surahEnglish, setSurahEnglish] = useState<SurahData | null>(null);
  const [surahHausa, setSurahHausa] = useState<SurahData | null>(null);
  const [loadingSurah, setLoadingSurah] = useState(false);

  const [fontSize, setFontSize] = useState<number>(() => {
    return window.innerWidth < 768 ? 4 : 12;
  });
  const [fontFamily, setFontFamily] = useState<string>('Amiri');
  const [lineHeight, setLineHeight] = useState<number>(2.5);
  const [surahSearchQuery, setSurahSearchQuery] = useState('');
  const [showAyahSearch, setShowAyahSearch] = useState(false);
  const [readSurahs, setReadSurahs] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('asrarhub_read_surahs');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  
  const [bookmarks, setBookmarks] = useState<AyahBookmark[]>(() => {
    try {
      const saved = localStorage.getItem('asrarhub_quran_bookmarks');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  interface RoqyaPlaylist {
    id: string;
    name: string;
    ayahs: { surahNumber: number, ayahNumberInSurah: number, text?: string }[];
  }

  const [roqyaPlaylists, setRoqyaPlaylists] = useState<RoqyaPlaylist[]>(() => {
    try {
      const saved = localStorage.getItem('asrarhub_roqya_playlists');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('asrarhub_roqya_playlists', JSON.stringify(roqyaPlaylists));
  }, [roqyaPlaylists]);

  interface LastReadPosition {
    surahNumber: number;
    ayahNumber: number;
    ayahNumberInSurah: number;
    surahName: string;
    timestamp: number;
  }
  const [lastReadPosition, setLastReadPosition] = useState<LastReadPosition | null>(() => {
    try {
      const saved = localStorage.getItem('asrarhub_last_read_position');
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      return (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) ? parsed : null;
    } catch {
      return null;
    }
  });

  const [isAutoNightModeEnabled, setIsAutoNightModeEnabled] = useState(() => {
    return localStorage.getItem('asrarhub_auto_night_mode') === 'true';
  });
  const [isCurrentlyNight, setIsCurrentlyNight] = useState(false);

  useEffect(() => {
    const checkTime = () => {
      const hour = new Date().getHours();
      setIsCurrentlyNight(hour >= 19 || hour < 6); // 7 PM to 6 AM
    };
    checkTime();
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const applyEyeComfort = isAutoNightModeEnabled && isCurrentlyNight;

  useEffect(() => {
    if (applyEyeComfort) {
      document.documentElement.classList.add('dark');
      // Store original theme to restore? Actually, keeping it dark is fine for eye comfort
    }
  }, [applyEyeComfort]);

  interface ReadingStats {
    pagesRead: number;
    timeSpentSeconds: number;
    ayahsReadCount: number;
  }
  const [readingStats, setReadingStats] = useState<ReadingStats>(() => {
    try {
      const saved = localStorage.getItem('asrarhub_reading_stats');
      if (!saved) return { pagesRead: 0, timeSpentSeconds: 0, ayahsReadCount: 0 };
      const parsed = JSON.parse(saved);
      return (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) ? parsed : { pagesRead: 0, timeSpentSeconds: 0, ayahsReadCount: 0 };
    } catch {
      return { pagesRead: 0, timeSpentSeconds: 0, ayahsReadCount: 0 };
    }
  });

  useEffect(() => {
    localStorage.setItem('asrarhub_reading_stats', JSON.stringify(readingStats));
  }, [readingStats]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (activeSurah !== null) {
      interval = setInterval(() => {
        setReadingStats(prev => ({
          ...prev,
          timeSpentSeconds: prev.timeSpentSeconds + 1
        }));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeSurah]);

  useEffect(() => {
    localStorage.setItem('asrarhub_last_read_position', JSON.stringify(lastReadPosition));
  }, [lastReadPosition]);

  useEffect(() => {
    localStorage.setItem('asrarhub_auto_night_mode', isAutoNightModeEnabled.toString());
  }, [isAutoNightModeEnabled]);

  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('asrarhub_quran_search_history');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('asrarhub_quran_search_history', JSON.stringify(searchHistory));
  }, [searchHistory]);

  const [activeModal, setActiveModal] = useState<'bookmarks' | 'search' | 'dashboard' | 'settings' | null>(null);
  const [advancedSearchQuery, setAdvancedSearchQuery] = useState('');
  const [advancedSearchResults, setAdvancedSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check if we should auto-resume
    const params = new URLSearchParams(location.search);
    if (params.get('resume') === 'true' && lastReadPosition) {
      loadContent('surah', lastReadPosition.surahNumber);
      // Wait for load to finish then scroll to ayah
      setTimeout(() => {
        const element = document.getElementById(`ayah-${lastReadPosition.ayahNumberInSurah}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 1500);
    }
    
    // Check if we have a search query from dashboard
    const searchQuery = params.get('search');
    if (searchQuery) {
      setAdvancedSearchQuery(searchQuery);
      setActiveModal('search');
      // Execute search
      setTimeout(() => {
        handleAdvancedSearch(undefined, searchQuery);
      }, 500);
    }
  }, [location.search]);

  const handleAdvancedSearch = async (e?: React.FormEvent, directQuery?: string) => {
    if (e) e.preventDefault();
    const queryToUse = directQuery || advancedSearchQuery;
    if (!queryToUse.trim()) return;
    
    setSearchHistory(prev => {
      const filtered = prev.filter(q => q.toLowerCase() !== queryToUse.toLowerCase().trim());
      return [queryToUse.trim(), ...filtered].slice(0, 10); // Keep last 10
    });
    setAdvancedSearchQuery(queryToUse);
    setIsSearching(true);
    setAdvancedSearchResults([]);
    try {
      // Search in multiple languages simultaneously
      const [arRes, frRes, enRes] = await Promise.all([
        fetch(`https://api.alquran.cloud/v1/search/${encodeURIComponent(queryToUse)}/all/ar`).catch(() => null),
        fetch(`https://api.alquran.cloud/v1/search/${encodeURIComponent(queryToUse)}/all/fr`).catch(() => null),
        fetch(`https://api.alquran.cloud/v1/search/${encodeURIComponent(queryToUse)}/all/en`).catch(() => null)
      ]);

      let allMatches: any[] = [];
      
      if (arRes && arRes.ok) {
        const arData = await arRes.json();
        if (arData.code === 200 && arData.data?.matches) allMatches = [...allMatches, ...arData.data.matches];
      }
      
      if (frRes && frRes.ok) {
        const frData = await frRes.json();
        if (frData.code === 200 && frData.data?.matches) {
          // Add language tag
          const matchesWithLang = frData.data.matches.map((m: any) => ({...m, matchLang: 'fr'}));
          allMatches = [...allMatches, ...matchesWithLang];
        }
      }

      if (enRes && enRes.ok) {
        const enData = await enRes.json();
        if (enData.code === 200 && enData.data?.matches) {
           const matchesWithLang = enData.data.matches.map((m: any) => ({...m, matchLang: 'en'}));
           allMatches = [...allMatches, ...matchesWithLang];
        }
      }
      
      // Deduplicate by ayah number to avoid showing the same verse 3 times if word is similar
      // Wait, we WANT to show it, or maybe group them. Let's just deduplicate by verse number
      // and prefer showing the translation that matched, or the arabic if matched
      const uniqueMatches = [];
      const seenAyahs = new Set();
      
      for (const match of allMatches) {
        if (!seenAyahs.has(match.number)) {
          seenAyahs.add(match.number);
          uniqueMatches.push(match);
        }
      }

      setAdvancedSearchResults(uniqueMatches);
    } catch (err) {
      console.error("Search error:", err);
      setAdvancedSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const [bookmarkModalAyah, setBookmarkModalAyah] = useState<Ayah | null>(null);
  const [bookmarkNote, setBookmarkNote] = useState('');
  const [showBookmarksList, setShowBookmarksList] = useState(false);
  const [playlistModalAyah, setPlaylistModalAyah] = useState<Ayah | null>(null);
  const [showPlaylistsModal, setShowPlaylistsModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [playingPlaylist, setPlayingPlaylist] = useState<RoqyaPlaylist | null>(null);

  useEffect(() => {
    localStorage.setItem('asrarhub_read_surahs', JSON.stringify(readSurahs));
  }, [readSurahs]);

  useEffect(() => {
    localStorage.setItem('asrarhub_quran_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const saveBookmark = () => {
    if (!bookmarkModalAyah || !surahArabic) return;
    
    setBookmarks(prev => {
      const existingIdx = prev.findIndex(b => b.ayahNumber === bookmarkModalAyah.number);
      if (existingIdx >= 0) {
        const newBookmarks = [...prev];
        newBookmarks[existingIdx] = {
          ...newBookmarks[existingIdx],
          note: bookmarkNote,
          timestamp: Date.now()
        };
        return newBookmarks;
      } else {
        return [...prev, {
          surahNumber: bookmarkModalAyah.surah?.number || surahArabic.number,
          ayahNumber: bookmarkModalAyah.number,
          ayahNumberInSurah: bookmarkModalAyah.numberInSurah,
          surahName: bookmarkModalAyah.surah?.name || surahArabic.name,
          note: bookmarkNote,
          timestamp: Date.now()
        }];
      }
    });
    
    setBookmarkModalAyah(null);
    setBookmarkNote('');
  };

  const removeBookmark = (ayahNumber: number) => {
    setBookmarks(prev => prev.filter(b => b.ayahNumber !== ayahNumber));
  };

  const toggleReadSurah = (surahNumber: number) => {
    setReadSurahs(prev => 
      prev.includes(surahNumber) 
        ? prev.filter(n => n !== surahNumber)
        : [...prev, surahNumber]
    );
  };

  const [showArabic, setShowArabic] = useState(true);
  const [showFrench, setShowFrench] = useState(false);
  const [showEnglish, setShowEnglish] = useState(false);
  const [showHausa, setShowHausa] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showMushafSelector, setShowMushafSelector] = useState(false);
  const [showMarkers, setShowMarkers] = useState(false);
  const [readingMode, setReadingMode] = useState<'card' | 'mushaf'>('mushaf');
  const [fullScreenMode, setFullScreenMode] = useState(false);
  const [reminderTime, setReminderTime] = useState<string>(() => {
    return localStorage.getItem('asrarhub_quran_reminder') || '';
  });
  
  const [zoomedAyah, setZoomedAyah] = useState<{ text: string, numberInSurah: number, isTajweed: boolean, ayahNumber?: number, surahNumber?: number, surahName?: string } | null>(null);
  const [zoomedAyahBg, setZoomedAyahBg] = useState(0);
  const [zoomedAyahColor, setZoomedAyahColor] = useState(0);

  const ZOOM_BACKGROUNDS = [
    { id: 'default', class: 'bg-white dark:bg-gray-900', iconClass: 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700' },
    { id: 'emerald', class: 'bg-emerald-900', iconClass: 'bg-emerald-900' },
    { id: 'slate', class: 'bg-slate-900', iconClass: 'bg-slate-900' },
    { id: 'sand', class: 'bg-[#FDFBF7]', iconClass: 'bg-[#FDFBF7] border border-gray-200' },
    { id: 'purple', class: 'bg-purple-950', iconClass: 'bg-purple-950' },
    { id: 'gradient-emerald', class: 'bg-gradient-to-br from-emerald-500 to-teal-900', iconClass: 'bg-gradient-to-br from-emerald-500 to-teal-900' },
    { id: 'gradient-sunset', class: 'bg-gradient-to-br from-amber-500 to-rose-900', iconClass: 'bg-gradient-to-br from-amber-500 to-rose-900' },
    { id: 'gradient-ocean', class: 'bg-gradient-to-br from-blue-600 to-slate-900', iconClass: 'bg-gradient-to-br from-blue-600 to-slate-900' },
    { id: 'pattern-islamic', class: 'bg-emerald-900 bg-[url("https://www.transparenttextures.com/patterns/arabesque.png")]', iconClass: 'bg-emerald-900 bg-[url("https://www.transparenttextures.com/patterns/arabesque.png")]' },
  ];

  const ZOOM_TEXT_COLORS = [
    { id: 'default', class: 'text-gray-900 dark:text-[#e4e4e7]', iconClass: 'bg-gray-900 dark:bg-gray-200' },
    { id: 'white', class: '!text-white', iconClass: 'bg-white border border-gray-300' },
    { id: 'black', class: '!text-black', iconClass: 'bg-black' },
    { id: 'emerald', class: '!text-emerald-400', iconClass: 'bg-emerald-400' },
    { id: 'gold', class: '!text-amber-400', iconClass: 'bg-amber-400' },
  ];

  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const [selectedReciterId, setSelectedReciterId] = useState(QURAN_RECITERS[0].id);
  const { playTrack, playPlaylist, currentTrack, isPlaying: globalIsPlaying, pause: globalPause, resume: globalResume } = useAudio();

  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlayNext, setAutoPlayNext] = useState(true);
  const [autoPlayFirstAyah, setAutoPlayFirstAyah] = useState(false);
  const ROQYA_REPEAT_COUNTS = [0, 3, 7, 11, 21, 33, 41, 70, 71, 73, 111, 313, 666, 777, 786, 1000, 1111];
  const [repeatCount, setRepeatCount] = useState<number>(0);
  const [contentRepeatCount, setContentRepeatCount] = useState<number>(0);
  const repeatLeftRef = useRef<number>(0);
  const contentRepeatLeftRef = useRef<number>(0);
  const playOnlyOneRef = useRef<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ayahRefs = useRef<{[key: number]: HTMLDivElement | null}>({});
  
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [expandedDownloadOption, setExpandedDownloadOption] = useState<string | null>(null);
  const [downloadingOffline, setDownloadingOffline] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadMessage, setDownloadMessage] = useState<string>('');
  const [hideDownloadToast, setHideDownloadToast] = useState(false);

  const [downloadedItems, setDownloadedItems] = useState<{ [key: string]: number[] }>(() => {
    try {
      const saved = localStorage.getItem('quran_downloaded_items');
      if (!saved) return {};
      const parsed = JSON.parse(saved);
      return (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) ? parsed : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('quran_downloaded_items', JSON.stringify(downloadedItems));
  }, [downloadedItems]);

  const [pausedDownloads, setPausedDownloads] = useState<{ id: string, type: 'surah' | 'page' | 'hizbQuarter' | 'juz' | 'ruku', remainingIds: number[], progress: number, total: number, label: string }[]>(() => {
    try {
      const saved = localStorage.getItem('quran_paused_downloads');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('quran_paused_downloads', JSON.stringify(pausedDownloads));
  }, [pausedDownloads]);

  useEffect(() => {
    if (!activeSurah || !surahArabic) return;

    const observer = new IntersectionObserver((entries) => {
      // Find the most visible ayah
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          const ayahNumber = parseInt(entry.target.getAttribute('data-ayah-number') || '0', 10);
          if (ayahNumber > 0) {
            const ayah = surahArabic.ayahs.find(a => a.number === ayahNumber);
            if (ayah) {
              setLastReadPosition({
                surahNumber: ayah.surah?.number || surahArabic.number,
                ayahNumber: ayah.number,
                ayahNumberInSurah: ayah.numberInSurah,
                surahName: ayah.surah?.name || surahArabic.name,
                timestamp: Date.now()
              });
            }
          }
        }
      });
    }, { threshold: 0.5 });

    const currentRefs = Object.values(ayahRefs.current) as (Element | null)[];
    currentRefs.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => {
      currentRefs.forEach(ref => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [activeSurah, surahArabic, readingMode]);

  const fetchWithCache = async (url: string) => {
    try {
      const cached = await get(url);
      if (cached) return cached;
      
      let targetUrl = url;
      let isLocalIntercept = false;
      const reciterApiId = QURAN_RECITERS.find(r => r.id === selectedReciterId)?.apiId || 'ar.alafasy';
      
      if (url === 'https://api.alquran.cloud/v1/surah') {
        targetUrl = '/data/quran/surahs.json';
        isLocalIntercept = true;
      } else if (url.startsWith('https://api.alquran.cloud/v1/surah/') || 
                 url.startsWith('https://api.alquran.cloud/v1/juz/') || 
                 url.startsWith('https://api.alquran.cloud/v1/page/') || 
                 url.startsWith('https://api.alquran.cloud/v1/hizbQuarter/')) {
        const parts = url.split('/');
        const endpointType = parts[4]; // surah, juz, page, hizbQuarter
        const number = parts[5];
        const edition = parts[6];
        
        let localEditionDir = 'ar.alafasy';
        if (edition === 'quran-tajweed') localEditionDir = 'quran-tajweed';
        else if (edition === 'fr.hamidullah') localEditionDir = 'fr.hamidullah';
        else if (edition === 'en.sahih') localEditionDir = 'en.sahih';
        else if (edition === 'ha.gumi') localEditionDir = 'ha.gumi';
        
        if (endpointType === 'surah') {
            targetUrl = `/data/quran/${localEditionDir}/${number}.json`;
        } else {
            targetUrl = `/data/quran/${endpointType}/${localEditionDir}/${number}.json`;
        }
        
        isLocalIntercept = true;
      }

      // console.log(`[QuranFull] Fetching targetUrl: ${targetUrl} (isLocalIntercept: ${isLocalIntercept})`);
      let data;
      try {
        const res = await fetch(targetUrl);
        // console.log(`[QuranFull] Fetch res status for ${targetUrl}: ${res.status}`);
        
        if (!res.ok) {
           throw new Error(`Local fetch returned status: ${res.status}`);
        }
        
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
           throw new Error("Received HTML instead of JSON (likely 404 fallback)");
        }

        const text = await res.text();
        try {
          data = JSON.parse(text);
          if (!data || data.code !== 200) {
             // console.warn(`[QuranFull] Invalid local data for ${targetUrl}:`, data);
             throw new Error("Invalid local data");
          }
        } catch(e) {
          // console.error(`[QuranFull] JSON Parse failed for ${targetUrl}. Text length: ${text.length}`);
          throw new Error("JSON Parse failed");
        }
      } catch (localErr) {
        if (isLocalIntercept) {
          // Si l'interception locale échoue (fichier introuvable ou erreur de parse), on fetch directement depuis l'API distante
          // console.warn(`[QuranFull] Local fetch failed for ${targetUrl}, falling back to network api ${url}:`, localErr);
          const realRes = await fetch(url);
          // console.log(`[QuranFull] Network fetch status for ${url}: ${realRes.status}`);
          data = await realRes.json();
        } else {
          // console.error(`[QuranFull] Fetch failed for ${targetUrl}:`, localErr);
          throw localErr;
        }
      }

      if (isLocalIntercept && data && data.code === 200 && data.data && data.data.ayahs && url.includes(reciterApiId)) {
          data.data.ayahs = data.data.ayahs.map((a: any) => ({
              ...a,
              audio: `https://cdn.islamic.network/quran/audio/128/${reciterApiId}/${a.number}.mp3`
          }));
      }
      
      if (data && data.code === 200) {
        try {
          await set(url, data);
          console.log(`[QuranFull] Successfully cached data for ${url}`);
        } catch (idbSetErr) {
          console.warn(`[QuranFull] IDB set failed for ${url}:`, idbSetErr);
        }
      }
      return data;
    } catch (err) {
      console.warn(`[QuranFull] fetchWithCache final error for ${url}, falling back to proxy:`, err);
      if (url !== 'https://api.alquran.cloud/v1/surah' && !url.includes('/data/quran/')) {
         try {
           const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
           console.log(`[QuranFull] Fetching via proxy: ${proxyUrl}`);
           const res = await fetch(proxyUrl);
           const proxyData = await res.json();
           const data = JSON.parse(proxyData.contents);
           if (data && data.code === 200) {
             try { await set(url, data); } catch (e) {}
           }
           return data;
         } catch(e) {
           console.warn('Proxy fallback failed:', e);
         }
      }
      const cached = await get(url);
      if (cached) return cached;
      throw err;
    }
  };

  const downloadForOffline = async (type: 'surah' | 'page' | 'hizbQuarter' | 'juz' | 'ruku', specificIds?: number[], resumeId?: string) => {
    setShowDownloadModal(false);
    setDownloadingOffline(true);
    setHideDownloadToast(false);
    
    let itemsToDownload: number[] = [];
    let initialProgress = 0;
    let totalItems = 0;
    let label = '';
    
    if (resumeId) {
      const pausedItem = pausedDownloads.find(p => p.id === resumeId);
      if (!pausedItem) {
        setDownloadingOffline(false);
        return;
      }
      itemsToDownload = pausedItem.remainingIds;
      initialProgress = pausedItem.progress;
      totalItems = pausedItem.total;
      label = pausedItem.label;
      setPausedDownloads(prev => prev.filter(p => p.id !== resumeId));
    } else {
      let maxCount = 114;
      if (type === 'page') maxCount = 604;
      if (type === 'juz') maxCount = 30;
      if (type === 'hizbQuarter') maxCount = 240;
      if (type === 'ruku') maxCount = 556;
      itemsToDownload = specificIds || Array.from({ length: maxCount }, (_, i) => i + 1);
      totalItems = itemsToDownload.length;
      label = specificIds ? `${type === 'surah' ? 'Sourate(s)' : type} ${specificIds.join(', ')}` : `Tout le Coran (${type})`;
    }

    setDownloadProgress(Math.round((initialProgress / totalItems) * 100));

    try {
      const reciterApiId = QURAN_RECITERS.find(r => r.id === selectedReciterId)?.apiId || 'ar.alafasy';
      const editions = [
        reciterApiId,
        'fr.hamidullah',
        'en.sahih',
        'ha.gumi'
      ];
      
      await fetchWithCache('https://api.alquran.cloud/v1/surah');
      
      let processed = initialProgress;
      const remainingIdsToProcess = [...itemsToDownload];

      for (const s of itemsToDownload) {
        setDownloadMessage(`Téléchargement en cours... (${s})`);
        for (const edition of editions) {
          let success = false;
          let retries = 3;
          while (!success && retries > 0) {
            try {
              await fetchWithCache(`https://api.alquran.cloud/v1/${type}/${s}/${edition}`);
              await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
              success = true;
            } catch (e) {
              console.warn(`Failed to fetch ${type} ${s} edition ${edition}, retrying... (${retries} left)`);
              retries--;
              await new Promise(resolve => setTimeout(resolve, 2000));
            }
          }
          if (!success) {
            throw new Error(`Failed to download ${type} ${s} completely after retries.`);
          }
        }
        
        setDownloadedItems(prev => {
          const prevList = prev[type] || [];
          if (!prevList.includes(s)) {
            return { ...prev, [type]: [...prevList, s] };
          }
          return prev;
        });

        try {
          const mainEditionData = await fetchWithCache(`https://api.alquran.cloud/v1/${type}/${s}/${reciterApiId}`);
          if (mainEditionData && mainEditionData.data && mainEditionData.data.ayahs) {
            const audioCache = await caches.open('quran-audio-cache');
            let audioProcessed = 0;
            const ayahs = mainEditionData.data.ayahs;
            for (const ayah of ayahs) {
              if (ayah.audio) {
                const cached = await audioCache.match(ayah.audio);
                if (!cached) {
                   try {
                     const response = await fetch(ayah.audio);
                     if (response.ok) {
                       await audioCache.put(ayah.audio, response);
                     }
                   } catch(e) { console.warn("Failed to cache audio", ayah.audio) }
                }
              }
              audioProcessed++;
              if (audioProcessed % 5 === 0) {
                 setDownloadMessage(`Téléchargement de l'audio... (${s}) ${Math.round((audioProcessed / ayahs.length) * 100)}%`);
              }
            }
          }
        } catch (e) {
          console.warn("Failed to download audio for offline mode", e);
        }

        remainingIdsToProcess.shift(); // Remove the successfully processed item
        processed++;
        setDownloadProgress(Math.round((processed / totalItems) * 100));
      }
      
      setDownloadMessage('');
      setTimeout(() => alert('Téléchargement terminé. Le contenu est maintenant disponible hors ligne.'), 500);
    } catch (err) {
      console.error('Download error:', err);
      // We failed to download everything, save the remainder to pausedDownloads
      setPausedDownloads(prev => {
        const remainingIdsToProcess = itemsToDownload.slice(itemsToDownload.length - (itemsToDownload.length - Math.round((downloadProgress / 100) * totalItems) + initialProgress)); // rough calculation
        // actually we can just re-calculate from downloadProgress or better use the remainingIdsToProcess if we hoisted it
        return [...prev, {
          id: resumeId || Date.now().toString(),
          type,
          remainingIds: itemsToDownload.slice(Math.floor((downloadProgress / 100) * totalItems) - initialProgress),
          progress: Math.floor((downloadProgress / 100) * totalItems),
          total: totalItems,
          label
        }];
      });
      alert('Erreur de connexion. Le téléchargement a été mis en pause et ajouté à vos téléchargements.');
    } finally {
      setDownloadingOffline(false);
      setDownloadProgress(0);
    }
  };

  const [isToolbarExpanded, setIsToolbarExpanded] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState<'left' | 'right'>('right');
  
  const getArabicStyle = () => {
    return { fontSize: `${15 + fontSize}px`, lineHeight: lineHeight.toString(), fontFamily: `"${fontFamily}", serif` };
  };

  const getTranslationStyle = () => {
    return { fontSize: `${11 + (fontSize * 0.4)}px`, lineHeight: '1.6' };
  };

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const data = await fetchWithCache('https://api.alquran.cloud/v1/surah');
        if (data && data.code === 200) {
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
    if (activeSurah && activeSurah !== 999) {
      const reciterApiId = QURAN_RECITERS.find(r => r.id === selectedReciterId)?.apiId || 'ar.alafasy';
      fetchWithCache(`https://api.alquran.cloud/v1/surah/${activeSurah}/${reciterApiId}`)
        .then(data => {
          if (data && data.code === 200) {
            setSurahArabic(data.data);
          }
        })
        .catch(console.error);
    }
  }, [selectedReciterId]);

  const playAudio = async (ayah: Ayah, isRepeat = false, playOnlyOne = false) => {
    if (!ayah.audio) return;
    
    if (audioRef.current) {
      audioRef.current.pause();
    }

    if (!isRepeat && playingAyah === ayah.number && isPlaying) {
      setIsPlaying(false);
      setPlayingAyah(null);
      repeatLeftRef.current = 0;
      playOnlyOneRef.current = false;
      return;
    }

    if (!isRepeat) {
      repeatLeftRef.current = repeatCount > 0 ? repeatCount - 1 : 0;
      playOnlyOneRef.current = playOnlyOne;
    }

    let playableUrl = ayah.audio;
    let loadedFromCache = false;
    try {
      const cache = await caches.open('quran-audio-cache');
      const response = await cache.match(ayah.audio);
      if (response) {
        const blob = await response.blob();
        playableUrl = URL.createObjectURL(blob);
        loadedFromCache = true;
      }
    } catch (e) {
      console.warn('Failed to load audio from cache', e);
    }
    
    setIsPlayingFromCache(loadedFromCache);

    const audio = new Audio(playableUrl);
    audioRef.current = audio;
    
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        setIsPlaying(true);
        setPlayingAyah(ayah.number);
        
        // Auto-scroll to active ayah
        if (ayahRefs.current[ayah.number] && !isRepeat) {
          ayahRefs.current[ayah.number]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }).catch(err => {
        if (err.name !== 'AbortError') {
          console.error("Audio playback error:", err);
        }
      });
    }

    audio.onended = () => {
      if (repeatLeftRef.current > 0) {
        repeatLeftRef.current -= 1;
        playAudio(ayah, true, playOnlyOneRef.current);
        return;
      }

      if (playOnlyOneRef.current) {
        setIsPlaying(false);
        setPlayingAyah(null);
        return;
      }

      if (autoPlayNext && surahArabic) {
        const currentIndex = surahArabic.ayahs.findIndex(a => a.number === ayah.number);
        if (currentIndex !== -1 && currentIndex < surahArabic.ayahs.length - 1) {
          const nextAyah = surahArabic.ayahs[currentIndex + 1];
          playAudio(nextAyah, false);
        } else {
          // Finished current content
          if (contentRepeatLeftRef.current > 0) {
            contentRepeatLeftRef.current -= 1;
            // Play from the beginning of the current content
            playAudio(surahArabic.ayahs[0], false);
            return;
          }

          // Go to next
          let nextId = activeSurah + 1;
          let maxId = 114;
          if (activeViewMode === 'page') maxId = 604;
          if (activeViewMode === 'juz') maxId = 30;
          if (activeViewMode === 'hizb') maxId = 60;
          if (activeViewMode === 'rub') maxId = 240;

          if (activeSurah < maxId) {
            // We are changing content, reset content repeat left
            contentRepeatLeftRef.current = contentRepeatCount > 0 ? contentRepeatCount - 1 : 0;
            setAutoPlayFirstAyah(true);
            loadContent(activeViewMode, nextId);
          } else {
            setIsPlaying(false);
            setPlayingAyah(null);
          }
        }
      } else {
        setIsPlaying(false);
        setPlayingAyah(null);
      }
    };
  };

  useEffect(() => {
    if (surahArabic && autoPlayFirstAyah) {
      setAutoPlayFirstAyah(false);
      if (surahArabic.ayahs.length > 0) {
        // slight delay to ensure UI mounts
        setTimeout(() => {
          playAudio(surahArabic.ayahs[0]);
        }, 500);
      }
    }
  }, [surahArabic, autoPlayFirstAyah]);

  useEffect(() => {
    if (currentTrack?.id?.startsWith('surah-')) {
      const match = currentTrack.id.match(/^surah-(\d+)-/);
      if (match) {
        const surahNumber = parseInt(match[1]);
        if (activeSurah !== surahNumber && !loadingSurah) {
          loadContent('surah', surahNumber);
        }
      }
    }
  }, [currentTrack]);

  const [viewMode, setViewMode] = useState<'surah' | 'juz' | 'hizb' | 'rub' | 'page'>('surah');
  const [activeViewMode, setActiveViewMode] = useState<'surah' | 'juz' | 'hizb' | 'rub' | 'page'>('surah');

  useEffect(() => {
    if (!reminderTime) return;
    
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const checkReminder = () => {
      const now = new Date();
      const currentHours = now.getHours().toString().padStart(2, '0');
      const currentMinutes = now.getMinutes().toString().padStart(2, '0');
      const currentTime = `${currentHours}:${currentMinutes}`;
      
      if (currentTime === reminderTime) {
        const lastReminded = localStorage.getItem('asrarhub_last_reminder_date');
        const todayDate = now.toDateString();
        
        if (lastReminded !== todayDate) {
           if ('Notification' in window && Notification.permission === 'granted') {
             new Notification('Rappel de lecture', {
                body: 'Il est temps de lire votre portion quotidienne du Coran.',
             });
           }
           alert('Rappel : Il est temps de lire votre portion quotidienne du Coran.');
           localStorage.setItem('asrarhub_last_reminder_date', todayDate);
        }
      }
    };
    
    const interval = setInterval(checkReminder, 60000);
    checkReminder();
    return () => clearInterval(interval);
  }, [reminderTime]);

  const minSwipeDistance = 50;

  const onTouchStartEvent = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMoveEvent = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleNextUnit = () => {
    let maxId = 114;
    if (activeViewMode === 'page') maxId = 604;
    if (activeViewMode === 'juz') maxId = 30;
    if (activeViewMode === 'hizb') maxId = 60;
    if (activeViewMode === 'rub') maxId = 240;
    if (activeSurah && activeSurah < maxId) {
      loadContent(activeViewMode, activeSurah + 1);
    }
  };

  const handlePrevUnit = () => {
    if (activeSurah && activeSurah > 1) {
      loadContent(activeViewMode, activeSurah - 1);
    }
  };

  const onTouchEndEvent = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (readingMode === 'mushaf') {
      if (isRightSwipe) {
         handleNextUnit();
      } else if (isLeftSwipe) {
         handlePrevUnit();
      }
    }
  };

  const handleAyahTouchStart = (ayah: { text: string, numberInSurah: number }, isTajweed: boolean) => {
    const timer = setTimeout(() => {
      setZoomedAyah({ text: ayah.text, numberInSurah: ayah.numberInSurah, isTajweed });
      // Vibrate if supported to indicate long press
      if (navigator.vibrate) navigator.vibrate(50);
    }, 500);
    setLongPressTimer(timer);
  };

  const handleAyahTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  useEffect(() => {
    if (playingPlaylist) {
      const reciterApiId = QURAN_RECITERS.find(r => r.id === selectedReciterId)?.apiId || 'ar.alafasy';
      const pseudoAyahs = playingPlaylist.ayahs.map(a => ({
        number: a.number,
        numberInSurah: a.ayahNumberInSurah,
        text: a.text || "",
        audio: `https://cdn.islamic.network/quran/audio/128/${reciterApiId}/${a.number}.mp3`,
        audioSecondary: [],
        juz: 1, manzil: 1, page: 1, ruku: 1, hizbQuarter: 1,
        surah: {
          number: a.surahNumber,
          name: `Sourate ${a.surahNumber}`,
          englishName: `Surah ${a.surahNumber}`,
          englishNameTranslation: "",
          revelationType: "",
          numberOfAyahs: 1
        }
      }));
      
      const pseudoSurah = {
        number: 999,
        name: playingPlaylist.name,
        englishName: playingPlaylist.name,
        englishNameTranslation: "Playlist Roqya",
        revelationType: "Meccan",
        numberOfAyahs: pseudoAyahs.length,
        ayahs: pseudoAyahs
      };

      setSurahArabic(pseudoSurah);
      setSurahTajweed(pseudoSurah);
      setSurahFrench(pseudoSurah);
      setSurahEnglish(pseudoSurah);
      setSurahHausa(pseudoSurah);
      setActiveSurah(999);
      
      setAutoPlayFirstAyah(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [playingPlaylist, selectedReciterId]);

  const loadContent = async (mode: 'surah' | 'juz' | 'hizb' | 'rub' | 'page', number: number) => {
    setPlayingPlaylist(null);
    setActiveSurah(number);
    setActiveViewMode(mode);
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
      
      let endpointAr = '';
      let endpointTajweed = '';
      let endpointFr = '';
      let endpointEn = '';
      let endpointHa = '';

      if (mode === 'surah') {
        endpointAr = `https://api.alquran.cloud/v1/surah/${number}/${reciterApiId}`;
        endpointTajweed = `https://api.alquran.cloud/v1/surah/${number}/quran-tajweed`;
        endpointFr = `https://api.alquran.cloud/v1/surah/${number}/fr.hamidullah`;
        endpointEn = `https://api.alquran.cloud/v1/surah/${number}/en.sahih`;
        endpointHa = `https://api.alquran.cloud/v1/surah/${number}/ha.gumi`;
      } else if (mode === 'juz') {
        endpointAr = `https://api.alquran.cloud/v1/juz/${number}/${reciterApiId}`;
        endpointTajweed = `https://api.alquran.cloud/v1/juz/${number}/quran-tajweed`;
        endpointFr = `https://api.alquran.cloud/v1/juz/${number}/fr.hamidullah`;
        endpointEn = `https://api.alquran.cloud/v1/juz/${number}/en.sahih`;
        endpointHa = `https://api.alquran.cloud/v1/juz/${number}/ha.gumi`;
      } else if (mode === 'page') {
        endpointAr = `https://api.alquran.cloud/v1/page/${number}/${reciterApiId}`;
        endpointTajweed = `https://api.alquran.cloud/v1/page/${number}/quran-tajweed`;
        endpointFr = `https://api.alquran.cloud/v1/page/${number}/fr.hamidullah`;
        endpointEn = `https://api.alquran.cloud/v1/page/${number}/en.sahih`;
        endpointHa = `https://api.alquran.cloud/v1/page/${number}/ha.gumi`;
      } else if (mode === 'rub') {
        endpointAr = `https://api.alquran.cloud/v1/hizbQuarter/${number}/${reciterApiId}`;
        endpointTajweed = `https://api.alquran.cloud/v1/hizbQuarter/${number}/quran-tajweed`;
        endpointFr = `https://api.alquran.cloud/v1/hizbQuarter/${number}/fr.hamidullah`;
        endpointEn = `https://api.alquran.cloud/v1/hizbQuarter/${number}/en.sahih`;
        endpointHa = `https://api.alquran.cloud/v1/hizbQuarter/${number}/ha.gumi`;
      } else if (mode === 'hizb') {
        const juzNum = Math.ceil(number / 2);
        endpointAr = `https://api.alquran.cloud/v1/juz/${juzNum}/${reciterApiId}`;
        endpointTajweed = `https://api.alquran.cloud/v1/juz/${juzNum}/quran-tajweed`;
        endpointFr = `https://api.alquran.cloud/v1/juz/${juzNum}/fr.hamidullah`;
        endpointEn = `https://api.alquran.cloud/v1/juz/${juzNum}/en.sahih`;
        endpointHa = `https://api.alquran.cloud/v1/juz/${juzNum}/ha.gumi`;
      }

      const [arData, tajweedData, frData, enData, haData] = await Promise.all([
        fetchWithCache(endpointAr),
        fetchWithCache(endpointTajweed).catch(() => null),
        fetchWithCache(endpointFr).catch(() => null),
        fetchWithCache(endpointEn).catch(() => null),
        fetchWithCache(endpointHa).catch(() => null)
      ]);
      
      const processData = (data: any, isHizb: boolean, hizbNum: number) => {
        if (!data || data.code !== 200) return null;
        let finalData = data.data;
        if (isHizb) {
          finalData.ayahs = finalData.ayahs.filter((a: any) => Math.ceil(a.hizbQuarter / 4) === hizbNum);
        }
        
        if (mode !== 'surah') {
          // Fill missing properties to avoid UI crashes
          finalData.name = mode === 'juz' ? `الجزء ${number}` : mode === 'page' ? `الصفحة ${number}` : mode === 'rub' ? `الربع ${number}` : `الحزب ${number}`;
          finalData.englishName = mode === 'juz' ? `Juz' ${number}` : mode === 'page' ? `Page ${number}` : mode === 'rub' ? `Rub' ${number}` : `Hizb ${number}`;
          finalData.englishNameTranslation = mode === 'juz' ? `Part ${number}` : mode === 'page' ? `Page ${number}` : mode === 'rub' ? `Quarter ${number}` : `Group ${number}`;
        }
        return finalData;
      };

      setSurahArabic(processData(arData, mode === 'hizb', number));
      setSurahTajweed(processData(tajweedData, mode === 'hizb', number));
      setSurahFrench(processData(frData, mode === 'hizb', number));
      setSurahEnglish(processData(enData, mode === 'hizb', number));
      setSurahHausa(processData(haData, mode === 'hizb', number));
      
    } catch (err) {
      console.warn('Load content error:', err);
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
    s.name.includes(searchTerm) ||
    s.number.toString() === searchTerm.trim()
  );

  return (
    <div 
      className={`${fullScreenMode ? 'fixed inset-0 z-[100] bg-white dark:bg-gray-900 overflow-y-auto w-full max-w-none p-4 sm:p-8' : 'max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24'}`} 
      style={applyEyeComfort ? { filter: 'sepia(0.3) brightness(0.9) contrast(0.95)' } : {}}
      onTouchStart={onTouchStartEvent}
      onTouchMove={onTouchMoveEvent}
      onTouchEnd={onTouchEndEvent}
    >
      {/* Floating Exit/Back Arrow (Middle Left) */}
      {activeSurah && (
        <motion.button
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          whileHover={{ x: 5, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (fullScreenMode) {
              setFullScreenMode(false);
            } else {
              setActiveSurah(null);
            }
          }}
          className="fixed left-0 top-1/2 -translate-y-1/2 z-[110] p-3 sm:p-4 bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-r-3xl border border-l-0 border-white/60 dark:border-gray-700/60 shadow-[4px_0_24px_-4px_rgba(0,0,0,0.15)] text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-300 group overflow-hidden"
          title={fullScreenMode ? "Quitter le plein écran" : "Retour"}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-r-3xl pointer-events-none"></div>
          {fullScreenMode ? (
            <Minimize2 className="relative z-10 group-hover:scale-110 transition-transform" size={24} />
          ) : (
            <ArrowLeft className="relative z-10 group-hover:-translate-x-1 transition-transform" size={24} />
          )}
        </motion.button>
      )}

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
              {t('tools.quran.title', "Le Saint Coran (Al-Qur'an)")}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">{t("tools.quran.description")}</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6 bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-5 border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Bookmark size={18} className="text-emerald-500" />
                Progression de lecture
              </h3>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full">
                {readSurahs.length} / 114
              </span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-emerald-500 h-3 rounded-full transition-all duration-500" 
                style={{ width: `${(readSurahs.length / 114) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              {Math.floor((readSurahs.length / 114) * 100)}% du Coran lu
            </p>
          </div>

          <div className="flex overflow-x-auto hide-scrollbar bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-6">
            {(['surah', 'page', 'juz', 'hizb', 'rub'] as const).map(mode => (
              <button 
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`flex-1 min-w-[70px] px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${viewMode === mode ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
              >
                {mode === 'surah' ? 'Surah' : mode === 'page' ? 'Page' : mode === 'juz' ? "Juz" : mode === 'hizb' ? 'Hizb' : "Rub"}
              </button>
            ))}
          </div>

          {viewMode === 'surah' && (
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={t('searchSurah', "Rechercher une sourate (ex: Ya-Sin, 36, L'Aube)...")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-4 border border-gray-200 dark:border-gray-700 rounded-2xl leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm shadow-sm transition-all"
              />
            </div>
          )}

          {loading ? (
            <div className="flex justify-center p-12">
              <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-center">
              {error}
            </div>
          ) : viewMode === 'surah' ? (
            <div className="flex flex-col bg-white dark:bg-gray-900 rounded-none sm:rounded-2xl shadow-sm sm:border border-gray-100 dark:border-gray-800 overflow-hidden">
              {filteredSurahs.map((surah, i) => (
                <motion.div
                  key={surah.number}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.02, 0.2) }}
                  onClick={() => loadContent('surah', surah.number)}
                  className="flex items-center justify-between py-4 px-4 border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left w-full cursor-pointer"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-8 text-2xl sm:text-3xl font-light text-gray-800 dark:text-gray-200 flex justify-center">
                      {surah.number}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <h3 className="text-[17px] font-medium text-[#2d7d45] dark:text-[#45b066]">{surah.englishName}</h3>
                        {downloadedItems.surah?.includes(surah.number) && (
                          <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 px-1.5 py-0.5 rounded-md">
                            <CloudOff size={10} /> {t('offlineReady', 'Offline')}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[13px] text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        {surah.englishNameTranslation}
                        <span className="text-[11px] opacity-70">
                          {surah.revelationType === 'Meccan' ? '🕋' : '🕌'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="font-arabic text-3xl sm:text-4xl text-gray-900 dark:text-white" style={{ fontFamily: '"Amiri", serif' }}>
                        {surah.name.replace('سُورَةُ ', '')}
                      </span>
                    </div>
                    {!downloadedItems.surah?.includes(surah.number) && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadForOffline('surah', [surah.number]);
                        }}
                        className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 text-gray-400 hover:bg-emerald-50 hover:text-emerald-600 dark:bg-gray-800 dark:hover:bg-emerald-900/40 dark:hover:text-emerald-400 transition-colors"
                        title={t('downloadOffline', 'Télécharger (Hors ligne)')}
                      >
                        <Download size={18} />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className={`grid gap-3 ${viewMode === 'page' ? 'grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 md:grid-cols-10' : 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-6'}`}>
              {Array.from({ length: viewMode === 'page' ? 604 : viewMode === 'juz' ? 30 : viewMode === 'hizb' ? 60 : 240 }).map((_, i) => (
                <motion.button
                  key={`${viewMode}-${i + 1}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => loadContent(viewMode, i + 1)}
                  className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 flex flex-col items-center justify-center hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-800 transition-all text-center aspect-square"
                >
                  <span className="text-sm font-semibold text-gray-500 mb-1">
                    {viewMode === 'juz' ? "Juz'" : viewMode === 'hizb' ? 'Hizb' : viewMode === 'rub' ? "Rub'" : 'Page'}
                  </span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">{i + 1}</span>
                </motion.button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className={`sticky top-0 z-20 bg-gray-50/90 dark:bg-gray-900/90 backdrop-blur-md pt-4 pb-4 mb-6 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${fullScreenMode ? 'hidden' : ''}`}>
             
             {surahArabic && (
               <div className="flex-1 w-full">
                 <div className="flex items-center justify-between gap-3 w-full">
                   {/* Left icon: Search */}
                   <div className="flex justify-start flex-1">
                     <motion.button
                       whileHover={{ scale: 1.1, rotate: -5 }}
                       whileTap={{ scale: 0.9 }}
                       onClick={() => setShowAyahSearch(!showAyahSearch)}
                       className={`p-3 rounded-full transition-all shadow-sm border-2 ${showAyahSearch ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400 border-emerald-500/30' : 'bg-white text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700 dark:hover:bg-gray-700 hover:border-emerald-500/30 dark:hover:border-emerald-500/30 hover:shadow-md'}`}
                       title="Rechercher un verset"
                     >
                       <Search size={22} className={showAyahSearch ? 'animate-pulse' : ''} />
                     </motion.button>
                   </div>

                   {/* Middle: Surah Name */}
                   <div className="flex flex-col items-center flex-none px-2">
                     <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-arabic">
                       {surahArabic.name}
                     </h2>
                     <div className="flex items-center justify-center gap-2 mt-1">
                       {activeSurah !== 999 && (
                         <button
                           onClick={() => toggleReadSurah(activeSurah)}
                           className={`p-1 rounded-full transition-colors ${readSurahs.includes(activeSurah) ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30' : 'text-gray-400 hover:text-emerald-500'}`}
                           title={readSurahs.includes(activeSurah) ? "Marquer comme non lu" : "Marquer comme lu"}
                         >
                           {readSurahs.includes(activeSurah) ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                         </button>
                       )}
                       <p className="text-xs sm:text-sm font-medium text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                         {activeViewMode === 'surah' ? 'Sourate' : activeViewMode === 'juz' ? "Juz'" : activeViewMode === 'hizb' ? 'Hizb' : activeViewMode === 'rub' ? "Rub'" : 'Page'} {surahArabic.englishName} • {surahArabic.ayahs?.length || surahArabic.numberOfAyahs} Versets
                       </p>
                     </div>
                   </div>

                   {/* Right: Repeat Mode */}
                   <div className="flex justify-end flex-1">
                     <div className="relative">
                       <motion.button 
                         whileHover={{ scale: 1.1, rotate: 15 }}
                         whileTap={{ scale: 0.9 }}
                         className={`p-3 rounded-full transition-all shadow-sm border-2 ${repeatCount > 0 ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400 border-emerald-500/30' : 'bg-white text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700 dark:hover:bg-gray-700 hover:border-emerald-500/30 dark:hover:border-emerald-500/30 hover:shadow-md'}`}
                       >
                         <RefreshCw size={22} className={repeatCount > 0 ? "animate-spin-slow" : ""} style={{ animationDuration: '3s' }} />
                         {repeatCount > 0 && <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce shadow-sm border-2 border-white dark:border-gray-900">{repeatCount}</span>}
                       </motion.button>
                       <select
                         value={repeatCount}
                         onChange={(e) => setRepeatCount(Number(e.target.value))}
                         className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                         title="Mode Répétition"
                       >
                         <option value={0}>Sans répétition</option>
                         {ROQYA_REPEAT_COUNTS.filter(c => c > 0).map(c => (
                           <option key={c} value={c}>{c} fois</option>
                         ))}
                       </select>
                     </div>
                   </div>
                 </div>

                 {/* Verses Search Bar (Collapsible) */}
                 <AnimatePresence>
                   {showAyahSearch && (
                     <motion.div 
                       initial={{ opacity: 0, height: 0, marginTop: 0 }}
                       animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                       exit={{ opacity: 0, height: 0, marginTop: 0 }}
                       className="relative overflow-hidden w-full"
                     >
                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                         <Search className="h-5 w-5 text-gray-400" />
                       </div>
                       <input
                         type="text"
                         placeholder="Rechercher un verset..."
                         value={surahSearchQuery}
                         onChange={(e) => setSurahSearchQuery(e.target.value)}
                         className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm shadow-sm transition-all"
                         dir="auto"
                       />
                     </motion.div>
                   )}
                 {playlistModalAyah && (<div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"><motion.div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-6 shadow-xl max-w-md w-full relative"><h3 className="font-bold text-xl text-gray-900 dark:text-white flex items-center gap-2 mb-4"><ListPlus className="text-emerald-500" /> Ajouter à la Playlist Roqya</h3><div className="space-y-4">{roqyaPlaylists.length > 0 ? (<div className="space-y-2">{roqyaPlaylists.map(p => (<button key={p.id} onClick={() => {if (!p.ayahs.some(a => a.ayahNumberInSurah === playlistModalAyah.numberInSurah && a.surahNumber === (playlistModalAyah.surah?.number || activeSurah))) {setRoqyaPlaylists(prev => prev.map(pl => pl.id === p.id ? { ...pl, ayahs: [...pl.ayahs, { surahNumber: playlistModalAyah.surah?.number || activeSurah, ayahNumberInSurah: playlistModalAyah.numberInSurah, number: playlistModalAyah.number, text: playlistModalAyah.text }] } : pl));} setPlaylistModalAyah(null);}} className="w-full text-left p-3 rounded-xl bg-gray-50 hover:bg-emerald-50 dark:bg-gray-900 dark:hover:bg-emerald-900/30 transition-colors">{p.name} ({p.ayahs.length} versets)</button>))}</div>) : (<p className="text-gray-500 text-sm">Aucune playlist existante.</p>)}<div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700"><input type="text" placeholder="Nouvelle playlist..." value={newPlaylistName} onChange={(e) => setNewPlaylistName(e.target.value)} className="w-full p-2 mb-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-emerald-500 text-gray-900 dark:text-white" /><button onClick={() => {if (newPlaylistName.trim()) {setRoqyaPlaylists([...roqyaPlaylists, { id: Date.now().toString(), name: newPlaylistName.trim(), ayahs: [{ surahNumber: playlistModalAyah.surah?.number || activeSurah, ayahNumberInSurah: playlistModalAyah.numberInSurah, number: playlistModalAyah.number, text: playlistModalAyah.text }] }]);setNewPlaylistName("");setPlaylistModalAyah(null);}}} className="w-full bg-emerald-500 text-white p-2 rounded-lg">Créer et ajouter</button></div></div><button onClick={() => setPlaylistModalAyah(null)} className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white"><X size={20} /></button></motion.div></div>)}

            {showPlaylistsModal && (
             <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
               <motion.div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-6 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                 <div className="flex justify-between items-center mb-6">
                   <h3 className="font-bold text-xl text-gray-900 dark:text-white flex items-center gap-2">
                     <ListMusic className="text-emerald-500" /> Playlists Roqya
                   </h3>
                   <button onClick={() => setShowPlaylistsModal(false)} className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white">
                     <X size={20} />
                   </button>
                 </div>
                 {roqyaPlaylists.length === 0 ? (
                   <p className="text-gray-500">Aucune playlist créée. Ajoutez des versets pour commencer.</p>
                 ) : (
                   <div className="space-y-4">
                     {roqyaPlaylists.map(p => (
                       <div key={p.id} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700">
                         <div className="flex justify-between items-center mb-2">
                           <h4 className="font-bold text-gray-900 dark:text-white">{p.name}</h4>
                           <div className="flex gap-2">
                             <button onClick={() => {
                               const text = p.name + '\n\n' + p.ayahs.map(a => `Sourate ${a.surahNumber}, Verset ${a.ayahNumberInSurah}: \n${a.text}`).join('\n\n');
                               const blob = new Blob([text], { type: 'text/plain' });
                               const url = URL.createObjectURL(blob);
                               const a = document.createElement('a');
                               a.href = url;
                               a.download = `Roqya_${p.name}.txt`;
                               a.click();
                             }} className="p-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:text-emerald-500" title="Télécharger le texte de la playlist">
                               <Download size={16} />
                             </button>
                             <button onClick={() => setRoqyaPlaylists(roqyaPlaylists.filter(pl => pl.id !== p.id))} className="p-2 bg-white dark:bg-gray-800 text-red-500 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700" title="Supprimer la playlist">
                               <X size={16} />
                             </button>
                           </div>
                         </div>
                         <p className="text-sm text-gray-500 mb-3">{p.ayahs.length} verset(s)</p>
                         
                         {p.ayahs.length > 0 && (
                           <div className="space-y-2 mb-4">
                             {p.ayahs.map((a, idx) => (
                               <div 
                                 key={`${a.surahNumber}-${a.ayahNumberInSurah}`}
                                 draggable
                                 onDragStart={(e) => {
                                   e.dataTransfer.setData('text/plain', JSON.stringify({ playlistId: p.id, index: idx }));
                                 }}
                                 onDragOver={(e) => {
                                   e.preventDefault();
                                 }}
                                 onDrop={(e) => {
                                   e.preventDefault();
                                   try {
                                     const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                                     if (data.playlistId === p.id && data.index !== idx) {
                                       setRoqyaPlaylists(prev => prev.map(pl => {
                                         if (pl.id === p.id) {
                                           const newAyahs = [...pl.ayahs];
                                           const [movedItem] = newAyahs.splice(data.index, 1);
                                           newAyahs.splice(idx, 0, movedItem);
                                           return { ...pl, ayahs: newAyahs };
                                         }
                                         return pl;
                                       }));
                                     }
                                   } catch(err) {
                                     // error handling for JSON parse
                                   }
                                 }}
                                 className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl cursor-move group"
                               >
                                 <GripVertical size={16} className="text-gray-400 group-hover:text-emerald-500 transition-colors" />
                                 <div className="flex-1">
                                   <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mb-1">Sourate {a.surahNumber}, Verset {a.ayahNumberInSurah}</div>
                                   <div className="text-sm text-gray-700 dark:text-gray-300 line-clamp-1" dir="rtl font-arabic">{a.text}</div>
                                 </div>
                                 <button 
                                   onClick={() => {
                                     setRoqyaPlaylists(prev => prev.map(pl => pl.id === p.id ? { ...pl, ayahs: pl.ayahs.filter((_, i) => i !== idx) } : pl));
                                   }}
                                   className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                                 >
                                   <X size={16} />
                                 </button>
                               </div>
                             ))}
                           </div>
                         )}

                         {p.ayahs.length > 0 && (
                           <button onClick={() => { setPlayingPlaylist(p); setShowPlaylistsModal(false); }} className="w-full bg-emerald-500 text-white p-2 rounded-lg flex items-center justify-center gap-2 font-semibold hover:bg-emerald-600 transition-colors">
                             <Play size={18} /> Lire la playlist
                           </button>
                         )}
                       </div>
                     ))}
                   </div>
                 )}
               </motion.div>
             </div>
           )}

            </AnimatePresence>
               </div>
             )}
           </div>

           {/* Floating Action Bar */}
           <div className={`fixed bottom-24 sm:bottom-28 z-50 flex flex-col gap-3 transition-all duration-500 ${toolbarPosition === 'right' ? 'right-4 sm:right-8 items-end' : 'left-4 sm:left-8 items-start'} ${fullScreenMode ? 'hidden' : ''}`}>
             
             <AnimatePresence>
               {isToolbarExpanded && (
                 <motion.div 
                   initial={{ opacity: 0, y: 20, scale: 0.9 }}
                   animate={{ opacity: 1, y: 0, scale: 1 }}
                   exit={{ opacity: 0, y: 20, scale: 0.9 }}
                   transition={{ duration: 0.2, ease: "easeOut" }}
                   className={`bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-2xl p-3 ${toolbarPosition === 'right' ? 'origin-bottom-right' : 'origin-bottom-left'}`}
                 >
                   <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 w-[max-content]">
                   <button
                     onClick={() => setToolbarPosition(prev => prev === 'right' ? 'left' : 'right')}
                     className="p-3 rounded-xl transition-all flex flex-col items-center justify-center gap-1 bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400"
                     title={toolbarPosition === 'right' ? "Déplacer à gauche" : "Déplacer à droite"}
                   >
                     {toolbarPosition === 'right' ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
                   </button>
                   <button
                     onClick={() => setFullScreenMode(true)}
                     className="p-3 rounded-xl transition-all flex flex-col items-center justify-center gap-1 bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400"
                     title="Mode lecture plein écran"
                   >
                     <Maximize size={20} />
                   </button>
                   {surahArabic && (
                     <>
                       <button 
                         onClick={() => {
                           if (isPlaying && playingAyah) {
                             if (audioRef.current) audioRef.current.pause();
                             setIsPlaying(false);
                             setPlayingAyah(null);
                           } else if (surahArabic.ayahs.length > 0) {
                              contentRepeatLeftRef.current = contentRepeatCount > 0 ? contentRepeatCount - 1 : 0;
                              playAudio(surahArabic.ayahs[0]);
                            }
                         }}
                         className={`p-3 rounded-xl transition-all flex flex-col items-center justify-center gap-1 ${isPlaying ? 'bg-emerald-500 text-white shadow-md' : 'bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400'}`}
                         title={isPlaying ? "Mettre en pause la lecture par verset" : "Lecture par verset (suivie)"}
                       >
                         {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                       </button>
                       
                       {activeViewMode === 'surah' && activeSurah !== 999 && (
                         <>
                           <button 
                             onClick={playGlobalSurah}
                             className={`p-3 rounded-xl transition-all flex flex-col items-center justify-center gap-1 ${currentTrack?.id === `surah-${activeSurah}-${selectedReciterId}` && globalIsPlaying ? 'bg-emerald-600 text-white shadow-md' : 'bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400'}`}
                             title="Écouter la sourate en arrière-plan"
                           >
                             {currentTrack?.id === `surah-${activeSurah}-${selectedReciterId}` && globalIsPlaying ? <Pause size={20} /> : <Headphones size={20} />}
                           </button>
                         </>
                       )}
                     </>
                   )}

                   <button 
                     onClick={() => setShowDownloadModal(true)}
                     disabled={downloadingOffline || downloadProgress === 100}
                     className={`p-3 rounded-xl transition-all flex flex-col items-center justify-center gap-1 ${downloadProgress === 100 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400'}`}
                     title="Télécharger le Coran pour hors ligne"
                   >
                     {downloadProgress > 0 && downloadProgress < 100 ? (
                       <span className="text-[10px] font-bold w-5 h-5 flex items-center justify-center leading-none">{downloadProgress}%</span>
                     ) : downloadProgress === 100 ? (
                       <Check size={20} />
                     ) : downloadingOffline ? (
                       <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                     ) : (
                       <Download size={20} />
                     )}
                   </button>

                   <button 
                     onClick={() => setActiveModal('search')}
                     className="p-3 rounded-xl transition-all flex flex-col items-center justify-center gap-1 bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400"
                     title="Recherche Avancée"
                   >
                     <Search size={20} />
                   </button>
                   <button 
                     onClick={() => setActiveModal('dashboard')}
                     className="p-3 rounded-xl transition-all flex flex-col items-center justify-center gap-1 bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400"
                     title="Tableau de bord"
                   >
                     <Activity size={20} />
                   </button>
                   <button 
                     onClick={() => setShowBookmarksList(true)}
                     className="p-3 rounded-xl transition-all flex flex-col items-center justify-center gap-1 bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400"
                     title="Voir mes signets"
                   >
                     <Bookmark size={20} />
                   </button>

                   <button onClick={() => setShowPlaylistsModal(true)} className="p-3 rounded-xl transition-all flex flex-col items-center justify-center gap-1 bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400" title="Mes Playlists Roqya">
                     <ListMusic size={20} />
                   </button>

                   <button 
                     onClick={() => setShowSettings(true)}
                     className="p-3 rounded-xl transition-all flex flex-col items-center justify-center gap-1 bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400"
                     title="Paramètres"
                   >
                     <Settings size={20} />
                   </button>
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>

             <button 
               onClick={() => setIsToolbarExpanded(!isToolbarExpanded)}
               className="p-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-xl transition-transform hover:scale-105 active:scale-95 z-50 flex items-center justify-center relative w-14 h-14 shrink-0"
             >
               <div className={`absolute transition-all duration-300 ${isToolbarExpanded ? 'rotate-90 opacity-0 scale-50' : 'rotate-0 opacity-100 scale-100'}`}>
                 <Settings size={24} />
               </div>
               <div className={`absolute transition-all duration-300 ${isToolbarExpanded ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-50'}`}>
                 <X size={24} />
               </div>
             </button>
           </div>

           <AnimatePresence>
             {showMushafSelector && (
               <div className="fixed inset-0 z-50 flex flex-col bg-gray-50 dark:bg-gray-900">
                 <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                   <div className="flex items-center gap-4">
                     <button 
                       onClick={() => setShowMushafSelector(false)}
                       className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-700/50 rounded-full transition-colors"
                     >
                       <X size={20} />
                     </button>
                     <h3 className="font-bold text-xl text-gray-900 dark:text-white">Sélectionner le Mushaf</h3>
                   </div>
                   <button
                     onClick={() => setShowMushafSelector(false)}
                     className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-full transition-colors"
                   >
                     Enregistrer
                   </button>
                 </div>
                 
                 <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                   {MUSHAF_OPTIONS.map((mushaf) => (
                     <div 
                       key={mushaf.id}
                       onClick={() => setFontFamily(mushaf.id)}
                       className={`relative cursor-pointer rounded-2xl p-6 transition-all ${
                         fontFamily === mushaf.id 
                           ? 'bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-500 shadow-md' 
                           : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700/50'
                       }`}
                     >
                       <div className="flex items-start gap-4">
                         <div className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                           fontFamily === mushaf.id 
                             ? 'border-emerald-500' 
                             : 'border-gray-300 dark:border-gray-600'
                         }`}>
                           {fontFamily === mushaf.id && (
                             <div className="w-3 h-3 rounded-full bg-emerald-500" />
                           )}
                         </div>
                         <div className="flex-1 min-w-0">
                           <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{mushaf.name}</h4>
                           <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{mushaf.desc}</p>
                           
                           <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 border border-gray-100 dark:border-gray-800">
                             <div className="w-full" dir="rtl">
                               <p className="text-gray-900 dark:text-white text-center leading-loose whitespace-pre-wrap" style={mushaf.style}>
                                 {mushaf.preview}
                               </p>
                             </div>
                           </div>
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
             )}

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
                         <Type size={18} className="text-emerald-500" /> Typographie & Espacement
                       </label>
                       <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800 space-y-4">
                         <div>
                           <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Taille du texte arabe</label>
                           <div className="flex items-center gap-4">
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
                           <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Style d'écriture (Mushaf)</label>
                           <button
                             onClick={() => { setShowSettings(false); setShowMushafSelector(true); }}
                             className="w-full flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                           >
                             <span className="font-medium text-sm">{MUSHAF_OPTIONS.find(m => m.id === fontFamily)?.name || 'Mushaf Unicode Text'}</span>
                             <ChevronDown size={16} className="text-gray-400" />
                           </button>
                         </div>

                         <div>
                           <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Espacement des lignes</label>
                           <select
                             value={lineHeight}
                             onChange={(e) => setLineHeight(parseFloat(e.target.value))}
                             className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                           >
                             <option value="1.8">Compact (1.8)</option>
                             <option value="2.2">Normal (2.2)</option>
                             <option value="2.5">Aéré (2.5)</option>
                             <option value="3.0">Très espacé (3.0)</option>
                           </select>
                         </div>
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
                         <BookOpen size={18} className="text-emerald-500" /> Options d'affichage
                       </label>
                       <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800 space-y-4">
                         <div className="flex items-center justify-between">
                           <div>
                             <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Mode Mushaf</h4>
                             <p className="text-xs text-gray-500 mt-1">Lecture continue (sans cartes par verset)</p>
                           </div>
                           <button 
                             onClick={() => setReadingMode(prev => prev === 'card' ? 'mushaf' : 'card')}
                             className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${readingMode === 'mushaf' ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700'}`}
                           >
                             <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${readingMode === 'mushaf' ? 'translate-x-6' : 'translate-x-1'}`} />
                           </button>
                         </div>
                         <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
                           <div>
                             <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Mode Confort Visuel <Moon size={14} className="inline ml-1 text-emerald-500"/></h4>
                             <p className="text-xs text-gray-500 mt-1">S'active automatiquement la nuit (19h - 6h)</p>
                           </div>
                           <button 
                             onClick={() => setIsAutoNightModeEnabled(!isAutoNightModeEnabled)}
                             className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isAutoNightModeEnabled ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700'}`}
                           >
                             <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isAutoNightModeEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                           </button>
                         </div>

                         <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
                           <div>
                             <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Mode Plein Écran</h4>
                             <p className="text-xs text-gray-500 mt-1">Masque l'en-tête et les barres d'outils pour une immersion totale</p>
                           </div>
                           <button 
                             onClick={() => {
                               setFullScreenMode(!fullScreenMode);
                               setShowSettings(false); // Close settings when activating full screen
                             }}
                             className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${fullScreenMode ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700'}`}
                           >
                             <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${fullScreenMode ? 'translate-x-6' : 'translate-x-1'}`} />
                           </button>
                         </div>

                         <div className="flex flex-col pt-4 border-t border-gray-200 dark:border-gray-800 gap-3">
                           <div>
                             <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Rappel Quotidien (Notification)</h4>
                             <p className="text-xs text-gray-500 mt-1">Planifiez une alerte locale pour vous rappeler de lire</p>
                           </div>
                           <input
                             type="time"
                             value={reminderTime}
                             onChange={(e) => {
                               setReminderTime(e.target.value);
                               localStorage.setItem('asrarhub_quran_reminder', e.target.value);
                               if ('Notification' in window && Notification.permission === 'default') {
                                 Notification.requestPermission();
                               }
                             }}
                             className="block w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                           />
                         </div>
                       </div>
                     </div>

                     <div>
                       <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                         <Volume2 size={18} className="text-emerald-500" /> Mode Roqya (Répétition)
                       </label>
                       <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800">
                         <div className="flex flex-col gap-3">
                           <p className="text-sm text-gray-600 dark:text-gray-400">Répéter chaque verset (utile pour la roqya et la mémorisation) :</p>
                           <div className="flex flex-wrap gap-2">
                             {ROQYA_REPEAT_COUNTS.map(count => (
                               <button
                                 key={count}
                                 onClick={() => setRepeatCount(count)}
                                 className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition-colors ${repeatCount === count ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm' : 'bg-white border-gray-200 text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 hover:border-emerald-300'}`}
                               >
                                 {count === 0 ? 'Aucune' : `${count}x`}
                               </button>
                             ))}
                           </div>
                         </div>
                       </div>
                     </div>

                     <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                          <Volume2 size={18} className="text-emerald-500" /> Répétition Globale (Section courante)
                        </label>
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800">
                          <div className="flex flex-col gap-3">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Répéter la page, le ruku, ou le juz courant :</p>
                            <div className="flex flex-wrap gap-2">
                              {ROQYA_REPEAT_COUNTS.map(count => (
                                <button
                                  key={`content-${count}`}
                                  onClick={() => setContentRepeatCount(count)}
                                  className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition-colors ${contentRepeatCount === count ? "bg-emerald-500 border-emerald-500 text-white shadow-sm" : "bg-white border-gray-200 text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 hover:border-emerald-300"}`}
                                >
                                  {count === 0 ? "Aucune" : `${count}x`}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                          <Volume2 size={18} className="text-emerald-500" /> Répétition Globale (Section courante)
                        </label>
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800">
                          <div className="flex flex-col gap-3">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Répéter la page, le ruku, ou le juz courant :</p>
                            <div className="flex flex-wrap gap-2">
                              {ROQYA_REPEAT_COUNTS.map(count => (
                                <button
                                  key={`content-${count}`}
                                  onClick={() => setContentRepeatCount(count)}
                                  className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition-colors ${contentRepeatCount === count ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm' : 'bg-white border-gray-200 text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 hover:border-emerald-300'}`}
                                >
                                  {count === 0 ? 'Aucune' : `${count}x`}
                                </button>
                              ))}
                            </div>
                          </div>
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

           <AnimatePresence>
             {bookmarkModalAyah && (
               <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.95 }}
                   className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-6 shadow-xl max-w-md w-full"
                 >
                   <div className="flex items-center justify-between mb-4">
                     <h3 className="font-bold text-xl text-gray-900 dark:text-white">Signet - Verset {bookmarkModalAyah.numberInSurah}</h3>
                     <button 
                       onClick={() => {
                         setBookmarkModalAyah(null);
                         setBookmarkNote('');
                       }}
                       className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-700/50 rounded-full transition-colors"
                     >
                       <X size={20} />
                     </button>
                   </div>
                   
                   <div className="mb-4">
                     <p className="text-right font-arabic text-gray-900 dark:text-white text-lg leading-relaxed mb-4" dir="rtl">
                       {bookmarkModalAyah.text}
                     </p>
                     <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Note personnelle (optionnelle)</label>
                     <textarea
                       value={bookmarkNote}
                       onChange={(e) => setBookmarkNote(e.target.value)}
                       placeholder="Ajoutez une réflexion ou une note sur ce verset..."
                       className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 min-h-[100px]"
                     />
                   </div>

                   <div className="flex justify-end gap-3">
                     {bookmarks.some(b => b.ayahNumber === bookmarkModalAyah.number) && (
                       <button
                         onClick={() => {
                           removeBookmark(bookmarkModalAyah.number);
                           setBookmarkModalAyah(null);
                           setBookmarkNote('');
                         }}
                         className="px-4 py-2 text-red-600 font-semibold bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-xl transition-colors"
                       >
                         Supprimer
                       </button>
                     )}
                     <button
                       onClick={saveBookmark}
                       className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
                     >
                       Enregistrer
                     </button>
                   </div>
                 </motion.div>
               </div>
             )}

             {zoomedAyah && (
               <div 
                 className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                 onClick={() => setZoomedAyah(null)}
               >
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.8 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.8 }}
                   className={`w-full max-w-5xl ${ZOOM_BACKGROUNDS[zoomedAyahBg].class} ${ZOOM_TEXT_COLORS[zoomedAyahColor].class} rounded-3xl p-6 sm:p-12 shadow-2xl overflow-hidden relative transition-colors duration-300`}
                   onClick={e => e.stopPropagation()}
                 >
                   <button 
                     onClick={() => setZoomedAyah(null)}
                     className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 hover:text-emerald-500 transition-colors"
                   >
                     <X size={24} />
                   </button>
                   <div className="flex flex-col items-center justify-center min-h-[40vh] sm:min-h-[50vh]">
                     <div 
                       className={`text-center w-full ${ZOOM_TEXT_COLORS[zoomedAyahColor].class}`} 
                       dir="rtl"
                       style={{ 
                         fontFamily: zoomedAyah.isTajweed ? 'MeQuran' : fontFamily, 
                         fontSize: zoomedAyah.text.length < 50 ? 'clamp(2.5rem, 8vw, 6rem)' : zoomedAyah.text.length < 150 ? 'clamp(2rem, 6vw, 4rem)' : zoomedAyah.text.length < 300 ? 'clamp(1.5rem, 5vw, 3rem)' : zoomedAyah.text.length < 600 ? 'clamp(1.2rem, 4vw, 2.5rem)' : 'clamp(1rem, 3vw, 1.8rem)',
                         lineHeight: '1.8'
                       }}
                     >
                       {zoomedAyah.isTajweed ? (
                         <div className="font-arabic" dangerouslySetInnerHTML={{ __html: zoomedAyah.text.replace(/\[h:(\d+)\[([^\]]+)\]/g, '<span class="tajweed-h$1">$2</span>').replace(/\[(\w+)\[([^\]]+)\]/g, '<span class="tajweed-$1">$2</span>') }} />
                       ) : (
                         <p className="font-arabic">{zoomedAyah.text}</p>
                       )}
                     </div>
                     <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10 flex items-center justify-center gap-4 w-full flex-wrap" id="zoomed-ayah-actions">
                       <div className="flex flex-col gap-3 mr-auto">
                         <div className="flex items-center gap-2" id="zoomed-bg-selector">
                           {ZOOM_BACKGROUNDS.map((bg, idx) => (
                             <button
                               key={bg.id}
                               onClick={(e) => { e.stopPropagation(); setZoomedAyahBg(idx); }}
                               className={`w-8 h-8 rounded-full shadow-sm transition-transform ${zoomedAyahBg === idx ? 'scale-110 ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-gray-900' : 'hover:scale-105'} ${bg.iconClass}`}
                               title={`Arrière-plan ${bg.id}`}
                             />
                           ))}
                         </div>
                         <div className="flex items-center gap-2" id="zoomed-color-selector">
                           {ZOOM_TEXT_COLORS.map((color, idx) => (
                             <button
                               key={color.id}
                               onClick={(e) => { e.stopPropagation(); setZoomedAyahColor(idx); }}
                               className={`w-6 h-6 rounded-full shadow-sm transition-transform ${zoomedAyahColor === idx ? 'scale-125 ring-2 ring-emerald-500 ring-offset-1 dark:ring-offset-gray-900' : 'hover:scale-110'} ${color.iconClass}`}
                               title={`Couleur ${color.id}`}
                             />
                           ))}
                         </div>
                       </div>
                       <span className="px-4 py-2 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 rounded-full text-lg font-bold font-arabic">
                         Verset {zoomedAyah.numberInSurah}
                       </span>
                       
                       <button
                         onClick={(e) => {
                           e.stopPropagation();
                           const textToCopy = `${zoomedAyah.text} ﴿${toArabicNumeral(zoomedAyah.numberInSurah)}﴾`;
                           navigator.clipboard.writeText(textToCopy);
                           alert('Verset copié dans le presse-papier !');
                         }}
                         className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-emerald-600 transition-colors"
                         title="Copier le verset"
                       >
                         <Copy size={20} />
                       </button>
                       
                       <button
                         onClick={(e) => {
                           e.stopPropagation();
                           const node = document.querySelector('.max-w-5xl') as HTMLElement;
                           if (node) {
                             const actionButtons = document.getElementById('zoomed-ayah-actions');
                             if (actionButtons) actionButtons.style.display = 'none';
                             const closeBtn = document.querySelector('.absolute.top-4.right-4') as HTMLElement;
                             if (closeBtn) closeBtn.style.display = 'none';
                             
                             const originalConsoleError = console.error;
                             console.error = (...args) => {
                               const msg = args[0]?.toString() || '';
                               if (msg.includes('Error loading remote') || msg.includes('Failed to fetch') || msg.includes('Fetch error for')) return;
                               originalConsoleError(...args);
                             };
                             
                             toPng(node, { cacheBust: true, backgroundColor: 'transparent' })
                               .then((dataUrl) => {
                                 console.error = originalConsoleError;
                                 if (actionButtons) actionButtons.style.display = 'flex';
                                 if (closeBtn) closeBtn.style.display = 'block';
                                 
                                 const link = document.createElement('a');
                                 link.download = `verset-${zoomedAyah.surahName || 'quran'}-${zoomedAyah.numberInSurah}.png`;
                                 link.href = dataUrl;
                                 link.click();
                               })
                               .catch((err) => {
                                 console.warn('oops, something went wrong!', err);
                                 console.error = originalConsoleError;
                                 if (actionButtons) actionButtons.style.display = 'flex';
                                 if (closeBtn) closeBtn.style.display = 'block';
                               });
                           }
                         }}
                         className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-emerald-600 transition-colors"
                         title="Partager comme image"
                       >
                         <ImageIcon size={20} />
                       </button>
                       {zoomedAyah.ayahNumber && zoomedAyah.surahNumber && zoomedAyah.surahName && (
                         <>
                           <button
                             onClick={(e) => {
                               e.stopPropagation();
                               setZoomedAyah(null);
                               setBookmarkModalAyah({
                                 number: zoomedAyah.ayahNumber!,
                                 text: zoomedAyah.text,
                                 numberInSurah: zoomedAyah.numberInSurah,
                                 juz: 0,
                                 manzil: 0,
                                 page: 0,
                                 ruku: 0,
                                 hizbQuarter: 0,
                                 sajda: false,
                                 surah: {
                                   number: zoomedAyah.surahNumber!,
                                   name: zoomedAyah.surahName!,
                                   englishName: zoomedAyah.surahName!,
                                   englishNameTranslation: '',
                                   revelationType: '',
                                   numberOfAyahs: 0
                                 }
                               });
                             }}
                             className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-emerald-600 transition-colors"
                             title="Ajouter aux favoris"
                           >
                             {bookmarks.some(b => b.ayahNumber === zoomedAyah.ayahNumber) ? <BookmarkCheck size={20} className="text-emerald-500" /> : <Bookmark size={20} />}
                           </button>
                           <button
                             onClick={(e) => {
                               e.stopPropagation();
                               setZoomedAyah(null);
                               setPlaylistModalAyah({
                                 number: zoomedAyah.ayahNumber!,
                                 text: zoomedAyah.text,
                                 numberInSurah: zoomedAyah.numberInSurah,
                                 juz: 0,
                                 manzil: 0,
                                 page: 0,
                                 ruku: 0,
                                 hizbQuarter: 0,
                                 sajda: false,
                                 surah: {
                                   number: zoomedAyah.surahNumber!,
                                   name: zoomedAyah.surahName!,
                                   englishName: zoomedAyah.surahName!,
                                   englishNameTranslation: '',
                                   revelationType: '',
                                   numberOfAyahs: 0
                                 }
                               });
                             }}
                             className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-emerald-600 transition-colors"
                             title="Ajouter à la playlist Roqya"
                           >
                             <ListPlus size={20} />
                           </button>
                         </>
                       )}
                     </div>
                   </div>
                 </motion.div>
               </div>
             )}

             {showDownloadModal && (
               <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.95, y: 20 }}
                   animate={{ opacity: 1, scale: 1, y: 0 }}
                   exit={{ opacity: 0, scale: 0.95, y: 20 }}
                   className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-6 sm:p-8 shadow-2xl max-w-md w-full"
                 >
                   <div className="flex items-center justify-between mb-6">
                     <h3 className="font-bold text-xl text-gray-900 dark:text-white flex items-center gap-3">
                       <Download className="text-emerald-500" size={24} />
                       Télécharger le Coran
                     </h3>
                     <button 
                       onClick={() => setShowDownloadModal(false)}
                       className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-500 hover:text-emerald-500 dark:text-gray-400 dark:hover:text-emerald-400 transition-colors"
                     >
                       <X size={20} />
                     </button>
                   </div>
                   
                   <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                     Choisissez le format de téléchargement. En cas de mauvaise connexion, choisissez un format plus petit (comme les pages) pour faciliter la reprise du téléchargement là où il s'est arrêté.
                   </p>

                                       <div className="space-y-3">
                      {[
                        { type: 'surah', label: 'Par Sourate', desc: '114 fichiers (Recommandé)', icon: <BookOpen size={18} />, maxCount: 114 },
                        { type: 'page', label: 'Par Page', desc: '604 petits fichiers (Idéal pour les connexions instables)', icon: <AlignJustify size={18} />, maxCount: 604 },
                        { type: 'juz', label: "Par Juz'", desc: '30 gros fichiers', icon: <BookOpen size={18} />, maxCount: 30 },
                        { type: 'hizbQuarter', label: 'Par Rub\' (Quart de Hizb)', desc: '240 fichiers', icon: <Activity size={18} />, maxCount: 240 },
                        { type: 'ruku', label: 'Par Ruku', desc: '556 fichiers', icon: <ChevronDown size={18} />, maxCount: 556 }
                      ].map((option) => (
                        <div key={option.type} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800">
                          <button
                            onClick={() => setExpandedDownloadOption(expandedDownloadOption === option.type ? null : option.type)}
                            className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all group"
                          >
                            <div className="flex items-center gap-3 text-left">
                              <div className="text-gray-400 group-hover:text-emerald-500 transition-colors">
                                {option.icon}
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">{option.label}</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{option.desc}</p>
                              </div>
                            </div>
                            <ChevronDown size={18} className={`text-gray-300 group-hover:text-emerald-500 transition-transform ${expandedDownloadOption === option.type ? 'rotate-180' : ''}`} />
                          </button>
                          
                          {expandedDownloadOption === option.type && (
                            <div className="p-4 border-t border-gray-200 dark:border-gray-700 max-h-[250px] overflow-y-auto">
                              <button 
                                onClick={() => downloadForOffline(option.type as any)} 
                                className="w-full mb-3 p-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
                              >
                                <Download size={16} />
                                Télécharger Tout
                              </button>
                              
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {Array.from({length: option.maxCount}, (_, i) => i + 1).map(num => {
                                  const isDownloaded = downloadedItems[option.type]?.includes(num);
                                  return (
                                  <button 
                                    key={num} 
                                    onClick={() => downloadForOffline(option.type as any, [num])} 
                                    className={`p-2 text-sm text-left border rounded-lg transition-colors truncate flex justify-between items-center ${isDownloaded ? 'border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400' : 'border-gray-200 dark:border-gray-700 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-gray-700 dark:text-gray-300'}`}
                                    title={option.type === 'surah' ? surahs.find(s => s.number === num)?.englishName || `Sourate ${num}` : `${option.label} ${num}`}
                                  >
                                    <span className="truncate">{option.type === 'surah' ? `${num}. ${surahs.find(s => s.number === num)?.englishName || ''}` : `${option.label} ${num}`}</span>
                                    {isDownloaded && <Check size={14} className="shrink-0" />}
                                  </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                 </motion.div>
               </div>
             )}

             {showBookmarksList && (
               <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.95 }}
                   className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-6 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                 >
                   <div className="flex items-center justify-between mb-6 shrink-0">
                     <h3 className="font-bold text-xl text-gray-900 dark:text-white flex items-center gap-2">
                       <Bookmark className="text-emerald-500" /> Mes Signets
                     </h3>
                     <button 
                       onClick={() => setShowBookmarksList(false)}
                       className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-700/50 rounded-full transition-colors"
                     >
                       <X size={20} />
                     </button>
                   </div>
                   
                   <div className="overflow-y-auto flex-1 pr-2 space-y-4">
                     {bookmarks.length === 0 ? (
                       <div className="text-center py-10 text-gray-500">
                         Aucun signet enregistré pour le moment.
                       </div>
                     ) : (
                       bookmarks.sort((a, b) => b.timestamp - a.timestamp).map(bookmark => (
                         <div key={bookmark.ayahNumber} className="p-4 border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-2xl flex flex-col gap-3">
                           <div className="flex justify-between items-start">
                             <div className="flex flex-col">
                               <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                 {bookmark.surahName}
                               </span>
                               <span className="text-sm text-gray-500">
                                 Sourate {bookmark.surahNumber} • Verset {bookmark.ayahNumberInSurah}
                               </span>
                             </div>
                             <div className="flex gap-2">
                               <button
                                 onClick={() => {
                                   setShowBookmarksList(false);
                                   setActiveSurah(bookmark.surahNumber);
                                   setTimeout(() => {
                                     const el = ayahRefs.current[bookmark.ayahNumber];
                                     if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                   }, 1000);
                                 }}
                                 className="p-2 bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-emerald-50"
                                 title="Aller au verset"
                               >
                                 <BookOpen size={16} />
                               </button>
                               <button
                                 onClick={() => removeBookmark(bookmark.ayahNumber)}
                                 className="p-2 bg-white dark:bg-gray-800 text-red-500 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-red-50"
                                 title="Supprimer"
                               >
                                 <X size={16} />
                               </button>
                             </div>
                           </div>
                           {bookmark.note && (
                             <div className="mt-2 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap">
                               {bookmark.note}
                             </div>
                           )}
                           <div className="text-xs text-gray-400 mt-1">
                             {new Date(bookmark.timestamp).toLocaleDateString()}
                           </div>
                         </div>
                       ))
                     )}
                   </div>
                 </motion.div>
               </div>
             )}
           </AnimatePresence>

            <AnimatePresence>
              {activeModal === 'dashboard' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-6 shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-xl text-gray-900 dark:text-white flex items-center gap-2">
                        <Activity size={20} className="text-emerald-500" />
                        Tableau de bord
                      </h3>
                      <button 
                        onClick={() => setActiveModal(null)}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-700/50 rounded-full transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-800/30">
                        <div className="text-emerald-600 dark:text-emerald-400 mb-1"><Clock size={24} /></div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{Math.floor(readingStats.timeSpentSeconds / 60)}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Minutes passées</div>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-800/30">
                        <div className="text-blue-600 dark:text-blue-400 mb-1"><BookOpen size={24} /></div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{readSurahs.length}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Sourates lues</div>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-2xl border border-purple-100 dark:border-purple-800/30 col-span-2 flex items-center justify-between">
                        <div>
                          <div className="text-purple-600 dark:text-purple-400 mb-1"><TrendingUp size={24} /></div>
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">{((readSurahs.length / 114) * 100).toFixed(1)}%</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Progression globale (Sourates)</div>
                        </div>
                        <div className="w-16 h-16 rounded-full border-4 border-purple-200 dark:border-purple-800 flex items-center justify-center relative">
                          <svg className="absolute inset-0 w-full h-full -rotate-90">
                            <circle cx="28" cy="28" r="26" fill="transparent" stroke="currentColor" strokeWidth="4" className="text-purple-500" strokeDasharray="163.36" strokeDashoffset={163.36 - (163.36 * (readSurahs.length / 114))} />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {lastReadPosition && (
                      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 mb-6">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">Dernière lecture sauvegardée</h4>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{lastReadPosition.surahName}</p>
                            <p className="text-xs text-gray-500">Verset {lastReadPosition.ayahNumberInSurah}</p>
                          </div>
                          <button 
                            onClick={() => {
                              setActiveModal(null);
                              loadContent('surah', lastReadPosition.surahNumber);
                            }}
                            className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 transition-colors"
                          >
                            Reprendre
                          </button>
                        </div>
                      </div>
                    )}

                    {pausedDownloads.length > 0 && (
                      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-3 flex items-center gap-2">
                          <Download size={16} />
                          Mes Téléchargements (En pause)
                        </h4>
                        <div className="space-y-3">
                          {pausedDownloads.map(dl => (
                            <div key={dl.id} className="flex flex-col gap-2 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">{dl.label}</p>
                                  <p className="text-xs text-gray-500">{dl.progress} / {dl.total} téléchargés</p>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => downloadForOffline(dl.type, undefined, dl.id)}
                                    className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50 rounded-lg transition-colors"
                                    title="Reprendre"
                                  >
                                    <Play size={16} />
                                  </button>
                                  <button
                                    onClick={() => setPausedDownloads(prev => prev.filter(p => p.id !== dl.id))}
                                    className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                                    title="Supprimer"
                                  >
                                    <X size={16} />
                                  </button>
                                </div>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${Math.round((dl.progress / dl.total) * 100)}%` }}></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>
              )}

              {activeModal === 'search' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-6 shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-xl text-gray-900 dark:text-white flex items-center gap-2">
                        <Search size={20} className="text-emerald-500" />
                        Recherche avancée
                      </h3>
                      <button 
                        onClick={() => setActiveModal(null)}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-700/50 rounded-full transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <form onSubmit={handleAdvancedSearch} className="mb-6 relative">
                      <input
                        type="text"
                        value={advancedSearchQuery}
                        onChange={(e) => setAdvancedSearchQuery(e.target.value)}
                        placeholder="Rechercher un mot, un thème dans le Coran..."
                        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-12 py-3.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        dir="auto"
                      />
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-emerald-500 text-white rounded-lg text-sm font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50" disabled={isSearching || !advancedSearchQuery.trim()}>
                        {isSearching ? '...' : 'Chercher'}
                      </button>
                    </form>

                    <div className="overflow-y-auto flex-1 pr-2 space-y-4">
                      {!advancedSearchQuery && searchHistory.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 flex items-center justify-between">
                            Recherches récentes
                            <button onClick={() => setSearchHistory([])} className="text-xs text-red-500 hover:text-red-600 font-medium">Effacer</button>
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {searchHistory.map((hist, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleAdvancedSearch(undefined, hist)}
                                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-900/30 transition-colors"
                              >
                                {hist}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {isSearching ? (
                        <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                          Recherche en cours...
                        </div>
                      ) : advancedSearchResults.length > 0 ? (
                        <>
                          <p className="text-sm text-gray-500 mb-4">{advancedSearchResults.length} résultat(s) trouvé(s)</p>
                          {advancedSearchResults.map((match, idx) => (
                            <div key={idx} className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                              <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-md">
                                  {match.surah.name} ({match.surah.number}:{match.numberInSurah}) {match.matchLang ? `• ${match.matchLang.toUpperCase()}` : '• AR'}
                                </span>
                                <button 
                                  onClick={() => {
                                    setActiveModal(null);
                                    loadContent('surah', match.surah.number);
                                    // Wait for content to load then scroll
                                    setTimeout(() => {
                                      const element = document.getElementById(`ayah-${match.numberInSurah}`);
                                      if (element) {
                                        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                        // Visual highlight
                                        element.classList.add('bg-emerald-50', 'dark:bg-emerald-900/20');
                                        setTimeout(() => {
                                          element.classList.remove('bg-emerald-50', 'dark:bg-emerald-900/20');
                                        }, 3000);
                                      }
                                    }, 1500);
                                  }}
                                  className="text-xs font-semibold text-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1"
                                >
                                  Aller au verset <ArrowRight size={12} />
                                </button>
                              </div>
                              <p className={`${!match.matchLang ? 'font-arabic text-right text-lg' : 'text-left text-sm'} text-gray-900 dark:text-white leading-loose`} dir={!match.matchLang ? 'rtl' : 'ltr'}>{match.text}</p>
                            </div>
                          ))}
                        </>
                      ) : advancedSearchQuery && !isSearching ? (
                        <div className="text-center py-10 text-gray-500">
                          Aucun résultat trouvé pour "{advancedSearchQuery}". Essayez d'autres mots-clés.
                        </div>
                      ) : (
                        <div className="text-center py-10 text-gray-500 flex flex-col items-center">
                          <Search size={40} className="text-gray-300 dark:text-gray-600 mb-4" />
                          <p>Recherchez des mots-clés spécifiques dans l'ensemble du Mushaf.</p>
                          <p className="text-sm mt-2 opacity-70">La recherche s'effectue simultanément en Arabe, Français et Anglais.</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

           {loadingSurah ? (
             <div className="space-y-6 pb-32 sm:pb-40 px-2 sm:px-4 animate-pulse">
               {/* Skeleton for Surah Banner */}
               <div className="w-full h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl mb-8"></div>
               {/* Skeleton for Ayahs */}
               {Array.from({ length: 5 }).map((_, i) => (
                 <div key={i} className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col items-end">
                   <div className="flex items-center gap-4 w-full mb-6">
                     <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800"></div>
                     <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
                     <div className="flex-grow"></div>
                     <div className="h-6 w-6 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                     <div className="h-6 w-6 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                   </div>
                   <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-4"></div>
                   <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-full mb-6"></div>
                   <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full mb-2 self-start"></div>
                   <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6 mb-2 self-start"></div>
                   <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3 self-start"></div>
                 </div>
               ))}
             </div>
           ) : !surahArabic ? (
             <div className="flex flex-col items-center justify-center py-20 text-center px-4">
               <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-2xl border border-red-100 dark:border-red-900/50 max-w-md w-full shadow-sm">
                 <p className="font-bold text-lg mb-2">Erreur de chargement</p>
                 <p className="text-sm opacity-90">Impossible de charger le contenu. Veuillez vérifier votre connexion internet et réessayer.</p>
                 <button onClick={() => activeSurah && loadContent(activeViewMode, activeSurah as number)} className="mt-6 px-6 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors shadow-sm">
                   Réessayer
                 </button>
               </div>
             </div>
           ) : (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6 pb-32 sm:pb-40">
                {(() => {
                  const query = surahSearchQuery.trim().toLowerCase();
                  const filteredAyahs = surahArabic.ayahs.filter(ayah => {
                    if (!query) return true;
                    if (ayah.numberInSurah.toString() === query) return true;
                    if (ayah.text.toLowerCase().includes(query)) return true;
                    return false;
                  });

                  if (filteredAyahs.length === 0) {
                    return (
                      <div className="text-center py-12 text-gray-500 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                        Aucun verset trouvé pour "{surahSearchQuery}"
                      </div>
                    );
                  }

                  const currentFontSize = 15 + fontSize;
                  const getJustifyClass = (text: string) => {
                    if (text.length < 60) return 'text-right';
                    if (currentFontSize > 28) return 'text-right sm:text-justify';
                    return 'text-justify';
                  };

                  if (readingMode === 'mushaf') {
                    return (
                      <div className="w-full" dir="rtl">
                        <div className={`font-arabic text-gray-900 dark:text-[#e4e4e7] ${currentFontSize > 28 ? 'text-right sm:text-justify' : 'text-justify'}`} style={{...getArabicStyle(), lineHeight: '2.5'}}>
                          {filteredAyahs.map((ayah) => {
                            const i = surahArabic.ayahs.findIndex(a => a.number === ayah.number);
                            const prevAyah = i > 0 ? surahArabic.ayahs[i - 1] : null;
                            
                            const isNewSurah = ayah.numberInSurah === 1;
                            
                            let markerText = "";
                            if (showMarkers) {
                              let parts = [];
                              if (!prevAyah || ayah.juz !== prevAyah.juz) parts.push(`Juz ${ayah.juz}`);
                              if (!prevAyah || ayah.page !== prevAyah.page) parts.push(`Page ${ayah.page}`);
                              if (!prevAyah || ayah.hizbQuarter !== prevAyah.hizbQuarter) {
                                const hizb = Math.ceil(ayah.hizbQuarter / 4);
                                const q = ayah.hizbQuarter % 4;
                                if (q === 1) parts.push(`Hizb ${hizb}`);
                                else if (q === 2) parts.push(`Roubu' Hizb ${hizb}`);
                                else if (q === 3) parts.push(`Nisf Hizb ${hizb}`);
                                else if (q === 0) parts.push(`3/4 Hizb ${hizb}`);
                              }
                              markerText = parts.join(' • ');
                            }

                            const isTajweed = MUSHAF_OPTIONS.find(m => m.id === fontFamily)?.isTajweed;
                            const rawText = isTajweed && surahTajweed?.ayahs[i] ? surahTajweed.ayahs[i].text : ayah.text;
                            
                            const ayahText = ayah.numberInSurah === 1 && (ayah.surah?.number || surahArabic.number) !== 1 && (ayah.surah?.number || surahArabic.number) !== 9 
                              ? rawText.replace(/^بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\s*/, '').replace(/^بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\s*/, '').replace(/^بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\s*/, '').replace(/^بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ\s*/, '') 
                              : rawText;

                            const surahInfo = ayah.surah || surahArabic;
                            const isNewPage = !prevAyah || ayah.page !== prevAyah.page;

                            return (
                              <React.Fragment key={ayah.number}>
                                {isNewPage && i > 0 && (
                                  <div className="w-full flex items-center justify-center my-8 opacity-60 select-none block-separator" dir="ltr">
                                    <div className="h-px bg-emerald-500/30 flex-grow"></div>
                                    <span className="px-4 text-xs font-sans text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded-full bg-emerald-50 dark:bg-emerald-900/20 mx-2 whitespace-nowrap">Page {ayah.page}</span>
                                    <div className="h-px bg-emerald-500/30 flex-grow"></div>
                                  </div>
                                )}
                                {isNewSurah && showArabic && (
                                  <div className="block w-full my-8">
                                    <SurahBanner number={surahInfo.number} name={surahInfo.name} numberOfAyahs={surahInfo.numberOfAyahs || 0} fontFamily={getArabicStyle().fontFamily} fontSizePx={17 + fontSize} />
                                    {surahInfo.number !== 1 && surahInfo.number !== 9 && (
                                      <div className="text-center mt-6 mb-2 text-gray-900 dark:text-[#e4e4e7] font-arabic" style={getArabicStyle()}>
                                        {isTajweed ? renderTajweed("بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ") : "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ"}
                                      </div>
                                    )}
                                  </div>
                                )}
                                <span 
                                  ref={(el) => ayahRefs.current[ayah.number] = el}
                                  data-ayah-number={ayah.number}
                                  className={`inline transition-colors ${playingAyah === ayah.number ? 'bg-emerald-100/80 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-100 rounded-lg px-1' : ''}`}
                                  onContextMenu={(e) => {
                                    e.preventDefault();
                                    setZoomedAyah({ text: ayahText, numberInSurah: ayah.numberInSurah, isTajweed: !!isTajweed });
                                  }}
                                  onTouchStart={() => handleAyahTouchStart({ text: ayahText, numberInSurah: ayah.numberInSurah }, !!isTajweed)}
                                  onTouchEnd={handleAyahTouchEnd}
                                >
                                  <span 
                                    className="cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 rounded-lg px-1 transition-colors"
                                    onClick={() => {
                                      if (playingAyah === ayah.number && isPlaying) {
                                        setIsPlaying(false);
                                        if (audioRef.current) audioRef.current.pause();
                                      } else {
                                        playAudio(ayah);
                                      }
                                    }}
                                  >
                                    {isTajweed ? renderTajweed(ayahText) : ayahText}
                                  </span>
                                  <span className="text-gray-600 dark:text-gray-400 mx-1.5 font-normal select-none" style={{ fontSize: '0.9em' }} dir="rtl">
                                    ﴿{toArabicNumeral(ayah.numberInSurah)}﴾
                                  </span>
                                </span>
                              </React.Fragment>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <>
                      {filteredAyahs.map((ayah) => {
                        const i = surahArabic.ayahs.findIndex(a => a.number === ayah.number);
                        const prevAyah = i > 0 ? surahArabic.ayahs[i - 1] : null;
                    const frAyah = surahFrench?.ayahs[i];
                    const enAyah = surahEnglish?.ayahs[i];
                    const haAyah = surahHausa?.ayahs[i];
                    
                    let markerText = "";
                    if (showMarkers) {
                      let parts = [];
                      if (!prevAyah || ayah.juz !== prevAyah.juz) parts.push(`Juz ${ayah.juz}`);
                      if (!prevAyah || ayah.page !== prevAyah.page) parts.push(`Page ${ayah.page}`);
                      if (!prevAyah || ayah.hizbQuarter !== prevAyah.hizbQuarter) {
                        const hizb = Math.ceil(ayah.hizbQuarter / 4);
                        const q = ayah.hizbQuarter % 4;
                        if (q === 1) parts.push(`Hizb ${hizb}`);
                        else if (q === 2) parts.push(`Roubu' Hizb ${hizb}`);
                        else if (q === 3) parts.push(`Nisf Hizb ${hizb}`);
                        else if (q === 0) parts.push(`3/4 Hizb ${hizb}`);
                      }
                      markerText = parts.join(' • ');
                    }
                    
                    const isNewSurah = ayah.numberInSurah === 1;
                    const surahInfo = ayah.surah || surahArabic;
                    const isTajweed = MUSHAF_OPTIONS.find(m => m.id === fontFamily)?.isTajweed;
                    const isNewPage = !prevAyah || ayah.page !== prevAyah.page;

                    return (
                    <div key={ayah.number} className="flex flex-col gap-4">
                      {isNewPage && i > 0 && (
                        <div className="w-full flex items-center justify-center my-6 opacity-60 select-none">
                          <div className="h-px bg-emerald-500/30 flex-grow"></div>
                          <span className="px-4 text-xs font-sans text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded-full bg-emerald-50 dark:bg-emerald-900/20 mx-2 whitespace-nowrap">Page {ayah.page}</span>
                          <div className="h-px bg-emerald-500/30 flex-grow"></div>
                        </div>
                      )}
                      {isNewSurah && showArabic && (
                        <div className="w-full my-6 flex flex-col items-center">
                          <div className="w-full">
                            <SurahBanner number={surahInfo.number} name={surahInfo.name} numberOfAyahs={surahInfo.numberOfAyahs || 0} fontFamily={getArabicStyle().fontFamily} fontSizePx={17 + fontSize} />
                          </div>
                          {surahInfo.number !== 1 && surahInfo.number !== 9 && (
                            <div className="text-center mt-6 mb-2 text-gray-900 dark:text-[#e4e4e7] font-arabic" style={getArabicStyle()}>
                              {isTajweed ? renderTajweed("بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ") : "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ"}
                            </div>
                          )}
                        </div>
                      )}
                      <div 
                        ref={(el) => ayahRefs.current[ayah.number] = el}
                        data-ayah-number={ayah.number}
                        className={`bg-white dark:bg-gray-800 border ${playingAyah === ayah.number ? 'border-emerald-500 dark:border-emerald-500 ring-2 ring-emerald-500/20 shadow-md' : 'border-gray-100 dark:border-gray-700'} rounded-2xl p-5 sm:p-8 shadow-sm flex flex-col space-y-6 transition-all duration-300`}
                      >
                       {showArabic && (
                         <div className="w-full text-right" dir="rtl">
                           <p 
                             className={`font-arabic text-gray-900 dark:text-white ${getJustifyClass(ayah.text)}`} 
                             style={getArabicStyle()}
                             onContextMenu={(e) => {
                               e.preventDefault();
                               const isTajweed = MUSHAF_OPTIONS.find(m => m.id === fontFamily)?.isTajweed;
                               const rawText = isTajweed && surahTajweed?.ayahs[i] ? surahTajweed.ayahs[i].text : ayah.text;
                               const text = ayah.numberInSurah === 1 && (ayah.surah?.number || surahArabic.number) !== 1 && (ayah.surah?.number || surahArabic.number) !== 9 
                                 ? rawText.replace(/^بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\s*/, '').replace(/^بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\s*/, '').replace(/^بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\s*/, '').replace(/^بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ\s*/, '') 
                                 : rawText;
                               setZoomedAyah({ text, numberInSurah: ayah.numberInSurah, isTajweed: !!isTajweed });
                             }}
                             onTouchStart={() => {
                               const isTajweed = MUSHAF_OPTIONS.find(m => m.id === fontFamily)?.isTajweed;
                               const rawText = isTajweed && surahTajweed?.ayahs[i] ? surahTajweed.ayahs[i].text : ayah.text;
                               const text = ayah.numberInSurah === 1 && (ayah.surah?.number || surahArabic.number) !== 1 && (ayah.surah?.number || surahArabic.number) !== 9 
                                 ? rawText.replace(/^بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\s*/, '').replace(/^بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\s*/, '').replace(/^بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\s*/, '').replace(/^بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ\s*/, '') 
                                 : rawText;
                               handleAyahTouchStart({ text, numberInSurah: ayah.numberInSurah }, !!isTajweed);
                             }}
                             onTouchEnd={handleAyahTouchEnd}
                           >
                             {(() => {
                               const isTajweed = MUSHAF_OPTIONS.find(m => m.id === fontFamily)?.isTajweed;
                               const rawText = isTajweed && surahTajweed?.ayahs[i] ? surahTajweed.ayahs[i].text : ayah.text;
                               const text = ayah.numberInSurah === 1 && (ayah.surah?.number || surahArabic.number) !== 1 && (ayah.surah?.number || surahArabic.number) !== 9 
                                 ? rawText.replace(/^بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\s*/, '').replace(/^بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\s*/, '').replace(/^بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\s*/, '').replace(/^بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ\s*/, '') 
                                 : rawText;
                               return isTajweed ? renderTajweed(text) : text;
                             })()} 
                             <span className="text-emerald-600 dark:text-emerald-400 mx-2 font-normal text-2xl select-none" dir="rtl">﴿{toArabicNumeral(ayah.numberInSurah)}﴾</span>
                           </p>
                         </div>
                       )}
                       
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
                       
                       <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
                         <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex items-center justify-center font-bold text-gray-500">
                           {ayah.numberInSurah}
                         </div>
                         <div className="flex items-center gap-2">
                           {ayah.audio && (
                             <>
                               <button 
                                 onClick={() => playAudio(ayah)}
                                 className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-colors ${playingAyah === ayah.number && !playOnlyOneRef.current ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-emerald-500 dark:bg-gray-900 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-emerald-400'}`}
                                 title="Jouer à partir de ce verset"
                               >
                                 {playingAyah === ayah.number && !playOnlyOneRef.current ? <Pause size={18} /> : <Play size={18} className="ml-1" />}
                                 {playingAyah === ayah.number && !playOnlyOneRef.current && isPlayingFromCache && <Database size={10} className="absolute bottom-0 right-0 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-gray-800 rounded-full" />}
                               </button>
                               <button 
                                 onClick={() => playAudio(ayah, false, true)}
                                 className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-colors ${playingAyah === ayah.number && playOnlyOneRef.current ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-emerald-500 dark:bg-gray-900 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-emerald-400'}`}
                                 title="Jouer uniquement ce verset"
                               >
                                 {playingAyah === ayah.number && playOnlyOneRef.current ? <Pause size={18} /> : <Volume2 size={18} />}
                                 {playingAyah === ayah.number && playOnlyOneRef.current && isPlayingFromCache && <Database size={10} className="absolute bottom-0 right-0 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-gray-800 rounded-full" />}
                               </button>
                             </>
                           )}
                           <button
                             onClick={() => {
                               const existing = bookmarks.find(b => b.ayahNumber === ayah.number);
                               setBookmarkNote(existing ? existing.note : '');
                               setBookmarkModalAyah(ayah);
                             }}
                             className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-colors ${bookmarks.some(b => b.ayahNumber === ayah.number) ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-emerald-500 dark:bg-gray-900 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-emerald-400'}`}
                             title="Ajouter un signet / note"
                           >
                             {bookmarks.some(b => b.ayahNumber === ayah.number) ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                           </button>
                           <button
                             onClick={() => setPlaylistModalAyah(ayah)}
                             className="w-10 h-10 rounded-full flex items-center justify-center transition-colors bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-emerald-500 dark:bg-gray-900 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-emerald-400"
                             title="Ajouter à la playlist Roqya"
                           >
                             <ListPlus size={18} />
                           </button>
                           <button
                             onClick={() => {
                               const shareText = `${ayah.text}\n\n[Coran ${ayah.surah?.number || surahArabic.number}:${ayah.numberInSurah}]`;
                               if (navigator.share) {
                                 navigator.share({ title: 'Verset du Coran', text: shareText });
                               } else {
                                 navigator.clipboard.writeText(shareText);
                                 alert('Verset copié dans le presse-papier !');
                               }
                             }}
                             className="w-10 h-10 rounded-full flex items-center justify-center transition-colors bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-emerald-500 dark:bg-gray-900 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-emerald-400"
                             title="Partager le verset"
                           >
                             <Share2 size={18} />
                           </button>
                           <button
                             onClick={() => {
                               setLastReadPosition({
                                 surahNumber: ayah.surah?.number || surahArabic.number,
                                 ayahNumber: ayah.number,
                                 ayahNumberInSurah: ayah.numberInSurah,
                                 surahName: ayah.surah?.name || surahArabic.name,
                                 timestamp: Date.now()
                               });
                               alert('Position de lecture sauvegardée !');
                             }}
                             className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-colors ${lastReadPosition?.ayahNumber === ayah.number ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-emerald-500 dark:bg-gray-900 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-emerald-400'}`}
                             title="Sauvegarder ma position ici"
                           >
                             <Check size={18} />
                           </button>
                         </div>
                       </div>
                    </div>
                  </div>
                  );
                })}
                    </>
                  );
               })()}
             </motion.div>
           )}
        </div>
      )}

      {/* Global Download Progress Toast */}
      <AnimatePresence>
        {downloadingOffline && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed z-[350] bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700 transition-all ${hideDownloadToast ? 'bottom-20 sm:bottom-6 right-4 sm:right-6 rounded-full p-3' : 'bottom-6 left-1/2 -translate-x-1/2 rounded-2xl p-4 w-[90%] max-w-sm flex flex-col gap-2'}`}
          >
            {hideDownloadToast ? (
              <button 
                onClick={() => setHideDownloadToast(false)} 
                className="flex items-center justify-center gap-2" 
                title="Afficher le téléchargement"
              >
                <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-emerald-500 font-bold text-sm">{downloadProgress}%</span>
              </button>
            ) : (
              <>
                <div className="flex justify-between items-center pr-6 relative">
                  <span className="font-semibold text-gray-900 dark:text-white text-sm flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    {downloadMessage || 'Téléchargement...'}
                  </span>
                  <span className="text-emerald-500 font-bold text-sm">{downloadProgress}%</span>
                  <button 
                    onClick={() => setHideDownloadToast(true)}
                    className="absolute -right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
                    title="Masquer"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full transition-all duration-300"
                    style={{ width: `${downloadProgress}%` }}
                  />
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
