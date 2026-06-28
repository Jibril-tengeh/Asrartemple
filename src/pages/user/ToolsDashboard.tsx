import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Clock, Activity, Compass, BookOpen, Star, Sparkles, Users, Key, Shield, Eye, Hexagon, Coins, Scale, Moon, ListTodo, Layers, Shuffle, Target, Lightbulb, ChevronRight, ChevronLeft, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const tools = [
  // Simple Tools
  {
    id: 'abjad',
    title: 'Calculateur Abjad',
    description: 'Calculez la valeur numérique mystique de vos noms et wirds.',
    icon: Calculator,
    color: 'from-blue-500 to-indigo-600',
    path: '/tools/abjad',
    level: 'simple'
  },
  {
    id: 'asma',
    title: 'Noms Divins Personnels',
    description: 'Découvrez vos noms divins correspondants au poids mystique de votre nom.',
    icon: Sparkles,
    color: 'from-indigo-500 to-cyan-600',
    path: '/tools/asma',
    level: 'simple'
  },
  {
    id: '99names',
    title: 'Les 99 Noms d\'Allah',
    description: 'Recherchez, étudiez et comprenez les Noms Sublimes (Asma al-Husna).',
    icon: ListTodo,
    color: 'from-cyan-500 to-blue-600',
    path: '/tools/99names',
    level: 'simple'
  },
  {
    id: 'quran',
    title: 'Le Saint Coran',
    description: "Lecture et méditation sur le Coran, l'outil fondamental de tout Asrar.",
    icon: BookOpen,
    color: 'from-emerald-600 to-teal-800',
    path: '/tools/quran',
    level: 'simple'
  },
  {
    id: 'tasbih',
    title: 'Tasbih Virtuel',
    description: 'Un compteur de zikr intelligent pour suivre vos récitations quotidiennes.',
    icon: Activity,
    color: 'from-emerald-500 to-teal-600',
    path: '/tools/tasbih',
    level: 'simple'
  },
  {
    id: 'daily-dhikr',
    title: 'Daily Dhikr Tracker',
    description: 'Définissez des objectifs et suivez votre Dhikr quotidien avec persistance.',
    icon: Target,
    color: 'from-emerald-600 to-green-700',
    path: '/tools/daily-dhikr',
    level: 'simple'
  },
  {
    id: 'planetary',
    title: 'Heures Planétaires',
    description: 'Déterminez les heures spirituelles propices pour vos invocations.',
    icon: Clock,
    color: 'from-amber-500 to-orange-600',
    path: '/tools/planetary',
    level: 'simple'
  },
  {
    id: 'zakat',
    title: 'Calculateur de Zakat',
    description: 'Calculez précisément votre Zakat al-Maal sur diverses richesses.',
    icon: Coins,
    color: 'from-yellow-500 to-amber-600',
    path: '/tools/zakat',
    level: 'simple'
  },
  {
    id: 'faraid',
    title: 'Calculateur de Faraid',
    description: 'Calculez les parts d\'héritage selon la jurisprudence islamique.',
    icon: Scale,
    color: 'from-amber-600 to-red-600',
    path: '/tools/faraid',
    level: 'simple'
  },
  {
    id: 'dreams',
    title: 'Journal des Rêves',
    description: 'Analysez et documentez vos rêves avec interprétations.',
    icon: Moon,
    color: 'from-blue-700 to-indigo-900',
    path: '/tools/dreams',
    level: 'simple'
  },
  // Advanced Tools
  {
    id: 'personal-wird',
    title: 'Générateur de Wird',
    description: 'Istikhraj al-Asma: Calculez votre Zikr personnel selon votre poids mystique.',
    icon: Sparkles,
    color: 'from-emerald-500 to-teal-600',
    path: '/tools/personal-wird',
    level: 'advanced'
  },
  {
    id: 'lunar-mansions',
    title: 'Demeures de la Lune',
    description: 'Manazil al-Qamar: Suivez les 28 demeures astrologiques pour vos opérations.',
    icon: Compass,
    color: 'from-indigo-500 to-blue-600',
    path: '/tools/lunar-mansions',
    level: 'advanced'
  },
  {
    id: 'spiritual-compatibility',
    title: 'Compatibilité Spirituelle',
    description: 'Hisab al-Tawafuq: Règle d\'Al-Buni pour le mariage et les partenariats.',
    icon: Scale,
    color: 'from-rose-500 to-pink-600',
    path: '/tools/spiritual-compatibility',
    level: 'advanced'
  },
  {
    id: 'ilm-jafar',
    title: 'Oracle de Jafar',
    description: 'Ilm al-Jafar: Divination suprême par la fracturation des lettres (Taksir).',
    icon: Key,
    color: 'from-purple-500 to-indigo-600',
    path: '/tools/ilm-jafar',
    level: 'advanced'
  },
  {
    id: 'grand-oaths',
    title: 'Grands Serments',
    description: 'Da\'awat & Azayim: Bibliothèque des invocations majeures.',
    icon: Shield,
    color: 'from-amber-500 to-orange-600',
    path: '/tools/grand-oaths',
    level: 'advanced'
  },
  {
    id: 'elemental',
    title: 'Analyseur Élémentaire',
    description: 'Tabai\' al-Huruf: Découvrez la nature dominante de votre nom (Feu, Terre, Air, Eau).',
    icon: Star,
    color: 'from-red-500 to-orange-600',
    path: '/tools/elemental',
    level: 'advanced'
  },
  {
    id: 'geomancy',
    title: 'Géomancie Arabe',
    description: 'Khatt ar-Raml: Générez et interprétez les figures géomantiques pour consulter.',
    icon: Layers,
    color: 'from-amber-600 to-yellow-800',
    path: '/tools/geomancy',
    level: 'advanced'
  },
  {
    id: 'letters',
    title: 'Science des Lettres',
    description: 'Sirr al-Huruf: Découvrez les mystères associés à chaque lettre arabe.',
    icon: BookOpen,
    color: 'from-emerald-500 to-teal-600',
    path: '/tools/letters',
    level: 'advanced'
  },
  {
    id: 'rouhaniyya',
    title: 'Extracteur Rouhaniyya',
    description: 'Extraction des esprits célestes ou terrestres basés sur les Noms et le Poids.',
    icon: Layers,
    color: 'from-fuchsia-600 to-purple-800',
    path: '/tools/rouhaniyya',
    level: 'advanced'
  },
  {
    id: 'taksir',
    title: 'Taksir (Brisures)',
    description: 'Générez des matrices de Taksir et des cassures de lettres.',
    icon: Shuffle,
    color: 'from-orange-500 to-rose-600',
    path: '/tools/taksir',
    level: 'advanced'
  },
  {
    id: 'sirr',
    title: 'Sirr Al-Asrar',
    description: 'Analyse ésotérique absolue : éléments, auras, et khuddam.',
    icon: Eye,
    color: 'from-violet-700 to-purple-900',
    path: '/tools/sirr',
    level: 'advanced'
  },
  {
    id: 'zairja',
    title: 'Oracle Zairja',
    description: 'La machine ancestrale des soufis pour prédire et éclaircir les questions mystiques.',
    icon: Hexagon,
    color: 'from-zinc-700 to-black',
    path: '/tools/zairja',
    level: 'advanced'
  },
  {
    id: 'khatim',
    title: 'Générateur de Khatim',
    description: 'Créez des carrés magiques (Wafq) 3x3 basés sur des valeurs numériques.',
    icon: Star,
    color: 'from-purple-500 to-pink-600',
    path: '/tools/khatim',
    comingSoon: false,
    level: 'advanced'
  },
  {
    id: 'ruqyah',
    title: 'Ruqyah Shari\'ah',
    description: 'Séances de traitement spirituel intensif avec répétitions ciblées (7 à 1000).',
    icon: Shield,
    color: 'from-blue-600 to-indigo-700',
    path: '/tools/ruqyah',
    level: 'advanced'
  },
  {
    id: 'talsam',
    title: 'Générateur de Talsam',
    description: 'Créez des mots de pouvoir et talsams chiffrés pour encapsuler vos invocations.',
    icon: Key,
    color: 'from-slate-600 to-gray-900',
    path: '/tools/talsam',
    level: 'advanced'
  },
  {
    id: 'istikhara',
    title: 'Istikhara Numérique',
    description: "Tirage du sort spirituel basé sur le Saint Coran et la science d'Abjad.",
    icon: Compass,
    color: 'from-teal-500 to-emerald-600',
    path: '/tools/istikhara',
    level: 'advanced'
  },
  {
    id: 'khouddam',
    title: 'Extracteur de Khouddam',
    description: 'Calculez et invoquez les entités spirituelles angéliques et terrestres (A\'il et Yush) liées à un nom.',
    icon: Sparkles,
    color: 'from-amber-600 to-red-800',
    path: '/tools/khouddam',
    level: 'advanced'
  },
  {
    id: 'awfaq',
    title: 'Générateur de Awfaq',
    description: 'Créez des carrés magiques complexes (Muthallath, Murabba) avec alignement planétaire et intentions.',
    icon: Hexagon,
    color: 'from-fuchsia-600 to-pink-800',
    path: '/tools/awfaq',
    level: 'advanced'
  },
  {
    id: 'quranic-faal',
    title: 'Istikhara Coranique (Faal)',
    description: 'Méthode mystique de consultation du Coran pour la divination et la guidance (Tirage de sort).',
    icon: BookOpen,
    color: 'from-blue-700 to-indigo-900',
    path: '/tools/quranic-faal',
    level: 'advanced'
  }
];

import { BannerAd } from '../../components/BannerAd';

export const ToolsDashboard: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showGuide, setShowGuide] = useState(false);
  const [guideStep, setGuideStep] = useState(0);
  const [activeTab, setActiveTab] = useState<'simple' | 'advanced'>('simple');
  const [featureToggles, setFeatureToggles] = useState<any>({});
  const [premiumModalOpen, setPremiumModalOpen] = useState<{ isOpen: boolean, title: string }>({ isOpen: false, title: '' });

  useEffect(() => {
    const hasSeenGuide = localStorage.getItem('hasSeenMysticToolsGuide');
    if (!hasSeenGuide) {
      setShowGuide(true);
    }
    
    const unsubscribeFeatures = onSnapshot(doc(db, 'settings', 'features'), (docSnap) => {
      if (docSnap.exists()) {
        setFeatureToggles(docSnap.data());
      } else {
        setFeatureToggles({});
      }
    });

    return () => unsubscribeFeatures();
  }, []);

  const closeGuide = () => {
    setShowGuide(false);
    localStorage.setItem('hasSeenMysticToolsGuide', 'true');
  };

  const guideSteps = [
    {
      title: t('toolsDashboard.guide.welcomeTitle', "Bienvenue dans les Outils Mystiques"),
      description: t('toolsDashboard.guide.welcomeDesc', "Ce tableau de bord regroupe des outils professionnels pour l'étude et la pratique spirituelle. Suivez ce guide pour découvrir comment les utiliser efficacement."),
      icon: Compass,
      color: "text-emerald-500",
      bg: "bg-emerald-100 dark:bg-emerald-900/30"
    },
    {
      title: t('toolsDashboard.guide.abjadTitle', "Calculateur Abjad"),
      description: t('toolsDashboard.guide.abjadDesc', "Le calcul du poids mystique (Adad) est la base de toute opération. Utilisez cet outil pour convertir vos noms ou invocations en nombres selon différentes méthodes (Maghrébi, Machriqi)."),
      icon: Calculator,
      color: "text-blue-500",
      bg: "bg-blue-100 dark:bg-blue-900/30"
    },
    {
      title: t('toolsDashboard.guide.khatimTitle', "Générateur de Khatim"),
      description: t('toolsDashboard.guide.khatimDesc', "Une fois le poids mystique connu, entrez-le dans le générateur de Khatim pour créer un carré magique (Wafq) 3x3 équilibré, prêt pour vos travaux spirituels."),
      icon: Hexagon,
      color: "text-purple-500",
      bg: "bg-purple-100 dark:bg-purple-900/30"
    },
    {
      title: t('toolsDashboard.guide.namesTitle', "Extraction des Noms (Istikhraj)"),
      description: t('toolsDashboard.guide.namesDesc', "Utilisez les outils 'Générateur de Wird' ou 'Noms Divins Personnels' pour découvrir les Noms d'Allah qui correspondent exactement à votre poids mystique."),
      icon: Sparkles,
      color: "text-amber-500",
      bg: "bg-amber-100 dark:bg-amber-900/30"
    },
    {
      title: t('toolsDashboard.guide.divineTitle', "Noms Divins et Coran"),
      description: t('toolsDashboard.guide.divineDesc', "Explorez les 99 Noms d'Allah et leurs secrets. Utilisez le Coran pour vos récitations (Tilawa) et trouvez les versets appropriés à vos intentions."),
      icon: Star,
      color: "text-indigo-500",
      bg: "bg-indigo-100 dark:bg-indigo-900/30"
    },
    {
      title: t('toolsDashboard.guide.ruqyahTitle', "Ruqyah et Soins"),
      description: t('toolsDashboard.guide.ruqyahDesc', "Découvrez des versets et invocations pour la protection, la guérison et le traitement contre les maux mystiques avec des récitations ciblées."),
      icon: Shield,
      color: "text-rose-500",
      bg: "bg-rose-100 dark:bg-rose-900/30"
    },
    {
      title: t('toolsDashboard.guide.zikrTitle', "Compteur de Zikr"),
      description: t('toolsDashboard.guide.zikrDesc', "Une fois votre recette ou secret établi, utilisez notre Tasbih intelligent pour compter vos invocations avec précision tout en vous concentrant."),
      icon: Target,
      color: "text-cyan-500",
      bg: "bg-cyan-100 dark:bg-cyan-900/30"
    }
  ];

  const displayedTools = tools.filter(tool => {
    if (tool.level !== activeTab) return false;
    const status = featureToggles[`tool_${tool.id}`] || 'active';
    return status !== 'inactive';
  });

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24">
      <BannerAd />
      <div className="mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Compass className="text-emerald-500" />
          {t('toolsDashboard.title')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          {t('toolsDashboard.description')}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-8 relative">
        <button
          onClick={() => setActiveTab('simple')}
          className={`relative flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'simple' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
        >
          {activeTab === 'simple' && (
            <motion.div
              layoutId="activeTabTools"
              className="absolute inset-0 bg-white dark:bg-gray-700 shadow-sm rounded-lg"
              initial={false}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              style={{ zIndex: 0 }}
            />
          )}
          <span className="relative z-10">{t('toolsDashboard.simpleTools', 'Outils Simples')}</span>
        </button>
        <button
          onClick={() => setActiveTab('advanced')}
          className={`relative flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'advanced' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
        >
          {activeTab === 'advanced' && (
            <motion.div
              layoutId="activeTabTools"
              className="absolute inset-0 bg-white dark:bg-gray-700 shadow-sm rounded-lg"
              initial={false}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              style={{ zIndex: 0 }}
            />
          )}
          <span className="relative z-10">{t('toolsDashboard.advancedTools', 'Outils Avancés')}</span>
        </button>
      </div>

      <AnimatePresence>
        {showGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col"
            >
              <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-700">
                <h3 className="font-bold text-gray-900 dark:text-white">Guide de Démarrage</h3>
                <button 
                  onClick={closeGuide}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 sm:p-8 flex-1 min-h-[250px] flex flex-col items-center justify-center text-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={guideStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col items-center"
                  >
                    <div className={`w-20 h-20 rounded-2xl ${guideSteps[guideStep].bg} ${guideSteps[guideStep].color} flex items-center justify-center mb-6 shadow-sm`}>
                      {React.createElement(guideSteps[guideStep].icon, { size: 40 })}
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {guideSteps[guideStep].title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {guideSteps[guideStep].description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <div className="flex gap-1.5">
                  {guideSteps.map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-2 h-2 rounded-full transition-all ${i === guideStep ? 'bg-emerald-500 w-4' : 'bg-gray-300 dark:bg-gray-600'}`}
                    />
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => setGuideStep(Math.max(0, guideStep - 1))}
                    disabled={guideStep === 0}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-30 transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  {guideStep < guideSteps.length - 1 ? (
                    <button 
                      onClick={() => setGuideStep(guideStep + 1)}
                      className="flex items-center gap-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                    >
                      Suivant
                      <ChevronRight size={16} />
                    </button>
                  ) : (
                    <button 
                      onClick={closeGuide}
                      className="flex items-center gap-1 bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                    >
                      Commencer
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <AnimatePresence mode="popLayout">
          {displayedTools.map((tool, index) => {
            const status = featureToggles[`tool_${tool.id}`] || 'active';
            const isMaintenance = status === 'maintenance';
            const isPremium = status === 'premium';

            const content = (
              <div className={`h-full rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 p-4 transition-all duration-300 relative overflow-hidden group ${(!tool.comingSoon && !isMaintenance) ? 'hover:shadow-md hover:-translate-y-1' : 'opacity-75'}`}>
                {/* Background Decoration */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${tool.color} rounded-bl-full opacity-10 transition-opacity ${(!tool.comingSoon && !isMaintenance) ? 'group-hover:opacity-20' : ''}`}></div>
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br ${tool.color} text-white flex items-center justify-center shadow-sm ${(!tool.comingSoon && !isMaintenance) ? 'group-hover:scale-110 transition-transform relative' : 'relative'}`}>
                      <tool.icon size={20} />
                      {isPremium && (
                        <div className="absolute -top-1 -right-1 bg-violet-500 text-white p-0.5 rounded-full shadow border border-white dark:border-gray-800">
                          <Sparkles size={10} />
                        </div>
                      )}
                    </div>
                    <h3 className="text-[15px] sm:text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 leading-tight">
                      {t(`tools.${tool.id}.title`) !== `tools.${tool.id}.title` ? t(`tools.${tool.id}.title`) : tool.title}
                      {tool.comingSoon && (
                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-[9px] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-widest shrink-0">
                          Bientôt
                        </span>
                      )}
                      {isMaintenance && !tool.comingSoon && (
                        <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 text-[9px] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-widest shrink-0">
                          Maintenance
                        </span>
                      )}
                      {isPremium && !tool.comingSoon && !isMaintenance && (
                        <span className="bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 text-[9px] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-widest shrink-0">
                          Premium
                        </span>
                      )}
                    </h3>
                  </div>
                  
                  <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors line-clamp-3">
                    {t(`tools.${tool.id}.description`) !== `tools.${tool.id}.description` ? t(`tools.${tool.id}.description`) : tool.description}
                  </p>
                </div>
              </div>
            );

            return (
              <motion.div
                layout
                key={tool.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                {(tool.comingSoon || isMaintenance) ? (
                  <div className="cursor-not-allowed">
                    {content}
                  </div>
                ) : (
                  <div 
                    onClick={() => {
                      if (isPremium && user?.subscriptionTier !== 'premium' && user?.subscriptionTier !== 'pro') {
                        setPremiumModalOpen({ isOpen: true, title: tool.title });
                      } else {
                        navigate(tool.path);
                      }
                    }} 
                    className="block h-full cursor-pointer"
                  >
                    {content}
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Premium Access Modal */}
      {premiumModalOpen.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-full flex items-center justify-center shadow-lg mb-6 shadow-violet-500/30">
              <Sparkles size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">{premiumModalOpen.title}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Cet outil est réservé aux membres Premium. Débloquez-le pour y accéder.
            </p>
            <div className="flex gap-4 w-full">
              <button 
                onClick={() => setPremiumModalOpen({ isOpen: false, title: '' })}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-white"
              >
                Annuler
              </button>
              <button 
                onClick={() => navigate('/store')}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold hover:from-amber-500 hover:to-orange-600 transition-colors shadow-md flex items-center justify-center gap-2"
              >
                Débloquer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
