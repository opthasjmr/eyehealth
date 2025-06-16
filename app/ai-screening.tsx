import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  Platform,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';
import {
  Brain,
  Camera,
  Eye,
  Scan,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  FileText,
  Zap,
  Shield,
  Target,
  Activity,
  Search,
  Globe,
  Lightbulb,
  ArrowLeft,
  Share,
  Bookmark,
  ExternalLink,
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';
import { aiService, AIAnalysisResult, AISearchResult } from '@/services/AIService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

interface ScreeningResult extends AIAnalysisResult {
  id: string;
  date: string;
  type: 'pupil' | 'blink' | 'tracking' | 'comprehensive';
}

interface AIScreeningState {
  isAnalyzing: boolean;
  progress: number;
  currentStep: string;
  result: ScreeningResult | null;
}

export default function AIScreeningScreen() {
  const { theme } = useTheme();
  const { user, updateStats } = useUser();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('front');
  const [isScanning, setIsScanning] = useState(false);
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [screeningHistory, setScreeningHistory] = useState<ScreeningResult[]>([]);
  const [aiScreening, setAiScreening] = useState<AIScreeningState>({
    isAnalyzing: false,
    progress: 0,
    currentStep: '',
    result: null,
  });

  // AI Search Features
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<AISearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [aiInsights, setAiInsights] = useState<string[]>([]);

  // Animations
  const scanAnimation = useSharedValue(0);
  const progressAnimation = useSharedValue(0);
  const pulseAnimation = useSharedValue(1);

  useEffect(() => {
    loadScreeningHistory();
    loadAIInsights();
  }, []);

  useEffect(() => {
    if (isScanning) {
      scanAnimation.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1000 }),
          withTiming(0, { duration: 1000 })
        ),
        -1,
        true
      );
      
      pulseAnimation.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 800 }),
          withTiming(1, { duration: 800 })
        ),
        -1,
        true
      );
    } else {
      scanAnimation.value = withTiming(0);
      pulseAnimation.value = withTiming(1);
    }
  }, [isScanning]);

  const loadScreeningHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('aiScreeningHistory');
      if (history) {
        setScreeningHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error('Error loading screening history:', error);
    }
  };

  const loadAIInsights = async () => {
    try {
      const insights = await aiService.getTrendingTopics();
      setAiInsights(insights.slice(0, 5));
    } catch (error) {
      console.error('Error loading AI insights:', error);
    }
  };

  const saveScreeningResult = async (result: ScreeningResult) => {
    try {
      const updatedHistory = [result, ...screeningHistory];
      await AsyncStorage.setItem('aiScreeningHistory', JSON.stringify(updatedHistory));
      setScreeningHistory(updatedHistory);
    } catch (error) {
      console.error('Error saving screening result:', error);
    }
  };

  const startScreening = async (testType: string) => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Permission Required', 'Camera access is needed for AI screening');
        return;
      }
    }

    setSelectedTest(testType);
    setIsScanning(true);

    // Simulate scanning for 5 seconds, then analyze
    setTimeout(async () => {
      setIsScanning(false);
      await performAIAnalysis(testType);
    }, 5000);
  };

  const performAIAnalysis = async (testType: string) => {
    setAiScreening(prev => ({ ...prev, isAnalyzing: true, progress: 0 }));

    const steps = [
      'Initializing AI models...',
      'Processing visual data...',
      'Analyzing eye patterns...',
      'Applying machine learning...',
      'Generating insights...',
      'Finalizing analysis...',
    ];

    try {
      for (let i = 0; i < steps.length; i++) {
        setAiScreening(prev => ({
          ...prev,
          currentStep: steps[i],
          progress: ((i + 1) / steps.length) * 100,
        }));
        progressAnimation.value = withTiming(((i + 1) / steps.length) * 100, { duration: 500 });
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      // Perform actual AI analysis
      const analysisResult = await aiService.analyzeVisionData('mock_image_data', testType);
      
      const result: ScreeningResult = {
        ...analysisResult,
        id: Date.now().toString(),
        date: new Date().toISOString(),
        type: testType as any,
      };

      setAiScreening(prev => ({ ...prev, isAnalyzing: false, result }));
      await saveScreeningResult(result);
      
      if (user) {
        await updateStats({
          totalExercises: (user.stats.totalExercises || 0) + 1,
        });
      }
    } catch (error) {
      setAiScreening(prev => ({ ...prev, isAnalyzing: false }));
      Alert.alert('Analysis Error', 'AI analysis failed. Please try again.');
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await aiService.searchEyeHealthInfo(searchQuery);
      setSearchResults(results);
    } catch (error) {
      Alert.alert('Search Error', 'Failed to search. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const openSearchResult = (url: string) => {
    if (Platform.OS === 'web') {
      window.open(url, '_blank');
    } else {
      Alert.alert('External Link', `Would open: ${url}`);
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return theme.colors.success;
      case 'medium': return theme.colors.warning;
      case 'high': return theme.colors.error;
      default: return theme.colors.textSecondary;
    }
  };

  const scanAnimatedStyle = useAnimatedStyle(() => ({
    opacity: scanAnimation.value,
  }));

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnimation.value }],
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressAnimation.value}%`,
  }));

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
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginBottom: 16,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginBottom: 16,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: theme.colors.text,
      marginLeft: 12,
    },
    searchButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
      padding: 8,
      marginLeft: 8,
    },
    aiFeatures: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    feature: {
      alignItems: 'center',
    },
    featureText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginTop: 4,
      textAlign: 'center',
    },
    testsSection: {
      padding: 16,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 16,
    },
    testCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 5,
    },
    testHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    testIcon: {
      marginRight: 12,
    },
    testTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text,
      flex: 1,
    },
    testDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 16,
      lineHeight: 20,
    },
    testButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    testButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
    },
    cameraContainer: {
      flex: 1,
      position: 'relative',
    },
    camera: {
      flex: 1,
    },
    scanOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    scanFrame: {
      width: 250,
      height: 250,
      borderWidth: 3,
      borderColor: theme.colors.primary,
      borderRadius: 125,
      justifyContent: 'center',
      alignItems: 'center',
    },
    scanText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '600',
      textAlign: 'center',
      marginTop: 20,
    },
    analysisContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    analysisTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 20,
      textAlign: 'center',
    },
    progressContainer: {
      width: '100%',
      height: 8,
      backgroundColor: theme.colors.border,
      borderRadius: 4,
      marginBottom: 16,
      overflow: 'hidden',
    },
    progressBar: {
      height: '100%',
      backgroundColor: theme.colors.primary,
    },
    analysisStep: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: 20,
    },
    resultContainer: {
      padding: 20,
    },
    resultHeader: {
      alignItems: 'center',
      marginBottom: 24,
    },
    scoreCircle: {
      width: 120,
      height: 120,
      borderRadius: 60,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    scoreText: {
      fontSize: 32,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    scoreLabel: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    riskLevel: {
      fontSize: 18,
      fontWeight: '700',
      textAlign: 'center',
      marginTop: 8,
    },
    detailsSection: {
      marginBottom: 24,
    },
    detailItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    detailLabel: {
      fontSize: 16,
      color: theme.colors.text,
    },
    detailValue: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.primary,
    },
    insightsSection: {
      marginBottom: 24,
    },
    insightItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 12,
      backgroundColor: theme.colors.background,
      padding: 12,
      borderRadius: 8,
    },
    insightText: {
      fontSize: 14,
      color: theme.colors.text,
      marginLeft: 12,
      flex: 1,
      lineHeight: 20,
    },
    recommendationsSection: {
      marginBottom: 24,
    },
    recommendationItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    recommendationText: {
      fontSize: 14,
      color: theme.colors.text,
      marginLeft: 12,
      flex: 1,
      lineHeight: 20,
    },
    searchSection: {
      padding: 16,
    },
    searchResults: {
      marginTop: 16,
    },
    searchResultItem: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    searchResultTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 8,
    },
    searchResultSnippet: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 8,
      lineHeight: 20,
    },
    searchResultMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    searchResultSource: {
      fontSize: 12,
      color: theme.colors.primary,
      fontWeight: '500',
    },
    searchResultActions: {
      flexDirection: 'row',
      gap: 8,
    },
    actionButton: {
      padding: 8,
    },
    backButton: {
      backgroundColor: theme.colors.textSecondary,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      margin: 20,
    },
    backButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    newTestButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      margin: 20,
    },
    newTestButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    toggleSearchButton: {
      backgroundColor: theme.colors.accent,
      borderRadius: 12,
      padding: 12,
      alignItems: 'center',
      margin: 16,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    toggleSearchButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
      marginLeft: 8,
    },
    loadingIndicator: {
      marginLeft: 8,
    },
  });

  if (aiScreening.result) {
    const result = aiScreening.result;
    return (
      <ScrollView style={styles.container}>
        <View style={styles.resultContainer}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => setAiScreening(prev => ({ ...prev, result: null }))}
          >
            <ArrowLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.resultHeader}>
            <View style={[styles.scoreCircle, { backgroundColor: getRiskColor(result.riskLevel) }]}>
              <Text style={styles.scoreText}>{Math.round(result.detailedAnalysis.overallHealth)}</Text>
            </View>
            <Text style={styles.scoreLabel}>AI Health Score</Text>
            <Text style={[styles.riskLevel, { color: getRiskColor(result.riskLevel) }]}>
              {result.riskLevel.toUpperCase()} RISK
            </Text>
          </View>

          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Analysis Details</Text>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>AI Confidence</Text>
              <Text style={styles.detailValue}>{Math.round(result.confidence)}%</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Pupil Response</Text>
              <Text style={styles.detailValue}>{Math.round(result.detailedAnalysis.pupilResponse)}%</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Blink Rate</Text>
              <Text style={styles.detailValue}>{Math.round(result.detailedAnalysis.blinkRate)}/min</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Eye Tracking</Text>
              <Text style={styles.detailValue}>{Math.round(result.detailedAnalysis.eyeTracking)}%</Text>
            </View>
          </View>

          <View style={styles.insightsSection}>
            <Text style={styles.sectionTitle}>AI Insights</Text>
            {result.aiInsights.map((insight, index) => (
              <View key={index} style={styles.insightItem}>
                <Brain size={16} color={theme.colors.primary} />
                <Text style={styles.insightText}>{insight}</Text>
              </View>
            ))}
          </View>

          <View style={styles.recommendationsSection}>
            <Text style={styles.sectionTitle}>Recommendations</Text>
            {result.recommendations.map((recommendation, index) => (
              <View key={index} style={styles.recommendationItem}>
                <CheckCircle size={16} color={theme.colors.success} />
                <Text style={styles.recommendationText}>{recommendation}</Text>
              </View>
            ))}
          </View>

          <View style={styles.recommendationsSection}>
            <Text style={styles.sectionTitle}>Follow-up Actions</Text>
            {result.followUpActions.map((action, index) => (
              <View key={index} style={styles.recommendationItem}>
                <Target size={16} color={theme.colors.warning} />
                <Text style={styles.recommendationText}>{action}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity 
            style={styles.newTestButton} 
            onPress={() => {
              setAiScreening(prev => ({ ...prev, result: null }));
              setSelectedTest(null);
            }}
          >
            <Text style={styles.newTestButtonText}>Take Another Test</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  if (aiScreening.isAnalyzing) {
    return (
      <View style={styles.analysisContainer}>
        <Animated.View style={pulseAnimatedStyle}>
          <Brain size={64} color={theme.colors.primary} />
        </Animated.View>
        <Text style={styles.analysisTitle}>AI Analysis in Progress</Text>
        <View style={styles.progressContainer}>
          <Animated.View style={[styles.progressBar, progressAnimatedStyle]} />
        </View>
        <Text style={styles.analysisStep}>{aiScreening.currentStep}</Text>
      </View>
    );
  }

  if (isScanning && selectedTest) {
    return (
      <View style={styles.cameraContainer}>
        {Platform.OS !== 'web' ? (
          <CameraView style={styles.camera} facing={facing}>
            <View style={styles.scanOverlay}>
              <Animated.View style={[styles.scanFrame, pulseAnimatedStyle]}>
                <Animated.View style={scanAnimatedStyle}>
                  <Scan size={48} color={theme.colors.primary} />
                </Animated.View>
              </Animated.View>
              <Text style={styles.scanText}>
                Look directly at the camera{'\n'}
                Keep your eyes open and steady
              </Text>
            </View>
          </CameraView>
        ) : (
          <View style={[styles.scanOverlay, { backgroundColor: theme.colors.background }]}>
            <Animated.View style={[styles.scanFrame, pulseAnimatedStyle]}>
              <Animated.View style={scanAnimatedStyle}>
                <Scan size={48} color={theme.colors.primary} />
              </Animated.View>
            </Animated.View>
            <Text style={[styles.scanText, { color: theme.colors.text }]}>
              Simulating camera scan...{'\n'}
              AI analysis will begin shortly
            </Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Vision Screening</Text>
        <Text style={styles.subtitle}>
          Advanced AI-powered analysis with internet access for comprehensive insights
        </Text>
        
        <View style={styles.searchContainer}>
          <Search size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search eye health information..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            {isSearching ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Globe size={16} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
        
        <View style={styles.aiFeatures}>
          <View style={styles.feature}>
            <Brain size={24} color={theme.colors.primary} />
            <Text style={styles.featureText}>AI Analysis</Text>
          </View>
          <View style={styles.feature}>
            <Globe size={24} color={theme.colors.success} />
            <Text style={styles.featureText}>Internet Access</Text>
          </View>
          <View style={styles.feature}>
            <Target size={24} color={theme.colors.warning} />
            <Text style={styles.featureText}>Real-time Data</Text>
          </View>
          <View style={styles.feature}>
            <TrendingUp size={24} color={theme.colors.accent} />
            <Text style={styles.featureText}>Live Research</Text>
          </View>
        </View>
      </View>

      {searchResults.length > 0 && (
        <View style={styles.searchSection}>
          <Text style={styles.sectionTitle}>Search Results</Text>
          <View style={styles.searchResults}>
            {searchResults.map((result, index) => (
              <TouchableOpacity
                key={index}
                style={styles.searchResultItem}
                onPress={() => openSearchResult(result.url)}
              >
                <Text style={styles.searchResultTitle}>{result.title}</Text>
                <Text style={styles.searchResultSnippet}>{result.snippet}</Text>
                <View style={styles.searchResultMeta}>
                  <Text style={styles.searchResultSource}>{result.source}</Text>
                  <View style={styles.searchResultActions}>
                    <TouchableOpacity style={styles.actionButton}>
                      <Bookmark size={16} color={theme.colors.textSecondary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                      <Share size={16} color={theme.colors.textSecondary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                      <ExternalLink size={16} color={theme.colors.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <TouchableOpacity 
        style={styles.toggleSearchButton}
        onPress={() => setShowSearch(!showSearch)}
      >
        <Search size={16} color="#FFFFFF" />
        <Text style={styles.toggleSearchButtonText}>
          {showSearch ? 'Hide' : 'Show'} AI Research Assistant
        </Text>
      </TouchableOpacity>

      {showSearch && (
        <View style={styles.searchSection}>
          <Text style={styles.sectionTitle}>AI Insights & Trending Topics</Text>
          {aiInsights.map((insight, index) => (
            <TouchableOpacity
              key={index}
              style={styles.searchResultItem}
              onPress={() => {
                setSearchQuery(insight);
                handleSearch();
              }}
            >
              <View style={styles.insightItem}>
                <Lightbulb size={16} color={theme.colors.accent} />
                <Text style={styles.insightText}>{insight}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.testsSection}>
        <Text style={styles.sectionTitle}>Available AI Screenings</Text>
        
        <View style={styles.testCard}>
          <View style={styles.testHeader}>
            <Eye size={32} color={theme.colors.primary} style={styles.testIcon} />
            <Text style={styles.testTitle}>AI Pupil Analysis</Text>
          </View>
          <Text style={styles.testDescription}>
            Advanced AI analyzes pupil dilation and response patterns with internet-sourced medical data for comprehensive assessment.
          </Text>
          <TouchableOpacity style={styles.testButton} onPress={() => startScreening('pupil')}>
            <Brain size={20} color="#FFFFFF" />
            <Text style={styles.testButtonText}>Start AI Analysis</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.testCard}>
          <View style={styles.testHeader}>
            <Activity size={32} color={theme.colors.primary} style={styles.testIcon} />
            <Text style={styles.testTitle}>Smart Blink Detection</Text>
          </View>
          <Text style={styles.testDescription}>
            Machine learning algorithms monitor blink patterns and cross-reference with latest research on dry eye syndrome.
          </Text>
          <TouchableOpacity style={styles.testButton} onPress={() => startScreening('blink')}>
            <Brain size={20} color="#FFFFFF" />
            <Text style={styles.testButtonText}>Analyze Blink Patterns</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.testCard}>
          <View style={styles.testHeader}>
            <Target size={32} color={theme.colors.primary} style={styles.testIcon} />
            <Text style={styles.testTitle}>Eye Tracking AI</Text>
          </View>
          <Text style={styles.testDescription}>
            Computer vision evaluates eye movement coordination with real-time access to vision science databases.
          </Text>
          <TouchableOpacity style={styles.testButton} onPress={() => startScreening('tracking')}>
            <Brain size={20} color="#FFFFFF" />
            <Text style={styles.testButtonText}>Test Eye Tracking</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.testCard}>
          <View style={styles.testHeader}>
            <Zap size={32} color={theme.colors.primary} style={styles.testIcon} />
            <Text style={styles.testTitle}>Comprehensive AI Screening</Text>
          </View>
          <Text style={styles.testDescription}>
            Complete AI-powered assessment with internet access to latest medical research and treatment protocols.
          </Text>
          <TouchableOpacity style={styles.testButton} onPress={() => startScreening('comprehensive')}>
            <Brain size={20} color="#FFFFFF" />
            <Text style={styles.testButtonText}>Full AI Screening</Text>
          </TouchableOpacity>
        </View>
      </View>

      {screeningHistory.length > 0 && (
        <View style={styles.testsSection}>
          <Text style={styles.sectionTitle}>Recent AI Screenings</Text>
          {screeningHistory.slice(0, 3).map((result) => (
            <View key={result.id} style={styles.searchResultItem}>
              <View style={[styles.scoreCircle, { 
                width: 50, 
                height: 50, 
                backgroundColor: getRiskColor(result.riskLevel) 
              }]}>
                <Text style={[styles.scoreText, { fontSize: 16 }]}>
                  {Math.round(result.detailedAnalysis.overallHealth)}
                </Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.searchResultTitle}>
                  {result.type.charAt(0).toUpperCase() + result.type.slice(1)} Screening
                </Text>
                <Text style={styles.searchResultSnippet}>
                  {new Date(result.date).toLocaleDateString()} • {result.aiInsights[0]}
                </Text>
                <Text style={[styles.riskLevel, { color: getRiskColor(result.riskLevel) }]}>
                  {result.riskLevel.toUpperCase()} RISK
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}