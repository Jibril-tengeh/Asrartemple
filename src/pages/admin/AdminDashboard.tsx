import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, Users, BarChart3, Database, Shield, LayoutDashboard, 
  Book, ToggleLeft, Volume2, Save, Search, Plus, Trash2, Edit2 
} from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';

type AdminTab = 'overview' | 'users' | 'community' | 'features' | 'ruqyah' | 'content' | 'notifications' | 'settings';

interface Term {
  id: string;
  word: string;
  definition: string;
  category: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  isBanned: boolean;
  mysteryToolsDisabled: boolean;
  isTrusted: boolean;
}

interface RuqyahAudio {
  id: string;
  title: string;
  url: string;
  duration: string;
  isActive: boolean;
}

interface CommunityPost {
  id: string;
  author: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
}

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  
  // Settings State
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Content State (Mocking Lexique Content Management)
  const [lexiqueTerms, setLexiqueTerms] = useState<Term[]>([]);
  const [newTerm, setNewTerm] = useState<Partial<Term>>({ word: '', definition: '', category: 'Général' });

  // Users State
  const [users, setUsers] = useState<User[]>([]);

  // Ruqyah Audio State
  const [ruqyahAudios, setRuqyahAudios] = useState<RuqyahAudio[]>([]);
  const [newAudio, setNewAudio] = useState<Partial<RuqyahAudio>>({ title: '', url: '', duration: '' });

  // Community State
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);

  // Notifications State
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [newNotification, setNewNotification] = useState<Partial<Notification>>({ title: '', message: '' });

  // Mock Stats
  const stats = [
    { title: 'Utilisateurs Actifs', value: users.length.toString(), change: '+12%', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { title: 'Outils Utilisés (7j)', value: '8,432', change: '+5%', icon: BarChart3, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { title: 'Mots du Lexique', value: lexiqueTerms.length.toString(), change: '+2', icon: Book, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  ];

  useEffect(() => {
    // Load settings
    const isAudioEnabled = localStorage.getItem('admin_ruqyah_audio_enabled') === 'true';
    setAudioEnabled(isAudioEnabled);
    
    const unsubscribeUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User)));
    });

    const unsubscribeLexique = onSnapshot(collection(db, 'lexique_terms'), (snapshot) => {
      setLexiqueTerms(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Term)));
    });

    const unsubscribeAudios = onSnapshot(collection(db, 'ruqyah_audios'), (snapshot) => {
      setRuqyahAudios(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RuqyahAudio)));
    });

    const unsubscribePosts = onSnapshot(query(collection(db, 'community_posts'), orderBy('createdAt', 'desc')), (snapshot) => {
      setCommunityPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CommunityPost)));
    });

    const unsubscribeNotifs = onSnapshot(query(collection(db, 'notifications'), orderBy('createdAt', 'desc')), (snapshot) => {
      setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification)));
    });

    return () => {
      unsubscribeUsers();
      unsubscribeLexique();
      unsubscribeAudios();
      unsubscribePosts();
      unsubscribeNotifs();
    };
  }, []);

  const toggleAudio = () => {
    const newVal = !audioEnabled;
    setAudioEnabled(newVal);
    localStorage.setItem('admin_ruqyah_audio_enabled', String(newVal));
  };

  const handleAddTerm = async () => {
    if (!newTerm.word || !newTerm.definition) return;
    try {
      await addDoc(collection(db, 'lexique_terms'), {
        word: newTerm.word,
        definition: newTerm.definition,
        category: newTerm.category || 'Général'
      });
      setNewTerm({ word: '', definition: '', category: 'Général' });
    } catch (error) {
      console.error("Error adding term", error);
    }
  };

  const handleDeleteTerm = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'lexique_terms', id));
    } catch (error) {
      console.error("Error deleting term", error);
    }
  };

  const handleToggleUserBan = async (id: string) => {
    const user = users.find(u => u.id === id);
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', id), { isBanned: !user.isBanned });
    } catch (error) {
      console.error("Error updating user", error);
    }
  };

  const handleToggleMysteryTools = async (id: string) => {
    const user = users.find(u => u.id === id);
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', id), { mysteryToolsDisabled: !user.mysteryToolsDisabled });
    } catch (error) {
      console.error("Error updating user", error);
    }
  };

  const handleToggleUserTrusted = async (id: string) => {
    const user = users.find(u => u.id === id);
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', id), { isTrusted: !user.isTrusted });
    } catch (error) {
      console.error("Error updating user", error);
    }
  };

  const handleAddAudio = async () => {
    if (!newAudio.title || !newAudio.url) return;
    try {
      await addDoc(collection(db, 'ruqyah_audios'), {
        title: newAudio.title,
        url: newAudio.url,
        duration: newAudio.duration || 'Inconnue',
        isActive: true
      });
      setNewAudio({ title: '', url: '', duration: '' });
    } catch (error) {
      console.error("Error adding audio", error);
    }
  };

  const handleDeleteAudio = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'ruqyah_audios', id));
    } catch (error) {
      console.error("Error deleting audio", error);
    }
  };

  const handleToggleAudioActive = async (id: string) => {
    const audio = ruqyahAudios.find(a => a.id === id);
    if (!audio) return;
    try {
      await updateDoc(doc(db, 'ruqyah_audios', id), { isActive: !audio.isActive });
    } catch (error) {
      console.error("Error updating audio", error);
    }
  };

  const handleUpdatePostStatus = async (id: string, status: 'pending' | 'approved' | 'rejected') => {
    try {
      await updateDoc(doc(db, 'community_posts', id), { status });
    } catch (error) {
      console.error("Error updating post", error);
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'community_posts', id));
    } catch (error) {
      console.error("Error deleting post", error);
    }
  };

  const handleAddNotification = async () => {
    if (!newNotification.title || !newNotification.message) return;
    try {
      await addDoc(collection(db, 'notifications'), {
        title: newNotification.title,
        message: newNotification.message,
        date: new Date().toISOString(),
        createdAt: new Date()
      });
      setNewNotification({ title: '', message: '' });
    } catch (error) {
      console.error("Error adding notification", error);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'notifications', id));
    } catch (error) {
      console.error("Error deleting notification", error);
    }
  };

  const handleExportData = () => {
    const allData = {
      users,
      lexiqueTerms,
      ruqyahAudios,
      communityPosts,
      notifications,
      settings: {
        audioEnabled,
        maintenanceMode
      }
    };
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_admin_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const renderTabNavigation = () => (
    <div className="flex overflow-x-auto pb-4 mb-6 hide-scrollbar gap-2">
      {[
        { id: 'overview', label: 'Vue d\'ensemble', icon: LayoutDashboard },
        { id: 'users', label: 'Utilisateurs', icon: Users },
        { id: 'community', label: 'Communauté', icon: Users },
        { id: 'notifications', label: 'Notifications', icon: Volume2 },
        { id: 'features', label: 'Fonctionnalités', icon: ToggleLeft },
        { id: 'ruqyah', label: 'Audio Ruqyah', icon: Volume2 },
        { id: 'content', label: 'CMS (Lexique)', icon: Database },
        { id: 'settings', label: 'Paramètres', icon: Settings },
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id as AdminTab)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
            activeTab === tab.id
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
          }`}
        >
          <tab.icon size={18} />
          {tab.label}
        </button>
      ))}
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <h3 className="font-semibold text-gray-600 dark:text-gray-400 text-sm">{stat.title}</h3>
            </div>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
              <span className="text-emerald-500 text-sm font-medium mb-1">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Engagement par Outil (Popularité)</h3>
          <div className="space-y-3">
            {[
              { name: 'Ruqyah', percentage: 85, color: 'bg-emerald-500' },
              { name: 'Calculateur Abjad', percentage: 65, color: 'bg-blue-500' },
              { name: 'Daily Dhikr', percentage: 55, color: 'bg-purple-500' },
              { name: 'Journal des Rêves', percentage: 40, color: 'bg-amber-500' }
            ].map(tool => (
              <div key={tool.name} className="flex flex-col gap-1">
                <div className="flex justify-between text-xs font-semibold text-gray-600 dark:text-gray-400">
                  <span>{tool.name}</span>
                  <span>{tool.percentage}%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className={`h-full ${tool.color} rounded-full`} style={{ width: `${tool.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Temps d'Utilisation Moyen</h3>
          <div className="flex items-center justify-center h-40">
            <div className="text-center">
              <p className="text-5xl font-bold text-gray-900 dark:text-white mb-2">14<span className="text-2xl text-gray-400">m</span></p>
              <p className="text-sm text-gray-500 dark:text-gray-400">par session en moyenne</p>
              <div className="mt-4 flex gap-2 justify-center text-xs text-gray-500">
                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-lg">Méditation: 8m</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg">Outils: 6m</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Activité Récente (Mock)</h3>
        <div className="space-y-4">
          {[
            "Un nouvel utilisateur s'est inscrit",
            "Mise à jour du Lexique par admin",
            "Nouveau record de Dhikr quotidien",
            "Utilisation de l'outil Abjad en hausse"
          ].map((activity, idx) => (
            <div key={idx} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300 p-3 bg-gray-50 dark:bg-gray-750 rounded-xl border border-gray-100 dark:border-gray-700">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              {activity}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="font-bold text-gray-900 dark:text-white mb-6">Gestion des Utilisateurs</h3>
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-750 border border-gray-100 dark:border-gray-700 rounded-2xl gap-4">
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  {user.name}
                  {user.isBanned && <span className="bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">Banni</span>}
                  {user.isTrusted && <span className="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">De Confiance</span>}
                </h4>
                <p className="text-sm text-gray-500 mt-1">{user.email}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => handleToggleUserTrusted(user.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    user.isTrusted 
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                      : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {user.isTrusted ? 'Retirer Confiance' : 'Rendre Confiance'}
                </button>
                <button
                  onClick={() => handleToggleMysteryTools(user.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    user.mysteryToolsDisabled 
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
                      : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {user.mysteryToolsDisabled ? 'Activer Outils Mystères' : 'Désactiver Outils Mystères'}
                </button>
                <button
                  onClick={() => handleToggleUserBan(user.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    user.isBanned 
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
                  }`}
                >
                  {user.isBanned ? 'Débannir' : 'Bannir'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRuqyah = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Publier un Audio Ruqyah</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Titre de l'audio"
            value={newAudio.title}
            onChange={(e) => setNewAudio({...newAudio, title: e.target.value})}
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
          />
          <input
            type="text"
            placeholder="URL (ex: https://...)"
            value={newAudio.url}
            onChange={(e) => setNewAudio({...newAudio, url: e.target.value})}
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div className="mb-4 w-full sm:w-1/2">
          <input
            type="text"
            placeholder="Durée (ex: 45:00)"
            value={newAudio.duration}
            onChange={(e) => setNewAudio({...newAudio, duration: e.target.value})}
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <button
          onClick={handleAddAudio}
          disabled={!newAudio.title || !newAudio.url}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-6 py-2 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors w-full sm:w-auto"
        >
          <Plus size={18} /> Publier l'audio
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Audios Publiés</h3>
        <div className="space-y-4">
          {ruqyahAudios.map((audio) => (
            <div key={audio.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-750 border border-gray-100 dark:border-gray-700 rounded-2xl gap-4">
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  {audio.title}
                  {!audio.isActive && <span className="bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">Inactif</span>}
                </h4>
                <p className="text-sm text-gray-500 mt-1">{audio.duration} - {audio.url}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleToggleAudioActive(audio.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    audio.isActive 
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 hover:bg-amber-200'
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 hover:bg-emerald-200'
                  }`}
                >
                  {audio.isActive ? 'Désactiver' : 'Activer'}
                </button>
                <button
                  onClick={() => handleDeleteAudio(audio.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                  title="Supprimer"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFeatures = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="font-bold text-gray-900 dark:text-white mb-6">Gestion des Outils Utilisateur</h3>
        <div className="space-y-4">
          {[
            { id: 'ruqyah', label: 'Module Ruqyah', desc: 'Accès aux versets de protection et guérison', active: true },
            { id: 'abjad', label: 'Calculateur Abjad', desc: 'Outil de numérologie arabe', active: true },
            { id: 'dreams', label: 'Journal des Rêves', desc: 'Fonctionnalité de suivi et interprétation', active: true },
            { id: 'zakat', label: 'Calculateur Zakat', desc: 'Module de calcul des aumônes', active: true }
          ].map((tool) => (
            <div key={tool.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-750 border border-gray-100 dark:border-gray-700 rounded-2xl gap-4">
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">{tool.label}</h4>
                <p className="text-sm text-gray-500 mt-1">{tool.desc}</p>
              </div>
              <button
                className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors ${
                  tool.active ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <div
                  className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${
                    tool.active ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
          <p className="text-xs text-gray-400 mt-4 italic">* Les modifications ici sont simulées pour l'exemple.</p>
        </div>
      </div>
    </div>
  );

  const renderContent = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Ajouter au Lexique</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Mot / Terme"
            value={newTerm.word}
            onChange={(e) => setNewTerm({...newTerm, word: e.target.value})}
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
          />
          <input
            type="text"
            placeholder="Catégorie (ex: Prière, Pratique)"
            value={newTerm.category}
            onChange={(e) => setNewTerm({...newTerm, category: e.target.value})}
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <textarea
          placeholder="Définition"
          value={newTerm.definition}
          onChange={(e) => setNewTerm({...newTerm, definition: e.target.value})}
          className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 h-24 resize-none mb-4"
        />
        <button
          onClick={handleAddTerm}
          disabled={!newTerm.word || !newTerm.definition}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-6 py-2 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors w-full sm:w-auto"
        >
          <Plus size={18} /> Ajouter le terme
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Termes du Lexique ({lexiqueTerms.length})</h3>
        <div className="space-y-3">
          {lexiqueTerms.map((term) => (
            <div key={term.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-750 border border-gray-100 dark:border-gray-700 rounded-xl gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-gray-900 dark:text-white">{term.word}</h4>
                  <span className="text-[10px] uppercase tracking-wider font-bold bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">
                    {term.category}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{term.definition}</p>
              </div>
              <button
                onClick={() => handleDeleteTerm(term.id)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 self-end sm:self-auto"
                title="Supprimer"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCommunity = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="font-bold text-gray-900 dark:text-white mb-6">Modération de la Communauté</h3>
        <div className="space-y-4">
          {communityPosts.map(post => (
            <div key={post.id} className="p-4 bg-gray-50 dark:bg-gray-750 border border-gray-100 dark:border-gray-700 rounded-2xl">
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-sm text-gray-900 dark:text-white">{post.author}</span>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                  post.status === 'approved' ? 'bg-emerald-100 text-emerald-600' :
                  post.status === 'rejected' ? 'bg-red-100 text-red-600' :
                  'bg-amber-100 text-amber-600'
                }`}>
                  {post.status === 'approved' ? 'Approuvé' : post.status === 'rejected' ? 'Rejeté' : 'En attente'}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{post.content}</p>
              <div className="flex gap-2">
                {post.status !== 'approved' && (
                  <button onClick={() => handleUpdatePostStatus(post.id, 'approved')} className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold hover:bg-emerald-200 transition-colors">
                    Approuver
                  </button>
                )}
                {post.status !== 'rejected' && (
                  <button onClick={() => handleUpdatePostStatus(post.id, 'rejected')} className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-semibold hover:bg-red-200 transition-colors">
                    Rejeter
                  </button>
                )}
                <button onClick={() => handleDeletePost(post.id)} className="px-3 py-1.5 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg text-xs font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors ml-auto flex items-center gap-1">
                  <Trash2 size={14} /> Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Envoyer une Notification Globale</h3>
        <div className="space-y-4 mb-6">
          <input
            type="text"
            placeholder="Titre de la notification"
            value={newNotification.title}
            onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
          />
          <textarea
            placeholder="Message (ex: Un nouvel audio de Ruqyah a été ajouté)"
            value={newNotification.message}
            onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 h-24 resize-none"
          />
          <button
            onClick={handleAddNotification}
            disabled={!newNotification.title || !newNotification.message}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-6 py-2 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors w-full sm:w-auto"
          >
            <Plus size={18} /> Envoyer la notification
          </button>
        </div>

        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Historique des Notifications</h3>
        <div className="space-y-4">
          {notifications.map(notif => (
            <div key={notif.id} className="p-4 bg-gray-50 dark:bg-gray-750 border border-gray-100 dark:border-gray-700 rounded-2xl flex justify-between items-start gap-4">
              <div>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">{notif.title}</h4>
                <p className="text-xs text-gray-500 mt-1 mb-2">{new Date(notif.date).toLocaleString('fr-FR')}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{notif.message}</p>
              </div>
              <button onClick={() => handleDeleteNotification(notif.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="font-bold text-gray-900 dark:text-white mb-6">Paramètres Globaux</h3>
        
        <div className="space-y-4 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-750 border border-gray-100 dark:border-gray-700 rounded-2xl gap-4">
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Volume2 size={18} className="text-emerald-500" />
                Lecture Audio Globale (Ruqyah)
              </h4>
              <p className="text-sm text-gray-500 mt-1">Activer ou désactiver la synthèse vocale pour tous les utilisateurs.</p>
            </div>
            <button
              onClick={toggleAudio}
              className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors ${
                audioEnabled ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div
                className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${
                  audioEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-750 border border-gray-100 dark:border-gray-700 rounded-2xl gap-4">
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Shield size={18} className="text-red-500" />
                Mode Maintenance
              </h4>
              <p className="text-sm text-gray-500 mt-1">Afficher une page de maintenance aux utilisateurs (Mock).</p>
            </div>
            <button
              onClick={() => setMaintenanceMode(!maintenanceMode)}
              className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors ${
                maintenanceMode ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div
                className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${
                  maintenanceMode ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Sauvegarde et Export</h3>
        <div className="p-4 bg-gray-50 dark:bg-gray-750 border border-gray-100 dark:border-gray-700 rounded-2xl">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Téléchargez une copie complète des données de l'application (utilisateurs, lexique, statistiques, posts) au format JSON.
          </p>
          <button
            onClick={handleExportData}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors w-full sm:w-auto"
          >
            <Save size={18} /> Exporter les données
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24 border-none min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-2xl">
          <Shield size={28} />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">Gérez le contenu et les paramètres de l'application</p>
        </div>
      </div>

      {renderTabNavigation()}

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'community' && renderCommunity()}
        {activeTab === 'notifications' && renderNotifications()}
        {activeTab === 'features' && renderFeatures()}
        {activeTab === 'ruqyah' && renderRuqyah()}
        {activeTab === 'content' && renderContent()}
        {activeTab === 'settings' && renderSettings()}
      </motion.div>
    </div>
  );
};
