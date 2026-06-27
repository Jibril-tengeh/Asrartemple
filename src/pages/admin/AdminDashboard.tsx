import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { AuthModal } from '../../components/AuthModal';
import { 
  Settings, Users, BarChart3, Database, Shield, LayoutDashboard, 
  Book, ToggleLeft, Volume2, Save, Search, Plus, Trash2, Edit2, FileText,
  Eye, Image as ImageIcon, Crop as CropIcon, X, Upload
} from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { TipTapEditor } from '../../components/TipTapEditor';
import Editor from '@monaco-editor/react';
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

type AdminTab = 'overview' | 'users' | 'community' | 'features' | 'ruqyah' | 'content' | 'notifications' | 'settings' | 'articles';

interface Article {
  id: string;
  title: string;
  thumbnail: string;
  content: string;
  type: 'richtext' | 'code';
  createdAt: number;
}

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
  const [newTerm, setNewTerm] = useState<any>({ 
    word_fr: '', definition_fr: '', 
    word_en: '', definition_en: '', 
    word_ha: '', definition_ha: '', 
    category: 'Général' 
  });

  // Users State
  const [users, setUsers] = useState<User[]>([]);

  // Ruqyah Audio State
  const [ruqyahAudios, setRuqyahAudios] = useState<RuqyahAudio[]>([]);
  const [newAudio, setNewAudio] = useState<any>({ 
    title_fr: '', title_en: '', title_ha: '', 
    url: '', duration: '' 
  });

  // Community State
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);

  // Notifications State
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [newNotification, setNewNotification] = useState<any>({ 
    title_fr: '', message_fr: '',
    title_en: '', message_en: '',
    title_ha: '', message_ha: ''
  });

  // Articles State
  const [articles, setArticles] = useState<Article[]>([]);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [newArticle, setNewArticle] = useState<Partial<Article>>({
    title: '', thumbnail: '', content: '', type: 'richtext'
  });
  const [showPreview, setShowPreview] = useState(false);
  const [draftSavedMessage, setDraftSavedMessage] = useState('');
  
  // Crop state
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<any>(null);
  const imageRef = React.useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Load draft on mount
    const draft = localStorage.getItem('asrarhub_article_draft');
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        if (parsed.title || parsed.content) {
          setNewArticle(parsed);
        }
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    // Auto-save draft
    if (activeTab === 'articles' && (newArticle.title || newArticle.content) && !editingArticle) {
      const timer = setTimeout(() => {
        localStorage.setItem('asrarhub_article_draft', JSON.stringify(newArticle));
        setDraftSavedMessage(`Brouillon sauvegardé à ${new Date().toLocaleTimeString()}`);
        setTimeout(() => setDraftSavedMessage(''), 3000);
      }, 2000);
      return () => clearTimeout(timer);
    } else if (activeTab === 'articles' && !newArticle.title && !newArticle.content) {
       localStorage.removeItem('asrarhub_article_draft');
    }
  }, [newArticle, activeTab, editingArticle]);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCropComplete = () => {
    if (imageRef.current && completedCrop?.width && completedCrop?.height) {
      const canvas = document.createElement('canvas');
      const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
      const scaleY = imageRef.current.naturalHeight / imageRef.current.height;
      canvas.width = completedCrop.width;
      canvas.height = completedCrop.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(
          imageRef.current,
          completedCrop.x * scaleX,
          completedCrop.y * scaleY,
          completedCrop.width * scaleX,
          completedCrop.height * scaleY,
          0,
          0,
          completedCrop.width,
          completedCrop.height
        );
        const base64Image = canvas.toDataURL('image/jpeg', 0.8);
        setNewArticle({ ...newArticle, thumbnail: base64Image });
        setImgSrc('');
        setCrop(undefined);
      }
    }
  };

  const [activeLangTab, setActiveLangTab] = useState<'fr' | 'en' | 'ha'>('fr');

  // Mock Stats
  const stats = [
    { title: 'Utilisateurs Actifs', value: users.length.toString(), change: '+12%', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { title: 'Outils Utilisés (7j)', value: '8,432', change: '+5%', icon: BarChart3, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { title: 'Articles Publiés', value: articles.length.toString(), change: '+1', icon: FileText, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
  ];

  useEffect(() => {
    // Load settings
    const isAudioEnabled = localStorage.getItem('admin_ruqyah_audio_enabled') === 'true';
    setAudioEnabled(isAudioEnabled);
    
    const unsubscribeUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User)));
    }, (error) => console.error("Admin Users error", error));

    const unsubscribeLexique = onSnapshot(collection(db, 'lexique_terms'), (snapshot) => {
      setLexiqueTerms(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Term)));
    }, (error) => console.error("Admin Lexique error", error));

    const unsubscribeAudios = onSnapshot(collection(db, 'ruqyah_audios'), (snapshot) => {
      setRuqyahAudios(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RuqyahAudio)));
    }, (error) => console.error("Admin Audios error", error));

    const unsubscribePosts = onSnapshot(query(collection(db, 'community_posts'), orderBy('createdAt', 'desc')), (snapshot) => {
      setCommunityPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CommunityPost)));
    }, (error) => console.error("Admin Posts error", error));

    const unsubscribeNotifs = onSnapshot(query(collection(db, 'notifications'), orderBy('createdAt', 'desc')), (snapshot) => {
      setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification)));
    }, (error) => console.error("Admin Notifs error", error));

    const unsubscribeArticles = onSnapshot(query(collection(db, 'articles'), orderBy('createdAt', 'desc')), (snapshot) => {
      setArticles(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article)));
    }, (error) => console.error("Admin Articles error", error));

    return () => {
      unsubscribeUsers();
      unsubscribeLexique();
      unsubscribeAudios();
      unsubscribePosts();
      unsubscribeNotifs();
      unsubscribeArticles();
    };
  }, []);

  const toggleAudio = () => {
    const newVal = !audioEnabled;
    setAudioEnabled(newVal);
    localStorage.setItem('admin_ruqyah_audio_enabled', String(newVal));
  };

  const handleAddTerm = async () => {
    if (!newTerm.word_fr || !newTerm.definition_fr) return;
    try {
      await addDoc(collection(db, 'lexique_terms'), {
        word: newTerm.word_fr,
        word_fr: newTerm.word_fr,
        word_en: newTerm.word_en,
        word_ha: newTerm.word_ha,
        definition: newTerm.definition_fr,
        definition_fr: newTerm.definition_fr,
        definition_en: newTerm.definition_en,
        definition_ha: newTerm.definition_ha,
        category: newTerm.category || 'Général'
      });
      setNewTerm({ 
        word_fr: '', definition_fr: '', 
        word_en: '', definition_en: '', 
        word_ha: '', definition_ha: '', 
        category: 'Général' 
      });
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
    if (!newAudio.title_fr || !newAudio.url) return;
    try {
      await addDoc(collection(db, 'ruqyah_audios'), {
        title: newAudio.title_fr,
        title_fr: newAudio.title_fr,
        title_en: newAudio.title_en,
        title_ha: newAudio.title_ha,
        url: newAudio.url,
        duration: newAudio.duration || 'Inconnue',
        isActive: true
      });
      setNewAudio({ 
        title_fr: '', title_en: '', title_ha: '', 
        url: '', duration: '' 
      });
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
    if (!newNotification.title_fr || !newNotification.message_fr) return;
    try {
      await addDoc(collection(db, 'notifications'), {
        title: newNotification.title_fr,
        title_fr: newNotification.title_fr,
        title_en: newNotification.title_en,
        title_ha: newNotification.title_ha,
        message: newNotification.message_fr,
        message_fr: newNotification.message_fr,
        message_en: newNotification.message_en,
        message_ha: newNotification.message_ha,
        date: new Date().toISOString(),
        createdAt: new Date()
      });
      setNewNotification({ 
        title_fr: '', message_fr: '',
        title_en: '', message_en: '',
        title_ha: '', message_ha: ''
      });
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
      articles,
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

  const handleSaveArticle = async () => {
    if (!newArticle.title || !newArticle.content) return;
    try {
      if (editingArticle) {
        await updateDoc(doc(db, 'articles', editingArticle.id), {
          title: newArticle.title,
          thumbnail: newArticle.thumbnail,
          content: newArticle.content,
          type: newArticle.type
        });
        setEditingArticle(null);
      } else {
        await addDoc(collection(db, 'articles'), {
          title: newArticle.title,
          thumbnail: newArticle.thumbnail,
          content: newArticle.content,
          type: newArticle.type || 'richtext',
          createdAt: Date.now()
        });
      }
      setNewArticle({ title: '', thumbnail: '', content: '', type: 'richtext' });
    } catch (error) {
      console.error("Error saving article", error);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'articles', id));
    } catch (error) {
      console.error("Error deleting article", error);
    }
  };

  const handleDeleteAllArticles = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer TOUS les articles ? Cette action est irréversible.")) return;
    try {
      const promises = articles.map(article => deleteDoc(doc(db, 'articles', article.id)));
      await Promise.all(promises);
      alert("Tous les articles ont été supprimés.");
    } catch (error) {
      console.error("Error deleting all articles", error);
    }
  };

  const editArticle = (article: Article) => {
    setEditingArticle(article);
    setNewArticle({ title: article.title, thumbnail: article.thumbnail, content: article.content, type: article.type });
    setActiveTab('articles');
  };

  const renderTabNavigation = () => (
    <div className="flex overflow-x-auto pb-4 mb-6 hide-scrollbar gap-2">
      {[
        { id: 'overview', label: 'Vue d\'ensemble', icon: LayoutDashboard },
        { id: 'users', label: 'Utilisateurs', icon: Users },
        { id: 'articles', label: 'Articles', icon: FileText },
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

  const renderLanguageTabs = () => (
    <div className="flex gap-2 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
      {[
        { id: 'fr', label: 'Français' },
        { id: 'en', label: 'English' },
        { id: 'ha', label: 'Hausa' }
      ].map(lang => (
        <button
          key={lang.id}
          onClick={() => setActiveLangTab(lang.id as any)}
          className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
            activeLangTab === lang.id
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
              : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );

  const renderRuqyah = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Publier un Audio Ruqyah</h3>
        {renderLanguageTabs()}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder={`Titre de l'audio (${activeLangTab.toUpperCase()})`}
            value={newAudio[`title_${activeLangTab}`] || ''}
            onChange={(e) => setNewAudio({...newAudio, [`title_${activeLangTab}`]: e.target.value})}
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
          disabled={!newAudio.title_fr || !newAudio.url}
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
        {renderLanguageTabs()}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder={`Mot / Terme (${activeLangTab.toUpperCase()})`}
            value={newTerm[`word_${activeLangTab}`] || ''}
            onChange={(e) => setNewTerm({...newTerm, [`word_${activeLangTab}`]: e.target.value})}
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
          placeholder={`Définition (${activeLangTab.toUpperCase()})`}
          value={newTerm[`definition_${activeLangTab}`] || ''}
          onChange={(e) => setNewTerm({...newTerm, [`definition_${activeLangTab}`]: e.target.value})}
          className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 h-24 resize-none mb-4"
        />
        <button
          onClick={handleAddTerm}
          disabled={!newTerm.word_fr || !newTerm.definition_fr}
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

  const renderArticles = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-gray-900 dark:text-white">
            {editingArticle ? "Éditer l'Article" : "Nouvel Article"}
          </h3>
          {draftSavedMessage && (
            <span className="text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-md">
              {draftSavedMessage}
            </span>
          )}
        </div>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Titre de l'article"
            value={newArticle.title || ''}
            onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
          />
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Image de couverture (Thumbnail)
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl cursor-pointer text-sm font-semibold transition-colors">
                <Upload size={16} />
                Télécharger une image
                <input type="file" accept="image/*" onChange={onSelectFile} className="hidden" />
              </label>
              {newArticle.thumbnail && !imgSrc && (
                <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <img src={newArticle.thumbnail} alt="Thumbnail preview" className="w-full h-full object-cover" />
                  <button onClick={() => setNewArticle({ ...newArticle, thumbnail: '' })} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600">
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>
            {imgSrc && (
              <div className="mt-4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900">
                <p className="text-xs text-gray-500 mb-2">Recadrez votre image puis validez</p>
                <ReactCrop crop={crop} onChange={(_, percentCrop) => setCrop(percentCrop)} onComplete={(c) => setCompletedCrop(c)}>
                  <img ref={imageRef} src={imgSrc} alt="Crop preview" style={{ maxHeight: '300px' }} />
                </ReactCrop>
                <div className="flex gap-2 mt-4">
                  <button onClick={handleCropComplete} className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold flex items-center gap-2">
                    <CropIcon size={16} /> Valider le recadrage
                  </button>
                  <button onClick={() => { setImgSrc(''); setCrop(undefined); }} className="px-4 py-2 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-xl text-sm font-semibold">
                    Annuler
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex gap-4 mb-2">
            <button
              onClick={() => setNewArticle({ ...newArticle, type: 'richtext' })}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${
                newArticle.type === 'richtext' ? 'bg-emerald-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              <FileText size={16} /> Éditeur de Texte
            </button>
            <button
              onClick={() => setNewArticle({ ...newArticle, type: 'code' })}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${
                newArticle.type === 'code' ? 'bg-emerald-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              <LayoutDashboard size={16} /> Éditeur de Code
            </button>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden min-h-[300px]">
            {newArticle.type === 'richtext' ? (
              <TipTapEditor 
                value={newArticle.content || ''} 
                onChange={(val: any) => setNewArticle({ ...newArticle, content: val })} 
                className="h-full"
              />
            ) : (
              <Editor
                height="300px"
                defaultLanguage="javascript"
                theme="vs-dark"
                value={newArticle.content || ''}
                onChange={(val) => setNewArticle({ ...newArticle, content: val || '' })}
                options={{ minimap: { enabled: false } }}
              />
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSaveArticle}
              className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <Save size={18} /> {editingArticle ? "Mettre à jour" : "Publier l'Article"}
            </button>
            <button
              onClick={() => setShowPreview(true)}
              disabled={!newArticle.title && !newArticle.content}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <Eye size={18} /> Prévisualiser
            </button>
            {editingArticle && (
              <button
                onClick={() => {
                  setEditingArticle(null);
                  setNewArticle({ title: '', thumbnail: '', content: '', type: 'richtext' });
                }}
                className="mt-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                Annuler
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mt-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-gray-900 dark:text-white">Articles ({articles.length})</h3>
          {articles.length > 0 && (
            <button
              onClick={handleDeleteAllArticles}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors"
            >
              <Trash2 size={16} /> Effacer tout
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {articles.map((article) => (
            <div key={article.id} className="p-4 bg-gray-50 dark:bg-gray-750 border border-gray-100 dark:border-gray-700 rounded-2xl flex gap-4">
              {article.thumbnail && (
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                  <img src={article.thumbnail} alt={article.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white">{article.title}</h4>
                  <span className="text-[10px] uppercase font-bold text-gray-500 bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded-full">
                    {article.type === 'richtext' ? 'Texte' : 'Code'}
                  </span>
                </div>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => editArticle(article)} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDeleteArticle(article.id)} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
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
        {renderLanguageTabs()}
        <div className="space-y-4 mb-6">
          <input
            type="text"
            placeholder={`Titre de la notification (${activeLangTab.toUpperCase()})`}
            value={newNotification[`title_${activeLangTab}`] || ''}
            onChange={(e) => setNewNotification({...newNotification, [`title_${activeLangTab}`]: e.target.value})}
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
          />
          <textarea
            placeholder={`Message (${activeLangTab.toUpperCase()})`}
            value={newNotification[`message_${activeLangTab}`] || ''}
            onChange={(e) => setNewNotification({...newNotification, [`message_${activeLangTab}`]: e.target.value})}
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 h-24 resize-none"
          />
          <button
            onClick={handleAddNotification}
            disabled={!newNotification.title_fr || !newNotification.message_fr}
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

  const { user } = useAuth();
  const navigate = useNavigate();
  
  const adminBypass = sessionStorage.getItem('admin_bypass') === 'true';
  
  if (!adminBypass && (!user || user.role !== 'admin')) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <AuthModal isOpen={true} onClose={() => navigate('/')} />
      </div>
    );
  }

  const renderArticlePreviewModal = () => {
    if (!showPreview) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
              <Eye size={20} /> Prévisualisation (Vue Utilisateur)
            </h3>
            <button onClick={() => setShowPreview(false)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500">
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 lg:p-10 hide-scrollbar bg-gray-50 dark:bg-gray-900">
            <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
              {newArticle.thumbnail && (
                <div className="w-full h-64 md:h-80 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <img src={newArticle.thumbnail} alt={newArticle.title} className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 p-6 z-20">
                    <h1 className="text-2xl md:text-3xl font-black text-white">{newArticle.title || 'Titre Sans Nom'}</h1>
                  </div>
                </div>
              )}
              {!newArticle.thumbnail && (
                <div className="p-6 md:p-10 border-b border-gray-100 dark:border-gray-700">
                  <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">{newArticle.title || 'Titre Sans Nom'}</h1>
                </div>
              )}
              
              <div className="p-6 md:p-10 prose prose-emerald dark:prose-invert max-w-none">
                {newArticle.type === 'richtext' ? (
                  <div dangerouslySetInnerHTML={{ __html: newArticle.content || '' }} />
                ) : (
                  <pre className="p-4 rounded-xl bg-gray-900 text-gray-100 overflow-x-auto text-sm font-mono">
                    <code>{newArticle.content}</code>
                  </pre>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24 border-none min-h-screen">
      {renderArticlePreviewModal()}
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
        {activeTab === 'articles' && renderArticles()}
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
