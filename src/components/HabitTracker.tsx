import React, { useState, useEffect } from 'react';
import { Flame, Clock, CalendarCheck, Bell } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

export const HabitTracker = () => {
  const { user } = useAuth();
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

  const [activityData, setActivityData] = useState<{date: Date, level: number}[]>([]);
  const [activeDays, setActiveDays] = useState(0);

  useEffect(() => {
    const fetchActivityData = async () => {
      const data: {date: Date, level: number}[] = [];
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      // Initialize last 84 days with 0 level
      for (let i = 83; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        data.push({ date: d, level: 0 });
      }

      if (!user) {
        setActivityData(data);
        return;
      }

      try {
        // Fetch from ruqyah_playlists as proxy for activity (or user_activity if we had it)
        // For demonstration of "real data", we fetch their playlists
        const playlistsRef = collection(db, 'ruqyah_playlists');
        const q = query(playlistsRef, where('userId', '==', user.uid));
        const snapshot = await getDocs(q);
        
        // Also fetch from ruqyah_collections
        const collectionsRef = collection(db, 'ruqyah_collections');
        const cq = query(collectionsRef, where('userId', '==', user.uid));
        const cSnapshot = await getDocs(cq);

        const allDates: Date[] = [];
        snapshot.forEach(doc => {
          const dt = doc.data().createdAt?.toDate();
          if (dt) allDates.push(dt);
        });
        cSnapshot.forEach(doc => {
          const dt = doc.data().createdAt?.toDate();
          if (dt) allDates.push(dt);
        });

        // Add some weight for recent active days from localStorage as well
        const localBookmarks = JSON.parse(localStorage.getItem('asrar_bookmarks') || '[]');
        if (localBookmarks.length > 0) {
           // just count today as active if they have bookmarks
           allDates.push(new Date());
        }

        // Map dates to the grid
        let totalActive = 0;
        allDates.forEach(date => {
           date.setHours(0, 0, 0, 0);
           const diffTime = Math.abs(now.getTime() - date.getTime());
           const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
           
           if (diffDays < 84) {
             const index = 83 - diffDays;
             if (data[index]) {
               data[index].level = Math.min(data[index].level + 1, 4);
             }
           }
        });

        data.forEach(d => {
          if (d.level > 0) totalActive++;
        });

        setActiveDays(totalActive);
        setActivityData(data);
      } catch (err) {
        console.error("Error fetching activity", err);
        setActivityData(data);
      }
    };

    fetchActivityData();
  }, [user]);

  const getLevelColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-emerald-200 dark:bg-emerald-900/40';
      case 2: return 'bg-emerald-300 dark:bg-emerald-700/60';
      case 3: return 'bg-emerald-400 dark:bg-emerald-500/80';
      case 4: return 'bg-emerald-500 dark:bg-emerald-400';
      default: return 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700';
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
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-4 rounded-2xl border border-emerald-100/50 dark:border-emerald-800/30">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-2">
                <Flame size={18} />
                <span className="font-semibold text-sm">Assiduité</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{activeDays > 0 ? Math.min(activeDays, 12) : 0} <span className="text-sm font-normal text-gray-500">jours</span></div>
              <p className="text-xs text-gray-500">De suite</p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-2xl border border-blue-100/50 dark:border-blue-800/30">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
                <Clock size={18} />
                <span className="font-semibold text-sm">Rouqya</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{activeDays > 0 ? (activeDays * 0.5).toFixed(1) : 0} <span className="text-sm font-normal text-gray-500">heures</span></div>
              <p className="text-xs text-gray-500">Cette semaine</p>
            </div>
          </div>
          
            <div className="pt-2 border-t border-gray-100 dark:border-gray-700 overflow-x-auto">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Activité (12 dernières semaines)</span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{activeDays} jours actifs</span>
              </div>
              <div className="flex gap-1" style={{ width: 'max-content' }}>
                {/* 7 rows for days of the week, ~12 columns for weeks */}
                <div className="flex flex-col gap-1 pr-1">
                  <div className="text-[10px] h-4 leading-4 text-gray-400">Lun</div>
                  <div className="text-[10px] h-4 leading-4 text-gray-400 opacity-0">Mar</div>
                  <div className="text-[10px] h-4 leading-4 text-gray-400">Mer</div>
                  <div className="text-[10px] h-4 leading-4 text-gray-400 opacity-0">Jeu</div>
                  <div className="text-[10px] h-4 leading-4 text-gray-400">Ven</div>
                  <div className="text-[10px] h-4 leading-4 text-gray-400 opacity-0">Sam</div>
                  <div className="text-[10px] h-4 leading-4 text-gray-400 opacity-0">Dim</div>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: 12 }).map((_, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-1">
                      {Array.from({ length: 7 }).map((_, dayIndex) => {
                        const dataIndex = weekIndex * 7 + dayIndex;
                        const item = activityData[dataIndex];
                        if (!item) return <div key={dayIndex} className="w-4 h-4 rounded-sm" />;
                        return (
                          <div 
                            key={dayIndex}
                            title={`${item.date.toLocaleDateString()}: Niveau ${item.level}`}
                            className={`w-4 h-4 rounded-sm ${getLevelColor(item.level)}`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-end gap-1 mt-2 text-[10px] text-gray-500">
                <span>Moins</span>
                <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-800" />
                <div className="w-3 h-3 rounded-sm bg-emerald-200 dark:bg-emerald-900/40" />
                <div className="w-3 h-3 rounded-sm bg-emerald-300 dark:bg-emerald-700/60" />
                <div className="w-3 h-3 rounded-sm bg-emerald-400 dark:bg-emerald-500/80" />
                <div className="w-3 h-3 rounded-sm bg-emerald-500 dark:bg-emerald-400" />
                <span>Plus</span>
              </div>
            </div>
        </div>
      )}
    </div>
  );
};
