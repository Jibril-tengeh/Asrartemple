import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe, Sparkles, Compass, Book, Moon, Users, DoorOpen, ChevronRight } from 'lucide-react';

export const Onboarding: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { t, language, setLanguage } = useLanguage();
  const [step, setStep] = useState(0);

  const slides = [
    {
      icon: Sparkles,
      title: 's1_title',
      desc: 's1_desc',
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-900/20'
    },
    {
      icon: Compass,
      title: 's2_title',
      desc: 's2_desc',
      color: 'text-indigo-500',
      bg: 'bg-indigo-50 dark:bg-indigo-900/20'
    },
    {
      icon: Book,
      title: 's3_title',
      desc: 's3_desc',
      color: 'text-emerald-500',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20'
    },
    {
      icon: Moon,
      title: 's4_title',
      desc: 's4_desc',
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      icon: Sparkles,
      title: 's5_title',
      desc: 's5_desc',
      color: 'text-purple-500',
      bg: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      icon: Users,
      title: 's6_title',
      desc: 's6_desc',
      color: 'text-rose-500',
      bg: 'bg-rose-50 dark:bg-rose-900/20'
    },
    {
      icon: DoorOpen,
      title: 's7_title',
      desc: 's7_desc',
      color: 'text-teal-500',
      bg: 'bg-teal-50 dark:bg-teal-900/20'
    }
  ];

  const handleLanguageSelect = (lang: 'fr' | 'en' | 'ha') => {
    setLanguage(lang);
    setStep(1);
  };

  const nextStep = () => {
    if (step < slides.length) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const skip = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <AnimatePresence mode="wait">
        {step === 0 ? (
          <motion.div
            key="lang-select"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col items-center justify-center p-6 max-w-md mx-auto w-full"
          >
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6">
              <Globe className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="text-3xl font-black tracking-widest mb-3 text-center text-emerald-700 dark:text-emerald-500">ASRARHUB</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-10 text-center font-medium">{t('onboarding.langSelect')}</p>
            
            <div className="w-full space-y-4">
              <button
                onClick={() => handleLanguageSelect('fr')}
                className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${language === 'fr' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-gray-200 dark:border-gray-800 hover:border-emerald-200'}`}
              >
                <span className="font-medium text-lg">Français</span>
                <span className="text-2xl">🇫🇷</span>
              </button>
              <button
                onClick={() => handleLanguageSelect('en')}
                className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${language === 'en' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-gray-200 dark:border-gray-800 hover:border-emerald-200'}`}
              >
                <span className="font-medium text-lg">English</span>
                <span className="text-2xl">🇬🇧</span>
              </button>
              <button
                onClick={() => handleLanguageSelect('ha')}
                className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${language === 'ha' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-gray-200 dark:border-gray-800 hover:border-emerald-200'}`}
              >
                <span className="font-medium text-lg">Hausa</span>
                <span className="text-2xl">🇳🇬</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={`slide-${step}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="flex-1 flex flex-col p-6 max-w-md mx-auto w-full h-full"
          >
            <div className="flex justify-end pt-4 h-12">
              {step < slides.length && (
                <button onClick={skip} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 font-medium">
                  {t('onboarding.skip')}
                </button>
              )}
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              {(() => {
                const slide = slides[step - 1];
                const Icon = slide.icon;
                return (
                  <>
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                      className={`w-32 h-32 rounded-full flex items-center justify-center mb-8 ${slide.bg}`}
                    >
                      <Icon className={`w-16 h-16 ${slide.color}`} />
                    </motion.div>
                    <motion.h2 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-3xl font-bold mb-4"
                    >
                      {t(`onboarding.${slide.title}`)}
                    </motion.h2>
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed"
                    >
                      {t(`onboarding.${slide.desc}`)}
                    </motion.p>
                  </>
                );
              })()}
            </div>
            
            <div className="pb-12 pt-6">
              <div className="flex justify-center gap-2 mb-8">
                {slides.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`h-2 rounded-full transition-all duration-300 ${step - 1 === idx ? 'w-8 bg-emerald-500' : 'w-2 bg-gray-200 dark:bg-gray-800'}`}
                  />
                ))}
              </div>
              
              <button
                onClick={nextStep}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-500/20"
              >
                {step === slides.length ? t('onboarding.getStarted') : t('onboarding.continue')}
                {step < slides.length && <ChevronRight size={20} />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
