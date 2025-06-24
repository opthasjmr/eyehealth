import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LayoutDashboard, Upload, Users, FileText, TrendingUp, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Clock, Eye, Brain, Activity, Calendar, ChartBar as BarChart3, ChartPie as PieChart } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { usePatients } from '@/contexts/PatientContext';
import { router } from 'expo-router';
import { LineChart, BarChart, PieChart as RechartsPieChart } from 'recharts';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { patients, analyses } = usePatients();
  const [timeRange, setTimeRange] = useState('week');

  // Mock data for charts
  const weeklyAnalyses = [
    { day: 'Mon', count: 12 },
    { day: 'Tue', count: 19 },
    { day: 'Wed', count: 15 },
    { day: 'Thu', count: 22 },
    { day: 'Fri', count: 18 },
    { day: 'Sat', count: 8 },
    { day: 'Sun', count: 5 },
  ];

  const conditionDistribution = [
    { name: 'Diabetic Retinopathy', value: 35, color: theme.colors.error },
    { name: 'Glaucoma', value: 25, color: theme.colors.warning },
    { name: 'AMD', value: 20, color: theme.colors.primary },
    { name: 'Normal', value: 20, color: theme.colors.success },
  ];

  const recentAnalyses = [
    {
      id: '1',
      patientName: 'Sarah Johnson',
      condition: 'Diabetic Retinopathy',
      severity: 'Moderate',
      date: '2024-06-24',
      confidence: 92,
      status: 'completed',
    },
    {
      id: '2',
      patientName: 'Michael Chen',
      condition: 'Glaucoma Suspect',
      severity: 'Mild',
      date: '2024-06-24',
      confidence: 87,
      status: 'completed',
    },
    {
      id: '3',
      patientName: 'Emily Davis',
      condition: 'Normal',
      severity: 'N/A',
      date: '2024-06-23',
      confidence: 95,
      status: 'completed',
    },
  ];

  const quickActions = [
    {
      title: 'Upload Images',
      description: 'Start new analysis',
      icon: Upload,
      color: theme.colors.primary,
      onPress: () => router.push('/(dashboard)/upload'),
    },
    {
      title: 'Add Patient',
      description: 'Create patient profile',
      icon: Users,
      color: theme.colors.success,
      onPress: () => router.push('/(dashboard)/patients'),
    },
    {
      title: 'View Reports',
      description: 'Generate reports',
      icon: FileText,
      color: theme.colors.warning,
      onPress: () => router.push('/(dashboard)/reports'),
    },
  ];

  const stats = [
    {
      title: 'Total Analyses',
      value: '1,247',
      change: '+12%',
      changeType: 'positive',
      icon: Brain,
    },
    {
      title: 'Active Patients',
      value: '342',
      change: '+8%',
      changeType: 'positive',
      icon: Users,
    },
    {
      title: 'Avg. Confidence',
      value: '94.2%',
      change: '+2.1%',
      changeType: 'positive',
      icon: CheckCircle,
    },
    {
      title: 'Processing Time',
      value: '2.3s',
      change: '-15%',
      changeType: 'positive',
      icon: Clock,
    },
  ];

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
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    title: {
      fontSize: 28,
      fontFamily: 'Inter-Bold',
      color: theme.colors.text,
    },
    dateTime: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    welcome: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
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
      fontSize: 20,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.text,
    },
    viewAllButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    viewAllText: {
      fontSize: 14,
      color: theme.colors.primary,
      fontFamily: 'Inter-Medium',
      marginRight: 4,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 16,
    },
    statCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 20,
      flex: 1,
      minWidth: (width - 80) / 2,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    statHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    statIcon: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: theme.colors.background,
    },
    statValue: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: theme.colors.text,
      marginBottom: 4,
    },
    statTitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 8,
    },
    statChange: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
    },
    positiveChange: {
      color: theme.colors.success,
    },
    negativeChange: {
      color: theme.colors.error,
    },
    quickActionsGrid: {
      flexDirection: 'row',
      gap: 16,
    },
    actionCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 20,
      flex: 1,
      alignItems: 'center',
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    actionIcon: {
      marginBottom: 12,
    },
    actionTitle: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.text,
      marginBottom: 4,
      textAlign: 'center',
    },
    actionDescription: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    chartContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 20,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    chartHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    chartTitle: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.text,
    },
    timeRangeSelector: {
      flexDirection: 'row',
      backgroundColor: theme.colors.background,
      borderRadius: 8,
      padding: 2,
    },
    timeRangeButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
    },
    timeRangeButtonActive: {
      backgroundColor: theme.colors.primary,
    },
    timeRangeText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      fontFamily: 'Inter-Medium',
    },
    timeRangeTextActive: {
      color: '#FFFFFF',
    },
    analysesContainer: {
      gap: 12,
    },
    analysisCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    analysisInfo: {
      flex: 1,
      marginLeft: 12,
    },
    patientName: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
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
      fontFamily: 'Inter-Medium',
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 10,
      backgroundColor: theme.colors.warning,
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
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.dateTime}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>
        <Text style={styles.welcome}>
          Welcome back, Dr. {user?.lastName || 'Doctor'}
        </Text>
        <Text style={styles.subtitle}>
          Here's what's happening with your patients today
        </Text>
      </View>

      <View style={styles.content}>
        {/* Statistics */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Overview</Text>
          </View>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <View style={styles.statHeader}>
                  <View style={styles.statIcon}>
                    <stat.icon size={20} color={theme.colors.primary} />
                  </View>
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statTitle}>{stat.title}</Text>
                <Text style={[
                  styles.statChange,
                  stat.changeType === 'positive' ? styles.positiveChange : styles.negativeChange
                ]}>
                  {stat.change} from last month
                </Text>
              </View>
            ))}
          </View>
        </View>

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
                <View style={styles.actionIcon}>
                  <action.icon size={32} color={action.color} />
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionDescription}>{action.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Analysis Chart */}
        <View style={styles.section}>
          <View style={styles.chartContainer}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Analysis Activity</Text>
              <View style={styles.timeRangeSelector}>
                {['week', 'month', 'year'].map((range) => (
                  <TouchableOpacity
                    key={range}
                    style={[
                      styles.timeRangeButton,
                      timeRange === range && styles.timeRangeButtonActive,
                    ]}
                    onPress={() => setTimeRange(range)}
                  >
                    <Text style={[
                      styles.timeRangeText,
                      timeRange === range && styles.timeRangeTextActive,
                    ]}>
                      {range.charAt(0).toUpperCase() + range.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={{ height: 200, justifyContent: 'center', alignItems: 'center' }}>
              <BarChart3 size={48} color={theme.colors.textSecondary} />
              <Text style={{ color: theme.colors.textSecondary, marginTop: 8 }}>
                Chart visualization would appear here
              </Text>
            </View>
          </View>
        </View>

        {/* Recent Analyses */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Analyses</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
              <TrendingUp size={16} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.analysesContainer}>
            {recentAnalyses.map((analysis) => (
              <View key={analysis.id} style={styles.analysisCard}>
                <Eye size={24} color={theme.colors.primary} />
                <View style={styles.analysisInfo}>
                  <Text style={styles.patientName}>{analysis.patientName}</Text>
                  <View style={styles.conditionInfo}>
                    <Text style={styles.condition}>{analysis.condition}</Text>
                    {analysis.severity !== 'N/A' && (
                      <Text style={styles.severity}>{analysis.severity}</Text>
                    )}
                  </View>
                  <Text style={styles.analysisDate}>{analysis.date}</Text>
                </View>
                <View style={styles.confidenceContainer}>
                  <Text style={styles.confidence}>{analysis.confidence}%</Text>
                  <Text style={styles.confidenceLabel}>Confidence</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}