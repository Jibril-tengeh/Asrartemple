import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { Settings, ShieldAlert } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { useLocation, Navigate } from 'react-router-dom';

export const MaintenanceOverlay: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'features'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setIsMaintenance(data?.globalMaintenanceMode === true);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error reading maintenance mode", error);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      </div>
    );
  }

  const isAdmin = user?.role === 'admin' || user?.email === 'sbireino@gmail.com';

  // Always allow admin to pass through
  if (isAdmin) {
    return <>{children}</>;
  }

  // If maintenance mode is active, block everything
  if (isMaintenance) {
    return (
      <div className="fixed inset-0 z-[100] bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-gray-700"
        >
          <div className="w-24 h-24 bg-amber-100 dark:bg-amber-900/30 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Settings size={48} className="animate-spin-slow" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Maintenance en cours</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            AsrarHub est actuellement en cours de maintenance pour améliorer votre expérience. Nous serons de retour très bientôt. Merci de votre patience.
          </p>
          <div className="inline-flex items-center gap-2 text-sm font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-xl">
            <ShieldAlert size={18} />
            Accès temporairement suspendu
          </div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
};
