import { AsrarItem } from '../types';

export const initialData: AsrarItem[] = [
  {
    id: '1',
    title: 'Secret de Ayat al-Kursi pour la protection',
    hook: 'Le bouclier spirituel ultime contre tout mal...',
    category: 'secret',
    verse: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
    reference: 'Sourate Al-Baqarah, Verset 255',
    content: 'La lecture de ce verset après chaque prière prescrite assure une protection divine contre tout mal. Il est également recommandé de le réciter avant de dormir pour être sous la garde d\'un ange protecteur jusqu\'au matin.',
    benefits: ['Protection divine absolue', 'Élévation spirituelle', 'Paix intérieure profonde'],
    imageUrl: 'https://images.unsplash.com/photo-1584286595398-e7d4bc807567?auto=format&fit=crop&q=80&w=800',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Wird de la recherche du pardon',
    hook: 'Purifiez votre cœur et ouvrez les portes de la subsistance...',
    category: 'wird',
    content: 'Répéter "Astaghfirullah" 100 fois après la prière de Fajr et la prière de Asr, en méditant sur la grandeur de la miséricorde divine dans une posture de recueillement.',
    benefits: ['Ouverture des portes de la subsistance', 'Purification du cœur et de l\'âme', 'Allègement des soucis'],
    imageUrl: 'https://images.unsplash.com/photo-1609599006353-e629aa1db158?auto=format&fit=crop&q=80&w=800',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Recette pour l\'ouverture et la réussite',
    hook: 'Ce secret est le levier spirituel du percement...',
    category: 'recette',
    verse: 'إِنَّا فَتَحْنَا لَكَ فَتْحًا مُبِينًا',
    reference: 'Sourate Al-Fath, Verset 1',
    content: 'Écrire ce verset 3 fois avec de l\'encre propre (safran et eau de rose) sur une ardoise, puis effacer avec de l\'eau de zamzam ou de l\'eau de source. Boire cette eau à jeun pendant 3 ou 7 jours consécutifs avec l\'intention de la réussite.',
    benefits: ['Succès dans les affaires et études', 'Facilitation des projets bloqués', 'Ouverture des opportunités'],
    imageUrl: 'https://images.unsplash.com/photo-1542042161784-26ab9e041e89?auto=format&fit=crop&q=80&w=800',
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    title: 'Secret de la Sourate Yasin pour les besoins',
    hook: 'L\'invocation exaucée pour tous vos besoins pressants...',
    category: 'secret',
    verse: 'يس ۚ وَالْقُرْآنِ الْحَكِيمِ',
    reference: 'Sourate Yasin, Versets 1-2',
    content: 'Lire la sourate Yasin entièrement une fois par jour au moment de Dhuha. À chaque fois que vous arrivez au mot "Mubin" (qui s\'y trouve 7 fois), formulez votre besoin précis à Dieu.',
    benefits: ['Résolution rapide des problèmes', 'Réalisation des vœux', 'Facilité dans les épreuves'],
    imageUrl: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?auto=format&fit=crop&q=80&w=800',
    createdAt: new Date().toISOString()
  }
];

export const getAsrarItems = (): AsrarItem[] => {
  try {
    const stored = localStorage.getItem('asrar_items');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error parsing asrar_items", e);
  }
  localStorage.setItem('asrar_items', JSON.stringify(initialData));
  return initialData;
};
