import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { User, Mail, Calendar, Eye, Target, TrendingUp, Settings, LogOut, CreditCard as Edit3, Save, X } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';
import { AuthModal } from '@/components/AuthModal';

export default function AccountScreen() {
  const { theme } = useTheme();
  const { user, isLoggedIn, logout, updateProfile } = useUser();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    age: user?.age?.toString() || '',
    eyeConditions: user?.eyeConditions.join(', ') || '',
  });

  const handleSaveProfile = async () => {
    try {
      const updates: any = {
        name: editForm.name,
        age: editForm.age ? parseInt(editForm.age) : undefined,
        eyeConditions: editForm.eyeConditions
          .split(',')
          .map(condition => condition.trim())
          .filter(condition => condition.length > 0),
      };

      await updateProfile(updates);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    loginPrompt: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    loginPromptIcon: {
      marginBottom: 16,
    },
    loginPromptTitle: {
      fontSize: 24,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    loginPromptText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: 24,
    },
    loginButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 32,
      paddingVertical: 16,
      borderRadius: 12,
      marginBottom: 12,
    },
    loginButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    registerButton: {
      borderWidth: 1,
      borderColor: theme.colors.primary,
      paddingHorizontal: 32,
      paddingVertical: 16,
      borderRadius: 12,
    },
    registerButtonText: {
      color: theme.colors.primary,
      fontSize: 16,
      fontWeight: '600',
    },
    profileHeader: {
      backgroundColor: theme.colors.surface,
      padding: 20,
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    avatarText: {
      fontSize: 32,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    userName: {
      fontSize: 24,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 4,
    },
    userEmail: {
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
    editButton: {
      position: 'absolute',
      top: 20,
      right: 20,
      padding: 8,
    },
    section: {
      backgroundColor: theme.colors.surface,
      margin: 16,
      borderRadius: 16,
      padding: 16,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 16,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    infoRowLast: {
      borderBottomWidth: 0,
    },
    infoIcon: {
      marginRight: 12,
    },
    infoLabel: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      flex: 1,
    },
    infoValue: {
      fontSize: 16,
      color: theme.colors.text,
      fontWeight: '500',
    },
    input: {
      backgroundColor: theme.colors.background,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
      flex: 1,
    },
    editActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 16,
      gap: 12,
    },
    editActionButton: {
      padding: 8,
      borderRadius: 8,
    },
    saveButton: {
      backgroundColor: theme.colors.primary,
    },
    cancelButton: {
      backgroundColor: theme.colors.textSecondary,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 16,
    },
    statCard: {
      flex: 1,
      minWidth: '45%',
      backgroundColor: theme.colors.background,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
    },
    statNumber: {
      fontSize: 24,
      fontWeight: '700',
      color: theme.colors.primary,
      marginTop: 8,
    },
    statLabel: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginTop: 4,
      textAlign: 'center',
    },
    logoutButton: {
      backgroundColor: theme.colors.error,
      margin: 16,
      padding: 16,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoutButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
    },
  });

  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <View style={styles.loginPrompt}>
          <View style={styles.loginPromptIcon}>
            <User size={64} color={theme.colors.primary} />
          </View>
          <Text style={styles.loginPromptTitle}>Welcome to EyeCare Pro</Text>
          <Text style={styles.loginPromptText}>
            Sign in to track your progress, sync your data, and get personalized recommendations.
          </Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => setShowAuthModal(true)}
          >
            <Text style={styles.loginButtonText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => setShowAuthModal(true)}
          >
            <Text style={styles.registerButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>

        <AuthModal
          visible={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialMode="login"
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setIsEditing(!isEditing)}
        >
          {isEditing ? (
            <X size={24} color={theme.colors.text} />
          ) : (
            <Edit3 size={24} color={theme.colors.text} />
          )}
        </TouchableOpacity>

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>

        {isEditing ? (
          <TextInput
            style={[styles.input, { textAlign: 'center', marginBottom: 8 }]}
            value={editForm.name}
            onChangeText={(text) => setEditForm({ ...editForm, name: text })}
            placeholder="Full Name"
            placeholderTextColor={theme.colors.textSecondary}
          />
        ) : (
          <Text style={styles.userName}>{user?.name}</Text>
        )}
        
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        
        <View style={styles.infoRow}>
          <Mail size={20} color={theme.colors.primary} style={styles.infoIcon} />
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{user?.email}</Text>
        </View>

        <View style={styles.infoRow}>
          <Calendar size={20} color={theme.colors.primary} style={styles.infoIcon} />
          <Text style={styles.infoLabel}>Age</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={editForm.age}
              onChangeText={(text) => setEditForm({ ...editForm, age: text })}
              placeholder="Age"
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="numeric"
            />
          ) : (
            <Text style={styles.infoValue}>{user?.age || 'Not set'}</Text>
          )}
        </View>

        <View style={[styles.infoRow, styles.infoRowLast]}>
          <Eye size={20} color={theme.colors.primary} style={styles.infoIcon} />
          <Text style={styles.infoLabel}>Eye Conditions</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={editForm.eyeConditions}
              onChangeText={(text) => setEditForm({ ...editForm, eyeConditions: text })}
              placeholder="e.g., Myopia, Astigmatism"
              placeholderTextColor={theme.colors.textSecondary}
              multiline
            />
          ) : (
            <Text style={styles.infoValue}>
              {user?.eyeConditions?.length ? user.eyeConditions.join(', ') : 'None'}
            </Text>
          )}
        </View>

        {isEditing && (
          <View style={styles.editActions}>
            <TouchableOpacity
              style={[styles.editActionButton, styles.cancelButton]}
              onPress={() => setIsEditing(false)}
            >
              <X size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.editActionButton, styles.saveButton]}
              onPress={handleSaveProfile}
            >
              <Save size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Target size={24} color={theme.colors.primary} />
            <Text style={styles.statNumber}>{user?.stats.totalExercises || 0}</Text>
            <Text style={styles.statLabel}>Total Exercises</Text>
          </View>
          <View style={styles.statCard}>
            <Eye size={24} color={theme.colors.success} />
            <Text style={styles.statNumber}>{user?.stats.totalBreaks || 0}</Text>
            <Text style={styles.statLabel}>Eye Breaks</Text>
          </View>
          <View style={styles.statCard}>
            <TrendingUp size={24} color={theme.colors.warning} />
            <Text style={styles.statNumber}>{user?.stats.streakDays || 0}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Calendar size={24} color={theme.colors.accent} />
            <Text style={styles.statNumber}>
              {user?.stats.lastActive ? 
                Math.floor((Date.now() - new Date(user.stats.lastActive).getTime()) / (1000 * 60 * 60 * 24)) : 0
              }
            </Text>
            <Text style={styles.statLabel}>Days Since Last Active</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={20} color="#FFFFFF" />
        <Text style={styles.logoutButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}