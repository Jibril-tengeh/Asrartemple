const fs = require('fs');

const path = 'src/pages/user/tools/QuranFull.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add states
const stateInjection = `
  const [zoomedAyahTranslationLang, setZoomedAyahTranslationLang] = useState<'none' | 'fr' | 'en' | 'ha'>('none');
  const [zoomedAyahAspectRatio, setZoomedAyahAspectRatio] = useState<'auto' | '1:1' | '9:16' | '16:9'>('auto');
  const [zoomedArabicSize, setZoomedArabicSize] = useState<number>(36);
  const [zoomedTranslationSize, setZoomedTranslationSize] = useState<number>(18);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
`;

content = content.replace(
  'const [zoomedAyahColor, setZoomedAyahColor] = useState(0);',
  'const [zoomedAyahColor, setZoomedAyahColor] = useState(0);\n' + stateInjection
);

// 2. Add video generation function
const videoFunctionInjection = `
  const generateZoomedVideo = async () => {
    if (!zoomedAyah || !zoomedAyah.ayahNumber) return;
    setIsGeneratingVideo(true);
    
    try {
      const node = document.getElementById('zoomed-ayah-capture');
      if (!node) throw new Error("Node not found");
      
      const actionButtons = document.getElementById('zoomed-ayah-actions');
      const closeBtn = document.getElementById('zoomed-ayah-close');
      const imageFooter = document.getElementById('image-footer');
      
      if (actionButtons) actionButtons.style.display = 'none';
      if (closeBtn) closeBtn.style.display = 'none';
      if (imageFooter) imageFooter.style.display = 'flex';
      
      const dataUrl = await toPng(node, { cacheBust: true, backgroundColor: 'transparent' });
      
      if (actionButtons) actionButtons.style.display = 'flex';
      if (closeBtn) closeBtn.style.display = 'block';
      if (imageFooter) imageFooter.style.display = 'none';
      
      const audioUrl = \`https://cdn.islamic.network/quran/audio/128/ar.alafasy/\${zoomedAyah.ayahNumber}.mp3\`;
      const fileName = \`verset-\${zoomedAyah.surahName || 'quran'}-\${zoomedAyah.numberInSurah}\`;
      
      const canvas = document.createElement('canvas');
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = dataUrl;
      });
      
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      
      const audio = new Audio();
      audio.crossOrigin = 'anonymous';
      audio.src = audioUrl;
      
      await new Promise(r => audio.addEventListener('canplaythrough', r, { once: true }));
      
      // @ts-ignore
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const dest = audioCtx.createMediaStreamDestination();
      const source = audioCtx.createMediaElementSource(audio);
      source.connect(dest);
      source.connect(audioCtx.destination);
      
      const canvasStream = canvas.captureStream(30);
      const combinedStream = new MediaStream([
        ...canvasStream.getVideoTracks(),
        ...dest.stream.getAudioTracks()
      ]);
      
      const mimeType = MediaRecorder.isTypeSupported('video/webm') ? 'video/webm' : 'video/mp4';
      const recorder = new MediaRecorder(combinedStream, { mimeType });
      const chunks: BlobPart[] = [];
      
      recorder.ondataavailable = e => chunks.push(e.data);
      
      const recordingEnded = new Promise<void>((resolve) => {
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: mimeType });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName + (mimeType === 'video/mp4' ? '.mp4' : '.webm');
          a.click();
          URL.revokeObjectURL(url);
          audioCtx.close();
          resolve();
        };
      });
      
      recorder.start();
      audio.play();
      
      const drawFrame = () => {
        if (!audio.paused && !audio.ended) {
          ctx.drawImage(img, 0, 0);
          requestAnimationFrame(drawFrame);
        }
      };
      drawFrame();
      
      audio.onended = () => {
        recorder.stop();
      };
      
      await recordingEnded;
      
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la génération de la vidéo.");
    } finally {
      setIsGeneratingVideo(false);
    }
  };
`;

content = content.replace(
  'const [zoomedAyahColor, setZoomedAyahColor] = useState(0);',
  'const [zoomedAyahColor, setZoomedAyahColor] = useState(0);\n' + videoFunctionInjection
);

fs.writeFileSync(path, content);
