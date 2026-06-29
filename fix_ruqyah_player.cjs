const fs = require('fs');
let content = fs.readFileSync('src/pages/user/tools/Ruqyah.tsx', 'utf8');

// Imports for useAudio
const hookRegex = /const \{ playPlaylist, currentTrack, isPlaying: globalIsPlaying, pause: globalPause, resume: globalResume, loopMode, setLoopMode, next, prev \} = useAudio\(\);/;
const hookReplacement = `const { playPlaylist, currentTrack, isPlaying: globalIsPlaying, pause: globalPause, resume: globalResume, loopMode, setLoopMode, next, prev, progress, currentTime, duration, seek, audioEffect, setAudioEffect } = useAudio();
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return \`\${minutes.toString().padStart(2, '0')}:\${seconds.toString().padStart(2, '0')}\`;
  };
`;
if (content.match(hookRegex)) {
  content = content.replace(hookRegex, hookReplacement);
}

// Replace the dummy progress bar and secondary controls
const targetUI = `{/* Secondary controls */}
                <div className="w-full flex justify-between items-center px-2 mb-8 text-white/50">
                  <button><Settings2 size={20} /></button>
                  <button><Volume2 size={20} /></button>
                  <button><AlarmClock size={20} /></button>
                  <button className="flex flex-col items-center"><Gauge size={20} /><span className="text-[10px] mt-1">1.0x</span></button>
                  <button><ListMusic size={20} /></button>
                </div>

                {/* Progress (Dummy since we don't have real progress exposed easily, we just simulate the UI) */}
                <div className="w-full mb-8">
                  <div className="h-1 bg-white/20 rounded-full mb-3 relative">
                    <div className="absolute left-0 top-0 h-full w-1/3 bg-white rounded-full"></div>
                    <div className="absolute left-1/3 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <div className="flex justify-between text-xs text-white/50 font-medium">
                    <span>00:07</span>
                    <span>10:00</span>
                  </div>
                </div>`;

const replacementUI = `{/* Secondary controls */}
                <div className="w-full flex justify-between items-center px-2 mb-8 text-white/50 relative">
                  <button onClick={() => {
                    if (audioEffect === 'echo') setAudioEffect('normal');
                    else if (audioEffect === 'normal') setAudioEffect('clarity');
                    else setAudioEffect('echo');
                    alert(\`Effet sonore : \${audioEffect === 'echo' ? 'Normal' : audioEffect === 'normal' ? 'Clarté' : 'Écho'}\`);
                  }} className={audioEffect !== 'normal' ? 'text-[#41c5c5]' : ''}><Settings2 size={20} /></button>
                  <button onClick={() => alert('Le volume est géré par votre appareil')}><Volume2 size={20} /></button>
                  <button onClick={() => alert('Minuteur de sommeil bientôt disponible')}><AlarmClock size={20} /></button>
                  <button onClick={() => {
                    const nextSpeed = playbackSpeed === 1 ? 1.5 : playbackSpeed === 1.5 ? 2 : playbackSpeed === 2 ? 0.5 : 1;
                    setPlaybackSpeed(nextSpeed);
                    const audioEl = document.querySelector('audio');
                    if (audioEl) audioEl.playbackRate = nextSpeed;
                  }} className="flex flex-col items-center">
                    <Gauge size={20} className={playbackSpeed !== 1 ? 'text-[#41c5c5]' : ''} />
                    <span className={\`text-[10px] mt-1 \${playbackSpeed !== 1 ? 'text-[#41c5c5]' : ''}\`}>{playbackSpeed}x</span>
                  </button>
                  <button onClick={() => setIsFullPlayer(false)}><ListMusic size={20} /></button>
                </div>

                {/* Progress */}
                <div className="w-full mb-8 relative group">
                  <div 
                    className="h-2 bg-white/20 rounded-full mb-3 relative cursor-pointer"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const percent = (e.clientX - rect.left) / rect.width;
                      seek(percent * duration);
                    }}
                  >
                    <div className="absolute left-0 top-0 h-full bg-white rounded-full pointer-events-none" style={{ width: \`\${progress * 100}%\` }}></div>
                    <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow cursor-grab active:cursor-grabbing" style={{ left: \`calc(\${progress * 100}% - 8px)\` }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-white/50 font-medium">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>`;

if (content.includes('Progress (Dummy since we don\'t have real progress exposed easily')) {
  content = content.replace(targetUI, replacementUI);
  fs.writeFileSync('src/pages/user/tools/Ruqyah.tsx', content);
  console.log("Successfully updated UI with real audio progress and controls!");
} else {
  console.log("Target UI not found.");
}
