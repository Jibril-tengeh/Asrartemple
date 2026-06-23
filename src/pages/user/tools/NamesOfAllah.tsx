import React, { useState } from 'react';
import { ListTodo, ArrowLeft, Search, Info, BookOpen, PlayCircle, Grid, Sparkles, X, ChevronRight, Hash } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

// Augmented mock list of Asma al-Husna
const asmaListData = [
  { ar: "الله", tr: "Allah", fr: "Le Dieu Absolu", abjad: 66, ref: "Nom suprême (Ism al-A'dham)", quranOptions: { count: 2698, surah: "Al-Fatihah", verse: "1", excerptAr: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", excerptFr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux.", context: "Le nom suprême de l'Essence (Dhat). Il contient l'énergie de tous les autres noms. Il invoque la globalité de la Présence divine." } },
  { ar: "الرَّحْمَانُ", tr: "Ar-Rahmān", fr: "Le Très Miséricordieux", abjad: 298, ref: "Miséricorde générale", quranOptions: { count: 57, surah: "Ta-Ha", verse: "5", excerptAr: "الرَّحْمَٰنُ عَلَى الْعَرْشِ اسْتَوَىٰ", excerptFr: "Le Tout Miséricordieux S'est établi [Istawa] sur le Trône.", context: "Indique la souveraineté par l'Amour. La grâce de Rahman irrigue chaque atome de la création, indépendamment du mérite, maintenant l'axe du cosmos en pur équilibre." } },
  { ar: "الرَّحِيمُ", tr: "Ar-Rahīm", fr: "Le Tout Miséricordieux", abjad: 258, ref: "Miséricorde spécifique", quranOptions: { count: 114, surah: "Al-Ahzab", verse: "43", excerptAr: "وَكَانَ بِالْمُؤْمِنِينَ رَحِيمًا", excerptFr: "Et Il est Miséricordieux envers les croyants.", context: "Une miséricorde chirurgicale, continue et protectrice. Rahim pardonne les fautes et récompense les actes. C'est le flux bienveillant agissant dans le monde de la causalité." } },
  { ar: "الْمَلِكُ", tr: "Al-Malik", fr: "Le Souverain", abjad: 90, ref: "Domination absolue", quranOptions: { count: 5, surah: "Ta-Ha", verse: "114", excerptAr: "فَتَعَالَى اللَّهُ الْمَلِكُ الْحَقُّ", excerptFr: "Que soit exalté Allah, le vrai Souverain !", context: "Révèle la maîtrise totale de l'Être Exalté sur les cieux et la terre. Invoquer Al-Malik libère le cœur de la soumission aux créatures, affirmant qu'aucune force n'agit hors de Sa permission." } },
  { ar: "الْقُدُّوسُ", tr: "Al-Quddūs", fr: "L'Infiniment Saint", abjad: 170, ref: "Pureté", quranOptions: { count: 2, surah: "Al-Jumu'ah", verse: "1", excerptAr: "يُسَبِّحُ لِلَّهِ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ الْمَلِكِ الْقُدُّوسِ", excerptFr: "Ce qui est dans les cieux et ce qui est sur la terre glorifient Allah, le Souverain, le Pur...", context: "Le nom de l'aseptisation spirituelle. Al-Quddus transcende toute imperfection. Dans ce verset, la création vibre pour L'exalter car Sa pureté désintègre toutes souillures sombres ou chaotiques." } },
  { ar: "السَّلَامُ", tr: "As-Salām", fr: "La Paix", abjad: 131, ref: "Source de paix", quranOptions: { count: 42, surah: "Al-Hashr", verse: "23", excerptAr: "هُوَ اللَّهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْمَلِكُ الْقُدُّوسُ السَّلَامُ", excerptFr: "C'est Lui Allah. Nulle divinité à part Lui, Le Souverain, Le Pur, L'Apaisant...", context: "L'apaisement absolu (As-Salam) protège de l'annihilation. Ce nom équilibre le cosmos et apporte immunités organiques et psychiques face aux chocs ou terreurs du destin." } },
  { ar: "الْمُؤْمِنُ", tr: "Al-Mu'min", fr: "Le Fidèle, le Sécurisant", abjad: 136, ref: "Foi et sécurité", quranOptions: { count: 1, surah: "Al-Hashr", verse: "23", excerptAr: "السَّلَامُ الْمُؤْمِنُ الْمُهَيْمِنُ", excerptFr: "...L'Apaisant, Le Rassurant, Le Prédominant...", context: "Il est le Garant de Sa propre promesse. Al-Mu'min insuffle la lumière de la certitude (Yaqin) dans le cœur effrayé, procurant un abri énergétique infaillible contre la trahison occulte ou manifeste." } },
  { ar: "الْمُهَيْمِنُ", tr: "Al-Muhaymin", fr: "Le Surveillant", abjad: 145, ref: "Protection", quranOptions: { count: 1, surah: "Al-Hashr", verse: "23", excerptAr: "الْمُؤْمِنُ الْمُهَيْمِنُ الْعَزِيزُ", excerptFr: "...Le Rassurant, Le Prédominant, Le Tout Puissant...", context: "Celui qui englobe toute chose de Son observation. Sa présence veille, enregistre, et sauvegarde. Se lier à lui active le 3e œil (Firasa), percevant les trames cachées de l'existence." } },
  { ar: "الْعَزِيزُ", tr: "Al-'Azīz", fr: "Le Tout Puissant", abjad: 94, ref: "Puissance et dignité", quranOptions: { count: 92, surah: "Al-Hashr", verse: "23", excerptAr: "الْمُهَيْمِنُ الْعَزِيزُ الْجَبَّارُ", excerptFr: "...Le Prédominant, Le Tout Puissant, Le Contraignant...", context: "Nom de victoires imposantes, Al-Aziz brise les barrières insolubles. Invoqué, il offre le prestige (Hayba) et un statut d'invulnérabilité devant les forces hiérarchiques de l'injustice." } },
  { ar: "الْجَبَّارُ", tr: "Al-Jabbār", fr: "Celui qui domine et contraint", abjad: 206, ref: "Restauration et force", quranOptions: { count: 1, surah: "Al-Hashr", verse: "23", excerptAr: "الْعَزِيزُ الْجَبَّارُ الْمُتَكَبِّرُ", excerptFr: "...Le Tout Puissant, Le Contraignant, Le Superbe.", context: "Paradoxalement, Al-Jabbar 'contraint' tout os brisé à se réparer. C'est l'énergie divine qui redresse les destins courbés, écrase l'arrogance des tyrans et restaure la chair et l'âme." } },
  { ar: "الْمُتَكَبِّرُ", tr: "Al-Mutakabbir", fr: "Le Superbe", abjad: 662, ref: "Grandeur", quranOptions: { count: 1, surah: "Al-Hashr", verse: "23", excerptAr: "الْجَبَّارُ الْمُتَكَبِّرُ ۚ سُبْحَانَ اللَّهِ", excerptFr: "...Le Contraignant, Le Superbe. Gloire à Allah...", context: "Le nom de l'Exaltation infinie. Il dépouille l'Ego (Nafs) de ses prétentions à la grandeur. Ce nom sert d'arme mystique pour détruire les illusions de puissance chez ses ennemis." } },
  { ar: "الْخَالِقُ", tr: "Al-Khāliq", fr: "Le Créateur", abjad: 731, ref: "Création ex-nihilo", quranOptions: { count: 8, surah: "Al-Hashr", verse: "24", excerptAr: "هُوَ اللَّهُ الْخَالِقُ الْبَارِئُ", excerptFr: "C'est Lui Allah, le Créateur, Celui qui donne un commencement...", context: "Le grand concepteur qui invente à partir du néant absolu ('Adham). Lié à la matrice quantique, son chant fait jaillir de nouvelles opportunités de vie, de projets créatifs et de guérisons inexplicables." } },
  { ar: "الْبَارِئُ", tr: "Al-Bāri'", fr: "Le Producteur", abjad: 213, ref: "Conception", quranOptions: { count: 3, surah: "Al-Hashr", verse: "24", excerptAr: "الْخَالِقُ الْبَارِئُ الْمُصَوِّرُ", excerptFr: "...le Créateur, Celui qui donne un commencement, le Formateur.", context: "C'est le processus actif de concrétisation et séparation. Il détache la créature du Chaos pur. Méditer le 'Bari', c'est aligner ses structures d'action (ses plans) en conformité parfaite avec les lois du réel." } },
  { ar: "الْمُصَوِّرُ", tr: "Al-Musawwir", fr: "Le Formateur", abjad: 336, ref: "Forme et Beauté", quranOptions: { count: 1, surah: "Al-Hashr", verse: "24", excerptAr: "الْبَارِئُ الْمُصَوِّرُ ۖ لَهُ الْأَسْمَاءُ الْحُسْنَىٰ", excerptFr: "...Celui qui donne commencement à toute chose, le Formateur. À Lui les plus beaux Noms.", context: "L'artiste cosmique qui donne la forme (Sura) individuelle. Il confère esthétisme (Jamal) et symétrie, guérissant les difformités ou agençant la beauté d'un futur événement potentiel." } },
  { ar: "اَلْغَفَّارُ", tr: "Al-Ghaffār", fr: "Le Grand Pardonneur", abjad: 1281, ref: "Pardon infini", quranOptions: { count: 5, surah: "Nuh", verse: "10", excerptAr: "فَقُلْتُ اسْتَغْفِرُوا رَبَّكُمْ إِنَّهُ كَانَ غَفَّارًا", excerptFr: "J'ai dit : Implorez le pardon de votre Seigneur, car Il est grand Pardonneur.", context: "Ghaffar est celui qui absout répétitivement sans se lasser. Ce verset promet que la formulation du Nom efface le karma obscur, ce qui ouvre ensuite miraculeusement l'accès au ciel et aux richesses (Rizq)." } },
  { ar: "الْقَهَّارُ", tr: "Al-Qahhār", fr: "Le Tout Dominateur", abjad: 306, ref: "Soumission des éléments", quranOptions: { count: 6, surah: "Yusuf", verse: "39", excerptAr: "أَأَرْبَابٌ مُّتَفَرِّقُونَ خَيْرٌ أَمِ اللَّهُ الْوَاحِدُ الْقَهَّارُ", excerptFr: "Qui est le meilleur : des seigneurs multiples, ou Dieu, l'Unique, le Dominateur suprême?", context: "Force colossale de Majesté Divine. Al-Qahhar écrase toute rébellion. Puissant destructeur des pactes sorciers (Sihr) et annulateur des emprises magnétiques ténébreuses." } },
  { ar: "الْوَهَّابُ", tr: "Al-Wahhāb", fr: "Le Très Généreux", abjad: 14, ref: "Dons continus", quranOptions: { count: 3, surah: "Ali 'Imran", verse: "8", excerptAr: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا... وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً ۚ إِنَّكَ أَنتَ الْوَهَّابُ", excerptFr: "Accorde-nous Ta miséricorde, car C'est Toi le Dispensateur de toutes grâces.", context: "Le don fulgurant et sans contrepartie méritée. Provoque des ouvertures imprévisibles (Fath) matérielles et spirituelles. C'est l'arme secrète de Dawud et Suleyman pour la richesse de la royauté." } },
  { ar: "الرَّزَّاقُ", tr: "Ar-Razzāq", fr: "Le Pourvoyeur", abjad: 308, ref: "Subsistance", quranOptions: { count: 1, surah: "Adh-Dhariyat", verse: "58", excerptAr: "إِنَّ اللَّهَ هُوَ الرَّزَّاقُ ذُو الْقُوَّةِ الْمَتِينُ", excerptFr: "En vérité, c'est Allah qui est le grand Pourvoyeur, Le Détenteur de la force, l'Inébranlable.", context: "Le fleuve intarissable du Cosmos. La mention 'inébranlable' souligne que les ressources d'Allah ne craignent aucune faillite. Ce Nom attire le Rizq (opportunités, argent, nourritures, oxygène spirituel) vers son récepteur." } },
  { ar: "الْفَتَّاحُ", tr: "Al-Fattāh", fr: "Celui qui accorde la victoire", abjad: 489, ref: "Ouverture des portes", quranOptions: { count: 1, surah: "Saba", verse: "26", excerptAr: "ثُمَّ يَفْتَحُ بَيْنَنَا بِالْحَقِّ وَهُوَ الْفَتَّاحُ الْعَلِيمُ", excerptFr: "...Puis, Il tranchera entre nous avec justice, car Il est le grand Juge Suprême (Fattah), l'Omniscient.", context: "Celui qui débloque les impasses et tranche les conflits indécis. Fattah porte la clé des trésors gnostiques (Kashf) et ouvre les cadenas du destin verrouillés par les obstacles karmiques." } },
  { ar: "اَلْعَلِيمُ", tr: "Al-'Alīm", fr: "L'Omniscient", abjad: 150, ref: "Savoir absolu", quranOptions: { count: 153, surah: "Al-Baqarah", verse: "32", excerptAr: "قَالُوا سُبْحَانَكَ لَا عِلْمَ لَنَا إِلَّا مَا عَلَّمْتَنَا ۖ إِنَّكَ أَنتَ الْعَلِيمُ الْحَكِيمُ", excerptFr: "Ils dirent : Gloire à Toi ! Nous n'avons de savoir que ce que Tu nous as appris. Certes Toi, Tu es l'Omniscient, le Sage.", context: "L'intelligence Omnisciente pénétrant les quarks de la matière. Invoquer Al-'Alim insuffle la sagesse et permet la compréhension immédiate des sciences infusées (Ladunniyya) au-delà des livres." } },
  { ar: "الْقَابِضُ", tr: "Al-Qābid", fr: "Celui qui retient", abjad: 903, ref: "Rétention", quranOptions: { count: 0, surah: "Al-Baqarah", verse: "245", excerptAr: "وَاللَّهُ يَقْبِضُ وَيَبْسُطُ وَإِلَيْهِ تُرْجَعُونَ", excerptFr: "Et c'est Allah qui retient (Yaqbid) et qui étend (Yabsut), et c'est vers Lui que vous retournerez.", context: "Cité sous forme de verbe actif illustrant le balancier existentiel : la restriction (Qabd). Pénétrer ce Nom maîtrise son souffle vital et ses passions. Il neutralise violemment l'abondance des nuiseurs." } },
  { ar: "الْبَاسِطُ", tr: "Al-Bāsit", fr: "Celui qui étend", abjad: 72, ref: "Extension de la subsistance", quranOptions: { count: 0, surah: "Al-Baqarah", verse: "245", excerptAr: "وَاللَّهُ يَقْبِضُ وَيَبْسُطُ وَإِلَيْهِ تُرْجَعُونَ", excerptFr: "Et c'est Allah qui retient (Yaqbid) et qui étend (Yabsut)...", context: "Également forme verbale pour souligner l'expansion continue (Bist). Appellatif d'Ouverture et de Grâce : provoque la vitalité du cœur, l'allégresse de l'Âme, augmentant les possessions par largesse divine." } },
  { ar: "النُّورُ", tr: "An-Nūr", fr: "La Lumière", abjad: 256, ref: "Éclaire les cœurs", quranOptions: { count: 43, surah: "An-Nur", verse: "35", excerptAr: "اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ ۚ مَثَلُ نُورِهِ كَمِشْكَاةٍ فِيهَا مِصْبَاحٌ", excerptFr: "Allah est la Lumière des cieux et de la terre. Sa lumière est semblable à une niche où se trouve une lampe...", context: "Le verset suprême de l'illumination. An-Nur n'est pas qu'une métaphore : c'est l'onde vibratoire qui permet le dévoilement spectral. Il repousse l'opacité (Zulma), sublime le visage physique et affine l'aura." } },
  { ar: "الْوَدُودُ", tr: "Al-Wadūd", fr: "Le Tout Aimant", abjad: 20, ref: "Amour et affection", quranOptions: { count: 2, surah: "Hud", verse: "90", excerptAr: "وَاسْتَغْفِرُوا رَبَّكُمْ ثُمَّ تُوبُوا إِلَيْهِ ۚ إِنَّ رَبِّي رَحِيمٌ وَدُودٌ", excerptFr: "Et implorez le pardon de votre Seigneur [...], car mon Seigneur est Miséricordieux et très Aimant.", context: "Le nom d'Amour inconditionnel. Al-Wadud dépose l'affection mutuelle entre les créatures. Par ce dhikr, les haines familiales s'éteignent pour laisser place à l'harmonie affective magnétique." } },
  { ar: "الْحَقُّ", tr: "Al-Haqq", fr: "Le Vrai", abjad: 108, ref: "Vérité absolue", quranOptions: { count: 227, surah: "Al-Hajj", verse: "6", excerptAr: "ذَٰلِكَ بِأَنَّ اللَّهَ هُوَ الْحَقُّ وَأَنَّهُ يُحْيِي الْمَوْتَىٰ", excerptFr: "Il en est ainsi parce qu'Allah est le Vrai (Al-Haqq) et que c'est Lui qui redonne la vie aux morts.", context: "Face au mirage du monde éphémère (Bātil), Al-Haqq se dresse pour redresser les balances cosmiques. Ce Nom extorque la vérité et rend caduques la tricherie, forçant la victoire finale de l'Authenticité." } }
];

const countsBenefits = [
  { count: 7, ref: "Cycle Semainier & Céleste", tag: "Fondation", desc: "Le chiffre 7 est le verrouillage des cycles élémentaires. C'est le cycle des 7 jours, des 7 planètes classiques de la théurgie (Kawakib), des 7 terres et cieux. Zikrer un Nom 7 fois permet l'implantation de sa Khassiyya dans la matière, assurant une protection basique étalée sur la semaine. C'est l'activation du champ minimal de sécurité pour chaque Latifa (Chakra spirituel) du corps éthérique." },
  { count: 9, ref: "Les 9 Sphères (Aflak)", tag: "Achèvement", desc: "Il symbolise l'aboutissement final avant l'unité supérieure (10). C'est le sommet de l'incarnation spirituelle dans les Aflak (sphères concentriques). En mystique occulte, zikrer à un multiple de 9 attire un parachèvement rapide d'un cycle bloqué. L'énergie accumulée est projetée dans le 'Trône' et redescend pour achever instantanément." },
  { count: 11, ref: "L'Ouverture du Voile (Huwa)", tag: "Maîtrise Spirituelle", desc: "La valeur du pronom insondable 'Huwa' (Lui=11). 11 est le chiffre pivot ouvrant la porte à l'inspiration et à l'intuition du cœur (Ilham). Effectuer les asrars en répétant 11 fois synchronise votre polarité (vous+Allah, la dyade occulte) en détruisant les voiles de la dualité. Ouvre la capacité de vision mentale directe." },
  { count: 17, ref: "Axe des Rak'ats (Lois Divines)", tag: "Équilibre Shari'a", desc: "La somme des prières obligatoires diurnes et nocturnes. Selon les Maîtres alchimistes comme Jabir, c'est le nombre matrice réglant toute base (1+3+5+8). Zikrer sur 17 permet l'exaucement des vœux et aligne votre vie sur la volonté transcendante, idéal pour harmoniser ses désirs temporels avec le Décret (Qadar)." },
  { count: 21, ref: "Triade Parfaite (3×7)", tag: "Purification Mentale", desc: "Agit comme un détergent absolu de la conscience. C'est le secret du chiffre servant à pacifier les penchants charnels (Nafs). En ciblant les 7 jours sur les 3 niveaux de l'esprit, zikrer à 21 élève la psyché de l'angoisse oppressante vers le réconfort et détruit les doutes toxiques de Satan (Waswas)." },
  { count: 33, ref: "La Couronne du Tasbih", tag: "Élévation Sereine", desc: "Le rythme prophétique pur. Il porte le poids abjad de nombreuses racines d'élévation. Invoquer à 33 garantit la sérénité du cœur, une progression sûre sans retour occulte (sans répercussion d'énergie brûlante). C'est le Dhikr de tous les jours assurant un état stable en station Angélique." },
  { count: 41, ref: "Activation Alchimique (Mandal)", tag: "Concentration", desc: "Point de validation critique. Lorsqu'un pratiquant cherche à manifester un événement improbable ou à valider une invocation très lourde, ce nombre cristallise l'énergie. Le 41 scelle spirituellement et force l'ancrage profond de votre intention dans l'éther, repoussant définitivement une maladie ou un blocage tenace." },
  { count: 71, ref: "Le Seuil du Serviteur Céleste", tag: "Vocation Magique", desc: "Utilisé pour la conjuration en haute théurgie, le 71 sert d'appel direct (Jalb) aux entités lumineuses et aux Rouhaniyyat liés à un Nom. Ce nombre force une résonance subtile pour recevoir une aide invisible dans des conflits redoutables. Pénétrer le secret 71 éveille les synchronicités inexplicables." },
  { count: 91, ref: "L'Essence du Trône Inférieur", tag: "Résonance Angélique", desc: "Ondulation vibratoire liée aux esprits gouverneurs de la matière. Ce nombre tire son origine des répertoires du Shams al-Ma'arif. Réciter à 91 fois crée un pont harmonique avec les protecteurs angéliques spécifiques à votre demeure et vos biens matériels." },
  { count: 92, ref: "Garde Muhammadienne (ﷺ)", tag: "Alignement Océanique", desc: "Le poids mystique en Abjad du nom 'Muhammad' (محمد). C'est le filtre indispensable. Lancer son Dhikr à ce nombre plonge le Nom Divin dans l'océan prophétique, garantissant douceur, miséricorde et acceptation totale de l'invocation par le truchement de l'intercession (Tawassul)." },
  { count: 100, ref: "Le Cycle Parfait (Al-Kamil)", tag: "Complétion Unitaire", desc: "Englobant les 99 Noms plus l'Essence Absolue (1). Couronne de la Majesté (Jalal). Zikrer à 100 sature la poitrine de l'énergie originelle. Par cette complétude numérique, les maladies mentales, la magie noire grave et les grandes malédictions de la lignée se libèrent instantanément." },
  { count: 111, ref: "La Polarité Suprême (Al-Kafi & L'Alif)", tag: "Souveraineté (Qutb)", desc: "Valeur de la lettre isolée (Alif - ا ل ف) et du nom Al-Kafi (Le Suffisant). Trois fois le chiffre Un (111). C'est le nombre marquant l'isolement suprême et la déconnexion d'avec les dépendances terrestres. Récité magiquement pour terrasser un adversaire très puissant et attirer les foudres libératrices." },
  { count: 121, ref: "Souveraineté de Ya Malik", tag: "Domination sur soi", desc: "Le carré de 11 (11x11). Multiplicateur de royauté spirituelle. Ce nombre dompte les rébellions intérieures. Il est la couronne du roi sur son Ego, garantissant que vos paroles soient respectées et non rejetées." },
  { count: 313, ref: "Les Guerriers d'An-Nasr (Badr)", tag: "Victoire Foudroyante", desc: "Secret militaire mystique ! 313 correspond au nombre formel des pieux combattants de Badr et des messagers originaux (Mursalin). L'invocation de mobilisation générale des armées célestes en sa faveur. Amène des bouleversements incroyables de situation, renversant la victoire vers le dominé." },
  { count: 666, ref: "La Matrice Colérique & Poids Extrêmes", tag: "Attraction Sidérale", desc: "Au cœur du Tassawuf occulte, ce nombre possède une ambivalence terrifiante. C'est l'essence d'une concentration punitive (Jalal destructeur) si mal employée, mais il force la main du destin naturel. Zikrer à ce nombre brûle les fardeaux karmiques d'un coup de lance pure (à manipuler avec prudence)." },
  { count: 786, ref: "La Clé de Salomon (Bismillah)", tag: "Bénédiction Universelle", desc: "Poids abjad exact de la formule d'ouverture : 'Bismillahi Rahmani Rahim'. C'est le pass-partout suprême (Miftah). En réalisant ce zikr à ce nombre spécifique, vous captez l'autorité universelle sur la nature, facilitant vos entreprises matérielles et fermant la porte à l'échec structurel." },
  { count: 1000, ref: "L'Océan Cosmique (Al-Bahr)", tag: "Lumière Envahissante", desc: "Le 1000 symbolise l'Infini dans le cosmos temporel. Lors d'un Zikr Majeur, atteindre 1000 fait sombrer le cœur et le mental de celui (Sālik) qui chemine dans un océan ininterrompu de lumière divine. Cela consume les vieilles croyances et attire la grâce sans aucune limitation chiffrée. Noyade mystique assumée." },
  { count: 1111, ref: "Le Symbole de l'Axe Unique", tag: "Alignement Akhyar", desc: "Quatre Alifs alignés verticalement (ا ا ا ا). Ce motif d'architecture céleste symbolise l'alignement des mondes (Nasut, Malakut, Jabarut, Lahut). Prononcer le Nom 1111 fois percute ces 4 dimensions simultanément, provoquant un changement systémique total des paradigmes de la vie de l'invocateur." }
];

// Helper to generate a 3x3 Vifiq (Muthallath)
// Formula based on Ghazali's 3x3: (Base / 3) etc.. Simplified mathematically
const generateVifiq3x3 = (total: number) => {
  const base = Math.floor((total - 12) / 3);
  return [
    [base + 3, base + 8, base + 1],
    [base + 2, base + 4, base + 6],
    [base + 7, base + 0, base + 5]
  ];
};

// Helper for 4x4 (Murabba')
const generateVifiq4x4 = (total: number) => {
  const base = Math.floor((total - 30) / 4);
  return [
    [base + 7, base + 10, base + 1, base + 12],
    [base + 2, base + 11, base + 8, base + 9],
    [base + 14, base + 3, base + 16, base + 5],
    [base + 4, base + 13, base + 6, base + 15]
  ];
};

export const NamesOfAllah: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [viewState, setViewState] = useState<'list' | 'quran' | 'zikr' | 'khatim' | 'counts'>('list');
  const [activeName, setActiveName] = useState<typeof asmaListData[0] | null>(null);
  
  // Zikr state
  const [zikrCount, setZikrCount] = useState(0);

  // Gamification hook on load
  React.useEffect(() => {
    const stats = JSON.parse(localStorage.getItem('asrar_stats') || '{}');
    stats.tools_used = (stats.tools_used || 0) + 1;
    localStorage.setItem('asrar_stats', JSON.stringify(stats));
  }, []);

  const filtered = asmaListData.filter(a => 
    a.tr.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.fr.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.abjad.toString().includes(searchQuery)
  );

  const openModal = (type: 'quran' | 'zikr' | 'khatim' | 'counts', item: typeof asmaListData[0]) => {
    setActiveName(item);
    setViewState(type);
    if (type === 'zikr') setZikrCount(0);
  };

  const closeModal = () => {
    setViewState('list');
    setActiveName(null);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24 min-h-screen relative">
      <div className="flex items-center gap-4 mb-6 relative z-10">
        <Link to="/tools" className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
           <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ListTodo className="text-cyan-500" />
            Les Noms Divins (Asma al-Husna)
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Étude détaillée et Poids Abjad</p>
        </div>
      </div>

      <div className="relative mb-8 z-10">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="text-gray-400" size={20} />
        </div>
        <input
          type="text"
          placeholder="Rechercher un Nom (traductions, nombre abjad...)"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl pl-12 pr-4 py-4 text-gray-900 dark:text-white font-bold placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {filtered.map((name, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all flex flex-col relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="p-5 sm:p-6 flex-1 flex flex-col items-center text-center">
              <div className="w-full flex justify-between items-start mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20 px-2 py-1 rounded-lg">
                  Abjad: {name.abjad}
                </span>
              </div>

              <h3 className="font-arabic text-4xl sm:text-5xl text-gray-900 dark:text-white mt-2 mb-4 leading-relaxed font-bold tracking-tight">
                {name.ar}
              </h3>
              
              <h4 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-1">{name.tr}</h4>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">{name.fr}</p>
              
              <div className="w-full mt-auto pt-4 border-t border-gray-100 dark:border-gray-750 text-left">
                <span className="text-xs text-gray-400 dark:text-gray-500 uppercase font-bold tracking-widest block mb-1">Khassiyya & Symbole</span>
                <p className="text-sm text-gray-700 dark:text-gray-300 italic">{name.ref}</p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="border-t border-gray-100 dark:border-gray-700 grid grid-cols-4 bg-gray-50 dark:bg-gray-900/50">
              <button onClick={() => openModal('quran', name)} className="p-3 text-gray-500 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 flex flex-col items-center gap-1 transition-colors border-r border-gray-100 dark:border-gray-700" title="Citations Coraniques">
                <BookOpen size={18} />
                <span className="text-[10px] font-bold uppercase">Coran</span>
              </button>
              <button onClick={() => openModal('zikr', name)} className="p-3 text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 flex flex-col items-center gap-1 transition-colors border-r border-gray-100 dark:border-gray-700" title="Démarrer le Zikr">
                <PlayCircle size={18} />
                <span className="text-[10px] font-bold uppercase">Zikr</span>
              </button>
              <button onClick={() => openModal('khatim', name)} className="p-3 text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 flex flex-col items-center gap-1 transition-colors border-r border-gray-100 dark:border-gray-700" title="Construire le Khatim">
                <Grid size={18} />
                <span className="text-[10px] font-bold uppercase">Khatim</span>
              </button>
              <button onClick={() => openModal('counts', name)} className="p-3 text-gray-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 flex flex-col items-center gap-1 transition-colors" title="Bénéfices des nombres">
                <Sparkles size={18} />
                <span className="text-[10px] font-bold uppercase">Nombres</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      
      {filtered.length === 0 && (
         <div className="text-center py-12 text-gray-500">Aucun Nom trouvé pour cette recherche.</div>
      )}

      {/* OVERLAYS / MODALS */}
      <AnimatePresence>
        {viewState !== 'list' && activeName && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ bgOpacity: 0 }} 
              animate={{ bgOpacity: 1 }} 
              exit={{ bgOpacity: 0 }} 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={closeModal}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl relative z-10 max-w-lg w-full max-h-[85vh] overflow-hidden flex flex-col"
            >
              <div className="flex justify-between items-center p-5 sm:p-6 border-b border-gray-100 dark:border-gray-700">
                <h3 className="font-bold text-xl text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="font-arabic text-2xl text-cyan-600 dark:text-cyan-400">{activeName.ar}</span>
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md text-xs uppercase tracking-wider">{activeName.tr}</span>
                </h3>
                <button onClick={closeModal} className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-50 dark:bg-gray-700 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-5 sm:p-6 overflow-y-auto">
                {/* QURAN VIEW */}
                {viewState === 'quran' && (
                  <div className="space-y-6">
                    <div className="bg-cyan-50 dark:bg-cyan-900/10 border border-cyan-100 dark:border-cyan-800/50 rounded-2xl p-6 text-center">
                      <BookOpen size={48} className="mx-auto text-cyan-500 mb-4" />
                      <h4 className="text-sm font-bold uppercase tracking-widest text-cyan-800 dark:text-cyan-200 mb-1">Citations Coraniques</h4>
                      <p className="text-3xl font-black text-gray-900 dark:text-white mb-2">{activeName.quranOptions.count} <span className="text-base font-medium text-gray-500">Mentions</span></p>
                      <p className="text-gray-600 dark:text-gray-400 font-medium text-sm">
                        Décompte d'apparition du Nom dans le Texte Sacré.
                      </p>
                    </div>

                    {activeName.quranOptions.count > 0 ? (
                      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 shadow-sm space-y-5">
                        <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                          <span className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                             <BookOpen size={16} className="text-cyan-500" />
                             Sourate {activeName.quranOptions.surah}
                          </span>
                          <span className="bg-cyan-100 dark:bg-cyan-900/50 text-cyan-800 dark:text-cyan-300 px-3 py-1 rounded-lg text-sm font-bold">Verset {activeName.quranOptions.verse}</span>
                        </div>
                        
                        {(activeName as any).quranOptions.excerptAr && (
                           <div className="text-center p-4 border-b border-gray-100 dark:border-gray-700 pb-6">
                             <h5 className="text-xs uppercase font-bold text-gray-400 dark:text-gray-500 mb-4 tracking-widest">Extrait Révélation</h5>
                             <p className="font-arabic text-3xl sm:text-4xl text-gray-900 dark:text-white leading-[1.8] mb-4">{(activeName as any).quranOptions.excerptAr}</p>
                             <p className="text-gray-600 dark:text-gray-300 font-serif italic text-sm px-4">" {(activeName as any).quranOptions.excerptFr} "</p>
                           </div>
                        )}
                        
                        {(activeName as any).quranOptions.context && (
                           <div className="bg-indigo-50 dark:bg-indigo-900/10 p-5 rounded-xl border-l-4 border-indigo-500">
                             <h4 className="text-[11px] uppercase font-bold text-indigo-800 dark:text-indigo-300 mb-2 tracking-widest">Exégèse et Mystère Éloquent (Tafsir de ce Nom)</h4>
                             <p className="text-sm font-medium text-indigo-900/80 dark:text-indigo-100/80 leading-relaxed text-justify">
                               {(activeName as any).quranOptions.context}
                             </p>
                           </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 italic bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl">Ce Nom est traditionnellement dérivé du Hadith prophétique ou ne figure pas explicitement sous cette forme lexicale exacte directe (Ism Fa'il / Sifat) dans le Coran, ou sa fréquence est groupée avec d'autres dérivations grammaticales.</p>
                    )}
                  </div>
                )}

                {/* ZIKR VIEW */}
                {viewState === 'zikr' && (
                  <div className="flex flex-col items-center justify-center text-center space-y-8 py-8">
                    <div>
                      <h4 className="text-4xl sm:text-6xl font-arabic font-bold text-gray-900 dark:text-white mb-2">{activeName.ar}</h4>
                      <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Poids Abjad: <span className="font-bold text-emerald-600 dark:text-emerald-400">{activeName.abjad}</span></p>
                    </div>

                    <div className="relative">
                      {zikrCount === activeName.abjad && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.5 }} 
                          animate={{ opacity: 1, scale: 1.2 }} 
                          className="absolute -inset-8 bg-emerald-500/20 blur-xl rounded-full"
                        />
                      )}
                      <button
                        onClick={() => setZikrCount(prev => prev + 1)}
                        className={`w-40 h-40 sm:w-48 sm:h-48 rounded-full flex flex-col items-center justify-center shadow-2xl transition-transform active:scale-95 ${
                          zikrCount >= activeName.abjad 
                            ? 'bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-emerald-500/30' 
                            : 'bg-gradient-to-br from-white to-gray-100 dark:from-gray-700 dark:to-gray-800 text-gray-900 dark:text-white border-4 border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        <span className="text-5xl sm:text-6xl font-black font-mono tracking-tighter">{zikrCount}</span>
                      </button>
                    </div>

                    <button 
                      onClick={() => setZikrCount(0)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 font-medium text-sm px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full"
                    >
                      Réinitialiser
                    </button>
                  </div>
                )}

                {/* KHATIM VIEW */}
                {viewState === 'khatim' && (
                  <div className="space-y-8 py-4">
                    <p className="text-center text-sm font-medium text-gray-600 dark:text-gray-400">
                      Générateur de Carrés Magiques (Awfaq) pour la valeur <span className="font-bold text-purple-600 dark:text-purple-400">{activeName.abjad}</span>. Les restes ne sont pas traités dans cette version simple.
                    </p>

                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400 mb-4 text-center">Muthallath (3x3)</h4>
                      <div className="grid grid-cols-3 mx-auto w-48 sm:w-64 gap-1 p-2 bg-gray-100 dark:bg-gray-900 rounded-2xl">
                        {generateVifiq3x3(activeName.abjad).map((row, i) => 
                          row.map((cell, j) => (
                            <div key={`${i}-${j}`} className="aspect-square bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center font-mono font-bold text-gray-900 dark:text-white shadow-sm text-lg sm:text-xl">
                              {cell}
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400 mb-4 text-center">Murabba' (4x4)</h4>
                      <div className="grid grid-cols-4 mx-auto w-64 sm:w-80 gap-1 p-2 bg-gray-100 dark:bg-gray-900 rounded-2xl">
                        {generateVifiq4x4(activeName.abjad).map((row, i) => 
                          row.map((cell, j) => (
                            <div key={`${i}-${j}`} className="aspect-square bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center font-mono font-bold text-gray-900 dark:text-white shadow-sm text-sm sm:text-base">
                              {cell}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* COUNTS & BENEFITS VIEW */}
                {viewState === 'counts' && (
                  <div className="space-y-4 pb-4">
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border border-amber-100 dark:border-amber-800/30 p-5 rounded-3xl mb-6 shadow-sm relative overflow-hidden">
                      <Sparkles className="text-amber-500/20 absolute -right-4 -top-4" size={100} />
                      <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                        <Hash className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" size={24} />
                        <div>
                           <h4 className="font-bold text-amber-900 dark:text-amber-100 mb-1">Sciences des Nombres (Ilm Al-Asrar)</h4>
                           <p className="text-sm font-medium text-amber-800/80 dark:text-amber-200/80 leading-relaxed">
                             Le nombre de fois que vous effectuez le Zikr (répétition) détermine la dimension avec laquelle vous interagissez. Voici les portes ésotériques (Abwab) que ces nombres déverrouillent universellement :
                           </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4">
                      {countsBenefits.map((cb, i) => (
                        <div key={i} className="flex flex-col sm:flex-row gap-4 sm:items-start p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors hover:border-amber-200 dark:hover:border-amber-900/50 group">
                           <div className="flex flex-col items-center justify-center shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-gray-800 text-amber-700 dark:text-amber-400 rounded-2xl border border-amber-200 dark:border-amber-800/40 font-mono font-black text-xl sm:text-2xl shadow-inner group-hover:scale-105 transition-transform">
                             {cb.count}
                           </div>
                           <div className="flex-1 space-y-2">
                             <div className="flex items-center gap-2 flex-wrap mb-1">
                               <h5 className="font-bold text-gray-900 dark:text-white text-base sm:text-lg">{cb.ref}</h5>
                               {cb.tag && (
                                 <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-[10px] uppercase font-bold tracking-widest rounded-md border border-gray-200 dark:border-gray-600">
                                   {cb.tag}
                                 </span>
                               )}
                             </div>
                             <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed text-justify">{cb.desc}</p>
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

