import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Book, Plus, Calendar, CheckCircle2, ChevronRight, Save } from 'lucide-react';
import { Link } from 'react-router-dom';

interface JournalEntry {
  id: string;
  date: string;
  thoughts: string;
  wirdsCompleted: string[];
  progress: string;
}

export const Journal: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [currentThoughts, setCurrentThoughts] = useState('');
  const [currentProgress, setCurrentProgress] = useState('');
  const [currentWirds, setCurrentWirds] = useState<string[]>([]);
  const [wirdInput, setWirdInput] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('asrar_journal');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setEntries(parsed);
      } catch (e) {
        console.error('Error parsing journal entries', e);
      }
    }
  }, []);

  const saveEntry = () => {
    if (!currentThoughts && !currentProgress && currentWirds.length === 0) return;

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      thoughts: currentThoughts,
      wirdsCompleted: currentWirds,
      progress: currentProgress
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem('asrar_journal', JSON.stringify(updated));
    
    // Update streaks for gamification
    let stats: any = {};
    try {
      stats = JSON.parse(localStorage.getItem('asrar_stats') || '{"journal_entries": 0}');
      if (!stats || typeof stats !== 'object') stats = {};
    } catch (e) {
      stats = { journal_entries: 0 };
    }
    stats.journal_entries = (stats.journal_entries || 0) + 1;
    localStorage.setItem('asrar_stats', JSON.stringify(stats));

    setIsEditorOpen(false);
    setCurrentThoughts('');
    setCurrentProgress('');
    setCurrentWirds([]);
  };

  const addWird = () => {
    if (wirdInput.trim() && !currentWirds.includes(wirdInput.trim())) {
      setCurrentWirds([...currentWirds, wirdInput.trim()]);
      setWirdInput('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">Journal Spirituel</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Réflexions, wirds et progression</p>
        </div>
        <button 
          onClick={() => setIsEditorOpen(true)}
          className="w-12 h-12 bg-emerald-600 rounded-full text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
        >
          <Plus size={24} />
        </button>
      </div>

      <AnimatePresence>
        {isEditorOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 mb-8"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Nouvelle Entrée</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Wirds accomplis</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={wirdInput}
                    onChange={(e) => setWirdInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addWird()}
                    placeholder="Ex: Hizb al-Bahr (1x)"
                    className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                  <button onClick={addWird} className="bg-emerald-100 text-emerald-700 px-4 rounded-xl font-bold text-sm">Ajouter</button>
                </div>
                {currentWirds.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {currentWirds.map(w => (
                      <span key={w} className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100 dark:border-emerald-800">
                        {w}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Progrès Asrar & Études</label>
                <input
                  type="text"
                  value={currentProgress}
                  onChange={(e) => setCurrentProgress(e.target.value)}
                  placeholder="Ex: Étude du Khassiyya de la Fatiha terminée."
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Réflexions & États (Ahwal)</label>
                <textarea
                  value={currentThoughts}
                  onChange={(e) => setCurrentThoughts(e.target.value)}
                  placeholder="Vos pensées, rêves, ou états spirituels..."
                  className="w-full h-32 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 resize-none"
                ></textarea>
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button 
                  onClick={() => setIsEditorOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Annuler
                </button>
                <button 
                  onClick={saveEntry}
                  className="px-5 py-2.5 rounded-xl font-bold bg-emerald-600 text-white flex items-center gap-2 hover:bg-emerald-700 transition-colors"
                >
                  <Save size={18} /> Sauvegarder
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {entries.length === 0 && !isEditorOpen && (
          <div className="text-center py-12">
            <Book size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">Votre journal est vide.</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Commencez à noter vos accomplissements spirituels.</p>
          </div>
        )}

        {entries.map(entry => (
          <motion.div 
            key={entry.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 font-medium mb-4">
              <Calendar size={16} />
              {new Date(entry.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            
            {entry.wirdsCompleted.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-2">Wirds</h4>
                <div className="flex flex-wrap gap-2">
                  {entry.wirdsCompleted.map((wird, idx) => (
                    <span key={idx} className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100 dark:border-emerald-800/30">
                      <CheckCircle2 size={12} /> {wird}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {entry.progress && (
              <div className="mb-4 p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
                 <h4 className="text-xs uppercase tracking-widest font-bold text-blue-500 mb-1">Études</h4>
                 <p className="text-sm text-gray-800 dark:text-gray-200">{entry.progress}</p>
              </div>
            )}

            {entry.thoughts && (
              <div>
                <h4 className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-2">Réflexions</h4>
                <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed whitespace-pre-wrap font-serif">
                  {entry.thoughts}
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
