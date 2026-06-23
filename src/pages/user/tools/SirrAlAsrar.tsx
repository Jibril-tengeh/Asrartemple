import React, { useState } from 'react';
import { Eye, ArrowLeft, RefreshCw, Key, Flame, Wind, Droplets, Mountain, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export const SirrAlAsrar: React.FC = () => {
  const [name, setName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isCalculated, setIsCalculated] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const calculateSirr = () => {
    if (!name || !motherName) return;
    
    // Gamification
    const stats = JSON.parse(localStorage.getItem('asrar_stats') || '{}');
    stats.tools_used = (stats.tools_used || 0) + 1;
    localStorage.setItem('asrar_stats', JSON.stringify(stats));

    setIsProcessing(true);
    
    setTimeout(() => {
      // Simplification for the simulation
      let s1 = 0, s2 = 0;
      for(let i = 0; i < name.length; i++) s1 += name.charCodeAt(i);
      for(let i = 0; i < motherName.length; i++) s2 += motherName.charCodeAt(i);
      
      const total = s1 + s2;
      
      // Tabai' (Elements)
      const elements = [
        { name: "Eau (Ma')", icon: Droplets, color: "text-blue-500", desc: "Froide et humide. Réceptivité, secrets cachés." },
        { name: "Feu (Nar)", icon: Flame, color: "text-red-500", desc: "Chaud et sec. Domination, rapidité, autorité." },
        { name: "Terre (Turab)", icon: Mountain, color: "text-amber-700", desc: "Froide et sèche. Stabilité, richesse, patience." },
        { name: "Air (Hawa)", icon: Wind, color: "text-emerald-500", desc: "Chaud et humide. Mouvement, communication, voyages." }
      ];
      const element = elements[total % 4];

      // Kawakib (Planets) & Ayyam (Days)
      const planets = [
        { p: "Zuhal (Saturne)", d: "Samedi", b: "Myrrhe, Storax" },
        { p: "Shams (Soleil)", d: "Dimanche", b: "Oliban, Mastic" },
        { p: "Qamar (Lune)", d: "Lundi", b: "Camphre, Santal blanc" },
        { p: "Mirrikh (Mars)", d: "Mardi", b: "Poivre rouge, Ail, Sang de dragon" },
        { p: "Utarid (Mercure)", d: "Mercredi", b: "Mastic, Clou de girofle" },
        { p: "Mushtari (Jupiter)", d: "Jeudi", b: "Oud, Santal rouge" },
        { p: "Zuhara (Vénus)", d: "Vendredi", b: "Rose, Bois d'aloès, Musc" }
      ];
      const planetInfo = planets[total % 7];

      // Deriving Khuddam Names
      const prefixes = ["Taf", "Qaj", "Sham", "Ghal", "Zan", "Kam", "Saq"];
      const baseRoot = prefixes[total % prefixes.length];
      
      const angel = baseRoot + "a'il (عزرائيل / ملائكة)";
      const servant = baseRoot + "tayush (خدام سفلي/أرضي)";

      // Secret code
      const secretCode = `٣${total % 9}٧${(total * 2) % 9}١`;

      setResult({
        total,
        element,
        planetInfo,
        angel,
        servant,
        secretCode
      });
      setIsProcessing(false);
      setIsCalculated(true);
    }, 2000); // 2 seconds of deep thinking
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
            <Eye className="text-violet-600" />
            Sirr Al-Asrar (Le Secret des Secrets)
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Analyse ésotérique absolue & extraction des entités</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!isCalculated ? (
          <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
            <div className="bg-violet-900/10 border border-violet-800/30 rounded-3xl p-6 mb-8 mt-4 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/20 rounded-full blur-3xl"></div>
              <p className="text-sm text-violet-800 dark:text-violet-200 font-medium leading-relaxed z-10 relative">
                Attention : Ce module est l'un des plus profonds de la science du <i>Jafr</i> et du <i>Ruhaniyat</i>. 
                Il extrait l'identité de l'ange divin et de l'esprit servant rattachés directement à votre essence (Nom + Nom de la Mère).
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
              {isProcessing && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                  className="absolute inset-0 z-20 bg-gray-900/40 backdrop-blur-sm flex flex-col items-center justify-center text-white"
                >
                  <motion.div animate={{ rotate: 360, scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} className="mb-4">
                    <Eye size={48} className="text-violet-400" />
                  </motion.div>
                  <p className="tracking-[0.3em] uppercase text-xs font-bold text-violet-300 animate-pulse">Extraction de l'essence...</p>
                </motion.div>
              )}

              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Votre Prénom</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Ahmad"
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 font-medium transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Prénom de la Mère</label>
                  <input
                    type="text"
                    value={motherName}
                    onChange={(e) => setMotherName(e.target.value)}
                    placeholder="Obligatoire dans la tradition (Ex: Fatima)"
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 font-medium transition-all"
                  />
                </div>
              </div>

              <button
                onClick={calculateSirr}
                disabled={!name || !motherName || isProcessing}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-700 to-purple-900 text-white font-bold disabled:opacity-50 hover:shadow-[0_0_30px_rgba(109,40,217,0.5)] transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
              >
                <Key size={18} /> Extraire le Code Spirituel
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", bounce: 0.4 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Element et Planète */}
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-6 border-b border-gray-100 dark:border-gray-700 pb-3">Profil Cosmique</h3>
                
                <div className="mb-6 flex items-start gap-4">
                  <div className={`p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 ${result.element.color} shadow-inner`}>
                    <result.element.icon size={32} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-lg">{result.element.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                      {result.element.desc}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 flex justify-between items-center transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
                    <span className="text-sm text-gray-500">Astre Dominant</span>
                    <span className="font-bold text-gray-900 dark:text-white">{result.planetInfo.p}</span>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 flex justify-between items-center transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
                    <span className="text-sm text-gray-500">Jour de Pouvoir</span>
                    <span className="font-bold text-gray-900 dark:text-white">{result.planetInfo.d}</span>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 flex flex-col gap-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
                    <span className="text-xs text-gray-500 uppercase tracking-widest">Encens (Bakhur) d'invocation</span>
                    <span className="font-bold text-gray-900 dark:text-white">{result.planetInfo.b}</span>
                  </div>
                </div>
              </motion.div>

              {/* Entités et Codes */}
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="bg-gray-900 rounded-3xl p-6 shadow-2xl border border-gray-800 relative overflow-hidden">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} 
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} 
                  className="absolute -top-24 -right-24 w-64 h-64 bg-violet-600 rounded-full blur-[100px]"
                ></motion.div>
                
                <h3 className="text-xs uppercase tracking-widest text-violet-400 font-bold mb-6 border-b border-gray-800 pb-3 relative z-10 flex items-center gap-2">
                  <Sparkles size={14} /> Archanges & Khuddam
                </h3>
                
                <div className="space-y-6 relative z-10">
                  <div className="flex flex-col items-center justify-center p-4">
                    <span className="text-xs text-gray-500 uppercase tracking-widest block mb-2">Poids Mystique (Adad)</span>
                    <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 drop-shadow-[0_0_15px_rgba(167,139,250,0.5)]">
                      {result.total}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-r from-gray-800 to-gray-800/40 rounded-2xl p-5 border border-gray-700/50 relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.8)]"></div>
                      <span className="text-xs text-violet-300 block mb-1 uppercase tracking-widest">Ange de Lumière (Ulwi)</span>
                      <span className="font-bold text-2xl text-white font-arabic tracking-wide drop-shadow-md">{result.angel}</span>
                    </motion.div>
                    
                    <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-r from-gray-800 to-gray-800/40 rounded-2xl p-5 border border-gray-700/50 relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
                      <span className="text-xs text-red-300 block mb-1 uppercase tracking-widest">Serviteur Terrestre (Sufli)</span>
                      <span className="font-bold text-2xl text-white font-arabic tracking-wide drop-shadow-md">{result.servant}</span>
                    </motion.div>
                  </div>

                  <div className="pt-6 mt-4 border-t border-gray-800 text-center">
                    <span className="text-xs text-gray-500 uppercase tracking-widest block mb-3">Sceau Numérique Secret</span>
                    <span className="text-2xl font-mono text-gray-300 tracking-[0.5em] bg-black/50 px-4 py-2 rounded-xl">{result.secretCode}</span>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              onClick={() => setIsCalculated(false)}
              className="mt-8 w-full py-4 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <RefreshCw size={18} /> Recommencer l'Analyse
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
