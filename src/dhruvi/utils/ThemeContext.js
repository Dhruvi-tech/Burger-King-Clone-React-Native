import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { darkTheme, lightTheme } from '../../archana/utils/theme';
import { storage } from './storage';

const THEME_KEY = '@bk_theme_mode';

const ThemeContext = createContext({
  isDark: false,
  theme: lightTheme,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    storage.getItem(THEME_KEY).then(saved => {
      if (saved === 'dark') {
        setIsDark(true);
      }
    });
  }, []);

  const toggleTheme = useCallback(async () => {
    setIsDark(current => {
      const next = !current;
      storage.setItem(THEME_KEY, next ? 'dark' : 'light');
      return next;
    });
  }, []);

  const value = useMemo(() => ({
    isDark,
    theme: isDark ? darkTheme : lightTheme,
    toggleTheme,
  }), [isDark, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  return useContext(ThemeContext);
}
