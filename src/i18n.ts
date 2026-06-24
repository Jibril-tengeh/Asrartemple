import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// French translations
const fr = {
  translation: {
    welcome: 'Bienvenue sur AsrarHub',
    selectRole: 'Veuillez sélectionner le rôle (USER ou ADMIN) en promptant pour générer la suite.',
    userDashboard: 'Tableau de bord',
    all: 'Tout',
    wirds: 'Wirds',
    secrets: 'Secrets du Coran',
    recettes: 'Recettes',
    search: 'Rechercher un secret, wird ou recette...',
    viewDetail: 'Voir les détails',
    favorites: 'Favoris',
    benefits: 'Bienfaits',
    content: 'Contenu & Pratique',
    reference: 'Référence',
    back: 'Retour'
  },
};

// English translations
const en = {
  translation: {
    welcome: 'Welcome to AsrarHub',
    selectRole: 'Please select your role (USER or ADMIN) by prompting to generate the rest.',
    userDashboard: 'Dashboard',
    all: 'All',
    wirds: 'Wirds',
    secrets: 'Quran Secrets',
    recettes: 'Recipes',
    search: 'Search for a secret, wird or recipe...',
    viewDetail: 'View Details',
    favorites: 'Favorites',
    benefits: 'Benefits',
    content: 'Content & Practice',
    reference: 'Reference',
    back: 'Back'
  },
};

// Hausa translations
const ha = {
  translation: {
    welcome: 'Barka da zuwa AsrarHub',
    selectRole: 'Da fatan za a zaɓi matsayinku (MAI AMFANI ko ADMIN).',
    userDashboard: 'Lambar kulawa',
    all: 'Duka',
    wirds: 'Wirdai',
    secrets: 'Sirrin Alkur\'ani',
    recettes: 'Asirai',
    search: 'Nemo sirri, wird ko asiri...',
    viewDetail: 'Duba Cikakkun bayanai',
    favorites: 'Wadanda aka fi so',
    benefits: 'Amfani',
    content: 'Abun ciki & Aiki',
    reference: 'Magana',
    back: 'Baya'
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      fr,
      en,
      ha,
    },
    lng: 'fr',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
