import React from 'react';
import { useAudio } from '../contexts/AudioContext';
import { Play, Pause, SkipForward, SkipBack, X, Volume2, Settings2 } from 'lucide-react';
import { useState } from 'react';

export const AudioPlayer: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);
  const { 
    currentTrack, 
    isPlaying, 
    progress, 
    playTrack, 
    pause, 
    resume, 
    next, 
    prev,
    clear,
    seek,
    duration,
    currentTime,
    currentEffect,
    setAudioEffect
  } = useAudio();

  if (!currentTrack) return null;

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    seek(percentage * duration);
  };

  const formatTime = (timeInSeconds: number) => {
    if (!timeInSeconds || isNaN(timeInSeconds)) return "00:00";
    const m = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
    const s = Math.floor(timeInSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div 
      className="fixed left-0 right-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 shadow-lg px-4 py-3"
      style={{ bottom: 'calc(4rem + env(safe-area-inset-bottom, 0px))' }}
    >
      {/* Progress bar */}
      <div 
        className="absolute top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 cursor-pointer"
        onClick={handleProgressBarClick}
      >
        <div 
          className="h-full bg-emerald-500 transition-all duration-150" 
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex flex-col flex-1 min-w-0 pr-4">
          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {currentTrack.title}
          </p>
          <div className="flex items-center gap-2">
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {currentTrack.artist}
            </p>
            <span className="text-[10px] text-gray-400 font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={prev}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            <SkipBack size={20} />
          </button>
          
          <button 
            onClick={() => isPlaying ? pause() : resume()}
            className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 transition-colors shadow-md"
          >
            {isPlaying ? <Pause size={20} className="fill-current" /> : <Play size={20} className="fill-current ml-1" />}
          </button>
          
          <button 
            onClick={next}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            <SkipForward size={20} />
          </button>


          <div className="relative">
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 transition-colors ${showSettings ? 'text-emerald-500' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
              title="Égaliseur"
            >
              <Settings2 size={20} />
            </button>
            {showSettings && (
              <div className="absolute bottom-full right-0 mb-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-2 z-50">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">Égaliseur</h4>
                <div className="space-y-1">
                  {[
                    { id: 'normal', label: 'Normal' },
                    { id: 'slow', label: 'Récitation Lente' },
                    { id: 'echo', label: 'Écho (Méditation)' },
                    { id: 'clarity', label: 'Clarté Vocale' }
                  ].map(effect => (
                    <button
                      key={effect.id}
                      onClick={() => { setAudioEffect(effect.id as any); setShowSettings(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${currentEffect === effect.id ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400 font-medium' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                    >
                      {effect.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={clear}
            className="p-2 ml-2 text-gray-400 hover:text-red-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
