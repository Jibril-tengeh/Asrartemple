import React, { useState, useEffect } from 'react';
import { Flame, Clock, CalendarCheck, Bell } from 'lucide-react';

export const HabitTracker = () => {
  const [reminders, setReminders] = useState<{id: string, text: string, time: string}[]>([
    { id: '1', text: 'Rappel quotidien pour mon Wird', time: '18:00' },
    { id: '2', text: 'Écoute de la Rouqya', time: '08:00' }
  ]);
  const [showReminders, setShowReminders] = useState(false);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setIsNotificationsEnabled(Notification.permission === 'granted');
    }
  }, []);

  const requestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setIsNotificationsEnabled(permission === 'granted');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700 h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <CalendarCheck className="text-emerald-500" size={18} /> Mon Suivi
        </h3>
        <button onClick={() => setShowReminders(!showReminders)} className={`text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors ${showReminders ? 'text-emerald-500' : ''}`}>
          <Bell size={18} />
        </button>
      </div>

      {showReminders ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200">Mes Rappels</h4>
            {!isNotificationsEnabled && (
              <button onClick={requestPermission} className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400 px-2 py-1 rounded-full font-medium">
                Activer Notifications
              </button>
            )}
          </div>
          {reminders.map(r => (
            <div key={r.id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700/50">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{r.text}</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-1 rounded-md">{r.time}</span>
            </div>
          ))}
          <button className="w-full text-center text-sm text-emerald-600 font-medium p-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-colors">
            + Ajouter un rappel
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-4 rounded-2xl border border-emerald-100/50 dark:border-emerald-800/30">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-2">
              <Flame size={18} />
              <span className="font-semibold text-sm">Assiduité</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">12 <span className="text-sm font-normal text-gray-500">jours</span></div>
            <p className="text-xs text-gray-500">De suite</p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-2xl border border-blue-100/50 dark:border-blue-800/30">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
              <Clock size={18} />
              <span className="font-semibold text-sm">Rouqya</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">4.5 <span className="text-sm font-normal text-gray-500">heures</span></div>
            <p className="text-xs text-gray-500">Cette semaine</p>
          </div>
          
          <div className="col-span-2 mt-2">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Régularité des Wirds</span>
              <span className="font-bold text-emerald-600">85%</span>
            </div>
            <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
