const fs = require('fs');

let content = fs.readFileSync('src/contexts/AudioContext.tsx', 'utf8');

// Add types
content = content.replace(
  "export type LoopMode = 'off' | 'track' | 'playlist';",
  "export type LoopMode = 'off' | 'track' | 'playlist';\nexport type AudioEffect = 'normal' | 'slow' | 'echo' | 'clarity';"
);

// Add state and effect logic
content = content.replace(
  "const [loopMode, setLoopMode] = useState<LoopMode>('off');",
  `const [loopMode, setLoopMode] = useState<LoopMode>('off');
  const [currentEffect, setCurrentEffect] = useState<AudioEffect>('normal');
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const delayNodeRef = useRef<DelayNode | null>(null);
  const feedbackNodeRef = useRef<GainNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const webAudioInitialized = useRef(false);`
);

// update audio initialization
content = content.replace(
  "audioRef.current = new Audio();",
  "audioRef.current = new Audio();\n    audioRef.current.crossOrigin = 'anonymous';"
);

// Export state and functions
content = content.replace(
  "  setLoopMode: (mode: LoopMode) => void;",
  `  setLoopMode: (mode: LoopMode) => void;
  currentEffect: AudioEffect;
  setAudioEffect: (effect: AudioEffect) => void;`
);

content = content.replace(
  "      setLoopMode,",
  `      setLoopMode,
      currentEffect,
      setAudioEffect: (effect: AudioEffect) => {
        setCurrentEffect(effect);
        applyEffect(effect);
      },`
);

// We need an applyEffect function inside the component
const applyEffectStr = `
  const initWebAudio = () => {
    if (webAudioInitialized.current || !audioRef.current) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;
      
      const source = ctx.createMediaElementSource(audioRef.current);
      sourceNodeRef.current = source;
      
      // Create nodes
      const delay = ctx.createDelay();
      delay.delayTime.value = 0.3;
      const feedback = ctx.createGain();
      feedback.gain.value = 0.3;
      
      delay.connect(feedback);
      feedback.connect(delay);
      
      delayNodeRef.current = delay;
      feedbackNodeRef.current = feedback;
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'peaking';
      filter.frequency.value = 3000;
      filter.Q.value = 1.5;
      filter.gain.value = 5;
      
      filterNodeRef.current = filter;
      
      // Default connection
      source.connect(ctx.destination);
      
      webAudioInitialized.current = true;
    } catch (e) {
      console.warn("Web Audio API not supported or failed to init", e);
    }
  };

  const applyEffect = (effect: AudioEffect) => {
    if (!audioRef.current) return;
    
    // Always init context if possible when setting effect
    if (!webAudioInitialized.current) {
      initWebAudio();
    }
    
    const ctx = audioContextRef.current;
    const source = sourceNodeRef.current;
    const delay = delayNodeRef.current;
    const filter = filterNodeRef.current;
    
    // Playback rate for slow
    if (effect === 'slow') {
      audioRef.current.playbackRate = 0.75;
    } else {
      audioRef.current.playbackRate = 1.0;
    }
    
    if (!ctx || !source || !delay || !filter) return;
    
    // Disconnect everything
    source.disconnect();
    delay.disconnect();
    filter.disconnect();
    
    // Reconnect based on effect
    if (effect === 'echo') {
      source.connect(delay);
      delay.connect(ctx.destination);
      source.connect(ctx.destination); // original audio + echo
    } else if (effect === 'clarity') {
      source.connect(filter);
      filter.connect(ctx.destination);
    } else {
      // Normal or slow (just playbackRate)
      source.connect(ctx.destination);
    }
  };
`;

content = content.replace(
  "  useEffect(() => {",
  applyEffectStr + "\n  useEffect(() => {"
);

// Apply effect initially or when starting play
content = content.replace(
  "const handlePlay = () => setIsPlaying(true);",
  "const handlePlay = () => {\n      setIsPlaying(true);\n      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {\n        audioContextRef.current.resume();\n      }\n    };"
);

fs.writeFileSync('src/contexts/AudioContext.tsx', content);
