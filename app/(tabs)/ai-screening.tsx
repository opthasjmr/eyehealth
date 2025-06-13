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
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
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
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

interface ScreeningResult {
  id: string;
  date: string;
  type: 'pupil' | 'blink' | 'tracking' | 'comprehensive';
  score: number;
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
  aiConfidence: number;
  details: {
    pupilResponse?: number;
    blinkRate?: number;
    trackingAccuracy?: number;
    overallHealth?: number;
  };
}

interface AIAnalysis {
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
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis>({
    isAnalyzing: false,
    progress: 0,
    currentStep: '',
    result: null,
  });

  // Animations
  const scanAnimation = useSharedValue(0);
  const progressAnimation = useSharedValue(0);
  const pulseAnimation = useSharedValue(1);

  useEffect(() => {
    loadScreeningHistory();
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
      const history = await AsyncStorage.getItem('screeningHistory');
      if (history) {
        setScreeningHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error('Error loading screening history:', error);
    }
  };

  const saveScreeningResult = async (result: ScreeningResult) => {
    try {
      const updatedHistory = [result, ...screeningHistory];
      await AsyncStorage.setItem('screeningHistory', JSON.stringify(updatedHistory));
      setScreeningHistory(updatedHistory);
    } catch (error) {
      console.error('Error saving screening result:', error);
    }
  };

  const simulateAIAnalysis = async (testType: string): Promise<ScreeningResult> => {
    const steps = [
      'Initializing AI models...',
      'Analyzing eye movement patterns...',
      'Processing pupil response data...',
      'Evaluating blink patterns...',
      'Calculating risk assessment...',
      'Generating recommendations...',
      'Finalizing analysis...',
    ];

    setAiAnalysis(prev => ({ ...prev, isAnalyzing: true, progress: 0 }));

    for (let i = 0; i < steps.length; i++) {
      setAiAnalysis(prev => ({
        ...prev,
        currentStep: steps[i],
        progress: ((i + 1) / steps.length) * 100,
      }));
      progressAnimation.value = withTiming(((i + 1) / steps.length) * 100, { duration: 500 });
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Simulate AI analysis results
    const baseScore = 70 + Math.random() * 25;
    const riskLevel = baseScore > 85 ? 'low' : baseScore > 70 ? 'medium' : 'high';
    
    const result: ScreeningResult = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      type: testType as any,
      score: Math.round(baseScore),
      riskLevel,
      aiConfidence: 85 + Math.random() * 10,
      recommendations: generateRecommendations(riskLevel, testType),
      details: {
        pupilResponse: 75 + Math.random() * 20,
        blinkRate: 15 + Math.random() * 10,
        trackingAccuracy: 80 + Math.random() * 15,
        overallHealth: baseScore,
      },
    };

    setAiAnalysis(prev => ({ ...prev, isAnalyzing: false, result }));
    return result;
  };

  const generateRecommendations = (riskLevel: string, testType: string): string[] => {
    const baseRecommendations = [
      'Follow the 20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds',
      'Ensure proper lighting when using digital devices',
      'Maintain proper distance from screens (20-24 inches)',
      'Take regular breaks from screen time',
    ];

    const riskSpecificRecommendations = {
      high: [
        'Schedule an appointment with an eye care professional',
        'Consider reducing screen time significantly',
        'Use artificial tears if experiencing dry eyes',
        'Implement blue light filtering on all devices',
      ],
      medium: [
        'Monitor symptoms and track changes',
        'Increase frequency of eye exercises',
        'Consider computer glasses with anti-reflective coating',
        'Improve workspace ergonomics',
      ],
      low: [
        'Continue current eye care routine',
        'Maintain regular eye exercise schedule',
        'Stay hydrated to support eye health',
        'Consider annual eye exams',
      ],
    };

    return [...baseRecommendations, ...riskSpecificRecommendations[riskLevel as keyof typeof riskSpecificRecommendations]];
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
      const result = await simulateAIAnalysis(testType);
      await saveScreeningResult(result);
      
      if (user) {
        await updateStats({
          totalExercises: (user.stats.totalExercises || 0) + 1,
        });
      }
    }, 5000);
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
    historySection: {
      padding: 16,
    },
    historyItem: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
    },
    historyInfo: {
      flex: 1,
      marginLeft: 12,
    },
    historyDate: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    historyType: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginTop: 2,
    },
    historyScore: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.primary,
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
  });

  if (aiAnalysis.result) {
    const result = aiAnalysis.result;
    return (
      <ScrollView style={styles.container}>
        <View style={styles.resultContainer}>
          <View style={styles.resultHeader}>
            <View style={[styles.scoreCircle, { backgroundColor: getRiskColor(result.riskLevel) }]}>
              <Text style={styles.scoreText}>{result.score}</Text>
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
              <Text style={styles.detailValue}>{Math.round(result.aiConfidence)}%</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Pupil Response</Text>
              <Text style={styles.detailValue}>{Math.round(result.details.pupilResponse || 0)}%</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Blink Rate</Text>
              <Text style={styles.detailValue}>{Math.round(result.details.blinkRate || 0)}/min</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Tracking Accuracy</Text>
              <Text style={styles.detailValue}>{Math.round(result.details.trackingAccuracy || 0)}%</Text>
            </View>
          </View>

          <View style={styles.recommendationsSection}>
            <Text style={styles.sectionTitle}>AI Recommendations</Text>
            {result.recommendations.map((recommendation, index) => (
              <View key={index} style={styles.recommendationItem}>
                <CheckCircle size={16} color={theme.colors.success} />
                <Text style={styles.recommendationText}>{recommendation}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity 
            style={styles.newTestButton} 
            onPress={() => {
              setAiAnalysis(prev => ({ ...prev, result: null }));
              setSelectedTest(null);
            }}
          >
            <Text style={styles.newTestButtonText}>Take Another Test</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  if (aiAnalysis.isAnalyzing) {
    return (
      <View style={styles.analysisContainer}>
        <Animated.View style={pulseAnimatedStyle}>
          <Brain size={64} color={theme.colors.primary} />
        </Animated.View>
        <Text style={styles.analysisTitle}>AI Analysis in Progress</Text>
        <View style={styles.progressContainer}>
          <Animated.View style={[styles.progressBar, progressAnimatedStyle]} />
        </View>
        <Text style={styles.analysisStep}>{aiAnalysis.currentStep}</Text>
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
          Advanced AI-powered analysis for early detection and personalized recommendations
        </Text>
        
        <View style={styles.aiFeatures}>
          <View style={styles.feature}>
            <Brain size={24} color={theme.colors.primary} />
            <Text style={styles.featureText}>AI Analysis</Text>
          </View>
          <View style={styles.feature}>
            <Shield size={24} color={theme.colors.success} />
            <Text style={styles.featureText}>Early Detection</Text>
          </View>
          <View style={styles.feature}>
            <Target size={24} color={theme.colors.warning} />
            <Text style={styles.featureText}>Personalized</Text>
          </View>
          <View style={styles.feature}>
            <TrendingUp size={24} color={theme.colors.accent} />
            <Text style={styles.featureText}>Progress Tracking</Text>
          </View>
        </View>
      </View>

      <View style={styles.testsSection}>
        <Text style={styles.sectionTitle}>Available Screenings</Text>
        
        <View style={styles.testCard}>
          <View style={styles.testHeader}>
            <Eye size={32} color={theme.colors.primary} style={styles.testIcon} />
            <Text style={styles.testTitle}>Pupil Response Test</Text>
          </View>
          <Text style={styles.testDescription}>
            AI analyzes pupil dilation and response to light changes to detect potential neurological or eye health issues.
          </Text>
          <TouchableOpacity style={styles.testButton} onPress={() => startScreening('pupil')}>
            <Brain size={20} color="#FFFFFF" />
            <Text style={styles.testButtonText}>Start Pupil Analysis</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.testCard}>
          <View style={styles.testHeader}>
            <Activity size={32} color={theme.colors.primary} style={styles.testIcon} />
            <Text style={styles.testTitle}>Blink Pattern Analysis</Text>
          </View>
          <Text style={styles.testDescription}>
            Advanced monitoring of blink frequency and patterns to identify dry eye syndrome and screen fatigue.
          </Text>
          <TouchableOpacity style={styles.testButton} onPress={() => startScreening('blink')}>
            <Brain size={20} color="#FFFFFF" />
            <Text style={styles.testButtonText}>Analyze Blink Patterns</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.testCard}>
          <View style={styles.testHeader}>
            <Target size={32} color={theme.colors.primary} style={styles.testIcon} />
            <Text style={styles.testTitle}>Eye Tracking Assessment</Text>
          </View>
          <Text style={styles.testDescription}>
            Evaluates smooth pursuit and saccadic eye movements to assess visual tracking abilities and coordination.
          </Text>
          <TouchableOpacity style={styles.testButton} onPress={() => startScreening('tracking')}>
            <Brain size={20} color="#FFFFFF" />
            <Text style={styles.testButtonText}>Test Eye Tracking</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.testCard}>
          <View style={styles.testHeader}>
            <Zap size={32} color={theme.colors.primary} style={styles.testIcon} />
            <Text style={styles.testTitle}>Comprehensive Screening</Text>
          </View>
          <Text style={styles.testDescription}>
            Complete AI-powered assessment combining all tests for a thorough evaluation of your eye health.
          </Text>
          <TouchableOpacity style={styles.testButton} onPress={() => startScreening('comprehensive')}>
            <Brain size={20} color="#FFFFFF" />
            <Text style={styles.testButtonText}>Full AI Screening</Text>
          </TouchableOpacity>
        </View>
      </View>

      {screeningHistory.length > 0 && (
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Recent Screenings</Text>
          {screeningHistory.slice(0, 5).map((result) => (
            <View key={result.id} style={styles.historyItem}>
              <View style={[styles.scoreCircle, { 
                width: 50, 
                height: 50, 
                backgroundColor: getRiskColor(result.riskLevel) 
              }]}>
                <Text style={[styles.scoreText, { fontSize: 16 }]}>{result.score}</Text>
              </View>
              <View style={styles.historyInfo}>
                <Text style={styles.historyDate}>
                  {new Date(result.date).toLocaleDateString()}
                </Text>
                <Text style={styles.historyType}>
                  {result.type.charAt(0).toUpperCase() + result.type.slice(1)} Screening
                </Text>
              </View>
              <Text style={[styles.riskLevel, { color: getRiskColor(result.riskLevel) }]}>
                {result.riskLevel.toUpperCase()}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}