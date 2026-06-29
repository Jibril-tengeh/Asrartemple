import React, { useState, useEffect } from 'react';
import { Moon, ArrowLeft, Plus, Calendar, Save, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';

interface DreamEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  interpretation: string;
  type: 'rahmani' | 'nafsani' | 'shaytani' | 'unknown';
  wirdDone?: string;
}

export const DreamJournal: React.FC = () => {
  const { t } = useLanguage();
  const [dreams, setDreams] = useState<DreamEntry[]>([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [interpretation, setInterpretation] = useState('');
  const [wirdDone, setWirdDone] = useState('');
  const [type, setType] = useState<DreamEntry['type']>('unknown');
  const [isInterpreting, setIsInterpreting] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('asrar_dreams');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setDreams(parsed);
      } catch (e) {}
    }
  }, []);

  const handleInterpret = async () => {
    if (!title || !content) {
      alert("Veuillez remplir le titre et le récit du rêve d'abord.");
      return;
    }
    setIsInterpreting(true);
    try {
      const res = await fetch('/api/dreams/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, type, wirdDone })
      });
      const data = await res.json();
      if (data.interpretation) {
        setInterpretation(data.interpretation);
      } else {
        alert(data.error || "Erreur d'interprétation");
      }
    } catch (e) {
      alert("Erreur réseau");
    } finally {
      setIsInterpreting(false);
    }
  };

  const saveDream = () => {
    if (!title || !content) return;

    const newDream: DreamEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      title,
      content,
      interpretation,
      type,
      wirdDone
    };

    const updated = [newDream, ...dreams];
    setDreams(updated);
    localStorage.setItem('asrar_dreams', JSON.stringify(updated));
    
    // Gamification
    let stats; try { stats = JSON.parse(localStorage.getItem('asrar_stats') || '{}'); if (!stats || typeof stats !== 'object') stats = {}; } catch(e) { stats = {}; }
    stats.tools_used = (stats.tools_used || 0) + 1;
    localStorage.setItem('asrar_stats', JSON.stringify(stats));

    setIsEditorOpen(false);
    setTitle('');
    setContent('');
    setInterpretation('');
    setWirdDone('');
    setType('unknown');
  };

  const deleteDream = (id: string) => {
    const updated = dreams.filter(d => d.id !== id);
    setDreams(updated);
    localStorage.setItem('asrar_dreams', JSON.stringify(updated));
  };

  const typeConfig = {
    rahmani: { label: 'Rahmani (Véridique)', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800' },
    nafsani: { label: 'Nafsani (Psychologique)', bg: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800' },
    shaytani: { label: 'Shaytani (Cauchemar)', bg: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800' },
    unknown: { label: 'Non défini', bg: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700' }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link to="/tools" className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Moon className="text-indigo-500" />
              Journal des Rêves
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t("tools.dreams.description")}</p>
          </div>
        </div>
        <button 
          onClick={() => setIsEditorOpen(true)}
          className="w-12 h-12 bg-indigo-600 rounded-full text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
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
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Nouveau Rêve</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Titre / Résumé court</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Voler au-dessus de la Mecque"
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Nature du Rêve</label>
                <select 
                  value={type} 
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="unknown">Non défini</option>
                  <option value="rahmani">Rêve Véridique (Ru'ya Rahamaniya)</option>
                  <option value="nafsani">Rêve de l'Ame (Hulm Nafsani)</option>
                  <option value="shaytani">Cauchemar (Hulm Shaytani) - À ne pas raconter!</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Zikr/Wird prélude (Avant de dormir)</label>
                <input
                  type="text"
                  value={wirdDone}
                  onChange={(e) => setWirdDone(e.target.value)}
                  placeholder="Ex: Ya Latif 129 fois, Ya Nur..."
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Récit détaillé</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Le prophète (paix sur lui) a dit : 'Le rêve est l'une des quarante-six parties de la prophétie'..."
                  className="w-full h-32 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 resize-none"
                ></textarea>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">{t("common.interpretation")} (Optionnel)</label>
                  <button
                    onClick={handleInterpret}
                    disabled={isInterpreting || !title || !content}
                    className="text-xs font-bold px-3 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors disabled:opacity-50"
                  >
                    {isInterpreting ? "Analyse IA en cours..." : "Interpréter avec l'IA (Ibn Sirin)"}
                  </button>
                </div>
                <textarea
                  value={interpretation}
                  onChange={(e) => setInterpretation(e.target.value)}
                  placeholder="Notes personnelles d'interprétation selon Ibn Sirin ou votre intuition..."
                  className="w-full h-24 bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/50 rounded-xl p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 resize-none"
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
                  onClick={saveDream}
                  disabled={!title || !content}
                  className="px-5 py-2.5 rounded-xl font-bold bg-indigo-600 text-white disabled:opacity-50 flex items-center gap-2 hover:bg-indigo-700 transition-colors"
                >
                  <Save size={18} /> {t("common.save")}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {dreams.length === 0 && !isEditorOpen && (
          <div className="text-center py-12">
            <Moon size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">Aucun rêve documenté.</p>
          </div>
        )}

        {dreams.map(dream => (
          <motion.div 
            key={dream.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 relative group"
          >
            <button
              onClick={() => deleteDream(dream.id)}
              className="absolute top-6 right-6 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={18} />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${typeConfig[dream.type].bg}`}>
                {typeConfig[dream.type].label}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 font-medium">
                <Calendar size={14} />
                {new Date(dream.date).toLocaleDateString('fr-FR')}
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 pr-8">{dream.title}</h3>
            
            {dream.wirdDone && (
              <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50/50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-lg text-sm font-medium border border-indigo-100/50 dark:border-indigo-800/30">
                <span className="opacity-70 text-xs uppercase tracking-wider font-bold">Prélude (Wird):</span>
                {dream.wirdDone}
              </div>
            )}

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap font-serif mb-4">
              {dream.content}
            </p>
            {dream.interpretation && (
              <div className="bg-indigo-50 dark:bg-indigo-900/10 border-l-4 border-indigo-400 p-4 rounded-r-xl">
                 <h4 className="text-xs uppercase tracking-widest font-bold text-indigo-500 mb-2">{t("common.interpretation")} (Ta'bir)</h4>
                 <p className="text-sm text-indigo-900 dark:text-indigo-200">{dream.interpretation}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
