import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, BookOpen, Star, Sparkles, ScrollText, Bookmark } from 'lucide-react';
import { getAsrarItems } from '../../data/store';
import { AsrarItem } from '../../types';

export const SecretDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [item, setItem] = useState<AsrarItem | null>(null);

  useEffect(() => {
    // Scroll to top when loading
    window.scrollTo(0, 0);
    const items = getAsrarItems();
    const foundItem = items.find(i => i.id === id);
    if (foundItem) {
      setItem(foundItem);
    }
  }, [id]);

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
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 pb-24">
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 px-3 py-2 -ml-3 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">{t('back')}</span>
        </button>
        
        <button className="p-2 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 transition-colors">
          <Bookmark size={22} />
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {item.imageUrl && (
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
        <div className="p-6 md:p-8 lg:p-10">
          <div className="flex items-center space-x-2 mb-5">
            <span className="inline-flex items-center justify-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
              <CategoryIcon />
            </span>
            <span className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
              {t(item.category === 'secret' ? 'secrets' : item.category === 'recette' ? 'recettes' : 'wirds')}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
            {item.title}
          </h1>

          {item.verse && (
            <div className="my-10 p-6 sm:p-8 bg-emerald-50/70 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800/50 shadow-inner">
              <p className="font-arabic text-3xl sm:text-4xl md:text-5xl text-emerald-800 dark:text-emerald-300 leading-relaxed sm:leading-loose text-center mb-6" dir="rtl">
                " {item.verse} "
              </p>
              {item.reference && (
                <div className="flex items-center justify-center">
                  <div className="h-px w-12 bg-emerald-200 dark:bg-emerald-700 mr-4"></div>
                  <p className="text-center font-medium text-emerald-700 dark:text-emerald-500">
                    {item.reference}
                  </p>
                  <div className="h-px w-12 bg-emerald-200 dark:bg-emerald-700 ml-4"></div>
                </div>
              )}
            </div>
          )}

          <div className="space-y-10 mt-8">
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5 flex items-center border-b border-gray-100 dark:border-gray-700 pb-3">
                <BookOpen className="mr-3 text-emerald-500" size={24} />
                {t('content')}
              </h2>
              <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                {item.content.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </section>

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
          </div>
        </div>
      </div>
    </div>
  );
};
