import React, { useState, useEffect } from 'react';
import { Settings, Shield, Volume2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminSettings: React.FC = () => {
  const [audioEnabled, setAudioEnabled] = useState(false);

  useEffect(() => {
    const isEnabled = localStorage.getItem('admin_ruqyah_audio_enabled') === 'true';
    setAudioEnabled(isEnabled);
  }, []);

  const toggleAudio = () => {
    const newVal = !audioEnabled;
    setAudioEnabled(newVal);
    localStorage.setItem('admin_ruqyah_audio_enabled', String(newVal));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24 border-none min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Shield className="text-red-500" />
            Panel d'Administration
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Gérer les fonctionnalités globales de l'application</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl">
              <Settings size={24} />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Paramètres des Outils</h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-750 border border-gray-100 dark:border-gray-700 rounded-2xl">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Volume2 size={18} className="text-emerald-500" />
                  Lecture Audio (Ruqyah)
                </h3>
                <p className="text-sm text-gray-500 mt-1">Activer la lecture Ayat par Ayat dans la Ruqyah</p>
              </div>
              <button
                onClick={toggleAudio}
                className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors ${
                  audioEnabled ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <div
                  className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${
                    audioEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
