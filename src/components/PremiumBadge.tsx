import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Sparkles, Shield } from 'lucide-react';

export const PremiumBadge: React.FC = () => {
  const { user } = useAuth();

  if (!user || (!user.subscriptionTier || user.subscriptionTier === 'free')) {
    return null;
  }

  if (user.subscriptionTier === 'pro') {
    return (
      <span className="inline-flex items-center gap-1 text-xs bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-2.5 py-1 rounded-full font-semibold shadow-sm">
        <Shield size={12} />
        Pro
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-xs bg-gradient-to-r from-amber-400 to-orange-500 text-white px-2.5 py-1 rounded-full font-semibold shadow-sm">
      <Sparkles size={12} />
      Premium
    </span>
  );
};
