import React, { createContext, useContext, useState, useEffect } from 'react';
import fr from '../i18n/fr.json';
import en from '../i18n/en.json';
import ha from '../i18n/ha.json';

type Language = 'fr' | 'en' | 'ha';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, defaultValue?: string) => string;
}

const translations: Record<Language, any> = {
  fr,
  en,
  ha,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('fr');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && translations[savedLang]) {
      setLanguage(savedLang);
    } else {
      const browserLang = navigator.language.split('-')[0] as Language;
      if (translations[browserLang]) {
        setLanguage(browserLang);
      }
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string, defaultValue?: string): string => {
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) {
      if (!value || value[k] === undefined) {
        // Fallback to English if key doesn't exist
        let fallbackValue = translations['en'];
        for (const fbK of keys) {
          if (fallbackValue && fallbackValue[fbK] !== undefined) {
            fallbackValue = fallbackValue[fbK];
          } else {
            return defaultValue || key; // return defaultValue or key if not found
          }
        }
        return (fallbackValue as unknown as string) || defaultValue || key;
      }
      value = value[k];
    }
    return (value as unknown as string) || defaultValue || key;
  };

  useEffect(() => {
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
