/* eslint-disable react-refresh/only-export-components -- Context providers must export both the provider component and the consumer hook */
import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: 'dark' | 'light';
}

const initialState: ThemeProviderState = {
  theme: 'dark',
  setTheme: () => null,
  actualTheme: 'dark',
};

const ThemeContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
  storageKey = 'soul-yatri-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  const [actualTheme, setActualTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';

      root.classList.add(systemTheme);
      // Use setTimeout to avoid setting state directly in effect
      setTimeout(() => {
        setActualTheme(systemTheme);
      }, 0);

      // Update data-theme for Tailwind variables if any are bound this way
      root.setAttribute('data-theme', systemTheme);
      return;
    }

    root.classList.add(theme);
    root.setAttribute('data-theme', theme);
    // Use setTimeout to avoid setting state directly in effect
    setTimeout(() => {
      setActualTheme(theme);
    }, 0);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem(storageKey, newTheme);
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider {...props} value={{ theme, setTheme, actualTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
