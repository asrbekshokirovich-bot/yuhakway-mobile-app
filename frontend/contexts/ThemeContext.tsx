import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  actualTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  colors: typeof lightColors;
}

const lightColors = {
  primary: '#007AFF',
  primaryLight: '#4A9EFF',
  primaryDark: '#0056B3',
  background: '#F5F7FA',
  backgroundSecondary: '#FFFFFF',
  card: '#FFFFFF',
  cardHover: '#FAFBFC',
  text: '#1A1A1A',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  border: '#E9ECEF',
  borderLight: '#F0F2F5',
  success: '#34C759',
  error: '#FF3B30',
  warning: '#FF9500',
  info: '#007AFF',
  pending: '#FF9500',
  approved: '#34C759',
  rejected: '#FF3B30',
  shadow: 'rgba(0, 0, 0, 0.08)',
  shadowDark: 'rgba(0, 0, 0, 0.12)',
  gradient1: ['#007AFF', '#4A9EFF'],
  gradient2: ['#667EEA', '#764BA2'],
};

const darkColors = {
  primary: '#0A84FF',
  primaryLight: '#4A9EFF',
  primaryDark: '#0066CC',
  background: '#0D1117',
  backgroundSecondary: '#161B22',
  card: '#161B22',
  cardHover: '#1C2128',
  text: '#E6EDF3',
  textSecondary: '#8B949E',
  textTertiary: '#6E7681',
  border: '#30363D',
  borderLight: '#21262D',
  success: '#3FB950',
  error: '#F85149',
  warning: '#D29922',
  info: '#0A84FF',
  pending: '#D29922',
  approved: '#3FB950',
  rejected: '#F85149',
  shadow: 'rgba(0, 0, 0, 0.3)',
  shadowDark: 'rgba(0, 0, 0, 0.5)',
  gradient1: ['#0A84FF', '#4A9EFF'],
  gradient2: ['#667EEA', '#764BA2'],
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<Theme>('system');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    const savedTheme = await AsyncStorage.getItem('app_theme');
    if (savedTheme) {
      setThemeState(savedTheme as Theme);
    }
  };

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    await AsyncStorage.setItem('app_theme', newTheme);
  };

  const actualTheme = theme === 'system' ? (systemColorScheme || 'light') : theme;
  const colors = actualTheme === 'dark' ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ theme, actualTheme, setTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
