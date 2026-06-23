export type Category = 'wird' | 'secret' | 'recette';

export interface AsrarItem {
  id: string;
  title: string;
  category: Category;
  verse?: string; // Optional related Quran verse
  reference?: string; // e.g. Sourate Al-Baqarah, verset 255
  content: string;
  benefits: string[];
  createdAt: string;
}
