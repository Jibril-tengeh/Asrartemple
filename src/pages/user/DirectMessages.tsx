import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  or,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../contexts/AuthContext";
import { Send, X } from "lucide-react";

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  content: string;
  createdAt: any;
}

interface DirectMessagesProps {
  onClose: () => void;
  initialRecipientId?: string;
  initialRecipientName?: string;
}

export const DirectMessages: React.FC<DirectMessagesProps> = ({
  onClose,
  initialRecipientId,
  initialRecipientName,
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [activeChat, setActiveChat] = useState<{
    id: string;
    name: string;
  } | null>(
    initialRecipientId
      ? { id: initialRecipientId, name: initialRecipientName || "Utilisateur" }
      : null,
  );
  const [conversations, setConversations] = useState<
    { id: string; name: string }[]
  >([]);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "direct_messages"),
      or(
        where("senderId", "==", user.uid),
        where("receiverId", "==", user.uid),
      ),
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as Message,
      ).sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

      // Extract unique conversations
      const convosMap = new Map<string, string>();
      msgs.forEach((m) => {
        if (m.senderId === user.uid) {
          convosMap.set(m.receiverId, m.receiverId); // Don't have receiver name easily, but can use senderName if they replied
        } else {
          convosMap.set(m.senderId, m.senderName);
        }
      });
      if (initialRecipientId && !convosMap.has(initialRecipientId)) {
        convosMap.set(
          initialRecipientId,
          initialRecipientName || "Utilisateur",
        );
      }

      setConversations(
        Array.from(convosMap.entries()).map(([id, name]) => ({ id, name })),
      );
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, [user, initialRecipientId, initialRecipientName]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !activeChat || !newMessage.trim()) return;

    try {
      await addDoc(collection(db, "direct_messages"), {
        senderId: user.uid,
        receiverId: activeChat.id,
        senderName: user.name || "Utilisateur",
        content: newMessage.trim(),
        createdAt: serverTimestamp(),
      });
      setNewMessage("");
    } catch (err) {
      console.error(err);
    }
  };

  const activeMessages = messages
    .filter(
      (m) =>
        (m.senderId === user?.uid && m.receiverId === activeChat?.id) ||
        (m.senderId === activeChat?.id && m.receiverId === user?.uid),
    )
    .sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl h-[80vh] flex overflow-hidden shadow-2xl">
        {/* Sidebar */}
        <div className="w-1/3 border-r border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex flex-col">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <h3 className="font-bold text-gray-900 dark:text-white">
              Messages
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full md:hidden"
            >
              <X size={20} />
            </button>
          </div>
          <div className="overflow-y-auto flex-1">
            {conversations.length === 0 ? (
              <p className="text-sm text-gray-500 p-4 text-center">
                Aucune conversation
              </p>
            ) : (
              conversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveChat(c)}
                  className={`w-full text-left p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-700 ${activeChat?.id === c.id ? "bg-emerald-50 dark:bg-emerald-900/20" : ""}`}
                >
                  <div className="font-medium text-gray-900 dark:text-white">
                    {c.name}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800">
            <h3 className="font-bold text-gray-900 dark:text-white">
              {activeChat ? activeChat.name : "Sélectionnez une conversation"}
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full hidden md:block"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50">
            {!activeChat ? (
              <div className="h-full flex items-center justify-center text-gray-500">
                Vos messages apparaîtront ici
              </div>
            ) : activeMessages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-500">
                Envoyez un message pour commencer
              </div>
            ) : (
              activeMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderId === user?.uid ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-2xl ${msg.senderId === user?.uid ? "bg-emerald-500 text-white rounded-br-none" : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none border border-gray-100 dark:border-gray-700"}`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))
            )}
          </div>

          {activeChat && (
            <form
              onSubmit={handleSend}
              className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex gap-2"
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Écrivez votre message..."
                className="flex-1 bg-gray-100 dark:bg-gray-900 border-0 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors"
              >
                <Send size={20} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
