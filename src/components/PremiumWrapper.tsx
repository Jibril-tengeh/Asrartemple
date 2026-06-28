import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Sparkles, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PremiumWrapperProps {
  children: React.ReactNode;
  requiredTier?: 'premium' | 'pro';
  fallbackMessage?: string;
  fallbackTitle?: string;
  previewContent?: React.ReactNode;
}

export const PremiumWrapper: React.FC<PremiumWrapperProps> = ({ 
  children, 
  requiredTier = 'premium',
  fallbackTitle = 'Contenu Premium',
  fallbackMessage = 'Ce contenu est réservé aux membres Premium. Débloquez-le pour y accéder.',
  previewContent
}) => {
  const { user } = useAuth();
  const [showPreview, setShowPreview] = useState(false);
  
  const isPremium = user?.subscriptionTier === 'premium' || user?.subscriptionTier === 'pro';
  const isPro = user?.subscriptionTier === 'pro';

  const hasAccess = requiredTier === 'pro' ? isPro : isPremium;

  if (!hasAccess) {
    if (showPreview && previewContent) {
      return (
        <div className="relative">
          <div className="pointer-events-none select-none blur-md opacity-60">
            {previewContent}
          </div>
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center">
             <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-full flex items-center justify-center shadow-lg mb-6 shadow-violet-500/30">
                <Lock size={32} className="text-white" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">{fallbackTitle}</h2>
              <p className="text-gray-900 dark:text-gray-100 mb-6 font-medium max-w-sm drop-shadow-md">Abonnez-vous pour voir l'intégralité du contenu.</p>
              <Link 
                to="/store" 
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold hover:from-amber-500 hover:to-orange-600 transition-colors shadow-xl flex items-center gap-2"
              >
                <Sparkles size={18} /> Débloquer {requiredTier === 'pro' ? 'Pro' : 'Premium'}
              </Link>
              <button 
                onClick={() => setShowPreview(false)}
                className="mt-4 text-sm font-bold text-gray-600 dark:text-gray-300 hover:underline"
              >
                Annuler
              </button>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24 border-none min-h-[80vh] flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-full flex items-center justify-center shadow-lg mb-6 shadow-violet-500/30">
          <Lock size={40} className="text-white" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">{fallbackTitle}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto leading-relaxed">
          {fallbackMessage}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link 
            to="/tools" 
            className="px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-white"
          >
            Retour
          </Link>
          {previewContent && (
            <button 
              onClick={() => setShowPreview(true)}
              className="px-6 py-3 rounded-xl border-2 border-violet-200 dark:border-violet-900 bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 font-bold hover:bg-violet-100 dark:hover:bg-violet-900/50 transition-colors flex items-center gap-2"
            >
              <Eye size={18} /> Aperçu
            </button>
          )}
          <Link 
            to="/store" 
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold hover:from-amber-500 hover:to-orange-600 transition-colors shadow-md flex items-center gap-2"
          >
            <Sparkles size={18} /> Débloquer {requiredTier === 'pro' ? 'Pro' : 'Premium'}
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
