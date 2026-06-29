export const downloadAudioForOffline = async (
  urls: string[], 
  onProgress?: (progress: number, total: number) => void
) => {
  try {
    const cache = await caches.open('quran-audio-cache');
    let completed = 0;
    
    const batchSize = 5;
    for (let i = 0; i < urls.length; i += batchSize) {
      const batch = urls.slice(i, i + batchSize);
      await Promise.all(
        batch.map(async (url) => {
          try {
            const match = await cache.match(url);
            if (!match) {
              await cache.add(url);
            }
          } catch (e) {
            console.warn("Failed to cache " + url, e);
          } finally {
            completed++;
            if (onProgress) {
              onProgress(completed, urls.length);
            }
          }
        })
      );
    }
    
    return true;
  } catch (error) {
    console.error('Error downloading for offline:', error);
    return false;
  }
};
