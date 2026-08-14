// src/contexts/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// انواع تم
type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  isDarkMode: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

// ایجاد Context با مقادیر پیش‌فرض
const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  isDarkMode: false,
  setTheme: () => {},
  toggleTheme: () => {},
});

// هوک برای استفاده از ThemeContext
export const useTheme = () => useContext(ThemeContext);

// Props برای Provider
interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultTheme = 'light' 
}) => {
  // State برای ذخیره تنظیمات تم
  const [theme, setThemeState] = useState<Theme>(() => {
    // بازیابی تم ذخیره شده در localStorage
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      return savedTheme;
    }
    return defaultTheme;
  });

  // State برای تشخیص وضعیت تاریک
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // تابع برای تنظیم تم
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // تابع برای تغییر بین light و dark
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  // اعمال تم به HTML document
  useEffect(() => {
    const applyTheme = () => {
      const root = document.documentElement;
      
      // حذف کلاس‌های قبلی
      root.classList.remove('light-theme', 'dark-theme');
      
      let finalTheme = theme;
      
      // اگر تم روی system باشد، از تنظیمات سیستم استفاده می‌کنیم
      if (theme === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        finalTheme = prefersDark ? 'dark' : 'light';
      }
      
      // اضافه کردن کلاس تم جدید
      root.classList.add(`${finalTheme}-theme`);
      setIsDarkMode(finalTheme === 'dark');
      
      // اضافه کردن attribute برای compatibility
      root.setAttribute('data-theme', finalTheme);
    };

    applyTheme();

    // گوش دادن به تغییرات تنظیمات سیستم (فقط برای تم system)
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme();
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  // مقدار context
  const contextValue: ThemeContextType = {
    theme,
    isDarkMode,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// کامپوننت برای نمایش وضعیت تم
export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme, toggleTheme } = useTheme();
  
  return (
    <div className="theme-switcher">
      <div className="flex items-center space-x-2 space-x-reverse">
        <button
          onClick={() => setTheme('light')}
          className={`p-2 rounded-lg ${theme === 'light' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
          aria-label="تم روشن"
        >
          ☀️
        </button>
        <button
          onClick={() => setTheme('dark')}
          className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : 'hover:bg-gray-100'}`}
          aria-label="تم تاریک"
        >
          🌙
        </button>
        <button
          onClick={() => setTheme('system')}
          className={`p-2 rounded-lg ${theme === 'system' ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-100'}`}
          aria-label="تم سیستم"
        >
          💻
        </button>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="تغییر تم"
        >
          🔄
        </button>
      </div>
    </div>
  );
};

// کامپوننت برای نمایش وضعیت فعلی
export const ThemeIndicator: React.FC = () => {
  const { theme, isDarkMode } = useTheme();
  
  const getThemeInfo = () => {
    switch (theme) {
      case 'light': return { emoji: '☀️', text: 'روشن' };
      case 'dark': return { emoji: '🌙', text: 'تاریک' };
      case 'system': return { emoji: '💻', text: 'سیستم' };
      default: return { emoji: '🎨', text: 'نامشخص' };
    }
  };
  
  const themeInfo = getThemeInfo();
  
  return (
    <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
      <span className="ml-2">{themeInfo.emoji}</span>
      <span>{themeInfo.text}</span>
      {isDarkMode && <span className="mr-2 text-xs">(تاریک)</span>}
    </div>
  );
};

export default ThemeContext;