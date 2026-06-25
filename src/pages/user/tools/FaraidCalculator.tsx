import React, { useState } from 'react';
import { Scale, ArrowLeft, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { motion } from 'motion/react';

export const FaraidCalculator: React.FC = () => {
  const { t } = useLanguage();
  const [assetValue, setAssetValue] = useState('');
  const [gender, setGender] = useState<'male'|'female'>('male'); // deceased gender
  
  // Heirs
  const [husband, setHusband] = useState(false);
  const [wives, setWives] = useState(0); // 0 to 4
  
  const [sons, setSons] = useState(0);
  const [daughters, setDaughters] = useState(0);
  
  const [father, setFather] = useState(false);
  const [mother, setMother] = useState(false);

  // Gamification
  const logUsage = () => {
    let stats; try { stats = JSON.parse(localStorage.getItem('asrar_stats') || '{}'); if (!stats || typeof stats !== 'object') stats = {}; } catch(e) { stats = {}; }
    stats.tools_used = (stats.tools_used || 0) + 1;
    localStorage.setItem('asrar_stats', JSON.stringify(stats));
  };

  const calculateShares = () => {
    logUsage();
    // Simplified specific Islamic inheritance (Faraid) scenarios.
    // NOTE: True Faraid is highly complex (blocking rules, awl, radd). 
    // This is a basic illustration of the most common standard scenarios.
    const total = parseFloat(assetValue) || 0;
    if (total <= 0) return null;

    let shares: { role: string, proportion: number, amount: number, desc: string }[] = [];
    let remaining = 1.0;

    const hasChildren = sons > 0 || daughters > 0;

    // Spouses
    if (gender === 'female' && husband) {
      const share = hasChildren ? 1/4 : 1/2;
      shares.push({ role: 'Époux', proportion: share, amount: total * share, desc: hasChildren ? '1/4 (Présence d\'enfants)' : '1/2 (Sans enfants)' });
      remaining -= share;
    } else if (gender === 'male' && wives > 0) {
      const share = hasChildren ? 1/8 : 1/4;
      shares.push({ role: `Épouse(s) (${wives})`, proportion: share, amount: total * share, desc: hasChildren ? '1/8 partagé (Présence d\'enfants)' : '1/4 partagé (Sans enfants)' });
      remaining -= share;
    }

    // Parents
    if (father) {
      const share = hasChildren ? 1/6 : (mother && !hasChildren ? 0 /* Asaba later */ : 1/6);
      shares.push({ role: 'Père', proportion: share, amount: total * share, desc: '1/6' });
      remaining -= share;
    }
    
    if (mother) {
      const share = hasChildren ? 1/6 : 1/3;
      shares.push({ role: 'Mère', proportion: share, amount: total * share, desc: hasChildren ? '1/6 (Présence d\'enfants)' : '1/3 (Sans enfants)' });
      remaining -= share;
    }

    // Children (Asabah - the rest)
    if (sons > 0 || daughters > 0) {
      if (sons === 0 && daughters > 0) {
        // Only daughters
        const share = daughters === 1 ? 1/2 : 2/3;
        const actualShare = Math.min(share, remaining);
        shares.push({ role: `Fille(s) (${daughters})`, proportion: actualShare, amount: total * actualShare, desc: daughters === 1 ? '1/2' : '2/3 partagé' });
        remaining -= actualShare;
      } else {
        // Sons and Daughters (Rule: Son gets twice the share of a daughter)
        const totalParts = (sons * 2) + daughters;
        const valuePerPart = remaining / totalParts;
        
        if (sons > 0) {
          shares.push({ role: `Fils (${sons})`, proportion: valuePerPart * 2 * sons, amount: total * valuePerPart * 2 * sons, desc: 'Héritier universel (Ta\'sib), double part' });
        }
        if (daughters > 0) {
          shares.push({ role: `Fille(s) (${daughters})`, proportion: valuePerPart * daughters, amount: total * valuePerPart * daughters, desc: 'Chaque fille moitié d\'un fils' });
        }
        remaining = 0;
      }
    }

    // If father is alive and remaining > 0 (Asaba case)
    if (father && remaining > 0 && sons === 0) {
       const existingFather = shares.find(s => s.role === 'Père');
       if (existingFather) {
         existingFather.proportion += remaining;
         existingFather.amount += total * remaining;
         existingFather.desc += ' + Reste (Asaba)';
       } else {
         shares.push({ role: 'Père', proportion: remaining, amount: total * remaining, desc: 'Reste (Asaba)' });
       }
       remaining = 0;
    }

    return { shares, remainder: remaining > 0.001 ? remaining : 0 };
  };

  const results = calculateShares();

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24 min-h-screen">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/tools" className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
           <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Scale className="text-red-500" />
            Calculateur Faraid
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t("tools.faraid.description")}</p>
        </div>
      </div>

      <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/30 rounded-2xl p-5 mb-8 flex items-start gap-4">
        <Info className="text-red-500 shrink-0 mt-0.5" size={24} />
        <p className="text-sm text-red-800 dark:text-red-200 font-medium">
          Ce simulateur calcule les cas de base selon le Coran (Sourate An-Nisa). La science du Faraid ('Ilm al-Faraidh) est complexe. Pensez à consulter un spécialiste pour les cas réels. Déduisez d'abord les frais funéraires et dettes avant la succession.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
             <h3 className="font-bold text-gray-900 dark:text-white mb-4">1. Capital de succession net</h3>
             <input type="number" placeholder="Montant (ex: 100000)" value={assetValue} onChange={(e) => setAssetValue(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
             <h3 className="font-bold text-gray-900 dark:text-white mb-4">2. Le Défunt</h3>
             <div className="flex gap-4">
                <button onClick={() => { setGender('male'); setHusband(false); }} className={`flex-1 py-3 rounded-xl border-2 font-bold ${gender === 'male' ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'border-gray-200 dark:border-gray-700'}`}>Homme</button>
                <button onClick={() => { setGender('female'); setWives(0); }} className={`flex-1 py-3 rounded-xl border-2 font-bold ${gender === 'female' ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'border-gray-200 dark:border-gray-700'}`}>Femme</button>
             </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-6 border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
             <h3 className="font-bold text-gray-900 dark:text-white mb-2">3. Héritiers Primaires</h3>
             
             {gender === 'female' ? (
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                   <span className="font-medium text-gray-700 dark:text-gray-300">Époux survivant</span>
                   <input type="checkbox" checked={husband} onChange={(e) => setHusband(e.target.checked)} className="w-5 h-5 accent-red-500" />
                </div>
             ) : (
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                   <span className="font-medium text-gray-700 dark:text-gray-300">Épouse(s) survivante(s)</span>
                   <select value={wives} onChange={(e) => setWives(parseInt(e.target.value))} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 outline-none">
                     <option value={0}>0</option>
                     <option value={1}>1</option>
                     <option value={2}>2</option>
                     <option value={3}>3</option>
                     <option value={4}>4</option>
                   </select>
                </div>
             )}

             <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                <span className="font-medium text-gray-700 dark:text-gray-300">Nombre de fils</span>
                <input type="number" min="0" value={sons} onChange={(e) => setSons(parseInt(e.target.value) || 0)} className="w-20 text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 outline-none" />
             </div>

             <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                <span className="font-medium text-gray-700 dark:text-gray-300">Nombre de filles</span>
                <input type="number" min="0" value={daughters} onChange={(e) => setDaughters(parseInt(e.target.value) || 0)} className="w-20 text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 outline-none" />
             </div>

             <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                <span className="font-medium text-gray-700 dark:text-gray-300">Père en vie</span>
                <input type="checkbox" checked={father} onChange={(e) => setFather(e.target.checked)} className="w-5 h-5 accent-red-500" />
             </div>

             <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                <span className="font-medium text-gray-700 dark:text-gray-300">Mère en vie</span>
                <input type="checkbox" checked={mother} onChange={(e) => setMother(e.target.checked)} className="w-5 h-5 accent-red-500" />
             </div>
          </div>
        </div>

        <div>
           {results && results.shares.length > 0 ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-red-600 rounded-3xl p-6 sm:p-8 shadow-xl text-white sticky top-24">
                 <h2 className="text-sm font-black uppercase tracking-widest text-red-200 mb-6 border-b border-red-500/50 pb-4">Répartition de l'Héritage</h2>
                 <div className="space-y-6">
                   {results.shares.map((share, idx) => (
                     <div key={idx} className="bg-red-700/50 p-4 rounded-2xl shadow-inner">
                        <div className="flex justify-between items-center mb-1">
                           <span className="font-bold text-lg">{share.role}</span>
                           <span className="font-mono text-xl font-bold text-white tabular-nums">{share.amount.toLocaleString()}</span>
                        </div>
                        <div className="text-red-200 tracking-wide font-medium text-sm">Base : {share.desc} ({(share.proportion * 100).toFixed(1)}%)</div>
                     </div>
                   ))}
                   
                   {results.remainder > 0 && (
                     <div className="bg-orange-500/50 p-4 rounded-2xl shadow-inner border border-orange-400">
                        <div className="flex justify-between items-center mb-1">
                           <span className="font-bold">Reliquat (Asaba/Radd)</span>
                           <span className="font-mono text-xl font-bold tabular-nums">{(results.remainder * (parseFloat(assetValue) || 0)).toLocaleString()}</span>
                        </div>
                        <div className="text-orange-100 text-sm">Non alloué aux héritiers primaires</div>
                     </div>
                   )}
                 </div>
              </motion.div>
           ) : (
              <div className="bg-gray-100 dark:bg-gray-800 rounded-3xl p-8 border border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
                 <Scale size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
                 <p className="text-gray-500 dark:text-gray-400 font-medium">Entrez un montant et sélectionnez des héritiers pour voir la répartition.</p>
              </div>
           )}
        </div>
      </div>
    </div>
  );
};
