import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';

export const DailyRewardHandler: React.FC = () => {
  const { user } = useAuth();
  const [showReward, setShowReward] = useState(false);
  const [pointsGained, setPointsGained] = useState(0);

  useEffect(() => {
    const checkDailyReward = async () => {
      if (!user) return;
      
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      
      if (user.lastDailyRewardDate !== today) {
        try {
          const rewardPoints = 10; // 10 points daily
          const userRef = doc(db, 'users', user.uid);
          
          await updateDoc(userRef, {
            spiritualPoints: increment(rewardPoints),
            lastDailyRewardDate: today
          });
          
          setPointsGained(rewardPoints);
          setShowReward(true);
          
          // Auto-hide after 5 seconds
          setTimeout(() => {
            setShowReward(false);
          }, 5000);
          
        } catch (error) {
          console.error("Error granting daily reward:", error);
        }
      }
    };

    // Small delay to allow initial load to finish smoothly
    const timer = setTimeout(() => {
      checkDailyReward();
    }, 2000);

    return () => clearTimeout(timer);
  }, [user?.uid, user?.lastDailyRewardDate]);

  return (
    <AnimatePresence>
      {showReward && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-2xl flex items-center gap-4 text-white"
        >
          <div className="bg-white/20 p-2 rounded-full">
            <Sparkles className="text-yellow-300" size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg">Récompense Quotidienne !</h3>
            <p className="text-emerald-50 text-sm">Vous avez gagné +{pointsGained} points spirituels.</p>
          </div>
          <button 
            onClick={() => setShowReward(false)}
            className="ml-4 p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
