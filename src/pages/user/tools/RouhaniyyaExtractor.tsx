import React, { useState } from 'react';
import { Layers, ArrowLeft, Info, Wand2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';

export const RouhaniyyaExtractor: React.FC = () => {
  const { t } = useLanguage();
  const [number, setNumber] = useState('');
  const [result, setResult] = useState<{ celestial: string, terrestrial: string, letters: string } | null>(null);

  // Simplified Arabic letter mapping by decimal position
  // Units: 1=A, 2=B, 3=J, 4=D...
  // Tens: 10=Y, 20=K, 30=L, 40=M...
  // Hundreds: 100=Q, 200=R, 300=Sh, 400=T...
  // Thousands: 1000=Gh
  const extractLetters = (num: number) => {
    const lettersMap: Record<number, string> = {
      1: 'ا', 2: 'ب', 3: 'ج', 4: 'د', 5: 'ه', 6: 'و', 7: 'ز', 8: 'ح', 9: 'ط',
      10: 'ي', 20: 'ك', 30: 'ل', 40: 'م', 50: 'ن', 60: 'س', 70: 'ع', 80: 'ف', 90: 'ص',
      100: 'ق', 200: 'ر', 300: 'ش', 400: 'ت', 500: 'ث', 600: 'خ', 700: 'ذ', 800: 'ض', 900: 'ظ',
      1000: 'غ'
    };

    let remaining = num;
    const parts = [];
    
    // Decompose into powers of 10
    let multiplier = 1;
    while (remaining > 0) {
      const digit = remaining % 10;
      if (digit > 0) {
        parts.push(digit * multiplier);
      }
      remaining = Math.floor(remaining / 10);
      multiplier *= 10;
    }

    // Usually, extracted letters are placed in order of Units, Tens, Hundreds, Thousands.
    // e.g. 313 -> 3, 10, 300 -> J, Y, Sh
    const extractedLetters = parts.map(p => lettersMap[p] || '').filter(l => l !== '');
    return extractedLetters.join('');
  };

  const generate = () => {
    const n = parseInt(number, 10);
    if (isNaN(n) || n <= 0 || n > 1999) return;

    // Gamification
    let stats; try { stats = JSON.parse(localStorage.getItem('asrar_stats') || '{}'); if (!stats || typeof stats !== 'object') stats = {}; } catch(e) { stats = {}; }
    stats.tools_used = (stats.tools_used || 0) + 1;
    localStorage.setItem('asrar_stats', JSON.stringify(stats));

    const coreLetters = extractLetters(n);
    
    // Suffixes:
    // Celestial (Malaikah): ـائيل (A'il)
    // Terrestrial (Rouhan): ـطيش ou ـيوش (Tish / Yush)
    const celestial = coreLetters + 'ائيل';
    const terrestrial = coreLetters + 'طيش';

    setResult({
      letters: coreLetters,
      celestial,
      terrestrial
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24 min-h-screen">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/tools" className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
           <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Layers className="text-fuchsia-500" />
            Extracteur Rouhaniyya
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t("tools.rouhaniyya.description")}</p>
        </div>
      </div>

      <div className="bg-fuchsia-50 dark:bg-fuchsia-900/10 border border-fuchsia-100 dark:border-fuchsia-800/30 rounded-2xl p-5 mb-8 flex items-start gap-4">
        <Info className="text-fuchsia-500 shrink-0 mt-0.5" size={24} />
        <p className="text-sm text-fuchsia-800 dark:text-fuchsia-200 font-medium">
          Dans la science ésotérique (Ilm al-Ruhaniyat), chaque nombre (Issu d'un Nom ou Verset) possède un serviteur spirituel (Khadim). Leur nom est extrait par la conversion du nombre en lettres ('Istintaq'), suivi de l'ajout des suffixes Angéliques ("A'il") et Terrestres ("Tish").
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-6 border border-gray-100 dark:border-gray-700 shadow-sm mb-6">
        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">Valeur Numérique (Zimām)</label>
        <div className="flex gap-4">
           <input 
             type="number" 
             value={number} 
             onChange={e => setNumber(e.target.value)} 
             placeholder="Ex: 313" 
             className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-xl font-bold font-mono text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
           />
           <button 
             onClick={generate}
             disabled={!number}
             className="h-16 px-8 rounded-2xl bg-gradient-to-br from-fuchsia-600 to-purple-800 text-white font-bold transition-transform hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
           >
             <Wand2 size={20} /> Extraire
           </button>
        </div>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-100 dark:border-blue-800/30 rounded-3xl p-6 sm:p-8 shadow-sm">
               <h3 className="text-xs uppercase tracking-widest font-bold text-blue-500 mb-2">Entité Angélique (Malaikah)</h3>
               <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 font-medium">Gouverne de manière éthérique. Terminaison en "A'il" signifiant "Dieu".</p>
               <div className="text-center">
                 <p className="font-arabic text-5xl text-blue-700 dark:text-blue-400 font-bold mb-4" dir="rtl">{result.celestial}</p>
                 <div className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/50 rounded-xl text-blue-800 dark:text-blue-300 font-mono text-sm font-bold tracking-widest">
                   {result.letters} + ائيل
                 </div>
               </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-100 dark:border-red-800/30 rounded-3xl p-6 sm:p-8 shadow-sm">
               <h3 className="text-xs uppercase tracking-widest font-bold text-orange-500 mb-2">Entité Terrestre (Ardi)</h3>
               <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 font-medium">Gouverne l'action matérielle. Terminaison fréquente en "Tish" ou "Yush".</p>
               <div className="text-center">
                 <p className="font-arabic text-5xl text-orange-700 dark:text-orange-400 font-bold mb-4" dir="rtl">{result.terrestrial}</p>
                 <div className="inline-block px-4 py-2 bg-orange-100 dark:bg-orange-900/50 rounded-xl text-orange-800 dark:text-orange-300 font-mono text-sm font-bold tracking-widest">
                   {result.letters} + طيش
                 </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
