import React, { useState } from 'react';
import { Star, ArrowLeft, RefreshCw, Calculator, Grid, Type } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { calculateAbjadValue } from '../../../utils/abjad';

export const KhatimGenerator: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [gridSize, setGridSize] = useState<'3x3' | '4x4'>('3x3');
  const [grid, setGrid] = useState<number[][] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [calculatedTotal, setCalculatedTotal] = useState<number>(0);

  const generate3x3 = (total: number) => {
    let base = total - 12;
    if (base < 0) throw new Error("Le poids est trop petit pour un 3x3 standard (min 15).");
    let step = Math.floor(base / 3);
    let rem = base % 3;

    const getVal = (pos: number) => {
      let v = step + (pos - 1);
      if (rem === 1 && pos >= 7) v += 1;
      if (rem === 2 && pos >= 4) v += 1;
      return v;
    };

    return [
      [getVal(8), getVal(1), getVal(6)],
      [getVal(3), getVal(5), getVal(7)],
      [getVal(4), getVal(9), getVal(2)]
    ];
  };

  const generate4x4 = (total: number) => {
    let base = total - 30;
    if (base < 0) throw new Error("Le poids est trop petit pour un 4x4 standard (min 34).");
    let step = Math.floor(base / 4);
    let rem = base % 4;

    const getVal = (pos: number) => {
      let v = step + (pos - 1);
      if (rem === 1 && pos >= 13) v += 1;
      if (rem === 2 && pos >= 9) v += 1;
      if (rem === 3 && pos >= 5) v += 1;
      return v;
    };

    return [
      [getVal(8), getVal(11), getVal(14), getVal(1)],
      [getVal(13), getVal(2), getVal(7), getVal(12)],
      [getVal(3), getVal(16), getVal(9), getVal(6)],
      [getVal(10), getVal(5), getVal(4), getVal(15)]
    ];
  };

  const generateKhatim = () => {
    setError(null);
    try {
      let n = 0;
      // If it's a pure number, use it. Otherwise, calculate abjad.
      if (/^\d+$/.test(inputText.trim())) {
        n = parseInt(inputText, 10);
      } else {
        n = calculateAbjadValue(inputText);
      }

      if (n === 0) throw new Error("Veuillez entrer un nombre ou un texte en arabe.");

      setCalculatedTotal(n);
      
      let stats; try { stats = JSON.parse(localStorage.getItem('asrar_stats') || '{}'); if (!stats || typeof stats !== 'object') stats = {}; } catch(e) { stats = {}; }
      stats.tools_used = (stats.tools_used || 0) + 1;
      localStorage.setItem('asrar_stats', JSON.stringify(stats));

      let newGrid;
      if (gridSize === '3x3') {
        newGrid = generate3x3(n);
      } else {
        newGrid = generate4x4(n);
      }
      setGrid(newGrid);

    } catch (err: any) {
      setError(err.message);
      setGrid(null);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.5, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", bounce: 0.5 } }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24 border-none min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link 
          to="/tools" 
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Star className="text-purple-500" />
            Générateur de Khatim Dynamique
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Créez des carrés magiques parfaits (Awfaq)</p>
        </div>
      </div>

      <div className="bg-purple-900/10 border border-purple-800/30 rounded-3xl p-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>
        <p className="text-sm text-purple-800 dark:text-purple-200 font-medium leading-relaxed relative z-10">
          Entrez un texte en arabe (pour calculer son Poids Mystique) ou directement une valeur numérique. Choisissez le type de sceau pour le générer.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-700 mb-8 relative z-20">
        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <Type size={16} /> Texte (Arabe) ou Nombre
          </label>
          <input
            type="text"
            dir="auto"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ex: جلب رزق ou 66"
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-lg font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-arabic"
          />
        </div>

        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setGridSize('3x3')}
            className={`flex-1 py-3 px-4 rounded-xl font-bold border transition-colors ${gridSize === '3x3' ? 'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-900/30 dark:border-purple-800 dark:text-purple-400' : 'bg-white border-gray-200 text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'}`}
          >
            Muthallath (3x3)
          </button>
          <button 
            onClick={() => setGridSize('4x4')}
            className={`flex-1 py-3 px-4 rounded-xl font-bold border transition-colors ${gridSize === '4x4' ? 'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-900/30 dark:border-purple-800 dark:text-purple-400' : 'bg-white border-gray-200 text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'}`}
          >
            Murabba' (4x4)
          </button>
        </div>

        <button
          onClick={generateKhatim}
          className="w-full h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-800 text-white font-bold transition-transform hover:scale-102 active:scale-98 shadow-lg flex items-center justify-center gap-2 tracking-wide"
        >
          <Grid size={20} /> GÉNÉRER LE KHATIM
        </button>
        
        <AnimatePresence>
          {error && (
            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-red-500 text-sm mt-4 font-bold bg-red-50/50 dark:bg-red-900/20 p-3 rounded-xl border border-red-100 dark:border-red-900/50">
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {grid && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative"
          >
            <div className="bg-zinc-900 rounded-3xl p-8 sm:p-10 shadow-2xl border-4 border-zinc-800 mx-auto max-w-md relative overflow-hidden">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
               
               <div className="text-center mb-8 relative z-10">
                <span className="inline-block border-2 border-purple-500/50 text-purple-400 px-6 py-2 rounded-full text-sm font-black tracking-[0.3em] bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                  POIDS TOTAL : {calculatedTotal}
                </span>
              </div>
              
              <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className={`grid gap-2 sm:gap-3 relative z-10 ${gridSize === '3x3' ? 'grid-cols-3' : 'grid-cols-4'}`}
              >
                {/* Horizontal & Vertical internal lines simulating ancient draw */}
                <div className="absolute top-1/3 left-0 right-0 h-1 bg-zinc-800/50 rounded-full"></div>
                <div className="absolute top-2/3 left-0 right-0 h-1 bg-zinc-800/50 rounded-full"></div>
                <div className="absolute left-1/3 top-0 bottom-0 w-1 bg-zinc-800/50 rounded-full"></div>
                <div className="absolute left-2/3 top-0 bottom-0 w-1 bg-zinc-800/50 rounded-full"></div>

                {grid.map((row, i) => (
                  row.map((val, j) => (
                    <motion.div 
                      key={`${i}-${j}`}
                      variants={item}
                      className="aspect-square bg-zinc-800/80 backdrop-blur-sm rounded-xl flex items-center justify-center relative group p-2"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                      <span className={`font-black text-white tabular-nums drop-shadow-md z-10 ${gridSize === '4x4' ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl'}`}>
                        {val}
                      </span>
                    </motion.div>
                  ))
                ))}
              </motion.div>

              <div className="text-center mt-8 relative z-10">
                 <p className="text-xs text-zinc-500 font-bold tracking-widest uppercase mb-1">Harmonie Parfaite</p>
                 <p className="text-xs text-zinc-600">Lignes, colonnes et diagonales = {calculatedTotal}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
