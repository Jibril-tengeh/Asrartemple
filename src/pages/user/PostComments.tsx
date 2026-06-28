import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../contexts/AuthContext";
import { Send, Reply } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: any;
  replyTo?: string; // ID of the comment being replied to
}

interface PostCommentsProps {
  postId: string;
}

export const PostComments: React.FC<PostCommentsProps> = ({ postId }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<Comment | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, "community_posts", postId, "comments"),
      orderBy("createdAt", "asc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as Comment,
      );
      setComments(commentsData);
    });

    return () => unsubscribe();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    try {
      await addDoc(collection(db, "community_posts", postId, "comments"), {
        authorId: user.uid,
        authorName: user.name || "Utilisateur",
        content: newComment.trim(),
        createdAt: serverTimestamp(),
        replyTo: replyTo?.id || null,
      });
      setNewComment("");
      setReplyTo(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
      <div className="space-y-4 mb-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className={`flex gap-3 ${comment.replyTo ? "ml-8" : ""}`}
          >
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 shrink-0 text-sm font-bold">
              {comment.authorName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-2xl rounded-tl-none border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm text-gray-900 dark:text-white">
                    {comment.authorName}
                  </span>
                  {comment.replyTo && (
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Reply size={12} /> en réponse
                    </span>
                  )}
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
              <button
                onClick={() => setReplyTo(comment)}
                className="text-xs text-gray-500 hover:text-emerald-500 font-medium mt-1 ml-2 transition-colors"
              >
                Répondre
              </button>
            </div>
          </div>
        ))}
      </div>

      {user && (
        <form onSubmit={handleSubmit} className="relative">
          {replyTo && (
            <div className="text-xs text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-2">
              <Reply size={14} /> Réponse à {replyTo.authorName}
              <button
                type="button"
                onClick={() => setReplyTo(null)}
                className="text-gray-400 hover:text-red-500"
              >
                ✕
              </button>
            </div>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Écrire un commentaire..."
              className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white p-2 rounded-xl transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
