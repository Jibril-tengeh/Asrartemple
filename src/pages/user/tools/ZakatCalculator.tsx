import React, { useState } from 'react';
import { Coins, ArrowLeft, RefreshCw, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';

export const ZakatCalculator: React.FC = () => {
  const { t } = useLanguage();
  const [gold, setGold] = useState('');
  const [silver, setSilver] = useState('');
  const [cash, setCash] = useState('');
  const [stocks, setStocks] = useState('');
  const [merchandise, setMerchandise] = useState('');
  const [debts, setDebts] = useState('');

  const [goldPrice, setGoldPrice] = useState(65); // EUR per gram (approx)
  const [silverPrice, setSilverPrice] = useState(0.70); // EUR per gram (approx)

  // Nisab is either 85g of gold or 595g of silver
  const nisabGoldValue = 85 * goldPrice;
  const nisabSilverValue = 595 * silverPrice;

  // Use Gold or Silver Nisab? Many scholars today say use the lowest for benefit of the poor (Silver),
  // but gold is also widely used. Let's use Gold Nisab as default indicator, but show both.
  const nisab = nisabGoldValue; 

  const calculateTotal = () => {
    const goldVal = (parseFloat(gold) || 0) * goldPrice;
    const silverVal = (parseFloat(silver) || 0) * silverPrice;
    const cashVal = parseFloat(cash) || 0;
    const stocksVal = parseFloat(stocks) || 0;
    const merchVal = parseFloat(merchandise) || 0;
    const fixedDebts = parseFloat(debts) || 0;

    const totalAssets = goldVal + silverVal + cashVal + stocksVal + merchVal;
    const zakatableWealth = totalAssets - fixedDebts;
    
    return zakatableWealth > 0 ? zakatableWealth : 0;
  };

  const total = calculateTotal();
  const zakatDue = total >= nisab ? total * 0.025 : 0;

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24 min-h-screen">
      <div className="flex items-center gap-4 mb-6">
        <Link 
          to="/tools" 
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Coins className="text-amber-500" />
            Calculateur de Zakat
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Calculez précisément votre Zakat al-Maal (2.5%)</p>
        </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/50 rounded-2xl p-5 mb-8 flex items-start gap-4">
        <Info className="text-amber-500 shrink-0 mt-0.5" size={24} />
        <div className="text-sm text-amber-800 dark:text-amber-200">
          <p className="font-bold mb-1">Le Nisab actuel (Seuil de richesse)</p>
          <p className="mb-2">La Zakat est obligatoire si votre richesse nette atteint ou dépasse le Nisab pendant une année lunaire (Hawl).</p>
          <div className="grid grid-cols-2 gap-4 mt-3">
             <div className="bg-amber-100/50 dark:bg-amber-900/30 p-2 rounded-lg text-center">
                <span className="block text-xs uppercase opacity-70 font-bold">Base Or (85g)</span>
                <span className="font-mono font-bold">{nisabGoldValue.toLocaleString('fr-FR', {style: 'currency', currency: 'EUR'})}</span>
             </div>
             <div className="bg-amber-100/50 dark:bg-amber-900/30 p-2 rounded-lg text-center">
                <span className="block text-xs uppercase opacity-70 font-bold">Base Argent (595g)</span>
                <span className="font-mono font-bold">{nisabSilverValue.toLocaleString('fr-FR', {style: 'currency', currency: 'EUR'})}</span>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">1. Argent & Or</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Or (en grammes)</label>
                <input type="number" value={gold} onChange={(e) => setGold(e.target.value)} placeholder="0" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Argent (en grammes)</label>
                <input type="number" value={silver} onChange={(e) => setSilver(e.target.value)} placeholder="0" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-gray-900 dark:text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">2. Liquidités & Comptes</h3>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Argent liquide & Banque (EUR)</label>
              <input type="number" value={cash} onChange={(e) => setCash(e.target.value)} placeholder="0.00" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-gray-900 dark:text-white" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">3. Investissements & Commerce</h3>
             <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Actions & Placements (EUR)</label>
                <input type="number" value={stocks} onChange={(e) => setStocks(e.target.value)} placeholder="0.00" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Marchandises destinées à la vente (EUR)</label>
                <input type="number" value={merchandise} onChange={(e) => setMerchandise(e.target.value)} placeholder="0.00" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-gray-900 dark:text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-bold text-red-500 mb-4">4. Dettes & Emprunts</h3>
             <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Dettes à rembourser immédiatement (EUR)</label>
              <input type="number" value={debts} onChange={(e) => setDebts(e.target.value)} placeholder="0.00" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-gray-900 dark:text-white" />
            </div>
          </div>
        </div>

        <div>
          <motion.div 
            className="bg-amber-500 rounded-3xl p-8 shadow-xl text-white sticky top-24"
            animate={{ scale: zakatDue > 0 ? 1.02 : 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3 className="uppercase tracking-widest text-xs font-bold mb-6 text-amber-100">Bilan Zakat</h3>
            
            <div className="space-y-3 mb-8">
               <div className="flex justify-between items-center text-sm border-b border-amber-400/30 pb-2">
                 <span>Richesse totale estimée</span>
                 <span className="font-mono">{total.toLocaleString('fr-FR', {style: 'currency', currency: 'EUR'})}</span>
               </div>
               <div className="flex justify-between items-center text-sm border-b border-amber-400/30 pb-2 text-amber-200">
                 <span>Nisab (Base Or)</span>
                 <span className="font-mono">{nisab.toLocaleString('fr-FR', {style: 'currency', currency: 'EUR'})}</span>
               </div>
            </div>

            <div className="bg-amber-600/50 rounded-2xl p-6 text-center shadow-inner">
               <span className="block text-amber-200 text-sm font-bold uppercase tracking-widest mb-2">Montant de Zakat dû</span>
               <span className="block text-4xl sm:text-5xl font-black tabular-nums tracking-tight">
                 {zakatDue.toLocaleString('fr-FR', {style: 'currency', currency: 'EUR'})}
               </span>
            </div>

            {total > 0 && total < nisab && (
              <p className="text-center mt-6 text-sm font-medium bg-white/20 p-3 rounded-xl border border-white/30">
                Votre richesse n'a pas atteint le Nisab. La Zakat n'est pas obligatoire.
              </p>
            )}

            {zakatDue > 0 && (
              <p className="text-center mt-6 text-sm font-medium bg-black/20 p-3 rounded-xl border border-black/10">
                Alhamdulillah, la purification de vos biens s'élève à 2.5% de votre richesse nette. Pensez à la reverser aux nécessiteux.
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
