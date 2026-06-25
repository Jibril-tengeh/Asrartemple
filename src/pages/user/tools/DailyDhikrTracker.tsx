import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Target, Plus, Trash2, CheckCircle2, RotateCcw } from 'lucide-react';

interface DhikrGoal {
  id: string;
  name: string;
  target: number;
  progress: number;
  lastUpdated: string;
}

export const DailyDhikrTracker: React.FC = () => {
  const { t } = useLanguage();
  const [goals, setGoals] = useState<DhikrGoal[]>([]);
  const [newDhikrName, setNewDhikrName] = useState('');
  const [newDhikrTarget, setNewDhikrTarget] = useState<number | ''>('');

  useEffect(() => {
    const saved = localStorage.getItem('asrar_dhikr_tracker');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Check for new day and reset if needed
          const today = new Date().toDateString();
          const updated = parsed.map(goal => {
            const goalDate = new Date(goal.lastUpdated).toDateString();
            if (goalDate !== today) {
              return { ...goal, progress: 0, lastUpdated: new Date().toISOString() };
            }
            return goal;
          });
          setGoals(updated);
          localStorage.setItem('asrar_dhikr_tracker', JSON.stringify(updated));
        }
      } catch (e) {
        console.error('Error parsing dhikr tracker data', e);
      }
    }
  }, []);

  const saveGoals = (newGoals: DhikrGoal[]) => {
    setGoals(newGoals);
    localStorage.setItem('asrar_dhikr_tracker', JSON.stringify(newGoals));
  };

  const addGoal = () => {
    if (!newDhikrName.trim() || !newDhikrTarget || newDhikrTarget <= 0) return;

    const newGoal: DhikrGoal = {
      id: Date.now().toString(),
      name: newDhikrName.trim(),
      target: Number(newDhikrTarget),
      progress: 0,
      lastUpdated: new Date().toISOString()
    };

    saveGoals([...goals, newGoal]);
    setNewDhikrName('');
    setNewDhikrTarget('');
  };

  const updateProgress = (id: string, amount: number) => {
    const updated = goals.map(g => {
      if (g.id === id) {
        const newProgress = Math.min(g.progress + amount, g.target);
        return { ...g, progress: newProgress, lastUpdated: new Date().toISOString() };
      }
      return g;
    });
    saveGoals(updated);
  };

  const resetProgress = (id: string) => {
    const updated = goals.map(g => {
      if (g.id === id) {
        return { ...g, progress: 0, lastUpdated: new Date().toISOString() };
      }
      return g;
    });
    saveGoals(updated);
  };

  const deleteGoal = (id: string) => {
    saveGoals(goals.filter(g => g.id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
          <Target size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Daily Dhikr Tracker</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Définissez et suivez vos objectifs quotidiens de Dhikr</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Ajouter un objectif</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Nom du Dhikr (ex: Istighfar)"
            value={newDhikrName}
            onChange={(e) => setNewDhikrName(e.target.value)}
            className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
          />
          <input
            type="number"
            placeholder="Objectif (ex: 100)"
            value={newDhikrTarget}
            onChange={(e) => setNewDhikrTarget(e.target.value ? Number(e.target.value) : '')}
            className="w-full sm:w-32 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
            min="1"
          />
          <button
            onClick={addGoal}
            disabled={!newDhikrName.trim() || !newDhikrTarget}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <Plus size={18} /> Ajouter
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {goals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Aucun objectif défini. Ajoutez-en un ci-dessus.</p>
          </div>
        ) : (
          goals.map(goal => {
            const isCompleted = goal.progress >= goal.target;
            const percentage = Math.min(100, Math.round((goal.progress / goal.target) * 100));

            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{goal.name}</h3>
                      {isCompleted && <CheckCircle2 size={18} className="text-emerald-500" />}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Objectif : <span className="font-semibold">{goal.target}</span>
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => updateProgress(goal.id, 1)}
                      disabled={isCompleted}
                      className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-lg disabled:opacity-50 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                    >
                      +1
                    </button>
                    <button
                      onClick={() => updateProgress(goal.id, 10)}
                      disabled={isCompleted}
                      className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-sm disabled:opacity-50 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                    >
                      +10
                    </button>
                    <button
                      onClick={() => updateProgress(goal.id, 33)}
                      disabled={isCompleted}
                      className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-sm disabled:opacity-50 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                    >
                      +33
                    </button>
                    <button
                      onClick={() => updateProgress(goal.id, 100)}
                      disabled={isCompleted}
                      className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-sm disabled:opacity-50 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors hidden sm:flex"
                    >
                      +100
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-xs font-bold text-gray-500 dark:text-gray-400 mb-2">
                    <span>Progrès : {goal.progress} / {goal.target}</span>
                    <span>{percentage}%</span>
                  </div>
                  <div className="h-3 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${isCompleted ? 'bg-emerald-500' : 'bg-emerald-400'} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 border-t border-gray-100 dark:border-gray-700 pt-4 mt-4">
                  <button
                    onClick={() => resetProgress(goal.id)}
                    className="p-2 text-gray-400 hover:text-amber-500 transition-colors rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    title="Réinitialiser le progrès"
                  >
                    <RotateCcw size={18} />
                  </button>
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    title="Supprimer l'objectif"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};
