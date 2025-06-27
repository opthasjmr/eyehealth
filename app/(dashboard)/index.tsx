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
  interpolate,
} from 'react-native-reanimated';
import { 
  LayoutDashboard, 
  Upload, 
  Users, 
  FileText, 
  TrendingUp, 
  Eye, 
  Brain, 
  Activity, 
  Calendar, 
  Cpu,
  Zap,
  Shield,
  Target,
  CheckCircle,
  AlertTriangle,
  Clock,
  Database,
  Microscope,
  BarChart3,
  PieChart,
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { usePatients } from '@/contexts/PatientContext';
import { useAI } from '@/contexts/AIContext';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard } from '@/components/MaterialUI/GlassCard';
import { NeumorphicCard } from '@/components/MaterialUI/NeumorphicCard';
import { MaterialButton } from '@/components/MaterialUI/MaterialButton';
import { FloatingActionButton } from '@/components/MaterialUI/FloatingActionButton';
import { EyeModel3D } from '@/components/3D/EyeModel3D';

const { width, height } = Dimensions.get('window');

export default function DashboardScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { patients, analyses } = usePatients();
  const { models, diagnosticResults } = useAI();
  const [timeRange, setTimeRange] = useState('week');

  // Animations
  const pulseAnimation = useSharedValue(1);
  const slideAnimation = useSharedValue(0);
  const rotateAnimation = useSharedValue(0);

  useEffect(() => {
    // Pulse animation for key metrics
    pulseAnimation.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 2000 }),
        withTiming(1, { duration: 2000 })
      ),
      -1,
      true
    );

    // Slide in animation
    slideAnimation.value = withTiming(1, { duration: 1000 });

    // Rotation animation for 3D elements
    rotateAnimation.value = withRepeat(
      withTiming(360, { duration: 10000 }),
      -1,
      false
    );
  }, []);

  // Mock data for enhanced dashboard
  const aiMetrics = {
    totalAnalyses: 2847,
    accuracy: 96.8,
    processingTime: 2.3,
    modelsActive: 4,
    uptime: 99.9,
  };

  const recentAnalyses = [
    {
      id: '1',
      patientName: 'Sarah Johnson',
      condition: 'Diabetic Retinopathy',
      severity: 'Moderate',
      date: '2024-12-15',
      confidence: 94.2,
      status: 'completed',
      riskLevel: 'moderate',
    },
    {
      id: '2',
      patientName: 'Michael Chen',
      condition: 'Glaucoma Suspect',
      severity: 'Mild',
      date: '2024-12-15',
      confidence: 89.7,
      status: 'completed',
      riskLevel: 'low',
    },
    {
      id: '3',
      patientName: 'Emily Davis',
      condition: 'Normal Retina',
      severity: 'Normal',
      date: '2024-12-14',
      confidence: 97.1,
      status: 'completed',
      riskLevel: 'low',
    },
  ];

  const quickActions = [
    {
      title: 'AI Diagnostics',
      description: 'Advanced AI analysis',
      icon: Brain,
      color: '#8B5CF6',
      onPress: () => router.push('/(dashboard)/ai-diagnostics'),
    },
    {
      title: 'Upload Images',
      description: 'Start new analysis',
      icon: Upload,
      color: theme.colors.primary,
      onPress: () => router.push('/(dashboard)/upload'),
    },
    {
      title: 'Patient Records',
      description: 'Manage patients',
      icon: Users,
      color: theme.colors.success,
      onPress: () => router.push('/(dashboard)/patients'),
    },
    {
      title: 'Generate Reports',
      description: 'Create medical reports',
      icon: FileText,
      color: theme.colors.warning,
      onPress: () => router.push('/(dashboard)/reports'),
    },
  ];

  const stats = [
    {
      title: 'AI Analyses Today',
      value: '47',
      change: '+23%',
      changeType: 'positive',
      icon: Brain,
      color: '#8B5CF6',
    },
    {
      title: 'Active Patients',
      value: '342',
      change: '+8%',
      changeType: 'positive',
      icon: Users,
      color: theme.colors.success,
    },
    {
      title: 'AI Accuracy',
      value: '96.8%',
      change: '+2.1%',
      changeType: 'positive',
      icon: Target,
      color: theme.colors.primary,
    },
    {
      title: 'Processing Speed',
      value: '2.3s',
      change: '-15%',
      changeType: 'positive',
      icon: Zap,
      color: theme.colors.warning,
    },
  ];

  const systemStatus = [
    {
      name: 'AI Models',
      status: 'operational',
      value: '4/4 Active',
      icon: Cpu,
    },
    {
      name: 'Processing Queue',
      status: 'operational',
      value: '3 pending',
      icon: Database,
    },
    {
      name: 'System Health',
      status: 'operational',
      value: '99.9% uptime',
      icon: Activity,
    },
    {
      name: 'Security',
      status: 'operational',
      value: 'HIPAA Compliant',
      icon: Shield,
    },
  ];

  // Animated styles
  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnimation.value }],
  }));

  const slideAnimatedStyle = useAnimatedStyle(() => ({
    opacity: slideAnimation.value,
    transform: [
      { translateY: interpolate(slideAnimation.value, [0, 1], [50, 0]) }
    ],
  }));

  const rotateAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotateAnimation.value}deg` }],
  }));

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return theme.colors.success;
      case 'moderate': return theme.colors.warning;
      case 'high': return theme.colors.error;
      default: return theme.colors.textSecondary;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return theme.colors.success;
      case 'warning': return theme.colors.warning;
      case 'error': return theme.colors.error;
      default: return theme.colors.textSecondary;
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      padding: 24,
      paddingTop: Platform.OS === 'ios' ? 60 : 40,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerGradient: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 200,
    },
    headerContent: {
      zIndex: 1,
    },
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    title: {
      fontSize: 32,
      fontFamily: 'Inter-Bold',
      color: '#FFFFFF',
    },
    dateTime: {
      fontSize: 14,
      color: 'rgba(255, 255, 255, 0.8)',
    },
    welcome: {
      fontSize: 18,
      color: 'rgba(255, 255, 255, 0.9)',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      color: 'rgba(255, 255, 255, 0.7)',
    },
    content: {
      flex: 1,
      padding: 24,
    },
    section: {
      marginBottom: 32,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: theme.colors.text,
    },
    viewAllButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    viewAllText: {
      fontSize: 14,
      color: theme.colors.primary,
      fontFamily: 'Inter-SemiBold',
      marginRight: 4,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 16,
    },
    statCard: {
      flex: 1,
      minWidth: (width - 80) / 2,
      borderRadius: 20,
      padding: 20,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 24,
      elevation: 8,
    },
    statGradient: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 20,
    },
    statContent: {
      zIndex: 1,
    },
    statHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    statIcon: {
      padding: 12,
      borderRadius: 12,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    statValue: {
      fontSize: 28,
      fontFamily: 'Inter-Bold',
      color: '#FFFFFF',
      marginBottom: 4,
    },
    statTitle: {
      fontSize: 14,
      color: 'rgba(255, 255, 255, 0.9)',
      marginBottom: 8,
    },
    statChange: {
      fontSize: 12,
      fontFamily: 'Inter-SemiBold',
      color: 'rgba(255, 255, 255, 0.8)',
    },
    quickActionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 16,
    },
    actionCard: {
      flex: 1,
      minWidth: (width - 80) / 2,
      borderRadius: 20,
      padding: 20,
      alignItems: 'center',
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 24,
      elevation: 8,
    },
    actionIcon: {
      marginBottom: 12,
    },
    actionTitle: {
      fontSize: 16,
      fontFamily: 'Inter-Bold',
      color: theme.colors.text,
      marginBottom: 4,
      textAlign: 'center',
    },
    actionDescription: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    analysesContainer: {
      gap: 12,
    },
    analysisCard: {
      borderRadius: 16,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 5,
    },
    analysisIcon: {
      padding: 12,
      borderRadius: 12,
      marginRight: 16,
    },
    analysisInfo: {
      flex: 1,
    },
    patientName: {
      fontSize: 16,
      fontFamily: 'Inter-Bold',
      color: theme.colors.text,
      marginBottom: 4,
    },
    conditionInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    condition: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginRight: 8,
    },
    severity: {
      fontSize: 12,
      fontFamily: 'Inter-SemiBold',
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 10,
      color: '#FFFFFF',
    },
    analysisDate: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    confidenceContainer: {
      alignItems: 'center',
    },
    confidence: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: theme.colors.success,
      marginBottom: 2,
    },
    confidenceLabel: {
      fontSize: 10,
      color: theme.colors.textSecondary,
    },
    systemStatusContainer: {
      gap: 12,
    },
    statusItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderRadius: 12,
      backgroundColor: theme.colors.surface,
    },
    statusIcon: {
      marginRight: 12,
    },
    statusInfo: {
      flex: 1,
    },
    statusName: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.text,
      marginBottom: 2,
    },
    statusValue: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    statusIndicator: {
      width: 12,
      height: 12,
      borderRadius: 6,
    },
    eyeModelContainer: {
      alignItems: 'center',
      padding: 20,
    },
    modelTitle: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: theme.colors.text,
      marginBottom: 16,
    },
    fab: {
      position: 'absolute',
      bottom: 24,
      right: 24,
    },
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.secondary, '#8B5CF6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        />
        <Animated.View style={[styles.headerContent, slideAnimatedStyle]}>
          <View style={styles.headerTop}>
            <Text style={styles.title}>AI Dashboard</Text>
            <Text style={styles.dateTime}>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </Text>
          </View>
          <Text style={styles.welcome}>
            Welcome back, Dr. {user?.lastName || 'Doctor'}
          </Text>
          <Text style={styles.subtitle}>
            Advanced AI-powered medical diagnostics at your fingertips
          </Text>
        </Animated.View>
      </View>

      <View style={styles.content}>
        {/* Key Metrics */}
        <Animated.View style={[styles.section, slideAnimatedStyle]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>AI Performance</Text>
          </View>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <Animated.View key={index} style={[styles.statCard, pulseAnimatedStyle]}>
                <LinearGradient
                  colors={[stat.color, `${stat.color}CC`]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.statGradient}
                />
                <View style={styles.statContent}>
                  <View style={styles.statHeader}>
                    <View style={styles.statIcon}>
                      <stat.icon size={24} color="#FFFFFF" />
                    </View>
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statTitle}>{stat.title}</Text>
                  <Text style={styles.statChange}>
                    {stat.change} from last week
                  </Text>
                </View>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionCard}
                onPress={action.onPress}
              >
                <NeumorphicCard style={{ padding: 0, backgroundColor: 'transparent' }}>
                  <View style={styles.actionIcon}>
                    <action.icon size={32} color={action.color} />
                  </View>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Text style={styles.actionDescription}>{action.description}</Text>
                </NeumorphicCard>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 3D Eye Model Showcase */}
        <GlassCard style={styles.section}>
          <View style={styles.eyeModelContainer}>
            <Text style={styles.modelTitle}>3D Eye Visualization</Text>
            <Animated.View style={rotateAnimatedStyle}>
              <EyeModel3D 
                condition="normal"
                animated={true}
                size={200}
              />
            </Animated.View>
          </View>
        </GlassCard>

        {/* Recent AI Analyses */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent AI Analyses</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
              <TrendingUp size={16} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.analysesContainer}>
            {recentAnalyses.map((analysis) => (
              <GlassCard key={analysis.id} style={styles.analysisCard}>
                <View style={[
                  styles.analysisIcon,
                  { backgroundColor: getRiskColor(analysis.riskLevel) + '20' }
                ]}>
                  <Brain size={24} color={getRiskColor(analysis.riskLevel)} />
                </View>
                <View style={styles.analysisInfo}>
                  <Text style={styles.patientName}>{analysis.patientName}</Text>
                  <View style={styles.conditionInfo}>
                    <Text style={styles.condition}>{analysis.condition}</Text>
                    <Text style={[
                      styles.severity,
                      { backgroundColor: getRiskColor(analysis.riskLevel) }
                    ]}>
                      {analysis.severity}
                    </Text>
                  </View>
                  <Text style={styles.analysisDate}>{analysis.date}</Text>
                </View>
                <View style={styles.confidenceContainer}>
                  <Text style={styles.confidence}>{analysis.confidence}%</Text>
                  <Text style={styles.confidenceLabel}>Confidence</Text>
                </View>
              </GlassCard>
            ))}
          </View>
        </View>

        {/* System Status */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>System Status</Text>
          </View>
          <View style={styles.systemStatusContainer}>
            {systemStatus.map((status, index) => (
              <NeumorphicCard key={index} style={styles.statusItem}>
                <status.icon 
                  size={20} 
                  color={getStatusColor(status.status)} 
                  style={styles.statusIcon}
                />
                <View style={styles.statusInfo}>
                  <Text style={styles.statusName}>{status.name}</Text>
                  <Text style={styles.statusValue}>{status.value}</Text>
                </View>
                <View style={[
                  styles.statusIndicator,
                  { backgroundColor: getStatusColor(status.status) }
                ]} />
              </NeumorphicCard>
            ))}
          </View>
        </View>
      </View>

      <FloatingActionButton
        onPress={() => router.push('/(dashboard)/ai-diagnostics')}
        style={styles.fab}
        color="#8B5CF6"
      >
        <Brain size={24} color="#FFFFFF" />
      </FloatingActionButton>
    </ScrollView>
  );
}