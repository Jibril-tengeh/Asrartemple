import React, { useState, useEffect } from 'react';
import { Joyride, EventData, STATUS, Step, TooltipRenderProps } from 'react-joyride';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const OnboardingTour: React.FC = () => {
  const [run, setRun] = useState(false);
  const { t } = useLanguage();

  const CustomTooltip: React.FC<TooltipRenderProps> = ({
    continuous,
    index,
    step,
    backProps,
    closeProps,
    primaryProps,
    tooltipProps,
    isLastStep,
  }) => {
    return (
      <motion.div
        {...tooltipProps}
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden max-w-sm w-full border border-gray-100 dark:border-gray-700"
      >
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center space-x-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                {index + 1}
              </span>
              {step.title && (
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {step.title}
                </h3>
              )}
            </div>
            {!step.hideCloseButton && (
              <button
                {...closeProps}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          <div className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
            {step.content}
          </div>

          <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div>
              {index > 0 && (
                <button
                  {...backProps}
                  className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                  <ChevronLeft size={16} className="mr-1" />
                  {t('onboardingTour.prev', 'Précédent')}
                </button>
              )}
            </div>
            
            <button
              {...primaryProps}
              className="flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
            >
              {isLastStep ? (
                <>
                  {t('onboardingTour.finish', 'Terminer')} <Check size={16} className="ml-1.5" />
                </>
              ) : (
                <>
                  {t('onboardingTour.next', 'Suivant')} <ChevronRight size={16} className="ml-1.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  useEffect(() => {
    // Check if user has seen the tour
    const hasSeenTour = localStorage.getItem('asrarhub_tour_completed');
    if (!hasSeenTour) {
      // Small delay to let the UI render completely
      setTimeout(() => {
        setRun(true);
      }, 1000);
    }
  }, []);

  const steps: Step[] = [
    {
      target: 'body',
      content: t('onboardingTour.welcome', 'Bienvenue sur AsrarHub ! Laissez-nous vous guider à travers les fonctionnalités principales de notre application.'),
      placement: 'center',
      skipBeacon: true,
    },
    {
      target: '#tour-community',
      content: t('onboardingTour.community', 'Rejoignez la communauté pour discuter, partager et apprendre ensemble.'),
      placement: 'bottom',
    },
    {
      target: '#tour-notifications',
      content: t('onboardingTour.notifications', 'Retrouvez ici toutes vos notifications importantes et mises à jour.'),
      placement: 'bottom',
    },
    {
      target: '#tour-language',
      content: t('onboardingTour.language', 'Changez la langue de l\'application (Français, English, Hausa).'),
      placement: 'bottom',
    },
    {
      target: '#tour-theme',
      content: t('onboardingTour.theme', 'Basculez entre le mode clair et le mode sombre pour votre confort visuel.'),
      placement: 'bottom',
    },
    {
      target: '#tour-profile',
      content: t('onboardingTour.profile', 'Accédez à votre profil pour gérer vos informations et paramètres.'),
      placement: 'bottom',
    },
    {
      target: '#tour-ruqyah',
      content: t('onboardingTour.ruqyah', 'Ici, vous trouverez des outils de Roqya et des invocations pour la protection spirituelle.'),
      placement: 'bottom',
    },
    {
      target: '#tour-store',
      content: t('onboardingTour.store', 'La boutique vous permet d\'acquérir des éléments premium et des accès exclusifs.'),
      placement: 'bottom',
    },
    {
      target: '#tour-lexique',
      content: t('onboardingTour.lexicon', 'Le Lexique contient les définitions et explications des termes spirituels utilisés.'),
      placement: 'bottom',
    },
    {
      target: '#tour-quran',
      content: t('onboardingTour.quran', 'Accédez au Saint Coran pour la lecture, la méditation et l\'écoute.'),
      placement: 'bottom',
    },
    {
      target: '#tour-search',
      content: t('onboardingTour.search', 'Recherchez rapidement un article, une recette ou un wird spécifique. Vous pouvez même utiliser l\'IA pour trouver ce qu\'il vous faut !'),
      placement: 'bottom',
    },
    {
      target: '#tour-filter',
      content: t('onboardingTour.filter', 'Filtrez les éléments affichés selon leur catégorie.'),
      placement: 'bottom',
    },
    {
      target: '#tour-layout',
      content: t('onboardingTour.viewToggle', 'Personnalisez l\'affichage des cartes selon vos préférences (Grille ou Liste).'),
      placement: 'bottom',
    },
    {
      target: '#tour-nav-home',
      content: t('onboardingTour.navHome', 'Retournez à la page d\'accueil de votre tableau de bord.'),
      placement: 'top',
    },
    {
      target: '#tour-nav-explore',
      content: t('onboardingTour.navExplore', 'Explorez de nouveaux articles et contenus publiés.'),
      placement: 'top',
    },
    {
      target: '#tour-nav-tools',
      content: t('onboardingTour.navTools', 'Accédez à des outils spirituels tels que le chapelet, le tasbih, etc.'),
      placement: 'top',
    },
    {
      target: '#tour-nav-journal',
      content: t('onboardingTour.navJournal', 'Consultez votre journal spirituel et de gratitude.'),
      placement: 'top',
    },
    {
      target: '#tour-nav-saved',
      content: t('onboardingTour.navSaved', 'Retrouvez tous vos articles et recettes sauvegardés.'),
      placement: 'top',
    },
    {
      target: '#tour-faq',
      content: t('onboardingTour.chat', 'Posez vos questions à l\'IA d\'AsrarHub et recevez des réponses basées sur nos ressources.'),
      placement: 'top-end',
    },
  ];

  const handleJoyrideCallback = (data: EventData) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      localStorage.setItem('asrarhub_tour_completed', 'true');
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      scrollToFirstStep
      tooltipComponent={CustomTooltip}
      onEvent={handleJoyrideCallback}
      options={{
        primaryColor: '#10b981', // emerald-500
        zIndex: 10000,
        showProgress: true,
      }}
      locale={{
        back: t('onboardingTour.prev', 'Précédent'),
        close: t('onboardingTour.finish', 'Fermer'),
        last: t('onboardingTour.finish', 'Terminer'),
        next: t('onboardingTour.next', 'Suivant'),
        skip: t('onboardingTour.finish', 'Passer'),
      }}
    />
  );
};
