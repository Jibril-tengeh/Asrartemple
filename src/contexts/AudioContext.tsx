import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';

export type Track = {
  id: string;
  title: string;
  url: string;
  artist: string;
  coverImage?: string;
  backgroundImage?: string;
};

export type LoopMode = 'off' | 'track' | 'playlist';

interface AudioContextType {
  currentTrack: Track | null;
  playlist: Track[];
  isPlaying: boolean;
  progress: number; // 0 to 1
  currentTime: number;
  duration: number;
  loopMode: LoopMode;
  setLoopMode: (mode: LoopMode) => void;
  playTrack: (track: Track) => void;
  playPlaylist: (tracks: Track[], startIndex?: number) => void;
  pause: () => void;
  resume: () => void;
  next: () => void;
  prev: () => void;
  seek: (time: number) => void;
  clear: () => void;
  setVolume: (volume: number) => void;
  volume: number;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [loopMode, setLoopMode] = useState<LoopMode>('off');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Use refs for state accessed in event listeners
  const stateRef = useRef({ playlist, currentIndex, loopMode });
  useEffect(() => {
    stateRef.current = { playlist, currentIndex, loopMode };
  }, [playlist, currentIndex, loopMode]);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume;

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress(audio.duration ? audio.currentTime / audio.duration : 0);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      const { playlist: currentPlaylist, currentIndex: currentIdx, loopMode: currentLoopMode } = stateRef.current;
      
      if (currentLoopMode === 'track') {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(console.error);
        }
      } else if (currentIdx < currentPlaylist.length - 1) {
        const newIndex = currentIdx + 1;
        setCurrentIndex(newIndex);
        setCurrentTrack(currentPlaylist[newIndex]);
      } else if (currentLoopMode === 'playlist' && currentPlaylist.length > 0) {
        setCurrentIndex(0);
        setCurrentTrack(currentPlaylist[0]);
      } else {
        setIsPlaying(false);
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  useEffect(() => {
    let objectUrl: string | null = null;

    const loadAudio = async () => {
      if (audioRef.current && currentTrack) {
        try {
          const cache = await caches.open('quran-audio-cache');
          const response = await cache.match(currentTrack.url);
          
          if (response) {
            const blob = await response.blob();
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
              if (audioRef.current) {
                audioRef.current.src = reader.result as string;
                audioRef.current.play().catch(e => console.error("Audio playback error:", e));
              }
            };
            return; // Exit early since FileReader is async
          } else {
            audioRef.current.src = currentTrack.url;
          }

          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch(e => {
              if (e.name !== 'AbortError') {
                console.error("Audio playback error:", e);
              }
            });
          }
        } catch (error) {
          console.error("Cache error", error);
          if (audioRef.current) {
            audioRef.current.src = currentTrack.url;
            audioRef.current.play().catch(e => console.error(e));
          }
        }
      }
    };

    loadAudio();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [currentTrack]);

  const playTrack = (track: Track) => {
    setPlaylist([track]);
    setCurrentIndex(0);
    setCurrentTrack(track);
  };

  const playPlaylist = (tracks: Track[], startIndex = 0) => {
    if (tracks.length === 0) return;
    setPlaylist(tracks);
    setCurrentIndex(startIndex);
    setCurrentTrack(tracks[startIndex]);
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const resume = () => {
    if (audioRef.current && currentTrack) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(e => {
          if (e.name !== 'AbortError') {
            console.error("Audio playback error:", e);
          }
        });
      }
    }
  };

  const next = () => {
    if (currentIndex < playlist.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setCurrentTrack(playlist[newIndex]);
    } else if (loopMode === 'playlist' && playlist.length > 0) {
      setCurrentIndex(0);
      setCurrentTrack(playlist[0]);
    } else {
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  };

  const prev = () => {
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setCurrentTrack(playlist[newIndex]);
    } else {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const clear = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    setPlaylist([]);
    setCurrentIndex(-1);
    setCurrentTrack(null);
    setIsPlaying(false);
  };

  const setVolume = (vol: number) => {
    setVolumeState(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  return (
    <AudioContext.Provider value={{
      currentTrack,
      playlist,
      isPlaying,
      progress,
      currentTime,
      duration,
      loopMode,
      setLoopMode,
      playTrack,
      playPlaylist,
      pause,
      resume,
      next,
      prev,
      seek,
      clear,
      setVolume,
      volume
    }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
