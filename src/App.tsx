import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { UserDashboard } from './pages/user/UserDashboard';
import { SecretDetail } from './pages/user/SecretDetail';
import { ToolsDashboard } from './pages/user/ToolsDashboard';
import { AbjadCalculator } from './pages/user/tools/AbjadCalculator';
import { PlanetaryHours } from './pages/user/tools/PlanetaryHours';
import { Tasbih } from './pages/user/tools/Tasbih';
import { KhatimGenerator } from './pages/user/tools/KhatimGenerator';
import { Compatibility } from './pages/user/tools/Compatibility';
import { Asma } from './pages/user/tools/Asma';
import { Talsam } from './pages/user/tools/Talsam';
import { Istikhara } from './pages/user/tools/Istikhara';
import { Ruqyah } from './pages/user/tools/Ruqyah';
import { SirrAlAsrar } from './pages/user/tools/SirrAlAsrar';
import { Zairja } from './pages/user/tools/Zairja';
import { ZakatCalculator } from './pages/user/tools/ZakatCalculator';
import { FaraidCalculator } from './pages/user/tools/FaraidCalculator';
import { DreamJournal } from './pages/user/tools/DreamJournal';
import { NamesOfAllah } from './pages/user/tools/NamesOfAllah';
import { RouhaniyyaExtractor } from './pages/user/tools/RouhaniyyaExtractor';
import { Taksir } from './pages/user/tools/Taksir';
import { QuranFull } from './pages/user/tools/QuranFull';
import { UserProfile } from './pages/user/UserProfile';
import { Journal } from './pages/user/Journal';
import { ExploreDashboard } from './pages/user/ExploreDashboard';
import { Quizz } from './pages/user/explore/Quizz';
import { Lexique } from './pages/user/explore/Lexique';
import { CalendarConverter } from './pages/user/explore/CalendarConverter';
import { AdminSettings } from './pages/admin/AdminSettings';

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-full min-h-[50vh]">
    <h2 className="text-2xl font-semibold text-gray-500 dark:text-gray-400">{title}</h2>
  </div>
);

export default function App() {
  React.useEffect(() => {
    let lastCheckedMinute = -1;
    const interval = setInterval(() => {
      const reminders = JSON.parse(localStorage.getItem('asrar_reminders') || '[]');
      const now = new Date();
      const currentMinute = now.getMinutes();

      if (currentMinute !== lastCheckedMinute) {
        lastCheckedMinute = currentMinute;
        const currentTimeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        reminders.forEach((rem: any) => {
          if (rem.enabled && rem.time === currentTimeString) {
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('AsrarHub', { body: `Il est temps pour: ${rem.label}` });
            }
          }
        });
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors flex flex-col font-sans mb-16 sm:mb-0">
      <Header />
      <main className="flex-1 text-gray-900 dark:text-gray-100 pb-20">
        <Routes>
          <Route path="/" element={<Navigate to="/user/dashboard" replace />} />
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/secret/:id" element={<SecretDetail />} />
          <Route path="/explore" element={<ExploreDashboard />} />
          <Route path="/explore/quizz" element={<Quizz />} />
          <Route path="/explore/lexique" element={<Lexique />} />
          <Route path="/explore/calendar" element={<CalendarConverter />} />
          <Route path="/tools" element={<ToolsDashboard />} />
          <Route path="/tools/abjad" element={<AbjadCalculator />} />
          <Route path="/tools/planetary" element={<PlanetaryHours />} />
          <Route path="/tools/tasbih" element={<Tasbih />} />
          <Route path="/tools/khatim" element={<KhatimGenerator />} />
          <Route path="/tools/compatibility" element={<Compatibility />} />
          <Route path="/tools/asma" element={<Asma />} />
          <Route path="/tools/talsam" element={<Talsam />} />
          <Route path="/tools/istikhara" element={<Istikhara />} />
          <Route path="/tools/ruqyah" element={<Ruqyah />} />
          <Route path="/tools/sirr" element={<SirrAlAsrar />} />
          <Route path="/tools/zairja" element={<Zairja />} />
          <Route path="/tools/zakat" element={<ZakatCalculator />} />
          <Route path="/tools/faraid" element={<FaraidCalculator />} />
          <Route path="/tools/dreams" element={<DreamJournal />} />
          <Route path="/tools/99names" element={<NamesOfAllah />} />
          <Route path="/tools/rouhaniyya" element={<RouhaniyyaExtractor />} />
          <Route path="/tools/taksir" element={<Taksir />} />
          <Route path="/tools/quran" element={<QuranFull />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/saved" element={<UserDashboard initialFilter="favoris" />} />
          <Route path="/community" element={<PlaceholderPage title="Communauté" />} />
          <Route path="/admin" element={<AdminSettings />} />
          <Route path="*" element={<Navigate to="/user/dashboard" replace />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  );
}
