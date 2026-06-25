import React, { useState, useEffect } from 'react';
import { Calendar, ArrowLeft, RefreshCw, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useLanguage } from '../../../contexts/LanguageContext';

export const CalendarConverter: React.FC = () => {
  const { t, language } = useLanguage();
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [hijriDate, setHijriDate] = useState<string>('');
  const [islamicMonth, setIslamicMonth] = useState<string>('');
  const [islamicYear, setIslamicYear] = useState<string>('');

  useEffect(() => {
    convertDate();
  }, [date]);

  const convertDate = () => {
    if (!date) return;
    try {
      const gDate = new Date(date);
      
      const locale = language === 'ha' ? 'ha-NG' : (language === 'en' ? 'en-US' : 'fr-FR');
      // Using Intl.DateTimeFormat for Hijri conversion
      const hijriFormatter = new Intl.DateTimeFormat(`${locale}-u-ca-islamic-umalqura`, {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      
      const parts = new Intl.DateTimeFormat(`${locale}-u-ca-islamic-umalqura`, {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).formatToParts(gDate);

      let day = '', month = '', year = '';
      parts.forEach(part => {
        if (part.type === 'day') day = part.value;
        if (part.type === 'month') month = part.value;
        if (part.type === 'year') year = part.value;
      });

      setHijriDate(`${day} ${month} ${year} AH`);
      setIslamicMonth(month);
      setIslamicYear(year);
    } catch (error) {
      setHijriDate(t('calendar.conversionError'));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24 border-none">
      <div className="flex items-center gap-4 mb-6">
        <Link 
          to="/explore" 
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar className="text-emerald-500" />
            {t('calendar.title')}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('calendar.subtitle')}</p>
        </div>
      </div>

      <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/50 rounded-2xl p-4 mb-8">
        <p className="text-sm text-emerald-800 dark:text-emerald-200">{t('calendar.description')}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">{t('calendar.gregorianDate')}</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 text-lg mb-4"
        />
        <button
          onClick={convertDate}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold hover:shadow-md transition-all flex items-center justify-center gap-2"
        >
          <RefreshCw size={20} /> {t('calendar.convert')}
        </button>
      </div>

      {hijriDate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-900 rounded-3xl p-8 border-2 border-emerald-800 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600 rounded-full blur-3xl opacity-20"></div>
          
          <Moon className="text-emerald-400 mx-auto mb-4" size={48} />
          
          <h3 className="text-emerald-300 font-bold uppercase tracking-widest text-xs mb-2">{t('calendar.hijriMatch')}</h3>
          
          <div className="text-3xl sm:text-4xl text-white mb-2 leading-relaxed font-bold tracking-tight">
            {hijriDate}
          </div>
          
          <p className="text-emerald-400/80 text-sm mt-4">{t('calendar.monthOf')} {islamicMonth}</p>
        </motion.div>
      )}
    </div>
  );
};
