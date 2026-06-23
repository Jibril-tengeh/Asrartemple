import React, { useState } from 'react';
import { Compass, ArrowLeft, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export const Istikhara: React.FC = () => {
  const [intention, setIntention] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const performIstikhara = () => {
    if (!intention) return;
    setIsDrawing(true);
    setResult(null);

    // Simulate mystic thinking delay
    setTimeout(() => {
      const outcomes = [
        {
          type: "pos",
          verset: "Et Il vous donnera ce que vous désirez... (Coran)",
          verdict: "Signe Positif (Fath)",
          desc: "La voie est claire et bénie. Avancez avec confiance (Tawakkul) et priez 2 rakaats de remerciement."
        },
        {
          type: "neg",
          verset: "Il se peut que vous détestiez une chose alors qu'elle est bonne pour vous... (Coran)",
          verdict: "Signe de Prudence (Qabid)",
          desc: "Il y a un voile d'obscurité sur cette affaire. Il vaut mieux patienter ou s'en détourner temporairement."
        },
        {
          type: "neu",
          verset: "Puis, quand tu es déterminé, confie-toi à Allah... (Coran)",
          verdict: "Signe d'Effort (Mujahada)",
          desc: "La chose est possible mais requiert un fort sacrifice et un effort spirituel (Zikr) soutenu pour aboutir."
        }
      ];
      
      const charSum = intention.charCodeAt(0) + intention.length;
      const pick = outcomes[charSum % 3];
      
      setResult(pick);
      setIsDrawing(false);
    }, 2000);
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
            <Compass className="text-teal-500" />
            Istikhara Numérique
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Consultation spirituelle basée sur l'Abjad</p>
        </div>
      </div>

      <div className="bg-teal-50 dark:bg-teal-900/10 border border-teal-100 dark:border-teal-800/50 rounded-2xl p-4 mb-8">
        <p className="text-sm text-teal-800 dark:text-teal-200">
          Formulez clairement votre intention. Le système utilisera les règles d'Ilm al-Jafr pour tirer un présage basé sur les vibrations numériques de votre demande.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
        <textarea
          value={intention}
          onChange={(e) => setIntention(e.target.value)}
          placeholder="Ex: Est-ce que ce voyage commercial m'apportera un bien ?"
          rows={3}
          className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 resize-none mb-4"
        />
        <button
          onClick={performIstikhara}
          disabled={!intention || isDrawing}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-bold disabled:opacity-50 hover:shadow-md transition-all flex items-center justify-center gap-2"
        >
          {isDrawing ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
              <Compass size={20} />
            </motion.div>
          ) : (
            <><BookOpen size={20} /> Consulter le Jafr</>
          )}
        </button>
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl p-6 sm:p-8 border-2 ${
            result.type === 'pos' ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800' :
            result.type === 'neg' ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' :
            'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800'
          }`}
        >
          <div className="text-center mb-6">
            <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold tracking-wider mb-4 ${
              result.type === 'pos' ? 'bg-emerald-200 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-200' :
              result.type === 'neg' ? 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200' :
              'bg-amber-200 text-amber-800 dark:bg-amber-800 dark:text-amber-200'
            }`}>
              {result.verdict}
            </span>
            <p className={`font-arabic text-2xl leading-relaxed italic ${
              result.type === 'pos' ? 'text-emerald-700 dark:text-emerald-400' :
              result.type === 'neg' ? 'text-red-700 dark:text-red-400' :
              'text-amber-700 dark:text-amber-400'
            }`}>
              "{result.verset}"
            </p>
          </div>
          <div className="h-px w-full bg-black/5 dark:bg-white/10 my-4"></div>
          <p className={`font-medium ${
            result.type === 'pos' ? 'text-emerald-900 dark:text-emerald-100' :
            result.type === 'neg' ? 'text-red-900 dark:text-red-100' :
            'text-amber-900 dark:text-amber-100'
          }`}>
            {result.desc}
          </p>
        </motion.div>
      )}
    </div>
  );
};
