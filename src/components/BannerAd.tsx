import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { X, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BannerAd: React.FC = () => {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(true);

  const isPremiumOrPro = user?.subscriptionTier === 'premium' || user?.subscriptionTier === 'pro';

  // Do not show ads if the user dismissed it, or if they are premium and have hidden ads.
  // We'll let premium users see ads unless they toggle it off, or maybe by default we hide it if they toggle it off?
  // Let's hide if isPremiumOrPro && user.hideAds !== false, meaning default hidden for premium, but if they want them... wait. 
  // Let's just say if (user?.hideAds) return null;
  if (!isVisible || user?.hideAds) {
    return null;
  }

  return (
    <div className="w-full bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-3 sm:p-4 rounded-2xl shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden group">
      <div className="absolute right-0 top-0 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="flex-1 z-10 text-center sm:text-left">
        <div className="text-[10px] uppercase tracking-wider font-bold text-white/50 mb-1">Sponsorisé</div>
        <h4 className="font-bold text-lg mb-1">Débloquez votre plein potentiel spirituel</h4>
        <p className="text-blue-100 text-sm">Passez à la version Premium pour accéder aux cours Sirr Al Asrar complets et supprimer ces publicités.</p>
      </div>

      <div className="flex items-center gap-3 z-10 w-full sm:w-auto">
        <Link 
          to="/payment" 
          className="flex-1 sm:flex-none text-center bg-white text-indigo-900 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
        >
          Voir les Offres <ExternalLink size={16} />
        </Link>
        <button 
          onClick={() => setIsVisible(false)}
          className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white"
          aria-label="Fermer l'annonce"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};
