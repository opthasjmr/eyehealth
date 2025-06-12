import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export interface NotificationSettings {
  enabled: boolean;
  breakReminders: boolean;
  medicationReminders: boolean;
  exerciseReminders: boolean;
  dailyTips: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

interface NotificationContextType {
  settings: NotificationSettings;
  updateSetting: (key: keyof NotificationSettings, value: boolean) => Promise<void>;
  scheduleBreakReminder: () => Promise<void>;
  scheduleMedicationReminder: (time: string, medication: string) => Promise<void>;
  requestPermission: () => Promise<boolean>;
}

const defaultSettings: NotificationSettings = {
  enabled: true,
  breakReminders: true,
  medicationReminders: true,
  exerciseReminders: true,
  dailyTips: true,
  soundEnabled: true,
  vibrationEnabled: true,
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);

  useEffect(() => {
    loadNotificationSettings();
  }, []);

  const loadNotificationSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('notificationSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  };

  const saveNotificationSettings = async (newSettings: NotificationSettings) => {
    try {
      await AsyncStorage.setItem('notificationSettings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'web') {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      }
      return false;
    }
    
    // For native platforms, you would use expo-notifications here
    return true;
  };

  const updateSetting = async (key: keyof NotificationSettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    await saveNotificationSettings(newSettings);

    if (key === 'enabled' && value) {
      await requestPermission();
    }
  };

  const scheduleBreakReminder = async () => {
    if (!settings.enabled || !settings.breakReminders) return;

    if (Platform.OS === 'web' && 'Notification' in window && Notification.permission === 'granted') {
      setTimeout(() => {
        new Notification('Eye Break Reminder', {
          body: 'Time for a 20-second break! Look at something 20 feet away.',
          icon: '/icon.png',
          badge: '/icon.png',
        });
      }, 20 * 60 * 1000); // 20 minutes
    }
  };

  const scheduleMedicationReminder = async (time: string, medication: string) => {
    if (!settings.enabled || !settings.medicationReminders) return;

    if (Platform.OS === 'web' && 'Notification' in window && Notification.permission === 'granted') {
      const now = new Date();
      const [hours, minutes] = time.split(':').map(Number);
      const reminderTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
      
      if (reminderTime > now) {
        const timeout = reminderTime.getTime() - now.getTime();
        setTimeout(() => {
          new Notification('Medication Reminder', {
            body: `Time to take your ${medication}`,
            icon: '/icon.png',
            badge: '/icon.png',
          });
        }, timeout);
      }
    }
  };

  return (
    <NotificationContext.Provider value={{
      settings,
      updateSetting,
      scheduleBreakReminder,
      scheduleMedicationReminder,
      requestPermission,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};