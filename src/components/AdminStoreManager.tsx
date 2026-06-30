import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { Edit2, Trash2, Plus, X, ShoppingBag } from 'lucide-react';

export const AdminStoreManager = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Product Form State
  const [formData, setFormData] = useState({
    name: { fr: '', en: '', ar: '' },
    description: { fr: '', en: '', ar: '' },
    category: 'Livres',
    price: '',
    pointsCost: '',
    image: '',
    affiliateLink: '',
    color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    iconName: 'Book'
  });

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'store_products'), (snap) => {
      setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        pointsCost: formData.pointsCost ? parseInt(formData.pointsCost) : null,
        date: new Date().toISOString(),
        popularity: 0
      };

      if (editingId) {
        await updateDoc(doc(db, 'store_products', editingId), data);
      } else {
        await setDoc(doc(db, 'store_products', Date.now().toString()), data);
      }
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      console.error(err);
      alert('Erreur de sauvegarde');
    }
  };

  const deleteProduct = async (id: string) => {
    if (confirm("Supprimer ce produit ?")) {
      await deleteDoc(doc(db, 'store_products', id));
    }
  };

  const openEdit = (product: any) => {
    setEditingId(product.id);
    setFormData({
      name: product.name || { fr: '', en: '', ar: '' },
      description: product.description || { fr: '', en: '', ar: '' },
      category: product.category,
      price: product.price,
      pointsCost: product.pointsCost ? product.pointsCost.toString() : '',
      image: product.image,
      affiliateLink: product.affiliateLink || '',
      color: product.color || 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
      iconName: product.iconName || 'Book'
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: { fr: '', en: '', ar: '' },
      description: { fr: '', en: '', ar: '' },
      category: 'Livres',
      price: '',
      pointsCost: '',
      image: '',
      affiliateLink: '',
      color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
      iconName: 'Book'
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2"><ShoppingBag className="text-emerald-500" /> Gestion Boutique</h2>
        <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="bg-emerald-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-emerald-700">
          <Plus size={18} /> Ajouter Produit
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(p => (
          <div key={p.id} className="border border-gray-200 dark:border-gray-700 p-4 rounded-xl flex flex-col">
            <img src={p.image} className="w-full h-32 object-cover rounded-lg mb-4" />
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold">{p.name.fr || p.name}</h3>
              <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{p.category}</span>
            </div>
            <p className="text-sm text-gray-500 flex-1">{p.price} • {p.pointsCost ? `${p.pointsCost} pts` : 'Pas de pts'}</p>
            {p.affiliateLink && <p className="text-xs text-blue-500 mb-2">🔗 Produit affilié</p>}
            <div className="flex gap-2 mt-4">
              <button onClick={() => openEdit(p)} className="flex-1 bg-gray-100 dark:bg-gray-700 p-2 rounded-lg text-center hover:bg-gray-200"><Edit2 size={16} className="mx-auto" /></button>
              <button onClick={() => deleteProduct(p.id)} className="flex-1 bg-red-50 text-red-600 p-2 rounded-lg text-center hover:bg-red-100"><Trash2 size={16} className="mx-auto" /></button>
            </div>
          </div>
        ))}
        {products.length === 0 && <div className="col-span-3 text-center py-10 text-gray-500">Aucun produit configuré. Ajoutez-en un pour remplacer ceux par défaut.</div>}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500"><X size={24} /></button>
            <h3 className="text-xl font-bold mb-6">{editingId ? 'Modifier' : 'Ajouter'} un Produit</h3>
            <form onSubmit={handleSave} className="space-y-4">
              
              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl space-y-3">
                <h4 className="font-semibold text-sm">Nom du produit (3 langues)</h4>
                <input required placeholder="Nom (Français)" value={typeof formData.name === 'string' ? formData.name : formData.name.fr} onChange={e => setFormData({...formData, name: { ...formData.name, fr: e.target.value }})} className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
                <input placeholder="Nom (Anglais)" value={typeof formData.name === 'string' ? '' : formData.name.en} onChange={e => setFormData({...formData, name: { ...formData.name, en: e.target.value }})} className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
                <input placeholder="Nom (Arabe)" value={typeof formData.name === 'string' ? '' : formData.name.ar} onChange={e => setFormData({...formData, name: { ...formData.name, ar: e.target.value }})} className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-right" dir="auto" />
              </div>

              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl space-y-3">
                <h4 className="font-semibold text-sm">Description (3 langues)</h4>
                <textarea required placeholder="Description (Français)" value={typeof formData.description === 'string' ? formData.description : formData.description.fr} onChange={e => setFormData({...formData, description: { ...formData.description, fr: e.target.value }})} className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
                <textarea placeholder="Description (Anglais)" value={typeof formData.description === 'string' ? '' : formData.description.en} onChange={e => setFormData({...formData, description: { ...formData.description, en: e.target.value }})} className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
                <textarea placeholder="Description (Arabe)" value={typeof formData.description === 'string' ? '' : formData.description.ar} onChange={e => setFormData({...formData, description: { ...formData.description, ar: e.target.value }})} className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-right" dir="auto" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Prix (texte, ex: 15€, 20 USD)</label>
                  <input required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Points requis (Optionnel)</label>
                  <input type="number" value={formData.pointsCost} onChange={e => setFormData({...formData, pointsCost: e.target.value})} className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1">Catégorie</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700">
                  {['Bagues', 'Encens', 'Livres', 'Talismans', 'Numérique', 'Abonnements', 'Autre'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">URL de l'image</label>
                <input required type="url" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
              </div>

              <div>
                <label className="block text-sm mb-1 text-blue-600 font-semibold">Lien d'affiliation externe (Optionnel)</label>
                <input type="url" placeholder="https://..." value={formData.affiliateLink} onChange={e => setFormData({...formData, affiliateLink: e.target.value})} className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 border-blue-200" />
                <p className="text-xs text-gray-500 mt-1">Si renseigné, l'achat redirigera vers ce lien.</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Icône (Nom Lucide)</label>
                  <input value={formData.iconName} onChange={e => setFormData({...formData, iconName: e.target.value})} placeholder="Book, Shield, Zap..." className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
                </div>
              </div>

              <button type="submit" className="w-full bg-emerald-600 text-white p-3 rounded-xl font-bold hover:bg-emerald-700 mt-4">
                Enregistrer
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
