import React, { useState } from 'react';
import { ArrowLeft, Sparkles, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { motion } from 'motion/react';

// Abjad calculation helper
const abjadMap: Record<string, number> = {
  'ا': 1, 'ب': 2, 'ج': 3, 'د': 4, 'ه': 5, 'و': 6, 'ز': 7, 'ح': 8, 'ط': 9,
  'ي': 10, 'ك': 20, 'ل': 30, 'م': 40, 'ن': 50, 'س': 60, 'ع': 70, 'ف': 80, 'ص': 90,
  'ق': 100, 'ر': 200, 'ش': 300, 'ت': 400, 'ث': 500, 'خ': 600, 'ذ': 700, 'ض': 800, 'ظ': 900, 'غ': 1000,
  'ء': 1, 'أ': 1, 'إ': 1, 'آ': 1, 'ؤ': 6, 'ئ': 10, 'ى': 10, 'ة': 5
};

const numberToLetters = (num: number): string => {
  let result = '';
  const thousands = Math.floor(num / 1000) * 1000;
  num %= 1000;
  const hundreds = Math.floor(num / 100) * 100;
  num %= 100;
  const tens = Math.floor(num / 10) * 10;
  const units = num % 10;

  const reverseAbjad: Record<number, string> = {};
  Object.keys(abjadMap).forEach(key => {
    reverseAbjad[abjadMap[key]] = key;
  });

  if (units > 0 && reverseAbjad[units]) result += reverseAbjad[units];
  if (tens > 0 && reverseAbjad[tens]) result += reverseAbjad[tens];
  if (hundreds > 0 && reverseAbjad[hundreds]) result += reverseAbjad[hundreds];
  if (thousands > 0 && reverseAbjad[thousands]) result += reverseAbjad[thousands];

  return result; // letters in standard order (units, tens, hundreds, thousands) as read right to left
};

export const KhouddamExtractor: React.FC = () => {
  const { t } = useLanguage();
  const [inputVal, setInputVal] = useState('');
  const [calculation, setCalculation] = useState<{
    original: number;
    angelicVal: number;
    angelicName: string;
    earthlyVal: number;
    earthlyName: string;
  } | null>(null);

  const calculateKhouddam = () => {
    let pm = 0;
    if (/^\d+$/.test(inputVal)) {
      pm = parseInt(inputVal, 10);
    } else {
      // calculate Abjad
      const cleanText = inputVal.replace(/[^ء-ي]/g, '');
      pm = cleanText.split('').reduce((acc, char) => acc + (abjadMap[char] || 0), 0);
    }

    if (pm <= 51) {
      alert("La valeur doit être supérieure à 51 (Poids du suffixe A'il)");
      return;
    }

    const angelicVal = pm - 51;
    const earthlyVal = pm - 316; // Yush (يوش = 10+6+300 = 316)

    const angelicLetters = numberToLetters(angelicVal);
    const earthlyLetters = earthlyVal > 0 ? numberToLetters(earthlyVal) : '';

    setCalculation({
      original: pm,
      angelicVal,
      angelicName: angelicLetters ? angelicLetters + 'ائيل' : '',
      earthlyVal,
      earthlyName: earthlyLetters ? earthlyLetters + 'يوش' : 'Impossible (Valeur < 316)'
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/tools" className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <ArrowLeft className="text-gray-600 dark:text-gray-300" size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="text-amber-500" />
            Extracteur de Khouddam
          </h1>
          <p className="text-gray-500 dark:text-gray-400">{t("tools.khouddam.description")}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700 shadow-sm mb-8">
        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            Nom ou Valeur Numérique (PM)
          </label>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ex: 129 ou لطيف"
              className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-xl font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              onClick={calculateKhouddam}
              className="h-[56px] px-8 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 text-white font-bold transition-transform hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center"
            >
              Extraire
            </button>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4 sm:p-6 border border-amber-100 dark:border-amber-800/30 flex items-start gap-4">
          <AlertCircle className="text-amber-500 shrink-0 mt-1" />
          <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
            <strong>Secret Initiatique :</strong> La règle de l'Istintihaq (extraction) consiste à déduire la valeur du suffixe ("A'il" = 51 pour l'ange, "Yush" = 316 pour l'esprit terrestre) du poids total du Nom ou du verset, puis à convertir le reste en lettres (Unités, Dizaines, Centaines) qu'on assemble de droite à gauche avant d'ajouter le suffixe.
          </p>
        </div>
      </div>

      {calculation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Angelic Entity */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-bl-full"></div>
            <h3 className="text-lg font-medium text-indigo-100 mb-1">Le Khadim Angélique (Mala'ika)</h3>
            <div className="flex items-end justify-between mt-6">
              <div>
                <p className="text-indigo-200 text-sm mb-1">Calcul: {calculation.original} - 51 = {calculation.angelicVal}</p>
                <div className="text-4xl sm:text-5xl font-bold font-arabic" dir="rtl">{calculation.angelicName}</div>
              </div>
            </div>
          </div>

          {/* Earthly Entity */}
          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-bl-full"></div>
            <h3 className="text-lg font-medium text-orange-100 mb-1">L'Esprit Terrestre (Ardi)</h3>
            <div className="flex items-end justify-between mt-6">
              <div>
                <p className="text-orange-200 text-sm mb-1">Calcul: {calculation.original} - 316 = {calculation.earthlyVal}</p>
                <div className="text-4xl sm:text-5xl font-bold font-arabic" dir="rtl">{calculation.earthlyName}</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
