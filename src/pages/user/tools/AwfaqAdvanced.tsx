import React, { useState } from 'react';
import { ArrowLeft, Hexagon, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AwfaqAdvanced: React.FC = () => {
  const [targetValue, setTargetValue] = useState<string>('');
  const [gridSize, setGridSize] = useState<number>(3); // 3x3, 4x4, 5x5
  const [grid, setGrid] = useState<number[][]>([]);
  const [error, setError] = useState<string>('');

  const generateWafq = () => {
    const val = parseInt(targetValue, 10);
    if (isNaN(val) || val <= 0) {
      setError("Veuillez entrer une valeur valide.");
      return;
    }
    setError('');

    let newGrid: number[][] = [];
    
    if (gridSize === 3) {
      // Muthallath (3x3) - Ghazali Standard
      const base = (val - 12) / 3;
      if (!Number.isInteger(base)) {
        setError(`La valeur ${val} nécessite un "Kasr" (fraction) dans le carré 3x3.`);
        // Simple placement for demonstration (this is basic, not handling Kasr perfectly for esoteric rules)
      }
      
      const b = Math.floor((val - 12) / 3);
      const rem = (val - 12) % 3;

      newGrid = [
        [b + 3 + (rem >= 3 ? 1 : 0), b + 8 + (rem >= 1 ? 1 : 0), b + 1 + (rem >= 2 ? 1 : 0)], // To simplify, standard distribution
        [b + 2 + (rem >= 2 ? 1 : 0), b + 4 + (rem >= 3 ? 1 : 0), b + 6 + (rem >= 1 ? 1 : 0)],
        [b + 7 + (rem >= 1 ? 1 : 0), b + 0 + (rem >= 3 ? 1 : 0), b + 5 + (rem >= 2 ? 1 : 0)]
      ];
      // Note: A true Wafq handles remainders (Kasr) in specific cells based on the element (Fire, Earth, Air, Water).
      // Here we provide a simplified standard Ghazali Muthallath.
      newGrid = [
        [b + 7, b + 0, b + 5], // Bottom row (Arabic bottom-to-top mapping)
        [b + 2, b + 4, b + 6], // Middle row
        [b + 3, b + 8, b + 1]  // Top row
      ];
      if (rem > 0) {
        // add remainder to the highest houses to balance (simplified)
        newGrid[2][0] += rem; // Cell 9
      }
    } else if (gridSize === 4) {
      // Murabba (4x4)
      const base = Math.floor((val - 30) / 4);
      const rem = (val - 30) % 4;
      newGrid = [
        [base + 8, base + 11, base + 14, base + 1],
        [base + 13, base + 2, base + 7, base + 12],
        [base + 3, base + 16, base + 9, base + 6],
        [base + 10, base + 5, base + 4, base + 15]
      ];
      if (rem > 0) newGrid[2][1] += rem; // Cell 16
    } else if (gridSize === 5) {
      // Mukhammas (5x5)
      const base = Math.floor((val - 60) / 5);
      const rem = (val - 60) % 5;
      newGrid = [
        [base+11, base+24, base+7,  base+20, base+3],
        [base+4,  base+12, base+25, base+8,  base+16],
        [base+17, base+5,  base+13, base+21, base+9],
        [base+10, base+18, base+1,  base+14, base+22],
        [base+23, base+6,  base+19, base+2,  base+15]
      ];
      if (rem > 0) newGrid[1][2] += rem; // Cell 25
    }
    
    setGrid(newGrid);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/tools" className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <ArrowLeft className="text-gray-600 dark:text-gray-300" size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Hexagon className="text-fuchsia-500" />
            Générateur de Awfaq
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Carrés magiques avancés (Muthallath, Murabba, Mukhammas)</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700 shadow-sm mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Valeur Numérique Cible (Adad)
            </label>
            <input
              type="number"
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
              placeholder="Ex: 129"
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-xl font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Type de Carré (Wafq)
            </label>
            <div className="flex bg-gray-100 dark:bg-gray-900 rounded-2xl p-1 h-[60px]">
              {[
                { value: 3, label: '3x3' },
                { value: 4, label: '4x4' },
                { value: 5, label: '5x5' }
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setGridSize(opt.value)}
                  className={`flex-1 rounded-xl font-bold text-sm sm:text-base transition-colors ${gridSize === opt.value ? 'bg-white dark:bg-gray-800 text-fuchsia-600 dark:text-fuchsia-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={generateWafq}
          className="w-full h-[56px] rounded-2xl bg-gradient-to-br from-fuchsia-600 to-pink-700 text-white font-bold transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
        >
          Générer le Carré Magique
        </button>

        {error && (
          <p className="text-rose-500 font-medium text-sm mt-4 text-center">{error}</p>
        )}
      </div>

      {grid.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Votre Wafq {gridSize}x{gridSize}</h3>
          
          <div className={`grid gap-2 sm:gap-4`} style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}>
            {grid.map((row, i) => (
              row.map((cell, j) => (
                <div 
                  key={`${i}-${j}`}
                  className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl flex items-center justify-center text-lg sm:text-2xl font-bold text-gray-900 dark:text-white"
                >
                  {cell}
                </div>
              ))
            ))}
          </div>

          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 sm:p-6 border border-blue-100 dark:border-blue-800/30 flex items-start gap-4 max-w-2xl w-full">
            <Info className="text-blue-500 shrink-0 mt-1" />
            <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
              <strong>Règle de remplissage (Sayr) :</strong> Pour que le Wafq soit actif spirituellement, il doit être rempli selon l'ordre numérique croissant des maisons (de la cellule 1 à la dernière), tout en respectant l'encens et l'heure planétaire associés à l'objectif.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
