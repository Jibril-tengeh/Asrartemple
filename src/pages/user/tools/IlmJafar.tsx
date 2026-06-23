import React, { useState } from 'react';
import { BookOpen, Key, ArrowLeft, RefreshCw, Sparkles, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

const JAFAR_RESPONSES = [
  "La patience est ta clé, l'issue est proche.",
  "Ce que tu cherches te cherche également, avance avec foi.",
  "Un obstacle caché doit être purifié avant la réussite.",
  "La lumière est au bout de ce chemin, ne désespère pas.",
  "Le secret réside dans le silence, garde tes intentions cachées.",
  "Une aide inattendue viendra dénouer cette situation.",
  "La réponse est en toi, écoute ton intuition première."
];

export const IlmJafar: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState<{
    original: string[];
    taksir: string[];
    unique: string[];
    answer: string;
  } | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateJafar = () => {
    if (!question) return;
    setIsCalculating(true);
    
    setTimeout(() => {
      // 1. Nettoyage
      const cleanQ = question.replace(/[^ء-ي]/g, '');
      const letters = cleanQ.split('');
      
      // 2. Taksir (Fracturation - Premier/Dernier)
      const taksir: string[] = [];
      let i = 0;
      let j = letters.length - 1;
      while (i <= j) {
        if (i === j) {
          taksir.push(letters[i]);
        } else {
          taksir.push(letters[i]);
          taksir.push(letters[j]);
        }
        i++;
        j--;
      }

      // 3. Lettres uniques (Istikhraj)
      const unique = Array.from(new Set(taksir));
      
      // 4. Réponse
      const answerIndex = cleanQ.length % JAFAR_RESPONSES.length;
      
      setResult({
        original: letters,
        taksir,
        unique,
        answer: JAFAR_RESPONSES[answerIndex]
      });
      
      setIsCalculating(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24">
      <div className="mb-8">
        <Link to="/tools" className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-4 font-medium transition-colors">
          <ArrowLeft size={20} className="mr-2" />
          Retour au tableau de bord
        </Link>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Key className="text-purple-500" size={32} />
          Oracle de l'Imam Ali (Ilm al-Jafar)
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          La science de divination suprême par l'extraction et la fracturation des lettres (Taksir).
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-8">
        <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <MessageCircle size={18} className="text-purple-500"/>
          Posez votre question (en arabe)
        </label>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ex: هل سأنجح في هذا العمل؟"
            className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-right font-arabic text-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            dir="rtl"
          />
          <button
            onClick={calculateJafar}
            disabled={!question || isCalculating}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 sm:w-auto w-full whitespace-nowrap"
          >
            {isCalculating ? <RefreshCw className="animate-spin" size={20} /> : <Sparkles size={20} />}
            Consulter le Jafar
          </button>
        </div>
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 border-b border-gray-200 dark:border-gray-800 pb-2">1. Lettres Originales</h3>
              <div className="flex flex-wrap gap-2 justify-end" dir="rtl">
                {result.original.map((char, i) => (
                  <span key={i} className="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 font-arabic text-lg font-bold">
                    {char}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 border-b border-gray-200 dark:border-gray-800 pb-2">2. Le Taksir (Fracturation)</h3>
              <div className="flex flex-wrap gap-2 justify-end" dir="rtl">
                {result.taksir.map((char, i) => (
                  <span key={i} className="w-8 h-8 flex items-center justify-center bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded border border-purple-200 dark:border-purple-800/50 font-arabic text-lg font-bold">
                    {char}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 border-b border-gray-200 dark:border-gray-800 pb-2">3. Racine Unique (Istikhraj)</h3>
              <div className="flex flex-wrap gap-2 justify-end" dir="rtl">
                {result.unique.map((char, i) => (
                  <span key={i} className="w-8 h-8 flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded border border-emerald-200 dark:border-emerald-800/50 font-arabic text-lg font-bold">
                    {char}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-3xl p-8 text-center text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <BookOpen size={150} />
            </div>
            <div className="relative z-10">
              <span className="bg-white/20 px-4 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase mb-6 inline-block">Natiqhat al-Jafar (La Réponse)</span>
              <p className="text-2xl md:text-3xl font-serif font-bold leading-relaxed mb-4">
                "{result.answer}"
              </p>
              <div className="w-16 h-1 bg-purple-500/50 mx-auto mt-6 rounded-full"></div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
