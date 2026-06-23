import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, BookOpen, Star, Sparkles, ScrollText, Bookmark, BookType } from 'lucide-react';
import { getAsrarItems } from '../../data/store';
import { AsrarItem } from '../../types';

export const SecretDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [item, setItem] = useState<AsrarItem | null>(null);
  
  const [readingMode, setReadingMode] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    // Scroll to top when loading
    window.scrollTo(0, 0);
    const items = getAsrarItems();
    const foundItem = items.find(i => i.id === id);
    if (foundItem) {
      setItem(foundItem);
      try {
        const parsed = JSON.parse(localStorage.getItem('asrar_bookmarks') || '[]');
        setIsBookmarked(Array.isArray(parsed) ? parsed.includes(foundItem.id) : false);
      } catch (e) {
        setIsBookmarked(false);
      }
    }
  }, [id]);

  const toggleBookmark = () => {
    if (!item) return;
    let bookmarks = [];
    try {
      const parsed = JSON.parse(localStorage.getItem('asrar_bookmarks') || '[]');
      if (Array.isArray(parsed)) bookmarks = parsed;
    } catch (e) {
      bookmarks = [];
    }
    let newBookmarks;
    if (bookmarks.includes(item.id)) {
      newBookmarks = bookmarks.filter((bId: string) => bId !== item.id);
      setIsBookmarked(false);
    } else {
      newBookmarks = [...bookmarks, item.id];
      setIsBookmarked(true);
    }
    localStorage.setItem('asrar_bookmarks', JSON.stringify(newBookmarks));
  };

  if (!item) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  const CategoryIcon = () => {
    switch (item.category) {
      case 'wird': return <ScrollText className="text-blue-500" />;
      case 'secret': return <BookOpen className="text-emerald-500" />;
      case 'recette': return <Sparkles className="text-amber-500" />;
    }
  };

  return (
    <div className={`mx-auto p-4 sm:p-6 lg:p-8 pb-24 transition-colors duration-500 ${readingMode ? 'bg-[#fdfbf7] dark:bg-[#1a1917] min-h-screen' : 'max-w-3xl'}`}>
      <div className={`flex items-center justify-between mb-6 ${readingMode ? 'max-w-3xl mx-auto' : ''}`}>
        <button 
          onClick={() => navigate(-1)}
          className={`flex items-center space-x-2 px-3 py-2 -ml-3 rounded-lg transition-colors ${readingMode ? 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
        >
          <ArrowLeft size={20} />
          <span className="font-medium">{t('back')}</span>
        </button>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setReadingMode(!readingMode)}
            className={`p-2 rounded-full transition-colors flex items-center gap-2 ${readingMode ? 'bg-[#f4ebd0] text-[#8b6e3f] dark:bg-[#383120] dark:text-[#d4c39c]' : 'hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'}`}
            title="Mode Lecture"
          >
            <BookType size={22} />
          </button>
          <button 
            onClick={toggleBookmark}
            className={`p-2 rounded-full transition-colors ${isBookmarked ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'}`}
          >
            <Bookmark size={22} fill={isBookmarked ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      <div className={`overflow-hidden transition-all duration-500 ${readingMode ? 'max-w-3xl mx-auto bg-transparent border-none' : 'bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700'}`}>
        {item.imageUrl && !readingMode && (
          <div className="w-full h-64 sm:h-80 md:h-96 relative overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img 
              src={item.imageUrl} 
              alt={item.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          </div>
        )}
        <div className={`${readingMode ? 'p-0 sm:p-2 lg:p-4' : 'p-6 md:p-8 lg:p-10'}`}>
          {!readingMode && (
            <div className="flex items-center space-x-2 mb-5">
              <span className="inline-flex items-center justify-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                <CategoryIcon />
              </span>
              <span className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                {t(item.category === 'secret' ? 'secrets' : item.category === 'recette' ? 'recettes' : 'wirds')}
              </span>
            </div>
          )}

          <h1 className={`font-extrabold mb-6 leading-tight transition-colors ${
            readingMode 
              ? 'text-2xl sm:text-3xl md:text-4xl text-[#4a3f35] dark:text-[#d4c39c] font-arabic text-center' 
              : 'text-xl sm:text-2xl md:text-3xl text-gray-900 dark:text-white'
          }`}>
            {item.title}
          </h1>

          {item.verse && (
            <div className={`my-10 p-6 sm:p-8 rounded-2xl border shadow-inner transition-colors ${
              readingMode 
                ? 'bg-[#f4ebd0]/50 dark:bg-[#383120]/30 border-[#e8dcb5] dark:border-[#524830]/50'
                : 'bg-emerald-50/70 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/50'
            }`}>
              <p className={`font-arabic text-center mb-6 leading-relaxed transition-all ${
                readingMode 
                  ? 'text-3xl sm:text-4xl md:text-5xl text-[#5c4a30] dark:text-[#e8dcb5] leading-loose'
                  : 'text-2xl sm:text-3xl md:text-4xl text-emerald-800 dark:text-emerald-300 sm:leading-loose'
              }`} dir="rtl">
                " {item.verse} "
              </p>
              {item.reference && (
                <div className="flex items-center justify-center">
                  <div className={`h-px w-12 mr-4 ${readingMode ? 'bg-[#d1c29e] dark:bg-[#6b5e40]' : 'bg-emerald-200 dark:bg-emerald-700'}`}></div>
                  <p className={`text-center font-medium ${readingMode ? 'text-[#8b7556] dark:text-[#a89871]' : 'text-emerald-700 dark:text-emerald-500'}`}>
                    {item.reference}
                  </p>
                  <div className={`h-px w-12 ml-4 ${readingMode ? 'bg-[#d1c29e] dark:bg-[#6b5e40]' : 'bg-emerald-200 dark:bg-emerald-700'}`}></div>
                </div>
              )}
            </div>
          )}

          <div className="space-y-10 mt-8">
            <section>
              {!readingMode && (
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5 flex items-center border-b border-gray-100 dark:border-gray-700 pb-3">
                  <BookOpen className="mr-3 text-emerald-500" size={24} />
                  {t('content')}
                </h2>
              )}
              <div className={`max-w-none transition-all ${
                readingMode 
                  ? 'text-[#363028] dark:text-[#c4b79d] font-arabic text-xl sm:text-2xl leading-[2.5]' 
                  : 'prose dark:prose-invert text-gray-700 dark:text-gray-300 leading-relaxed text-lg'
              }`}>
                {item.content.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-6">{paragraph}</p>
                ))}
              </div>
            </section>

            {!readingMode && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5 flex items-center border-b border-gray-100 dark:border-gray-700 pb-3">
                  <Star className="mr-3 text-yellow-500" size={24} />
                  {t('benefits')}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {item.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start bg-gray-50 dark:bg-gray-700/40 p-4 rounded-xl border border-gray-100 dark:border-gray-700/60 shadow-sm">
                      <div className="mt-0.5 text-emerald-500 flex-shrink-0 bg-emerald-100 dark:bg-emerald-900/50 p-1.5 rounded-md mr-3">
                        <Sparkles size={16} />
                      </div>
                      <span className="text-gray-800 dark:text-gray-200 font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
