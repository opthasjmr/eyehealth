import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  accent: string;
}

export interface Theme {
  colors: ThemeColors;
  isDark: boolean;
}

const lightTheme: Theme = {
  colors: {
    primary: '#007AFF',
    secondary: '#5856D6',
    background: '#F2F2F7',
    surface: '#FFFFFF',
    text: '#000000',
    textSecondary: '#666666',
    border: '#E5E5EA',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    accent: '#AF52DE',
  },
  isDark: false,
};

const darkTheme: Theme = {
  colors: {
    primary: '#0A84FF',
    secondary: '#5E5CE6',
    background: '#000000',
    surface: '#1C1C1E',
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    border: '#38383A',
    success: '#30D158',
    warning: '#FF9F0A',
    error: '#FF453A',
    accent: '#BF5AF2',
  },
  isDark: true,
};

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  blueLight: boolean;
  toggleBlueLight: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [blueLight, setBlueLight] = useState(false);

  useEffect(() => {
    loadThemeSettings();
  }, []);

  const loadThemeSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('themeSettings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setIsDark(settings.isDark || false);
        setBlueLight(settings.blueLight || false);
        applyThemeToWeb(settings.isDark || false, settings.blueLight || false);
      }
    } catch (error) {
      console.error('Error loading theme settings:', error);
    }
  };

  const saveThemeSettings = async (darkMode: boolean, blueLightFilter: boolean) => {
    try {
      await AsyncStorage.setItem('themeSettings', JSON.stringify({
        isDark: darkMode,
        blueLight: blueLightFilter,
      }));
    } catch (error) {
      console.error('Error saving theme settings:', error);
    }
  };

  const applyThemeToWeb = (darkMode: boolean, blueLightFilter: boolean) => {
    if (Platform.OS === 'web') {
      const root = document.documentElement;
      
      // Apply dark mode
      root.style.colorScheme = darkMode ? 'dark' : 'light';
      
      // Apply blue light filter
      if (blueLightFilter) {
        root.style.filter = 'sepia(10%) saturate(90%) hue-rotate(15deg) brightness(95%)';
      } else {
        root.style.filter = 'none';
      }

      // Update meta theme color
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', darkMode ? '#000000' : '#FFFFFF');
      }
    }
  };

  const toggleTheme = async () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    await saveThemeSettings(newIsDark, blueLight);
    applyThemeToWeb(newIsDark, blueLight);
  };

  const toggleBlueLight = async () => {
    const newBlueLight = !blueLight;
    setBlueLight(newBlueLight);
    await saveThemeSettings(isDark, newBlueLight);
    applyThemeToWeb(isDark, newBlueLight);
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{
      theme,
      isDark,
      toggleTheme,
      blueLight,
      toggleBlueLight,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};