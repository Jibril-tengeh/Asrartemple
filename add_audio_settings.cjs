const fs = require('fs');

let content = fs.readFileSync('src/components/AudioPlayer.tsx', 'utf8');

content = content.replace(
  "import { Play, Pause, SkipForward, SkipBack, X, Volume2 } from 'lucide-react';",
  "import { Play, Pause, SkipForward, SkipBack, X, Volume2, Settings2 } from 'lucide-react';\nimport { useState } from 'react';"
);

content = content.replace(
  "export const AudioPlayer: React.FC = () => {",
  "export const AudioPlayer: React.FC = () => {\n  const [showSettings, setShowSettings] = useState(false);"
);

content = content.replace(
  "    currentTime\n  } = useAudio();",
  "    currentTime,\n    currentEffect,\n    setAudioEffect\n  } = useAudio();"
);

const settingsDropdown = `
          <div className="relative">
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className={\`p-2 transition-colors \${showSettings ? 'text-emerald-500' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}\`}
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
                      className={\`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors \${currentEffect === effect.id ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400 font-medium' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}\`}
                    >
                      {effect.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
`;

content = content.replace(
  "          <button \n            onClick={clear}",
  settingsDropdown + "\n          <button \n            onClick={clear}"
);

fs.writeFileSync('src/components/AudioPlayer.tsx', content);
