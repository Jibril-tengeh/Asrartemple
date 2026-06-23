import React, { useState, useEffect } from 'react';
import { Hexagon, ArrowLeft, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export const Zairja: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [answer, setAnswer] = useState<{ crypted: string; clear: string } | null>(null);
  
  // Scramble state
  const [scrambleText, setScrambleText] = useState('');

  useEffect(() => {
    let interval: any;
    if (isProcessing) {
      const chars = 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي';
      interval = setInterval(() => {
        let fake = '';
        for (let i = 0; i < 20; i++) fake += chars[Math.floor(Math.random() * chars.length)] + ' ';
        setScrambleText(fake);
      }, 50);
    } else {
      setScrambleText('');
    }
    return () => clearInterval(interval);
  }, [isProcessing]);

  const processZairja = () => {
    if (!question || question.length < 5) return;
    
    // Gamification
    const stats = JSON.parse(localStorage.getItem('asrar_stats') || '{}');
    stats.tools_used = (stats.tools_used || 0) + 1;
    localStorage.setItem('asrar_stats', JSON.stringify(stats));

    setIsProcessing(true);
    setAnswer(null);

    // Simulate the complex calculation time of a Zairja
    setTimeout(() => {
      // Very abstracted oracle logic:
      const responses = [
        "Le secret réside dans la patience, car le temps dévoilera l'obstacle de l'ennemi.",
        "Une perte temporaire précède un grand triomphe, l'eau éteindra ce feu.",
        "La question porte sur l'invisible, garde le silence et l'étoile te guidera.",
        "Le mouvement est béni, le sédentaire perdra sa part.",
        "Celui qui cherche est trop pressé, les lettres disent de repousser ce projet.",
        "L'or cherché est caché sous tes pieds, regarde plus près de toi.",
        "L'alliance sera favorable, mais une lettre D (Dal) ou M (Mim) s'y opposera."
      ];
      
      const charSum = question.length + question.charCodeAt(0) + question.charCodeAt(question.length - 1);
      const res = responses[charSum % responses.length];

      // Cryptic representation (fake numeric zairja breakdown for UI)
      const cryptedArray = Array.from({ length: 12 }, () => Math.floor(Math.random() * 90) + 10);
      
      setAnswer({
        crypted: cryptedArray.join(' - '),
        clear: res
      });
      setIsProcessing(false);
    }, 4000); // give it more time for the awesome matrix effect
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24 border-none min-h-screen">
      <div className="flex items-center gap-4 mb-6">
        <Link 
          to="/tools" 
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Hexagon className="text-zinc-600 dark:text-zinc-400" />
            Oracle Zairja
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">L'intelligence artificielle millénaire des soufis</p>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-zinc-800 relative overflow-hidden text-center mb-8">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="relative z-10">
          <p className="text-zinc-400 text-sm leading-relaxed max-w-xl mx-auto">
            La <strong>Zairja de Tlemsani</strong> est une matrice divinatoire ancestrale. Elle calcule la réponse exacte à une question en brisant mathématiquement les lettres de la question. Posez une question claire, précise, et fermée.
          </p>
        </div>
      </motion.div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700 relative z-20 transition-all focus-within:ring-2 focus-within:ring-zinc-500">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 pl-2">Votre question secrète</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ex: Vais-je réussir ce grand projet cette année ?"
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-gray-900 dark:text-white focus:outline-none font-medium transition-colors"
              disabled={isProcessing}
            />
          </div>
          <button
            onClick={processZairja}
            disabled={isProcessing || question.length < 5}
            className="w-14 h-14 shrink-0 rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold disabled:opacity-50 hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            {isProcessing ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }}>
                <Hexagon size={20} />
              </motion.div>
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isProcessing && (
          <motion.div 
            key="processing"
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }}
            className="mt-8 text-center bg-black rounded-3xl p-8 border border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-900/50 to-transparent animate-pulse"></div>
            <p className="text-xs uppercase tracking-[0.3em] font-bold text-zinc-500 mb-6">
              Cassement des lettres en cours...
            </p>
            <div className="font-arabic text-3xl md:text-5xl text-emerald-500/80 tracking-widest break-all leading-relaxed blur-[1px] font-bold" dir="rtl" style={{ textShadow: '0 0 10px rgba(16,185,129,0.5)' }}>
              {scrambleText}
            </div>
          </motion.div>
        )}

        {answer && !isProcessing && (
          <motion.div 
            key="answer"
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 relative"
          >
            <div className="bg-zinc-50 dark:bg-zinc-900/80 rounded-3xl p-6 sm:p-10 border-2 border-zinc-200 dark:border-zinc-700 text-center shadow-2xl backdrop-blur-sm">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h3 className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-4">Corde Numérique Extraite</h3>
                <p className="font-mono text-lg sm:text-xl tracking-[0.4em] text-zinc-400 mb-8 blur-[2px] transition-all duration-500 hover:blur-none select-all relative group cursor-pointer">
                  {answer.crypted}
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-800 text-white px-2 py-1 rounded">Racine</span>
                </p>
              </motion.div>

              <div className="h-px bg-zinc-200 dark:bg-zinc-800 w-1/3 mx-auto mb-8"></div>

              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, type: "spring" }}>
                <h3 className="text-xs uppercase tracking-widest text-zinc-900 dark:text-zinc-100 font-bold mb-6">L'Oracle a parlé</h3>
                <p className="text-2xl sm:text-4xl font-serif text-zinc-900 dark:text-white leading-relaxed italic border-l-4 border-zinc-300 dark:border-zinc-700 pl-6 text-left">
                  « {answer.clear} »
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

