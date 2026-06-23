import React, { useState, useEffect } from 'react';
import { Activity, ArrowLeft, RefreshCw, Volume2, VolumeX, Settings, Target, Save, History as HistoryIcon, Plus, Trash2, Check, ChevronDown, ChevronRight, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

interface Zikr {
  id: string;
  text: string;
  arabic?: string;
  target: number;
  category: string;
  isCustom?: boolean;
}

const DEFAULT_ZIKRS: Zikr[] = [
  { id: 'subhanallah', text: 'Subhanallah', arabic: 'سُبْحَانَ ٱللَّٰهِ', target: 33, category: 'Basiques' },
  { id: 'alhamdulillah', text: 'Alhamdulillah', arabic: 'ٱلْحَمْدُ لِلَّٰهِ', target: 33, category: 'Basiques' },
  { id: 'allahuakbar', text: 'Allahu Akbar', arabic: 'ٱللَّٰهُ أَكْبَرُ', target: 34, category: 'Basiques' },
  { id: 'astaghfirullah', text: 'Astaghfirullah', arabic: 'أَسْتَغْفِرُ ٱللَّٰهَ', target: 100, category: 'Istighfar' },
  { id: 'lailahaillallah', text: 'La ilaha illallah', arabic: 'لَا إِلَٰهَ إِلَّا ٱللَّٰهُ', target: 100, category: 'Tahlil' },
  { id: 'salawat', text: 'Salawat', arabic: 'ٱللَّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ', target: 100, category: 'Salawat' },
  { id: 'hasbunallah', text: 'Hasbunallah', arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ', target: 450, category: 'Protections' },
  { id: 'ya_latif', text: 'Ya Latif', arabic: 'يَا لَطِيفُ', target: 129, category: 'Noms Divins' },
  { id: 'ya_wadud', text: 'Ya Wadud', arabic: 'يَا وَدُودُ', target: 20, category: 'Noms Divins' },
];

interface SessionHistory {
  id: string;
  zikrId: string;
  zikrText: string;
  count: number;
  target: number;
  timestamp: string;
}

export const Tasbih: React.FC = () => {
  const [customZikrs, setCustomZikrs] = useState<Zikr[]>([]);
  const [allZikrs, setAllZikrs] = useState<Zikr[]>(DEFAULT_ZIKRS);
  
  const [activeZikr, setActiveZikr] = useState<Zikr>(DEFAULT_ZIKRS[0]);
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(DEFAULT_ZIKRS[0].target);
  
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  
  const [activeTab, setActiveTab] = useState<'main' | 'settings' | 'history' | 'stats'>('main');

  const [totalLifetime, setTotalLifetime] = useState(0);
  const [dailyTotal, setDailyTotal] = useState(0);
  const [history, setHistory] = useState<SessionHistory[]>([]);

  // Custom Zikr Form
  const [newZikrName, setNewZikrName] = useState('');
  const [newZikrArabic, setNewZikrArabic] = useState('');
  const [newZikrTarget, setNewZikrTarget] = useState(100);

  useEffect(() => {
    // Load state from local storage
    try {
      const savedCustom = localStorage.getItem('tasbih_custom_zikrs');
      if (savedCustom) {
        const parsed = JSON.parse(savedCustom);
        if (Array.isArray(parsed)) {
          setCustomZikrs(parsed);
          setAllZikrs([...DEFAULT_ZIKRS, ...parsed]);
        }
      }

      const savedTotal = localStorage.getItem('tasbih_lifetime_total');
      if (savedTotal) setTotalLifetime(parseInt(savedTotal, 10));

      const savedDaily = localStorage.getItem(`tasbih_daily_${new Date().toDateString()}`);
      if (savedDaily) setDailyTotal(parseInt(savedDaily, 10));

      const savedHistory = localStorage.getItem('tasbih_history');
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed)) setHistory(parsed);
      }

      const savedSettings = localStorage.getItem('tasbih_settings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        if (parsedSettings && typeof parsedSettings === 'object') {
          const { sound, vibe, lastActiveId } = parsedSettings;
          setSoundEnabled(!!sound);
          setVibrationEnabled(vibe !== false);
          if (lastActiveId) {
            let customArr = [];
            if (savedCustom) {
              try {
                const parsed = JSON.parse(savedCustom);
                if (Array.isArray(parsed)) customArr = parsed;
              } catch (e) {}
            }
            const found = [...DEFAULT_ZIKRS, ...customArr].find(z => z.id === lastActiveId);
            if (found) {
              setActiveZikr(found);
              setTarget(found.target);
            }
          }
        }
      }
    } catch (e) {
      console.error("Tasbih initial state parsing error:", e);
    }
  }, []);

  const saveSettings = (sound: boolean, vibe: boolean, activeId: string) => {
    localStorage.setItem('tasbih_settings', JSON.stringify({ sound, vibe, lastActiveId: activeId }));
  };

  const triggerVibration = (type: 'tap' | 'success') => {
    if (!vibrationEnabled || !navigator.vibrate) return;
    if (type === 'tap') navigator.vibrate(40);
    if (type === 'success') navigator.vibrate([100, 50, 100, 50, 100]);
  };

  const playClick = () => {
    if (soundEnabled) {
      const audio = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU');
      audio.volume = 0.1;
      audio.play().catch(() => {});
    }
  };

  const saveHistorySession = () => {
    if (count > 0) {
      const newSession: SessionHistory = {
        id: Date.now().toString(),
        zikrId: activeZikr.id,
        zikrText: activeZikr.text,
        count,
        target,
        timestamp: new Date().toISOString()
      };
      const newHistory = [newSession, ...history].slice(0, 100); // Keep last 100
      setHistory(newHistory);
      localStorage.setItem('tasbih_history', JSON.stringify(newHistory));
    }
  };

  const handleIncrement = () => {
    const newCount = count + 1;
    setCount(newCount);
    
    // Update daily and lifetime
    const newLifetime = totalLifetime + 1;
    setTotalLifetime(newLifetime);
    localStorage.setItem('tasbih_lifetime_total', newLifetime.toString());

    const newDaily = dailyTotal + 1;
    setDailyTotal(newDaily);
    localStorage.setItem(`tasbih_daily_${new Date().toDateString()}`, newDaily.toString());

    if (newCount === target && target > 0) {
      triggerVibration('success');
    } else {
      triggerVibration('tap');
    }
    playClick();
  };

  const handleReset = () => {
    saveHistorySession();
    setCount(0);
    if (vibrationEnabled && navigator.vibrate) navigator.vibrate([50, 50]);
  };

  const handleZikrChange = (zikr: Zikr) => {
    saveHistorySession();
    setActiveZikr(zikr);
    setTarget(zikr.target);
    setCount(0);
    setActiveTab('main');
    saveSettings(soundEnabled, vibrationEnabled, zikr.id);
  };

  const addCustomZikr = () => {
    if (!newZikrName) return;
    const newZikr: Zikr = {
      id: `custom_${Date.now()}`,
      text: newZikrName,
      arabic: newZikrArabic,
      target: newZikrTarget,
      category: 'Personnalisés',
      isCustom: true
    };
    const updatedCustom = [...customZikrs, newZikr];
    setCustomZikrs(updatedCustom);
    setAllZikrs([...DEFAULT_ZIKRS, ...updatedCustom]);
    localStorage.setItem('tasbih_custom_zikrs', JSON.stringify(updatedCustom));
    setNewZikrName('');
    setNewZikrArabic('');
    setNewZikrTarget(100);
  };

  const removeCustomZikr = (id: string) => {
    const updatedCustom = customZikrs.filter(z => z.id !== id);
    setCustomZikrs(updatedCustom);
    setAllZikrs([...DEFAULT_ZIKRS, ...updatedCustom]);
    localStorage.setItem('tasbih_custom_zikrs', JSON.stringify(updatedCustom));
    if (activeZikr.id === id) {
      handleZikrChange(DEFAULT_ZIKRS[0]);
    }
  };

  const toggleSound = () => {
    const newSound = !soundEnabled;
    setSoundEnabled(newSound);
    saveSettings(newSound, vibrationEnabled, activeZikr.id);
  };

  const toggleVibration = () => {
    const newVibe = !vibrationEnabled;
    setVibrationEnabled(newVibe);
    saveSettings(soundEnabled, newVibe, activeZikr.id);
  };

  const progress = target > 0 ? Math.min((count / target) * 100, 100) : 0;
  
  // Group Zikrs by Category
  const categories = Array.from(new Set(allZikrs.map(z => z.category)));

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24 min-h-screen flex flex-col bg-gray-50/50 dark:bg-gray-900/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link 
            to="/tools" 
            onClick={() => saveHistorySession()}
            className="p-2 -ml-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
          >
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Activity className="text-emerald-500" />
            Tasbih
          </h1>
        </div>
        <div className="flex bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 p-1">
           <button 
             onClick={() => setActiveTab('history')}
             className={`p-2 rounded-full transition-colors ${activeTab === 'history' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
           >
             <HistoryIcon size={18} />
           </button>
           <button 
             onClick={() => setActiveTab('stats')}
             className={`p-2 rounded-full transition-colors ${activeTab === 'stats' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
           >
             <BarChart2 size={18} />
           </button>
           <button 
             onClick={() => setActiveTab(activeTab === 'settings' ? 'main' : 'settings')}
             className={`p-2 rounded-full transition-colors ${activeTab === 'settings' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
           >
             <Settings size={18} />
           </button>
        </div>
      </div>

      {activeTab === 'main' && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 flex flex-col items-center justify-center relative pb-10"
        >
          {/* Active Zikr Info */}
          <button 
            onClick={() => setActiveTab('settings')}
            className="mb-8 text-center group px-6 py-4 rounded-3xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 w-full max-w-[320px] transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {activeZikr.arabic && (
              <h2 className="text-2xl sm:text-3xl font-arabic text-emerald-800 dark:text-emerald-400 mb-3" dir="rtl">{activeZikr.arabic}</h2>
            )}
            <div className="flex items-center justify-center gap-2">
              <p className="text-gray-700 dark:text-gray-300 font-bold">{activeZikr.text}</p>
              <ChevronDown size={16} className="text-gray-400 group-hover:text-emerald-500 transition-colors" />
            </div>
            {target > 0 && <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-medium">Objectif: {target}</p>}
          </button>

          {/* Progress Ring and Counter */}
          <div className="relative w-64 h-64 sm:w-[320px] sm:h-[320px] flex items-center justify-center mb-12">
            <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-md" viewBox="0 0 100 100">
              <circle 
                cx="50" cy="50" r="46" 
                className="stroke-white dark:stroke-gray-800" 
                strokeWidth="6" 
                fill="none" 
              />
              <circle 
                cx="50" cy="50" r="46" 
                className="stroke-gray-100 dark:stroke-gray-700" 
                strokeWidth="2" 
                fill="none" 
              />
              {target > 0 && (
                <motion.circle 
                  cx="50" cy="50" r="46" 
                  className="stroke-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]" 
                  strokeWidth="6" 
                  strokeLinecap="round"
                  fill="none" 
                  strokeDasharray="289.02" // 2 * PI * 46
                  strokeDashoffset={289.02 - (289.02 * progress) / 100}
                  initial={{ strokeDashoffset: 289.02 }}
                  animate={{ strokeDashoffset: 289.02 - (289.02 * progress) / 100 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              )}
            </svg>

            <div className="flex flex-col items-center z-10">
              <span className={`text-[80px] sm:text-[100px] font-bold tracking-tighter tabular-nums leading-none ${count >= target && target > 0 ? 'text-emerald-500 dark:text-emerald-400 drop-shadow-sm' : 'text-gray-900 dark:text-white'}`}>
                {count}
              </span>
            </div>
          </div>

          <div className="w-full max-w-[320px] grid grid-cols-4 gap-4 items-end">
            <div className="flex justify-center flex-col items-center gap-2">
              <button
                onClick={handleReset}
                className="w-14 h-14 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-red-500 hover:border-red-200 dark:hover:border-red-900/50 flex items-center justify-center shadow-sm active:scale-95 transition-all"
              >
                <RefreshCw size={22} />
              </button>
            </div>
            
            <div className="flex justify-center col-span-3 h-full">
              <button
                onClick={handleIncrement}
                className="w-full h-[120px] rounded-[2rem] bg-gradient-to-b from-emerald-400 to-emerald-600 shadow-[0_10px_40px_-10px_rgba(16,185,129,0.7)] flex items-center justify-center text-white active:scale-95 active:translate-y-2 transition-all relative overflow-hidden group border-b-[6px] border-emerald-700 hover:brightness-110"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-active:opacity-20 transition-opacity"></div>
                <span className="text-2xl sm:text-3xl font-black tracking-[0.2em] uppercase relative z-10 drop-shadow-md">TAP</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'settings' && (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 flex flex-col space-y-6"
        >
          {/* Quick Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-around">
            <button 
              onClick={toggleSound}
              className={`flex flex-col items-center gap-2 p-3 w-20 rounded-2xl transition-colors ${soundEnabled ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
            >
              {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
              <span className="text-xs font-medium">Son</span>
            </button>
            <div className="w-px h-10 bg-gray-200 dark:bg-gray-700"></div>
            <button 
              onClick={toggleVibration}
              className={`flex flex-col items-center gap-2 p-3 w-20 rounded-2xl transition-colors ${vibrationEnabled ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
            >
              <Activity size={24} />
              <span className="text-xs font-medium">Vibration</span>
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">Bibliothèque de Zikrs</h3>
              <p className="text-sm text-gray-500">Sélectionnez un zikr pour commencer</p>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {categories.map(cat => (
                <div key={cat}>
                  <div className="px-5 py-2 bg-gray-50/50 dark:bg-gray-900/50 text-xs font-bold text-gray-400 uppercase tracking-wider sticky top-0 backdrop-blur-md">
                    {cat}
                  </div>
                  {allZikrs.filter(z => z.category === cat).map(z => (
                    <div 
                      key={z.id}
                      onClick={() => handleZikrChange(z)}
                     className={`flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 border-b border-gray-50 dark:border-gray-700/50 last:border-0 transition-colors ${activeZikr.id === z.id ? 'bg-emerald-50/50 dark:bg-emerald-900/10' : ''}`}
                    >
                      <div>
                        {z.arabic && <div className="font-arabic text-lg text-gray-900 dark:text-white mb-1" dir="rtl">{z.arabic}</div>}
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{z.text} {z.target > 0 && <span className="text-gray-400 text-xs ml-2">x{z.target}</span>}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        {z.isCustom && (
                          <button onClick={(e) => { e.stopPropagation(); removeCustomZikr(z.id); }} className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-white dark:hover:bg-gray-800">
                            <Trash2 size={16} />
                          </button>
                        )}
                        {activeZikr.id === z.id ? <Check className="text-emerald-500" size={20} /> : <ChevronRight className="text-gray-300 dark:text-gray-600" size={20} />}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
             <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
               <Plus size={18} className="text-emerald-500" />
               Créer un Zikr
             </h3>
             <div className="space-y-3">
               <input
                 className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                 placeholder="Nom du Zikr (ex: Hasbunallah)"
                 value={newZikrName}
                 onChange={e => setNewZikrName(e.target.value)}
               />
               <input
                 className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm font-arabic text-right text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                 placeholder="Texte en Arabe (optionnel)"
                 value={newZikrArabic}
                 onChange={e => setNewZikrArabic(e.target.value)}
                 dir="rtl"
               />
               <div className="flex gap-3">
                 <div className="flex-1">
                   <label className="block text-xs text-gray-500 mb-1 ml-1">Objectif (0 = infini)</label>
                   <input
                     type="number"
                     className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                     value={newZikrTarget}
                     onChange={e => setNewZikrTarget(parseInt(e.target.value) || 0)}
                     min={0}
                   />
                 </div>
                 <div className="flex items-end">
                   <button 
                     onClick={addCustomZikr}
                     disabled={!newZikrName}
                     className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-6 py-3 rounded-xl font-bold text-sm disabled:opacity-50 flex items-center gap-2 shadow-sm"
                   >
                     <Save size={16} /> Ajouter
                   </button>
                 </div>
               </div>
             </div>
          </div>
           
          <div className="flex justify-center pb-4">
             <button onClick={() => setActiveTab('main')} className="px-6 py-3 bg-emerald-500 text-white rounded-full font-bold shadow-sm shadow-emerald-500/30">
               Retour au compteur
             </button>
          </div>
        </motion.div>
      )}

      {activeTab === 'history' && (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 flex flex-col space-y-4"
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Historique</h2>
            {history.length > 0 && (
              <button 
                onClick={() => {
                  setHistory([]);
                  localStorage.removeItem('tasbih_history');
                }}
                className="text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
              >
                <Trash2 size={14} /> Vider
              </button>
            )}
          </div>
          
          {history.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 text-center border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <HistoryIcon size={32} className="text-gray-300 dark:text-gray-500" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">Aucune session enregistrée.</p>
              <p className="text-xs text-gray-400 mt-2">Réinitialisez le compteur pour sauvegarder une session.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map(session => (
                <div key={session.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">{session.zikrText}</h4>
                    <span className="text-xs text-gray-400 font-medium">{new Date(session.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="text-right">
                    <div className="flex items-end gap-1">
                      <span className="text-xl font-black text-emerald-500">{session.count}</span>
                      {session.target > 0 && <span className="text-xs text-gray-400 mb-1 font-bold">/ {session.target}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {activeTab === 'stats' && (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 flex flex-col space-y-6"
        >
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
             <div className="relative z-10 flex flex-col justify-center h-full">
               <span className="text-emerald-100 font-medium uppercase tracking-widest text-xs mb-2">Total aujourd'hui</span>
               <div className="text-5xl sm:text-6xl font-black tracking-tight tabular-nums drop-shadow-sm mb-4">
                 {dailyTotal.toLocaleString()}
               </div>
               <div className="h-px w-full bg-emerald-400/30 mb-4"></div>
               <div className="flex items-center justify-between">
                 <span className="text-emerald-100 font-medium text-sm">Total à vie</span>
                 <span className="font-bold text-lg">{totalLifetime.toLocaleString()}</span>
               </div>
             </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Activity size={18} className="text-emerald-500" />
              Impact Spirituel
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              "Celui qui dit 'Subhanallah wa bihamdihi' 100 fois par jour, ses péchés seront effacés même s'ils sont comme l'écume de la mer."
            </p>
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800/50">
               <div className="flex justify-between items-center mb-2">
                 <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">Progression du jour</span>
                 <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">{Math.min((dailyTotal / 500) * 100, 100).toFixed(0)}% d'objectif (500)</span>
               </div>
               <div className="h-2 bg-emerald-200 dark:bg-emerald-900 rounded-full overflow-hidden">
                 <div 
                   className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                   style={{ width: `${Math.min((dailyTotal / 500) * 100, 100)}%` }}
                 ></div>
               </div>
            </div>
          </div>
        </motion.div>
      )}

    </div>
  );
};

