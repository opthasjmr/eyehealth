import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  FileText,
  Download,
  Share,
  Calendar,
  Filter,
  TrendingUp,
  Users,
  Eye,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  Target,
  AlertTriangle,
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { usePatients } from '@/contexts/PatientContext';

const { width } = Dimensions.get('window');

export default function ReportsScreen() {
  const { theme } = useTheme();
  const { patients, analyses } = usePatients();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('overview');

  // Calculate statistics
  const totalAnalyses = analyses.length;
  const totalPatients = patients.length;
  const avgConfidence = analyses.length > 0 
    ? Math.round(analyses.reduce((sum, a) => sum + a.confidence, 0) / analyses.length)
    : 0;

  const conditionStats = analyses.reduce((acc, analysis) => {
    acc[analysis.condition] = (acc[analysis.condition] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const severityStats = analyses.reduce((acc, analysis) => {
    acc[analysis.severity] = (acc[analysis.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const reportTypes = [
    { id: 'overview', title: 'Overview Report', icon: BarChart3 },
    { id: 'conditions', title: 'Conditions Analysis', icon: Eye },
    { id: 'patients', title: 'Patient Summary', icon: Users },
    { id: 'trends', title: 'Trend Analysis', icon: TrendingUp },
  ];

  const periods = [
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'quarter', label: 'This Quarter' },
    { id: 'year', label: 'This Year' },
  ];

  const generateReport = () => {
    // In production, this would generate and download a PDF report
    alert('Report generation would be implemented here');
  };

  const shareReport = () => {
    // In production, this would share the report
    alert('Report sharing would be implemented here');
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
    headerActions: {
      flexDirection: 'row',
      gap: 12,
    },
    actionButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },
    actionButtonSecondary: {
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    actionButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      marginLeft: 6,
    },
    actionButtonTextSecondary: {
      color: theme.colors.text,
    },
    filtersContainer: {
      flexDirection: 'row',
      gap: 12,
    },
    filterGroup: {
      flex: 1,
    },
    filterLabel: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.text,
      marginBottom: 8,
    },
    filterSelector: {
      flexDirection: 'row',
      backgroundColor: theme.colors.background,
      borderRadius: 8,
      padding: 2,
    },
    filterOption: {
      flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 6,
      alignItems: 'center',
    },
    filterOptionActive: {
      backgroundColor: theme.colors.primary,
    },
    filterOptionText: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: theme.colors.textSecondary,
    },
    filterOptionTextActive: {
      color: '#FFFFFF',
    },
    content: {
      flex: 1,
      padding: 24,
    },
    section: {
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: 20,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.text,
      marginBottom: 16,
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
    chartTitle: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.text,
      marginBottom: 16,
    },
    chartPlaceholder: {
      height: 200,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      borderRadius: 8,
    },
    chartPlaceholderText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginTop: 8,
    },
    conditionsGrid: {
      gap: 12,
    },
    conditionCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    conditionInfo: {
      flex: 1,
    },
    conditionName: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.text,
      marginBottom: 4,
    },
    conditionCount: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    conditionPercentage: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: theme.colors.primary,
    },
    summaryCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    summaryTitle: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.text,
      marginBottom: 12,
    },
    summaryText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      lineHeight: 20,
      marginBottom: 8,
    },
    highlightText: {
      color: theme.colors.primary,
      fontFamily: 'Inter-SemiBold',
    },
    warningCard: {
      backgroundColor: theme.colors.warning + '20',
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.warning,
      borderRadius: 8,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
    },
    warningText: {
      fontSize: 14,
      color: theme.colors.text,
      marginLeft: 12,
      flex: 1,
      lineHeight: 20,
    },
    reportTypeSelector: {
      flexDirection: 'row',
      backgroundColor: theme.colors.background,
      borderRadius: 8,
      padding: 2,
      marginBottom: 24,
    },
    reportTypeOption: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 8,
      borderRadius: 6,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    reportTypeOptionActive: {
      backgroundColor: theme.colors.primary,
    },
    reportTypeText: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: theme.colors.textSecondary,
      marginLeft: 6,
    },
    reportTypeTextActive: {
      color: '#FFFFFF',
    },
  });

  const renderOverviewReport = () => (
    <>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Metrics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <View style={styles.statIcon}>
                <Eye size={20} color={theme.colors.primary} />
              </View>
            </View>
            <Text style={styles.statValue}>{totalAnalyses}</Text>
            <Text style={styles.statTitle}>Total Analyses</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <View style={styles.statIcon}>
                <Users size={20} color={theme.colors.success} />
              </View>
            </View>
            <Text style={styles.statValue}>{totalPatients}</Text>
            <Text style={styles.statTitle}>Active Patients</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <View style={styles.statIcon}>
                <Target size={20} color={theme.colors.warning} />
              </View>
            </View>
            <Text style={styles.statValue}>{avgConfidence}%</Text>
            <Text style={styles.statTitle}>Avg. Confidence</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <View style={styles.statIcon}>
                <Clock size={20} color={theme.colors.accent} />
              </View>
            </View>
            <Text style={styles.statValue}>2.3s</Text>
            <Text style={styles.statTitle}>Avg. Processing</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Analysis Trends</Text>
          <View style={styles.chartPlaceholder}>
            <TrendingUp size={48} color={theme.colors.textSecondary} />
            <Text style={styles.chartPlaceholderText}>
              Trend chart would be displayed here
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Executive Summary</Text>
          <Text style={styles.summaryText}>
            During the selected period, <Text style={styles.highlightText}>{totalAnalyses} analyses</Text> were 
            performed across <Text style={styles.highlightText}>{totalPatients} patients</Text>. 
            The AI system maintained an average confidence score of{' '}
            <Text style={styles.highlightText}>{avgConfidence}%</Text>, indicating high reliability 
            in diagnostic assessments.
          </Text>
          <Text style={styles.summaryText}>
            The most frequently detected condition was{' '}
            <Text style={styles.highlightText}>
              {Object.keys(conditionStats).length > 0 
                ? Object.entries(conditionStats).sort(([,a], [,b]) => b - a)[0][0]
                : 'N/A'
              }
            </Text>, representing a significant portion of cases requiring follow-up care.
          </Text>
        </View>

        {Object.keys(severityStats).some(severity => severity === 'Severe') && (
          <View style={styles.warningCard}>
            <AlertTriangle size={20} color={theme.colors.warning} />
            <Text style={styles.warningText}>
              {severityStats['Severe'] || 0} severe cases detected requiring immediate attention.
              Please review these cases and ensure appropriate follow-up care.
            </Text>
          </View>
        )}
      </View>
    </>
  );

  const renderConditionsReport = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Condition Distribution</Text>
      <View style={styles.conditionsGrid}>
        {Object.entries(conditionStats).map(([condition, count]) => {
          const percentage = Math.round((count / totalAnalyses) * 100);
          return (
            <View key={condition} style={styles.conditionCard}>
              <View style={styles.conditionInfo}>
                <Text style={styles.conditionName}>{condition}</Text>
                <Text style={styles.conditionCount}>{count} cases</Text>
              </View>
              <Text style={styles.conditionPercentage}>{percentage}%</Text>
            </View>
          );
        })}
      </View>
    </View>
  );

  const renderPatientsReport = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Patient Demographics</Text>
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Age Distribution</Text>
        <View style={styles.chartPlaceholder}>
          <BarChart3 size={48} color={theme.colors.textSecondary} />
          <Text style={styles.chartPlaceholderText}>
            Patient demographics chart would be displayed here
          </Text>
        </View>
      </View>
    </View>
  );

  const renderTrendsReport = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Trend Analysis</Text>
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Monthly Analysis Volume</Text>
        <View style={styles.chartPlaceholder}>
          <Activity size={48} color={theme.colors.textSecondary} />
          <Text style={styles.chartPlaceholderText}>
            Trend analysis chart would be displayed here
          </Text>
        </View>
      </View>
    </View>
  );

  const renderReportContent = () => {
    switch (selectedReport) {
      case 'overview':
        return renderOverviewReport();
      case 'conditions':
        return renderConditionsReport();
      case 'patients':
        return renderPatientsReport();
      case 'trends':
        return renderTrendsReport();
      default:
        return renderOverviewReport();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Reports & Analytics</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.actionButtonSecondary]}
              onPress={shareReport}
            >
              <Share size={16} color={theme.colors.text} />
              <Text style={[styles.actionButtonText, styles.actionButtonTextSecondary]}>
                Share
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={generateReport}>
              <Download size={16} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Export PDF</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.filtersContainer}>
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Time Period</Text>
            <View style={styles.filterSelector}>
              {periods.map((period) => (
                <TouchableOpacity
                  key={period.id}
                  style={[
                    styles.filterOption,
                    selectedPeriod === period.id && styles.filterOptionActive,
                  ]}
                  onPress={() => setSelectedPeriod(period.id)}
                >
                  <Text style={[
                    styles.filterOptionText,
                    selectedPeriod === period.id && styles.filterOptionTextActive,
                  ]}>
                    {period.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.reportTypeSelector}>
          {reportTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.reportTypeOption,
                selectedReport === type.id && styles.reportTypeOptionActive,
              ]}
              onPress={() => setSelectedReport(type.id)}
            >
              <type.icon 
                size={16} 
                color={selectedReport === type.id ? '#FFFFFF' : theme.colors.textSecondary}
              />
              <Text style={[
                styles.reportTypeText,
                selectedReport === type.id && styles.reportTypeTextActive,
              ]}>
                {type.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {renderReportContent()}
      </ScrollView>
    </View>
  );
}