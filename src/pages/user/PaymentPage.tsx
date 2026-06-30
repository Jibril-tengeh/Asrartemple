import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { Shield, Star, Check, Sparkles, ArrowLeft } from 'lucide-react';
import { PaystackService } from '../../services/PaystackService';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Link, useNavigate } from 'react-router-dom';
import { AuthModal } from '../../components/AuthModal';

export const PaymentPage: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const plans = [
    {
      id: 'premium_3m',
      name: 'Premium (3 Mois)',
      description: 'Accès complet aux outils, renouvellement automatique.',
      price: '13 USD',
      priceNumber: 13,
      planCode: 'PLN_3months',
      features: [
        'Outils spirituels illimités',
        'Tutoriels Sirr Al Asrar avancés',
        'Aucune publicité',
        'Support prioritaire',
        'Renouvellement automatique'
      ],
      icon: Star,
      color: 'from-amber-400 to-orange-500'
    },
    {
      id: 'premium_6m',
      name: 'Premium (6 Mois)',
      description: 'Consultation personnalisée et accès complet, renouvellement automatique.',
      price: '25 USD',
      priceNumber: 25,
      planCode: 'PLN_6months',
      features: [
        'Toutes les fonctionnalités Premium',
        'Économie sur la durée',
        'Traitements personnalisés',
        'Accès direct aux experts',
        'Renouvellement automatique'
      ],
      icon: Shield,
      color: 'from-fuchsia-500 to-purple-600'
    }
  ];

  const handleSubscribe = async (plan: any) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    setLoading(true);
    try {
      await PaystackService.initializePaystackPayment(
        user.email,
        plan.priceNumber,
        'USD',
        user.uid,
        async (reference) => {
          const userRef = doc(db, 'users', user.uid);
          await updateDoc(userRef, {
            subscriptionTier: plan.id,
            subscriptionDate: new Date().toISOString()
          });
          alert(`Félicitations! Vous êtes maintenant abonné au plan ${plan.name} (Renouvellement automatique).`);
          navigate('/user/dashboard');
        },
        () => {
          console.log("Paiement annulé ou fermé.");
        },
        plan.planCode
      );
    } catch (err) {
      console.error(err);
      alert("Une erreur est survenue lors de l'initialisation du paiement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 pt-8 pb-24">
      <div className="mb-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors mb-4">
          <ArrowLeft size={20} />
          <span>Retour</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Sparkles className="text-amber-500" />
          Débloquer l'Accès Premium
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Choisissez le plan qui correspond à vos besoins spirituels.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-gray-700 shadow-xl relative overflow-hidden group">
            <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${plan.color}`}></div>
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform`}>
                <plan.icon size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                <p className="text-3xl font-black text-gray-900 dark:text-white mt-1">{plan.price}</p>
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6 min-h-[48px]">
              {plan.description}
            </p>

            <ul className="space-y-4 mb-8">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className={`mt-1 p-1 rounded-full bg-gradient-to-r ${plan.color} text-white shrink-0`}>
                    <Check size={12} strokeWidth={4} />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe(plan)}
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 bg-gradient-to-r ${plan.color} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <Sparkles size={20} />
              {loading ? 'Traitement...' : 'Choisir ce plan'}
            </button>
          </div>
        ))}
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};
