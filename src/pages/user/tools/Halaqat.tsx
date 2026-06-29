import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, Target, Activity, ChevronLeft, Hand, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../../lib/firebase';
import { doc, onSnapshot, updateDoc, increment } from 'firebase/firestore';

export const Halaqat = () => {
  const navigate = useNavigate();
  const [globalCount, setGlobalCount] = useState(0);
  const [targetCount, setTargetCount] = useState(1000000);
  const [sessionCount, setSessionCount] = useState(0);

  useEffect(() => {
    // Listen to the global Halaqa document
    const halaqaRef = doc(db, 'halaqat', 'global_salawat');
    const unsubscribe = onSnapshot(halaqaRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setGlobalCount(data.count || 0);
        if (data.target) setTargetCount(data.target);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleTasbihClick = async () => {
    setSessionCount(prev => prev + 1);
    const halaqaRef = doc(db, 'halaqat', 'global_salawat');
    try {
      await updateDoc(halaqaRef, {
        count: increment(1)
      });
    } catch (e) {
      console.error("Error updating halaqat count", e);
    }
  };

  const progress = Math.min((globalCount / targetCount) * 100, 100);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <button 
        onClick={() => navigate('/tools')}
        className="flex items-center text-emerald-600 hover:text-emerald-700 mb-6 transition-colors"
      >
        <ChevronLeft size={20} className="mr-1" />
        Retour aux outils
      </button>

      <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-3xl p-8 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Users size={120} />
        </div>
        <h1 className="text-3xl font-bold mb-4 relative z-10">Halaqat Virtuelles</h1>
        <p className="text-emerald-50 max-w-2xl text-lg relative z-10">
          Rejoignez la communauté en temps réel pour accomplir nos objectifs de Dhikr communs. Chaque invocation compte.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="col-span-1 md:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-emerald-100 dark:border-emerald-900/30 flex flex-col items-center justify-center">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Objectif : 1 Million de Salawat</h2>
            <p className="text-gray-500 dark:text-gray-400">Allāhumma ṣalli ʿalā Muḥammad</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleTasbihClick}
            className="w-48 h-48 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 shadow-xl shadow-emerald-500/20 flex flex-col items-center justify-center text-white relative group mb-8"
          >
            <div className="absolute inset-0 rounded-full border-4 border-white/20 scale-110 group-active:scale-100 transition-transform"></div>
            <Hand size={48} className="mb-4 opacity-80" />
            <span className="text-3xl font-black">+{sessionCount}</span>
            <span className="text-sm font-medium opacity-80 mt-1">Votre Session</span>
          </motion.button>

          <div className="w-full max-w-md">
            <div className="flex justify-between text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              <span>{globalCount.toLocaleString()}</span>
              <span>{targetCount.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-4 overflow-hidden shadow-inner">
              <motion.div 
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-center text-xs text-gray-500 mt-2 font-medium">{progress.toFixed(2)}% de l'objectif atteint</p>
          </div>
        </div>

        <div className="col-span-1 flex flex-col gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-emerald-100 dark:border-emerald-900/30">
            <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 mb-4">
              <Target size={24} />
              <h3 className="font-bold text-gray-900 dark:text-white">Le But</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Les Halaqat (cercles) sont des assemblées où les croyants se réunissent pour le Dhikr. Notre outil virtuel permet d'unir nos voix à travers le monde.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-emerald-100 dark:border-emerald-900/30">
            <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 mb-4">
              <Activity size={24} />
              <h3 className="font-bold text-gray-900 dark:text-white">Direct (Live)</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Le compteur global se met à jour instantanément lorsque d'autres frères et soeurs participent avec vous.
            </p>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-sm flex flex-col items-center justify-center text-center">
             <Award size={40} className="mb-3 opacity-90" />
             <h3 className="font-bold mb-1">Baraka Collective</h3>
             <p className="text-sm opacity-90">Participez à la bénédiction communautaire.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
