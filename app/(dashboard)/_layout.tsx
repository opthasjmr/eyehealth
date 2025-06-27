import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import { 
  LayoutDashboard, 
  Upload, 
  Users, 
  FileText, 
  Settings, 
  LogOut,
  Eye,
  Bell,
  User,
  Brain,
  Microscope,
  Activity,
  TrendingUp,
  Database,
  Shield,
  Cpu,
  Zap,
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

function CustomDrawerContent() {
  const { theme, isDark } = useTheme();
  const { user, logout } = useAuth();

  const menuItems = [
    { name: 'index', title: 'Dashboard', icon: LayoutDashboard, color: theme.colors.primary },
    { name: 'ai-diagnostics', title: 'AI Diagnostics', icon: Brain, color: '#8B5CF6' },
    { name: 'upload', title: 'Upload & Analyze', icon: Upload, color: '#10B981' },
    { name: 'patients', title: 'Patient Management', icon: Users, color: '#F59E0B' },
    { name: 'reports', title: 'Reports & Analytics', icon: FileText, color: '#EF4444' },
    { name: 'settings', title: 'Settings', icon: Settings, color: '#6B7280' },
  ];

  const aiFeatures = [
    { name: 'AI Models', icon: Cpu, count: '4 Active' },
    { name: 'Processing', icon: Zap, count: '99.2% Uptime' },
    { name: 'Security', icon: Shield, count: 'HIPAA Compliant' },
  ];

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      padding: 24,
      paddingTop: Platform.OS === 'ios' ? 60 : 40,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerGradient: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 120,
    },
    headerContent: {
      zIndex: 1,
    },
    logo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    logoText: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: '#FFFFFF',
      marginLeft: 12,
    },
    logoSubtext: {
      fontSize: 12,
      color: 'rgba(255, 255, 255, 0.8)',
      marginLeft: 12,
    },
    userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    userDetails: {
      flex: 1,
    },
    userName: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: '#FFFFFF',
    },
    userRole: {
      fontSize: 14,
      color: 'rgba(255, 255, 255, 0.8)',
    },
    menu: {
      flex: 1,
      paddingTop: 20,
    },
    menuSection: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 12,
      fontFamily: 'Inter-Bold',
      color: theme.colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 12,
      marginLeft: 24,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingVertical: 16,
      marginHorizontal: 12,
      borderRadius: 12,
      marginBottom: 4,
    },
    menuItemActive: {
      backgroundColor: theme.colors.primary + '20',
      borderWidth: 1,
      borderColor: theme.colors.primary + '40',
    },
    menuIcon: {
      marginRight: 16,
    },
    menuText: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.text,
      flex: 1,
    },
    menuTextActive: {
      color: theme.colors.primary,
    },
    aiFeatureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingVertical: 12,
      marginHorizontal: 12,
      borderRadius: 8,
      backgroundColor: theme.colors.surface,
      marginBottom: 8,
    },
    aiFeatureIcon: {
      marginRight: 12,
    },
    aiFeatureInfo: {
      flex: 1,
    },
    aiFeatureName: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.text,
    },
    aiFeatureCount: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    footer: {
      padding: 24,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderRadius: 12,
      backgroundColor: theme.colors.error + '20',
      borderWidth: 1,
      borderColor: theme.colors.error + '40',
    },
    logoutText: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.error,
      marginLeft: 12,
    },
    versionInfo: {
      alignItems: 'center',
      marginTop: 16,
    },
    versionText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        />
        <View style={styles.headerContent}>
          <View style={styles.logo}>
            <Eye size={32} color="#FFFFFF" />
            <View>
              <Text style={styles.logoText}>EyeAI Pro</Text>
              <Text style={styles.logoSubtext}>Medical Diagnostics</Text>
            </View>
          </View>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <User size={24} color="#FFFFFF" />
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>
                Dr. {user?.firstName} {user?.lastName}
              </Text>
              <Text style={styles.userRole}>Ophthalmologist</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={styles.menu} showsVerticalScrollIndicator={false}>
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Main Navigation</Text>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.name}
              style={styles.menuItem}
              onPress={() => router.push(`/(dashboard)/${item.name}`)}
            >
              <item.icon 
                size={22} 
                color={item.color} 
                style={styles.menuIcon}
              />
              <Text style={styles.menuText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>AI System Status</Text>
          {aiFeatures.map((feature, index) => (
            <View key={index} style={styles.aiFeatureItem}>
              <feature.icon 
                size={18} 
                color={theme.colors.primary} 
                style={styles.aiFeatureIcon}
              />
              <View style={styles.aiFeatureInfo}>
                <Text style={styles.aiFeatureName}>{feature.name}</Text>
                <Text style={styles.aiFeatureCount}>{feature.count}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color={theme.colors.error} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
        
        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>EyeAI Pro v3.0.0</Text>
          <Text style={styles.versionText}>Build 2024.12.15</Text>
        </View>
      </View>
    </View>
  );
}

export default function DashboardLayout() {
  const { theme } = useTheme();

  if (Platform.OS === 'web') {
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ width: 320 }}>
          <CustomDrawerContent />
        </View>
        <View style={{ flex: 1 }}>
          <Drawer screenOptions={{ headerShown: false, drawerType: 'permanent' }}>
            <Drawer.Screen name="index" />
            <Drawer.Screen name="ai-diagnostics" />
            <Drawer.Screen name="upload" />
            <Drawer.Screen name="patients" />
            <Drawer.Screen name="reports" />
            <Drawer.Screen name="settings" />
          </Drawer>
        </View>
      </View>
    );
  }

  return (
    <Drawer
      drawerContent={CustomDrawerContent}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: 320,
        },
      }}
    >
      <Drawer.Screen name="index" />
      <Drawer.Screen name="ai-diagnostics" />
      <Drawer.Screen name="upload" />
      <Drawer.Screen name="patients" />
      <Drawer.Screen name="reports" />
      <Drawer.Screen name="settings" />
    </Drawer>
  );
}