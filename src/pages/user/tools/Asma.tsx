import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowLeft, Search, BookOpen, Star, Shield, Heart, Compass, Feather } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';

// Helper to generate a 3x3 Vifiq (Muthallath)
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

const divineNamesDeep = [
  { 
    name: "Ya Allah", 
    ar: "يَا الله",
    val: 66, 
    effect: "Illumination absolue, effacement de l'ego (Fana'), souveraineté spirituelle.",
    meaning: "L'Essence divine absolue, englobant la Totalité des attributs de Perfection.",
    esoteric: "Considéré par les plus hauts gnostiques comme le Nom Suprême (Ism al-A'dham). 'Allah' agit sur la globalité de l'être. Sa vibration résonne avec le 'Sirr' (secret profond). Il calcine les voiles de l'ego (Nafs) et désintègre toute magie. Le 66 lie microcosme et macrocosme.",
    zikr: "Le Dhikr des pôles (Aqtab) : 66 fois par jour pour un alignement vibratoire parfait. 4356 (66x66) en retraite (Khalwa) pour le dévoilement (Kashf).",
    category: "Essence (Dhat)",
    maqam: "Station de l'Unicité pure (Ahadiyya)",
    angel: "Ar-Ruh (L'Esprit Saint)"
  },
  { 
    name: "Ya Rahman", 
    ar: "يَا رَحْمَانُ",
    val: 298, 
    effect: "Attraction de la grâce cosmique, résolution des impossibles, ouverture des nafs.",
    meaning: "La Matrice Universelle de Miséricorde, dont la clémence englobe toute forme d'existence matérielle et spirituelle.",
    esoteric: "Provoque l'effusion de l'existence. Rahman est l'attribut par lequel l'univers se maintient (Istiwa). Son secret, souvent couplé au chiffre 298, agit comme une pluie sur un sol mort (spirituellement ou matériellement). Les gnostiques l'utilisent pour transformer des situations hostiles en terreau fertile.",
    zikr: "298 fois après le Fajr pour synchroniser son aura avec la miséricorde descendante du jour.",
    category: "Beauté (Jamal)",
    maqam: "Station de l'Expansion (Bist)",
    angel: "Jibril (Gabriel)"
  },
  { 
    name: "Ya Rahim", 
    ar: "يَا رَحِيمُ",
    val: 258, 
    effect: "Protection intime, douceur du cœur, sauvegarde de la structure familiale.",
    meaning: "Le Miséricordieux Spécifique, source d'Amour pur et continu.",
    esoteric: "Là où Rahman distribue sa grâce même aux ignorants, Rahim cible le chercheur. C'est le baume ésotérique réparateur. Il tisse des fils invisibles de tendresse (Mawadda) entre les individus, et crée un dôme impénétrable de sécurité autour du foyer de l'invocateur.",
    zikr: "258 fois après chaque prière obligatoire pour sceller sa famille et ses projets dans la préservation divine.",
    category: "Beauté (Jamal)",
    maqam: "Station de l'Amour Élu (Mahabba)",
    angel: "Mika'il (Michaël)"
  },
  { 
    name: "Ya Quddus", 
    ar: "يَا قُدُّوسُ",
    val: 170, 
    effect: "Purge des traumatismes obscurs, éloignement des entités négatives (Jinn).",
    meaning: "L'Infiniment Saint, Le Transcendant, dénué de toute imperfection.",
    esoteric: "Il est le feu alchimique qui désinfecte l'esprit. Al-Quddus dissout le Waswas (les obsessions mentales démoniaques), les névroses et les sortilèges. La récitation de ce nom élève drastiquement le taux vibratoire du sang, le rendant insupportable aux basses entités.",
    zikr: "170 fois juste avant de dormir ou après le crépuscule pour aseptiser le psychisme des énergies collectées durant la journée.",
    category: "Majesté Transcendante (Jalal)",
    maqam: "Station de la Pureté Originelle (Fitra)",
    angel: "Israfil"
  },
  { 
    name: "Ya Salam", 
    ar: "يَا سَلَامُ",
    val: 131, 
    effect: "Guérison physique, tranquillité mentale, immunité contre les désastres.",
    meaning: "La Matrice de Paix, La Source de Sauvegarde.",
    esoteric: "L'antidote cosmique. Ya Salam éteint les incendies physiques (fièvres, inflammations) et psychologiques (anxiété, crises de panique). L'émanation de ce Noms pacifie les cellules anarchiques du corps humain. Il fige les intentions hostiles avant manifestation.",
    zikr: "131 fois soufflé sur un verre d'eau pour la guérison. Récité dans la frayeur, il installe instantanément la paix.",
    category: "Beauté Pacifiante (Jamal)",
    maqam: "Station du Cœur Apaisé (Mutma'inna)",
    angel: "Azra'il (Aspect pacifié)"
  },
  { 
    name: "Ya Mu'min", 
    ar: "يَا مُؤْمِنُ",
    val: 136, 
    effect: "Immunité psychique absolue face à l'angoisse et la terreur, foi certifiée.",
    meaning: "Le Sécuritaire, le Garant, Celui qui confirme la vérité.",
    esoteric: "Il ancre l'âme face aux tempêtes de l'existence. Ce nom agit comme un stabilisateur de conscience. Lorsqu'il est zikré, la Lumière de la certitude (Yaqin) inonde la poitrine, rendant le sujet impossible à manipuler par la peur (humaine ou transcendante).",
    zikr: "136 fois au lever, pour revêtir l'armure de la sécurité. Protège de la trahison inattendue.",
    category: "Beauté Sécurisante (Jamal)",
    maqam: "Station de la Certitude Vécue (Haqq al-Yaqin)",
    angel: "Darda'il"
  },
  { 
    name: "Ya Muhaymin", 
    ar: "يَا مُهَيْمِنُ",
    val: 145, 
    effect: "Clairvoyance (Firasa), lecture des cœurs, télépathie spirituelle.",
    meaning: "Le Dominateur, Le Conscient, Le Protecteur Omniscient.",
    esoteric: "L'un des plus grands secrets pour l'ouverture du 'Troisième Oeil' (Bashīra). Al-Muhaymin dévoile les pensées et les intentions enfouies des autres. Le voile de la réalité tombe pour révéler les rouages cachés. Il offre un contrôle absolu.",
    zikr: "145 fois au milieu de la nuit (Tahajjud). Réputé pour le don de seconde vue.",
    category: "Majesté Souveraine (Jalal)",
    maqam: "Station de la Surveillance Éveillée (Muraqaba)",
    angel: "Kasfiya'il"
  },
  { 
    name: "Ya Aziz", 
    ar: "يَا عَزِيزُ",
    val: 94, 
    effect: "Gloire, dignité foudroyante, échec des ennemis.",
    meaning: "Le Puissant, Le Conquérant, L'Invulnérable.",
    esoteric: "Induit un respect instinctif, et parfois une crainte révérencielle, chez l'observateur. Le nom العزيز porte la signature énergétique d'une aura solaire, repoussante pour les tyrans, et attirante pour ceux qui cherchent la vérité.",
    zikr: "40 fois par jour pdt 40 jours pour passer de l'état subalterne à la gloire. Ou 94 fois de manière routinière.",
    category: "Majesté Dominante (Jalal)",
    maqam: "Station de la Puissance d'Âme ('Izza)",
    angel: "Anya'il"
  },
  { 
    name: "Ya Wahhab", 
    ar: "يَا وَهَّابُ",
    val: 14, 
    effect: "Abondance irrationnelle, dévoilements spirituels fulgurants.",
    meaning: "Le Dispensateur de Grâces inépuisables (don sans aucun mérite).",
    esoteric: "Le raccourci divin. Al-Wahhab court-circuite la notion de mérite temporel. Ce nom déclenche l'effusion de richesses matérielles soudaines, d'intuitions de génie, et de connaissances ésotériques (Ilm Ladunni). C'est le flux inconditionnel.",
    zikr: "14 fois (ou 300) front au sol après Duha. Brise la structure de la pauvreté générationnelle.",
    category: "Beauté Diffuseuse (Jamal)",
    maqam: "Station de la Faveur (Fadl)",
    angel: "Rūqi'il"
  },
  { 
    name: "Ya Razzaq", 
    ar: "يَا رَزَّاقُ",
    val: 308, 
    effect: "Ouverture multidimensionnelle de la subsistance (Rizq).",
    meaning: "L'inépuisable Pourvoyeur.",
    esoteric: "Le Rizq n'est pas que l'argent ; c'est le savoir, l'oxygène, et la qualité relationnelle. Al-Razzaq agit sur les carrefours du flux quantique commercial. Sa pratique crée un champ magnétique qui attire les opportunités économiques et repousse fondamentalement les disettes.",
    zikr: "308 fois après la prière de l'aube (Fajr) aux quatre coins de sa maison : rempart occulte contre la faillite.",
    category: "Beauté (Jamal)",
    maqam: "Station de la Confiance totale (Tawakkul)",
    angel: "Mika'il (en tant que régent)"
  },
  { 
    name: "Ya Fattah", 
    ar: "يَا فَتَّاحُ",
    val: 489, 
    effect: "Destruction des nœuds karmiques/magiques, succès décisifs.",
    meaning: "L'Ouvreur Suprême (qui tranche, résout et débloque).",
    esoteric: "La Clé Mystique (Miftah). Qu'il s'agisse d'une maladie, d'un nœud occulte ou d'une crise, Fattah fait sauter les blocages par effraction lumineuse. Il illumine le cœur d'intuitions victorieuses.",
    zikr: "489 fois après Fajr les mains sur le plexus solaire. C'est l'épée de l'esprit pour la réussite.",
    category: "Majesté/Beauté Universelle",
    maqam: "Station de l'Ouverture (Fath)",
    angel: "Luma'il"
  },
  { 
    name: "Ya Latif", 
    ar: "يَا لَطِيفُ",
    val: 129, 
    effect: "Miracles discrets, résolution des crises inextricables, douceur de vie.",
    meaning: "Le Subtil, le Pénétrant, dont la douceur s'infiltre dans l'invisible.",
    esoteric: "Le panacée spirituel. Latif modifie le code source de l'ADN et des événements par une pénétration subatomique. Invoqué en nombre massif (Zikr Jalali), il dissout litéralement les catastrophes (Balaa') planifiées dans l'éther avant qu'elles ne s'abattent.",
    zikr: "129 fois en quotidien. 16641 fois en groupe pour un prodige ou une résolution judiciaire/cataclysmique.",
    category: "Beauté Furtive (Jamal)",
    maqam: "Station de la Subtilité Éprouvée (Lutf)",
    angel: "Tatmiya'il / Jibril"
  },
  { 
    name: "Ya Haq", 
    ar: "يَا حَقُّ",
    val: 108, 
    effect: "Triage absolu du vrai et du faux, victoire de droit.",
    meaning: "La Réalité Ultime.",
    esoteric: "Il foudroie les illusions. Ya Haq dévoile les mensonges structurels. Poids lourd de l'équilibrage universel, il force le système karmique à vous restituer vos droits en dissipant the brouillard des manipulateurs.",
    zikr: "108 fois au milieu de la nuit. Ce dhikr retourne la malveillance à l'envoyeur et équilibre les dettes cosmiques.",
    category: "Majesté Tranchante (Jalal)",
    maqam: "Station de la Constante Vérité (Haqiqa)",
    angel: "Izra'il (Aspect rigoureux)"
  },
  { 
    name: "Ya Wadud", 
    ar: "يَا وَدُودُ",
    val: 20, 
    effect: "Magnétisme interpersonnel, extase mystique (Wajd), affection sociale.",
    meaning: "L'Aimant et l'Aimé Absolu, l'Attracteur universel.",
    esoteric: "Le nom de l'attraction cosmique (Mahabba). Celui qui s'en habille porte une vibration si attirante que même les cœurs haineux sont désarmés. Ce nom réconcilie les opposés et irise l'aura de nuances rosées psychiques.",
    zikr: "20 ou 400 fois sur un dessert, une boisson ou dans les paumes pour émaner l'Amour universel et vaincre la haine.",
    category: "Beauté (Jamal)",
    maqam: "Station de l'Extase Radieuse (Wajd)",
    angel: "Niya'il"
  },
  { 
    name: "Ya Basit", 
    ar: "يَا بَاسِطُ",
    val: 72, 
    effect: "Dilatation du cœur, triomphe sur la dépression (Qabd).",
    meaning: "L'Élargisseur.",
    esoteric: "Le nom souverain contre la mélancolie profonde. Basit desserre l'étau autour du cœur de l'homme, injecte de l'oxyène spirituel dans la poitrine, et donne au charisme vocal une capacité de porter plus loin.",
    zikr: "72 fois au lever du soleil les bras levés en V. Remède alchimique contre l'oppression et les crises d'angoisse.",
    category: "Beauté Extensive (Jamal)",
    maqam: "Station de l'Épanouissement (Bist)",
    angel: "Samha'il"
  },
  { 
    name: "Ya Nur", 
    ar: "يَا نُورُ",
    val: 256, 
    effect: "Transmutation de tous les ombres, brillance faciale (Nuraniyya).",
    meaning: "L'Essence Lumineuse éternelle.",
    esoteric: "Des photons d'intelligence divine pure. Al-Nur n'accorde pas qu'une lumière visible ; il implante une clairvoyance radieuse (Ilm Ladunni). C'est le secret pour vaincre les sorcelleries sombres : les entités ténébreuses sont brûlées par sa seule évocation.",
    zikr: "256 fois les yeux clos (Tahajjud), en absorbant mentalement la lumière blanche or cristalline. Nourrit le corps énergétique.",
    category: "Beauté Éveillante (Jamal)",
    maqam: "Station de l'Illumination (Tajalli)",
    angel: "Zadqiel (Nuriya'il)"
  }
];

export const Asma: React.FC = () => {
  const { t } = useLanguage();
  const [val, setVal] = useState('');
  const [result, setResult] = useState<typeof divineNamesDeep>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Gamification hook on load
  useEffect(() => {
    let stats; try { stats = JSON.parse(localStorage.getItem('asrar_stats') || '{}'); if (!stats || typeof stats !== 'object') stats = {}; } catch(e) { stats = {}; }
    stats.tools_used = (stats.tools_used || 0) + 1;
    localStorage.setItem('asrar_stats', JSON.stringify(stats));
  }, []);

  const searchNames = () => {
    const num = parseInt(val, 10);
    if (isNaN(num)) return;
    
    // Sort names by absolute difference to the input value
    let sorted = [...divineNamesDeep].sort((a, b) => Math.abs(a.val - num) - Math.abs(b.val - num));
    setResult(sorted.slice(0, 3)); // Return top 3 closest matches
    setExpandedId(null);
  };

  const getCategoryColor = (category: string) => {
    if (category.includes('Jamal')) return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20';
    if (category.includes('Jalal')) return 'text-rose-500 bg-rose-50 dark:bg-rose-900/20';
    return 'text-amber-500 bg-amber-50 dark:bg-amber-900/20'; // Essence / Both
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24 border-none min-h-screen">
      <div className="flex items-center gap-4 mb-6">
        <Link 
          to="/tools" 
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="text-indigo-500" />
            {t("tools.asma.title")}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t("tools.asma.subtitle")}</p>
        </div>
      </div>

      <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/50 rounded-2xl p-5 mb-8">
        <p className="text-sm text-indigo-800 dark:text-indigo-200 font-medium leading-relaxed">
          {/* @ts-ignore */}
          <span dangerouslySetInnerHTML={{ __html: t("tools.asma.intro") }} />
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-6 border border-gray-100 dark:border-gray-700 shadow-sm mb-8">
        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">{t("tools.asma.inputLabel")}</label>
        <div className="flex gap-3 sm:gap-4">
          <input
            type="number"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder={t("tools.asma.inputPlaceholder")}
            className="flex-1 min-w-0 w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-base sm:text-xl font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={searchNames}
            disabled={!val}
            className="shrink-0 h-[56px] sm:h-16 px-5 sm:px-8 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white font-bold transition-transform hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
          >
            <Search size={20} /> <span className="hidden sm:inline">{t("tools.asma.calculate")}</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {result.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-sm mb-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              Vos Noms Résonnants (Zikr Personnel)
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Le premier Nom affiché est celui qui fusionne le plus parfaitement avec votre empreinte d'âme. Cliquez sur une carte pour révéler les secrets.
            </p>

            {result.map((item, idx) => {
              const isExpanded = expandedId === idx;
              
              return (
                <motion.div
                  key={idx}
                  layout
                  onClick={() => setExpandedId(isExpanded ? null : idx)}
                  className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
                >
                  <div className="p-6 md:p-8 flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                         <span className={`px-3 py-1 rounded-lg text-[10px] uppercase font-black tracking-widest ${getCategoryColor(item.category)}`}>
                           {item.category}
                         </span>
                         {idx === 0 && (
                            <span className="flex items-center gap-1 text-[10px] uppercase font-black tracking-widest text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-400 px-3 py-1 rounded-lg">
                              <Star size={12} fill="currentColor" /> Affinité Principale
                            </span>
                         )}
                      </div>
                      <h4 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
                        {item.name} <span className="font-arabic font-normal text-indigo-600 dark:text-indigo-400 ml-2">{item.ar}</span>
                      </h4>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{item.meaning}</p>
                    </div>
                    
                    <div className="hidden sm:flex shrink-0 w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-2xl items-center justify-center border-2 border-gray-100 dark:border-gray-700">
                       <div className="text-center">
                          <span className="block text-[10px] uppercase font-bold text-gray-400">Abjad</span>
                          <span className="block text-xl font-bold text-indigo-600 dark:text-indigo-400 font-mono tracking-tighter">{item.val}</span>
                       </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-gray-100 dark:border-gray-700"
                      >
                         <div className="p-6 md:p-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-800 space-y-6">
                            
                            {/* Inner Header with Maqam & Angel */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                <div className="flex-1 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 shadow-sm flex items-center gap-3">
                                   <div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 flex items-center justify-center">
                                     <Compass size={16} />
                                   </div>
                                   <div>
                                      <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">{t("tools.asma.maqam")}</span>
                                      <span className="block text-sm font-bold text-gray-900 dark:text-white">{item.maqam}</span>
                                   </div>
                                </div>
                                
                                <div className="flex-1 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 shadow-sm flex items-center gap-3">
                                   <div className="w-8 h-8 rounded-full bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-600 flex items-center justify-center">
                                     <Feather size={16} />
                                   </div>
                                   <div>
                                      <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">{t("tools.asma.ruhaniyya")}</span>
                                      <span className="block text-sm font-bold text-gray-900 dark:text-white">{item.angel}</span>
                                   </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                               <div className="w-10 h-10 rounded-full flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 shrink-0">
                                 <Shield size={20} />
                               </div>
                               <div>
                                  <h5 className="text-sm font-bold uppercase tracking-widest text-gray-900 dark:text-white mb-2">{t("tools.asma.sirr")}</h5>
                                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-serif text-justify">
                                    {item.esoteric}
                                  </p>
                               </div>
                            </div>

                            <div className="flex items-start gap-4">
                               <div className="w-10 h-10 rounded-full flex items-center justify-center bg-rose-100 dark:bg-rose-900/30 text-rose-600 shrink-0">
                                 <Heart size={20} />
                               </div>
                               <div>
                                  <h5 className="text-sm font-bold uppercase tracking-widest text-gray-900 dark:text-white mb-2">{t("tools.asma.khassiyya")}</h5>
                                  <p className="text-sm font-medium text-rose-600 dark:text-rose-400 shadow-sm border border-rose-100 dark:border-rose-900/30 bg-white dark:bg-gray-900 p-3 rounded-xl inline-block">
                                    {item.effect}
                                  </p>
                               </div>
                            </div>

                            <div className="flex items-start gap-4">
                               <div className="w-10 h-10 rounded-full flex items-center justify-center bg-amber-100 dark:bg-amber-900/30 text-amber-600 shrink-0">
                                 <BookOpen size={20} />
                               </div>
                               <div className="w-full">
                                  <h5 className="text-sm font-bold uppercase tracking-widest text-gray-900 dark:text-white mb-2">{t("tools.asma.tariqa")}</h5>
                                  <p className="text-sm font-mono text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                                    {item.zikr}
                                  </p>
                               </div>
                            </div>

                             {/* Talsam & Khatim Box */}
                             <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 mt-4">
                                <h5 className="text-sm font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-4 text-center">{t("tools.asma.theurgic")}</h5>
                                
                                <div className="mb-6 bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-xl text-center">
                                  <span className="block text-xs uppercase font-bold text-indigo-800 dark:text-indigo-300 mb-1">{t("tools.asma.talsamCode")}</span>
                                  <span className="font-arabic text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">طمشلش {item.ar.replace('يَا ', '').replace('يَا', '')} كضهيوش</span>
                                  <p className="text-xs text-indigo-600/70 dark:text-indigo-400/70 mt-2 font-mono">Formule vibratoire de connexion pour la valeur {item.val}</p>
                                </div>

                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                  <div className="text-center">
                                    <h6 className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-2">{t("tools.asma.muthallath")}</h6>
                                    <div className="grid grid-cols-3 mx-auto max-w-[12rem] gap-1 p-2 bg-gray-100 dark:bg-gray-900 rounded-xl">
                                      {generateVifiq3x3(item.val).map((row, i) => 
                                        row.map((cell, j) => (
                                          <div key={`${i}-${j}`} className="aspect-square bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center font-mono font-bold text-sm sm:text-base text-gray-900 dark:text-white shadow-sm border border-gray-50 dark:border-gray-700">
                                            {cell}
                                          </div>
                                        ))
                                      )}
                                    </div>
                                  </div>

                                  <div className="text-center">
                                    <h6 className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-2">{t("tools.asma.murabba")}</h6>
                                    <div className="grid grid-cols-4 mx-auto max-w-[16rem] gap-1 p-2 bg-gray-100 dark:bg-gray-900 rounded-xl">
                                      {generateVifiq4x4(item.val).map((row, i) => 
                                        row.map((cell, j) => (
                                          <div key={`${i}-${j}`} className="aspect-square bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center font-mono font-bold text-xs sm:text-sm text-gray-900 dark:text-white shadow-sm border border-gray-50 dark:border-gray-700">
                                            {cell}
                                          </div>
                                        ))
                                      )}
                                    </div>
                                  </div>
                                </div>

                             </div>

                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

