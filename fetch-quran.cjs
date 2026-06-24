const fs = require('fs');
const https = require('https');

async function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function buildQuranJson() {
  console.log('Fetching Arabic Quran...');
  const arData = await fetchJson('https://api.alquran.cloud/v1/quran/quran-simple');
  console.log('Fetching French Quran...');
  const frData = await fetchJson('https://api.alquran.cloud/v1/quran/fr.hamidullah');

  const surahs = [];

  for (let i = 0; i < 114; i++) {
    const arSurah = arData.data.surahs[i];
    const frSurah = frData.data.surahs[i];

    const ayahs = [];
    for (let j = 0; j < arSurah.ayahs.length; j++) {
      ayahs.push({
        id: arSurah.ayahs[j].number,
        inSurah: arSurah.ayahs[j].numberInSurah,
        ar: arSurah.ayahs[j].text,
        arClean: arSurah.ayahs[j].text.replace(/[\u064B-\u065F\u0670]/g, ''),
        fr: frSurah.ayahs[j].text
      });
    }

    surahs.push({
      id: arSurah.number,
      name: arSurah.name,
      transliteration: arSurah.englishName,
      ayahs
    });
  }

  const outputDir = './public';
  if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(`${outputDir}/quran.json`, JSON.stringify(surahs));
  console.log('Saved to src/data/quran.json');
}

buildQuranJson().catch(console.error);
