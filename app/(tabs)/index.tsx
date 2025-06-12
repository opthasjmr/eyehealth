import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Clock, Sun, Moon, CircleAlert as AlertCircle, Activity, Eye, Bell, TrendingUp } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { theme } = useTheme();
  const { user, updateStats } = useUser();
  const { scheduleBreakReminder } = useNotifications();
  const [screenTime, setScreenTime] = useState(0);
  const [nextBreak, setNextBreak] = useState(1200); // 20 minutes in seconds
  const [dailyProgress, setDailyProgress] = useState({
    exercises: 0,
    breaks: 0,
  });

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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
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
    streakContainer: {
      backgroundColor: theme.colors.surface,
      padding: 16,
      borderRadius: 16,
      marginBottom: 16,
      alignItems: 'center',
    },
    streakNumber: {
      fontSize: 32,
      fontWeight: '700',
      color: theme.colors.primary,
      marginTop: 8,
    },
    streakText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginTop: 4,
    },
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Eye Health Dashboard</Text>
        {user && (
          <Text style={styles.welcomeText}>Welcome back, {user.name}!</Text>
        )}
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Clock size={24} color={theme.colors.primary} />
            <Text style={styles.statLabel}>Screen Time</Text>
            <Text style={styles.statValue}>{formatTime(screenTime)}</Text>
          </View>
          <View style={styles.stat}>
            <Activity size={24} color={theme.colors.warning} />
            <Text style={styles.statLabel}>Next Break</Text>
            <Text style={styles.statValue}>{formatTime(nextBreak)}</Text>
          </View>
          <View style={styles.stat}>
            <TrendingUp size={24} color={theme.colors.success} />
            <Text style={styles.statLabel}>Streak</Text>
            <Text style={styles.statValue}>{user?.stats.streakDays || 0} days</Text>
          </View>
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
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${getProgressPercentage(dailyProgress.exercises, user.preferences.dailyGoals.exercises)}%` }
                ]} 
              />
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
        <Text style={styles.sectionTitle}>Quick Exercises</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.exerciseScroll}>
          <TouchableOpacity style={styles.exerciseCard}>
            <Eye size={24} color={theme.colors.primary} />
            <Text style={styles.exerciseTitle}>Focus Shift</Text>
            <Text style={styles.exerciseTime}>2 min</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.exerciseCard}>
            <Activity size={24} color={theme.colors.primary} />
            <Text style={styles.exerciseTitle}>Eye Rolling</Text>
            <Text style={styles.exerciseTime}>1 min</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.exerciseCard}>
            <Moon size={24} color={theme.colors.primary} />
            <Text style={styles.exerciseTitle}>Palming</Text>
            <Text style={styles.exerciseTime}>3 min</Text>
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
}