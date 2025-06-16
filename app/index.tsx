import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  interpolateColor,
} from 'react-native-reanimated';
import {
  Menu,
  X,
  Eye,
  Activity,
  Book,
  Settings,
  Pill,
  Target,
  User,
  Brain,
  Gamepad2,
  Clock,
  Sun,
  Moon,
  AlertCircle,
  Bell,
  TrendingUp,
  Zap,
  Search,
  BookOpen,
  Home,
  ChevronRight,
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';
import { useNotifications } from '@/contexts/NotificationContext';

const { width, height } = Dimensions.get('window');

interface SidebarItem {
  id: string;
  title: string;
  icon: any;
  screen: string;
  badge?: number;
}

const sidebarItems: SidebarItem[] = [
  { id: 'dashboard', title: 'Dashboard', icon: Home, screen: 'dashboard' },
  { id: 'exercises', title: 'Eye Exercises', icon: Activity, screen: 'exercises' },
  { id: 'games', title: 'Vision Games', icon: Gamepad2, screen: 'games' },
  { id: 'ai-screening', title: 'AI Screening', icon: Brain, screen: 'ai-screening' },
  { id: 'vision-test', title: 'Vision Test', icon: Target, screen: 'vision-test' },
  { id: 'learn', title: 'Learn & Research', icon: Book, screen: 'learn' },
  { id: 'medications', title: 'Medications', icon: Pill, screen: 'medications' },
  { id: 'account', title: 'My Account', icon: User, screen: 'account' },
  { id: 'settings', title: 'Settings', icon: Settings, screen: 'settings' },
];

export default function MainScreen() {
  const { theme } = useTheme();
  const { user, updateStats } = useUser();
  const { scheduleBreakReminder } = useNotifications();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeScreen, setActiveScreen] = useState('dashboard');
  const [screenTime, setScreenTime] = useState(0);
  const [nextBreak, setNextBreak] = useState(1200); // 20 minutes in seconds
  const [dailyProgress, setDailyProgress] = useState({
    exercises: 0,
    breaks: 0,
  });

  // Animations
  const sidebarAnimation = useSharedValue(0);
  const pulseAnimation = useSharedValue(1);
  const glowAnimation = useSharedValue(0);
  const progressAnimation = useSharedValue(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setScreenTime(prev => prev + 1);
      setNextBreak(prev => {
        if (prev <= 1) {
          scheduleBreakReminder();
          updateStats({ totalBreaks: (user?.stats.totalBreaks || 0) + 1 });
          setDailyProgress(prev => ({ ...prev, breaks: prev.breaks + 1 }));
          return 1200; // Reset to 20 minutes
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [user]);

  useEffect(() => {
    sidebarAnimation.value = withTiming(sidebarOpen ? 1 : 0, { duration: 300 });
  }, [sidebarOpen]);

  useEffect(() => {
    // Pulse animation for break reminder
    if (nextBreak <= 60) {
      pulseAnimation.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 500 }),
          withTiming(1, { duration: 500 })
        ),
        -1,
        true
      );
    } else {
      pulseAnimation.value = withTiming(1);
    }

    // Glow animation for AI features
    glowAnimation.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000 }),
        withTiming(0, { duration: 2000 })
      ),
      -1,
      true
    );

    // Progress animation
    if (user) {
      const exerciseProgress = (dailyProgress.exercises / user.preferences.dailyGoals.exercises) * 100;
      progressAnimation.value = withTiming(exerciseProgress, { duration: 1000 });
    }
  }, [nextBreak, dailyProgress, user]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const sidebarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: sidebarAnimation.value * 0 - (1 - sidebarAnimation.value) * 280 }],
  }));

  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: sidebarAnimation.value * 0.5,
  }));

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnimation.value }],
  }));

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    shadowOpacity: 0.3 + (glowAnimation.value * 0.4),
    shadowRadius: 8 + (glowAnimation.value * 8),
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressAnimation.value}%`,
  }));

  const renderDashboard = () => (
    <ScrollView style={styles.content}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Vision Health Dashboard</Text>
        {user && (
          <Text style={styles.welcomeText}>Welcome back, {user.name}!</Text>
        )}
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Clock size={24} color={theme.colors.primary} />
            <Text style={styles.statLabel}>Screen Time</Text>
            <Text style={styles.statValue}>{formatTime(screenTime)}</Text>
          </View>
          <Animated.View style={[styles.stat, pulseAnimatedStyle]}>
            <Activity size={24} color={nextBreak <= 60 ? theme.colors.error : theme.colors.warning} />
            <Text style={styles.statLabel}>Next Break</Text>
            <Text style={[styles.statValue, { color: nextBreak <= 60 ? theme.colors.error : theme.colors.text }]}>
              {formatTime(nextBreak)}
            </Text>
          </Animated.View>
          <View style={styles.stat}>
            <TrendingUp size={24} color={theme.colors.success} />
            <Text style={styles.statLabel}>Streak</Text>
            <Text style={styles.statValue}>{user?.stats.streakDays || 0} days</Text>
          </View>
        </View>
      </View>

      {/* AI-Powered Features Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AI-Powered Features</Text>
        
        <Animated.View style={[styles.aiSection, glowAnimatedStyle]}>
          <View style={styles.aiHeader}>
            <Brain size={32} color={theme.colors.primary} />
            <Text style={styles.aiTitle}>AI Vision Screening</Text>
          </View>
          <Text style={styles.aiDescription}>
            Get personalized eye health insights with our advanced AI analysis. Early detection and custom recommendations powered by machine learning.
          </Text>
          <TouchableOpacity 
            style={styles.aiButton} 
            onPress={() => setActiveScreen('ai-screening')}
          >
            <Brain size={20} color="#FFFFFF" />
            <Text style={styles.aiButtonText}>Start AI Analysis</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.featuresGrid}>
          <TouchableOpacity 
            style={styles.featureCard}
            onPress={() => setActiveScreen('games')}
          >
            <Gamepad2 size={24} color={theme.colors.primary} />
            <Text style={styles.featureTitle}>Vision Games</Text>
            <Text style={styles.featureDescription}>
              Interactive games designed to improve focus, tracking, and eye coordination
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.featureCard}
            onPress={() => setActiveScreen('vision-test')}
          >
            <Target size={24} color={theme.colors.primary} />
            <Text style={styles.featureTitle}>Smart Vision Test</Text>
            <Text style={styles.featureDescription}>
              Advanced vision testing with AI-powered result analysis and tracking
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.featureCard}
            onPress={() => setActiveScreen('learn')}
          >
            <Search size={24} color={theme.colors.primary} />
            <Text style={styles.featureTitle}>Learn & Research</Text>
            <Text style={styles.featureDescription}>
              Access latest eye health research and educational content
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.featureCard}
            onPress={() => setActiveScreen('exercises')}
          >
            <Zap size={24} color={theme.colors.primary} />
            <Text style={styles.featureTitle}>Adaptive Exercises</Text>
            <Text style={styles.featureDescription}>
              Personalized eye exercises that adapt to your progress and needs
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {user && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Progress</Text>
          
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Exercise Goal</Text>
              <Text style={styles.progressPercentage}>
                {Math.round(getProgressPercentage(dailyProgress.exercises, user.preferences.dailyGoals.exercises))}%
              </Text>
            </View>
            <View style={styles.progressBar}>
              <Animated.View style={[styles.progressFill, progressAnimatedStyle]} />
            </View>
            <View style={styles.progressStats}>
              <Text style={styles.progressStatText}>
                {dailyProgress.exercises} / {user.preferences.dailyGoals.exercises} exercises
              </Text>
            </View>
          </View>

          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Break Goal</Text>
              <Text style={styles.progressPercentage}>
                {Math.round(getProgressPercentage(dailyProgress.breaks, user.preferences.dailyGoals.breaks))}%
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${getProgressPercentage(dailyProgress.breaks, user.preferences.dailyGoals.breaks)}%` }
                ]} 
              />
            </View>
            <View style={styles.progressStats}>
              <Text style={styles.progressStatText}>
                {dailyProgress.breaks} / {user.preferences.dailyGoals.breaks} breaks
              </Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Eye Care</Text>
        <View style={styles.grid}>
          <TouchableOpacity style={styles.card}>
            <Clock size={32} color={theme.colors.primary} />
            <Text style={styles.cardTitle}>20-20-20 Rule</Text>
            <Text style={styles.cardDescription}>Take a 20-second break every 20 minutes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card}>
            <Sun size={32} color={theme.colors.warning} />
            <Text style={styles.cardTitle}>Blue Light</Text>
            <Text style={styles.cardDescription}>Adjust screen settings for comfort</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Access</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.exerciseScroll}>
          <TouchableOpacity 
            style={styles.exerciseCard}
            onPress={() => setActiveScreen('exercises')}
          >
            <Eye size={24} color={theme.colors.primary} />
            <Text style={styles.exerciseTitle}>Focus Shift</Text>
            <Text style={styles.exerciseTime}>2 min</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.exerciseCard}
            onPress={() => setActiveScreen('exercises')}
          >
            <Activity size={24} color={theme.colors.primary} />
            <Text style={styles.exerciseTitle}>Eye Rolling</Text>
            <Text style={styles.exerciseTime}>1 min</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.exerciseCard}
            onPress={() => setActiveScreen('games')}
          >
            <Gamepad2 size={24} color={theme.colors.primary} />
            <Text style={styles.exerciseTitle}>Blink Game</Text>
            <Text style={styles.exerciseTime}>3 min</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.exerciseCard}
            onPress={() => setActiveScreen('learn')}
          >
            <BookOpen size={24} color={theme.colors.primary} />
            <Text style={styles.exerciseTitle}>Latest Research</Text>
            <Text style={styles.exerciseTime}>Browse</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Eye Health Tips</Text>
        <View style={styles.tipContainer}>
          <AlertCircle size={24} color={theme.colors.primary} />
          <Text style={styles.tipText}>Maintain proper screen distance (20-24 inches)</Text>
        </View>
        <View style={styles.tipContainer}>
          <Moon size={24} color={theme.colors.primary} />
          <Text style={styles.tipText}>Reduce screen brightness in dark environments</Text>
        </View>
        <View style={styles.tipContainer}>
          <Bell size={24} color={theme.colors.primary} />
          <Text style={styles.tipText}>Enable break reminders for better eye health</Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderContent = () => {
    switch (activeScreen) {
      case 'dashboard':
        return renderDashboard();
      case 'exercises':
        return (
          <View style={styles.content}>
            <Text style={styles.pageTitle}>Eye Exercises</Text>
            <Text style={styles.pageDescription}>Coming soon - Comprehensive eye exercise routines</Text>
          </View>
        );
      case 'games':
        return (
          <View style={styles.content}>
            <Text style={styles.pageTitle}>Vision Games</Text>
            <Text style={styles.pageDescription}>Coming soon - Interactive vision training games</Text>
          </View>
        );
      case 'ai-screening':
        return (
          <View style={styles.content}>
            <Text style={styles.pageTitle}>AI Vision Screening</Text>
            <Text style={styles.pageDescription}>Coming soon - AI-powered vision analysis</Text>
          </View>
        );
      case 'vision-test':
        return (
          <View style={styles.content}>
            <Text style={styles.pageTitle}>Vision Test</Text>
            <Text style={styles.pageDescription}>Coming soon - Comprehensive vision testing</Text>
          </View>
        );
      case 'learn':
        return (
          <View style={styles.content}>
            <Text style={styles.pageTitle}>Learn & Research</Text>
            <Text style={styles.pageDescription}>Coming soon - Educational content and research articles</Text>
          </View>
        );
      case 'medications':
        return (
          <View style={styles.content}>
            <Text style={styles.pageTitle}>Medications</Text>
            <Text style={styles.pageDescription}>Coming soon - Medication reminders and tracking</Text>
          </View>
        );
      case 'account':
        return (
          <View style={styles.content}>
            <Text style={styles.pageTitle}>My Account</Text>
            <Text style={styles.pageDescription}>Coming soon - User profile and settings</Text>
          </View>
        );
      case 'settings':
        return (
          <View style={styles.content}>
            <Text style={styles.pageTitle}>Settings</Text>
            <Text style={styles.pageDescription}>Coming soon - App preferences and configuration</Text>
          </View>
        );
      default:
        return renderDashboard();
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      flexDirection: 'row',
    },
    sidebar: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: 280,
      backgroundColor: theme.colors.surface,
      borderRightWidth: 1,
      borderRightColor: theme.colors.border,
      zIndex: 1000,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 2, height: 0 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    sidebarHeader: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    sidebarTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.colors.text,
    },
    closeButton: {
      padding: 4,
    },
    sidebarContent: {
      flex: 1,
      paddingTop: 20,
    },
    sidebarItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    sidebarItemActive: {
      backgroundColor: theme.colors.primary + '20',
      borderRightWidth: 3,
      borderRightColor: theme.colors.primary,
    },
    sidebarItemIcon: {
      marginRight: 16,
    },
    sidebarItemText: {
      fontSize: 16,
      color: theme.colors.text,
      flex: 1,
    },
    sidebarItemTextActive: {
      color: theme.colors.primary,
      fontWeight: '600',
    },
    sidebarItemChevron: {
      marginLeft: 8,
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 999,
    },
    mainContent: {
      flex: 1,
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    menuButton: {
      padding: 8,
    },
    topBarTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
    },
    topBarActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    content: {
      flex: 1,
    },
    pageTitle: {
      fontSize: 28,
      fontWeight: '700',
      color: theme.colors.text,
      padding: 20,
    },
    pageDescription: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    header: {
      padding: 20,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 16,
    },
    welcomeText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginBottom: 16,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 10,
    },
    stat: {
      alignItems: 'center',
    },
    statLabel: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginTop: 4,
    },
    statValue: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginTop: 2,
    },
    section: {
      padding: 16,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: '600',
      marginBottom: 16,
      color: theme.colors.text,
    },
    progressCard: {
      backgroundColor: theme.colors.surface,
      padding: 20,
      borderRadius: 16,
      marginBottom: 16,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    progressHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    progressTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
    },
    progressPercentage: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.primary,
    },
    progressBar: {
      height: 8,
      backgroundColor: theme.colors.background,
      borderRadius: 4,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: theme.colors.primary,
    },
    progressStats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 12,
    },
    progressStatText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    grid: {
      flexDirection: 'row',
      gap: 16,
    },
    card: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      padding: 16,
      borderRadius: 16,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    cardTitle: {
      fontSize: 17,
      fontWeight: '600',
      marginTop: 12,
      marginBottom: 4,
      color: theme.colors.text,
    },
    cardDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    aiSection: {
      backgroundColor: theme.colors.surface,
      borderRadius: 20,
      padding: 20,
      marginBottom: 16,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 6,
    },
    aiHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    aiTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.colors.text,
      marginLeft: 12,
    },
    aiDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 16,
      lineHeight: 20,
    },
    aiButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    aiButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
    },
    featuresGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    featureCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 16,
      width: (width - 56) / 2,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    featureTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginTop: 8,
      marginBottom: 4,
    },
    featureDescription: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      lineHeight: 16,
    },
    exerciseScroll: {
      marginHorizontal: -16,
      paddingHorizontal: 16,
    },
    exerciseCard: {
      backgroundColor: theme.colors.surface,
      padding: 16,
      borderRadius: 16,
      marginRight: 12,
      width: width * 0.4,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    exerciseTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginTop: 8,
    },
    exerciseTime: {
      fontSize: 14,
      color: theme.colors.primary,
      marginTop: 4,
    },
    tipContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      padding: 16,
      borderRadius: 16,
      marginBottom: 12,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    tipText: {
      fontSize: 15,
      color: theme.colors.text,
      marginLeft: 12,
      flex: 1,
    },
  });

  return (
    <View style={styles.container}>
      {/* Sidebar */}
      <Animated.View style={[styles.sidebar, sidebarAnimatedStyle]}>
        <View style={styles.sidebarHeader}>
          <Text style={styles.sidebarTitle}>Vision Care Plus</Text>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setSidebarOpen(false)}
          >
            <X size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.sidebarContent}>
          {sidebarItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.sidebarItem,
                activeScreen === item.screen && styles.sidebarItemActive,
              ]}
              onPress={() => {
                setActiveScreen(item.screen);
                setSidebarOpen(false);
              }}
            >
              <item.icon 
                size={20} 
                color={activeScreen === item.screen ? theme.colors.primary : theme.colors.text}
                style={styles.sidebarItemIcon}
              />
              <Text style={[
                styles.sidebarItemText,
                activeScreen === item.screen && styles.sidebarItemTextActive,
              ]}>
                {item.title}
              </Text>
              <ChevronRight 
                size={16} 
                color={theme.colors.textSecondary}
                style={styles.sidebarItemChevron}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Overlay */}
      {sidebarOpen && (
        <Animated.View style={[styles.overlay, overlayAnimatedStyle]}>
          <TouchableOpacity 
            style={{ flex: 1 }}
            onPress={() => setSidebarOpen(false)}
          />
        </Animated.View>
      )}

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => setSidebarOpen(true)}
          >
            <Menu size={24} color={theme.colors.text} />
          </TouchableOpacity>
          
          <Text style={styles.topBarTitle}>
            {sidebarItems.find(item => item.screen === activeScreen)?.title || 'Dashboard'}
          </Text>
          
          <View style={styles.topBarActions}>
            <TouchableOpacity>
              <Bell size={20} color={theme.colors.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveScreen('account')}>
              <User size={20} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        {renderContent()}
      </View>
    </View>
  );
}