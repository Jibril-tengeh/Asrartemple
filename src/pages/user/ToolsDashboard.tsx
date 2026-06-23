import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Clock, Activity, Compass, BookOpen, Star, Sparkles, Users, Key, Shield, Eye, Hexagon, Coins, Scale, Moon, ListTodo, Layers, Shuffle } from 'lucide-react';
import { motion } from 'motion/react';

const tools = [
  {
    id: 'zakat',
    title: 'Calculateur de Zakat',
    description: 'Calculez précisément votre Zakat al-Maal sur diverses richesses.',
    icon: Coins,
    color: 'from-yellow-500 to-amber-600',
    path: '/tools/zakat'
  },
  {
    id: 'faraid',
    title: 'Calculateur de Faraid',
    description: 'Calculez les parts d\'héritage selon la jurisprudence islamique.',
    icon: Scale,
    color: 'from-amber-600 to-red-600',
    path: '/tools/faraid'
  },
  {
    id: 'dreams',
    title: 'Journal des Rêves',
    description: 'Analysez et documentez vos rêves avec interprétations.',
    icon: Moon,
    color: 'from-blue-700 to-indigo-900',
    path: '/tools/dreams'
  },
  {
    id: '99names',
    title: 'Les 99 Noms d\'Allah',
    description: 'Recherchez, étudiez et comprenez les Noms Sublimes (Asma al-Husna).',
    icon: ListTodo,
    color: 'from-cyan-500 to-blue-600',
    path: '/tools/99names'
  },
  {
    id: 'rouhaniyya',
    title: 'Extracteur Rouhaniyya',
    description: 'Extraction des esprits célestes ou terrestres basés sur les Noms et le Poids.',
    icon: Layers,
    color: 'from-fuchsia-600 to-purple-800',
    path: '/tools/rouhaniyya'
  },
  {
    id: 'taksir',
    title: 'Taksir (Brisures)',
    description: 'Générez des matrices de Taksir et des cassures de lettres.',
    icon: Shuffle,
    color: 'from-orange-500 to-rose-600',
    path: '/tools/taksir'
  },
  {
    id: 'sirr',
    title: 'Sirr Al-Asrar',
    description: 'Analyse ésotérique absolue : éléments, auras, et khuddam.',
    icon: Eye,
    color: 'from-violet-700 to-purple-900',
    path: '/tools/sirr'
  },
  {
    id: 'zairja',
    title: 'Oracle Zairja',
    description: 'La machine ancestrale des soufis pour prédire et éclaircir les questions mystiques.',
    icon: Hexagon,
    color: 'from-zinc-700 to-black',
    path: '/tools/zairja'
  },
  {
    id: 'abjad',
    title: 'Calculateur Abjad',
    description: 'Calculez la valeur numérique mystique de vos noms et wirds.',
    icon: Calculator,
    color: 'from-blue-500 to-indigo-600',
    path: '/tools/abjad'
  },
  {
    id: 'planetary',
    title: 'Heures Planétaires',
    description: 'Déterminez les heures spirituelles propices pour vos invocations.',
    icon: Clock,
    color: 'from-amber-500 to-orange-600',
    path: '/tools/planetary'
  },
  {
    id: 'tasbih',
    title: 'Tasbih Virtuel',
    description: 'Un compteur de zikr intelligent pour suivre vos récitations quotidiennes.',
    icon: Activity,
    color: 'from-emerald-500 to-teal-600',
    path: '/tools/tasbih'
  },
  {
    id: 'khatim',
    title: 'Générateur de Khatim',
    description: 'Créez des carrés magiques (Wafq) 3x3 basés sur des valeurs numériques.',
    icon: Star,
    color: 'from-purple-500 to-pink-600',
    path: '/tools/khatim',
    comingSoon: false
  },
  {
    id: 'ruqyah',
    title: 'Ruqyah Shari\'ah',
    description: 'Séances de traitement spirituel intensif avec répétitions ciblées (7 à 1000).',
    icon: Shield,
    color: 'from-blue-600 to-indigo-700',
    path: '/tools/ruqyah'
  },
  {
    id: 'compatibility',
    title: 'Compatibilité Spirituelle',
    description: 'Évaluez la compatibilité selon la science des lettres (Ilm al-Huruf) pour les unions.',
    icon: Users,
    color: 'from-rose-500 to-pink-600',
    path: '/tools/compatibility'
  },
  {
    id: 'asma',
    title: 'Noms Divins Personnels',
    description: 'Découvrez vos noms divins correspondants au poids mystique de votre nom.',
    icon: Sparkles,
    color: 'from-indigo-500 to-cyan-600',
    path: '/tools/asma'
  },
  {
    id: 'talsam',
    title: 'Générateur de Talsam',
    description: 'Créez des mots de pouvoir et talsams chiffrés pour encapsuler vos invocations.',
    icon: Key,
    color: 'from-slate-600 to-gray-900',
    path: '/tools/talsam'
  },
  {
    id: 'istikhara',
    title: 'Istikhara Numérique',
    description: "Tirage du sort spirituel basé sur le Saint Coran et la science d'Abjad.",
    icon: Compass,
    color: 'from-teal-500 to-emerald-600',
    path: '/tools/istikhara'
  },
  {
    id: 'quran',
    title: 'Le Saint Coran',
    description: "Lecture et méditation sur le Coran, l'outil fondamental de tout Asrar.",
    icon: BookOpen,
    color: 'from-emerald-600 to-teal-800',
    path: '/tools/quran'
  }
];

export const ToolsDashboard: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24">
      <div className="mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Compass className="text-emerald-500" />
          Outils Mystiques
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Des outils puissants et professionnels réservés aux initiés de la science des secrets.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {tools.map((tool, index) => {
          const content = (
            <div className={`h-full rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 p-4 transition-all duration-300 relative overflow-hidden group ${!tool.comingSoon ? 'hover:shadow-md hover:-translate-y-1' : 'opacity-75'}`}>
              {/* Background Decoration */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${tool.color} rounded-bl-full opacity-10 transition-opacity group-hover:opacity-20`}></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br ${tool.color} text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                    <tool.icon size={20} />
                  </div>
                  <h3 className="text-[15px] sm:text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 leading-tight">
                    {tool.title}
                    {tool.comingSoon && (
                      <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-[9px] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-widest shrink-0">
                        Bientôt
                      </span>
                    )}
                  </h3>
                </div>
                
                <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors line-clamp-3">
                  {tool.description}
                </p>
              </div>
            </div>
          );

          return (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {tool.comingSoon ? (
                <div className="cursor-not-allowed">
                  {content}
                </div>
              ) : (
                <Link to={tool.path} className="block h-full">
                  {content}
                </Link>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
