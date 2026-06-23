import React, { useState, useEffect } from 'react';
import { Moon, ArrowLeft, Star, Compass, Clock, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

interface Mansion {
  id: number;
  name: string;
  arabic: string;
  element: string;
  nature: string;
  desc: string;
  propitious: string[];
  unpropitious: string[];
}

const MANSIONS: Mansion[] = [
  { id: 1, name: "Al-Sharatain", arabic: "الشرطين", element: "Feu", nature: "Bénéfique", desc: "Les deux cornes du Bélier. Première demeure marquant le début du zodiaque lunaire. Favorable aux initiatives rapides, aux voyages et à l'acquisition de connaissances, mais déconseillée pour les engagements durables comme le mariage ou la fondation d'édifices.", propitious: ["Voyages", "Commerce", "Nouvelles rencontres"], unpropitious: ["Mariage", "Construction"] },
  { id: 2, name: "Al-Butayn", arabic: "البطين", element: "Terre", nature: "Mixte", desc: "Le ventre du Bélier. Demeure de nature modérée, souvent liée à la découverte de choses cachées, la plantation et l'ancrage. Elle n'est cependant pas favorable pour entreprendre des voyages sur l'eau.", propitious: ["Recherche de trésors", "Plantations", "Achats"], unpropitious: ["Voyages sur l'eau", "Vente"] },
  { id: 3, name: "Al-Thurayya", arabic: "الثريا", element: "Air", nature: "Très Bénéfique", desc: "Les Pléiades. Une des demeures les plus fastes et lumineuses. Elle est le siège de la chance, de l'amour, des bénédictions et de l'alchimie spirituelle. Hautement recommandée pour toute œuvre de rassemblement et d'affection.", propitious: ["Amour (Mahabba)", "Alchimie", "Bénédictions", "Acquisitions"], unpropitious: ["Opérations de séparation", "Conflits"] },
  { id: 4, name: "Al-Dabaran", arabic: "الدبران", element: "Terre", nature: "Maléfique", desc: "Le suiveur (Aldébaran). Astre rouge marquant l'œil du Taureau, porteur de discorde et de séparation. Cette demeure est redoutée pour le commerce et le mariage, et souvent utilisée dans les œuvres de destruction.", propitious: ["Destruction d'ennemis", "Séparation (Tafriq)"], unpropitious: ["Mariage", "Commerce", "Voyage", "Accords"] },
  { id: 5, name: "Al-Haq'a", arabic: "الهقعة", element: "Air", nature: "Mixte", desc: "La tache blanche. Associée à Orion, cette demeure favorise l'intellect, l'apprentissage des sciences occultes et la méditation. Elle requiert le calme et déconseille les conflits ouverts.", propitious: ["Études mystiques", "Méditation", "Compréhension"], unpropitious: ["Confrontations", "Guerres"] },
  { id: 6, name: "Al-Han'a", arabic: "الهنعة", element: "Feu", nature: "Bénéfique", desc: "La marque. Demeure faste pour approcher les puissants, formuler des requêtes et chasser. Elle apporte le succès dans les entreprises audacieuses mais n'est pas favorable aux prêts financiers.", propitious: ["Chasse", "Demandes aux rois", "Audace"], unpropitious: ["Prêts d'argent", "Dettes"] },
  { id: 7, name: "Al-Dhira", arabic: "الذراع", element: "Eau", nature: "Bénéfique", desc: "Le bras ou la patte avant. Demeure très positive liée à la croissance, la guérison et l'abondance. Elle est idéale pour semer, cultiver et s'engager dans des échanges commerciaux prospères.", propitious: ["Guérison", "Commerce", "Agriculture", "Nouvel emploi"], unpropitious: [] },
  { id: 8, name: "Al-Nathra", arabic: "النثرة", element: "Feu", nature: "Mixte", desc: "La crèche. Associée au Lion, elle apporte une énergie soudaine et brève. Utile pour des opérations magiques ou matérielles qui nécessitent une conclusion rapide, mais mauvaise pour les projets de longue haleine.", propitious: ["Opérations rapides", "Victoire soudaine"], unpropitious: ["Opérations à long terme", "Contrats durables"] },
  { id: 9, name: "Al-Tarf", arabic: "الطرف", element: "Terre", nature: "Maléfique", desc: "Le regard du Lion. Demeure de la colère et de la vengeance. Son influence est lourde et destructrice. Elle n'est employée que pour les malédictions ou pour se débarrasser d'un adversaire oppressif.", propitious: ["Malédictions justifiées", "Défense agressive"], unpropitious: ["Tout le reste", "Voyages", "Mariage"] },
  { id: 10, name: "Al-Jabha", arabic: "الجبهة", element: "Feu", nature: "Très Bénéfique", desc: "Le front du Lion (Régulus). Demeure royale par excellence. Elle confère charisme, élévation, respect et victoire éclatante. Excellente pour l'amour et pour briller en société.", propitious: ["Amour", "Réussite", "Charisme", "Renommée"], unpropitious: [] },
  { id: 11, name: "Al-Zubra", arabic: "الزبرة", element: "Terre", nature: "Bénéfique", desc: "La crinière du Lion. Demeure protectrice et acquisitive. Favorable à l'accumulation de richesses, à la protection de ses biens et à la consolidation de sa position matérielle ou sociale.", propitious: ["Acquisition de biens", "Succès", "Protection"], unpropitious: [] },
  { id: 12, name: "Al-Sarfah", arabic: "الصرفة", element: "Air", nature: "Mixte", desc: "Le changement céleste. Marque un tournant. Elle est propice pour renverser des situations bloquées, libérer les prisonniers et pour l'agriculture, mais dangereuse pour les voyages maritimes.", propitious: ["Libération de prisonniers", "Agriculture", "Changement"], unpropitious: ["Navigations", "Stabilité"] },
  { id: 13, name: "Al-Awwa", arabic: "العواء", element: "Terre", nature: "Bénéfique", desc: "Le hurleur (constellation de la Vierge). Demeure très favorable aux unions, aux mariages, aux associations commerciales fructueuses et à la réconciliation entre ennemis.", propitious: ["Mariage", "Accords commerciaux", "Réconciliation"], unpropitious: [] },
  { id: 14, name: "Al-Simak", arabic: "السماك", element: "Feu", nature: "Mixte", desc: "L'exalté (Spica). Étoile brillante apportant des énergies fluctuantes. Favorable aux opérations d'attraction amoureuse et aux voyages, mais défavorable pour le traitement des maladies qui pourraient s'aggraver.", propitious: ["Magie d'amour", "Voyage", "Déménagement"], unpropitious: ["Maladies", "Soins médicaux"] },
  { id: 15, name: "Al-Ghafr", arabic: "الغفر", element: "Terre", nature: "Très Bénéfique", desc: "La couverture. Une des meilleures demeures pour la spiritualité. Elle favorise le recueillement, l'exaucement des prières, la découverte de trésors enfouis et la réalisation de toutes les bonnes œuvres.", propitious: ["Toutes les bonnes œuvres", "Prières", "Trésors"], unpropitious: [] },
  { id: 16, name: "Al-Zubana", arabic: "الزبانا", element: "Air", nature: "Maléfique", desc: "Les pinces du Scorpion. Demeure de la séparation, de la discorde et de l'inimitié. Elle est redoutée et utilisée uniquement pour créer des conflits, séparer les alliés ou se venger.", propitious: ["Séparation", "Discorde", "Rupture"], unpropitious: ["Voyage", "Mariage", "Commerce"] },
  { id: 17, name: "Al-Iklil", arabic: "الإكليل", element: "Eau", nature: "Mixte", desc: "La couronne du Scorpion. Influence mitigée, propice aux constructions solides et à l'acquisition d'animaux, mais elle nécessite de la prudence dans les affaires sociales ou relationnelles.", propitious: ["Bâtir", "Acheter des animaux", "Fondations"], unpropitious: [] },
  { id: 18, name: "Al-Qalb", arabic: "القلب", element: "Feu", nature: "Maléfique", desc: "Le cœur du Scorpion (Antarès). Étoile de la guerre, de la violence et de la destruction. Son énergie est purement martiale. Totalement déconseillée pour l'amour, la paix ou les accords.", propitious: ["Destruction", "Guerre", "Domination"], unpropitious: ["Amour", "Paix", "Voyages"] },
  { id: 19, name: "Al-Shaulah", arabic: "الشولة", element: "Eau", nature: "Mixte", desc: "Le dard du Scorpion. Énergie vive et piquante, idéale pour chasser, traquer ou mener des opérations secrètes, mystiques et cachées. Demande une grande maîtrise.", propitious: ["Chasse", "Opérations secrètes", "Poursuites"], unpropitious: [] },
  { id: 20, name: "Al-Na'aim", arabic: "النعائم", element: "Feu", nature: "Bénéfique", desc: "Les autruches. Demeure d'ouverture et d'expansion. Favorable à tous les déplacements, aux voyages commerciaux lointains, et à la domestication ou l'achat de montures.", propitious: ["Voyages", "Commerce", "Chevaux et véhicules"], unpropitious: [] },
  { id: 21, name: "Al-Baldah", arabic: "البلدة", element: "Terre", nature: "Bénéfique", desc: "La ville ou le lieu désert. Demeure de construction et d'établissement. Très favorable pour fonder une maison, se marier, et récolter les fruits de son labeur.", propitious: ["Bâtir", "Mariage", "Récoltes", "Établissement"], unpropitious: [] },
  { id: 22, name: "Sa'd al-Dhabih", arabic: "سعد الذابح", element: "Feu", nature: "Maléfique", desc: "La chance du sacrificateur. Énergie de coupure et de perte. Souvent associée à la fuite, l'exil ou le sacrifice forcé. Elle contrecarre presque toute bonne action entreprise sous son influence.", propitious: ["Fuite", "Exil", "Séparation forcée"], unpropitious: ["Toute bonne action", "Alliances"] },
  { id: 23, name: "Sa'd Bula", arabic: "سعد بلع", element: "Terre", nature: "Mixte", desc: "La chance de l'avalement. Demeure de consommation et de dissolution. Elle est étrangement favorable à la médecine (guérir en avalant le mal) et aux divorces (dissoudre l'union).", propitious: ["Divorce", "Médecine", "Traitements"], unpropitious: [] },
  { id: 24, name: "Sa'd al-Su'ud", arabic: "سعد السعود", element: "Air", nature: "Très Bénéfique", desc: "La chance des chances. La demeure la plus fortunée. Elle couronne de succès toutes les entreprises, apporte l'amour, favorise les mariages et confère des faveurs royales.", propitious: ["Amour", "Mariage", "Succès royal", "Élévation"], unpropitious: [] },
  { id: 25, name: "Sa'd al-Akhbiya", arabic: "سعد الأخبية", element: "Eau", nature: "Bénéfique", desc: "La chance des tentes. Demeure de la dissimulation et de la protection. Excellente pour concevoir des talismans protecteurs, assiéger une forteresse ou cacher ses intentions.", propitious: ["Assièger", "Magie protectrice", "Secrets"], unpropitious: [] },
  { id: 26, name: "Al-Fargh al-Muqaddam", arabic: "الفرغ المقدم", element: "Feu", nature: "Mixte", desc: "Le premier bec du seau. Demeure active favorisant le mouvement, le voyage, et les interventions médicales. Cependant, elle est néfaste pour sceller des unions comme le mariage.", propitious: ["Voyage", "Médecine", "Soins"], unpropitious: ["Mariage", "Stabilité"] },
  { id: 27, name: "Al-Fargh al-Mu'akkhar", arabic: "الفرغ المؤخر", element: "Eau", nature: "Bénéfique", desc: "Le second bec du seau. Demeure de flux financier. Propice au commerce, aux achats et aux investissements, mais elle déconseille fortement de contracter des emprunts.", propitious: ["Commerce", "Achats", "Gains"], unpropitious: ["Emprunts", "Dettes"] },
  { id: 28, name: "Rasha", arabic: "الرشا", element: "Eau", nature: "Bénéfique", desc: "Le ventre du poisson. Dernière demeure clôturant le cycle lunaire. Énergie de plénitude, extrêmement favorable pour finaliser des affaires et pour la magie de l'attraction.", propitious: ["Toutes les affaires", "Magie d'attraction", "Finalisation"], unpropitious: [] },
];

export const LunarMansions: React.FC = () => {
  const [todayMansion, setTodayMansion] = useState<Mansion | null>(null);
  const [currentMansion, setCurrentMansion] = useState<Mansion | null>(null);

  useEffect(() => {
    // Simulate current mansion based on day of year (simplified approximation)
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    
    // Moon spends roughly 1 day in each mansion (27.3 days orbital period approx mapped to 28)
    // We simulate by mapping day of year.
    const mansionIndex = dayOfYear % 28;
    setTodayMansion(MANSIONS[mansionIndex]);
    setCurrentMansion(MANSIONS[mansionIndex]);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24">
      <div className="mb-8">
        <Link to="/tools" className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-4 font-medium transition-colors">
          <ArrowLeft size={20} className="mr-2" />
          Retour au tableau de bord
        </Link>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Moon className="text-indigo-500" size={32} />
          Les 28 Demeures de la Lune
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Le tableau de bord astrologique lunaire (Manazil al-Qamar) pour vos opérations asrar.
        </p>
      </div>

      {currentMansion && (
        <div className="mb-8">
          <motion.div
            key={currentMansion.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-indigo-900 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Compass size={200} className="animate-[spin_60s_linear_infinite]" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-indigo-300 font-medium mb-2">
                <Clock size={18} />
                {currentMansion.id === todayMansion?.id ? "Demeure Actuelle (Aujourd'hui)" : `Demeure #${currentMansion.id}`}
              </div>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold mb-2">{currentMansion.name}</h2>
                  <p className="text-3xl font-arabic text-indigo-200" dir="rtl">{currentMansion.arabic}</p>
                </div>
                <div className="flex gap-3">
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                    currentMansion.nature.includes('Bénéfique') ? 'bg-emerald-500/20 text-emerald-300' : 
                    currentMansion.nature.includes('Maléfique') ? 'bg-red-500/20 text-red-300' : 
                    'bg-amber-500/20 text-amber-300'
                  }`}>
                    Nature: {currentMansion.nature}
                  </span>
                  <span className="bg-white/10 px-4 py-2 rounded-full text-sm font-bold text-white">
                    Élément: {currentMansion.element}
                  </span>
                </div>
              </div>
              
              <div className="bg-indigo-800/40 rounded-2xl p-5 mb-8 border border-indigo-700/50 backdrop-blur-sm">
                <h3 className="text-indigo-200 font-bold mb-2 flex items-center gap-2">
                  <Info size={18} /> Description
                </h3>
                <p className="text-indigo-50 leading-relaxed text-lg">
                  {currentMansion.desc}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-indigo-950/50 rounded-2xl p-6 border border-indigo-800">
                  <h3 className="text-emerald-400 font-bold mb-4 flex items-center gap-2">
                    <Star size={18} /> Actions Propices
                  </h3>
                  <ul className="space-y-2">
                    {currentMansion.propitious.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                        {item}
                      </li>
                    ))}
                    {currentMansion.propitious.length === 0 && <li className="text-indigo-300/50 italic">Aucune action recommandée</li>}
                  </ul>
                </div>
                
                <div className="bg-indigo-950/50 rounded-2xl p-6 border border-indigo-800">
                  <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2">
                    <Star size={18} /> Actions Déconseillées
                  </h3>
                  <ul className="space-y-2">
                    {currentMansion.unpropitious.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                        {item}
                      </li>
                    ))}
                    {currentMansion.unpropitious.length === 0 && <li className="text-indigo-300/50 italic">Aucune restriction majeure</li>}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Sélectionnez une Demeure</h2>
          <span className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">Système Arabe</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100 dark:bg-gray-700">
          {MANSIONS.map((mansion) => (
            <button 
              key={mansion.id} 
              onClick={() => setCurrentMansion(mansion)}
              className={`p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors bg-white dark:bg-gray-800 ${currentMansion?.id === mansion.id ? 'ring-2 ring-inset ring-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : ''}`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-xs font-bold ${mansion.id === todayMansion?.id ? 'text-indigo-500 bg-indigo-100 dark:bg-indigo-900/50 px-2 py-0.5 rounded-full' : 'text-gray-400'}`}>
                  {mansion.id === todayMansion?.id ? "Aujourd'hui" : `#${mansion.id}`}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  mansion.nature.includes('Bénéfique') ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 
                  mansion.nature.includes('Maléfique') ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 
                  'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                }`}>{mansion.nature}</span>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white">{mansion.name}</h3>
              <p className="text-xl font-arabic text-gray-500 dark:text-gray-400 text-right mt-1" dir="rtl">{mansion.arabic}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
