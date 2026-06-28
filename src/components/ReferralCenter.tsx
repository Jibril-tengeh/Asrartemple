import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Share2, Users, Gift, Copy, Check } from 'lucide-react';
import { motion } from 'motion/react';

export const ReferralCenter: React.FC = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const referralCode = user?.uid ? user.uid.substring(0, 8).toUpperCase() : 'ASRARHUB';
  const referralLink = `https://asrarhub.com/invite/${referralCode}`; // Mock link for now

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Rejoignez AsrarHub',
        text: `Utilisez mon code ${referralCode} pour nous rejoindre et gagnez des points spirituels !`,
        url: referralLink,
      }).catch((error) => console.error('Error sharing', error));
    } else {
      handleCopy();
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-3xl p-5 sm:p-6 shadow-sm border border-indigo-100 dark:border-indigo-800/30 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Users className="text-indigo-500" size={24} />
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Parrainer un ami</h2>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 items-center">
        <div className="flex-1">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
            Invitez vos amis à rejoindre AsrarHub et gagnez <span className="font-bold text-emerald-600 dark:text-emerald-400">100 Points Spirituels</span> pour chaque ami qui s'inscrit avec votre lien.
          </p>
          
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-2 mb-4">
            <span className="flex-1 text-sm font-mono text-gray-500 dark:text-gray-400 truncate px-2 select-all">
              {referralLink}
            </span>
            <button 
              onClick={handleCopy}
              className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-600 dark:text-gray-300 transition-colors"
              title="Copier le lien"
            >
              {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
            </button>
          </div>

          <button 
            onClick={handleShare}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Share2 size={18} />
            Partager l'invitation
          </button>
        </div>

        <div className="w-full sm:w-1/3 bg-white/50 dark:bg-gray-800/50 rounded-2xl p-4 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-3">
            <Gift size={32} />
          </div>
          <span className="text-2xl font-black text-gray-900 dark:text-white mb-1">0</span>
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amis Invités</span>
        </div>
      </div>
    </div>
  );
};
