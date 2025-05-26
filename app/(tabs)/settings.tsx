import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { Bell, Moon, Eye, Shield } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Settings {
  notifications: boolean;
  darkMode: boolean;
  blueLight: boolean;
}

export default function SettingsScreen() {
  const [settings, setSettings] = useState<Settings>({
    notifications: true,
    darkMode: false,
    blueLight: true,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('userSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading settings:', error);
      setIsLoading(false);
    }
  };

  const updateSetting = async (key: keyof Settings, value: boolean) => {
    try {
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);
      await AsyncStorage.setItem('userSettings', JSON.stringify(newSettings));

      // Handle side effects of settings changes
      switch (key) {
        case 'notifications':
          handleNotificationPermission(value);
          break;
        case 'darkMode':
          applyDarkMode(value);
          break;
        case 'blueLight':
          applyBlueLight(value);
          break;
      }
    } catch (error) {
      console.error('Error saving setting:', error);
    }
  };

  const handleNotificationPermission = async (enabled: boolean) => {
    if (enabled) {
      // Request notification permissions here
      // This is a placeholder for web - implement platform-specific logic
      if ('Notification' in window && Notification.permission === 'default') {
        await Notification.requestPermission();
      }
    }
  };

  const applyDarkMode = (enabled: boolean) => {
    // Apply dark mode styles
    document.documentElement.style.colorScheme = enabled ? 'dark' : 'light';
  };

  const applyBlueLight = (enabled: boolean) => {
    // Apply blue light filter
    if (enabled) {
      document.documentElement.style.filter = 'sepia(20%) brightness(90%)';
    } else {
      document.documentElement.style.filter = 'none';
    }
  };

  const handlePrivacyPress = () => {
    // Implement privacy settings navigation
    alert('Privacy settings coming soon!');
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading settings...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Bell size={24} color="#007AFF" />
            <Text style={styles.settingText}>Notifications</Text>
          </View>
          <Switch
            value={settings.notifications}
            onValueChange={(value) => updateSetting('notifications', value)}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={settings.notifications ? '#007AFF' : '#f4f3f4'}
          />
        </View>
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Moon size={24} color="#007AFF" />
            <Text style={styles.settingText}>Dark Mode</Text>
          </View>
          <Switch
            value={settings.darkMode}
            onValueChange={(value) => updateSetting('darkMode', value)}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={settings.darkMode ? '#007AFF' : '#f4f3f4'}
          />
        </View>
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Eye size={24} color="#007AFF" />
            <Text style={styles.settingText}>Blue Light Filter</Text>
          </View>
          <Switch
            value={settings.blueLight}
            onValueChange={(value) => updateSetting('blueLight', value)}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={settings.blueLight ? '#007AFF' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity style={styles.settingItem} onPress={handlePrivacyPress}>
          <View style={styles.settingLeft}>
            <Shield size={24} color="#007AFF" />
            <Text style={styles.settingText}>Privacy Settings</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.aboutContainer}>
          <Text style={styles.version}>Version 1.0.0</Text>
          <Text style={styles.copyright}>© 2024 Eye Care App</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  section: {
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#000000',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#000000',
  },
  aboutContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  version: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 8,
  },
  copyright: {
    fontSize: 14,
    color: '#999999',
  },
});