import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Users,
  Send,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Pin,
  Inbox,
  Share2,
} from "lucide-react";
import { db } from "../../lib/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import { PostComments } from "./PostComments";
import { DirectMessages } from "./DirectMessages";

interface Post {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  status: "pending" | "approved" | "rejected";
  createdAt: any;
  isPinned?: boolean;
}

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    [
      "bold",
      "italic",
      "underline",
      "strike",
      "blockquote",
      "code-block",
    ],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image", "video"],
    ["clean"],
  ],
};

export const Community: React.FC = () => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    let q;
    if (user?.role === "admin") {
      // Admins see all posts
      q = query(
        collection(db, "community_posts"),
        orderBy("createdAt", "desc"),
      );
    } else if (user) {
      // Users see approved posts and their own posts
      // Note: A composite index might be required for complex queries in Firestore.
      // For simplicity here, we'll just fetch all approved, and filter client-side if needed,
      // or we just fetch approved. We will just fetch approved to simplify.
      q = query(
        collection(db, "community_posts"),
        where("status", "==", "approved"),
      );
    } else {
      q = query(
        collection(db, "community_posts"),
        where("status", "==", "approved"),
      );
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const postsData = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as Post,
        );
        postsData.sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          const dateA = a.createdAt?.seconds || 0;
          const dateB = b.createdAt?.seconds || 0;
          return dateB - dateA;
        });
        setPosts(postsData);
      },
      (error) => {
        console.error("Community onSnapshot error:", error);
      },
    );

    return () => unsubscribe();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setFeedback({
        type: "error",
        message: t(
          "community.mustBeLoggedIn",
          "Vous devez être connecté pour publier.",
        ),
      });
      return;
    }
    const content = newPostContent.trim();
    if (!content || content === "<p><br></p>") return;

    setIsSubmitting(true);
    setFeedback(null);

    const isRiskyContent = (text: string) => {
      if (/<a\s+href/i.test(text) || /http[s]?:\/\//i.test(text)) return true;
      if (/<img/i.test(text)) return true;
      if (/(\+?\d[\d\-\s]{7,}\d)/.test(text)) return true;
      const sexualKeywords = ['sexe', 'porn', 'nude', 'nu', 'sexuel', 'baise'];
      const lowerText = text.toLowerCase();
      if (sexualKeywords.some(keyword => lowerText.includes(keyword))) return true;
      return false;
    };

    const finalStatus = user.role === 'admin' ? 'approved' : (isRiskyContent(content) ? 'pending' : 'approved');

    try {
      await addDoc(collection(db, "community_posts"), {
        authorId: user.uid,
        authorName: user.name || "Utilisateur",
        content: content,
        status: finalStatus,
        createdAt: new Date(),
      });
      setNewPostContent("");
      setFeedback({
        type: "success",
        message: finalStatus === 'approved'
          ? t("community.publishedSuccess", "Publié avec succès !")
          : t(
              "community.pendingModeration",
              "Votre message est en attente de modération.",
            ),
      });
    } catch (error) {
      console.error("Error adding post", error);
      setFeedback({
        type: "error",
        message: t("community.publishError", "Erreur lors de la publication."),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [dmRecipient, setDmRecipient] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isDMOpen, setIsDMOpen] = useState(false);

  const handleShare = async (post: Post) => {
    // We strip HTML tags from the content for sharing text
    const plainText = post.content.replace(/<[^>]+>/g, '').substring(0, 100) + '...';
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Post de ${post.authorName}`,
          text: plainText,
          url: window.location.href,
        });
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error("Share error:", err);
        }
      }
    } else {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(plainText)} ${encodeURIComponent(window.location.href)}`, '_blank');
    }
  };

  const handlePin = async (postId: string, currentPinStatus: boolean) => {
    try {
      await updateDoc(doc(db, "community_posts", postId), {
        isPinned: !currentPinStatus,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-2xl">
            <Users size={28} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {t("community.title", "Communauté")}
            </h1>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">
              {t(
                "community.subtitle",
                "Échangez et partagez avec la communauté",
              )}
            </p>
          </div>
        </div>

        {user && (
          <button
            onClick={() => setIsDMOpen(true)}
            className="p-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl transition-colors relative"
            title="Messages Privés"
          >
            <Inbox size={24} />
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
        <h2 className="font-bold text-gray-900 dark:text-white mb-4">
          {t("community.createPost", "Créer une publication")}
        </h2>
        {user ? (
          <form onSubmit={handleSubmit}>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl mb-4 text-gray-900 dark:text-white">
              <ReactQuill
                theme="snow"
                value={newPostContent}
                onChange={setNewPostContent}
                placeholder={t(
                  "community.postPlaceholder",
                  "Partagez une question, une expérience, ou un conseil... (supporte texte riche, code, images, vidéos)",
                )}
                modules={quillModules}
              />
            </div>
            {feedback && (
              <div
                className={`p-3 rounded-xl mb-4 flex items-center gap-2 text-sm ${feedback.type === "success" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}
              >
                {feedback.type === "success" ? (
                  <CheckCircle size={16} />
                ) : (
                  <AlertCircle size={16} />
                )}
                {feedback.message}
              </div>
            )}
            <div className="flex justify-end mt-12">
              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  !newPostContent.trim() ||
                  newPostContent === "<p><br></p>"
                }
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors mt-4"
              >
                {isSubmitting ? (
                  t("community.publishing", "Publication...")
                ) : (
                  <>
                    <Send size={18} /> {t("community.publish", "Publier")}
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center p-6 bg-gray-50 dark:bg-gray-750 rounded-xl">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {t(
                "community.mustBeLoggedInDesc",
                "Vous devez être connecté pour participer à la communauté.",
              )}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <MessageSquare size={20} className="text-emerald-500" />
          {t("community.recentPosts", "Publications Récentes")}
        </h2>
        {posts.length === 0 ? (
          <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 text-gray-500">
            {t("community.noPosts", "Aucune publication pour le moment.")}
          </div>
        ) : (
          posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <div className="flex justify-between items-start mb-4">
                <div
                  className="flex items-center gap-3 cursor-pointer group"
                  onClick={() => {
                    if (user && user.uid !== post.authorId) {
                      setDmRecipient({
                        id: post.authorId,
                        name: post.authorName,
                      });
                      setIsDMOpen(true);
                    }
                  }}
                  title={
                    user?.uid !== post.authorId
                      ? "Envoyer un message privé"
                      : ""
                  }
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-100 to-emerald-50 dark:from-emerald-900 dark:to-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-300 font-bold group-hover:shadow-md transition-all">
                    {post.authorName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-emerald-600 transition-colors">
                      {post.authorName}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {post.createdAt?.seconds
                        ? new Date(
                            post.createdAt.seconds * 1000,
                          ).toLocaleDateString(
                            language === "ha"
                              ? "ha-NG"
                              : language === "en"
                                ? "en-US"
                                : "fr-FR",
                          )
                        : t("community.recent", "Récent")}
                    </p>
                  </div>
                </div>
                {user?.role === "admin" && (
                  <button
                    onClick={() => handlePin(post.id, post.isPinned || false)}
                    className={`p-1.5 rounded-lg transition-colors mr-2 ${post.isPinned ? "bg-amber-100 text-amber-600 dark:bg-amber-900/40" : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                  >
                    <Pin size={16} />
                  </button>
                )}
                {user?.role === "admin" && post.status !== "approved" && (
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-600">
                    {t("community.pending", "En attente")}
                  </span>
                )}
              </div>
              <div
                className="prose dark:prose-invert max-w-none prose-sm sm:prose-base prose-emerald mb-4 post-content-wrapper overflow-hidden"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
              <div className="flex items-center gap-4">
                <button
                  onClick={() =>
                    setExpandedPost(expandedPost === post.id ? null : post.id)
                  }
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600 transition-colors"
                >
                  <MessageSquare size={16} />
                  Commentaires
                </button>
                <button
                  onClick={() => handleShare(post)}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-500 transition-colors"
                  title="Partager / Twitter"
                >
                  <Share2 size={16} />
                  Partager
                </button>
              </div>
              {expandedPost === post.id && <PostComments postId={post.id} />}
            </motion.div>
          ))
        )}
      </div>
      {isDMOpen && (
        <DirectMessages
          onClose={() => {
            setIsDMOpen(false);
            setDmRecipient(null);
          }}
          initialRecipientId={dmRecipient?.id}
          initialRecipientName={dmRecipient?.name}
        />
      )}
    </div>
  );
};
