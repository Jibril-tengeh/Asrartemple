import React, { useState } from 'react';
import { Compass, ArrowLeft, RefreshCw, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

// Geomancy logic simplified
const MOTHERS = Array(4).fill([0,0,0,0]); // Placeholder

const HOUSES = [
  "La Vie", "L'Argent", "Les Frères", "Le Foyer", "Les Enfants", "La Maladie",
  "Le Mariage", "La Mort", "Les Voyages", "Le Pouvoir", "L'Espoir", "Les Épreuves",
  "Témoin 1", "Témoin 2", "Le Juge", "Le Suprême"
];

export const Geomancy: React.FC = () => {
  const [figures, setFigures] = useState<number[][]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateFigures = () => {
    setIsGenerating(true);
    setTimeout(() => {
      // Generate 4 random mothers (4 arrays of 4 bits)
      const m1 = Array(4).fill(0).map(() => Math.random() > 0.5 ? 1 : 2);
      const m2 = Array(4).fill(0).map(() => Math.random() > 0.5 ? 1 : 2);
      const m3 = Array(4).fill(0).map(() => Math.random() > 0.5 ? 1 : 2);
      const m4 = Array(4).fill(0).map(() => Math.random() > 0.5 ? 1 : 2);

      // Daughters
      const d1 = [m1[0], m2[0], m3[0], m4[0]];
      const d2 = [m1[1], m2[1], m3[1], m4[1]];
      const d3 = [m1[2], m2[2], m3[2], m4[2]];
      const d4 = [m1[3], m2[3], m3[3], m4[3]];

      // Nieces
      const combine = (a: number[], b: number[]) => a.map((val, i) => (val + b[i]) % 2 === 0 ? 2 : 1);
      const n1 = combine(m1, m2);
      const n2 = combine(m3, m4);
      const n3 = combine(d1, d2);
      const n4 = combine(d3, d4);

      // Witnesses
      const w1 = combine(n1, n2);
      const w2 = combine(n3, n4);

      // Judge
      const j = combine(w1, w2);

      // Reconciler
      const r = combine(j, m1);

      setFigures([m1, m2, m3, m4, d1, d2, d3, d4, n1, n2, n3, n4, w1, w2, j, r]);
      setIsGenerating(false);
    }, 1000);
  };

  const renderDots = (arr: number[]) => (
    <div className="flex flex-col gap-1 items-center justify-center">
      {arr.map((val, i) => (
        <div key={i} className="flex gap-1">
          {val === 2 ? (
            <><div className="w-2 h-2 rounded-full bg-amber-900 dark:bg-amber-100"></div><div className="w-2 h-2 rounded-full bg-amber-900 dark:bg-amber-100"></div></>
          ) : (
            <div className="w-2 h-2 rounded-full bg-amber-900 dark:bg-amber-100"></div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24">
      <div className="mb-8">
        <Link to="/tools" className="inline-flex items-center text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium mb-4">
          <ArrowLeft className="mr-2" size={20} />
          Retour aux Outils
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Layers className="text-amber-500" />
          Géomancie (Khatt ar-Raml)
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Consultation géomantique par le tracé sur le sable.
        </p>
      </div>

      <div className="flex justify-center mb-12">
        <button 
          onClick={generateFigures}
          disabled={isGenerating}
          className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold py-4 px-8 rounded-2xl shadow-sm flex items-center gap-2 transition-all"
        >
          <RefreshCw size={20} className={isGenerating ? "animate-spin" : ""} />
          {isGenerating ? "Consultation du sable..." : "Générer le thème"}
        </button>
      </div>

      <AnimatePresence>
        {figures.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="grid grid-cols-8 gap-4 mb-8"
            dir="rtl"
          >
            {/* The houses standard display in Geomancy is right to left usually, standard layout */}
            {figures.slice(0, 16).map((fig, i) => (
              <div key={i} className="flex flex-col items-center p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-xl">
                <span className="text-xs text-amber-600 dark:text-amber-400 font-bold mb-3 uppercase h-8 text-center">{HOUSES[i]}</span>
                {renderDots(fig)}
                <span className="text-xs text-gray-400 mt-3">{i+1}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
