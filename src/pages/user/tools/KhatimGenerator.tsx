import React, { useState } from 'react';
import { Star, ArrowLeft, RefreshCw, Calculator, Grid } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export const KhatimGenerator: React.FC = () => {
  const [inputNumber, setInputNumber] = useState('');
  const [grid, setGrid] = useState<number[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateKhatim = () => {
    const n = parseInt(inputNumber, 10);
    if (isNaN(n)) {
      setError('Entrez un nombre valide.');
      setGrid(null);
      return;
    }
    if (n < 15) {
      setError('Le nombre doit être supérieur ou égal à 15.');
      setGrid(null);
      return;
    }

    setError(null);
    
    // Gamification
    const stats = JSON.parse(localStorage.getItem('asrar_stats') || '{}');
    stats.tools_used = (stats.tools_used || 0) + 1;
    localStorage.setItem('asrar_stats', JSON.stringify(stats));

    const base = Math.floor((n - 12) / 3);
    const rem = n % 3;

    // Ordered by visual grid indices:
    // 0: (Top-Left) -> House 8
    // 1: (Top-Mid) -> House 1
    // 2: (Top-Right) -> House 6
    // 3: (Mid-Left) -> House 3
    // 4: (Center) -> House 5
    // 5: (Mid-Right) -> House 7
    // 6: (Bot-Left) -> House 4
    // 7: (Bot-Mid) -> House 9
    // 8: (Bot-Right) -> House 2

    const housePositions = [8, 1, 6, 3, 5, 7, 4, 9, 2];
    
    const newGrid = housePositions.map(houseNum => {
      let val = base + houseNum;
      
      // Kasr compensation
      if (rem === 1 && houseNum >= 7) {
        val += 1;
      } else if (rem === 2 && houseNum >= 4) {
        val += 1;
      }
      return val;
    });

    setGrid(newGrid);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
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
            Générateur de Khatim
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Wafq Muthallath (Carré magique 3x3)</p>
        </div>
      </div>

      <div className="bg-purple-900/10 border border-purple-800/30 rounded-3xl p-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>
        <p className="text-sm text-purple-800 dark:text-purple-200 font-medium leading-relaxed relative z-10">
          Entrez le Poids Mystique (Adad) pour générer automatiquement son Wafq Muthallath (Sceau d'Al-Ghazali) via la règle de la fraction (Miftah, Kasr).
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-700 mb-8 relative z-20">
        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">
          Valeur Numérique Cible (Zimām)
        </label>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
             <input
              type="number"
              value={inputNumber}
              onChange={(e) => setInputNumber(e.target.value)}
              placeholder="Min: 15 (Ex: 66, 313, 129...)"
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-lg font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-mono"
            />
          </div>
          <button
            onClick={generateKhatim}
            className="h-16 px-8 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-800 text-white font-bold transition-transform hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2 tracking-wide"
          >
            <Grid size={20} /> VIVIFIER
          </button>
        </div>
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
                  TOTAL : {inputNumber}
                </span>
              </div>
              
              <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-3 gap-3 sm:gap-4 p-4 rounded-2xl relative z-10"
              >
                {/* Horizontal & Vertical internal lines simulating ancient draw */}
                <div className="absolute top-1/3 left-0 right-0 h-1 bg-zinc-800/50 rounded-full"></div>
                <div className="absolute top-2/3 left-0 right-0 h-1 bg-zinc-800/50 rounded-full"></div>
                <div className="absolute left-1/3 top-0 bottom-0 w-1 bg-zinc-800/50 rounded-full"></div>
                <div className="absolute left-2/3 top-0 bottom-0 w-1 bg-zinc-800/50 rounded-full"></div>

                {grid.map((val, idx) => {
                  return (
                    <motion.div 
                      key={idx}
                      variants={item}
                      className="aspect-square bg-zinc-800/80 backdrop-blur-sm rounded-xl flex items-center justify-center relative group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                      <span className="text-2xl sm:text-3xl font-black text-white tabular-nums drop-shadow-md z-10">
                        {val}
                      </span>
                    </motion.div>
                  )
                })}
              </motion.div>

              <div className="text-center mt-8 relative z-10">
                 <p className="text-xs text-zinc-500 font-bold tracking-widest uppercase mb-1">Harmonie Parfaite</p>
                 <p className="text-xs text-zinc-600">Lignes, colonnes et diagonales = {inputNumber}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
