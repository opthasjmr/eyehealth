import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  age?: number;
  eyeConditions: string[];
  preferences: {
    reminderInterval: number; // minutes
    exerciseDifficulty: 'easy' | 'medium' | 'hard';
    dailyGoals: {
      exercises: number;
      breaks: number;
      screenTimeLimit: number; // hours
    };
  };
  stats: {
    totalExercises: number;
    totalBreaks: number;
    streakDays: number;
    lastActive: string;
  };
}

interface UserContextType {
  user: UserProfile | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updateStats: (statUpdates: Partial<UserProfile['stats']>) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      const loginStatus = await AsyncStorage.getItem('isLoggedIn');
      
      if (userData && loginStatus === 'true') {
        setUser(JSON.parse(userData));
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const saveUserData = async (userData: UserProfile) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      await AsyncStorage.setItem('isLoggedIn', 'true');
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call - in real app, this would be an actual authentication
      if (email && password.length >= 6) {
        const existingUser = await AsyncStorage.getItem(`user_${email}`);
        
        if (existingUser) {
          const userData = JSON.parse(existingUser);
          setUser(userData);
          setIsLoggedIn(true);
          await saveUserData(userData);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call - in real app, this would create account on server
      if (name && email && password.length >= 6) {
        const newUser: UserProfile = {
          id: Date.now().toString(),
          name,
          email,
          eyeConditions: [],
          preferences: {
            reminderInterval: 20,
            exerciseDifficulty: 'medium',
            dailyGoals: {
              exercises: 5,
              breaks: 12,
              screenTimeLimit: 8,
            },
          },
          stats: {
            totalExercises: 0,
            totalBreaks: 0,
            streakDays: 0,
            lastActive: new Date().toISOString(),
          },
        };

        await AsyncStorage.setItem(`user_${email}`, JSON.stringify(newUser));
        setUser(newUser);
        setIsLoggedIn(true);
        await saveUserData(newUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('isLoggedIn');
      setUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;

    try {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      await saveUserData(updatedUser);
      await AsyncStorage.setItem(`user_${user.email}`, JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const updateStats = async (statUpdates: Partial<UserProfile['stats']>) => {
    if (!user) return;

    try {
      const updatedUser = {
        ...user,
        stats: { ...user.stats, ...statUpdates, lastActive: new Date().toISOString() },
      };
      setUser(updatedUser);
      await saveUserData(updatedUser);
      await AsyncStorage.setItem(`user_${user.email}`, JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error updating stats:', error);
    }
  };

  return (
    <UserContext.Provider value={{
      user,
      isLoggedIn,
      login,
      register,
      logout,
      updateProfile,
      updateStats,
    }}>
      {children}
    </UserContext.Provider>
  );
};