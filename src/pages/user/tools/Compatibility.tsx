import React, { useState } from 'react';
import { Users, ArrowLeft, Heart, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export const Compatibility: React.FC = () => {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [result, setResult] = useState<any>(null);

  const calculateCompatibility = () => {
    if (!name1 || !name2) return;
    
    // Abstract calculation for demo purposes representing Ilm al-Huruf rules
    const val1 = name1.length * 3;
    const val2 = name2.length * 4;
    const total = val1 + val2 + 7; // esoteric sum
    
    // Determining element (Fire, Earth, Air, Water)
    const elements = ["Feu (Nar)", "Terre (Turab)", "Air (Hawa)", "Eau (Ma')"];
    const elem1 = elements[val1 % 4];
    const elem2 = elements[val2 % 4];
    
    const percentage = Math.floor(60 + (total % 41));
    let analysis = "";
    
    if (percentage > 85) {
      analysis = "Entente spirituelle excellente. Vos éléments s'harmonisent parfaitement selon la science du Tabai' (Natures).";
    } else if (percentage > 70) {
      analysis = "Bonne compatibilité. L'alliance aura besoin de prières (Fatiha) pour stabiliser les différences élémentaires.";
    } else {
      analysis = "Compatibilité complexe. Des exercices spirituels (Wirds) spécifiques sont recommandés pour équilibrer vos auras.";
    }

    setResult({
      percentage,
      elem1,
      elem2,
      analysis
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24 border-none">
      <div className="flex items-center gap-4 mb-6">
        <Link 
          to="/tools" 
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="text-rose-500" />
            Compatibilité Spirituelle
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Science des Lettres & Natures Élémentaires</p>
        </div>
      </div>

      <div className="bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-800/50 rounded-2xl p-4 mb-8">
        <p className="text-sm text-rose-800 dark:text-rose-200">
          Entrez les deux prénoms (idéalement avec ceux des mères dans la tradition ésotérique) pour analyser l'harmonie des éléments (Feu, Terre, Air, Eau) selon le système Hurufi.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Premier Prénom</label>
            <input
              type="text"
              value={name1}
              onChange={(e) => setName1(e.target.value)}
              placeholder="Ex: Muhammad"
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Deuxième Prénom</label>
            <input
              type="text"
              value={name2}
              onChange={(e) => setName2(e.target.value)}
              placeholder="Ex: Khadija"
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500"
            />
          </div>
          <button
            onClick={calculateCompatibility}
            disabled={!name1 || !name2}
            className="w-full mt-4 py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold disabled:opacity-50 hover:shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Heart size={20} /> Analyser l'Harmonie
          </button>
        </div>
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Score Mystique</h3>
            <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600">
              {result.percentage}%
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 text-center">
              <span className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Élément de {name1 || "1"}</span>
              <span className="font-bold text-gray-900 dark:text-white">{result.elem1}</span>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 text-center">
              <span className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Élément de {name2 || "2"}</span>
              <span className="font-bold text-gray-900 dark:text-white">{result.elem2}</span>
            </div>
          </div>
          
          <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-2xl border border-rose-100 dark:border-rose-800/30">
            <p className="text-rose-900 dark:text-rose-200 leading-relaxed font-medium">
              {result.analysis}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};
