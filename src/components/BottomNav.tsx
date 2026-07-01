import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Wrench, Compass, Bookmark, Book } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useFeatures } from '../contexts/FeatureContext';

export const BottomNav: React.FC = () => {
  const { t } = useLanguage();
  const { featureToggles } = useFeatures();

  const navItems = [
    { to: '/user/dashboard', icon: Home, label: t('nav.home'), id: 'tour-nav-home' },
    { to: '/explore', icon: Compass, label: t('nav.explore'), id: 'tour-nav-explore', featureId: 'tool_explore' },
    { to: '/tools', icon: Wrench, label: t('nav.tools'), id: 'tour-nav-tools' },
    { to: '/journal', icon: Book, label: t('nav.journal'), id: 'tour-nav-journal', featureId: 'tool_journal' },
    { to: '/saved', icon: Bookmark, label: t('nav.saved'), id: 'tour-nav-saved' },
  ].filter(item => !item.featureId || featureToggles[item.featureId] !== 'inactive');

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-emerald-600 dark:bg-emerald-800 border-t border-emerald-700 dark:border-emerald-900 pb-safe shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] z-50">
      <nav className="flex justify-around items-center px-1 h-16 max-w-md mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            id={item.id}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive
                  ? 'text-white'
                  : 'text-emerald-100 hover:text-white dark:text-emerald-200 dark:hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[9px] font-medium ${isActive ? 'font-semibold' : ''}`}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
