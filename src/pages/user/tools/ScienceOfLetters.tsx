import React, { useState } from 'react';
import { Type, ArrowLeft, Moon, Star, Wind, Flame, Droplets, Mountain, Key, Shield, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

const LETTERS_DATA = [
  { char: 'ا', name: 'Alif', element: 'Feu', angel: 'Hatmaya\'il', angelArabic: 'هَطْمَائِيلُ', demon: 'Hadhayun', demonArabic: 'هَذَايُون', incense: 'Musc (مسك)', planet: 'Soleil', surah: 'Al-Baqarah', abjad: 1, secret: "Réciter 111 fois pour l'autorité, la compréhension des sciences cachées et l'élévation spirituelle." },
  { char: 'ب', name: 'Ba', element: 'Terre', angel: 'Kamlaya\'il', angelArabic: 'كَمْلَائِيلُ', demon: 'Kashmash', demonArabic: 'كَشْمَش', incense: 'Encens Mâle (لبان ذكر)', planet: 'Lune', surah: 'Al-Imran', abjad: 2, secret: "Réciter pour la guérison des maladies, la bénédiction dans les biens et l'ouverture des portes fermées." },
  { char: 'ج', name: 'Jim', element: 'Air', angel: 'Tanqayail', angelArabic: 'طَنْقَائِيلُ', demon: 'Atyan', demonArabic: 'عَطْيَان', incense: 'Santal Rouge (صندل أحمر)', planet: 'Mars', surah: 'An-Nisa', abjad: 3, secret: "Efficace pour obtenir la richesse, attirer la subsistance et vaincre les ennemis." },
  { char: 'د', name: 'Dal', element: 'Eau', angel: 'Halyaya\'il', angelArabic: 'حَلْيَائِيلُ', demon: 'Rawan', demonArabic: 'رَوَان', incense: 'Oud (عود)', planet: 'Mercure', surah: 'Al-Ma\'idah', abjad: 4, secret: "Idéal pour l'amour, l'affection, et se faire accepter par les personnes de pouvoir." },
  { char: 'ه', name: 'Ha', element: 'Feu', angel: 'Mahkaya\'il', angelArabic: 'مَهْكَائِيلُ', demon: 'Hawaf', demonArabic: 'هَوَاف', incense: 'Safran (زعفران)', planet: 'Jupiter', surah: 'Al-An\'am', abjad: 5, secret: "Utilisé pour la clairvoyance, dissiper la tristesse et renforcer la volonté." },
  { char: 'و', name: 'Waw', element: 'Terre', angel: 'Ruhaya\'il', angelArabic: 'رُوهَائِيلُ', demon: 'Zawaba\'ah', demonArabic: 'زَوَبَعَة', incense: 'Mastic (مصطكى)', planet: 'Vénus', surah: 'Al-A\'raf', abjad: 6, secret: "Réciter pour faciliter les rencontres, la conciliation entre deux personnes et la résolution des conflits." },
  { char: 'ز', name: 'Zay', element: 'Air', angel: 'Samhaya\'il', angelArabic: 'سَمْهَائِيلُ', demon: 'Maymun', demonArabic: 'مَيْمُون', incense: 'Coriandre (كزبرة)', planet: 'Saturne', surah: 'Al-Anfal', abjad: 7, secret: "Apporte le succès dans le commerce, la chance et la protection contre les vols." },
  { char: 'ح', name: 'Ha', element: 'Eau', angel: 'Dardaya\'il', angelArabic: 'دَرْدَائِيلُ', demon: 'Shamhurish', demonArabic: 'شَمْهُورِش', incense: 'Myrrhe (مر)', planet: 'Soleil', surah: 'At-Tawbah', abjad: 8, secret: "Connu pour soulager les maux physiques, éloigner la magie et briser les mauvais sorts." },
  { char: 'ط', name: 'Ta', element: 'Feu', angel: 'Ghalghayail', angelArabic: 'غَلْغَائِيلُ', demon: 'Ahmar', demonArabic: 'أَحْمَر', incense: 'Oliban (لبان)', planet: 'Lune', surah: 'Yunus', abjad: 9, secret: "Utilisé pour la protection nocturne, la destruction des obstacles et le bannissement des entités négatives." },
  { char: 'ي', name: 'Ya', element: 'Terre', angel: 'Saryayil', angelArabic: 'صَرْيَائِيلُ', demon: 'Murrah', demonArabic: 'مُرَّة', incense: 'Bois de rose (خشب ورد)', planet: 'Mars', surah: 'Hud', abjad: 10, secret: "Renforce la mémoire, aide à l'apprentissage rapide et attire l'inspiration." },
  { char: 'ك', name: 'Kaf', element: 'Air', angel: 'Kalkayail', angelArabic: 'كَلْكَائِيلُ', demon: 'Barqan', demonArabic: 'بَرْقَان', incense: 'Benjoin (جاوي)', planet: 'Mercure', surah: 'Yusuf', abjad: 20, secret: "Protège contre le mauvais œil, apporte l'invisibilité spirituelle face aux ennemis." },
  { char: 'ل', name: 'Lam', element: 'Eau', angel: 'Mahayail', angelArabic: 'مَهَيَائِيلُ', demon: 'Shamradal', demonArabic: 'شَمْرَدَل', incense: 'Ambre (عنبر)', planet: 'Jupiter', surah: 'Ar-Ra\'d', abjad: 30, secret: "Facilite les mariages, renforce les alliances et apporte l'harmonie familiale." },
  { char: 'م', name: 'Mim', element: 'Feu', angel: 'Mikhail', angelArabic: 'مِيكَائِيلُ', demon: 'Mansur', demonArabic: 'مَنْصُور', incense: 'Girofle (قرنفل)', planet: 'Vénus', surah: 'Ibrahim', abjad: 40, secret: "Le zikr de cette lettre aide à la maîtrise de soi, la sagesse et l'atteinte des grands objectifs." },
  { char: 'ن', name: 'Nun', element: 'Terre', angel: 'Sa\'qayail', angelArabic: 'سَعْقَائِيلُ', demon: 'Zalzal', demonArabic: 'زَلْزَل', incense: 'Harmal (حرمل)', planet: 'Saturne', surah: 'Al-Hijr', abjad: 50, secret: "Favorise l'illumination du cœur (Kashf), la perception des mystères et la protection des enfants." },
  { char: 'س', name: 'Sin', element: 'Air', angel: 'Ta\'kalyail', angelArabic: 'طَعْكَايَائِيلُ', demon: 'Sahir', demonArabic: 'سَاهِر', incense: 'Camphre (كافور)', planet: 'Soleil', surah: 'An-Nahl', abjad: 60, secret: "Éloigne la pauvreté, attire les bonnes opportunités et accélère les voyages." },
  { char: 'ع', name: 'Ayn', element: 'Eau', angel: 'Salqaqyail', angelArabic: 'صَلْقَقْيَائِيلُ', demon: 'Asfur', demonArabic: 'عَصْفُور', incense: 'Costus (قسط)', planet: 'Lune', surah: 'Al-Isra', abjad: 70, secret: "Confère une grande éloquence, la victoire dans les débats et le charisme." },
  { char: 'ف', name: 'Fa', element: 'Feu', angel: 'Tartayail', angelArabic: 'طَرْطَائِيلُ', demon: 'Fazir', demonArabic: 'فَازِر', incense: 'Styrax (ميعة)', planet: 'Mars', surah: 'Al-Kahf', abjad: 80, secret: "Récité pour se libérer des dettes, guérir des maladies cardiaques et trouver des objets perdus." },
  { char: 'ص', name: 'Sad', element: 'Terre', angel: 'Surayail', angelArabic: 'صُورَيَائِيلُ', demon: 'Salsal', demonArabic: 'صَلْصَال', incense: 'Galbanum (قنة)', planet: 'Mercure', surah: 'Maryam', abjad: 90, secret: "Apporte la stabilité, le courage dans l'adversité et la fermeté dans les décisions." },
  { char: 'ق', name: 'Qaf', element: 'Air', angel: 'Qalqayail', angelArabic: 'قَلْقَائِيلُ', demon: 'Qarun', demonArabic: 'قَارُون', incense: 'Aloès (صبر)', planet: 'Jupiter', surah: 'Ta-Ha', abjad: 100, secret: "Très puissant pour la domination, l'autorité absolue et la réussite dans les affaires légales." },
  { char: 'ر', name: 'Ra', element: 'Eau', angel: 'Ruqayail', angelArabic: 'رُوقَيَائِيلُ', demon: 'Rashid', demonArabic: 'رَاشِد', incense: 'Santal Blanc (صندل أبيض)', planet: 'Vénus', surah: 'Al-Anbiya', abjad: 200, secret: "Attire la bienveillance des gens, apporte la joie et élimine la dépression." },
  { char: 'ش', name: 'Shin', element: 'Feu', angel: 'Shamhayail', angelArabic: 'شَمْهَائِيلُ', demon: 'Shayban', demonArabic: 'شَيْبَان', incense: 'Rose (ورد)', planet: 'Saturne', surah: 'Al-Hajj', abjad: 300, secret: "Utilisé pour intimider les adversaires, obtenir justice et disperser les rassemblements malveillants." },
  { char: 'ت', name: 'Ta', element: 'Terre', angel: 'Ta\'nayail', angelArabic: 'طَعْنَائِيلُ', demon: 'Tarish', demonArabic: 'تَارِش', incense: 'Cannelle (قرفة)', planet: 'Soleil', surah: 'Al-Mu\'minun', abjad: 400, secret: "Aide à l'enracinement, la prospérité agricole et la solidité des constructions." },
  { char: 'ث', name: 'Tha', element: 'Air', angel: 'Tha\'nayail', angelArabic: 'ثَعْنَائِيلُ', demon: 'Thabit', demonArabic: 'ثَابِت', incense: 'Safran (زعفران)', planet: 'Lune', surah: 'An-Nur', abjad: 500, secret: "Favorise l'amour spirituel, la réception de bonnes nouvelles et la guérison spirituelle." },
  { char: 'خ', name: 'Kha', element: 'Eau', angel: 'Khalkayail', angelArabic: 'خَلْكَائِيلُ', demon: 'Khanzar', demonArabic: 'خَنْزَر', incense: 'Ail séché (ثوم مجفف)', planet: 'Mars', surah: 'Al-Furqan', abjad: 600, secret: "Détruit la jalousie, purifie les lieux hantés et repousse les attaques psychiques." },
  { char: 'ذ', name: 'Dhal', element: 'Feu', angel: 'Dhalqayail', angelArabic: 'ذَلْقَائِيلُ', demon: 'Dhidhan', demonArabic: 'ذِيْدَان', incense: 'Nigelle (حبة البركة)', planet: 'Mercure', surah: 'Ash-Shu\'ara', abjad: 700, secret: "Protège contre les calomnies, fait taire les mauvaises langues et rétablit la réputation." },
  { char: 'ض', name: 'Dhad', element: 'Terre', angel: 'Dhanqayail', angelArabic: 'ضَنْقَائِيلُ', demon: 'Dharyan', demonArabic: 'ضَرْيَان', incense: 'Moutarde (خردل)', planet: 'Jupiter', surah: 'An-Naml', abjad: 800, secret: "Utilisé pour récupérer un droit spolié, châtier les oppresseurs et dénouer les blocages." },
  { char: 'ظ', name: 'Zha', element: 'Air', angel: 'Zhalqayail', angelArabic: 'ظَلْقَائِيلُ', demon: 'Zhami', demonArabic: 'ظَامِي', incense: 'Gomme ammoniaque (أشق)', planet: 'Vénus', surah: 'Al-Qasas', abjad: 900, secret: "Très fort pour vaincre les ennemis tenaces, la protection absolue et l'invisibilité mystique." },
  { char: 'غ', name: 'Ghayn', element: 'Eau', angel: 'Ghalkayail', angelArabic: 'غَلْكَائِيلُ', demon: 'Ghasib', demonArabic: 'غَاصِب', incense: 'Asafoetida (حلتيت)', planet: 'Saturne', surah: 'Al-\'Ankabut', abjad: 1000, secret: "Aide aux voyages invisibles, l'éloignement de la pauvreté extrême et la dissimulation des secrets." }
];

export const ScienceOfLetters: React.FC = () => {
  const [selectedLetter, setSelectedLetter] = useState<any | null>(null);

  const getElementIcon = (element: string) => {
    switch(element) {
      case 'Feu': return <Flame size={16} className="text-red-500" />;
      case 'Eau': return <Droplets size={16} className="text-blue-500" />;
      case 'Terre': return <Mountain size={16} className="text-amber-600" />;
      case 'Air': return <Wind size={16} className="text-gray-400 dark:text-gray-300" />;
      default: return <Star size={16} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24">
      <div className="mb-8">
        <Link to="/tools" className="inline-flex items-center text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium mb-4">
          <ArrowLeft className="mr-2" size={20} />
          Retour aux Outils
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Type className="text-emerald-500" />
          Science des Lettres (Sirr al-Huruf)
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Dictionnaire interactif profond pour les 28 lettres de l'alphabet arabe. Découvrez leurs anges, démons, encens et secrets mystiques.
        </p>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 sm:gap-3 mb-8" dir="rtl">
        {LETTERS_DATA.map((l, i) => (
          <button
            key={i}
            onClick={() => setSelectedLetter(l)}
            className={`aspect-square flex flex-col items-center justify-center rounded-xl font-bold text-2xl transition-all border ${selectedLetter?.char === l.char ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg scale-110 z-10' : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700 hover:border-emerald-500 hover:shadow-md'}`}
          >
            <span className="font-arabic">{l.char}</span>
            <span className={`text-[10px] mt-1 font-sans ${selectedLetter?.char === l.char ? 'text-emerald-100' : 'text-gray-400'}`}>{l.abjad}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {selectedLetter ? (
          <motion.div
            key={selectedLetter.char}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 shadow-sm space-y-6"
          >
            <div className="flex items-center gap-6 border-b border-gray-100 dark:border-gray-700 pb-6">
              <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center rounded-full text-5xl font-arabic border-4 border-emerald-100 dark:border-emerald-900/50 shadow-inner">
                {selectedLetter.char}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{selectedLetter.name}</h2>
                    <p className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full inline-block text-sm">Valeur Abjad: {selectedLetter.abjad}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-5 border border-emerald-100 dark:border-emerald-800/30">
              <h3 className="font-bold text-emerald-800 dark:text-emerald-400 mb-2 flex items-center gap-2">
                <Key size={18} /> Le Secret (Sirr)
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                "{selectedLetter.secret}"
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">{getElementIcon(selectedLetter.element)} Élément Dominant</p>
                <p className="font-bold text-gray-900 dark:text-white text-lg">{selectedLetter.element}</p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                <p className="text-sm text-gray-500 mb-1 flex items-center gap-2"><Moon size={16} className="text-indigo-500"/> Astre Gouvernant</p>
                <p className="font-bold text-gray-900 dark:text-white text-lg">{selectedLetter.planet}</p>
              </div>

              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 opacity-5">
                  <Star size={64} />
                </div>
                <p className="text-sm text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-2"><Sparkles size={16} /> Ange (Rouhaniyya)</p>
                <div className="flex justify-between items-end mt-2">
                  <p className="font-bold text-gray-900 dark:text-white text-lg">{selectedLetter.angel}</p>
                  <p className="text-2xl font-arabic font-bold text-blue-600 dark:text-blue-400" dir="rtl">{selectedLetter.angelArabic}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 opacity-5">
                  <Shield size={64} />
                </div>
                <p className="text-sm text-red-600 dark:text-red-400 mb-1 flex items-center gap-2"><Flame size={16} /> Serviteur (Ifrit/Jinn)</p>
                <div className="flex justify-between items-end mt-2">
                  <p className="font-bold text-gray-900 dark:text-white text-lg">{selectedLetter.demon}</p>
                  <p className="text-2xl font-arabic font-bold text-red-600 dark:text-red-400" dir="rtl">{selectedLetter.demonArabic}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                <p className="text-sm text-gray-500 mb-1 flex items-center gap-2"><Wind size={16} className="text-amber-600"/> Encens Associé (Bakhour)</p>
                <p className="font-bold text-gray-900 dark:text-white text-lg">{selectedLetter.incense}</p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                <p className="text-sm text-gray-500 mb-1 flex items-center gap-2"><Star size={16} className="text-emerald-500"/> Sourate Associée</p>
                <p className="font-bold text-gray-900 dark:text-white text-lg">{selectedLetter.surah}</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-16 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800 border-dashed">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Type size={32} />
            </div>
            <p className="text-gray-900 dark:text-white font-bold text-lg mb-2">Sélectionnez une lettre</p>
            <p className="text-gray-500 dark:text-gray-400 font-medium max-w-sm mx-auto">Explorez les secrets, les anges, et les attributs mystiques de chaque lettre de l'alphabet arabe.</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

