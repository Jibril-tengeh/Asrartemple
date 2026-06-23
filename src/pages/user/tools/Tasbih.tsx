import React, { useState, useEffect } from 'react';
import { Activity, ArrowLeft, RefreshCw, Volume2, VolumeX, Settings, Target, Save, History, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

const ZIKRS = [
  { id: 'subhanallah', text: 'Subhanallah', arabic: 'سُبْحَانَ ٱللَّٰهِ', target: 33 },
  { id: 'alhamdulillah', text: 'Alhamdulillah', arabic: 'ٱلْحَمْدُ لِلَّٰهِ', target: 33 },
  { id: 'allahuakbar', text: 'Allahu Akbar', arabic: 'ٱللَّٰهُ أَكْبَرُ', target: 34 },
  { id: 'astaghfirullah', text: 'Astaghfirullah', arabic: 'أَسْتَغْفِرُ ٱللَّٰهَ', target: 100 },
  { id: 'lailahaillallah', text: 'La ilaha illallah', arabic: 'لَا إِلَٰهَ إِلَّا ٱللَّٰهُ', target: 100 },
  { id: 'custom', text: 'Personnalisé', arabic: '', target: 100 },
];

export const Tasbih: React.FC = () => {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(100);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeZikr, setActiveZikr] = useState(ZIKRS[0]);
  const [totalLifetime, setTotalLifetime] = useState(0);

  useEffect(() => {
    const savedTotal = localStorage.getItem('tasbih_lifetime_total');
    if (savedTotal) {
      setTotalLifetime(parseInt(savedTotal, 10));
    }
  }, []);

  const vibrate = () => {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const playClick = () => {
    if (soundEnabled) {
      const audio = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU'); // dummy short beep
      audio.volume = 0.1;
      audio.play().catch(() => {});
    }
  };

  const playSuccess = () => {
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100, 50, 100]); // Victory pattern
    }
    if (soundEnabled) {
      // Could play a different sound here
    }
  };

  const handleIncrement = () => {
    const newCount = count + 1;
    setCount(newCount);
    vibrate();
    playClick();

    const newLifetime = totalLifetime + 1;
    setTotalLifetime(newLifetime);
    localStorage.setItem('tasbih_lifetime_total', newLifetime.toString());

    if (newCount === target) {
      playSuccess();
    }
  };

  const handleReset = () => {
    setCount(0);
    if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
  };

  const handleZikrChange = (zikr: typeof ZIKRS[0]) => {
    setActiveZikr(zikr);
    setTarget(zikr.target);
    setCount(0);
    setShowSettings(false);
  };

  const progress = Math.min((count / target) * 100, 100);

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24 min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link 
            to="/tools" 
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
          >
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Activity className="text-emerald-500" />
            Tasbih Virtuel
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
          >
            {soundEnabled ? <Volume2 size={22} /> : <VolumeX size={22} />}
          </button>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-full transition-colors ${showSettings ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500'}`}
          >
            <Settings size={22} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-6 shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex-shrink-0"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Choisir un Zikr</label>
                <div className="flex flex-wrap gap-2">
                  {ZIKRS.map(z => (
                    <button
                      key={z.id}
                      onClick={() => handleZikrChange(z)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeZikr.id === z.id ? 'bg-emerald-500 text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                    >
                      {z.text}
                    </button>
                  ))}
                </div>
              </div>
              
              {activeZikr.id === 'custom' && (
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                    <Target size={16} /> Objectif personnalisé
                  </label>
                  <div className="flex gap-2">
                    {[33, 99, 100, 313, 1000].map(val => (
                      <button
                        key={val}
                        onClick={() => setTarget(val)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${target === val ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                      >
                        {val}
                      </button>
                    ))}
                    <input 
                      type="number"
                      value={target}
                      onChange={(e) => setTarget(Number(e.target.value) || 0)}
                      className="w-20 px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm text-center outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col items-center justify-center relative">
        {/* Zikr Text */}
        {activeZikr.arabic && (
          <div className="mb-8 text-center">
            <h2 className="text-4xl font-arabic text-emerald-800 dark:text-emerald-400 mb-2" dir="rtl">{activeZikr.arabic}</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium">{activeZikr.text}</p>
          </div>
        )}

        {/* Progress Ring and Counter */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center mb-12">
          {/* Progress Circle SVG */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle 
              cx="50" cy="50" r="45" 
              className="stroke-gray-100 dark:stroke-gray-800" 
              strokeWidth="4" 
              fill="none" 
            />
            <motion.circle 
              cx="50" cy="50" r="45" 
              className="stroke-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" 
              strokeWidth="4" 
              strokeLinecap="round"
              fill="none" 
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * progress) / 100}
              initial={{ strokeDashoffset: 283 }}
              animate={{ strokeDashoffset: 283 - (283 * progress) / 100 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </svg>

          {/* Count Display */}
          <div className="flex flex-col items-center z-10">
            <span className="text-gray-400 dark:text-gray-500 font-medium mb-1 tracking-wider uppercase text-xs">Compteur</span>
            <span className={`text-7xl sm:text-8xl font-bold tracking-tighter tabular-nums leading-none ${count >= target && target > 0 ? 'text-emerald-500 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}`}>
              {count}
            </span>
            <div className="h-px w-12 bg-gray-200 dark:bg-gray-700 my-4"></div>
            <span className="text-gray-400 dark:text-gray-500 font-medium tracking-wide">
              Objectif: <strong className="text-gray-700 dark:text-gray-300">{target}</strong>
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="w-full max-w-[280px] grid grid-cols-3 gap-4 items-end">
          <div className="flex justify-center">
            <button
              onClick={handleReset}
              className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-all"
            >
              <RefreshCw size={24} />
            </button>
          </div>
          
          {/* Main Tap Button */}
          <div className="flex justify-center col-span-2">
            <button
              onClick={handleIncrement}
              className="w-full h-24 rounded-3xl bg-gradient-to-b from-emerald-400 to-emerald-600 shadow-[0_8px_30px_-10px_rgba(16,185,129,0.8)] flex items-center justify-center text-white active:scale-95 active:translate-y-2 transition-all relative overflow-hidden group border-b-4 border-emerald-700"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-active:opacity-20 transition-opacity"></div>
              <span className="text-2xl font-bold tracking-widest uppercase relative z-10">TAP</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center bg-gray-50 dark:bg-gray-800/50 rounded-2xl py-3 px-4 border border-gray-100 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
        Total invocations à vie: <strong className="text-emerald-600 dark:text-emerald-400">{totalLifetime.toLocaleString()}</strong>
      </div>
    </div>
  );
};
