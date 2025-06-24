import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Database,
  HelpCircle,
  LogOut,
  ChevronRight,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Eye,
  Brain,
  FileText,
  Download,
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

export default function SettingsScreen() {
  const { theme, isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState({
    analysisComplete: true,
    newPatient: true,
    systemUpdates: false,
    marketing: false,
  });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: logout },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'This will export all your patient data and analyses. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => alert('Export functionality would be implemented here') },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => alert('Account deletion would be implemented here') 
        },
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      padding: 24,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    title: {
      fontSize: 28,
      fontFamily: 'Inter-Bold',
      color: theme.colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
    content: {
      flex: 1,
    },
    section: {
      backgroundColor: theme.colors.surface,
      marginTop: 16,
      marginHorizontal: 16,
      borderRadius: 12,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    sectionHeader: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.text,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    settingItemLast: {
      borderBottomWidth: 0,
    },
    settingIcon: {
      marginRight: 12,
    },
    settingContent: {
      flex: 1,
    },
    settingTitle: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: theme.colors.text,
      marginBottom: 2,
    },
    settingDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    settingValue: {
      fontSize: 14,
      color: theme.colors.primary,
      fontFamily: 'Inter-Medium',
    },
    profileSection: {
      padding: 16,
      alignItems: 'center',
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    avatarText: {
      fontSize: 32,
      fontFamily: 'Inter-Bold',
      color: '#FFFFFF',
    },
    userName: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: theme.colors.text,
      marginBottom: 4,
    },
    userEmail: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 4,
    },
    userRole: {
      fontSize: 12,
      color: theme.colors.primary,
      fontFamily: 'Inter-Medium',
      backgroundColor: theme.colors.primary + '20',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    dangerSection: {
      backgroundColor: theme.colors.surface,
      marginTop: 16,
      marginHorizontal: 16,
      marginBottom: 32,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.error + '30',
    },
    dangerItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    dangerItemLast: {
      borderBottomWidth: 0,
    },
    dangerText: {
      color: theme.colors.error,
    },
    versionInfo: {
      padding: 16,
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      marginHorizontal: 16,
      marginBottom: 16,
      borderRadius: 12,
    },
    versionText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 4,
    },
    buildText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Manage your account and preferences</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.section}>
          <View style={styles.profileSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </Text>
            </View>
            <Text style={styles.userName}>
              Dr. {user?.firstName} {user?.lastName}
            </Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            <Text style={styles.userRole}>Ophthalmologist</Text>
          </View>
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Account</Text>
          </View>
          
          <TouchableOpacity style={styles.settingItem}>
            <User size={20} color={theme.colors.primary} style={styles.settingIcon} />
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Profile Information</Text>
              <Text style={styles.settingDescription}>Update your personal details</Text>
            </View>
            <ChevronRight size={16} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Shield size={20} color={theme.colors.primary} style={styles.settingIcon} />
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Security</Text>
              <Text style={styles.settingDescription}>Password and authentication</Text>
            </View>
            <ChevronRight size={16} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingItem, styles.settingItemLast]}>
            <FileText size={20} color={theme.colors.primary} style={styles.settingIcon} />
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Clinic Information</Text>
              <Text style={styles.settingDescription}>Update clinic details</Text>
            </View>
            <ChevronRight size={16} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Appearance */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Appearance</Text>
          </View>
          
          <View style={styles.settingItem}>
            <Palette size={20} color={theme.colors.primary} style={styles.settingIcon} />
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Theme</Text>
              <Text style={styles.settingDescription}>
                {isDark ? 'Dark mode' : 'Light mode'}
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={[styles.settingItem, styles.settingItemLast]}>
            {soundEnabled ? (
              <Volume2 size={20} color={theme.colors.primary} style={styles.settingIcon} />
            ) : (
              <VolumeX size={20} color={theme.colors.primary} style={styles.settingIcon} />
            )}
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Sound Effects</Text>
              <Text style={styles.settingDescription}>
                Play sounds for notifications and actions
              </Text>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Notifications</Text>
          </View>
          
          <View style={styles.settingItem}>
            <Brain size={20} color={theme.colors.primary} style={styles.settingIcon} />
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Analysis Complete</Text>
              <Text style={styles.settingDescription}>
                Notify when AI analysis is finished
              </Text>
            </View>
            <Switch
              value={notifications.analysisComplete}
              onValueChange={(value) => 
                setNotifications(prev => ({ ...prev, analysisComplete: value }))
              }
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingItem}>
            <User size={20} color={theme.colors.primary} style={styles.settingIcon} />
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>New Patient</Text>
              <Text style={styles.settingDescription}>
                Notify when a new patient is added
              </Text>
            </View>
            <Switch
              value={notifications.newPatient}
              onValueChange={(value) => 
                setNotifications(prev => ({ ...prev, newPatient: value }))
              }
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={[styles.settingItem, styles.settingItemLast]}>
            <Bell size={20} color={theme.colors.primary} style={styles.settingIcon} />
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>System Updates</Text>
              <Text style={styles.settingDescription}>
                Notify about app updates and new features
              </Text>
            </View>
            <Switch
              value={notifications.systemUpdates}
              onValueChange={(value) => 
                setNotifications(prev => ({ ...prev, systemUpdates: value }))
              }
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Data & Privacy */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Data & Privacy</Text>
          </View>
          
          <View style={styles.settingItem}>
            <Database size={20} color={theme.colors.primary} style={styles.settingIcon} />
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Auto-save</Text>
              <Text style={styles.settingDescription}>
                Automatically save analysis results
              </Text>
            </View>
            <Switch
              value={autoSave}
              onValueChange={setAutoSave}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <TouchableOpacity style={styles.settingItem} onPress={handleExportData}>
            <Download size={20} color={theme.colors.primary} style={styles.settingIcon} />
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Export Data</Text>
              <Text style={styles.settingDescription}>
                Download all your data
              </Text>
            </View>
            <ChevronRight size={16} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingItem, styles.settingItemLast]}>
            <Shield size={20} color={theme.colors.primary} style={styles.settingIcon} />
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Privacy Policy</Text>
              <Text style={styles.settingDescription}>
                View our privacy policy
              </Text>
            </View>
            <ChevronRight size={16} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Support</Text>
          </View>
          
          <TouchableOpacity style={styles.settingItem}>
            <HelpCircle size={20} color={theme.colors.primary} style={styles.settingIcon} />
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Help Center</Text>
              <Text style={styles.settingDescription}>
                Get help and support
              </Text>
            </View>
            <ChevronRight size={16} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingItem, styles.settingItemLast]}>
            <FileText size={20} color={theme.colors.primary} style={styles.settingIcon} />
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Terms of Service</Text>
              <Text style={styles.settingDescription}>
                View terms and conditions
              </Text>
            </View>
            <ChevronRight size={16} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={styles.dangerSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.error }]}>
              Danger Zone
            </Text>
          </View>
          
          <TouchableOpacity style={styles.dangerItem} onPress={handleLogout}>
            <LogOut size={20} color={theme.colors.error} style={styles.settingIcon} />
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, styles.dangerText]}>Sign Out</Text>
              <Text style={styles.settingDescription}>
                Sign out of your account
              </Text>
            </View>
            <ChevronRight size={16} color={theme.colors.error} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.dangerItem, styles.dangerItemLast]} 
            onPress={handleDeleteAccount}
          >
            <User size={20} color={theme.colors.error} style={styles.settingIcon} />
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, styles.dangerText]}>Delete Account</Text>
              <Text style={styles.settingDescription}>
                Permanently delete your account and data
              </Text>
            </View>
            <ChevronRight size={16} color={theme.colors.error} />
          </TouchableOpacity>
        </View>

        {/* Version Info */}
        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>EyeAI Diagnostics v1.0.0</Text>
          <Text style={styles.buildText}>Build 2024.06.24</Text>
        </View>
      </ScrollView>
    </View>
  );
}