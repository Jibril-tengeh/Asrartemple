import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FileText, Search } from 'lucide-react';
import { db } from '../../../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { useLanguage } from '../../../contexts/LanguageContext';

const defaultLexiqueData = [
  { term: "Alif (أ)", category: "Lettres", description: "Première lettre de l'alphabet arabe. Sa valeur numérique est 1. Elle symbolise l'Unicité Divine (Tawhid) et le principe de toute création." },
  { term: "Ba' (ب)", category: "Lettres", description: "Deuxième lettre. Valeur numérique 2. Symbolise le commencement de la création, car le Coran commence par le Bismillah." },
  { term: "Ha' (هـ)", category: "Lettres", description: "Valeur numérique 5. Représente l'Essence Divine (Huwa) et le souffle de vie." },
  { term: "Zikr / Dhikr", category: "Concepts", description: "Le 'rappel' ou 'l'invocation'. Pratique spirituelle consistant à répéter les Noms de Dieu ou des formules sacrées." },
  { term: "Wird", category: "Concepts", description: "Un exercice spirituel structuré et répété quotidiennement à des moments précis (souvent matin et soir)." },
  { term: "Talsam", category: "Concepts", description: "Formule ou sceau mystique condensant une énergie spirituelle ou une supplication prolongée." },
  { term: "Nombre 7", category: "Nombres", description: "Nombre hautement symbolique : 7 cieux, 7 terres, 7 circumambulations (Tawaf), 7 versets de la Fatiha." },
  { term: "Nombre 66", category: "Nombres", description: "Valeur numérique du Nom Majestueux 'Allah' selon le système Abjad classique." },
  { term: "Khatim", category: "Concepts", description: "Un carré magique ou sceau utilisé pour concentrer et canaliser les énergies d'un verset ou d'un Nom Divin." },
];

export const Lexique: React.FC = () => {
  const { language } = useLanguage();
  const [search, setSearch] = useState('');
  const [lexiqueData, setLexiqueData] = useState<any[]>(defaultLexiqueData);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'lexique_terms'), (snapshot) => {
      const dbTerms = snapshot.docs.map(doc => {
        const data = doc.data();
        const lang = language;
        return {
          term: data[`word_${lang}`] || data.word,
          category: data.category,
          description: data[`definition_${lang}`] || data.definition
        };
      });
      
      const merged = [...defaultLexiqueData];
      dbTerms.forEach(dbItem => {
        if (!merged.find(m => m.term.toLowerCase() === dbItem.term.toLowerCase())) {
          merged.push(dbItem);
        }
      });
      setLexiqueData(merged);
    }, (error) => {
      console.error("Lexique onSnapshot error:", error);
    });

    return () => unsubscribe();
  }, [i18n.language]);

  const filteredData = lexiqueData.filter(item => 
    item.term.toLowerCase().includes(search.toLowerCase()) || 
    item.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-xl">
          <FileText size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lexique des Symboles</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Significations ésotériques et concepts clés</p>
        </div>
      </div>

      <div className="relative mb-8">
        <input 
          type="text" 
          placeholder="Rechercher un terme, une lettre, un nombre..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-4 pl-12 pr-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none shadow-sm transition-all"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
      </div>

      <div className="space-y-4">
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{item.term}</h3>
                <span className="text-xs font-semibold px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 rounded-full uppercase tracking-wider">
                  {item.category}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                {item.description}
              </p>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Aucun résultat trouvé pour "{search}"</p>
          </div>
        )}
      </div>
    </div>
  );
};
