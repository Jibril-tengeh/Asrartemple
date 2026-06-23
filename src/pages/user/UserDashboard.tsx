import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { SecretCard } from '../../components/SecretCard';
import { getAsrarItems } from '../../data/store';
import { AsrarItem, Category } from '../../types';

export const UserDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState<AsrarItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<Category | 'all'>('all');

  useEffect(() => {
    setItems(getAsrarItems());
  }, []);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || item.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8 safe-area-pt">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          {t('userDashboard')}
        </h1>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={t('search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
            />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
            {(['all', 'secret', 'wird', 'recette'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-3 sm:py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-colors
                  ${filter === cat 
                    ? 'bg-emerald-600 text-white shadow-sm border border-emerald-600' 
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
              >
                {t(cat === 'secret' ? 'secrets' : cat === 'recette' ? 'recettes' : cat === 'wird' ? 'wirds' : 'all')}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <SecretCard key={item.id} item={item} />
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
