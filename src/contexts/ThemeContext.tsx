import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  actualTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('system');
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');

  const updateActualTheme = (currentTheme: Theme) => {
    let mode: 'light' | 'dark' = 'light';
    if (currentTheme === 'system') {
      mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      mode = currentTheme;
    }
    setActualTheme(mode);
    document.documentElement.classList.toggle('dark', mode === 'dark');
  };

  useEffect(() => {
    let savedTheme: Theme = 'system';
    try {
      savedTheme = (localStorage.getItem('theme') as Theme) || 'system';
    } catch (e) {}
    setThemeState(savedTheme);
    updateActualTheme(savedTheme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      let isSystem = false;
      try {
        isSystem = localStorage.getItem('theme') === 'system';
      } catch (e) {}
      if (isSystem) {
        updateActualTheme('system');
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const setTheme = (newTheme: Theme) => {
    try {
      localStorage.setItem('theme', newTheme);
    } catch (e) {}
    setThemeState(newTheme);
    updateActualTheme(newTheme);
  };

  const toggleTheme = () => {
    setTheme(actualTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, actualTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
