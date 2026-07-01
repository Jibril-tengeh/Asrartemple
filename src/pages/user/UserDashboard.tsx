import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useFeatures } from '../../contexts/FeatureContext';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot, doc } from 'firebase/firestore';
import { Search, LayoutGrid, Square, List, Filter, X, BookOpen, Store, Award, MapPin, Trophy, ShieldCheck, ChevronDown, Bookmark, Flame, Shield, RefreshCw, Quote, Folder, Plus, Library, Music } from 'lucide-react';
import { SecretCard, LayoutMode } from '../../components/SecretCard';
import { HabitTracker } from '../../components/HabitTracker';
import { HijriCalendarWidget } from '../../components/HijriCalendarWidget';
import { OnboardingTour } from '../../components/OnboardingTour';
import { getAsrarItems } from '../../data/store';
import { AsrarItem, Category } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation, Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface Props {
  initialFilter?: Category | 'all' | 'favoris';
}

export const UserDashboard: React.FC<Props> = ({ initialFilter = 'all' }) => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const { featureToggles } = useFeatures();
  const location = useLocation();
  const [items, setItems] = useState<AsrarItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<Category | 'all' | 'favoris'>(initialFilter);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('grid2');
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isTopContributorsOpen, setIsTopContributorsOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [bookmarkFolders, setBookmarkFolders] = useState<{ id: string, name: string, items: string[] }[]>([]);
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const [quranBookmarks, setQuranBookmarks] = useState<any[]>([]);
  const [lastReadPosition, setLastReadPosition] = useState<{ surahNumber: number, ayahNumberInSurah: number, surahName: string } | null>(null);
  const [activityData, setActivityData] = useState<{ [date: string]: number }>({});

  const [aiSearchResults, setAiSearchResults] = useState<string[] | null>(null);
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [announcement, setAnnouncement] = useState<{ title: string, text: string, visible: boolean } | null>(null);
  const [isAnnouncementDismissed, setIsAnnouncementDismissed] = useState(false);

  const [affirmation, setAffirmation] = useState({ verse: '', reference: '' });
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const affirmations = [
      { verse: "Certes, avec la difficulté est la facilité.", reference: "Coran 94:5" },
      { verse: "Invoquez-Moi, Je vous répondrai.", reference: "Coran 40:60" },
      { verse: "Et Il a trouvé que tu étais égaré, alors Il t'a guidé.", reference: "Coran 93:7" },
      { verse: "N'est-ce point par l'évocation d'Allah que se tranquillisent les cœurs?", reference: "Coran 13:28" },
      { verse: "Allah ne charge aucune âme au-delà de sa capacité.", reference: "Coran 2:286" },
      { verse: "Celui qui se confie à Allah, Allah lui suffit.", reference: "Coran 65:3" },
      { verse: "Seigneur ! Ne laisse pas dévier nos cœurs après que Tu nous aies guidés.", reference: "Coran 3:8" }
    ];
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff / oneDay);
    setAffirmation(affirmations[day % affirmations.length]);
  }, []);

  const handleAiSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsAiSearching(true);
    setAiMessage(null);
    setAiSearchResults(null);
    try {
      const payload = {
        query: searchQuery,
        availableItems: items.map(i => ({ id: i.id, title: i.title, category: i.category, hook: i.hook }))
      };
      
      const res = await fetch("/api/assistant/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.recommendedIds) {
        setAiSearchResults(data.recommendedIds);
      }
      if (data.message) {
        setAiMessage(data.message);
      }
    } catch (e) {
      console.error(e);
      setAiMessage("Une erreur s'est produite lors de la recherche IA.");
    } finally {
      setIsAiSearching(false);
    }
  };

  useEffect(() => {
    setFilter(initialFilter);
  }, [initialFilter, location.pathname]);

  // Pull to refresh logic
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullProgress, setPullProgress] = useState(0);
  const startY = useRef(0);
  const currentY = useRef(0);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        startY.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (window.scrollY === 0 && startY.current > 0) {
        currentY.current = e.touches[0].clientY;
        const diff = currentY.current - startY.current;
        if (diff > 0) {
          e.preventDefault(); // prevent scroll bounce
          setPullProgress(Math.min(diff / 100, 1)); // 100px threshold
        }
      }
    };

    const handleTouchEnd = () => {
      if (pullProgress > 0.6) {
        setIsRefreshing(true);
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        setPullProgress(0);
        startY.current = 0;
        currentY.current = 0;
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pullProgress]);

  useEffect(() => {
    const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const firestoreItems = snapshot.docs.filter(doc => doc.data().status === 'Published').map(doc => {
        const data = doc.data();
        let activeContent = data.content || '';
        if (language === 'en' && data.content_en) activeContent = data.content_en;
        if (language === 'ha' && data.content_ha) activeContent = data.content_ha;

        let hookText = data.hook || '';
        if (language === 'en' && data.hook_en) hookText = data.hook_en;
        if (language === 'ha' && data.hook_ha) hookText = data.hook_ha;
        
        if (!hookText && activeContent) {
          hookText = activeContent.replace(/<[^>]+>/g, '').substring(0, 120) + '...';
        }
        
        let titleText = data.title || '';
        if (language === 'en' && data.title_en) titleText = data.title_en;
        if (language === 'ha' && data.title_ha) titleText = data.title_ha;

        return {
          id: doc.id,
          title: titleText,
          hook: hookText,
          category: data.category || 'recette',
          content: data.content,
          benefits: [],
          imageUrl: data.thumbnail,
          isPremium: data.isPremium || false,
          createdAt: data.createdAt ? new Date(data.createdAt).toISOString() : new Date().toISOString()
        } as AsrarItem;
      });
      setItems(firestoreItems);
    }, (error) => {
      console.error("Error fetching articles for dashboard", error);
    });

    try {
      const parsed = JSON.parse(localStorage.getItem('asrar_bookmarks') || '[]');
      setBookmarks(Array.isArray(parsed) ? parsed : []);
    } catch (e) {
      setBookmarks([]);
    }
    
    try {
      const parsedFolders = JSON.parse(localStorage.getItem('asrar_bookmark_folders') || '[]');
      setBookmarkFolders(Array.isArray(parsedFolders) ? parsedFolders : []);
    } catch (e) {
      setBookmarkFolders([]);
    }
    
    try {
      const parsedQuran = JSON.parse(localStorage.getItem('asrarhub_quran_bookmarks') || '[]');
      setQuranBookmarks(Array.isArray(parsedQuran) ? parsedQuran : []);
    } catch (e) {
      setQuranBookmarks([]);
    }
    
    try {
      const savedRead = localStorage.getItem('asrarhub_last_read_position');
      if (savedRead) {
        setLastReadPosition(JSON.parse(savedRead));
      }
    } catch(e) {}
    
    // Mock activity data or generate from stats
    try {
      const stats = JSON.parse(localStorage.getItem('asrar_stats') || '{}');
      const data: { [date: string]: number } = {};
      const today = new Date();
      for (let i = 0; i < 30; i++) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        // randomize some activity, or use real stats if available
        const randomFactor = Math.random();
        data[dateStr] = Math.floor(randomFactor * 10) * (randomFactor > 0.5 ? 1 : 0);
      }
      // Guarantee today has activity if they logged in
      const todayStr = today.toISOString().split('T')[0];
      data[todayStr] = Math.max(1, data[todayStr]);
      setActivityData(data);
    } catch(e) {}
    
    return () => unsubscribe();
  }, [language]);

  // Refresh bookmarks when window gets focus (in case they changed it on another page)
  useEffect(() => {
    const handleFocus = () => {
      try {
        const parsed = JSON.parse(localStorage.getItem('asrar_bookmarks') || '[]');
        setBookmarks(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
        setBookmarks([]);
      }
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  useEffect(() => {
    const unsubFeatures = onSnapshot(doc(db, 'settings', 'features'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.announcementTitle && data.announcementText && data.announcementVisible) {
           const dismissedText = localStorage.getItem('asrarhub_dismissed_announcement_text');
           if (dismissedText !== data.announcementText) {
             setIsAnnouncementDismissed(false);
           } else {
             setIsAnnouncementDismissed(true);
           }
           setAnnouncement({
             title: data.announcementTitle,
             text: data.announcementText,
             visible: data.announcementVisible
           });
        } else {
           setAnnouncement(null);
        }
      }
    });
    return () => unsubFeatures();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const filteredItems = items.filter(item => {
    let matchesSearch = true;
    
    if (aiSearchResults) {
      matchesSearch = aiSearchResults.includes(item.id);
    } else {
      const q = searchQuery.toLowerCase();
      matchesSearch = !q || [
        item.title,
        item.content,
        item.hook,
        item.verse,
        item.reference,
        ...(item.benefits || [])
      ].some(field => field?.toLowerCase().includes(q));
    }
    
    let matchesFilter = false;
    if (filter === 'all') matchesFilter = true;
    else if (filter === 'favoris') {
      if (activeFolder) {
        const folder = bookmarkFolders.find(f => f.id === activeFolder);
        matchesFilter = folder ? folder.items.includes(item.id) : false;
      } else {
        matchesFilter = bookmarks.includes(item.id);
      }
    }
    else matchesFilter = item.category === filter;

    return matchesSearch && matchesFilter;
  });

  // Force Vite HMR invalidation
  // console.log("UserDashboard loaded");

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24 relative">
      {pullProgress > 0 && (
        <div 
          className="fixed top-16 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center bg-white dark:bg-gray-800 rounded-full shadow-lg h-10 w-10 transition-all duration-200"
          style={{ transform: `translate(-50%, ${Math.min(pullProgress * 100, 60)}px) rotate(${pullProgress * 360}deg)` }}
        >
          <RefreshCw size={20} className={isRefreshing ? "animate-spin text-emerald-500" : "text-gray-400"} />
        </div>
      )}

      {/* Toolbar as a second header */}
      <div className={`fixed left-0 right-0 z-40 py-2 sm:py-3 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 transition-all duration-300 ${scrolled ? 'top-[52px]' : 'top-[60px]'}`}>
        <div className="max-w-5xl mx-auto flex justify-start sm:justify-center items-center gap-2 sm:gap-3 px-4 sm:px-6 lg:px-8 overflow-x-auto hide-scrollbar">
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ width: 40, opacity: 0 }}
              animate={{ width: '100%', maxWidth: '400px', opacity: 1 }}
              exit={{ width: 40, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 overflow-hidden z-10 w-full px-4 sm:px-0"
            >
              <input
                ref={searchInputRef}
                type="text"
                placeholder={t('dashboardContent.searchPlaceholder', "Mots-clés, sourates, versets...")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAiSearch();
                }}
                className="w-full h-10 pl-10 pr-20 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none text-sm shadow-sm"
              />
              <Search className="absolute left-7 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              
              <div className="absolute right-6 sm:right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {searchQuery && (
                  <button
                    onClick={handleAiSearch}
                    disabled={isAiSearching}
                    className="p-1.5 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-colors flex items-center justify-center"
                    title="Recherche Sémantique IA"
                  >
                    {isAiSearching ? (
                      <RefreshCw size={16} className="animate-spin" />
                    ) : (
                      <Flame size={16} />
                    )}
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                    setAiSearchResults(null);
                    setAiMessage(null);
                  }}
                  className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {featureToggles['tool_ruqyah'] !== 'inactive' && (
          <Link
            id="tour-ruqyah"
            to="/tools/ruqyah"
            className={`p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 h-[34px] w-[34px] flex items-center justify-center shadow-sm flex-shrink-0 transition-opacity duration-200 ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            title="Roqya"
          >
            <Music size={14} />
          </Link>
        )}

        {featureToggles['tool_store'] !== 'inactive' && (
          <Link
            id="tour-store"
            to="/store"
            className={`p-2 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50 hover:bg-amber-100 dark:hover:bg-amber-900/50 h-[34px] w-[34px] flex items-center justify-center shadow-sm flex-shrink-0 transition-opacity duration-200 ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            title="Store"
          >
            <Store size={14} />
          </Link>
        )}

        {featureToggles['tool_lexique'] !== 'inactive' && (
          <Link
            id="tour-lexique"
            to="/explore/lexique"
            className={`p-2 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/50 hover:bg-purple-100 dark:hover:bg-purple-900/50 h-[34px] w-[34px] flex items-center justify-center shadow-sm flex-shrink-0 transition-opacity duration-200 ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            title={t('nav.lexique', 'Lexique')}
          >
            <Library size={14} />
          </Link>
        )}

        {featureToggles['tool_quran'] !== 'inactive' && (
          <Link
            id="tour-quran"
            to="/tools/quran"
            className={`p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 h-[34px] w-[34px] flex items-center justify-center shadow-sm flex-shrink-0 transition-opacity duration-200 ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            title="Le Saint Coran"
          >
            <BookOpen size={14} />
          </Link>
        )}

        <button
          id="tour-search"
          onClick={() => setIsSearchOpen(true)}
          className={`p-2 rounded-xl bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 h-[34px] w-[34px] flex items-center justify-center shadow-sm flex-shrink-0 transition-opacity duration-200 ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          aria-label="Search"
        >
          <Search size={14} />
        </button>

        <div className={`relative transition-opacity duration-200 ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} ref={filterRef}>
          <button
            id="tour-filter"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`p-2 rounded-xl border h-[34px] w-[34px] flex items-center justify-center transition-colors shadow-sm flex-shrink-0 relative ${
              filter !== 'all' || isFilterOpen
                ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            aria-label="Filter"
          >
            <Filter size={14} />
            {filter !== 'all' && (
              <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-800" />
            )}
          </button>

          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 sm:left-1/2 sm:-translate-x-1/2 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden z-50 flex flex-col py-1"
              >
                {(['all', 'favoris', 'secret', 'wird', 'recette'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setFilter(cat);
                      setIsFilterOpen(false);
                    }}
                    className={`px-4 py-2.5 text-left text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-between
                      ${filter === cat 
                        ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/10' 
                        : 'text-gray-700 dark:text-gray-200'
                      }`}
                  >
                    <span>{cat === 'all' ? t('all') : cat === 'favoris' ? t('favorites', 'Favoris') : cat === 'wird' ? t('wirds', 'Versets') : cat === 'secret' ? t('secrets', 'Secrets') : t('recettes', 'Recettes')}</span>
                    {filter === cat && <span className="text-emerald-500 text-[10px]">●</span>}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div id="tour-layout" className={`flex bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-1 flex-shrink-0 h-[34px] items-center transition-opacity duration-200 ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <button 
            onClick={() => setLayoutMode('grid2')}
            className={`p-1.5 rounded-lg transition-colors ${layoutMode === 'grid2' ? 'bg-gray-100 dark:bg-gray-700 text-emerald-600 dark:text-emerald-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
            title="2 Colonnes"
          >
            <LayoutGrid size={14} />
          </button>
          <button 
            onClick={() => setLayoutMode('grid1')}
            className={`p-1.5 rounded-lg transition-colors ${layoutMode === 'grid1' ? 'bg-gray-100 dark:bg-gray-700 text-emerald-600 dark:text-emerald-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
            title="1 Colonne"
          >
            <Square size={14} />
          </button>
          <button 
            onClick={() => setLayoutMode('list')}
            className={`p-1.5 rounded-lg transition-colors ${layoutMode === 'list' ? 'bg-gray-100 dark:bg-gray-700 text-emerald-600 dark:text-emerald-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
            title="Liste"
          >
            <List size={14} />
          </button>
        </div>
        </div>
      </div>

      {/* Onboarding Tour */}
      <OnboardingTour />

      {/* Spacer to compensate for fixed toolbar */}
      <div className="h-[36px] w-full" />

      {/* Banner Section */}
      <div className="mb-4 grid grid-cols-1 gap-4">
        {/* Annonce Board */}
        {announcement && announcement.visible && !isAnnouncementDismissed && (
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-900 dark:to-teal-900 rounded-3xl p-5 sm:p-6 shadow-sm relative overflow-hidden text-white flex flex-col justify-between">
            <div className="relative z-10 flex flex-col justify-center mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-white/20 px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider backdrop-blur-sm">{t('dashboardContent.announcement', 'Annonce')}</span>
                {user?.streakDays !== undefined && user.streakDays > 0 && (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-orange-500/80 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm border border-orange-400/50"
                  >
                    <Flame size={12} className="text-yellow-300" />
                    {user.streakDays} Jours de suite
                  </motion.div>
                )}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2">{announcement.title || t('dashboardContent.announcementTitle', 'Nouvelles mises à jour disponibles !')}</h3>
              <p className="text-emerald-50 dark:text-emerald-100 max-w-lg text-sm sm:text-base">
                {announcement.text || t('dashboardContent.announcementText', 'Découvrez la nouvelle version des outils d\'AsrarHub. Le Saint Coran est désormais disponible avec une option de téléchargement pour une lecture hors ligne fluide et rapide.')}
              </p>
            </div>
            
            <div className="relative z-10 mt-auto flex flex-wrap items-center gap-3">
              {lastReadPosition && (
                <Link to="/tools/quran?resume=true" className="inline-flex items-center gap-1.5 bg-white text-emerald-600 hover:bg-emerald-50 font-bold px-3 py-1.5 rounded-lg text-sm transition-colors shadow-sm">
                  <BookOpen size={16} />
                  Reprendre : {lastReadPosition.surahName} (Verset {lastReadPosition.ayahNumberInSurah})
                </Link>
              )}
              <button 
                onClick={() => {
                  localStorage.setItem('asrarhub_dismissed_announcement_text', announcement.text);
                  setIsAnnouncementDismissed(true);
                  window.location.reload();
                }}
                className="inline-flex items-center gap-1.5 bg-emerald-700/50 text-white hover:bg-emerald-700 font-bold px-4 py-1.5 rounded-lg text-sm transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4">
        {/* My Quran Bookmarks */}
        {quranBookmarks.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
              <Bookmark className="text-emerald-500" size={18} /> Signets du Coran
            </h3>
            <div className="space-y-3">
              {quranBookmarks.map((bookmark, idx) => (
                <Link
                  key={idx}
                  to={`/tools/quran?surah=${bookmark.surahNumber}&ayah=${bookmark.ayahNumberInSurah}`}
                  className="block bg-gray-50 dark:bg-gray-750 rounded-xl p-4 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors border border-transparent hover:border-emerald-100 dark:hover:border-emerald-800"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Sourate {bookmark.surahName}
                    </h4>
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-100 dark:bg-emerald-900/50 dark:text-emerald-400 px-2 py-1 rounded-full">
                      Verset {bookmark.ayahNumberInSurah}
                    </span>
                  </div>
                  {bookmark.note && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 italic">"{bookmark.note}"</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>


      
      {searchQuery && (
        <div className="mb-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-100 dark:border-emerald-800/50 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex flex-shrink-0 items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Search size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{t('searchInQuran', `Rechercher "{searchQuery}" dans le Saint Coran`).replace('{searchQuery}', searchQuery)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('searchInQuranDesc', 'Explorez les versets et traductions correspondants.')}</p>
            </div>
          </div>
          <Link
            to={`/tools/quran?search=${encodeURIComponent(searchQuery)}`}
            className="w-full sm:w-auto px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-sm transition-colors text-center shrink-0 flex items-center justify-center gap-2"
          >
            <BookOpen size={16} /> {t('searchButton', 'Rechercher')}
          </Link>
        </div>
      )}

      {aiMessage && (
        <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-2xl flex gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex flex-shrink-0 items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Flame size={20} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-emerald-900 dark:text-emerald-300 mb-1">Assistant Spirituel IA</h3>
            <p className="text-sm text-emerald-800 dark:text-emerald-400/90 leading-relaxed whitespace-pre-wrap">{aiMessage}</p>
          </div>
        </div>
      )}

      {filter === 'favoris' && (
        <div className="mb-6 overflow-x-auto hide-scrollbar">
          <div className="flex gap-3 pb-2">
            <button
              onClick={() => setActiveFolder(null)}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition-colors border ${
                activeFolder === null 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/40 dark:border-emerald-800 dark:text-emerald-300' 
                  : 'bg-white border-gray-200 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300'
              }`}
            >
              <Bookmark size={16} /> Tous les favoris
            </button>
            {bookmarkFolders.map(folder => (
              <button
                key={folder.id}
                onClick={() => setActiveFolder(folder.id)}
                className={`px-4 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition-colors border ${
                  activeFolder === folder.id 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/40 dark:border-emerald-800 dark:text-emerald-300' 
                    : 'bg-white border-gray-200 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300'
                }`}
              >
                <Folder size={16} /> {folder.name}
              </button>
            ))}
            <button
              onClick={() => {
                const name = prompt("Nom du nouveau dossier :");
                if (name) {
                  const newFolder = { id: Date.now().toString(), name, items: [] };
                  const newFolders = [...bookmarkFolders, newFolder];
                  setBookmarkFolders(newFolders);
                  localStorage.setItem('asrar_bookmark_folders', JSON.stringify(newFolders));
                }
              }}
              className="px-4 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition-colors border bg-gray-50 border-gray-200 text-gray-600 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Plus size={16} /> Nouveau
            </button>
          </div>
        </div>
      )}

      <div className={`grid gap-3 sm:gap-6 lg:gap-8 ${
        layoutMode === 'grid2' ? 'grid-cols-2 lg:grid-cols-3' : 
        layoutMode === 'list' ? 'grid-cols-1 lg:grid-cols-2' : 
        'grid-cols-1'
      }`}>
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <SecretCard key={item.id} item={item} layoutMode={layoutMode} />
          ))
        ) : (
          <div className="col-span-full py-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Search className="text-gray-400" size={24} />
            </div>
            <p className="text-gray-500 dark:text-gray-400">{t('dashboardContent.noResults', "Aucun résultat trouvé.")}</p>
          </div>
        )}
      </div>
    </div>
  );
};
