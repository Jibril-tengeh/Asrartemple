import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Moon, Sun, Languages, User, Users, Shield, LogOut, LogIn, Bell, Store, ChevronDown, ChevronUp } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { signOut, db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const isRuqyahPlayer = location.pathname === '/tools/ruqyah';
  const [ruqyahHeaderVisible, setRuqyahHeaderVisible] = useState(false);

  useEffect(() => {
    if (!isRuqyahPlayer) {
      setRuqyahHeaderVisible(false);
    }
  }, [isRuqyahPlayer]);

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

  const secretClickCount = useRef(0);
  const secretClickTimeout = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  const handleSecretClick = () => {
    if (user?.role === 'admin') return;
    
    secretClickCount.current += 1;
    
    if (secretClickTimeout.current) {
      clearTimeout(secretClickTimeout.current);
    }
    
    if (secretClickCount.current >= 20) {
      sessionStorage.setItem('admin_bypass', 'true');
      navigate('/admin');
      secretClickCount.current = 0;
    } else {
      secretClickTimeout.current = setTimeout(() => {
        secretClickCount.current = 0;
      }, 1500);
    }
  };

  return (
    <>
      {isRuqyahPlayer && !ruqyahHeaderVisible && (
        <button
          onClick={() => setRuqyahHeaderVisible(true)}
          className="fixed top-4 right-4 z-[60] bg-emerald-600/50 dark:bg-emerald-800/50 backdrop-blur-md text-white p-2 rounded-full shadow-lg"
        >
          <ChevronDown size={24} />
        </button>
      )}

      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: isRuqyahPlayer && !ruqyahHeaderVisible ? -100 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'py-3 bg-emerald-600 dark:bg-emerald-800 shadow-lg' 
            : 'py-4 bg-emerald-600 dark:bg-emerald-800'
        } px-6`}
        onClick={handleSecretClick}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center group">
            <span className="text-xl font-extrabold text-white tracking-tight transition-all">
              AsrarHub
            </span>
          </Link>
          
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            <Link to="/community">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full hover:bg-emerald-700 dark:hover:bg-emerald-900 text-white transition-colors hidden sm:flex"
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
                  className="relative p-2 rounded-full hover:bg-emerald-700 dark:hover:bg-emerald-900 text-white transition-colors"
                  aria-label="Notifications"
                >
                  <Bell size={18} />
                  {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-emerald-600 dark:border-emerald-800"></span>
                  )}
                </motion.button>
                <AnimatePresence>
                  {notifMenuOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute -right-24 sm:right-0 mt-2 w-64 sm:w-72 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden z-50 flex flex-col"
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
                className="flex items-center space-x-1.5 p-2 rounded-full hover:bg-emerald-700 dark:hover:bg-emerald-900 text-white transition-colors"
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
              className="p-2 rounded-full hover:bg-emerald-700 dark:hover:bg-emerald-900 text-white transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </motion.button>

            {isRuqyahPlayer && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setRuqyahHeaderVisible(false);
                }}
                className="p-2 rounded-full hover:bg-emerald-700 dark:hover:bg-emerald-900 text-white transition-colors"
                aria-label="Hide header"
              >
                <ChevronUp size={18} />
              </motion.button>
            )}

            <Link to="/community" className="sm:hidden">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full hover:bg-emerald-700 dark:hover:bg-emerald-900 text-white transition-colors"
                aria-label="Community"
              >
                <Users size={18} />
              </motion.div>
            </Link>

            {(user?.role === 'admin' || ['jibriltengeh4@gmail.com', 'sbireino@gmail.com', 'tenibawwal10@gmail.com', 'jibriltengeh57@gmail.com'].includes(user?.email?.toLowerCase() || '')) && (
              <Link to="/admin">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-full hover:bg-emerald-700 dark:hover:bg-emerald-900 text-white transition-colors flex items-center justify-center"
                  aria-label="Admin Dashboard"
                >
                  <Shield size={18} />
                </motion.div>
              </Link>
            )}

            <Link to="/profile">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 rounded-full bg-emerald-500 dark:bg-emerald-600 flex items-center justify-center overflow-hidden ring-2 ring-white/20 cursor-pointer ml-1"
              >
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="text-white" size={16} />
                )}
              </motion.div>
            </Link>
          </div>
        </div>
      </motion.header>
    </>
  );
};

