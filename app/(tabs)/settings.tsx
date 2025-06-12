import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { Bell, Moon, Eye, Shield, Volume2, Vibrate, Clock, Target, Palette, Info, CircleHelp as HelpCircle, Mail, Star } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { useUser } from '@/contexts/UserContext';

export default function SettingsScreen() {
  const { theme, isDark, toggleTheme, blueLight, toggleBlueLight } = useTheme();
  const { settings: notificationSettings, updateSetting } = useNotifications();
  const { user, updateProfile } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const handleNotificationToggle = async (key: keyof typeof notificationSettings, value: boolean) => {
    try {
      await updateSetting(key, value);
      if (key === 'enabled' && value) {
        Alert.alert(
          'Notifications Enabled',
          'You will now receive reminders and tips to help maintain your eye health.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update notification settings');
    }
  };

  const handleReminderIntervalChange = async () => {
    Alert.alert(
      'Reminder Interval',
      'Choose how often you want to receive break reminders:',
      [
        { text: '15 minutes', onPress: () => updateReminderInterval(15) },
        { text: '20 minutes', onPress: () => updateReminderInterval(20) },
        { text: '30 minutes', onPress: () => updateReminderInterval(30) },
        { text: '45 minutes', onPress: () => updateReminderInterval(45) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const updateReminderInterval = async (minutes: number) => {
    if (user) {
      await updateProfile({
        preferences: {
          ...user.preferences,
          reminderInterval: minutes,
        },
      });
      Alert.alert('Success', `Reminder interval set to ${minutes} minutes`);
    }
  };

  const handleExerciseDifficulty = async () => {
    Alert.alert(
      'Exercise Difficulty',
      'Choose your preferred exercise difficulty level:',
      [
        { text: 'Easy', onPress: () => updateExerciseDifficulty('easy') },
        { text: 'Medium', onPress: () => updateExerciseDifficulty('medium') },
        { text: 'Hard', onPress: () => updateExerciseDifficulty('hard') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const updateExerciseDifficulty = async (difficulty: 'easy' | 'medium' | 'hard') => {
    if (user) {
      await updateProfile({
        preferences: {
          ...user.preferences,
          exerciseDifficulty: difficulty,
        },
      });
      Alert.alert('Success', `Exercise difficulty set to ${difficulty}`);
    }
  };

  const handleSupport = () => {
    Alert.alert(
      'Support',
      'Need help? Contact our support team:',
      [
        { text: 'Email Support', onPress: () => {} },
        { text: 'FAQ', onPress: () => {} },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleRateApp = () => {
    Alert.alert(
      'Rate EyeCare Pro',
      'Enjoying the app? Please rate us on the app store!',
      [
        { text: 'Rate Now', onPress: () => {} },
        { text: 'Later', style: 'cancel' },
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    section: {
      marginTop: 20,
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      marginHorizontal: 16,
      padding: 16,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      marginBottom: 16,
      color: theme.colors.text,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    settingItemLast: {
      borderBottomWidth: 0,
    },
    settingLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    settingIcon: {
      marginRight: 12,
    },
    settingText: {
      fontSize: 16,
      color: theme.colors.text,
      flex: 1,
    },
    settingDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    settingValue: {
      fontSize: 14,
      color: theme.colors.primary,
      fontWeight: '500',
    },
    aboutContainer: {
      alignItems: 'center',
      paddingVertical: 16,
    },
    version: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginBottom: 8,
    },
    copyright: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    dangerSection: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.error,
      borderWidth: 1,
    },
    dangerButton: {
      color: theme.colors.error,
    },
  });

  return (
    <ScrollView style={styles.container}>
      {/* Appearance Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Moon size={24} color={theme.colors.primary} style={styles.settingIcon} />
            <View style={{ flex: 1 }}>
              <Text style={styles.settingText}>Dark Mode</Text>
              <Text style={styles.settingDescription}>
                Reduce eye strain in low light conditions
              </Text>
            </View>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor={isDark ? '#FFFFFF' : '#FFFFFF'}
          />
        </View>

        <View style={[styles.settingItem, styles.settingItemLast]}>
          <View style={styles.settingLeft}>
            <Eye size={24} color={theme.colors.primary} style={styles.settingIcon} />
            <View style={{ flex: 1 }}>
              <Text style={styles.settingText}>Blue Light Filter</Text>
              <Text style={styles.settingDescription}>
                Reduce blue light emission from screen
              </Text>
            </View>
          </View>
          <Switch
            value={blueLight}
            onValueChange={toggleBlueLight}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor={blueLight ? '#FFFFFF' : '#FFFFFF'}
          />
        </View>
      </View>

      {/* Notifications Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Bell size={24} color={theme.colors.primary} style={styles.settingIcon} />
            <View style={{ flex: 1 }}>
              <Text style={styles.settingText}>Enable Notifications</Text>
              <Text style={styles.settingDescription}>
                Receive reminders and health tips
              </Text>
            </View>
          </View>
          <Switch
            value={notificationSettings.enabled}
            onValueChange={(value) => handleNotificationToggle('enabled', value)}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor={notificationSettings.enabled ? '#FFFFFF' : '#FFFFFF'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Clock size={24} color={theme.colors.primary} style={styles.settingIcon} />
            <View style={{ flex: 1 }}>
              <Text style={styles.settingText}>Break Reminders</Text>
              <Text style={styles.settingDescription}>
                20-20-20 rule reminders
              </Text>
            </View>
          </View>
          <Switch
            value={notificationSettings.breakReminders}
            onValueChange={(value) => handleNotificationToggle('breakReminders', value)}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor={notificationSettings.breakReminders ? '#FFFFFF' : '#FFFFFF'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Target size={24} color={theme.colors.primary} style={styles.settingIcon} />
            <View style={{ flex: 1 }}>
              <Text style={styles.settingText}>Exercise Reminders</Text>
              <Text style={styles.settingDescription}>
                Daily eye exercise notifications
              </Text>
            </View>
          </View>
          <Switch
            value={notificationSettings.exerciseReminders}
            onValueChange={(value) => handleNotificationToggle('exerciseReminders', value)}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor={notificationSettings.exerciseReminders ? '#FFFFFF' : '#FFFFFF'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Volume2 size={24} color={theme.colors.primary} style={styles.settingIcon} />
            <View style={{ flex: 1 }}>
              <Text style={styles.settingText}>Sound</Text>
              <Text style={styles.settingDescription}>
                Play sound with notifications
              </Text>
            </View>
          </View>
          <Switch
            value={notificationSettings.soundEnabled}
            onValueChange={(value) => handleNotificationToggle('soundEnabled', value)}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor={notificationSettings.soundEnabled ? '#FFFFFF' : '#FFFFFF'}
          />
        </View>

        <View style={[styles.settingItem, styles.settingItemLast]}>
          <View style={styles.settingLeft}>
            <Vibrate size={24} color={theme.colors.primary} style={styles.settingIcon} />
            <View style={{ flex: 1 }}>
              <Text style={styles.settingText}>Vibration</Text>
              <Text style={styles.settingDescription}>
                Vibrate with notifications
              </Text>
            </View>
          </View>
          <Switch
            value={notificationSettings.vibrationEnabled}
            onValueChange={(value) => handleNotificationToggle('vibrationEnabled', value)}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor={notificationSettings.vibrationEnabled ? '#FFFFFF' : '#FFFFFF'}
          />
        </View>
      </View>

      {/* Preferences Section */}
      {user && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleReminderIntervalChange}>
            <View style={styles.settingLeft}>
              <Clock size={24} color={theme.colors.primary} style={styles.settingIcon} />
              <View style={{ flex: 1 }}>
                <Text style={styles.settingText}>Reminder Interval</Text>
                <Text style={styles.settingDescription}>
                  How often to show break reminders
                </Text>
              </View>
            </View>
            <Text style={styles.settingValue}>{user.preferences.reminderInterval} min</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.settingItem, styles.settingItemLast]} 
            onPress={handleExerciseDifficulty}
          >
            <View style={styles.settingLeft}>
              <Target size={24} color={theme.colors.primary} style={styles.settingIcon} />
              <View style={{ flex: 1 }}>
                <Text style={styles.settingText}>Exercise Difficulty</Text>
                <Text style={styles.settingDescription}>
                  Preferred exercise intensity level
                </Text>
              </View>
            </View>
            <Text style={styles.settingValue}>
              {user.preferences.exerciseDifficulty.charAt(0).toUpperCase() + 
               user.preferences.exerciseDifficulty.slice(1)}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Support Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support & Feedback</Text>
        
        <TouchableOpacity style={styles.settingItem} onPress={handleSupport}>
          <View style={styles.settingLeft}>
            <HelpCircle size={24} color={theme.colors.primary} style={styles.settingIcon} />
            <Text style={styles.settingText}>Help & Support</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={handleRateApp}>
          <View style={styles.settingLeft}>
            <Star size={24} color={theme.colors.primary} style={styles.settingIcon} />
            <Text style={styles.settingText}>Rate the App</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.settingItem, styles.settingItemLast]}>
          <View style={styles.settingLeft}>
            <Mail size={24} color={theme.colors.primary} style={styles.settingIcon} />
            <Text style={styles.settingText}>Send Feedback</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Privacy Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy & Security</Text>
        
        <TouchableOpacity style={[styles.settingItem, styles.settingItemLast]}>
          <View style={styles.settingLeft}>
            <Shield size={24} color={theme.colors.primary} style={styles.settingIcon} />
            <View style={{ flex: 1 }}>
              <Text style={styles.settingText}>Privacy Policy</Text>
              <Text style={styles.settingDescription}>
                Learn how we protect your data
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.aboutContainer}>
          <Text style={styles.version}>EyeCare Pro v1.0.0</Text>
          <Text style={styles.copyright}>© 2024 EyeCare Pro. All rights reserved.</Text>
        </View>
      </View>
    </ScrollView>
  );
}