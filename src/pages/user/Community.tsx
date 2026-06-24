import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, Send, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';

interface Post {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any;
}

export const Community: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    let q;
    if (user?.role === 'admin') {
      // Admins see all posts
      q = query(collection(db, 'community_posts'), orderBy('createdAt', 'desc'));
    } else if (user) {
      // Users see approved posts and their own posts
      // Note: A composite index might be required for complex queries in Firestore.
      // For simplicity here, we'll just fetch all approved, and filter client-side if needed, 
      // or we just fetch approved. We will just fetch approved to simplify.
      q = query(collection(db, 'community_posts'), where('status', '==', 'approved'));
    } else {
      q = query(collection(db, 'community_posts'), where('status', '==', 'approved'));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post)));
    }, (error) => {
      console.error("Community onSnapshot error:", error);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setFeedback({ type: 'error', message: 'Vous devez être connecté pour publier.' });
      return;
    }
    if (!newPostContent.trim()) return;

    setIsSubmitting(true);
    setFeedback(null);

    try {
      await addDoc(collection(db, 'community_posts'), {
        authorId: user.uid,
        authorName: user.name || 'Utilisateur',
        content: newPostContent.trim(),
        status: user.isTrusted ? 'approved' : 'pending',
        createdAt: new Date()
      });
      setNewPostContent('');
      setFeedback({ type: 'success', message: user.isTrusted ? 'Publié avec succès !' : 'Votre message est en attente de modération.' });
    } catch (error) {
      console.error("Error adding post", error);
      setFeedback({ type: 'error', message: 'Erreur lors de la publication.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-2xl">
          <Users size={28} />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Communauté</h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">Échangez et partagez avec la communauté</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
        <h2 className="font-bold text-gray-900 dark:text-white mb-4">Créer une publication</h2>
        {user ? (
          <form onSubmit={handleSubmit}>
            <textarea
              placeholder="Partagez une question, une expérience, ou un conseil..."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 resize-none h-32 mb-4"
              disabled={isSubmitting}
            />
            {feedback && (
              <div className={`p-3 rounded-xl mb-4 flex items-center gap-2 text-sm ${feedback.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {feedback.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                {feedback.message}
              </div>
            )}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !newPostContent.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                {isSubmitting ? 'Publication...' : (
                  <>
                    <Send size={18} /> Publier
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center p-6 bg-gray-50 dark:bg-gray-750 rounded-xl">
            <p className="text-gray-600 dark:text-gray-400 mb-4">Vous devez être connecté pour participer à la communauté.</p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <MessageSquare size={20} className="text-emerald-500" />
          Publications Récentes
        </h2>
        {posts.length === 0 ? (
          <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 text-gray-500">
            Aucune publication pour le moment.
          </div>
        ) : (
          posts.map(post => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-100 to-emerald-50 dark:from-emerald-900 dark:to-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-300 font-bold">
                    {post.authorName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">{post.authorName}</h3>
                    <p className="text-xs text-gray-500">
                      {post.createdAt?.seconds ? new Date(post.createdAt.seconds * 1000).toLocaleDateString('fr-FR') : 'Récent'}
                    </p>
                  </div>
                </div>
                {user?.role === 'admin' && post.status !== 'approved' && (
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-600">
                    En attente
                  </span>
                )}
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap">{post.content}</p>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
