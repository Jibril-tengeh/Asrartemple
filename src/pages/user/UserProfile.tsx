import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { User, Bell, Clock, Save, Shield, Moon, Sun, Smartphone, Award, Medal, Star, Target, LogOut, Camera, Image as ImageIcon, RefreshCw, Sparkles, LogIn } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { PremiumBadge } from '../../components/PremiumBadge';
import { AuthModal } from '../../components/AuthModal';
import { signOut, db, auth } from '../../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

interface Reminder {
  id: string;
  time: string;
  enabled: boolean;
  label: string;
}

const GamificationBadges = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState({ journal_entries: 0 });

  useEffect(() => {
    const savedStats = localStorage.getItem('asrar_stats');
    if (savedStats) {
      try {
        const parsed = JSON.parse(savedStats);
        if (parsed && typeof parsed === 'object') {
          setStats(parsed);
        }
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const badges = [
    {
      id: 'initie',
      name: t('profile.badges.initie.name', 'Initié'),
      description: t('profile.badges.initie.desc', 'A ouvert le journal spirituel (1 entrée)'),
      icon: Award,
      color: 'text-bronze-500',
      bg: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600',
      earned: stats.journal_entries >= 1
    },
    {
      id: 'regulier',
      name: t('profile.badges.regulier.name', 'Régulier'),
      description: t('profile.badges.regulier.desc', 'Maintient la discipline (7 entrées)'),
      icon: Medal,
      color: 'text-slate-400',
      bg: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
      earned: stats.journal_entries >= 7
    },
    {
      id: 'devoue',
      name: t('profile.badges.devoue.name', 'Dévoué'),
      description: t('profile.badges.devoue.desc', 'Lumière constante (30 entrées)'),
      icon: Star,
      color: 'text-amber-500',
      bg: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
      earned: stats.journal_entries >= 30
    },
    {
      id: 'savant',
      name: t('profile.badges.chercheur.name', 'Chercheur'),
      description: t('profile.badges.chercheur.desc', 'Explore les Asrar (Utilisé 5 outils)'),
      icon: Target,
      color: 'text-purple-500',
      bg: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      earned: (stats.tools_used || 0) >= 5
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
        <Award className="text-amber-500" size={20} />
        {t('profile.badges.title', 'Badges & Accomplissements')}
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">
        {t('profile.badges.subtitle', 'Vos actes constants forgent votre lumière. Ces badges reflètent votre régularité et discipline.')}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {badges.map(badge => (
          <div 
            key={badge.id}
            className={`flex flex-col items-center text-center gap-2 p-4 rounded-2xl border-2 transition-all ${
              badge.earned 
                ? `border-${badge.bg.split(' ')[0].replace('bg-', '')} ${badge.bg}` 
                : 'border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 grayscale opacity-60'
            }`}
          >
            <badge.icon size={28} className={badge.earned ? "" : "text-gray-400"} />
            <div>
              <span className={`block font-bold text-sm ${badge.earned ? '' : 'text-gray-500'}`}>{badge.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const UserProfile: React.FC = () => {
  const { t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [newTime, setNewTime] = useState('06:00');
  const [newLabel, setNewLabel] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('asrar_reminders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setReminders(parsed);
        }
      } catch (e) {}
    } else {
      setReminders([
        { id: '1', time: '05:30', enabled: true, label: t('profile.reminders.morning', 'Wird du Matin') },
        { id: '2', time: '18:00', enabled: true, label: t('profile.reminders.evening', 'Wird du Soir') }
      ]);
    }
  }, []);

  useEffect(() => {
    if (reminders.length > 0) {
      localStorage.setItem('asrar_reminders', JSON.stringify(reminders));
    }
  }, [reminders]);

  const addReminder = () => {
    if (!newTime || !newLabel) return;
    const newRem: Reminder = {
      id: Date.now().toString(),
      time: newTime,
      enabled: true,
      label: newLabel
    };
    setReminders([...reminders, newRem]);
    setNewLabel('');
  };

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const removeReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  const requestNotificationPermission = async () => {
    try {
      if ('Notification' in window && window.Notification) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          new Notification('AsrarHub', { body: t('profile.reminders.pushSuccess', 'Notifications activées avec succès!') });
        }
      }
    } catch (e) {
      console.error("Notification permission error", e);
      alert(t('profile.reminders.pushError', 'Les notifications ne sont pas supportées ou ont été bloquées.'));
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [localPhoto, setLocalPhoto] = useState<string | null>(null);
  const [localCover, setLocalCover] = useState<string | null>(null);

  const resizeImage = (file: File, maxWidth: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          if (height > maxWidth) {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            // Fill with white background to prevent transparent pngs from turning black
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.7));
          } else {
            reject(new Error('Failed to get canvas context'));
          }
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'cover') => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      setUploading(true);
      
      // Set local preview immediately
      const objectUrl = URL.createObjectURL(file);
      if (type === 'profile') setLocalPhoto(objectUrl);
      else setLocalCover(objectUrl);

      // We will just use base64 and save it to firestore directly since it's resized and compressed
      const base64Image = await resizeImage(file, type === 'profile' ? 256 : 800);

      
      const userRef = doc(db, 'users', user.uid);
      
      if (type === 'profile') {
        await setDoc(userRef, { photoURL: base64Image }, { merge: true });
      } else {
        await setDoc(userRef, { coverPhotoURL: base64Image }, { merge: true });
      }
      
      // Reset input so the same file can be selected again
      event.target.value = '';
      
    } catch (error: any) {
      console.error('Error uploading image', error);
      alert(t('profile.uploadError', "Erreur lors de l'enregistrement de l'image: ") + (error.message || ''));
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24 border-none">
      
      {/* Profil Header with Cover */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 mb-8 relative">
        {/* Cover Photo */}
        <div className="h-32 sm:h-48 bg-emerald-100 dark:bg-emerald-900/30 relative group">
          {(localCover || user?.coverPhotoURL) ? (
            <img src={localCover || user?.coverPhotoURL || ''} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center opacity-30">
              <ImageIcon size={48} className="text-emerald-500" />
            </div>
          )}
          {user && (
            <button 
              onClick={() => coverInputRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-3 right-3 bg-white/90 dark:bg-gray-900/90 p-2 rounded-full shadow-sm text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-800 transition-colors opacity-100 disabled:opacity-50"
            >
              {uploading ? <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-700 rounded-full animate-spin"></div> : <Camera size={18} />}
            </button>
          )}
        </div>

        {/* Profile Info */}
        <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row items-center sm:items-start sm:justify-between">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-12 sm:-mt-16 mb-4 sm:mb-0 relative z-10">
            <div className="relative group">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white dark:bg-gray-800 p-1.5 shadow-sm">
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-emerald-100 to-emerald-50 dark:from-emerald-900 dark:to-emerald-800 flex items-center justify-center overflow-hidden">
                  {(localPhoto || user?.photoURL) ? (
                    <img src={localPhoto || user?.photoURL || ''} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="text-emerald-600 dark:text-emerald-300" size={40} />
                  )}
                </div>
              </div>
              {user && (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute bottom-2 right-2 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md text-gray-700 dark:text-gray-200 border border-gray-100 dark:border-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  {uploading ? <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-700 rounded-full animate-spin"></div> : <Camera size={16} />}
                </button>
              )}
            </div>
            
            <div className="text-center sm:text-left mb-2 sm:mb-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center sm:justify-start gap-2">
                {user?.name || t('profile.defaultName', 'Profil & Préférences')}
                <PremiumBadge />
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {user?.email || t('profile.defaultEmail', 'Gérez vos paramètres et rappels spirituels')}
              </p>
              {user && (
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                  <div className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1.5 border border-emerald-100 dark:border-emerald-800">
                    <Sparkles size={14} />
                    <span>{user?.spiritualPoints || 0} pts</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {user ? (
            <button 
              onClick={handleLogout}
              className="mt-4 sm:mt-6 flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-xl transition-colors text-sm font-medium"
            >
              <LogOut size={18} />
              <span>{t('profile.logout', 'Déconnexion')}</span>
            </button>
          ) : (
            <button 
              onClick={() => setShowAuthModal(true)}
              className="mt-4 sm:mt-6 flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors text-sm font-medium"
            >
              <LogIn size={18} />
              <span>{t('profile.login', 'Se connecter')}</span>
            </button>
          )}
        </div>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={(e) => handleImageUpload(e, 'profile')} 
        accept="image/*" 
        className="hidden" 
      />
      <input 
        type="file" 
        ref={coverInputRef} 
        onChange={(e) => handleImageUpload(e, 'cover')} 
        accept="image/*" 
        className="hidden" 
      />

      <GamificationBadges />

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Bell className="text-emerald-500" size={20} />
            {t('profile.reminders.title', 'Rappels Quotidiens')}
          </h2>
          <button 
            onClick={requestNotificationPermission}
            className="text-xs bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-lg font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
          >
            {t('profile.reminders.enablePush', 'Activer les notifications push')}
          </button>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">
          {t('profile.reminders.subtitle', "Configurez des rappels pour vos heures de lecture (Wirds, Zikrs). L'application vous enverra une notification à l'heure souhaitée.")}
        </p>

        <div className="space-y-3 mb-6">
          {reminders.map(rem => (
            <div key={rem.id} className="flex flex-col sm:flex-row sm:items-center justify-between border border-gray-100 dark:border-gray-700 rounded-2xl p-4 bg-gray-50 dark:bg-gray-800/50 gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className={`p-2 rounded-xl flex-shrink-0 ${rem.enabled ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400' : 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500'}`}>
                  <Clock size={20} />
                </div>
                <div>
                  <h3 className={`font-bold ${rem.enabled ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>{rem.time}</h3>
                  <p className={`text-sm ${rem.enabled ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400 dark:text-gray-600'}`}>{rem.label}</p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                <button 
                  onClick={() => removeReminder(rem.id)}
                  className="text-sm text-red-500 hover:text-red-600 font-medium px-2"
                >
                  {t('common.delete', 'Supprimer')}
                </button>
                <div 
                  onClick={() => toggleReminder(rem.id)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${rem.enabled ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                  <motion.div 
                    className="w-4 h-4 bg-white rounded-full shadow-sm"
                    animate={{ x: rem.enabled ? 24 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-emerald-50/50 dark:bg-emerald-900/10 rounded-2xl p-4 border border-emerald-100 dark:border-emerald-800/30">
          <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">{t('profile.reminders.addTitle', 'Ajouter un rappel')}</h4>
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="time" 
              value={newTime}
              onChange={e => setNewTime(e.target.value)}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:text-white"
            />
            <input 
              type="text" 
              placeholder={t('profile.reminders.placeholder', 'Ex: Wird du matin')}
              value={newLabel}
              onChange={e => setNewLabel(e.target.value)}
              className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:text-white"
            />
            <button 
              onClick={addReminder}
              disabled={!newLabel}
              className="bg-emerald-600 text-white rounded-xl px-4 py-2 text-sm font-bold disabled:opacity-50 hover:bg-emerald-700 transition-colors whitespace-nowrap shadow-sm"
            >
              {t('common.add', 'Ajouter')}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Moon className="text-emerald-500" size={20} />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t('profile.theme.title', 'Apparence & Thème')}</h2>
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">
          {t('profile.theme.subtitle', "Personnalisez l'apparence de l'application. Le mode automatique synchronise l'affichage avec votre système pour un confort optimal jour et nuit.")}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => setTheme('light')}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${theme === 'light' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-gray-200 dark:hover:border-gray-600'}`}
          >
            <Sun size={24} className={theme === 'light' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'} />
            <span className={`font-medium text-sm ${theme === 'light' ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-700 dark:text-gray-300'}`}>{t('profile.theme.light', 'Clair')}</span>
          </button>
          
          <button
            onClick={() => setTheme('dark')}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${theme === 'dark' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-gray-200 dark:hover:border-gray-600'}`}
          >
            <Moon size={24} className={theme === 'dark' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'} />
            <span className={`font-medium text-sm ${theme === 'dark' ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-700 dark:text-gray-300'}`}>{t('profile.theme.dark', 'Sombre')}</span>
          </button>

          <button
            onClick={() => setTheme('system')}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${theme === 'system' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-gray-200 dark:hover:border-gray-600'}`}
          >
            <Smartphone size={24} className={theme === 'system' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'} />
            <span className={`font-medium text-sm ${theme === 'system' ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-700 dark:text-gray-300'}`}>{t('profile.theme.auto', 'Automatique')}</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="text-emerald-500" size={20} />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Abonnement & Achats</h2>
        </div>
        
        {user?.subscriptionTier === 'premium' || user?.subscriptionTier === 'pro' ? (
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border border-gray-100 dark:border-gray-700 rounded-2xl p-4 bg-gray-50 dark:bg-gray-800/50 gap-4 mb-4">
              <div className="flex flex-col">
                <h3 className="font-bold text-gray-900 dark:text-white">Désactiver les publicités</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Masquer les bannières promotionnelles dans l'application</p>
              </div>
              <div 
                onClick={async () => {
                  try {
                    const userRef = doc(db, 'users', user.uid);
                    await setDoc(userRef, { hideAds: !user?.hideAds }, { merge: true });
                  } catch (e) {
                    console.error('Error toggling ads', e);
                  }
                }}
                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${user?.hideAds ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <motion.div 
                  className="w-4 h-4 bg-white rounded-full shadow-sm"
                  animate={{ x: user?.hideAds ? 24 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
            Passez à la version Premium pour débloquer toutes les fonctionnalités et supprimer les publicités.
          </p>
        )}

        <div>
          <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Save className="text-gray-400" size={18} />
            Historique d'achats
          </h3>
          {user?.purchasedItems && user.purchasedItems.length > 0 ? (
            <div className="space-y-3">
              {user.purchasedItems.map((item, idx) => (
                <div key={idx} className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{item}</span>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-full">Acheté</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">Aucun achat pour le moment.</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <RefreshCw className="text-emerald-500" size={20} />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Maintenance</h2>
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">
          Vider le cache peut résoudre les problèmes de lecture audio ou libérer de l'espace sur votre appareil.
        </p>

        <button
          onClick={async () => {
            if ('serviceWorker' in navigator) {
              const registrations = await navigator.serviceWorker.getRegistrations();
              for (const registration of registrations) {
                await registration.unregister();
              }
            }
            if ('caches' in window) {
              const keys = await caches.keys();
              for (const key of keys) {
                await caches.delete(key);
              }
            }
            localStorage.removeItem('quran_downloaded_items');
            localStorage.removeItem('quran_paused_downloads');
            alert('Cache vidé avec succès. La page va se recharger.');
            window.location.reload();
          }}
          className="flex items-center justify-center gap-2 w-full sm:w-auto bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400 rounded-xl px-5 py-3 font-bold transition-colors"
        >
          <RefreshCw size={18} />
          Vider le cache
        </button>
      </div>
      
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};
