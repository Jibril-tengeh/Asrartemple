const fs = require('fs');
const en = JSON.parse(fs.readFileSync('./src/i18n/en.json', 'utf8'));
const ha = JSON.parse(fs.readFileSync('./src/i18n/ha.json', 'utf8'));

const translations = { en, ha };
const language = 'ha';

const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) {
      if (value[k] === undefined) {
        // Fallback to English if key doesn't exist
        let fallbackValue = translations['en'];
        for (const fbK of keys) {
          if (fallbackValue && fallbackValue[fbK] !== undefined) {
            fallbackValue = fallbackValue[fbK];
          } else {
            return key; // return key if not found
          }
        }
        return fallbackValue;
      }
      value = value[k];
    }
    return value;
};

console.log(t('tools.abjad.title'));
