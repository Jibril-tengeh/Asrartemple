import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

export const FloatingBackButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isMainPage = location.pathname === '/' || location.pathname === '/explore' || location.pathname === '/tools' || location.pathname === '/journal' || location.pathname === '/saved' || location.pathname === '/profile';

  return (
    <AnimatePresence>
      {!isMainPage && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          whileHover={{ scale: 1.1, x: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            if (window.history.state && window.history.state.idx > 0) {
              navigate(-1);
            } else {
              navigate('/'); // fallback to home
            }
          }}
          className="fixed left-4 top-1/2 -translate-y-1/2 z-[100] w-14 h-14 flex items-center justify-center bg-black/20 dark:bg-black/40 backdrop-blur-md border border-white/30 dark:border-white/20 rounded-full shadow-lg text-white transition-all hover:bg-black/30 dark:hover:bg-black/60 hover:scale-110 active:scale-95"
          aria-label="Retour"
        >
          <ArrowLeft size={28} className="text-yellow-400 drop-shadow-md animate-pulse" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
