import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, LayoutGrid, Square, List, Filter, X } from 'lucide-react';
import { SecretCard, LayoutMode } from '../../components/SecretCard';
import { getAsrarItems } from '../../data/store';
import { AsrarItem, Category } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

export const UserDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState<AsrarItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<Category | 'all'>('all');
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('grid2');
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setItems(getAsrarItems());
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
    const matchesFilter = filter === 'all' || item.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt">
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
                {(['all', 'secret', 'wird', 'recette'] as const).map((cat) => (
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
                    <span>{cat === 'all' ? t('all') : cat === 'wird' ? 'Versets' : cat === 'secret' ? 'Secrets' : 'Recettes'}</span>
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
