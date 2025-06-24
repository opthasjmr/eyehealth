import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
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
  User
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';

function CustomDrawerContent() {
  const { theme } = useTheme();
  const { user, logout } = useAuth();

  const menuItems = [
    { name: 'index', title: 'Dashboard', icon: LayoutDashboard },
    { name: 'upload', title: 'Upload & Analyze', icon: Upload },
    { name: 'patients', title: 'Patient Management', icon: Users },
    { name: 'reports', title: 'Reports', icon: FileText },
    { name: 'settings', title: 'Settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.surface,
    },
    header: {
      padding: 24,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      backgroundColor: theme.colors.primary,
    },
    logo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    logoText: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: '#FFFFFF',
      marginLeft: 8,
    },
    userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    userDetails: {
      flex: 1,
    },
    userName: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
    },
    userRole: {
      fontSize: 14,
      color: 'rgba(255, 255, 255, 0.8)',
    },
    menu: {
      flex: 1,
      paddingTop: 16,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    menuItemActive: {
      backgroundColor: theme.colors.background,
      borderRightWidth: 3,
      borderRightColor: theme.colors.primary,
    },
    menuIcon: {
      marginRight: 16,
    },
    menuText: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: theme.colors.text,
    },
    menuTextActive: {
      color: theme.colors.primary,
    },
    footer: {
      padding: 24,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
    },
    logoutText: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: theme.colors.error,
      marginLeft: 16,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logo}>
          <Eye size={24} color="#FFFFFF" />
          <Text style={styles.logoText}>EyeAI Diagnostics</Text>
        </View>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <User size={20} color="#FFFFFF" />
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text style={styles.userRole}>Ophthalmologist</Text>
          </View>
        </View>
      </View>

      <View style={styles.menu}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.name}
            style={styles.menuItem}
            onPress={() => router.push(`/(dashboard)/${item.name}`)}
          >
            <item.icon 
              size={20} 
              color={theme.colors.text} 
              style={styles.menuIcon}
            />
            <Text style={styles.menuText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color={theme.colors.error} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function DashboardLayout() {
  const { theme } = useTheme();

  if (Platform.OS === 'web') {
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ width: 280 }}>
          <CustomDrawerContent />
        </View>
        <View style={{ flex: 1 }}>
          <Drawer screenOptions={{ headerShown: false, drawerType: 'permanent' }}>
            <Drawer.Screen name="index" />
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
          width: 280,
        },
      }}
    >
      <Drawer.Screen name="index" />
      <Drawer.Screen name="upload" />
      <Drawer.Screen name="patients" />
      <Drawer.Screen name="reports" />
      <Drawer.Screen name="settings" />
    </Drawer>
  );
}