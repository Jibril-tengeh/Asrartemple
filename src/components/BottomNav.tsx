import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Wrench, Compass, Bookmark } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const BottomNav: React.FC = () => {
  const { t } = useTranslation();

  const navItems = [
    { to: '/user/dashboard', icon: Home, label: 'Accueil' },
    { to: '/explore', icon: Compass, label: 'Explorer' },
    { to: '/tools', icon: Wrench, label: 'Outils' },
    { to: '/saved', icon: Bookmark, label: 'Sauvegardés' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pb-safe shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] z-50">
      <nav className="flex justify-around items-center px-2 h-16 max-w-md mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[10px] font-medium ${isActive ? 'font-semibold' : ''}`}>
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
