import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { UserDashboard } from './pages/user/UserDashboard';
import { SecretDetail } from './pages/user/SecretDetail';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors flex flex-col font-sans">
      <Header />
      <main className="flex-1 text-gray-900 dark:text-gray-100">
        <Routes>
          <Route path="/" element={<Navigate to="/user/dashboard" replace />} />
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/secret/:id" element={<SecretDetail />} />
        </Routes>
      </main>
    </div>
  );
}
