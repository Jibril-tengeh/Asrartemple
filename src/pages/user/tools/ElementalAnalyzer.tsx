import React, { useState } from 'react';
import { Flame, Droplets, Wind, Mountain, ArrowLeft, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { motion } from 'motion/react';

const ELEMENTS = {
  FIRE: {
    name: 'Feu (Nari)',
    icon: Flame,
    color: 'text-red-500',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    borderColor: 'border-red-200 dark:border-red-800',
    letters: ['ا', 'ه', 'ط', 'م', 'ف', 'ش', 'ذ'],
    nature: 'Chaud et Sec',
    advice: "Écrire le vœu ou le nom sur un support et le placer près d'une source de chaleur (feu, four, endroit chaud), ou l'exposer au soleil. Parfait pour la domination, l'amour passionnel ou la destruction d'obstacles."
  },
  EARTH: {
    name: 'Terre (Turabi)',
    icon: Mountain,
    color: 'text-amber-700 dark:text-amber-500',
    bgColor: 'bg-amber-50 dark:bg-amber-900/20',
    borderColor: 'border-amber-200 dark:border-amber-800',
    letters: ['ب', 'و', 'ي', 'ن', 'ص', 'ت', 'ض'],
    nature: 'Froid et Sec',
    advice: "Écrire et enterrer dans le sol, sous une pierre lourde, ou garder précieusement dans sa poche/portefeuille. Idéal pour la stabilité, la richesse, la fondation de projets et la dissimulation."
  },
  AIR: {
    name: 'Air (Hawa\'i)',
    icon: Wind,
    color: 'text-gray-500 dark:text-gray-300',
    bgColor: 'bg-gray-100 dark:bg-gray-800',
    borderColor: 'border-gray-200 dark:border-gray-700',
    letters: ['ج', 'ز', 'ك', 'س', 'ق', 'ث', 'ظ'],
    nature: 'Chaud et Humide',
    advice: "Écrire et l'accrocher à un arbre, à un endroit exposé au vent, ou sur le toit d'une maison. Efficace pour les appels rapides, faire venir quelqu'un, la renommée et les voyages."
  },
  WATER: {
    name: 'Eau (Ma\'i)',
    icon: Droplets,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
    letters: ['د', 'ح', 'ل', 'ع', 'ر', 'خ', 'غ'],
    nature: 'Froid et Humide',
    advice: "Écrire avec de l'encre effaçable (safran/eau de rose), laver (faire le Nassi) et le boire, s'en frotter le corps, ou le jeter dans une rivière/mer. Excellente nature pour la guérison, la purification, et l'apaisement."
  }
};

export const ElementalAnalyzer: React.FC = () => {
  const { t } = useLanguage();
  const [input, setInput] = useState('');
  
  const analyze = () => {
    const text = input.replace(/\s/g, '');
    let counts = { FIRE: 0, EARTH: 0, AIR: 0, WATER: 0 };
    let details: { char: string, element: string }[] = [];

    for (const char of text) {
      if (ELEMENTS.FIRE.letters.includes(char)) { counts.FIRE++; details.push({ char, element: 'FIRE' }); }
      else if (ELEMENTS.EARTH.letters.includes(char)) { counts.EARTH++; details.push({ char, element: 'EARTH' }); }
      else if (ELEMENTS.AIR.letters.includes(char)) { counts.AIR++; details.push({ char, element: 'AIR' }); }
      else if (ELEMENTS.WATER.letters.includes(char)) { counts.WATER++; details.push({ char, element: 'WATER' }); }
    }

    const maxCount = Math.max(counts.FIRE, counts.EARTH, counts.AIR, counts.WATER);
    const dominants = Object.entries(counts).filter(([_, count]) => count === maxCount && count > 0).map(([key]) => key);

    return { counts, details, dominants };
  };

  const result = input.length > 0 ? analyze() : null;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24">
      <div className="mb-8">
        <Link to="/tools" className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium mb-4">
          <ArrowLeft className="mr-2" size={20} />
          {t("common.backToTools")}
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Flame className="text-red-500" />
          Analyseur Élémentaire (Tabai' al-Huruf)
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">{t("tools.elemental.description")}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm mb-8">
        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Entrez un nom ou une phrase en arabe</label>
        <input
          type="text"
          dir="rtl"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="ex: محمد, الرزاق..."
          className="w-full text-2xl font-arabic p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {result && result.dominants.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Nature Dominante</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.dominants.map(dom => {
              const el = ELEMENTS[dom as keyof typeof ELEMENTS];
              const Icon = el.icon;
              return (
                <div key={dom} className={`p-6 rounded-2xl border ${el.borderColor} ${el.bgColor}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 rounded-full bg-white dark:bg-gray-900 shadow-sm ${el.color}`}>
                      <Icon size={24} />
                    </div>
                    <div>
                      <h3 className={`text-lg font-bold ${el.color}`}>{el.name}</h3>
                      <p className="text-sm font-medium opacity-80">{el.nature}</p>
                    </div>
                  </div>
                  <div className="bg-white/60 dark:bg-gray-900/40 p-4 rounded-xl border border-white/20 dark:border-gray-700/50">
                    <h4 className="text-xs font-bold uppercase tracking-wider mb-2 opacity-70">Recommandation d'usage</h4>
                    <p className="text-sm font-medium leading-relaxed">{el.advice}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
             <h3 className="font-bold text-gray-900 dark:text-white mb-4">Détail des Lettres</h3>
             <div className="flex flex-wrap gap-2" dir="rtl">
               {result.details.map((item, i) => {
                 const el = ELEMENTS[item.element as keyof typeof ELEMENTS];
                 const Icon = el.icon;
                 return (
                   <div key={i} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border ${el.borderColor} ${el.bgColor}`}>
                     <span className="font-arabic font-bold text-lg">{item.char}</span>
                     <Icon size={14} className={el.color} />
                   </div>
                 );
               })}
             </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
