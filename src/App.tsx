import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
const UserDashboard = React.lazy(() => import('./pages/user/UserDashboard').then(m => ({ default: m.UserDashboard })));
const SecretDetail = React.lazy(() => import('./pages/user/SecretDetail').then(m => ({ default: m.SecretDetail })));
const ToolsDashboard = React.lazy(() => import('./pages/user/ToolsDashboard').then(m => ({ default: m.ToolsDashboard })));
const AbjadCalculator = React.lazy(() => import('./pages/user/tools/AbjadCalculator').then(m => ({ default: m.AbjadCalculator })));
const PlanetaryHours = React.lazy(() => import('./pages/user/tools/PlanetaryHours').then(m => ({ default: m.PlanetaryHours })));
const Tasbih = React.lazy(() => import('./pages/user/tools/Tasbih').then(m => ({ default: m.Tasbih })));
const KhatimGenerator = React.lazy(() => import('./pages/user/tools/KhatimGenerator').then(m => ({ default: m.KhatimGenerator })));
const Asma = React.lazy(() => import('./pages/user/tools/Asma').then(m => ({ default: m.Asma })));
const Talsam = React.lazy(() => import('./pages/user/tools/Talsam').then(m => ({ default: m.Talsam })));
const Istikhara = React.lazy(() => import('./pages/user/tools/Istikhara').then(m => ({ default: m.Istikhara })));
const Ruqyah = React.lazy(() => import('./pages/user/tools/Ruqyah').then(m => ({ default: m.Ruqyah })));
const SirrAlAsrar = React.lazy(() => import('./pages/user/tools/SirrAlAsrar').then(m => ({ default: m.SirrAlAsrar })));
const Zairja = React.lazy(() => import('./pages/user/tools/Zairja').then(m => ({ default: m.Zairja })));
const ZakatCalculator = React.lazy(() => import('./pages/user/tools/ZakatCalculator').then(m => ({ default: m.ZakatCalculator })));
const FaraidCalculator = React.lazy(() => import('./pages/user/tools/FaraidCalculator').then(m => ({ default: m.FaraidCalculator })));
const DreamJournal = React.lazy(() => import('./pages/user/tools/DreamJournal').then(m => ({ default: m.DreamJournal })));
const NamesOfAllah = React.lazy(() => import('./pages/user/tools/NamesOfAllah').then(m => ({ default: m.NamesOfAllah })));
const RouhaniyyaExtractor = React.lazy(() => import('./pages/user/tools/RouhaniyyaExtractor').then(m => ({ default: m.RouhaniyyaExtractor })));
const Taksir = React.lazy(() => import('./pages/user/tools/Taksir').then(m => ({ default: m.Taksir })));
const QuranFull = React.lazy(() => import('./pages/user/tools/QuranFull').then(m => ({ default: m.QuranFull })));
const ElementalAnalyzer = React.lazy(() => import('./pages/user/tools/ElementalAnalyzer').then(m => ({ default: m.ElementalAnalyzer })));
const Geomancy = React.lazy(() => import('./pages/user/tools/Geomancy').then(m => ({ default: m.Geomancy })));
const ScienceOfLetters = React.lazy(() => import('./pages/user/tools/ScienceOfLetters').then(m => ({ default: m.ScienceOfLetters })));
const PersonalWird = React.lazy(() => import('./pages/user/tools/PersonalWird').then(m => ({ default: m.PersonalWird })));
const LunarMansions = React.lazy(() => import('./pages/user/tools/LunarMansions').then(m => ({ default: m.LunarMansions })));
const SpiritualCompatibility = React.lazy(() => import('./pages/user/tools/SpiritualCompatibility').then(m => ({ default: m.SpiritualCompatibility })));
const IlmJafar = React.lazy(() => import('./pages/user/tools/IlmJafar').then(m => ({ default: m.IlmJafar })));
const GrandOaths = React.lazy(() => import('./pages/user/tools/GrandOaths').then(m => ({ default: m.GrandOaths })));
const KhouddamExtractor = React.lazy(() => import('./pages/user/tools/KhouddamExtractor').then(m => ({ default: m.KhouddamExtractor })));
const AwfaqAdvanced = React.lazy(() => import('./pages/user/tools/AwfaqAdvanced').then(m => ({ default: m.AwfaqAdvanced })));
const QuranicFaal = React.lazy(() => import('./pages/user/tools/QuranicFaal').then(m => ({ default: m.QuranicFaal })));
const UserProfile = React.lazy(() => import('./pages/user/UserProfile').then(m => ({ default: m.UserProfile })));
const Journal = React.lazy(() => import('./pages/user/Journal').then(m => ({ default: m.Journal })));
const ExploreDashboard = React.lazy(() => import('./pages/user/ExploreDashboard').then(m => ({ default: m.ExploreDashboard })));
const Quizz = React.lazy(() => import('./pages/user/explore/Quizz').then(m => ({ default: m.Quizz })));
const Lexique = React.lazy(() => import('./pages/user/explore/Lexique').then(m => ({ default: m.Lexique })));
const CalendarConverter = React.lazy(() => import('./pages/user/explore/CalendarConverter').then(m => ({ default: m.CalendarConverter })));
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const Community = React.lazy(() => import('./pages/user/Community').then(m => ({ default: m.Community })));
import { AudioPlayer } from './components/AudioPlayer';
const DailyDhikrTracker = React.lazy(() => import('./pages/user/tools/DailyDhikrTracker').then(m => ({ default: m.DailyDhikrTracker })));

import { Onboarding } from './pages/Onboarding';

const Store = React.lazy(() => import('./pages/user/Store').then(m => ({ default: m.Store })));

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-full min-h-[50vh]">
    <h2 className="text-2xl font-semibold text-gray-500 dark:text-gray-400">{title}</h2>
  </div>
);

export default function App() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = React.useState(
    localStorage.getItem('hasCompletedOnboarding') === 'true'
  );

  React.useEffect(() => {
    let lastCheckedMinute = -1;
    const interval = setInterval(() => {
      let reminders = [];
      try {
        const parsed = JSON.parse(localStorage.getItem('asrar_reminders') || '[]');
        if (Array.isArray(parsed)) {
          reminders = parsed;
        }
      } catch (e) {
        console.error("Error parsing reminders", e);
      }
      const now = new Date();
      const currentMinute = now.getMinutes();

      if (currentMinute !== lastCheckedMinute) {
        lastCheckedMinute = currentMinute;
        const currentTimeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        reminders.forEach((rem: any) => {
          if (rem.enabled && rem.time === currentTimeString) {
            try {
              if ('Notification' in window && window.Notification && window.Notification.permission === 'granted') {
                new Notification('AsrarHub', { body: `Il est temps pour: ${rem.label}` });
              }
            } catch (e) {
              console.error("Notification access error", e);
            }
          }
        });
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, []);

  if (!hasCompletedOnboarding) {
    return <Onboarding onComplete={() => {
      localStorage.setItem('hasCompletedOnboarding', 'true');
      setHasCompletedOnboarding(true);
    }} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors flex flex-col font-sans mb-16 sm:mb-0">
      <Header />
      <main className="flex-1 text-gray-900 dark:text-gray-100 pb-20 pt-20">
        <React.Suspense fallback={
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500 font-medium">Chargement...</p>
            </div>
          }>
          <Routes>
          <Route path="/" element={<Navigate to="/user/dashboard" replace />} />
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/secret/:id" element={<SecretDetail />} />
          <Route path="/explore" element={<ExploreDashboard />} />
          <Route path="/store" element={<Store />} />
          <Route path="/explore/quizz" element={<Quizz />} />
          <Route path="/explore/lexique" element={<Lexique />} />
          <Route path="/explore/calendar" element={<CalendarConverter />} />
          <Route path="/tools" element={<ToolsDashboard />} />
          <Route path="/tools/abjad" element={<AbjadCalculator />} />
          <Route path="/tools/planetary" element={<PlanetaryHours />} />
          <Route path="/tools/tasbih" element={<Tasbih />} />
          <Route path="/tools/khatim" element={<KhatimGenerator />} />
          <Route path="/tools/asma" element={<Asma />} />
          <Route path="/tools/talsam" element={<Talsam />} />
          <Route path="/tools/istikhara" element={<Istikhara />} />
          <Route path="/tools/ruqyah" element={<Ruqyah />} />
          <Route path="/tools/sirr" element={<SirrAlAsrar />} />
          <Route path="/tools/zairja" element={<Zairja />} />
          <Route path="/tools/zakat" element={<ZakatCalculator />} />
          <Route path="/tools/faraid" element={<FaraidCalculator />} />
          <Route path="/tools/dreams" element={<DreamJournal />} />
          <Route path="/tools/elemental" element={<ElementalAnalyzer />} />
          <Route path="/tools/geomancy" element={<Geomancy />} />
          <Route path="/tools/letters" element={<ScienceOfLetters />} />
          <Route path="/tools/personal-wird" element={<PersonalWird />} />
          <Route path="/tools/daily-dhikr" element={<DailyDhikrTracker />} />
          <Route path="/tools/lunar-mansions" element={<LunarMansions />} />
          <Route path="/tools/spiritual-compatibility" element={<SpiritualCompatibility />} />
          <Route path="/tools/ilm-jafar" element={<IlmJafar />} />
          <Route path="/tools/grand-oaths" element={<GrandOaths />} />
          <Route path="/tools/99names" element={<NamesOfAllah />} />
          <Route path="/tools/rouhaniyya" element={<RouhaniyyaExtractor />} />
          <Route path="/tools/taksir" element={<Taksir />} />
          <Route path="/tools/quran" element={<QuranFull />} />
          <Route path="/tools/khouddam" element={<KhouddamExtractor />} />
          <Route path="/tools/awfaq" element={<AwfaqAdvanced />} />
          <Route path="/tools/quranic-faal" element={<QuranicFaal />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/saved" element={<UserDashboard initialFilter="favoris" />} />
          <Route path="/community" element={<Community />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/user/dashboard" replace />} />
        </Routes>
          </React.Suspense>
      </main>
      <AudioPlayer />
      <BottomNav />
    </div>
  );
}
