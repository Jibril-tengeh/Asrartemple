import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Send, Bot, Sparkles, MessageCircle, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const FaqPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const predefinedQuestions = [
    "Qu'est-ce qu'un wird et comment le pratiquer ?",
    "Comment me protéger contre le mauvais œil ?",
    "Quel est le moment idéal pour faire le zikr ?",
    "Quelle est la différence entre un secret et une recette ?"
  ];

  const handleAsk = async (text: string = question) => {
    if (!text.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setQuestion('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/assistant/faq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text, language })
      });
      if (!response.ok) {
        if (response.status === 503) {
           setMessages(prev => [...prev, { role: 'assistant', content: "Le service d'intelligence artificielle est actuellement très sollicité. Veuillez patienter quelques instants et réessayer." }]);
           return;
        }
      }

      const data = await response.json();
      
      if (data.answer) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: "Désolé, je n'ai pas pu générer de réponse." }]);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Erreur de connexion. Veuillez réessayer plus tard." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-screen flex flex-col">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="text-emerald-500" />
            FAQ Dynamique (IA)
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Posez vos questions sur les wirds, la spiritualité et nos outils.
          </p>
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 sm:p-6 flex flex-col overflow-hidden mb-6 relative">
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400">
              <Bot size={48} className="mb-4 text-emerald-100 dark:text-emerald-900" />
              <p className="mb-6 max-w-md">
                Je suis votre assistant IA spécialisé dans les sciences spirituelles islamiques et l'utilisation de l'application AsrarHub. Posez-moi vos questions.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {predefinedQuestions.map((q, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleAsk(q)}
                    className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-full text-sm hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={idx} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 ${
                  msg.role === 'user' 
                    ? 'bg-emerald-500 text-white rounded-br-none' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none'
                }`}>
                  {msg.role === 'user' ? (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-gray-900 prose-pre:text-gray-100">
                      <Markdown remarkPlugins={[remarkGfm]}>{msg.content}</Markdown>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-none p-4 text-gray-500 flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            placeholder="Posez votre question..."
            disabled={isLoading}
            className="w-full pl-5 pr-14 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
          />
          <button
            onClick={() => handleAsk()}
            disabled={!question.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-lg bg-emerald-500 text-white disabled:opacity-50 disabled:bg-gray-400 transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
