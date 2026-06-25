import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { HelpCircle, ArrowRight, CheckCircle, XCircle, RotateCcw, Sparkles } from 'lucide-react';



export const Quizz: React.FC = () => {
  const { t } = useLanguage();
  
  const questions = [
    {
      id: 1,
      question: t('quizz.questions.q1'),
      options: [t('quizz.questions.o1_1'), t('quizz.questions.o1_2'), t('quizz.questions.o1_3'), t('quizz.questions.o1_4')],
      correctAnswer: 1,
      explanation: t('quizz.questions.e1')
    },
    {
      id: 2,
      question: t('quizz.questions.q2'),
      options: [t('quizz.questions.o2_1'), t('quizz.questions.o2_2'), t('quizz.questions.o2_3'), t('quizz.questions.o2_4')],
      correctAnswer: 1,
      explanation: t('quizz.questions.e2')
    },
    {
      id: 3,
      question: t('quizz.questions.q3'),
      options: [t('quizz.questions.o3_1'), t('quizz.questions.o3_2'), t('quizz.questions.o3_3'), t('quizz.questions.o3_4')],
      correctAnswer: 1,
      explanation: t('quizz.questions.e3')
    },
    {
      id: 4,
      question: t('quizz.questions.q4'),
      options: [t('quizz.questions.o4_1'), t('quizz.questions.o4_2'), t('quizz.questions.o4_3'), t('quizz.questions.o4_4')],
      correctAnswer: 3,
      explanation: t('quizz.questions.e4')
    }
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl">
          <HelpCircle size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('quizz.title')}</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{t('quizz.subtitle')}</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!quizFinished ? (
          <motion.div 
            key="quiz"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm font-bold text-gray-400">{t('quizz.questionLabel')} {currentQuestion + 1} / {questions.length}</span>
              <span className="text-sm font-bold text-blue-500 dark:text-blue-400">{t('quizz.score')}: {score}</span>
            </div>

            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 mb-8">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-8 leading-relaxed">
              {questions[currentQuestion].question}
            </h2>

            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => {
                const isCorrect = index === questions[currentQuestion].correctAnswer;
                const isSelected = index === selectedOption;
                
                let btnStyle = "bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500";
                
                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle = "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500 text-emerald-700 dark:text-emerald-300";
                  } else if (isSelected) {
                    btnStyle = "bg-red-50 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-300";
                  } else {
                    btnStyle = "bg-gray-50 dark:bg-gray-800/10 border-gray-100 dark:border-gray-800 text-gray-400 dark:text-gray-500 opacity-50";
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleOptionClick(index)}
                    disabled={isAnswered}
                    className={`w-full p-4 rounded-xl border-2 text-left font-medium transition-all flex justify-between items-center ${btnStyle}`}
                  >
                    <span>{option}</span>
                    {isAnswered && isCorrect && <CheckCircle size={20} className="text-emerald-500" />}
                    {isAnswered && isSelected && !isCorrect && <XCircle size={20} className="text-red-500" />}
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30"
              >
                <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-1">{t('quizz.explanation')}</h4>
                <p className="text-blue-600 dark:text-blue-400 text-sm leading-relaxed">
                  {questions[currentQuestion].explanation}
                </p>
              </motion.div>
            )}

            {isAnswered && (
              <div className="mt-8 flex justify-end">
                <button 
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center shadow-sm"
                >
                  {currentQuestion < questions.length - 1 ? t('quizz.nextQuestion') : t('quizz.finish')}
                  <ArrowRight size={18} className="ml-2" />
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-100 dark:border-gray-700 text-center"
          >
            <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-500">
              <Sparkles size={48} />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">{t('quizz.finishedTitle')}</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              {t('quizz.finishedText1')} <span className="font-bold text-gray-900 dark:text-white">{score}</span> {t('quizz.finishedText2')} {questions.length}.
            </p>
            
            <button 
              onClick={restartQuiz}
              className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-3 px-8 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors inline-flex items-center"
            >
              <RotateCcw size={18} className="mr-2" />
              {t('quizz.restart')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
