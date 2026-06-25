import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Moon, Sun, Languages, User, Sparkles, Users, Shield, LogOut, LogIn, Bell, Store } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { signOut, db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { AuthModal } from './AuthModal';

interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
}

export const Header: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target as Node)) {
        setNotifMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'), limit(5));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification)));
      }, (error) => {
        console.error("Header notifications onSnapshot error:", error);
      });
      return () => unsubscribe();
    }
  }, [user]);

  const changeLanguage = (lang: 'fr' | 'en' | 'ha') => {
    setLanguage(lang);
    setLangMenuOpen(false);
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`sticky top-0 z-50 transition-all duration-300 backdrop-blur-md ${
        scrolled 
          ? 'bg-white/80 dark:bg-gray-900/80 shadow-sm border-b border-gray-200 dark:border-gray-800 py-3' 
          : 'bg-white dark:bg-gray-900 border-b border-transparent py-4'
      } px-6`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center group">
          <motion.div 
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5 }}
            className="mr-2 text-emerald-600 dark:text-emerald-400"
          >
            <Sparkles size={20} />
          </motion.div>
          <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 to-emerald-500 dark:from-emerald-400 dark:to-emerald-200 tracking-tight transition-all">
            AsrarHub
          </span>
        </Link>
        
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {user?.role === 'admin' && (
            <Link to="/admin">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-emerald-600 dark:text-emerald-400 transition-colors"
                aria-label="Admin Dashboard"
              >
                <Shield size={18} />
              </motion.div>
            </Link>
          )}

          <Link to="/community">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors hidden sm:flex"
              aria-label="Community"
            >
              <Users size={18} />
            </motion.div>
          </Link>

          {user && (
            <div className="relative" ref={notifMenuRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setNotifMenuOpen(!notifMenuOpen)}
                className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
                aria-label="Notifications"
              >
                <Bell size={18} />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-gray-900"></span>
                )}
              </motion.button>
              <AnimatePresence>
                {notifMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden z-50 flex flex-col"
                  >
                    <div className="p-3 border-b border-gray-100 dark:border-gray-700 font-bold text-sm text-gray-900 dark:text-white">
                      {language === 'fr' ? 'Notifications' : language === 'ha' ? 'Sanarwa' : 'Notifications'}
                    </div>
                    {notifications.length === 0 ? (
                      <div className="p-4 text-sm text-gray-500 text-center">{language === 'fr' ? 'Aucune notification' : language === 'ha' ? 'Babu sanarwa' : 'No notifications'}</div>
                    ) : (
                      <div className="max-h-60 overflow-y-auto">
                        {notifications.map(notif => {
                          const lang = language;
                          const title = (notif as any)[`title_${lang}`] || notif.title;
                          const message = (notif as any)[`message_${lang}`] || notif.message;
                          return (
                          <div key={notif.id} className="p-3 border-b border-gray-50 dark:border-gray-750 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                            <h4 className="text-xs font-bold text-gray-900 dark:text-white">{title}</h4>
                            <p className="text-[10px] text-gray-500 mt-0.5">{new Date(notif.date).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US')}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{message}</p>
                          </div>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <div className="relative" ref={langMenuRef}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center space-x-1.5 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
              aria-label="Toggle language menu"
            >
              <Languages size={18} />
            </motion.button>
            <AnimatePresence>
              {langMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden z-50 flex flex-col"
                >
                  <button 
                    onClick={() => changeLanguage('fr')} 
                    className={`px-4 py-2 text-left text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex justify-between items-center ${language === 'fr' ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/10' : 'text-gray-700 dark:text-gray-200'}`}
                  >
                    <span>Français</span>
                    {language === 'fr' && <span className="text-emerald-500 text-xs">●</span>}
                  </button>
                  <button 
                    onClick={() => changeLanguage('en')} 
                    className={`px-4 py-2 text-left text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex justify-between items-center ${language === 'en' ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/10' : 'text-gray-700 dark:text-gray-200'}`}
                  >
                    <span>English</span>
                    {language === 'en' && <span className="text-emerald-500 text-xs">●</span>}
                  </button>
                  <button 
                    onClick={() => changeLanguage('ha')} 
                    className={`px-4 py-2 text-left text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex justify-between items-center ${language === 'ha' ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/10' : 'text-gray-700 dark:text-gray-200'}`}
                  >
                    <span>Hausa</span>
                    {language === 'ha' && <span className="text-emerald-500 text-xs">●</span>}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
            aria-label="Toggle dark mode"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </motion.button>

          <Link to="/community" className="sm:hidden">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
              aria-label="Community"
            >
              <Users size={18} />
            </motion.div>
          </Link>

          <Link to="/profile">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-100 to-emerald-50 dark:from-emerald-900 dark:to-emerald-800 flex items-center justify-center overflow-hidden ring-2 ring-emerald-500/20 cursor-pointer ml-1"
            >
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="text-emerald-600 dark:text-emerald-300" size={16} />
              )}
            </motion.div>
          </Link>

          {user ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={signOut}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
              aria-label="Sign Out"
            >
              <LogOut size={18} />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setAuthModalOpen(true)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-emerald-600 dark:text-emerald-400 transition-colors"
              aria-label="Sign In"
            >
              <LogIn size={18} />
            </motion.button>
          )}
        </div>
      </div>
      
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </motion.header>
  );
};
