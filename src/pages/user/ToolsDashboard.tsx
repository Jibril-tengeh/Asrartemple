import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Clock, Activity, Compass, BookOpen, Star } from 'lucide-react';
import { motion } from 'motion/react';

const tools = [
  {
    id: 'abjad',
    title: 'Abjad',
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
    comingSoon: true
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
              
              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} text-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform`}>
                  <tool.icon size={24} />
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  {tool.title}
                  {tool.comingSoon && (
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                      Bientôt
                    </span>
                  )}
                </h3>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
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
