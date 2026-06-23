import React, { useState, useEffect } from 'react';
import { Clock, ArrowLeft, Sun, Moon, Info, Settings2, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

const planets = [
  { name: 'Soleil', arabic: 'الشمس', color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30', border: 'border-amber-200 dark:border-amber-800', desc: 'Succès, pouvoir, guérison, illumination' },
  { name: 'Vénus', arabic: 'الزهرة', color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30', border: 'border-emerald-200 dark:border-emerald-800', desc: 'Amour, beauté, attraction, harmonie' },
  { name: 'Mercure', arabic: 'عطارد', color: 'text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30', border: 'border-blue-200 dark:border-blue-800', desc: 'Communication, intelligence, commerce, rapidité' },
  { name: 'Lune', arabic: 'القمر', color: 'text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800', border: 'border-slate-200 dark:border-slate-700', desc: 'Rêves, intuition, émotions, magie d\'eau' },
  { name: 'Saturne', arabic: 'زحل', color: 'text-zinc-600 dark:text-zinc-400', bg: 'bg-zinc-100 dark:bg-zinc-800', border: 'border-zinc-200 dark:border-zinc-700', desc: 'Discipline, karma, séparation, protection, bannissement' },
  { name: 'Jupiter', arabic: 'المشتري', color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30', border: 'border-orange-200 dark:border-orange-800', desc: 'Chance, richesse, expansion, justice' },
  { name: 'Mars', arabic: 'المريخ', color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30', border: 'border-red-200 dark:border-red-800', desc: 'Courage, force, conflit, victoire' }
];

// Chaldean sequence: Saturn -> Jupiter -> Mars -> Sun -> Venus -> Mercury -> Moon -> repeat
const chaldeanSequence = [4, 5, 6, 0, 1, 2, 3];

// Day rulers (Sunday = Sun, Monday = Moon...)
const dayRulerMap = [0, 3, 6, 2, 5, 1, 4]; // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat

export const PlanetaryHours: React.FC = () => {
  const [isDay, setIsDay] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [sunrise, setSunrise] = useState('06:00');
  const [sunset, setSunset] = useState('18:00');
  const [selectedDay, setSelectedDay] = useState(new Date().getDay()); // 0-6

  const daysOfWeek = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  const parseTime = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m; // minutes from midnight
  };

  const formatTime = (minutes: number) => {
    let rawH = Math.floor(minutes / 60);
    const h = rawH % 24;
    const m = Math.round(minutes % 60);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const calculateHours = () => {
    const sr = parseTime(sunrise);
    const ss = parseTime(sunset);
    
    // Handle sunset being before sunrise (next day)
    const ssAdjusted = ss <= sr ? ss + 24 * 60 : ss;
    const dayLength = ssAdjusted - sr;
    const nightLength = (24 * 60) - dayLength;

    const dayHourLength = dayLength / 12;
    const nightHourLength = nightLength / 12;

    const rulerPlanetIndex = dayRulerMap[selectedDay];
    const startIndexInSequence = chaldeanSequence.indexOf(rulerPlanetIndex);

    const generatedHours = [];

    // Calculate day hours
    for (let i = 0; i < 12; i++) {
      const pIndex = chaldeanSequence[(startIndexInSequence + i) % 7];
      const start = sr + (i * dayHourLength);
      const end = sr + ((i + 1) * dayHourLength);
      generatedHours.push({
        isDay: true,
        hourIndex: i + 1,
        planet: planets[pIndex],
        timeStart: formatTime(start),
        timeEnd: formatTime(end)
      });
    }

    // Calculate night hours
    for (let i = 0; i < 12; i++) {
      const pIndex = chaldeanSequence[(startIndexInSequence + 12 + i) % 7];
      const start = ssAdjusted + (i * nightHourLength);
      const end = ssAdjusted + ((i + 1) * nightHourLength);
      generatedHours.push({
        isDay: false,
        hourIndex: i + 1,
        planet: planets[pIndex],
        timeStart: formatTime(start),
        timeEnd: formatTime(end)
      });
    }

    return generatedHours;
  };

  const allHours = calculateHours();
  const currentViewHours = allHours.filter(h => h.isDay === isDay);

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link 
            to="/tools" 
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
          >
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Clock className="text-amber-500" />
              Heures Planétaires
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sa'at al-Falakiyya</p>
          </div>
        </div>
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className={`p-2 rounded-xl transition-colors ${showSettings ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500'}`}
        >
          <Settings2 size={24} />
        </button>
      </div>

      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Jour de la semaine</label>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map((day, idx) => (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(idx)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedDay === idx ? 'bg-amber-500 text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Lever du soleil</label>
                  <input 
                    type="time" 
                    value={sunrise}
                    onChange={(e) => setSunrise(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Coucher du soleil</label>
                  <input 
                    type="time" 
                    value={sunset}
                    onChange={(e) => setSunset(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/50 rounded-2xl p-4 mb-6 flex gap-3">
        <Info className="text-amber-500 shrink-0 mt-0.5" size={20} />
        <p className="text-sm text-amber-800 dark:text-amber-200">
          La première heure du jour commence au lever du soleil et est gouvernée par la planète du jour (ex: Soleil le dimanche).
          La durée d'une heure planétaire varie selon la saison.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-6">
        <button
          onClick={() => setIsDay(true)}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
            isDay 
            ? 'bg-white dark:bg-gray-700 text-amber-500 shadow-sm' 
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          <Sun size={18} /> Heures de Jour
        </button>
        <button
          onClick={() => setIsDay(false)}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
            !isDay 
            ? 'bg-white dark:bg-gray-700 text-indigo-400 shadow-sm' 
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          <Moon size={18} /> Heures de Nuit
        </button>
      </div>

      {/* List Array */}
      <div className="space-y-3">
        {currentViewHours.map((h, i) => (
          <motion.div 
            key={`${isDay ? 'd' : 'n'}-${i}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-2xl border ${h.planet.bg} ${h.planet.border} gap-4`}
          >
            <div className="flex items-center gap-4 flex-1">
              <div className={`w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center font-bold shadow-sm ${h.planet.color} shrink-0`}>
                {h.hourIndex}
              </div>
              <div className="flex-1 min-w-0">
                <span className="block text-sm text-gray-500 dark:text-gray-400 font-medium font-mono mb-0.5">
                  {h.timeStart} - {h.timeEnd}
                </span>
                <span className={`font-bold text-lg ${h.planet.color}`}>{h.planet.name}</span>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{h.planet.desc}</p>
              </div>
            </div>
            
            <div className="text-right shrink-0">
              <span className={`text-2xl font-bold font-arabic ${h.planet.color}`} dir="rtl">
                {h.planet.arabic}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
