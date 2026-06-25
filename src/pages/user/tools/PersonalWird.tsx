import React, { useState } from 'react';
import { User, Shield, Key, Search, ArrowLeft, RefreshCw, Sparkles, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { motion } from 'motion/react';
import { calculateAbjadValue } from '../../../utils/abjad';
import { ASMA_AL_HUSNA } from '../../../utils/asmaData';

interface MatchResult {
  names: string[];
  totalAbjad: number;
  diff: number;
}

export const PersonalWird: React.FC = () => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [result, setResult] = useState<MatchResult | null>(null);
  const [weight, setWeight] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateWird = () => {
    if (!name || !motherName) return;
    setIsCalculating(true);
    
    setTimeout(() => {
      const cleanName = name.replace(/\s+/g, '');
      const cleanMotherName = motherName.replace(/\s+/g, '');
      
      const val1 = calculateAbjadValue(cleanName);
      const val2 = calculateAbjadValue(cleanMotherName);
      const totalWeight = val1 + val2;
      setWeight(totalWeight);

      // Find combination of Names of Allah matching the weight
      const namesWithValues = ASMA_AL_HUSNA.map(n => ({ name: n, val: calculateAbjadValue(n) }));
      let bestMatch: MatchResult = { names: [], totalAbjad: 0, diff: Infinity };

      // 1. Try single name
      for (const n of namesWithValues) {
        const diff = Math.abs(n.val - totalWeight);
        if (diff < bestMatch.diff) {
          bestMatch = { names: [n.name], totalAbjad: n.val, diff };
        }
      }

      // 2. Try two names if diff is still > 0
      if (bestMatch.diff !== 0) {
        for (let i = 0; i < namesWithValues.length; i++) {
          for (let j = i + 1; j < namesWithValues.length; j++) {
            const sum = namesWithValues[i].val + namesWithValues[j].val;
            const diff = Math.abs(sum - totalWeight);
            if (diff < bestMatch.diff) {
              bestMatch = { names: [namesWithValues[i].name, namesWithValues[j].name], totalAbjad: sum, diff };
            }
          }
        }
      }
      
      // 3. Try three names if diff is still > 0
      if (bestMatch.diff !== 0) {
        for (let i = 0; i < namesWithValues.length; i++) {
          for (let j = i + 1; j < namesWithValues.length; j++) {
            for (let k = j + 1; k < namesWithValues.length; k++) {
              const sum = namesWithValues[i].val + namesWithValues[j].val + namesWithValues[k].val;
              const diff = Math.abs(sum - totalWeight);
              if (diff < bestMatch.diff) {
                bestMatch = { names: [namesWithValues[i].name, namesWithValues[j].name, namesWithValues[k].name], totalAbjad: sum, diff };
              }
            }
          }
        }
      }

      setResult(bestMatch);
      setIsCalculating(false);
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24">
      <div className="mb-8">
        <Link to="/tools" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-4 font-medium transition-colors">
          <ArrowLeft size={20} className="mr-2" />
          {t("common.back")} au tableau de bord
        </Link>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Sparkles className="text-emerald-500" size={32} />
          Générateur de Wird Personnalisé (Istikhraj)
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">{t("tools.personal-wird.description")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <User size={20} className="text-emerald-500" />
              Vos Informations
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Votre Prénom (en arabe)</label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: محمد"
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-right font-arabic text-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                    dir="rtl"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prénom de la Mère (en arabe)</label>
                <div className="relative">
                  <input
                    type="text"
                    value={motherName}
                    onChange={(e) => setMotherName(e.target.value)}
                    placeholder="Ex: فاطمة"
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-right font-arabic text-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                    dir="rtl"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">La tradition mystique utilise le nom de la mère pour l'ancrage spirituel (Tariqa).</p>
              </div>

              <button
                onClick={calculateWird}
                disabled={!name || !motherName || isCalculating}
                className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {isCalculating ? (
                  <>
                    <RefreshCw className="animate-spin" size={20} />
                    Extraction en cours...
                  </>
                ) : (
                  <>
                    <Key size={20} />
                    {t("common.calculate")} mon Wird
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div>
          {result && weight !== null ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-8 shadow-lg text-white"
            >
              <div className="text-center mb-8">
                <p className="text-emerald-100 mb-2 font-medium">Votre Poids Mystique (Abjad)</p>
                <div className="text-6xl font-bold font-serif mb-2">{weight}</div>
                <p className="text-emerald-100 text-sm">Ceci représente la fréquence de votre existence.</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-center">
                <p className="text-emerald-100 mb-4 font-medium flex items-center justify-center gap-2">
                  <Sparkles size={18} />
                  Votre Wird Suprême
                </p>
                <div className="text-4xl sm:text-5xl font-arabic font-bold mb-4 leading-tight" dir="rtl">
                  يا {result.names.join(' يا ')}
                </div>
                <p className="text-lg font-medium mb-1">Ya {result.names.join(', Ya ')}</p>
                
                <div className="mt-6 pt-6 border-t border-white/20 text-sm text-emerald-50">
                  <p>La valeur de ce Zikr est de <strong>{result.totalAbjad}</strong>.</p>
                  {result.diff === 0 ? (
                    <p className="mt-2 text-yellow-300 font-medium">Correspondance parfaite avec votre empreinte spirituelle.</p>
                  ) : (
                    <p className="mt-2">Écart mineur: {result.diff}</p>
                  )}
                </div>
              </div>
              
              <div className="mt-6 bg-emerald-800/50 rounded-xl p-4 text-sm text-emerald-100 flex items-start gap-3">
                <BookOpen size={20} className="shrink-0 mt-0.5 text-emerald-300" />
                <p>Réciter ce Wird <strong>{weight} fois</strong> chaque jour (de préférence après la prière du matin ou de la nuit) activera des ouvertures (Fath) et un alignement spirituel profond.</p>
              </div>
            </motion.div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 border-dashed rounded-2xl h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                <Sparkles size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">En attente de calcul</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                Saisissez votre prénom et celui de votre mère en arabe pour découvrir votre Wird de résonance.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
