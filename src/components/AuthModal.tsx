import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { X, Mail, Lock, User as UserIcon, AlertCircle } from 'lucide-react';
import { signInWithGoogle, signInWithEmail, signUpWithEmail, sendVerificationEmail, auth, db } from '../lib/firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signInWithEmail(email, password);
      if (result?.user) {
        const userRef = doc(db, 'users', result.user.uid);
        const docSnap = await getDoc(userRef);
        
        let isUserAdmin = false;
        if (docSnap.exists() && docSnap.data().role === 'admin') {
          isUserAdmin = true;
        } else if (result.user.email === 'jibriltengeh4@gmail.com') {
          // Auto-promote the specified email to admin if not already
          if (docSnap.exists()) {
             await updateDoc(userRef, { role: 'admin' });
          } else {
             await setDoc(userRef, { email: result.user.email, role: 'admin', createdAt: new Date() });
          }
          isUserAdmin = true;
        }
        
        if (isUserAdmin) {
          onClose();
          navigate('/admin');
        } else {
          await auth.signOut();
          setError("Accès refusé. Vous n'êtes pas administrateur.");
          setLoading(false);
        }
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setError('Email ou mot de passe incorrect.');
      } else {
        setError(err.message || 'Une erreur est survenue.');
      }
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await signInWithGoogle();
      onClose();
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la connexion avec Google.');
      setLoading(false);
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md overflow-y-auto max-h-[calc(100dvh-2rem)] sm:max-h-[85vh] relative border border-gray-100 dark:border-gray-800"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors z-10"
            >
              <X size={20} />
            </button>

            <div className="p-6 sm:p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Administration
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Connectez-vous pour accéder à l'interface d'administration.
                </p>
              </div>

              {verificationSent ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('auth.verifyEmailTitle', 'Vérifiez votre email')}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                    {t('auth.verifyEmailDesc', 'Nous avons envoyé un lien de vérification à')} <span className="font-semibold">{email}</span>. {t('auth.verifyEmailAction', 'Veuillez cliquer sur ce lien pour activer votre compte.')}
                  </p>
                  <button
                    onClick={() => {
                      setVerificationSent(false);
                      setIsLogin(true);
                    }}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors"
                  >
                    {t('auth.backToLogin', 'Retour à la connexion')}
                  </button>
                </div>
              ) : (
                <>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-xl flex items-start gap-2">
                        <AlertCircle size={16} className="mt-0.5 shrink-0" />
                        <p>{error}</p>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('auth.email', 'Email')}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <Mail size={18} />
                        </div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                          placeholder="votre@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('auth.password', 'Mot de passe')}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <Lock size={18} />
                        </div>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          minLength={6}
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-medium transition-colors mt-2"
                    >
                      {loading ? t('auth.loading', 'Chargement...') : t('auth.login', 'Se connecter')}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
