import React, { useState } from 'react';
import { BookOpen, Flame, Calendar, Info, ArrowLeft, Star, Wind } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';

interface Oath {
  id: string;
  title: string;
  arabicTitle: string;
  desc: string;
  incense: string;
  day: string;
  content: string;
  syriacNames?: { name: string; arabic: string; meaning: string }[];
}

const OATHS: Oath[] = [
  {
    id: "birhatiyya",
    title: "Da'wat al-Birhatiyya",
    arabicTitle: "الدعوة البرهتية",
    desc: "Le serment suprême des anciens sages. Il contient 28 noms syriaques puissants qui commandent les entités supérieures et inférieures. C'est le pilier de la théurgie spirituelle (Rouhaniyya).",
    incense: "Encens Mâle (Oliban) et Coriandre",
    day: "Dimanche (Soleil)",
    content: "بِسْمِ اللَّهِ الْقُدُّوسِ الطَّاهِرِ الْعَلِيِّ الْقَاهِرِ... بِرْهَتِيهٍ بِرْهَتِيهٍ (2)، كَرِيرٍ كَرِيرٍ (2)، تَتْلِيهٍ تَتْلِيهٍ (2)، طُورَانٍ طُورَانٍ (2)، مَزْجَلٍ مَزْجَلٍ (2)...",
    syriacNames: [
      { name: "Birhatīhin", arabic: "بِرْهَتِيهٍ", meaning: "Subbuhun (Très Saint)" },
      { name: "Karīrin", arabic: "كَرِيرٍ", meaning: "Ilahun (Dieu)" },
      { name: "Tatlīhin", arabic: "تَتْلِيهٍ", meaning: "Al-Quddus (Le Pur)" },
      { name: "Turānin", arabic: "طُورَانٍ", meaning: "Ya Hayyu (Ô Vivant)" }
    ]
  },
  {
    id: "jaljalutiyya",
    title: "Al-Jaljalutiyya (Sughra)",
    arabicTitle: "الجلجلوتية الصغرى",
    desc: "Le célèbre poème mystique attribué à l'Imam Ali. Composé de 60 versets, il contient les secrets du Nom Suprême caché dans des codes syriaques et hébraïques.",
    incense: "Bois d'Aloès et Musc",
    day: "Mardi (Mars) ou Vendredi (Vénus)",
    content: "بَدَأْتُ بِبِسْمِ اللَّهِ رُوحِي بِهِ هَدَتْ... إِلَى كَشْفِ أَسْرَارٍ بِبَاطِنِهِ انْطَوَتْ. وَصَلَّيْتُ فِي الثَّانِي عَلَى خَيْرِ خَلْقِهِ... مُحَمَّدٍ مَنْ زَاحَ الضَّلَالَةَ وَالْغَلَتْ. سَأَلْتُكَ بِالِاسْمِ الْمُعَظَّمِ قَدْرُهُ... بِآجٍ أَهُوجٍ جَلَّ جَلْيُوتٍ جَلْجَلَتْ.",
    syriacNames: [
      { name: "Ajin", arabic: "آجٍ", meaning: "Allah" },
      { name: "Ahujin", arabic: "أَهُوجٍ", meaning: "Al-Ahad (L'Unique)" },
      { name: "Jaljalyutin", arabic: "جَلْجَلُوتٍ", meaning: "Al-Badi' (L'Innovateur)" }
    ]
  },
  {
    id: "hizb_bahr",
    title: "Hizb al-Bahr",
    arabicTitle: "حزب البحر",
    desc: "L'Oraison de la Mer de l'Imam Abu Hasan al-Shadhili. Récitée pour la protection absolue lors des voyages, la dissipation des angoisses et la victoire sur les ennemis invisibles.",
    incense: "Santal et Ambre",
    day: "Tous les jours après l'Asr",
    content: "يَا اللَّهُ يَا عَلِيُّ يَا عَظِيمُ يَا حَلِيمُ يَا عَلِيمُ... أَنْتَ رَبِّي وَعِلْمُكَ حَسْبِي... فَنِعْمَ الرَّبُّ رَبِّي وَنِعْمَ الْحَسْبُ حَسْبِي... تَنْصُرُ مَنْ تَشَاءُ وَأَنْتَ الْعَزِيزُ الرَّحِيمُ.",
  }
];

export const GrandOaths: React.FC = () => {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<Oath | null>(null);

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24">
      <div className="mb-8">
        <Link to="/tools" className="inline-flex items-center text-amber-600 hover:text-amber-700 mb-4 font-medium transition-colors">
          <ArrowLeft size={20} className="mr-2" />
          {t("common.back")} au tableau de bord
        </Link>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <BookOpen className="text-amber-500" size={32} />
          Les Grands Serments (Azayim)
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">{t("tools.grand-oaths.description")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          {OATHS.map((oath) => (
            <button
              key={oath.id}
              onClick={() => setSelected(oath)}
              className={`w-full text-left p-5 rounded-2xl border transition-all ${
                selected?.id === oath.id 
                  ? 'bg-amber-600 text-white border-amber-600 shadow-md' 
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700 hover:border-amber-500 hover:shadow-sm'
              }`}
            >
              <h3 className="font-bold text-lg mb-1">{oath.title}</h3>
              <p className={`text-xl font-arabic ${selected?.id === oath.id ? 'text-amber-200' : 'text-gray-500'} text-right`} dir="rtl">
                {oath.arabicTitle}
              </p>
            </button>
          ))}
        </div>

        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-8 border-b border-gray-100 dark:border-gray-700 bg-amber-50/50 dark:bg-amber-900/10">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{selected.title}</h2>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl">{selected.desc}</p>
                    </div>
                    <div className="text-4xl font-arabic font-bold text-amber-600 opacity-20">
                      {selected.arabicTitle}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 bg-white dark:bg-gray-900 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700">
                      <Wind size={18} className="text-amber-600" />
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Encens: {selected.incense}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white dark:bg-gray-900 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700">
                      <Calendar size={18} className="text-blue-500" />
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Jour: {selected.day}</span>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-widest text-sm text-center">Texte de l'Invocation</h3>
                  <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 text-center">
                    <p className="text-3xl md:text-4xl font-arabic leading-[2.5] text-gray-900 dark:text-white" dir="rtl">
                      {selected.content}
                    </p>
                  </div>

                  {selected.syriacNames && (
                    <div className="mt-8">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Star size={18} className="text-amber-500" />
                        Lexique des Noms Cachés
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {selected.syriacNames.map((name, i) => (
                          <div key={i} className="flex justify-between items-center p-4 rounded-xl border border-amber-100 dark:border-amber-900/30 bg-amber-50 dark:bg-amber-900/10">
                            <div>
                              <p className="font-bold text-gray-900 dark:text-white">{name.name}</p>
                              <p className="text-sm text-amber-700 dark:text-amber-400">Sens: {name.meaning}</p>
                            </div>
                            <span className="text-2xl font-arabic font-bold text-amber-600" dir="rtl">{name.arabic}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 border-dashed rounded-3xl h-full min-h-[500px] flex flex-col items-center justify-center p-8 text-center">
                <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 text-amber-500 rounded-full flex items-center justify-center mb-6">
                  <BookOpen size={40} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Sélectionnez un Serment</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">
                  Choisissez une Da'wa dans le menu de gauche pour lire ses instructions, son encens et ses secrets.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
