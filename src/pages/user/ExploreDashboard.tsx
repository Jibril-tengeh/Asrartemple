import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Compass, Book, Shield, Heart, Sparkles, Moon, Sun, ArrowRight, Wallet, Activity, Share2, HelpCircle, FileText, Download, Eye, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export const ExploreDashboard: React.FC = () => {
  const { t } = useLanguage();

  const categories = [
    {
      id: 'protection',
      title: t('exploreDashboard.cat.protection.title', 'Protection (Tahsin)'),
      description: t('exploreDashboard.cat.protection.desc', 'Boucliers spirituels, protection contre le mauvais œil et la sorcellerie.'),
      icon: Shield,
      color: 'from-blue-500 to-indigo-600',
      count: 24,
    },
    {
      id: 'fath',
      title: t('exploreDashboard.cat.fath.title', 'Ouverture (Fath)'),
      description: t('exploreDashboard.cat.fath.desc', 'Pour le déblocage des situations difficiles et le succès professionnel.'),
      icon: Sun,
      color: 'from-amber-400 to-orange-500',
      count: 18,
    },
    {
      id: 'rizq',
      title: t('exploreDashboard.cat.rizq.title', 'Subsistance (Rizq)'),
      description: t('exploreDashboard.cat.rizq.desc', 'Secrets pour l\'attirance de la richesse, la chance et l\'abondance.'),
      icon: Wallet,
      color: 'from-emerald-400 to-teal-500',
      count: 35,
    },
    {
      id: 'shifa',
      title: t('exploreDashboard.cat.shifa.title', 'Guérison (Shifa)'),
      description: t('exploreDashboard.cat.shifa.desc', 'Remèdes et invocations pour la santé physique et spirituelle.'),
      icon: Activity,
      color: 'from-rose-400 to-pink-500',
      count: 12,
    },
    {
      id: 'mahabba',
      title: t('exploreDashboard.cat.mahabba.title', 'Amour (Mahabba)'),
      description: t('exploreDashboard.cat.mahabba.desc', 'Pour l\'entente familiale, le mariage et se faire aimer par les créatures.'),
      icon: Heart,
      color: 'from-purple-400 to-fuchsia-500',
      count: 15,
    },
    {
      id: 'ilm_huruf',
      title: t('exploreDashboard.cat.ilm_huruf.title', 'Science des Lettres'),
      description: t('exploreDashboard.cat.ilm_huruf.desc', 'Exploration d\'Ilm al-Huruf et les secrets des lettres de l\'alphabet arabe.'),
      icon: Moon,
      color: 'from-slate-600 to-black',
      count: 8,
    }
  ];

  const sagesses = [
    { arabic: "مَن عَرَفَ نَفْسَهُ فَقَدْ عَرَفَ رَبَّهُ", french: t('exploreDashboard.wisdom.1.text', "Celui qui connaît son âme, connaît son Seigneur."), source: t('exploreDashboard.wisdom.1.source', "Sagesse Soufie") },
    { arabic: "وَاصْبِرْ فَإِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ", french: t('exploreDashboard.wisdom.2.text', "Et sois patient. Car Allah ne laisse pas perdre la récompense des gens de bien."), source: t('exploreDashboard.wisdom.2.source', "Coran 11:115") },
    { arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", french: t('exploreDashboard.wisdom.3.text', "Certes, avec la difficulté est la facilité."), source: t('exploreDashboard.wisdom.3.source', "Coran 94:6") },
    { arabic: "الْحَمْدُ لِلَّهِ الَّذِي بِنِعْمَتِهِ تَتِمُّ الصَّالِحَاتُ", french: t('exploreDashboard.wisdom.4.text', "Louange à Allah par la grâce de qui s'accomplissent les bonnes œuvres."), source: t('exploreDashboard.wisdom.4.source', "Invocation prophétique") },
  ];
  const [sagesse, setSagesse] = useState(sagesses[0]);
  const [articles, setArticles] = useState<any[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);

  useEffect(() => {
    // Randomize daily wisdom based on current day (pseudo-random)
    const today = new Date().getDate();
    setSagesse(sagesses[today % sagesses.length]);

    const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'), limit(3));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setArticles(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => console.error("Error fetching articles", error));

    return () => unsubscribe();
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: t('exploreDashboard.wisdomShareTitle'),
          text: `"${sagesse.arabic}"\n\n${sagesse.french}\n— ${sagesse.source}`,
        });
      } catch (err) {
        console.error('Erreur de partage', err);
      }
    } else {
      alert(t('exploreDashboard.shareErrorText'));
    }
  };
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-emerald-800 to-emerald-950 rounded-3xl p-8 mb-10 text-white relative overflow-hidden shadow-lg border border-emerald-700/50"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Compass className="text-emerald-400" size={32} />
            <h1 className="text-3xl font-bold tracking-tight">{t('exploreDashboard.title')}</h1>
          </div>
          <p className="text-emerald-100/80 text-lg max-w-2xl mb-8 leading-relaxed">
            {t('exploreDashboard.description')}
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button className="bg-emerald-400 text-emerald-950 font-bold px-6 py-3 rounded-xl shadow-md hover:bg-emerald-300 transition-colors flex items-center gap-2">
              <Sparkles size={18} />
              {t('exploreDashboard.buttonAsma')}
            </button>
            <button className="bg-emerald-900/50 border border-emerald-700 text-white font-bold px-6 py-3 rounded-xl hover:bg-emerald-800/50 transition-colors flex items-center gap-2">
              <Book size={18} />
              {t('exploreDashboard.buttonTreatises')}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Categories Grid */}
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('exploreDashboard.themesTitle')}</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">{t('exploreDashboard.themesSubtitle')}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {categories.map((cat, index) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={`/explore/${cat.id}`} className="block h-full group">
              <div className="h-full bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${cat.color} rounded-bl-full opacity-5 transition-opacity group-hover:opacity-10`}></div>
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                      <cat.icon size={24} />
                    </div>
                    <span className="text-xs font-bold text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                      {cat.count} {t('exploreDashboard.secrets')}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-500 transition-colors">
                    {t(`exploreCategories.${cat.id}.title`) !== `exploreCategories.${cat.id}.title` ? t(`exploreCategories.${cat.id}.title`) : cat.title}
                  </h3>
                  
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed flex-1">
                    {t(`exploreCategories.${cat.id}.description`) !== `exploreCategories.${cat.id}.description` ? t(`exploreCategories.${cat.id}.description`) : cat.description}
                  </p>
                  
                  <div className="mt-4 flex justify-end text-gray-300 dark:text-gray-600 group-hover:text-emerald-500 transition-colors">
                    <ArrowRight size={20} />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
      
      {/* Featured Insight */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('exploreDashboard.wisdomOfTheDay')}</h2>
        <div id="sagesse-card" className="bg-[#fdfbf7] dark:bg-[#1a1917] rounded-3xl p-8 border border-[#e8dcb5] dark:border-[#383120] relative">
          <Book className="absolute top-6 right-6 text-[#d1c29e] dark:text-[#383120] opacity-20" size={64} />
          <p className="font-arabic text-3xl sm:text-4xl text-[#5c4a30] dark:text-[#d4c39c] mb-6 leading-loose" dir="rtl">
            " {sagesse.arabic} "
          </p>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#d1c29e] dark:via-[#524830] to-transparent my-6"></div>
          <p className="text-[#8b7556] dark:text-[#a89871] text-lg font-medium italic mb-2">
            "{sagesse.french}"
          </p>
          <div className="flex items-center justify-between mt-6">
            <p className="text-[#b1a084] dark:text-[#6b5e40] text-sm font-bold uppercase tracking-widest">
              — {sagesse.source}
            </p>
            <button 
              onClick={handleShare}
              className="text-[#8b7556] hover:text-[#5c4a30] dark:text-[#a89871] dark:hover:text-[#d4c39c] transition-colors flex items-center gap-2 p-2 rounded-full hover:bg-[#e8dcb5]/30 dark:hover:bg-[#383120]/50"
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Discovery & Tools Row */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Module Lexique des Symboles */}
        <Link to="/explore/lexique" className="group">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all h-full relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <FileText size={120} />
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl">
                <Book size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('exploreDashboard.lexiconTitle')}</h3>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mb-6 relative z-10 w-full md:max-w-[80%]">
              {t('exploreDashboard.lexiconDesc')}
            </p>
            <div className="flex font-semibold text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-500 transition-colors items-center">
              {t('exploreDashboard.lexiconLink')} <ArrowRight size={16} className="ml-2" />
            </div>
          </div>
        </Link>
        
        {/* Module Quizz sur les Asrar */}
        <Link to="/explore/quizz" className="group">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all h-full relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <HelpCircle size={120} />
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl">
                <Sparkles size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('exploreDashboard.quizTitle')}</h3>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mb-6 relative z-10 w-full md:max-w-[80%]">
              {t('exploreDashboard.quizDesc')}
            </p>
            <div className="flex font-semibold text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-500 transition-colors items-center">
              {t('exploreDashboard.quizLink')} <ArrowRight size={16} className="ml-2" />
            </div>
          </div>
        </Link>

        {/* Module Calendar Converter */}
        <Link to="/explore/calendar" className="group md:col-span-2 lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all h-full relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Moon size={120} />
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
                <Moon size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('exploreDashboard.calendarTitle')}</h3>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mb-6 relative z-10 w-full md:max-w-[80%]">
              {t('exploreDashboard.calendarDesc')}
            </p>
            <div className="flex font-semibold text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-500 transition-colors items-center">
              {t('exploreDashboard.calendarLink')} <ArrowRight size={16} className="ml-2" />
            </div>
          </div>
        </Link>
        
      </div>

      {/* Derniers Articles */}
      {articles.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Derniers Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((article) => (
              <div key={article.id} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow flex flex-col cursor-pointer group" onClick={() => setSelectedArticle(article)}>
                {article.thumbnail ? (
                  <div className="h-48 overflow-hidden">
                    <img src={article.thumbnail} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                ) : (
                  <div className="h-48 bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                    <FileText size={48} className="text-emerald-200 dark:text-emerald-800" />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-emerald-500 transition-colors">{article.title}</h3>
                  <div className="mt-auto flex items-center text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    Lire l'article <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lunar Phase Widget */}
      <div className="mt-6 bg-slate-900 rounded-2xl p-6 shadow-sm overflow-hidden relative border border-slate-800">
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-800/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-slate-800 rounded-full shadow-inner flex items-center justify-center border-2 border-slate-700 relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-slate-200 to-slate-400 shadow-[0_0_15px_rgba(255,255,255,0.2)]"></div>
              {/* Overlay for moon phase (approximate crescent) */}
              <div className="absolute right-1 top-1 bottom-1 left-4 rounded-full bg-slate-800/90 mix-blend-multiply"></div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">{t('exploreDashboard.lunarTitle')}</h3>
              <p className="text-slate-400 text-sm">{t('exploreDashboard.lunarDate')}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="text-xs font-semibold px-2 py-1 bg-emerald-900/50 text-emerald-300 rounded border border-emerald-800">{t('exploreDashboard.lunarFavorable')}</span>
                <span className="text-xs font-semibold px-2 py-1 bg-slate-800 text-slate-300 rounded border border-slate-700">{t('exploreDashboard.lunarIllumination')}</span>
              </div>
            </div>
          </div>
          <Link to="/explore/calendar" className="flex-shrink-0 text-slate-400 hover:text-white transition-colors cursor-pointer text-sm font-medium flex items-center gap-1">
            {t('exploreDashboard.lunarViewFull')} <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Article Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                <FileText size={20} /> Lecture
              </h3>
              <button onClick={() => setSelectedArticle(null)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 lg:p-10 hide-scrollbar bg-gray-50 dark:bg-gray-900">
              <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
                {selectedArticle.thumbnail && (
                  <div className="w-full h-64 md:h-80 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                    <img src={selectedArticle.thumbnail} alt={selectedArticle.title} className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 left-0 p-6 z-20">
                      <h1 className="text-2xl md:text-3xl font-black text-white">{selectedArticle.title}</h1>
                    </div>
                  </div>
                )}
                {!selectedArticle.thumbnail && (
                  <div className="p-6 md:p-10 border-b border-gray-100 dark:border-gray-700">
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">{selectedArticle.title}</h1>
                  </div>
                )}
                
                <div className="p-6 md:p-10 prose prose-emerald dark:prose-invert max-w-none">
                  {selectedArticle.type === 'richtext' ? (
                    <div dangerouslySetInnerHTML={{ __html: selectedArticle.content || '' }} />
                  ) : (
                    <pre className="p-4 rounded-xl bg-gray-900 text-gray-100 overflow-x-auto text-sm font-mono">
                      <code>{selectedArticle.content}</code>
                    </pre>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
