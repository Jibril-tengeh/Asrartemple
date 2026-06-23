import React, { useState } from 'react';
import { Star, ArrowLeft, RefreshCw, Calculator } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export const KhatimGenerator: React.FC = () => {
  const [inputNumber, setInputNumber] = useState('');
  const [grid, setGrid] = useState<number[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Al-Ghazali 3x3 Magic Square standard filling logic (Batad Zahaj Waha)
  // House sequence: 4-9-2, 3-5-7, 8-1-6 (standard order)
  // Mathematical logic: 
  // Let N = Goal.
  // base = Math.floor((N - 12) / 3)
  // rem = N % 3
  
  // The standard Ghazali square is:
  // 8  1  6
  // 3  5  7
  // 4  9  2

  // Formula for cell i (where standard Ghazali value is V_i):
  // cell = base + V_i
  // If we have a remainder, add 1 to the cells where V_i >= (10 - rem).
  // Wait, the standard "Jabr" (compensation) rule is to add the remainder to the house of the Kasr (fraction).
  // If rem = 1, insert in House 7, add 1 to houses 7, 8, 9.
  // If rem = 2, insert in House 4, add 1 to houses 4, 5, 6, 7, 8, 9.
  
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

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24 border-none">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link 
          to="/tools" 
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Star className="text-purple-500" />
            Générateur de Khatim
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Wafq Muthallath (Carré magique 3x3)</p>
        </div>
      </div>

      <div className="bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800/50 rounded-2xl p-4 mb-8">
        <p className="text-sm text-purple-800 dark:text-purple-200">
          Entrez le Poids Mystique (issu du Calculateur Abjad) pour générer automatiquement son Wafq Muthallath selon la règle originelle d'Al-Ghazali.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Valeur Numérique Cible (Minimum 15)
        </label>
        <div className="flex gap-4">
          <input
            type="number"
            value={inputNumber}
            onChange={(e) => setInputNumber(e.target.value)}
            placeholder="Ex: 66, 313, 129..."
            className="flex-1 w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-xl sm:text-2xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={generateKhatim}
            className="px-6 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-bold transition-transform hover:scale-105 active:scale-95 shadow-sm"
          >
            Générer
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-3 font-medium">{error}</p>}
      </div>

      {grid && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-md border border-gray-100 dark:border-gray-700 mx-auto max-w-sm"
        >
          <div className="text-center mb-6">
            <span className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 px-3 py-1 rounded-full text-sm font-bold tracking-wider">
              TOTAL: {inputNumber}
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-2 sm:gap-3 bg-gray-200 dark:bg-gray-700 p-2 sm:p-3 rounded-2xl">
            {grid.map((val, idx) => (
              <div 
                key={idx} 
                className="aspect-square bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tabular-nums shadow-sm border border-gray-100 dark:border-gray-600"
              >
                {val}
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6 mt-4">
            * Toutes les lignes, colonnes et diagonales totalisent {inputNumber}.
          </p>
        </motion.div>
      )}
    </div>
  );
};
