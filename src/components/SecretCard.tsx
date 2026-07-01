import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { BookOpen, Sparkles, ScrollText, Image as ImageIcon, Crown } from 'lucide-react';
import { AsrarItem } from '../types';

export type LayoutMode = 'grid2' | 'grid1' | 'list';

interface SecretCardProps {
  item: AsrarItem;
  layoutMode?: LayoutMode;
}

const ImageWithFallback: React.FC<{ src: string; alt: string; className?: string; [key: string]: any }> = ({ src, alt, className, ...props }) => {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  return (
    <div className="absolute inset-0 w-full h-full">
      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-800 animate-pulse">
           <div className="w-6 h-6 border-2 border-gray-300 border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
      )}
      {status === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-800">
           <ImageIcon className="text-gray-400 opacity-50" size={32} />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${status === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
        {...props}
      />
    </div>
  );
};

export const SecretCard: React.FC<SecretCardProps> = ({ item, layoutMode = 'grid2' }) => {
  const { t } = useLanguage();
  
  const CategoryIcon = item.category === 'secret' ? BookOpen : item.category === 'recette' ? Sparkles : ScrollText;
  const categoryLabel = t(item.category === 'secret' ? 'secrets' : item.category === 'recette' ? 'recettes' : 'wirds');

  if (layoutMode === 'list') {
    return (
      <Link to={`/secret/${item.id}`} className="block w-full group">
        <div className="flex flex-row h-[130px] sm:h-[150px] cursor-pointer bg-white dark:bg-gray-800 rounded-[1.25rem] shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1">
          {/* Image Area */}
          <div className="w-[110px] sm:w-[140px] h-full relative bg-gray-100 dark:bg-gray-900 flex-shrink-0">
            {item.imageUrl ? (
              <ImageWithFallback 
                src={item.imageUrl} 
                alt={item.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200 dark:bg-gray-800 text-gray-400">
                <CategoryIcon size={32} className="opacity-30" />
              </div>
            )}
            
            {/* Badge */}
            <div className="absolute top-2 left-2 flex gap-1 z-10 max-w-[calc(100%-16px)]">
              {item.isPremium && (
                <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-1.5 py-0.5 rounded-full flex items-center shadow-sm">
                  <Crown size={12} className="shrink-0" />
                </div>
              )}
              <div className="bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide truncate">
                <span className="capitalize">{categoryLabel}</span>
              </div>
            </div>
          </div>
          
          {/* Content Area */}
          <div className="p-2 sm:p-3 flex-1 flex flex-col justify-center bg-gray-50/50 dark:bg-gray-800/50 overflow-hidden">
            <h3 className="text-[15px] sm:text-[17px] font-bold text-gray-900 dark:text-gray-100 mb-1.5 leading-snug line-clamp-2 mt-0">
              {item.title}
            </h3>
            {item.hook && (
              <p className="text-gray-500 dark:text-gray-400 text-[12px] sm:text-[13px] leading-relaxed line-clamp-2">
                {item.hook}
              </p>
            )}
          </div>
        </div>
      </Link>
    );
  }

  // Grid1 and Grid2 modes
  const isGrid1 = layoutMode === 'grid1';

  return (
    <Link to={`/secret/${item.id}`} className="block h-full group">
       <div className="flex flex-col h-full cursor-pointer bg-white dark:bg-gray-800 rounded-[1.5rem] sm:rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1">
          <div className={`w-full overflow-hidden relative bg-gray-100 dark:bg-gray-900 flex-shrink-0 ${isGrid1 ? 'aspect-video' : 'aspect-[4/5] sm:aspect-square'}`}>
             {item.imageUrl ? (
               <ImageWithFallback 
                 src={item.imageUrl} 
                 alt={item.title} 
                 className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                 referrerPolicy="no-referrer"
               />
             ) : (
               <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200 dark:bg-gray-800 text-gray-400">
                 <CategoryIcon size={isGrid1 ? 48 : 40} className="opacity-30" />
               </div>
             )}
             
             {/* Badge Over Image */}
             <div className="absolute top-3 left-3 flex gap-1.5 z-10 transition-colors max-w-[calc(100%-24px)]">
               {item.isPremium && (
                 <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-2 py-1 rounded-full flex items-center shadow-md">
                   <Crown size={14} className="shrink-0" />
                 </div>
               )}
               <div className="bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold tracking-wide truncate whitespace-nowrap">
                 <span className="capitalize">{categoryLabel}</span>
               </div>
             </div>

             {/* Title Over Image */}
             <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent pointer-events-none z-0"></div>
             <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 z-10">
               <h3 className={`font-bold text-white mb-0 leading-snug drop-shadow-md line-clamp-3 ${isGrid1 ? 'text-[18px] sm:text-[20px]' : 'text-[14px] sm:text-[16px]'}`}>
                 {item.title}
               </h3>
             </div>
          </div>
          
          {item.hook && (
            <div className="p-2.5 sm:p-3 flex-1 flex flex-col border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
               {/* Hook */}
               <p className={`text-gray-500 dark:text-gray-400 leading-relaxed ${isGrid1 ? 'text-sm sm:text-[15px] line-clamp-3 mt-0' : 'text-[13px] sm:text-sm line-clamp-3 mt-0'}`}>
                 {item.hook}
               </p>
            </div>
          )}
       </div>
    </Link>
  );
};

