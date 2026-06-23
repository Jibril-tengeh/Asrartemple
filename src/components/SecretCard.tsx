import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AsrarItem } from '../types';

interface SecretCardProps {
  item: AsrarItem;
}

export const SecretCard: React.FC<SecretCardProps> = ({ item }) => {
  const { t } = useTranslation();

  return (
    <Link to={`/secret/${item.id}`} className="block h-full group">
       <div className="flex flex-col h-full cursor-pointer bg-white dark:bg-gray-800 rounded-[1.5rem] sm:rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1">
          <div className="w-full aspect-[4/5] sm:aspect-square overflow-hidden relative bg-gray-100 dark:bg-gray-900">
             {item.imageUrl ? (
               <img 
                 src={item.imageUrl} 
                 alt={item.title} 
                 className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                 referrerPolicy="no-referrer"
               />
             ) : (
               <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200 dark:bg-gray-800 text-gray-400">
                 <span className="text-xl font-medium opacity-50 uppercase">{item.category}</span>
               </div>
             )}
             
             {/* Badge Over Image */}
             <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide z-10 transition-colors">
               <span className="capitalize">{t(item.category === 'secret' ? 'secrets' : item.category === 'recette' ? 'recettes' : 'wirds')}</span>
             </div>

             {/* Title Over Image */}
             <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent pointer-events-none z-0"></div>
             <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 z-10">
               <h3 className="text-[15px] sm:text-[17px] font-bold text-white mb-0 leading-snug drop-shadow-md">
                 {item.title}
               </h3>
             </div>
          </div>
          
          <div className="p-3 sm:p-4 flex-1 flex flex-col border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
             {/* Description / Hook */}
             <p className="text-gray-500 dark:text-gray-400 text-[13px] sm:text-sm leading-relaxed line-clamp-3">
               {item.hook || item.content}
             </p>
          </div>
       </div>
    </Link>
  );
};

