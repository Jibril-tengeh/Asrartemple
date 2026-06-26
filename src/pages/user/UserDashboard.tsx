import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Search, LayoutGrid, Square, List, Filter, X, BookOpen, Store, Megaphone, Award, MapPin, Trophy, ShieldCheck, ChevronDown } from 'lucide-react';
import { SecretCard, LayoutMode } from '../../components/SecretCard';
import { getAsrarItems } from '../../data/store';
import { AsrarItem, Category } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation, Link } from 'react-router-dom';

interface Props {
  initialFilter?: Category | 'all' | 'favoris';
}

export const UserDashboard: React.FC<Props> = ({ initialFilter = 'all' }) => {
  const { t } = useLanguage();
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
  const [lastReadPosition, setLastReadPosition] = useState<{ surahNumber: number, ayahNumberInSurah: number, surahName: string } | null>(null);

  useEffect(() => {
    setFilter(initialFilter);
  }, [initialFilter, location.pathname]);

  useEffect(() => {
    setItems(getAsrarItems());
    try {
      const parsed = JSON.parse(localStorage.getItem('asrar_bookmarks') || '[]');
      setBookmarks(Array.isArray(parsed) ? parsed : []);
    } catch (e) {
      setBookmarks([]);
    }
    
    try {
      const savedRead = localStorage.getItem('asrarhub_last_read_position');
      if (savedRead) {
        setLastReadPosition(JSON.parse(savedRead));
      }
    } catch(e) {}
  }, []);

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
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || [
      item.title,
      item.content,
      item.hook,
      item.verse,
      item.reference,
      ...(item.benefits || [])
    ].some(field => field?.toLowerCase().includes(q));
    
    let matchesFilter = false;
    if (filter === 'all') matchesFilter = true;
    else if (filter === 'favoris') matchesFilter = bookmarks.includes(item.id);
    else matchesFilter = item.category === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24">
      {/* Banner Section */}
      <div className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Annonce Board */}
        <div className="lg:col-span-2 bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-900 dark:to-teal-900 rounded-3xl p-5 sm:p-6 shadow-sm relative overflow-hidden text-white flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <Megaphone size={100} />
          </div>
          <div className="relative z-10 flex flex-col justify-center mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-white/20 px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider backdrop-blur-sm">{t('dashboardContent.announcement', 'Annonce')}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2">{t('dashboardContent.announcementTitle', 'Nouvelles mises à jour disponibles !')}</h3>
            <p className="text-emerald-50 dark:text-emerald-100 max-w-lg text-sm sm:text-base">
              {t('dashboardContent.announcementText', 'Découvrez la nouvelle version des outils d\'AsrarHub. Le Saint Coran est désormais disponible avec une option de téléchargement pour une lecture hors ligne fluide et rapide.')}
            </p>
          </div>
          
          {lastReadPosition && (
            <div className="relative z-10 mt-auto">
              <Link to="/tools/quran?resume=true" className="inline-flex items-center gap-2 bg-white text-emerald-600 hover:bg-emerald-50 font-bold px-4 py-2 rounded-xl transition-colors shadow-sm">
                <BookOpen size={18} />
                Reprendre: {lastReadPosition.surahName} (Verset {lastReadPosition.ayahNumberInSurah})
              </Link>
            </div>
          )}
        </div>

        {/* Top Contributors */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div 
            className="flex items-center justify-between cursor-pointer group"
            onClick={() => setIsTopContributorsOpen(!isTopContributorsOpen)}
          >
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Trophy className="text-amber-500" size={18} /> {t('dashboardContent.topContributors', 'Top Contributeurs')}
            </h3>
            <div className={`p-1.5 rounded-full bg-gray-50 dark:bg-gray-700/50 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-all duration-300 ${isTopContributorsOpen ? 'rotate-180' : ''}`}>
              <ChevronDown size={16} />
            </div>
          </div>
          <AnimatePresence>
            {isTopContributorsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                className="overflow-hidden space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 flex flex-shrink-0 items-center justify-center text-white font-bold shadow-sm">
                    AH
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">Ahmad Hassan</h4>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                      <MapPin size={10} /> <span>{t('dashboardContent.countryMorocco', 'Maroc')}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="flex items-center gap-1 text-[10px] font-bold bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded-md"><ShieldCheck size={10}/> {t('dashboardContent.badgeSage', 'Sage')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 flex flex-shrink-0 items-center justify-center text-white font-bold shadow-sm">
                    MK
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">Moussa Koné</h4>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                      <MapPin size={10} /> <span>{t('dashboardContent.countryMali', 'Mali')}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="flex items-center gap-1 text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded-md"><Award size={10}/> {t('dashboardContent.badgeScholar', 'Érudit')}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mb-6 flex justify-end items-center gap-2 relative min-h-[40px]">
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ width: 40, opacity: 0 }}
              animate={{ width: '100%', opacity: 1 }}
              exit={{ width: 40, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-0 bottom-0 overflow-hidden z-10"
            >
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Mots-clés, sourates, versets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-full pl-10 pr-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none text-sm shadow-sm"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <Link
          to="/store"
          className={`p-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50 hover:bg-amber-100 dark:hover:bg-amber-900/50 h-[40px] w-[40px] flex items-center justify-center shadow-sm flex-shrink-0 transition-opacity duration-200 ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          title="Store"
        >
          <Store size={18} />
        </Link>

        <Link
          to="/tools/quran"
          className={`p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 h-[40px] w-[40px] flex items-center justify-center shadow-sm flex-shrink-0 transition-opacity duration-200 ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          title="Le Saint Coran"
        >
          <BookOpen size={18} />
        </Link>

        <button
          onClick={() => setIsSearchOpen(true)}
          className={`p-2.5 rounded-xl bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 h-[40px] w-[40px] flex items-center justify-center shadow-sm flex-shrink-0 transition-opacity duration-200 ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          aria-label="Search"
        >
          <Search size={18} />
        </button>

        <div className={`relative transition-opacity duration-200 ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} ref={filterRef}>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`p-2.5 rounded-xl border h-[40px] w-[40px] flex items-center justify-center transition-colors shadow-sm flex-shrink-0 relative ${
              filter !== 'all' || isFilterOpen
                ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            aria-label="Filter"
          >
            <Filter size={18} />
            {filter !== 'all' && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-800" />
            )}
          </button>

          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden z-50 flex flex-col py-1"
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
                    <span>{cat === 'all' ? t('all') : cat === 'favoris' ? 'Favoris' : cat === 'wird' ? 'Versets' : cat === 'secret' ? 'Secrets' : 'Recettes'}</span>
                    {filter === cat && <span className="text-emerald-500 text-[10px]">●</span>}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className={`flex bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-1 flex-shrink-0 h-[40px] items-center transition-opacity duration-200 ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <button 
            onClick={() => setLayoutMode('grid2')}
            className={`p-1.5 rounded-lg transition-colors ${layoutMode === 'grid2' ? 'bg-gray-100 dark:bg-gray-700 text-emerald-600 dark:text-emerald-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
            title="2 Colonnes"
          >
            <LayoutGrid size={18} />
          </button>
          <button 
            onClick={() => setLayoutMode('grid1')}
            className={`p-1.5 rounded-lg transition-colors ${layoutMode === 'grid1' ? 'bg-gray-100 dark:bg-gray-700 text-emerald-600 dark:text-emerald-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
            title="1 Colonne"
          >
            <Square size={18} />
          </button>
          <button 
            onClick={() => setLayoutMode('list')}
            className={`p-1.5 rounded-lg transition-colors ${layoutMode === 'list' ? 'bg-gray-100 dark:bg-gray-700 text-emerald-600 dark:text-emerald-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
            title="Liste"
          >
            <List size={18} />
          </button>
        </div>
      </div>
      
      {searchQuery && (
        <div className="mb-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-100 dark:border-emerald-800/50 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex flex-shrink-0 items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Search size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Rechercher "{searchQuery}" dans le Saint Coran</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Explorez les versets et traductions correspondants.</p>
            </div>
          </div>
          <Link
            to={`/tools/quran?search=${encodeURIComponent(searchQuery)}`}
            className="w-full sm:w-auto px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-sm transition-colors text-center shrink-0 flex items-center justify-center gap-2"
          >
            <BookOpen size={16} /> Rechercher
          </Link>
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
            <p className="text-gray-500 dark:text-gray-400">Aucun résultat trouvé.</p>
          </div>
        )}
      </div>
    </div>
  );
};
