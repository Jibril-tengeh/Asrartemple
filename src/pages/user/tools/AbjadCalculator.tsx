import React, { useState, useEffect } from 'react';
import { Calculator, ArrowLeft, RefreshCw, Copy, Check, ChevronDown, ChevronUp, History, Save, Trash2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

// Simplified Abjad table mapping (Standard/Eastern)
const abjadMashriqi: Record<string, number> = {
  'ا': 1, 'أ': 1, 'إ': 1, 'آ': 1, 'ء': 1,
  'ب': 2, 'ج': 3, 'د': 4, 'ه': 5, 'ة': 5,
  'و': 6, 'ؤ': 6, 'ز': 7, 'ح': 8, 'ط': 9,
  'ي': 10, 'ى': 10, 'ئ': 10, 'ك': 20, 'ل': 30,
  'م': 40, 'ن': 50, 'س': 60, 'ع': 70, 'ف': 80,
  'ص': 90, 'ق': 100, 'ر': 200, 'ش': 300, 'ت': 400,
  'ث': 500, 'خ': 600, 'ذ': 700, 'ض': 800, 'ظ': 900,
  'غ': 1000
};

// Maghribi variant
const abjadMaghribi: Record<string, number> = {
  ...abjadMashriqi,
  'س': 300, 'ش': 1000, 'ص': 60, 'ض': 90, 'ظ': 800, 'غ': 900
};

export const AbjadCalculator: React.FC = () => {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);
  const [showWords, setShowWords] = useState(false);
  const [showLetters, setShowLetters] = useState(false);
  
  const [history, setHistory] = useState<{ id: string; text: string; mashriqi: number; maghribi: number; timestamp: number }[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('abjad_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const saveToHistory = () => {
    if (!text.trim() || totalMashriqi === 0) return;
    const newItem = {
      id: Date.now().toString(),
      text: text.trim(),
      mashriqi: totalMashriqi,
      maghribi: totalMaghribi,
      timestamp: Date.now(),
    };
    const newHistory = [newItem, ...history.filter(h => h.text !== newItem.text)].slice(0, 20);
    setHistory(newHistory);
    localStorage.setItem('abjad_history', JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('abjad_history');
  };

  const calculateAbjad = (input: string) => {
    let totalMashriqi = 0;
    let totalMaghribi = 0;
    
    // For breakdown, we keep both values
    const details: { char: string; valMashriqi: number; valMaghribi: number }[] = [];
    const wordsDetails: { word: string; valMashriqi: number; valMaghribi: number }[] = [];
    
    const rawWords = input.trim().split(/\s+/).filter(w => w.length > 0);
    const words = rawWords.length;
    let letterCount = 0;
    
    for (const word of rawWords) {
      let wordMashriqi = 0;
      let wordMaghribi = 0;
      
      for (const char of word) {
        const vMash = abjadMashriqi[char] || 0;
        const vMagh = abjadMaghribi[char] || 0;
        
        wordMashriqi += vMash;
        wordMaghribi += vMagh;
        totalMashriqi += vMash;
        totalMaghribi += vMagh;
        
        if (vMash || vMagh) {
          letterCount++;
        }
        details.push({ char, valMashriqi: vMash, valMaghribi: vMagh });
      }
      wordsDetails.push({ word, valMashriqi: wordMashriqi, valMaghribi: wordMaghribi });
    }

    return { totalMashriqi, totalMaghribi, details, wordsDetails, words, letterCount };
  };

  const { totalMashriqi, totalMaghribi, details, wordsDetails, words, letterCount } = calculateAbjad(text);

  const handleCopy = (val: number) => {
    navigator.clipboard.writeText(val.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link 
            to="/tools" 
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
          >
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Calculator className="text-blue-500" />
              Abjad
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Calculateur de valeur numérique</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Input Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Entrez le texte en Arabe
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ex: بسم الله الرحمن الرحيم"
            dir="rtl"
            rows={4}
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-xl sm:text-2xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-arabic"
          />
          <div className="flex justify-between items-center mt-3">
            <div className="flex gap-4 text-xs font-medium text-gray-500 dark:text-gray-400">
              <span>Mots: <strong className="text-gray-700 dark:text-gray-300">{words}</strong></span>
              <span>Lettres: <strong className="text-gray-700 dark:text-gray-300">{letterCount}</strong></span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={saveToHistory}
                disabled={!text.trim() || totalMashriqi === 0}
                className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <Save size={14} />
                <span className="hidden sm:inline">Sauvegarder</span>
              </button>
              <button
                onClick={() => setText('')}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors flex items-center gap-1.5"
              >
                <RefreshCw size={14} />
                <span className="hidden sm:inline">Effacer</span>
              </button>
            </div>
          </div>
        </div>

        {/* Result Card */}
        <motion.div 
          className={`grid grid-cols-2 gap-3 sm:gap-4 transition-all duration-300 ${totalMashriqi > 0 ? 'opacity-100 translate-y-0' : 'opacity-50'}`}
        >
          {/* Mashriqi (Orientale) */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-4 sm:p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            <div className="relative z-10 flex flex-col items-center text-center">
              <span className="text-blue-100 text-xs sm:text-sm font-medium uppercase tracking-widest mb-2">Mashriq</span>
              <div className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-3 sm:mb-4 tabular-nums">
                {totalMashriqi}
              </div>
              {totalMashriqi > 0 && (
                <button
                  onClick={() => handleCopy(totalMashriqi)}
                  className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors text-xs sm:text-sm font-medium w-full sm:w-auto"
                >
                  {copied ? <Check size={16} className="text-emerald-300" /> : <Copy size={16} />}
                  {copied ? 'Copié' : 'Copier'}
                </button>
              )}
            </div>
          </div>

          {/* Maghribi (Occidentale) */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-4 sm:p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            <div className="relative z-10 flex flex-col items-center text-center">
              <span className="text-emerald-100 text-xs sm:text-sm font-medium uppercase tracking-widest mb-2">Maghribi</span>
              <div className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-3 sm:mb-4 tabular-nums">
                {totalMaghribi}
              </div>
              {totalMaghribi > 0 && (
                <button
                  onClick={() => handleCopy(totalMaghribi)}
                  className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors text-xs sm:text-sm font-medium w-full sm:w-auto"
                >
                  {copied ? <Check size={16} className="text-green-300" /> : <Copy size={16} />}
                  {copied ? 'Copié' : 'Copier'}
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Detailed Breakdown */}
        {details.length > 0 && (
          <div className="space-y-4 mt-8">
            {/* By Words */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
              <button 
                onClick={() => setShowWords(!showWords)}
                className="w-full flex items-center justify-between p-5 sm:p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Adad par Mots</h3>
                {showWords ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
              </button>
              
              <AnimatePresence>
                {showWords && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 sm:p-6 pt-0 flex flex-wrap gap-3 justify-end border-t border-gray-50 dark:border-gray-700/50" dir="rtl">
                      {wordsDetails.map((item, i) => (
                        <div key={i} className="flex flex-col items-center bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 min-w-[5rem] border border-gray-100 dark:border-gray-600 shadow-sm">
                          <span className="text-xl font-bold text-gray-900 dark:text-white mb-2 font-arabic">{item.word}</span>
                          <div className="flex gap-3 text-xs w-full justify-center">
                            <div className="flex flex-col items-center">
                              <span className="text-gray-400 text-[10px]">Orient.</span>
                              <span className="text-blue-600 dark:text-blue-400 font-bold">{item.valMashriqi}</span>
                            </div>
                            <div className="flex flex-col items-center">
                              <span className="text-gray-400 text-[10px]">Occid.</span>
                              <span className="text-emerald-600 dark:text-emerald-400 font-bold">{item.valMaghribi}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* By Letters */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
              <button 
                onClick={() => setShowLetters(!showLetters)}
                className="w-full flex items-center justify-between p-5 sm:p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Adad par Lettres</h3>
                {showLetters ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
              </button>
              
              <AnimatePresence>
                {showLetters && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 sm:p-6 pt-0 flex flex-wrap gap-2 justify-end border-t border-gray-50 dark:border-gray-700/50" dir="rtl">
                      {details.map((item, i) => (
                        <div key={i} className={`flex flex-col items-center rounded-lg p-2 min-w-[3.5rem] border ${!item.valMashriqi && !item.valMaghribi ? 'bg-gray-100 dark:bg-gray-800 border-transparent opacity-50' : 'bg-gray-50 dark:bg-gray-700/50 border-gray-100 dark:border-gray-600'}`}>
                          <span className="text-lg font-bold text-gray-900 dark:text-white mb-1 font-arabic">{item.char}</span>
                          <div className="flex gap-2 text-[10px] w-full justify-center">
                            <span className="text-blue-600 dark:text-blue-400 font-bold" title="Oriental">{item.valMashriqi || '-'}</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold" title="Occidental">{item.valMaghribi || '-'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Historique Toggle Button Under Cards */}
        <div className="flex justify-center mt-2">
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all border shadow-sm ${showHistory ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 hover:scale-105 active:scale-95'}`}
          >
            <History size={20} className={showHistory ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'} />
            <span>Historique des Valeurs</span>
            {showHistory ? <ChevronUp size={18} className="text-gray-400 ml-2" /> : <ChevronDown size={18} className="text-gray-400 ml-2" />}
          </button>
        </div>

        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm mt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <History size={18} className="text-blue-500" /> Historique
                  </h3>
                  {history.length > 0 && (
                    <button onClick={clearHistory} className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1">
                      <Trash2 size={14} /> Effacer
                    </button>
                  )}
                </div>
                
                {history.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 pb-2 text-center py-4">Aucun historique pour le moment.</p>
                ) : (
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                    {history.map(item => (
                      <div key={item.id} className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 flex flex-col gap-3">
                        <div className="text-right font-arabic text-xl font-medium text-gray-900 dark:text-white" dir="rtl">{item.text}</div>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-3">
                          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{new Date(item.timestamp).toLocaleString()}</span>
                          <div className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <span className="text-[10px] text-gray-400 uppercase tracking-wider">Mashriq</span>
                              <span className="text-blue-600 dark:text-blue-400 font-bold text-sm sm:text-base">{item.mashriqi}</span>
                            </div>
                            <div className="w-px bg-gray-200 dark:bg-gray-700"></div>
                            <div className="flex flex-col items-center">
                              <span className="text-[10px] text-gray-400 uppercase tracking-wider">Maghribi</span>
                              <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm sm:text-base">{item.maghribi}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
