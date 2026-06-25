const fs = require('fs');

const toolsFR = {
  "abjad": { "title": "Calculateur Abjad", "description": "Calculez la valeur numérique mystique de vos noms et wirds." },
  "asma": { "title": "Noms Divins Personnels", "description": "Découvrez vos noms divins correspondants au poids mystique de votre nom." },
  "99names": { "title": "Les 99 Noms d'Allah", "description": "Recherchez, étudiez et comprenez les Noms Sublimes (Asma al-Husna)." },
  "quran": { "title": "Le Saint Coran", "description": "Lecture et méditation sur le Coran, l'outil fondamental de tout Asrar." },
  "tasbih": { "title": "Tasbih Virtuel", "description": "Un compteur de zikr intelligent pour suivre vos récitations quotidiennes." },
  "daily-dhikr": { "title": "Daily Dhikr Tracker", "description": "Définissez des objectifs et suivez votre Dhikr quotidien avec persistance." },
  "planetary": { "title": "Heures Planétaires", "description": "Déterminez les heures spirituelles propices pour vos invocations." },
  "zakat": { "title": "Calculateur de Zakat", "description": "Calculez précisément votre Zakat al-Maal sur diverses richesses." },
  "faraid": { "title": "Calculateur de Faraid", "description": "Calculez les parts d'héritage selon la jurisprudence islamique." },
  "dreams": { "title": "Journal des Rêves", "description": "Analysez et documentez vos rêves avec interprétations." },
  "personal-wird": { "title": "Générateur de Wird", "description": "Istikhraj al-Asma: Calculez votre Zikr personnel selon votre poids mystique." },
  "lunar-mansions": { "title": "Demeures de la Lune", "description": "Manazil al-Qamar: Suivez les 28 demeures astrologiques pour vos opérations." },
  "spiritual-compatibility": { "title": "Compatibilité Spirituelle", "description": "Hisab al-Tawafuq: Règle d'Al-Buni pour le mariage et les partenariats." },
  "ilm-jafar": { "title": "Oracle de Jafar", "description": "Ilm al-Jafar: Divination suprême par la fracturation des lettres (Taksir)." },
  "grand-oaths": { "title": "Grands Serments", "description": "Da'awat & Azayim: Bibliothèque des invocations majeures." },
  "elemental": { "title": "Analyseur Élémentaire", "description": "Tabai' al-Huruf: Découvrez la nature dominante de votre nom (Feu, Terre, Air, Eau)." },
  "geomancy": { "title": "Géomancie Arabe", "description": "Khatt ar-Raml: Générez et interprétez les figures géomantiques pour consulter." },
  "letters": { "title": "Science des Lettres", "description": "Sirr al-Huruf: Découvrez les mystères associés à chaque lettre arabe." },
  "rouhaniyya": { "title": "Extracteur Rouhaniyya", "description": "Extraction des esprits célestes ou terrestres basés sur les Noms et le Poids." },
  "taksir": { "title": "Taksir (Brisures)", "description": "Générez des matrices de Taksir et des cassures de lettres." },
  "sirr": { "title": "Sirr Al-Asrar", "description": "Analyse ésotérique absolue : éléments, auras, et khuddam." },
  "zairja": { "title": "Oracle Zairja", "description": "La machine ancestrale des soufis pour prédire et éclaircir les questions mystiques." },
  "khatim": { "title": "Générateur de Khatim", "description": "Créez des carrés magiques (Wafq) 3x3 basés sur des valeurs numériques." },
  "ruqyah": { "title": "Ruqyah Shari'ah", "description": "Séances de traitement spirituel intensif avec répétitions ciblées (7 à 1000)." },
  "talsam": { "title": "Générateur de Talsam", "description": "Créez des mots de pouvoir et talsams chiffrés pour encapsuler vos invocations." },
  "istikhara": { "title": "Istikhara Numérique", "description": "Tirage du sort spirituel basé sur le Saint Coran et la science d'Abjad." },
  "khouddam": { "title": "Extracteur de Khouddam", "description": "Calculez et invoquez les entités spirituelles angéliques et terrestres (A'il et Yush) liées à un nom." }
};

const toolsEN = {
  "abjad": { "title": "Abjad Calculator", "description": "Calculate the mystical numerical value of your names and wirds." },
  "asma": { "title": "Personal Divine Names", "description": "Discover your corresponding divine names based on the mystical weight of your name." },
  "99names": { "title": "The 99 Names of Allah", "description": "Search, study, and understand the Sublime Names (Asma al-Husna)." },
  "quran": { "title": "The Holy Quran", "description": "Reading and meditating on the Quran, the fundamental tool of all Asrar." },
  "tasbih": { "title": "Virtual Tasbih", "description": "A smart zikr counter to track your daily recitations." },
  "daily-dhikr": { "title": "Daily Dhikr Tracker", "description": "Set goals and track your daily Dhikr consistently." },
  "planetary": { "title": "Planetary Hours", "description": "Determine the auspicious spiritual hours for your invocations." },
  "zakat": { "title": "Zakat Calculator", "description": "Accurately calculate your Zakat al-Maal on various types of wealth." },
  "faraid": { "title": "Faraid Calculator", "description": "Calculate inheritance shares according to Islamic jurisprudence." },
  "dreams": { "title": "Dream Journal", "description": "Analyze and document your dreams with interpretations." },
  "personal-wird": { "title": "Wird Generator", "description": "Istikhraj al-Asma: Calculate your personal Zikr based on your mystical weight." },
  "lunar-mansions": { "title": "Lunar Mansions", "description": "Manazil al-Qamar: Follow the 28 astrological mansions for your operations." },
  "spiritual-compatibility": { "title": "Spiritual Compatibility", "description": "Hisab al-Tawafuq: Al-Buni's rule for marriage and partnerships." },
  "ilm-jafar": { "title": "Oracle of Jafar", "description": "Ilm al-Jafar: Supreme divination by letter fracturing (Taksir)." },
  "grand-oaths": { "title": "Grand Oaths", "description": "Da'awat & Azayim: Library of major invocations." },
  "elemental": { "title": "Elemental Analyzer", "description": "Tabai' al-Huruf: Discover the dominant nature of your name (Fire, Earth, Air, Water)." },
  "geomancy": { "title": "Arabic Geomancy", "description": "Khatt ar-Raml: Generate and interpret geomantic figures for consultation." },
  "letters": { "title": "Science of Letters", "description": "Sirr al-Huruf: Discover the mysteries associated with each Arabic letter." },
  "rouhaniyya": { "title": "Rouhaniyya Extractor", "description": "Extraction of celestial or terrestrial spirits based on Names and Weight." },
  "taksir": { "title": "Taksir (Fracturing)", "description": "Generate Taksir matrices and letter breakdowns." },
  "sirr": { "title": "Sirr Al-Asrar", "description": "Absolute esoteric analysis: elements, auras, and khuddam." },
  "zairja": { "title": "Zairja Oracle", "description": "The ancient Sufi machine to predict and clarify mystical questions." },
  "khatim": { "title": "Khatim Generator", "description": "Create 3x3 magic squares (Wafq) based on numerical values." },
  "ruqyah": { "title": "Ruqyah Shari'ah", "description": "Intensive spiritual treatment sessions with targeted repetitions (7 to 1000)." },
  "talsam": { "title": "Talsam Generator", "description": "Create power words and encrypted talsams to encapsulate your invocations." },
  "istikhara": { "title": "Digital Istikhara", "description": "Spiritual drawing based on the Holy Quran and Abjad science." },
  "khouddam": { "title": "Khouddam Extractor", "description": "Calculate and invoke the angelic and terrestrial spiritual entities (A'il and Yush) linked to a name." }
};

const toolsHA = {
  "abjad": { "title": "Lissafin Abjad", "description": "Lissafa ƙimar lamba ta sirri na sunayenku da wuridai." },
  "asma": { "title": "Sunayen Allah na Keɓaɓɓu", "description": "Gano sunayen Allah masu dacewa da nauyin asirin sunanku." },
  "99names": { "title": "Sunayen Allah 99", "description": "Bincika, nazari, da fahimtar Sunaye Masu Girma (Asma al-Husna)." },
  "quran": { "title": "Al-Kur'ani Mai Girma", "description": "Karatu da yin zuzzurfan tunani a kan Al-Kur'ani, muhimmin kayan aikin dukkan Asrar." },
  "tasbih": { "title": "Tasbih na Yanar Gizo", "description": "Wani abin kirga zikiri mai fasaha don bin diddigin karatun ku na yau da kullun." },
  "daily-dhikr": { "title": "Mai Binciken Dhikr na Kullum", "description": "Saita maƙasudai kuma ku bi diddigin Dhikr ɗin ku na yau da kullun." },
  "planetary": { "title": "Awannin Taurari", "description": "Ƙayyade sa'o'i masu albarka na ruhaniya don addu'o'in ku." },
  "zakat": { "title": "Lissafin Zakkah", "description": "Ƙididdige Zakat al-Maal ɗin ku daidai akan nau'ikan dukiya daban-daban." },
  "faraid": { "title": "Lissafin Faraid", "description": "Ƙididdige rabe-raben gado bisa ga fikihun Musulunci." },
  "dreams": { "title": "Littafin Mafarkai", "description": "Bincika da rubuta mafarkanku tare da fassara." },
  "personal-wird": { "title": "Sarrafa Wird", "description": "Istikhraj al-Asma: Lissafa Zikirinku na keɓaɓɓu bisa ga nauyin asirin ku." },
  "lunar-mansions": { "title": "Gidajen Wata", "description": "Manazil al-Qamar: Bi gidaje 28 na taurari don ayyukan ku." },
  "spiritual-compatibility": { "title": "Dacewar Ruhu", "description": "Hisab al-Tawafuq: Dokar Al-Buni don aure da abokan hulɗa." },
  "ilm-jafar": { "title": "Oracle na Jafar", "description": "Ilm al-Jafar: Babban fassarar ta hanyar karye haruffa (Taksir)." },
  "grand-oaths": { "title": "Manyan Rantsuwoyi", "description": "Da'awat & Azayim: Laburaren manyan addu'o'i." },
  "elemental": { "title": "Mai Binciken Abubuwa", "description": "Tabai' al-Huruf: Gano yanayin da ya mamaye sunan ku (Wuta, Ƙasa, Iska, Ruwa)." },
  "geomancy": { "title": "Duba na Larabawa", "description": "Khatt ar-Raml: Ƙirƙira da fassara siffofin duba don shawara." },
  "letters": { "title": "Ilimin Haruffa", "description": "Sirr al-Huruf: Gano asirin da ke tattare da kowane harafin Larabci." },
  "rouhaniyya": { "title": "Mai Fitar da Rouhaniyya", "description": "Fitar da ruhohi na sama ko na ƙasa dangane da Sunaye da Nauyi." },
  "taksir": { "title": "Taksir (Karyewa)", "description": "Samar da matrices na Taksir da ragewar haruffa." },
  "sirr": { "title": "Sirr Al-Asrar", "description": "Binciken asiri na cikakken: abubuwa, auras, da khuddam." },
  "zairja": { "title": "Oracle na Zairja", "description": "Tsohuwar na'urar Sufaye don tsinkaya da bayyana tambayoyin asiri." },
  "khatim": { "title": "Sarrafa Khatim", "description": "Ƙirƙiri murabba'ai masu sihiri (Wafq) 3x3 dangane da ƙimar lamba." },
  "ruqyah": { "title": "Ruqyah Shari'ah", "description": "Zaman jinya na ruhaniya masu zurfi tare da maimaita da aka yi niyya (7 zuwa 1000)." },
  "talsam": { "title": "Sarrafa Talsam", "description": "Ƙirƙiri kalmomi masu ƙarfi da talsamai masu ɓoye don tattara addu'o'inku." },
  "istikhara": { "title": "Istikhara na Dijital", "description": "Zane na ruhaniya dangane da Al-Kur'ani Mai Girma da ilimin Abjad." },
  "khouddam": { "title": "Mai Fitar da Khouddam", "description": "Lissafa kuma kira ruhohin mala'iku da na ƙasa (A'il da Yush) masu alaƙa da suna." }
};

const toolsZH = {
  "abjad": { "title": "阿布贾德计算器", "description": "计算您的名字和 wirds 的神秘数值。" },
  "asma": { "title": "个人神圣名称", "description": "根据您名字的神秘权重发现相应的神圣名称。" },
  "99names": { "title": "真主的 99 个尊名", "description": "搜索、研究和理解崇高的名字 (Asma al-Husna)。" },
  "quran": { "title": "神圣的古兰经", "description": "阅读和冥想古兰经，所有 Asrar 的基本工具。" },
  "tasbih": { "title": "虚拟念珠", "description": "一个智能的 zikr 计数器，用于跟踪您每天的诵读。" },
  "daily-dhikr": { "title": "每日 Dhikr 追踪器", "description": "设定目标并坚持追踪您每天的 Dhikr。" },
  "planetary": { "title": "行星时刻", "description": "为您的祈祷确定吉祥的精神时间。" },
  "zakat": { "title": "天课计算器", "description": "准确计算您在各种财富上的天课。" },
  "faraid": { "title": "法拉伊德计算器", "description": "根据伊斯兰法理学计算遗产份额。" },
  "dreams": { "title": "解梦日记", "description": "分析并记录您的梦境及其解释。" },
  "personal-wird": { "title": "Wird 生成器", "description": "Istikhraj al-Asma：根据您的神秘权重计算您的个人 Zikr。" },
  "lunar-mansions": { "title": "二十八宿", "description": "Manazil al-Qamar：遵循 28 个占星术宿来进行您的操作。" },
  "spiritual-compatibility": { "title": "精神契合度", "description": "Hisab al-Tawafuq：阿尔布尼（Al-Buni）关于婚姻和伙伴关系的规则。" },
  "ilm-jafar": { "title": "贾法尔神谕", "description": "Ilm al-Jafar：通过字母断裂（Taksir）进行的最高占卜。" },
  "grand-oaths": { "title": "大誓言", "description": "Da'awat & Azayim：主要祈祷库。" },
  "elemental": { "title": "元素分析器", "description": "Tabai' al-Huruf：发现您名字的主导性质（火、土、风、水）。" },
  "geomancy": { "title": "阿拉伯地占术", "description": "Khatt ar-Raml：生成并解释地占图以供咨询。" },
  "letters": { "title": "字母科学", "description": "Sirr al-Huruf：发现与每个阿拉伯字母相关的奥秘。" },
  "rouhaniyya": { "title": "Rouhaniyya 提取器", "description": "根据名称和权重提取天体或尘世的灵魂。" },
  "taksir": { "title": "Taksir（断裂）", "description": "生成 Taksir 矩阵和字母分解。" },
  "sirr": { "title": "Sirr Al-Asrar", "description": "绝对深奥分析：元素、光环和 khuddam。" },
  "zairja": { "title": "Zairja 神谕", "description": "古老的苏菲派机器，用于预测和澄清神秘问题。" },
  "khatim": { "title": "Khatim 生成器", "description": "根据数值创建 3x3 幻方 (Wafq)。" },
  "ruqyah": { "title": "符合教法的鲁基亚", "description": "密集精神治疗课程，目标重复（7 到 1000 次）。" },
  "talsam": { "title": "Talsam 生成器", "description": "创建力量词和加密的 talsam，以封装您的祈祷。" },
  "istikhara": { "title": "数字 Istikhara", "description": "基于古兰经和阿布贾德科学的精神抽签。" },
  "khouddam": { "title": "Khouddam 提取器", "description": "计算并召唤与名字相关的天使和世俗精神实体（A'il 和 Yush）。" }
};

const langs = [
  { file: 'fr.json', data: toolsFR },
  { file: 'en.json', data: toolsEN },
  { file: 'ha.json', data: toolsHA },
  { file: 'zh.json', data: toolsZH }
];

for (const lang of langs) {
  const filePath = `./src/i18n/${lang.file}`;
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  content.tools = lang.data;
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
}
