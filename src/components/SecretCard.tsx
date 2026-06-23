import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BookOpen, Star, Sparkles, ScrollText } from 'lucide-react';
import { AsrarItem, Category } from '../types';

interface SecretCardProps {
  item: AsrarItem;
}

const CategoryIcon = ({ type }: { type: Category }) => {
  switch (type) {
    case 'wird': return <ScrollText size={18} className="text-blue-500" />;
    case 'secret': return <BookOpen size={18} className="text-emerald-500" />;
    case 'recette': return <Sparkles size={18} className="text-amber-500" />;
  }
};

const CategoryColor = (type: Category) => {
  switch (type) {
    case 'wird': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
    case 'secret': return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    case 'recette': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
  }
};

export const SecretCard: React.FC<SecretCardProps> = ({ item }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${CategoryColor(item.category)}`}>
            <CategoryIcon type={item.category} />
            <span className="capitalize">{t(item.category === 'secret' ? 'secrets' : item.category === 'recette' ? 'recettes' : 'wirds')}</span>
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 leading-tight">
          {item.title}
        </h3>
        
        {item.verse && (
          <p className="text-right font-arabic text-xl text-emerald-600 dark:text-emerald-400 my-3 leading-relaxed" dir="rtl">
            "{item.verse}"
          </p>
        )}
        
        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4 flex-1">
          {item.content}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {item.benefits.slice(0, 2).map((benefit, idx) => (
            <span key={idx} className="inline-flex items-center text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 px-2 py-1 rounded">
              <Star size={12} className="mr-1 text-yellow-400" /> {benefit}
            </span>
          ))}
          {item.benefits.length > 2 && (
             <span className="inline-flex items-center text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
               +{item.benefits.length - 2}
             </span>
          )}
        </div>
        
        <Link 
          to={`/secret/${item.id}`}
          className="block w-full text-center py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 rounded-lg text-sm font-medium transition-colors mt-auto border border-emerald-100 dark:border-emerald-800/50"
        >
          {t('viewDetail')}
        </Link>
      </div>
    </div>
  );
};
