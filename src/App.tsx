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

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-full min-h-[50vh]">
    <h2 className="text-2xl font-semibold text-gray-500 dark:text-gray-400">{title}</h2>
  </div>
);

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors flex flex-col font-sans mb-16 sm:mb-0">
      <Header />
      <main className="flex-1 text-gray-900 dark:text-gray-100 pb-20">
        <Routes>
          <Route path="/" element={<Navigate to="/user/dashboard" replace />} />
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/secret/:id" element={<SecretDetail />} />
          <Route path="/explore" element={<PlaceholderPage title="Explorer" />} />
          <Route path="/tools" element={<ToolsDashboard />} />
          <Route path="/tools/abjad" element={<AbjadCalculator />} />
          <Route path="/tools/planetary" element={<PlanetaryHours />} />
          <Route path="/tools/tasbih" element={<Tasbih />} />
          <Route path="/tools/khatim" element={<KhatimGenerator />} />
          <Route path="/saved" element={<PlaceholderPage title="Sauvegardés" />} />
          <Route path="/community" element={<PlaceholderPage title="Communauté" />} />
          <Route path="*" element={<Navigate to="/user/dashboard" replace />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  );
}
