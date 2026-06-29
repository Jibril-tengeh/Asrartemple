const fs = require('fs');

let content = fs.readFileSync('src/contexts/AudioContext.tsx', 'utf8');

// Update Track type
content = content.replace(
`export type Track = {
  id: string;
  title: string;
  url: string;
  artist: string;
  coverImage?: string;
  backgroundImage?: string;
};`,
`export type Track = {
  id: string;
  title: string;
  url: string;
  artist: string;
  coverImage?: string;
  backgroundImage?: string;
  isCollection?: boolean;
  subTracks?: Track[];
};`
);

// Add currentSubIndex state
content = content.replace(
`  const [currentIndex, setCurrentIndex] = useState(-1);`,
`  const [currentIndex, setCurrentIndex] = useState(-1);
  const [currentSubIndex, setCurrentSubIndex] = useState(-1);`
);

// Update stateRef
content = content.replace(
`  const stateRef = useRef({ playlist, currentIndex, loopMode });
  useEffect(() => {
    stateRef.current = { playlist, currentIndex, loopMode };
  }, [playlist, currentIndex, loopMode]);`,
`  const stateRef = useRef({ playlist, currentIndex, loopMode, currentSubIndex, currentTrack });
  useEffect(() => {
    stateRef.current = { playlist, currentIndex, loopMode, currentSubIndex, currentTrack };
  }, [playlist, currentIndex, loopMode, currentSubIndex, currentTrack]);`
);

// Update handleEnded
content = content.replace(
`    const handleEnded = () => {
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
    };`,
`    const handleEnded = () => {
      const { playlist: currentPlaylist, currentIndex: currentIdx, loopMode: currentLoopMode, currentSubIndex: currSubIdx, currentTrack: currTrack } = stateRef.current;
      
      if (currentLoopMode === 'track') {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(console.error);
        }
      } else if (currTrack?.isCollection && currTrack.subTracks && currSubIdx < currTrack.subTracks.length - 1) {
        setCurrentSubIndex(currSubIdx + 1);
      } else if (currentIdx < currentPlaylist.length - 1) {
        const newIndex = currentIdx + 1;
        setCurrentIndex(newIndex);
        setCurrentSubIndex(currentPlaylist[newIndex]?.isCollection ? 0 : -1);
        setCurrentTrack(currentPlaylist[newIndex]);
      } else if (currentLoopMode === 'playlist' && currentPlaylist.length > 0) {
        setCurrentIndex(0);
        setCurrentSubIndex(currentPlaylist[0]?.isCollection ? 0 : -1);
        setCurrentTrack(currentPlaylist[0]);
      } else {
        setIsPlaying(false);
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      }
    };`
);

// Update loadAudio
content = content.replace(
`  useEffect(() => {
    let objectUrl: string | null = null;

    const loadAudio = async () => {
      if (audioRef.current && currentTrack) {
        try {
          const cache = await caches.open('quran-audio-cache');
          const response = await cache.match(currentTrack.url);`,
`  useEffect(() => {
    let objectUrl: string | null = null;

    const loadAudio = async () => {
      if (audioRef.current && currentTrack) {
        const activeUrl = (currentTrack.isCollection && currentTrack.subTracks) 
          ? (currentTrack.subTracks[currentSubIndex]?.url || currentTrack.url)
          : currentTrack.url;
          
        if (!activeUrl) return;

        try {
          const cache = await caches.open('quran-audio-cache');
          const response = await cache.match(activeUrl);`
);

content = content.replace(
`          } else {
            audioRef.current.src = currentTrack.url;
          }`,
`          } else {
            audioRef.current.src = activeUrl;
          }`
);

content = content.replace(
`          if (audioRef.current) {
            audioRef.current.src = currentTrack.url;
            audioRef.current.play().catch(e => console.error(e));
          }`,
`          if (audioRef.current) {
            audioRef.current.src = activeUrl;
            audioRef.current.play().catch(e => console.error(e));
          }`
);

// Need to change the dependency array of loadAudio effect
content = content.replace(
`    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [currentTrack]);`,
`    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [currentTrack, currentSubIndex]);`
);


// Update playTrack
content = content.replace(
`  const playTrack = (track: Track) => {
    setPlaylist([track]);
    setCurrentIndex(0);
    setCurrentTrack(track);
  };`,
`  const playTrack = (track: Track) => {
    setPlaylist([track]);
    setCurrentIndex(0);
    setCurrentSubIndex(track.isCollection ? 0 : -1);
    setCurrentTrack(track);
  };`
);

// Update playPlaylist
content = content.replace(
`  const playPlaylist = (tracks: Track[], startIndex = 0) => {
    if (tracks.length === 0) return;
    setPlaylist(tracks);
    setCurrentIndex(startIndex);
    setCurrentTrack(tracks[startIndex]);
  };`,
`  const playPlaylist = (tracks: Track[], startIndex = 0) => {
    if (tracks.length === 0) return;
    setPlaylist(tracks);
    setCurrentIndex(startIndex);
    setCurrentSubIndex(tracks[startIndex]?.isCollection ? 0 : -1);
    setCurrentTrack(tracks[startIndex]);
  };`
);

// Update next
content = content.replace(
`  const next = () => {
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
  };`,
`  const next = () => {
    if (currentTrack?.isCollection && currentTrack.subTracks && currentSubIndex < currentTrack.subTracks.length - 1) {
      setCurrentSubIndex(currentSubIndex + 1);
      return;
    }
    if (currentIndex < playlist.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setCurrentSubIndex(playlist[newIndex]?.isCollection ? 0 : -1);
      setCurrentTrack(playlist[newIndex]);
    } else if (loopMode === 'playlist' && playlist.length > 0) {
      setCurrentIndex(0);
      setCurrentSubIndex(playlist[0]?.isCollection ? 0 : -1);
      setCurrentTrack(playlist[0]);
    } else {
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  };`
);

// Update prev
content = content.replace(
`  const prev = () => {
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
  };`,
`  const prev = () => {
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }
    if (currentTrack?.isCollection && currentTrack.subTracks && currentSubIndex > 0) {
      setCurrentSubIndex(currentSubIndex - 1);
      return;
    }
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setCurrentSubIndex(playlist[newIndex]?.isCollection ? (playlist[newIndex].subTracks?.length || 1) - 1 : -1);
      setCurrentTrack(playlist[newIndex]);
    } else {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
    }
  };`
);

content = content.replace(
`    setPlaylist([]);
    setCurrentIndex(-1);
    setCurrentTrack(null);
    setIsPlaying(false);`,
`    setPlaylist([]);
    setCurrentIndex(-1);
    setCurrentSubIndex(-1);
    setCurrentTrack(null);
    setIsPlaying(false);`
);

// Export currentSubIndex from context
content = content.replace(
`  currentTrack: Track | null;
  playlist: Track[];
  isPlaying: boolean;`,
`  currentTrack: Track | null;
  playlist: Track[];
  isPlaying: boolean;
  currentSubIndex: number;`
);

content = content.replace(
`      playlist,
      isPlaying,
      progress,`,
`      playlist,
      isPlaying,
      currentSubIndex,
      progress,`
);

fs.writeFileSync('src/contexts/AudioContext.tsx', content);
