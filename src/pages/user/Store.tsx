import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import { doc, updateDoc, increment, collection, onSnapshot } from 'firebase/firestore';
import { ShoppingBag, Star, Shield, Zap, Sparkles, Book, LayoutGrid, Square, List, Heart, Search, ChevronDown, X, Share2, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PremiumBadge } from '../../components/PremiumBadge';
import { PaystackService } from '../../services/PaystackService';

type LayoutMode = 'grid1' | 'grid2' | 'list';
type SortOption = 'Date' | 'Popularité' | 'Alphabétique';

export const Store: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('grid2');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [sortOption, setSortOption] = useState<SortOption>('Date');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [productRatings, setProductRatings] = useState<Record<number, number>>({});
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [paystackConfig, setPaystackConfig] = useState({ currency: 'GHS', amount: 150 });
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'store_products'), (snap) => {
      setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setIsLoading(false);
    }, (err) => {
      console.error(err);
      setIsLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    // Attempt to auto-detect country and currency for Paystack
    const detectCountry = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        const countryCode = data.country_code; // e.g. "GH", "NG", "ZA", "KE", "CI", "SN"

        let currency = 'GHS';
        let amount = 150; // default 150 GHS (approx 10 USD)

        switch(countryCode) {
          case 'GH': currency = 'GHS'; amount = 150; break;
          case 'NG': currency = 'NGN'; amount = 15000; break;
          case 'ZA': currency = 'ZAR'; amount = 200; break;
          case 'KE': currency = 'KES'; amount = 1500; break;
          // For Francophone West/Central Africa
          case 'CI': case 'SN': case 'ML': case 'BF': case 'TG': case 'BJ': case 'NE': case 'GW':
            currency = 'XOF'; amount = 6000; break;
          case 'CM': case 'GA': case 'CG': case 'TD': case 'CF': case 'GQ':
            currency = 'XAF'; amount = 6000; break;
          case 'RW': currency = 'RWF'; amount = 13000; break;
          case 'UG': currency = 'UGX'; amount = 38000; break;
          default: currency = 'USD'; amount = 10; break;
        }
        
        setPaystackConfig({ currency, amount });
      } catch (e) {
        console.error("Could not detect country, defaulting to GHS", e);
      }
    };
    detectCountry();
  }, []);

  const handlePurchase = async (product: any, usePoints: boolean = false, paymentMethod?: 'paystack') => {
    if (!user) {
      alert("Veuillez vous connecter pour effectuer un achat.");
      return;
    }

    if (product.affiliateLink && !usePoints) {
      window.open(product.affiliateLink, '_blank');
      return;
    }

    if (usePoints) {
      if ((user.spiritualPoints || 0) < product.pointsCost) {
        alert("Vous n'avez pas assez de points spirituels. (Solde: " + (user.spiritualPoints || 0) + ")");
        return;
      }
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          spiritualPoints: increment(-product.pointsCost)
        });
        alert(`Vous avez échangé ${product.pointsCost} points contre: ${product.name} !`);
        setSelectedProduct(null);
      } catch (err) {
        console.error("Erreur lors de l'échange de points", err);
        alert("Une erreur est survenue lors de l'échange.");
      }
    } else {
      // For all products (subscriptions and one-time), we will use paystack.
      
      try {
        const numericPrice = parseInt(product.price) || 15;
        const ratio = numericPrice / 15;
        const finalAmount = Math.round(paystackConfig.amount * ratio);

        await PaystackService.initializePaystackPayment(
          user.email || 'user@example.com',
          finalAmount,
          paystackConfig.currency,
          user.uid,
          (reference) => {
            alert(`Paiement réussi avec Paystack! Réf: ${reference}`);
            setSelectedProduct(null);
          },
          () => {
            console.log("Paystack modal closed");
          }
        );
      } catch (err) {
        console.error("Erreur lors du paiement", err);
        alert("Une erreur est survenue lors de l'initialisation du paiement.");
      }
    }
  };

  useEffect(() => {
    // Simulate initial data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let scrollInterval: NodeJS.Timeout;
    if (isAutoScrolling && scrollContainerRef.current) {
      scrollInterval = setInterval(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop += 1;
          if (scrollContainerRef.current.scrollTop + scrollContainerRef.current.clientHeight >= scrollContainerRef.current.scrollHeight) {
            setIsAutoScrolling(false);
          }
        }
      }, 50);
    }
    return () => clearInterval(scrollInterval);
  }, [isAutoScrolling]);

  useEffect(() => {
    if (!selectedProduct) {
      setIsAutoScrolling(false);
    }
  }, [selectedProduct]);

  const handleShare = (product: any) => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert(t('store.linkCopied', 'Lien copié dans le presse-papier !'));
    }
  };

  const handleRate = (productId: number, rating: number) => {
    setProductRatings(prev => ({ ...prev, [productId]: rating }));
  };

  const toggleFavorite = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const categories = ['Tous', 'Bagues', 'Encens', 'Livres', 'Talismans', 'Numérique', 'Abonnements'];

  const defaultProducts = [
    {
      id: 'default1',
      name: { fr: 'Bague de Souleymane', en: 'Ring of Solomon', ar: 'خاتم سليمان' },
      description: { fr: 'Bague gravée avec le sceau de Souleymane.', en: 'Ring engraved with the seal of Solomon.', ar: 'خاتم منقوش بخاتم سليمان.' },
      image: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=800&auto=format&fit=crop',
      iconName: 'Shield',
      color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
      category: 'Bagues',
      date: '2023-01-01',
      popularity: 85,
      price: '50€',
      pointsCost: 500
    },
    {
      id: 'default2',
      name: { fr: 'Livre: Shams al-Ma\'arif', en: 'Book: Shams al-Ma\'arif', ar: 'كتاب شمس المعارف' },
      description: { fr: 'Livre de référence classique.', en: 'Classic reference book.', ar: 'كتاب مرجعي كلاسيكي.' },
      image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800&auto=format&fit=crop',
      iconName: 'Book',
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
      category: 'Livres',
      date: '2022-11-20',
      popularity: 98,
      price: '40€',
      pointsCost: 400
    }
  ];

  const currentProducts = products.length > 0 ? products : defaultProducts;

  let filteredProducts = currentProducts.filter(p => {
    const pName = typeof p.name === 'string' ? p.name : (p.name[document.documentElement.lang] || p.name.fr || '');
    const pDesc = typeof p.description === 'string' ? p.description : (p.description[document.documentElement.lang] || p.description.fr || '');
    return (selectedCategory === 'Tous' || p.category === selectedCategory) &&
    (pName.toLowerCase().includes(searchQuery.toLowerCase()) || pDesc.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  filteredProducts.sort((a, b) => {
    if (sortOption === 'Date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortOption === 'Popularité') {
      return (b.popularity || 0) - (a.popularity || 0);
    } else if (sortOption === 'Alphabétique') {
      const aName = typeof a.name === 'string' ? a.name : (a.name[document.documentElement.lang] || a.name.fr || '');
      const bName = typeof b.name === 'string' ? b.name : (b.name[document.documentElement.lang] || b.name.fr || '');
      return aName.localeCompare(bName);
    }
    return 0;
  });

  const getLocalizedText = (field: any) => {
    if (typeof field === 'string') return field;
    return field?.[document.documentElement.lang] || field?.fr || '';
  };

  const getProductIcon = (iconName: string) => {
    const icons: any = { Shield, Sparkles, Book, Zap, Play, Star };
    return icons[iconName] || Book;
  };


  const sortOptions: SortOption[] = ['Date', 'Popularité', 'Alphabétique'];

  const renderSkeletons = () => {
    return Array.from({ length: 4 }).map((_, index) => (
      <div key={`skeleton-${index}`} className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden animate-pulse ${layoutMode === 'list' ? 'flex flex-row items-stretch h-40 sm:h-48' : 'flex flex-col h-full min-h-[320px]'}`}>
        <div className={`bg-gray-200 dark:bg-gray-700 ${layoutMode === 'list' ? 'w-32 sm:w-48 flex-shrink-0' : 'h-48 w-full'}`} />
        <div className={`p-4 sm:p-5 flex-1 flex flex-col`}>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-4"></div>
          <div className="mt-auto h-10 bg-gray-200 dark:bg-gray-700 rounded-xl w-full"></div>
        </div>
      </div>
    ));
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <ShoppingBag className="text-amber-500" />
            {t('store.title', 'Boutique Spirituelle')}
            <PremiumBadge />
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm sm:text-base">
            {t('store.subtitle', 'Découvrez notre sélection de produits, livres et talismans pour accompagner votre pratique.')}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <input 
              type="text" 
              placeholder={t('search', 'Rechercher...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>

          <div className="flex bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-1 flex-shrink-0 h-[46px] items-center">
            <button 
              onClick={() => setLayoutMode('grid2')}
              className={`p-2 rounded-lg transition-colors ${layoutMode === 'grid2' ? 'bg-gray-100 dark:bg-gray-700 text-emerald-600 dark:text-emerald-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
              title="2 Colonnes"
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setLayoutMode('grid1')}
              className={`p-2 rounded-lg transition-colors ${layoutMode === 'grid1' ? 'bg-gray-100 dark:bg-gray-700 text-emerald-600 dark:text-emerald-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
              title="1 Colonne"
            >
              <Square size={18} />
            </button>
            <button 
              onClick={() => setLayoutMode('list')}
              className={`p-2 rounded-lg transition-colors ${layoutMode === 'list' ? 'bg-gray-100 dark:bg-gray-700 text-emerald-600 dark:text-emerald-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
              title="Liste"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter & Sort */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex overflow-x-auto hide-scrollbar pb-2 sm:pb-0 gap-2 w-full sm:w-auto">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {t(`store.categories.${category.toLowerCase()}`, category)}
            </button>
          ))}
        </div>

        <div className="relative">
          <button 
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm"
          >
            {t('store.sortBy', 'Trier par:')} {t(`store.sort.${sortOption.toLowerCase()}`, sortOption)}
            <ChevronDown size={16} />
          </button>
          
          <AnimatePresence>
            {isSortOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)}></div>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg z-20 py-1"
                >
                  {sortOptions.map(option => (
                    <button
                      key={option}
                      onClick={() => {
                        setSortOption(option);
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${sortOption === option ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-gray-700 dark:text-gray-300'}`}
                    >
                      {t(`store.sort.${option.toLowerCase()}`, option)}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className={`grid gap-3 sm:gap-6 lg:gap-8 ${
        layoutMode === 'grid2' ? 'grid-cols-2 lg:grid-cols-3' : 
        layoutMode === 'list' ? 'grid-cols-1 lg:grid-cols-2' : 
        'grid-cols-1'
      }`}>
        <AnimatePresence mode="popLayout">
          {isLoading ? renderSkeletons() : filteredProducts.map((product, index) => (
            <motion.div
              layout
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSelectedProduct(product)}
              className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden cursor-pointer hover:shadow-md transition-shadow ${layoutMode === 'list' ? 'flex flex-row items-stretch h-40 sm:h-48' : 'flex flex-col h-full'}`}
            >
              <div className={`relative ${layoutMode === 'list' ? 'w-32 sm:w-48 flex-shrink-0' : 'h-48 w-full'}`}>
                <img src={product.image} alt={getLocalizedText(product.name)} className="w-full h-full object-cover" />
                <div className={`absolute top-3 left-3 w-10 h-10 rounded-xl flex items-center justify-center shadow-md backdrop-blur-md bg-white/80 dark:bg-gray-900/80 ${product.color?.split(' ')?.[1] || ''} ${product.color?.split(' ')?.[3] || ''}`}>
                  {(() => {
                    const Icon = getProductIcon(product.iconName);
                    return <Icon size={20} />;
                  })()}
                </div>
                <button
                  onClick={(e) => toggleFavorite(product.id, e)}
                  className="absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center shadow-md backdrop-blur-md bg-white/80 dark:bg-gray-900/80 text-gray-500 hover:text-red-500 transition-colors"
                  aria-label={favorites.includes(product.id) ? t('store.removeFavorite', "Retirer des favoris") : t('store.addFavorite', "Ajouter aux favoris")}
                >
                  <Heart 
                    size={20} 
                    className={favorites.includes(product.id) ? "fill-red-500 text-red-500" : ""} 
                  />
                </button>
              </div>

              <div className={`p-4 sm:p-5 flex-1 flex flex-col`}>
                <h3 className={`font-bold text-gray-900 dark:text-white mb-2 ${layoutMode === 'list' ? 'text-base sm:text-xl' : 'text-lg'}`}>{getLocalizedText(product.name)}</h3>
                <p className={`text-sm text-gray-500 dark:text-gray-400 flex-1 mb-2 ${layoutMode === 'list' ? 'line-clamp-2 sm:line-clamp-3' : 'line-clamp-2'}`}>
                  {getLocalizedText(product.description)}
                </p>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{product.price}</span>
                  {product.pointsCost && (
                    <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-full flex items-center gap-1">
                      <Sparkles size={12} />
                      ou {product.pointsCost} pts
                    </span>
                  )}
                </div>
                
                <div className={layoutMode === 'list' ? 'mt-auto flex justify-end' : 'mt-auto'}>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProduct(product);
                    }}
                    className={`py-2 sm:py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold transition-transform hover:scale-[1.02] active:scale-[0.98] ${layoutMode === 'list' ? 'px-6 text-sm sm:text-base' : 'w-full'}`}
                  >
                    {t('store.learnMore', 'En savoir plus')}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          {!isLoading && filteredProducts.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400">
              {t('store.noItems', 'Aucun article trouvé pour cette recherche.')}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedProduct(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="relative h-64 sm:h-80 w-full flex-shrink-0">
                <img src={selectedProduct.image} alt={getLocalizedText(selectedProduct.name)} className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 flex gap-2">
                  <button 
                    onClick={() => handleShare(selectedProduct)}
                    className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                    title={t('common.share', "Partager")}
                  >
                    <Share2 size={20} />
                  </button>
                  <button 
                    onClick={() => setSelectedProduct(null)}
                    className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className={`absolute top-4 left-4 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg backdrop-blur-md bg-white/90 dark:bg-gray-900/90 ${selectedProduct.color?.split(' ')?.[1] || ''} ${selectedProduct.color?.split(' ')?.[3] || ''}`}>
                  {(() => {
                    const Icon = getProductIcon(selectedProduct.iconName);
                    return <Icon size={24} />;
                  })()}
                </div>
              </div>
              <div ref={scrollContainerRef} className="p-6 sm:p-8 overflow-y-auto">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-xs font-bold text-gray-600 dark:text-gray-300">
                    {t(`store.categories.${selectedProduct.category.toLowerCase()}`, selectedProduct.category)}
                  </span>
                  <span className="text-sm text-gray-400">
                    {t('store.addedIn', 'Ajouté en')} {new Date(selectedProduct.date).getFullYear()}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {getLocalizedText(selectedProduct.name)}
                </h2>

                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{selectedProduct.price}</span>
                  {selectedProduct.pointsCost && (
                    <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-1.5 rounded-full flex items-center gap-2 font-semibold shadow-sm">
                      <Sparkles size={16} />
                      ou utiliser {selectedProduct.pointsCost} points
                    </span>
                  )}
                </div>
                
                <div className="mb-6">
                  <button 
                    onClick={() => setIsAutoScrolling(!isAutoScrolling)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                      isAutoScrolling 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {isAutoScrolling ? <Pause size={18} /> : <Play size={18} />}
                    {isAutoScrolling ? t('store.pauseScroll', 'Pause Défilement Auto') : t('store.startScroll', 'Activer Défilement Auto')}
                  </button>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                  {getLocalizedText(selectedProduct.description)} 
                  <br/><br/>
                  {t('store.quickPreview', "Ceci est un aperçu rapide. Pour plus de détails sur l'utilisation et les bienfaits de ce produit, veuillez contacter notre support ou vous référer à la documentation complète une fois acquis.")}
                  <br/><br/>
                  {t('store.autoScrollNote', "*Note*: Lorsque le défilement automatique est activé, le texte défilera lentement pour vous permettre de lire ou réciter sans utiliser vos mains.")}
                  <br/><br/>
                  {t('store.moreContent', "(Plus de contenu pour tester le défilement...)")}
                  <br/><br/>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus.
                </p>

                <div className="mb-8">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('store.rateSpiritual', "Évaluer l'efficacité spirituelle :")}</div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRate(selectedProduct.id, star)}
                        className={`p-1 transition-colors ${
                          (productRatings[selectedProduct.id] || 0) >= star
                            ? 'text-amber-500'
                            : 'text-gray-300 dark:text-gray-600 hover:text-amber-400'
                        }`}
                      >
                        <Star size={28} className={(productRatings[selectedProduct.id] || 0) >= star ? "fill-amber-500" : ""} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  {selectedProduct.pointsCost && (
                    <button 
                      onClick={() => handlePurchase(selectedProduct, true)}
                      className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2 shadow-md"
                    >
                      <Sparkles size={20} />
                      Utiliser {selectedProduct.pointsCost} pts
                    </button>
                  )}
                  {selectedProduct.category === 'Abonnements' ? (
                    <div className="flex flex-col flex-1 gap-2">
                      <button 
                        onClick={() => handlePurchase(selectedProduct, false, 'paystack')}
                        className="py-3 bg-[#0BA4DB] text-white rounded-xl font-bold transition-colors shadow-md hover:bg-[#0983AF]"
                      >
                        Payer avec Paystack ({paystackConfig.amount} {paystackConfig.currency})
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => handlePurchase(selectedProduct, false)}
                      className="flex-1 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2 shadow-md hover:bg-gray-800 dark:hover:bg-gray-100"
                    >
                      Acheter ({selectedProduct.price})
                    </button>
                  )}
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleShare(selectedProduct)}
                      className="w-14 sm:w-16 flex items-center justify-center rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      title={t('common.share', "Partager")}
                    >
                      <Share2 size={24} className="text-gray-500 dark:text-gray-400" />
                    </button>
                    <button 
                      onClick={() => toggleFavorite(selectedProduct.id, { stopPropagation: () => {} } as any)}
                      className={`w-14 sm:w-16 flex items-center justify-center rounded-xl border-2 transition-colors ${
                        favorites.includes(selectedProduct.id) 
                          ? 'border-red-500 bg-red-50 dark:bg-red-500/10' 
                          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Heart size={24} className={favorites.includes(selectedProduct.id) ? "fill-red-500 text-red-500" : "text-gray-400"} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
