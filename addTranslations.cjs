const fs = require('fs');

const tools = {
  "abjad": {
    "title": "Calculateur Abjad",
    "description": "Calculez la valeur numérique mystique de vos noms et wirds."
  },
  "asma": {
    "title": "Noms Divins Personnels",
    "description": "Découvrez vos noms divins correspondants au poids mystique de votre nom."
  },
  "99names": {
    "title": "Les 99 Noms d'Allah",
    "description": "Recherchez, étudiez et comprenez les Noms Sublimes (Asma al-Husna)."
  },
  "quran": {
    "title": "Le Saint Coran",
    "description": "Lecture et méditation sur le Coran, l'outil fondamental de tout Asrar."
  },
  "tasbih": {
    "title": "Tasbih Virtuel",
    "description": "Un compteur de zikr intelligent pour suivre vos récitations quotidiennes."
  },
  "daily-dhikr": {
    "title": "Daily Dhikr Tracker",
    "description": "Définissez des objectifs et suivez votre Dhikr quotidien avec persistance."
  },
  "planetary": {
    "title": "Heures Planétaires",
    "description": "Déterminez les heures spirituelles propices pour vos invocations."
  },
  "zakat": {
    "title": "Calculateur de Zakat",
    "description": "Calculez précisément votre Zakat al-Maal sur diverses richesses."
  },
  "faraid": {
    "title": "Calculateur de Faraid",
    "description": "Calculez les parts d'héritage selon la jurisprudence islamique."
  },
  "dreams": {
    "title": "Journal des Rêves",
    "description": "Analysez et documentez vos rêves avec interprétations."
  },
  "personal-wird": {
    "title": "Générateur de Wird",
    "description": "Istikhraj al-Asma: Calculez votre Zikr personnel selon votre poids mystique."
  },
  "lunar-mansions": {
    "title": "Demeures de la Lune",
    "description": "Manazil al-Qamar: Suivez les 28 demeures astrologiques pour vos opérations."
  },
  "spiritual-compatibility": {
    "title": "Compatibilité Spirituelle",
    "description": "Hisab al-Tawafuq: Règle d'Al-Buni pour le mariage et les partenariats."
  },
  "ilm-jafar": {
    "title": "Oracle de Jafar",
    "description": "Ilm al-Jafar: Divination suprême par la fracturation des lettres (Taksir)."
  },
  "grand-oaths": {
    "title": "Grands Serments",
    "description": "Da'awat & Azayim: Bibliothèque des invocations majeures."
  },
  "elemental": {
    "title": "Analyseur Élémentaire",
    "description": "Tabai' al-Huruf: Découvrez la nature dominante de votre nom (Feu, Terre, Air, Eau)."
  },
  "geomancy": {
    "title": "Géomancie Arabe",
    "description": "Khatt ar-Raml: Générez et interprétez les figures géomantiques pour consulter."
  },
  "letters": {
    "title": "Science des Lettres",
    "description": "Sirr al-Huruf: Découvrez les mystères associés à chaque lettre arabe."
  },
  "rouhaniyya": {
    "title": "Extracteur Rouhaniyya",
    "description": "Extraction des esprits célestes ou terrestres basés sur les Noms et le Poids."
  },
  "taksir": {
    "title": "Taksir (Brisures)",
    "description": "Générez des matrices de Taksir et des cassures de lettres."
  },
  "sirr": {
    "title": "Sirr Al-Asrar",
    "description": "Analyse ésotérique absolue : éléments, auras, et khuddam."
  },
  "zairja": {
    "title": "Oracle Zairja",
    "description": "La machine ancestrale des soufis pour prédire et éclaircir les questions mystiques."
  },
  "khatim": {
    "title": "Générateur de Khatim",
    "description": "Créez des carrés magiques (Wafq) 3x3 basés sur des valeurs numériques."
  },
  "ruqyah": {
    "title": "Ruqyah Shari'ah",
    "description": "Séances de traitement spirituel intensif avec répétitions ciblées (7 à 1000)."
  },
  "talsam": {
    "title": "Générateur de Talsam",
    "description": "Créez des mots de pouvoir et talsams chiffrés pour encapsuler vos invocations."
  },
  "istikhara": {
    "title": "Istikhara Numérique",
    "description": "Tirage du sort spirituel basé sur le Saint Coran et la science d'Abjad."
  },
  "khouddam": {
    "title": "Extracteur de Khouddam",
    "description": "Calculez et invoquez les entités spirituelles angéliques et terrestres (A'il et Yush) liées à un nom."
  },
  "awfaq": {
    "title": "Générateur de Awfaq",
    "description": "Créez des carrés magiques complexes (Muthallath, Murabba) avec alignement planétaire et intentions."
  },
  "quranic-faal": {
    "title": "Istikhara Coranique (Faal)",
    "description": "Méthode mystique de consultation du Coran pour la divination et la guidance (Tirage de sort)."
  }
};

const toolsEn = {
  "abjad": {
    "title": "Abjad Calculator",
    "description": "Calculate the mystical numerical value of your names and wirds."
  },
  "asma": {
    "title": "Personal Divine Names",
    "description": "Discover your divine names corresponding to the mystical weight of your name."
  },
  "99names": {
    "title": "The 99 Names of Allah",
    "description": "Search, study, and understand the Sublime Names (Asma al-Husna)."
  },
  "quran": {
    "title": "The Holy Quran",
    "description": "Reading and meditating on the Quran, the fundamental tool of all Asrar."
  },
  "tasbih": {
    "title": "Virtual Tasbih",
    "description": "A smart zikr counter to track your daily recitations."
  },
  "daily-dhikr": {
    "title": "Daily Dhikr Tracker",
    "description": "Set goals and track your daily Dhikr with persistence."
  },
  "planetary": {
    "title": "Planetary Hours",
    "description": "Determine the auspicious spiritual hours for your invocations."
  },
  "zakat": {
    "title": "Zakat Calculator",
    "description": "Accurately calculate your Zakat al-Maal on various wealth."
  },
  "faraid": {
    "title": "Faraid Calculator",
    "description": "Calculate inheritance shares according to Islamic jurisprudence."
  },
  "dreams": {
    "title": "Dream Journal",
    "description": "Analyze and document your dreams with interpretations."
  },
  "personal-wird": {
    "title": "Wird Generator",
    "description": "Istikhraj al-Asma: Calculate your personal Zikr according to your mystical weight."
  },
  "lunar-mansions": {
    "title": "Lunar Mansions",
    "description": "Manazil al-Qamar: Follow the 28 astrological mansions for your operations."
  },
  "spiritual-compatibility": {
    "title": "Spiritual Compatibility",
    "description": "Hisab al-Tawafuq: Al-Buni's rule for marriage and partnerships."
  },
  "ilm-jafar": {
    "title": "Jafar Oracle",
    "description": "Ilm al-Jafar: Supreme divination by letter fracturing (Taksir)."
  },
  "grand-oaths": {
    "title": "Grand Oaths",
    "description": "Da'awat & Azayim: Library of major invocations."
  },
  "elemental": {
    "title": "Elemental Analyzer",
    "description": "Tabai' al-Huruf: Discover the dominant nature of your name (Fire, Earth, Air, Water)."
  },
  "geomancy": {
    "title": "Arabic Geomancy",
    "description": "Khatt ar-Raml: Generate and interpret geomantic figures to consult."
  },
  "letters": {
    "title": "Science of Letters",
    "description": "Sirr al-Huruf: Discover the mysteries associated with each Arabic letter."
  },
  "rouhaniyya": {
    "title": "Rouhaniyya Extractor",
    "description": "Extraction of celestial or terrestrial spirits based on Names and Weight."
  },
  "taksir": {
    "title": "Taksir (Fractures)",
    "description": "Generate Taksir matrices and letter breakages."
  },
  "sirr": {
    "title": "Sirr Al-Asrar",
    "description": "Absolute esoteric analysis: elements, auras, and khuddam."
  },
  "zairja": {
    "title": "Zairja Oracle",
    "description": "The ancient machine of the Sufis to predict and clarify mystical questions."
  },
  "khatim": {
    "title": "Khatim Generator",
    "description": "Create 3x3 magic squares (Wafq) based on numerical values."
  },
  "ruqyah": {
    "title": "Ruqyah Shari'ah",
    "description": "Intensive spiritual treatment sessions with targeted repetitions (7 to 1000)."
  },
  "talsam": {
    "title": "Talsam Generator",
    "description": "Create power words and encrypted talsams to encapsulate your invocations."
  },
  "istikhara": {
    "title": "Digital Istikhara",
    "description": "Spiritual drawing of lots based on the Holy Quran and the science of Abjad."
  },
  "khouddam": {
    "title": "Khouddam Extractor",
    "description": "Calculate and invoke the angelic and terrestrial spiritual entities (A'il and Yush) linked to a name."
  },
  "awfaq": {
    "title": "Awfaq Generator",
    "description": "Create complex magic squares (Muthallath, Murabba) with planetary alignment and intentions."
  },
  "quranic-faal": {
    "title": "Quranic Istikhara (Faal)",
    "description": "Mystical method of consulting the Quran for divination and guidance (Drawing of lots)."
  }
};

const toolsHa = {
  "abjad": {
    "title": "Lissafin Abjad",
    "description": "Lissafa ƙimar lamba ta sirri na sunayenku da wuridai."
  },
  "asma": {
    "title": "Sunayen Allah na Keɓaɓɓu",
    "description": "Gano sunayen Allah masu dacewa da nauyin asirin sunanku."
  },
  "99names": {
    "title": "Sunayen Allah 99",
    "description": "Bincika, yi karatu, kuma ku fahimci Sunaye Masu Girma (Asma al-Husna)."
  },
  "quran": {
    "title": "Alqur'ani Mai Girma",
    "description": "Karatu da yin tunani akan Alqur'ani, babban kayan aiki na duk Asrar."
  },
  "tasbih": {
    "title": "Tasbihi na Farko",
    "description": "Mai ƙidayar zikiri mai fasaha don bin diddigin karatunku na yau da kullun."
  },
  "daily-dhikr": {
    "title": "Mai Bin Diddigin Zikiri",
    "description": "Sanya maƙasudi kuma ku bi diddigin zikirinku na yau da kullun."
  },
  "planetary": {
    "title": "Awoyi na Taurari",
    "description": "Ƙayyade lokutan ruhaniya masu kyau don addu'o'inku."
  },
  "zakat": {
    "title": "Lissafin Zakka",
    "description": "Lissafa Zakkatul Maali daidai akan dukiya daban-daban."
  },
  "faraid": {
    "title": "Lissafin Fara'id",
    "description": "Lissafa kason gado bisa ga fikihun Musulunci."
  },
  "dreams": {
    "title": "Littafin Mafarki",
    "description": "Yi nazari kuma ku yi rubutu game da mafarkanku tare da fassarori."
  },
  "personal-wird": {
    "title": "Mai Kirkirar Wuridi",
    "description": "Istikhraj al-Asma: Lissafa Zikirin ku na daban bisa nauyin asirinku."
  },
  "lunar-mansions": {
    "title": "Gidajen Wata",
    "description": "Manazil al-Qamar: Bi gidajen taurari guda 28 don ayyukanku."
  },
  "spiritual-compatibility": {
    "title": "Daidaitawar Ruhaniya",
    "description": "Hisab al-Tawafuq: Dokar Al-Buni don aure da alaƙa."
  },
  "ilm-jafar": {
    "title": "Hasashen Jafar",
    "description": "Ilm al-Jafar: Babban hasashe ta hanyar farfasa haruffa (Taksir)."
  },
  "grand-oaths": {
    "title": "Manyan Rantsuwai",
    "description": "Da'awat & Azayim: Laburaren manyan addu'o'i."
  },
  "elemental": {
    "title": "Mai Nazarin Abubuwa",
    "description": "Tabai' al-Huruf: Gano babban yanayin sunanku (Wuta, Ƙasa, Iska, Ruwa)."
  },
  "geomancy": {
    "title": "Binciken Kasa na Larabci",
    "description": "Khatt ar-Raml: Ƙirƙiri kuma fassara siffofin binciken ƙasa."
  },
  "letters": {
    "title": "Ilimin Haruffa",
    "description": "Sirr al-Huruf: Gano asirin dake da nasaba da kowane harafin Larabci."
  },
  "rouhaniyya": {
    "title": "Mai Fitar da Ruhaniyya",
    "description": "Cire ruhohin sama ko na ƙasa bisa ga Sunaye da Nauyi."
  },
  "taksir": {
    "title": "Taksir (Kari)",
    "description": "Kirkirar matrix na Taksir da fashewar haruffa."
  },
  "sirr": {
    "title": "Sirr Al-Asrar",
    "description": "Cikakken binciken asiri: abubuwa, haske, da hadimmai."
  },
  "zairja": {
    "title": "Hasashen Zairja",
    "description": "Tsohuwar injin sufa don yin hasashe da fayyace tambayoyi na asiri."
  },
  "khatim": {
    "title": "Mai Kirkirar Hatimi",
    "description": "Kirkirar filaye na asiri na 3x3 (Wafq) bisa kimar lambobi."
  },
  "ruqyah": {
    "title": "Ruqyah ta Shari'a",
    "description": "Zaman maganin ruhaniya tare da maimaita aiki (7 zuwa 1000)."
  },
  "talsam": {
    "title": "Mai Kirkirar Talsam",
    "description": "Kirkirar kalmomin iko da talsam don addu'o'in ku."
  },
  "istikhara": {
    "title": "Istikhara na Dijital",
    "description": "Zaben kur'a na ruhaniya dangane da Alqur'ani Mai Girma da kimiyyar Abjad."
  },
  "khouddam": {
    "title": "Mai Fitar da Khouddam",
    "description": "Lissafa kuma ku kira hadimmai na ruhaniya (A'il da Yush) masu alaƙa da suna."
  },
  "awfaq": {
    "title": "Mai Kirkirar Awfaq",
    "description": "Kirkirar filaye na asiri masu rikitarwa (Muthallath, Murabba)."
  },
  "quranic-faal": {
    "title": "Istikhara ta Alkur'ani (Faal)",
    "description": "Hanya ta asiri ta tuntubar Alqur'ani don zaben kur'a."
  }
};

const toolsZh = {
  "abjad": {
    "title": "阿布贾德计算器",
    "description": "计算您的名字和 wirds 的神秘数值。"
  },
  "asma": {
    "title": "个人神圣名称",
    "description": "根据您名字的神秘权重发现相应的神圣名称。"
  },
  "99names": {
    "title": "真主的 99 个尊名",
    "description": "搜索、研究和理解崇高的名称 (Asma al-Husna)。"
  },
  "quran": {
    "title": "神圣的古兰经",
    "description": "阅读和冥想古兰经，所有 Asrar 的基本工具。"
  },
  "tasbih": {
    "title": "虚拟 Tasbih",
    "description": "一个智能的 zikr 计数器来跟踪您的每日背诵。"
  },
  "daily-dhikr": {
    "title": "每日 Dhikr 追踪器",
    "description": "设定目标并坚持不懈地追踪您的每日 Dhikr。"
  },
  "planetary": {
    "title": "行星时间",
    "description": "为您的祈祷确定吉祥的精神时间。"
  },
  "zakat": {
    "title": "天课计算器",
    "description": "准确计算您在各种财富上的天课。"
  },
  "faraid": {
    "title": "法拉伊德计算器",
    "description": "根据伊斯兰教法计算遗产份额。"
  },
  "dreams": {
    "title": "梦境日记",
    "description": "分析并记录您的梦境以及解释。"
  },
  "personal-wird": {
    "title": "Wird 生成器",
    "description": "Istikhraj al-Asma：根据您的神秘权重计算您的个人 Zikr。"
  },
  "lunar-mansions": {
    "title": "月宿",
    "description": "Manazil al-Qamar：为您的操作遵循 28 个占星术大厦。"
  },
  "spiritual-compatibility": {
    "title": "精神契合度",
    "description": "Hisab al-Tawafuq：用于婚姻和伴侣关系的 Al-Buni 法则。"
  },
  "ilm-jafar": {
    "title": "贾法尔神谕",
    "description": "Ilm al-Jafar：通过字母断裂 (Taksir) 进行的最高占卜。"
  },
  "grand-oaths": {
    "title": "大誓言",
    "description": "Da'awat 和 Azayim：主要祈祷的图书馆。"
  },
  "elemental": {
    "title": "元素分析器",
    "description": "Tabai' al-Huruf：发现您名字的主导属性（火、土、风、水）。"
  },
  "geomancy": {
    "title": "阿拉伯占卜术",
    "description": "Khatt ar-Raml：生成并解释风水图形进行咨询。"
  },
  "letters": {
    "title": "字母科学",
    "description": "Sirr al-Huruf：发现与每个阿拉伯字母相关的奥秘。"
  },
  "rouhaniyya": {
    "title": "Rouhaniyya 提取器",
    "description": "根据名称和权重提取天界或世俗灵体。"
  },
  "taksir": {
    "title": "Taksir (折断)",
    "description": "生成 Taksir 矩阵和字母破坏。"
  },
  "sirr": {
    "title": "Sirr Al-Asrar",
    "description": "绝对的深奥分析：元素、光环和 khuddam。"
  },
  "zairja": {
    "title": "Zairja 神谕",
    "description": "苏菲派用来预测和澄清神秘问题的古老机器。"
  },
  "khatim": {
    "title": "Khatim 生成器",
    "description": "基于数值创建 3x3 幻方 (Wafq)。"
  },
  "ruqyah": {
    "title": "Ruqyah 法律",
    "description": "通过有针对性的重复（7 到 1000 次）进行密集的精神治疗。"
  },
  "talsam": {
    "title": "Talsam 生成器",
    "description": "创建力量词和加密 talsams 来封装您的祈求。"
  },
  "istikhara": {
    "title": "数字 Istikhara",
    "description": "基于古兰经和阿布贾德科学的精神抽签。"
  },
  "khouddam": {
    "title": "Khouddam 提取器",
    "description": "计算并祈求与名字相关的天使和世俗精神实体（A'il 和 Yush）。"
  },
  "awfaq": {
    "title": "Awfaq 生成器",
    "description": "创建带有行星排列和意图的复杂幻方 (Muthallath, Murabba)。"
  },
  "quranic-faal": {
    "title": "古兰经 Istikhara (Faal)",
    "description": "神秘的咨询古兰经以进行占卜和指导（抽签）的方法。"
  }
};

const processLang = (file, data) => {
  const content = JSON.parse(fs.readFileSync(file, 'utf8'));
  content.tools = data;
  fs.writeFileSync(file, JSON.stringify(content, null, 2));
};

processLang('src/i18n/fr.json', tools);
processLang('src/i18n/en.json', toolsEn);
processLang('src/i18n/ha.json', toolsHa);
processLang('src/i18n/zh.json', toolsZh);
