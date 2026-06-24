import React, { useState } from 'react';
import { ArrowLeft, BookOpen, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

// Selected verses for Quranic Istikhara/Faal based on traditional tables
const faalOutcomes = [
  { verse: "إِنَّا فَتَحْنَا لَكَ فَتْحًا مُبِينًا", surah: "Al-Fath (48:1)", outcome: "Très Favorable", desc: "Succès éclatant, victoire et ouverture des portes. Le projet est béni." },
  { verse: "لَا تَخَفْ وَلَا تَحْزَنْ ۖ إِنَّا مُنَجُّوكَ", surah: "Al-'Ankabut (29:33)", outcome: "Rassurant", desc: "Ne craignez rien. La situation semble difficile mais l'issue sera le salut." },
  { verse: "وَعَسَىٰ أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ", surah: "Al-Baqarah (2:216)", outcome: "Patience Requise", desc: "Ce qui vous déplaît actuellement contient un grand bien caché. Soyez patient." },
  { verse: "فَاصْبِرْ صَبْرًا جَمِيلًا", surah: "Al-Ma'arij (70:5)", outcome: "Attente / Épreuve", desc: "Une belle patience est exigée. Le moment n'est pas encore venu." },
  { verse: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", surah: "Ash-Sharh (94:6)", outcome: "Favorable à terme", desc: "La difficulté actuelle sera suivie de facilité. N'abandonnez pas." },
  { verse: "فَاعْرِضْ عَنْهُمْ وَانتَظِرْ إِنَّهُم مُّنتَظِرُونَ", surah: "As-Sajdah (32:30)", outcome: "Défavorable", desc: "Détournez-vous de cette affaire. Il vaut mieux s'en abstenir." },
  { verse: "وَاللَّهُ يَعْصِمُكَ مِنَ النَّاسِ", surah: "Al-Ma'idah (5:67)", outcome: "Protection Divine", desc: "Vous serez protégé dans cette démarche. Allez-y avec confiance." },
];

export const QuranicFaal: React.FC = () => {
  const [intention, setIntention] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [result, setResult] = useState<typeof faalOutcomes[0] | null>(null);

  const performFaal = () => {
    if (!intention) {
      alert("Veuillez formuler votre intention dans votre cœur d'abord.");
      return;
    }

    setIsDrawing(true);
    setResult(null);

    // Simulate spiritual delay
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * faalOutcomes.length);
      setResult(faalOutcomes[randomIndex]);
      setIsDrawing(false);
    }, 2500);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/tools" className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <ArrowLeft className="text-gray-600 dark:text-gray-300" size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BookOpen className="text-blue-600" />
            Istikhara Coranique (Faal)
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Consultation mystique par l'ouverture du Saint Coran</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700 shadow-sm mb-8">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 sm:p-6 border border-blue-100 dark:border-blue-800/30 flex items-start gap-4 mb-8">
          <AlertCircle className="text-blue-500 shrink-0 mt-1" />
          <div className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
            <p className="font-bold mb-2">Conditions du Faal (Tirage au Sort) :</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Être en état de pureté (Wudu).</li>
              <li>Réciter 3 fois la sourate Al-Ikhlas et 1 fois Al-Fatiha dédiées au Prophète (SAW).</li>
              <li>Formuler l'intention pure et demander à Allah de vous guider.</li>
            </ul>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            Votre Niyyah (Intention ou Question Secrète)
          </label>
          <input
            type="text"
            value={intention}
            onChange={(e) => setIntention(e.target.value)}
            placeholder="Ex: Doit-je accepter cette offre ?"
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-base font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={performFaal}
          disabled={isDrawing || !intention}
          className="w-full h-[60px] rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-900 text-white font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-50 flex items-center justify-center gap-3"
        >
          {isDrawing ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Consultation de la Table Gardée...
            </>
          ) : (
            <>
              <BookOpen size={20} />
              Ouvrir le Livre
            </>
          )}
        </button>
      </div>

      <AnimatePresence>
        {result && !isDrawing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-8 border-2 border-blue-100 dark:border-blue-900 shadow-xl text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-indigo-600"></div>
            
            <p className="text-gray-500 dark:text-gray-400 font-medium mb-6 uppercase tracking-widest text-sm">Verset de Réponse</p>
            
            <div className="text-3xl sm:text-4xl font-arabic font-bold text-gray-900 dark:text-white leading-loose mb-4">
              {result.verse}
            </div>
            
            <div className="inline-block px-4 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-bold mb-8">
              {result.surah}
            </div>

            <div className="border-t border-gray-100 dark:border-gray-700 pt-8 mt-2">
              <h3 className={`text-xl font-bold mb-2 ${
                result.outcome.includes('Favorable') ? 'text-emerald-500' :
                result.outcome.includes('Défavorable') ? 'text-rose-500' :
                'text-amber-500'
              }`}>
                {result.outcome}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg max-w-lg mx-auto">
                {result.desc}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
