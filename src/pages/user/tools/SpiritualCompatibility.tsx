import React, { useState } from 'react';
import { Scale, Users, Heart, ArrowLeft, RefreshCw, Flame, Droplets, Wind, Mountain, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { motion } from 'motion/react';
import { calculateAbjadValue } from '../../../utils/abjad';

const LETTER_ELEMENTS: Record<string, string> = {
  'ا': 'Feu', 'ه': 'Feu', 'ط': 'Feu', 'م': 'Feu', 'ف': 'Feu', 'ش': 'Feu', 'ذ': 'Feu',
  'ب': 'Terre', 'و': 'Terre', 'ي': 'Terre', 'ن': 'Terre', 'ص': 'Terre', 'ت': 'Terre', 'ض': 'Terre',
  'ج': 'Air', 'ز': 'Air', 'ك': 'Air', 'س': 'Air', 'ق': 'Air', 'ث': 'Air', 'ظ': 'Air',
  'د': 'Eau', 'ح': 'Eau', 'ل': 'Eau', 'ع': 'Eau', 'ر': 'Eau', 'خ': 'Eau', 'غ': 'Eau',
};

const BUNI_RESULTS: Record<number, { title: string, desc: string, type: 'good' | 'bad' | 'neutral' }> = {
  1: { title: "Amour et Bonheur", desc: "Union très favorable. Harmonie profonde, affection mutuelle et joie durable.", type: "good" },
  2: { title: "Dispute et Séparation", desc: "Relation tumultueuse. Risques élevés de conflits, d'incompréhension et de rupture.", type: "bad" },
  3: { title: "Richesse et Prospérité", desc: "Excellente alliance pour les affaires et le mariage. Apporte abondance et succès matériel.", type: "good" },
  4: { title: "Accord Spirituel, Difficultés Matérielles", desc: "Bonne entente émotionnelle mais l'union pourrait traverser des épreuves financières.", type: "neutral" },
  5: { title: "Stabilité et Descendance", desc: "Union solide et bénie, particulièrement favorable pour fonder une famille et avoir une descendance pieuse.", type: "good" },
  6: { title: "Jalousie et Mensonges", desc: "Relation toxique. Risques de trahison, d'envie et d'interférences extérieures malveillantes.", type: "bad" },
  7: { title: "Respect et Élévation", desc: "Les deux partenaires se tirent vers le haut. Succès social et respect mutuel garanti.", type: "good" },
  8: { title: "Domination et Déséquilibre", desc: "L'un des partenaires exercera une domination oppressante sur l'autre. Relation inégale.", type: "bad" },
  9: { title: "Sagesse et Bénédiction", desc: "La perfection de l'union spirituelle. Paix absolue et protection divine sur le couple.", type: "good" },
};

export const SpiritualCompatibility: React.FC = () => {
  const { t } = useLanguage();
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [result, setResult] = useState<{
    abjad1: number; abjad2: number; total: number; remainder: number;
    elem1: string; elem2: string; elemCompatibility: string;
  } | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const getElement = (name: string) => {
    const cleanName = name.replace(/\s+/g, '');
    if (!cleanName) return 'Feu';
    return LETTER_ELEMENTS[cleanName[0]] || 'Feu';
  };

  const getElementCompatibility = (e1: string, e2: string) => {
    if (e1 === e2) return "Harmonie naturelle (Même nature)";
    if ((e1 === 'Feu' && e2 === 'Air') || (e1 === 'Air' && e2 === 'Feu')) return "Excellente synergie (L'Air attise le Feu)";
    if ((e1 === 'Eau' && e2 === 'Terre') || (e1 === 'Terre' && e2 === 'Eau')) return "Union fertile (L'Eau nourrit la Terre)";
    if ((e1 === 'Feu' && e2 === 'Eau') || (e1 === 'Eau' && e2 === 'Feu')) return "Opposition destructrice (L'Eau éteint le Feu)";
    if ((e1 === 'Air' && e2 === 'Terre') || (e1 === 'Terre' && e2 === 'Air')) return "Incompatibilité (L'Air assèche la Terre)";
    return "Relation neutre ou mixte";
  };

  const calculateCompatibility = () => {
    if (!name1 || !name2) return;
    setIsCalculating(true);
    
    setTimeout(() => {
      const a1 = calculateAbjadValue(name1.replace(/\s+/g, ''));
      const a2 = calculateAbjadValue(name2.replace(/\s+/g, ''));
      const total = a1 + a2;
      let remainder = total % 9;
      if (remainder === 0) remainder = 9;

      const elem1 = getElement(name1);
      const elem2 = getElement(name2);
      
      setResult({
        abjad1: a1,
        abjad2: a2,
        total,
        remainder,
        elem1,
        elem2,
        elemCompatibility: getElementCompatibility(elem1, elem2)
      });
      setIsCalculating(false);
    }, 1000);
  };

  const ElementIcon = ({ element }: { element: string }) => {
    switch(element) {
      case 'Feu': return <Flame className="text-red-500" />;
      case 'Eau': return <Droplets className="text-blue-500" />;
      case 'Terre': return <Mountain className="text-amber-600" />;
      case 'Air': return <Wind className="text-gray-400" />;
      default: return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24">
      <div className="mb-8">
        <Link to="/tools" className="inline-flex items-center text-rose-600 hover:text-rose-700 mb-4 font-medium transition-colors">
          <ArrowLeft size={20} className="mr-2" />
          {t("common.back")} au tableau de bord
        </Link>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Scale className="text-rose-500" size={32} />
          Compatibilité Spirituelle (Tawafuq)
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">{t("tools.spiritual-compatibility.description")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Users size={20} className="text-rose-500" />
              Noms des Partenaires
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Personne 1 (en arabe)</label>
                <input
                  type="text"
                  value={name1}
                  onChange={(e) => setName1(e.target.value)}
                  placeholder="Ex: احمد"
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-right font-arabic text-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
                  dir="rtl"
                />
              </div>
              
              <div className="flex justify-center my-2 text-rose-300">
                <Heart size={24} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Personne 2 (en arabe)</label>
                <input
                  type="text"
                  value={name2}
                  onChange={(e) => setName2(e.target.value)}
                  placeholder="Ex: خديجة"
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-right font-arabic text-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
                  dir="rtl"
                />
              </div>

              <button
                onClick={calculateCompatibility}
                disabled={!name1 || !name2 || isCalculating}
                className="w-full mt-6 bg-rose-600 hover:bg-rose-700 text-white font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {isCalculating ? (
                  <>
                    <RefreshCw className="animate-spin" size={20} />
                    Analyse en cours...
                  </>
                ) : (
                  <>
                    <Scale size={20} />
                    {t("common.calculate")} le Tawafuq
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          {result ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* {t("common.result")} Principal */}
              <div className={`rounded-2xl p-6 shadow-md border ${
                BUNI_RESULTS[result.remainder].type === 'good' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' :
                BUNI_RESULTS[result.remainder].type === 'bad' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' :
                'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
              }`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-sm font-bold uppercase tracking-wider opacity-70 mb-1 block">Verdict de l'Imam Al-Buni</span>
                    <h2 className={`text-2xl font-bold ${
                      BUNI_RESULTS[result.remainder].type === 'good' ? 'text-emerald-700 dark:text-emerald-400' :
                      BUNI_RESULTS[result.remainder].type === 'bad' ? 'text-red-700 dark:text-red-400' :
                      'text-blue-700 dark:text-blue-400'
                    }`}>{BUNI_RESULTS[result.remainder].title}</h2>
                  </div>
                  <div className={`text-4xl font-serif font-bold opacity-30 ${
                      BUNI_RESULTS[result.remainder].type === 'good' ? 'text-emerald-700 dark:text-emerald-400' :
                      BUNI_RESULTS[result.remainder].type === 'bad' ? 'text-red-700 dark:text-red-400' :
                      'text-blue-700 dark:text-blue-400'
                    }`}>
                    {result.remainder}
                  </div>
                </div>
                <p className={`text-lg font-medium leading-relaxed ${
                  BUNI_RESULTS[result.remainder].type === 'good' ? 'text-emerald-800 dark:text-emerald-200' :
                  BUNI_RESULTS[result.remainder].type === 'bad' ? 'text-red-800 dark:text-red-200' :
                  'text-blue-800 dark:text-blue-200'
                }`}>
                  {BUNI_RESULTS[result.remainder].desc}
                </p>
              </div>

              {/* Analyse Détaillée */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">Mathématique Mystique</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Valeur Abjad 1</span>
                      <span className="font-mono font-bold text-gray-900 dark:text-white">{result.abjad1}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Valeur Abjad 2</span>
                      <span className="font-mono font-bold text-gray-900 dark:text-white">{result.abjad2}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700">
                      <span>Total</span>
                      <span className="font-mono font-bold text-rose-600">{result.total}</span>
                    </div>
                    <div className="flex justify-between font-bold text-gray-900 dark:text-white">
                      <span>Reste (Division par 9)</span>
                      <span className="font-mono">{result.remainder}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">Analyse Élémentaire</h3>
                  <div className="flex items-center justify-center gap-6 mb-4 mt-2">
                    <div className="text-center">
                      <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-xl inline-block mb-2">
                        <ElementIcon element={result.elem1} />
                      </div>
                      <p className="font-bold text-gray-900 dark:text-white">{result.elem1}</p>
                    </div>
                    <span className="text-gray-300 dark:text-gray-600 font-bold text-xl">VS</span>
                    <div className="text-center">
                      <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-xl inline-block mb-2">
                        <ElementIcon element={result.elem2} />
                      </div>
                      <p className="font-bold text-gray-900 dark:text-white">{result.elem2}</p>
                    </div>
                  </div>
                  <div className="text-center text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 py-2 rounded-lg">
                    {result.elemCompatibility}
                  </div>
                </div>
              </div>

            </motion.div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 border-dashed rounded-2xl h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 text-rose-500 rounded-full flex items-center justify-center mb-4">
                <Scale size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">En attente de noms</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                Saisissez les deux prénoms en arabe pour découvrir leur degré de compatibilité spirituelle.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
