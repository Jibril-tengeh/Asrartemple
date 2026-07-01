import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { Shield, Star, Check, Sparkles, ArrowLeft, CreditCard, Landmark, Bitcoin, Crown } from 'lucide-react';
import { PaystackService } from '../../services/PaystackService';
import { Link, useNavigate } from 'react-router-dom';
import { AuthModal } from '../../components/AuthModal';

const detectUserCurrencyAndPrice = (priceUSD: number) => {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  
  if (tz.startsWith('Europe/')) {
    let price = 23;
    if (priceUSD === 13) price = 12;
    if (priceUSD === 45) price = 42;
    return { currency: 'EUR', price, displayStr: `${price} €` };
  } else if (
    tz === 'Africa/Dakar' || tz === 'Africa/Abidjan' || tz === 'Africa/Bamako' || 
    tz === 'Africa/Lome' || tz === 'Africa/Niamey' || tz === 'Africa/Ouagadougou' || 
    tz === 'Africa/Porto-Novo'
  ) {
    let price = 15000;
    if (priceUSD === 13) price = 8000;
    if (priceUSD === 45) price = 27000;
    return { currency: 'XOF', price, displayStr: `${price} FCFA` };
  } else if (
    tz === 'Africa/Douala' || tz === 'Africa/Libreville' || tz === 'Africa/Brazzaville' || 
    tz === 'Africa/Bangui' || tz === 'Africa/Ndjamena' || tz === 'Africa/Malabo'
  ) {
    let price = 15000;
    if (priceUSD === 13) price = 8000;
    if (priceUSD === 45) price = 27000;
    return { currency: 'XAF', price, displayStr: `${price} FCFA` };
  }
  
  // Default to USD
  return { currency: 'USD', price: priceUSD, displayStr: `${priceUSD} $` };
};

export const PaymentPage: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [userLocationInfo, setUserLocationInfo] = useState({ currency: 'USD' });

  useEffect(() => {
    setUserLocationInfo({ currency: detectUserCurrencyAndPrice(13).currency });
  }, []);

  const plans = [
    {
      id: 'premium_3m',
      name: t('payment.plan3m', 'Premium (3 Mois)'),
      description: t('payment.desc3m', 'Accès complet aux outils, renouvellement automatique.'),
      priceNumber: 13,
      features: [
        t('payment.featUnlimited', 'Outils spirituels illimités'),
        t('payment.featTutorials', 'Tutoriels Sirr Al Asrar avancés'),
        t('payment.featNoAds', 'Aucune publicité'),
        t('payment.featSupport', 'Support prioritaire'),
        t('payment.featAutoRenew', 'Renouvellement automatique')
      ],
      icon: Star,
      color: 'from-amber-400 to-orange-500'
    },
    {
      id: 'premium_6m',
      name: t('payment.plan6m', 'Premium (6 Mois)'),
      description: t('payment.desc6m', 'Consultation personnalisée et accès complet, renouvellement automatique.'),
      priceNumber: 25,
      features: [
        t('payment.featAllPremium', 'Toutes les fonctionnalités Premium'),
        t('payment.featSave', 'Économie sur la durée'),
        t('payment.featTreatments', 'Traitements personnalisés'),
        t('payment.featExperts', 'Accès direct aux experts'),
        t('payment.featAutoRenew', 'Renouvellement automatique')
      ],
      icon: Shield,
      color: 'from-fuchsia-500 to-purple-600'
    },
    {
      id: 'premium_12m',
      name: t('payment.plan12m', 'Premium (12 Mois)'),
      description: t('payment.desc12m', 'Le choix ultime pour une année de spiritualité accompagnée.'),
      priceNumber: 45,
      features: [
        t('payment.featAllPremium', 'Toutes les fonctionnalités Premium'),
        t('payment.featMaxSave', 'Économie maximale sur la durée'),
        t('payment.featTreatments', 'Traitements personnalisés'),
        t('payment.featExperts', 'Accès direct aux experts'),
        t('payment.featAutoRenew', 'Renouvellement automatique')
      ],
      icon: Crown,
      color: 'from-emerald-400 to-teal-600'
    }
  ];

  const [selectedCurrency, setSelectedCurrency] = useState<string>('AUTO');

  const handleSubscribe = async (plan: any) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    setLoading(true);
    let pricing = detectUserCurrencyAndPrice(plan.priceNumber);
    
    if (selectedCurrency !== 'AUTO') {
      pricing = {
        currency: selectedCurrency,
        price: selectedCurrency === 'XOF' || selectedCurrency === 'XAF' ? (plan.priceNumber === 13 ? 8000 : 27000) : (selectedCurrency === 'NGN' ? (plan.priceNumber === 13 ? 15000 : 45000) : plan.priceNumber),
        displayStr: `${plan.priceNumber} ${selectedCurrency}`
      }
    }

    try {
      await PaystackService.initializePaystackPayment(
        user.email || 'user@example.com',
        pricing.price,
        pricing.currency,
        user.uid,
        async (reference) => {
          // Server-side verification updates the user document.
          alert(t('payment.success', `Félicitations! Vous êtes maintenant abonné au plan ${plan.name}.`).replace('{plan}', plan.name));
          navigate('/user/dashboard');
        },
        () => {
          console.log(t('payment.cancelled', "Paiement annulé ou fermé."));
        }
        // Do not pass planCode to avoid "Plan not found" error on Paystack
      );
    } catch (err) {
      console.error(err);
      alert(t('payment.error', "Une erreur est survenue lors de l'initialisation du paiement."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 pt-8 pb-24">
      <div className="mb-8 text-center sm:text-left">
        <button onClick={() => navigate(-1)} className="flex items-center justify-center sm:justify-start gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors mb-4 w-full sm:w-auto">
          <ArrowLeft size={20} />
          <span>{t('payment.back', 'Retour')}</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center sm:justify-start gap-3 mb-2">
          <Sparkles className="text-amber-500" />
          {t('payment.title', "Débloquer l'Accès Premium")}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl">
          {t('payment.subtitle', "Choisissez le plan qui correspond à vos besoins spirituels.")}
        </p>
        
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-2 justify-center sm:justify-start">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Devise de paiement (Paystack) :</label>
          <select 
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="AUTO">Automatique (Détecté)</option>
            <option value="XOF">XOF (FCFA - UEMOA)</option>
            <option value="XAF">XAF (FCFA - CEMAC)</option>
            <option value="USD">USD (Dollars Américains)</option>
            <option value="EUR">EUR (Euros)</option>
            <option value="NGN">NGN (Naira Nigérian)</option>
            <option value="GHS">GHS (Cedi Ghanéen)</option>
            <option value="ZAR">ZAR (Rand Sud-Africain)</option>
          </select>
          <p className="text-xs text-amber-600 dark:text-amber-400 max-w-sm mt-1 sm:mt-0 text-left">
            * Choisissez la devise supportée par votre compte marchand Paystack si l'automatique échoue ("Currency not supported").
          </p>
        </div>
        
        <div className="mt-6 flex flex-wrap gap-4 items-center justify-center sm:justify-start text-sm font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/50">
          <span className="flex items-center gap-1.5"><CreditCard size={16} /> {t('payment.method.card', 'Carte Visa / Mastercard')}</span>
          <span className="text-emerald-300 hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5"><Landmark size={16} /> {t('payment.method.bank', 'Compte Bancaire')}</span>
          <span className="text-emerald-300 hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5">{t('payment.method.mobileMoney', 'Mobile Money')}</span>
          <span className="text-emerald-300 hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5"><Bitcoin size={16} /> {t('payment.method.crypto', 'Crypto')}</span>
          <span className="text-emerald-300 hidden sm:inline">•</span>
          <span className="italic opacity-80 w-full sm:w-auto text-center">{t('payment.autoDetect', '(Devise auto-détectée: {currency})').replace('{currency}', userLocationInfo.currency)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {plans.map((plan) => {
          const pricing = detectUserCurrencyAndPrice(plan.priceNumber);
          return (
            <div key={plan.id} className="bg-white dark:bg-gray-800 rounded-3xl p-6 lg:p-8 border border-gray-200 dark:border-gray-700 shadow-xl relative overflow-hidden group flex flex-col transition-transform hover:-translate-y-1">
              <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${plan.color}`}></div>
              <div className="flex flex-col items-center sm:items-start sm:flex-row gap-4 mb-6 text-center sm:text-left">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform shrink-0`}>
                  <plan.icon size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                  <p className="text-3xl font-black text-gray-900 dark:text-white mt-1">{pricing.displayStr}</p>
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6 min-h-[48px] text-center sm:text-left text-sm">
                {plan.description}
              </p>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className={`mt-0.5 p-1 rounded-full bg-gradient-to-r ${plan.color} text-white shrink-0`}>
                      <Check size={12} strokeWidth={4} />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium text-sm leading-tight">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan)}
                disabled={loading}
                className={`w-full mt-auto py-3.5 rounded-xl font-bold text-white shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 bg-gradient-to-r ${plan.color} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <Sparkles size={20} />
                {loading ? t('payment.processing', 'Traitement...') : t('payment.choosePlan', 'Choisir ce plan')}
              </button>
            </div>
          );
        })}
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

