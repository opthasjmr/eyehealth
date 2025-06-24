import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Upload, FileImage, X, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, Eye, Brain, FileText, Download, Share, Clock, Target, TrendingUp } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { usePatients } from '@/contexts/PatientContext';

const { width } = Dimensions.get('window');

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uri: string;
  status: 'uploading' | 'uploaded' | 'analyzing' | 'completed' | 'error';
  progress: number;
}

interface AnalysisResult {
  id: string;
  fileId: string;
  condition: string;
  severity: 'Normal' | 'Mild' | 'Moderate' | 'Severe';
  confidence: number;
  findings: string[];
  recommendations: string[];
  riskLevel: 'Low' | 'Medium' | 'High';
  processingTime: number;
  annotations: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    label: string;
    confidence: number;
  }>;
}

export default function UploadScreen() {
  const { theme } = useTheme();
  const { addAnalysis } = usePatients();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

  // Mock file upload simulation
  const simulateFileUpload = useCallback((file: UploadedFile) => {
    const updateProgress = (progress: number) => {
      setFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, progress, status: progress === 100 ? 'uploaded' : 'uploading' } : f
      ));
    };

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      updateProgress(progress);
    }, 200);
  }, []);

  // Mock AI analysis simulation
  const simulateAIAnalysis = useCallback(async (fileId: string): Promise<AnalysisResult> => {
    const steps = [
      'Initializing AI models...',
      'Preprocessing image data...',
      'Running deep learning analysis...',
      'Detecting anatomical structures...',
      'Identifying pathological features...',
      'Calculating confidence scores...',
      'Generating clinical report...',
    ];

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(steps[i]);
      setAnalysisProgress(((i + 1) / steps.length) * 100);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    // Mock analysis results
    const conditions = [
      'Diabetic Retinopathy',
      'Glaucoma Suspect',
      'Age-related Macular Degeneration',
      'Hypertensive Retinopathy',
      'Normal Retina',
    ];

    const severities: Array<'Normal' | 'Mild' | 'Moderate' | 'Severe'> = ['Normal', 'Mild', 'Moderate', 'Severe'];
    const riskLevels: Array<'Low' | 'Medium' | 'High'> = ['Low', 'Medium', 'High'];

    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const confidence = 85 + Math.random() * 10;
    const riskLevel = riskLevels[Math.floor(Math.random() * riskLevels.length)];

    const result: AnalysisResult = {
      id: Date.now().toString(),
      fileId,
      condition,
      severity,
      confidence: Math.round(confidence),
      riskLevel,
      processingTime: 2.3,
      findings: [
        'Microaneurysms detected in superior temporal quadrant',
        'Mild dot and blot hemorrhages present',
        'No signs of macular edema',
        'Optic disc appears normal',
      ],
      recommendations: [
        'Follow-up in 6 months',
        'Continue current diabetes management',
        'Consider fluorescein angiography if progression noted',
        'Patient education on diabetic eye disease',
      ],
      annotations: [
        { x: 120, y: 80, width: 30, height: 30, label: 'Microaneurysm', confidence: 92 },
        { x: 200, y: 150, width: 25, height: 25, label: 'Hemorrhage', confidence: 88 },
      ],
    };

    setIsAnalyzing(false);
    return result;
  }, []);

  const handleFileSelect = () => {
    // Simulate file selection
    const mockFiles = [
      {
        id: Date.now().toString(),
        name: 'fundus_image_001.jpg',
        size: 2.4 * 1024 * 1024,
        type: 'image/jpeg',
        uri: 'https://images.pexels.com/photos/5752242/pexels-photo-5752242.jpeg?auto=compress&cs=tinysrgb&w=800',
        status: 'uploading' as const,
        progress: 0,
      },
    ];

    setFiles(prev => [...prev, ...mockFiles]);
    mockFiles.forEach(simulateFileUpload);
  };

  const handleAnalyze = async () => {
    const uploadedFiles = files.filter(f => f.status === 'uploaded');
    if (uploadedFiles.length === 0) {
      Alert.alert('No Files', 'Please upload files before analyzing');
      return;
    }

    try {
      const results: AnalysisResult[] = [];
      
      for (const file of uploadedFiles) {
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, status: 'analyzing' } : f
        ));

        const result = await simulateAIAnalysis(file.id);
        results.push(result);

        setFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, status: 'completed' } : f
        ));
      }

      setAnalysisResults(results);
      
      // Add to patient context
      results.forEach(result => {
        addAnalysis({
          id: result.id,
          patientId: selectedPatient || 'unknown',
          fileId: result.fileId,
          condition: result.condition,
          severity: result.severity,
          confidence: result.confidence,
          date: new Date().toISOString(),
          findings: result.findings,
          recommendations: result.recommendations,
        });
      });

    } catch (error) {
      Alert.alert('Analysis Error', 'Failed to analyze images. Please try again.');
    }
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    setAnalysisResults(prev => prev.filter(r => r.fileId !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Normal': return theme.colors.success;
      case 'Mild': return theme.colors.warning;
      case 'Moderate': return '#FF8C00';
      case 'Severe': return theme.colors.error;
      default: return theme.colors.textSecondary;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return theme.colors.success;
      case 'Medium': return theme.colors.warning;
      case 'High': return theme.colors.error;
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
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    title: {
      fontSize: 28,
      fontFamily: 'Inter-Bold',
      color: theme.colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
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
    uploadArea: {
      borderWidth: 2,
      borderColor: theme.colors.border,
      borderStyle: 'dashed',
      borderRadius: 12,
      padding: 40,
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
    },
    uploadAreaActive: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary + '10',
    },
    uploadIcon: {
      marginBottom: 16,
    },
    uploadText: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    uploadSubtext: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: 20,
    },
    uploadButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
    },
    uploadButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
    },
    filesList: {
      gap: 12,
    },
    fileCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    fileIcon: {
      marginRight: 12,
    },
    fileInfo: {
      flex: 1,
    },
    fileName: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.text,
      marginBottom: 4,
    },
    fileDetails: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    fileSize: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    fileStatus: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 10,
    },
    statusUploading: {
      backgroundColor: theme.colors.warning,
      color: '#FFFFFF',
    },
    statusUploaded: {
      backgroundColor: theme.colors.success,
      color: '#FFFFFF',
    },
    statusAnalyzing: {
      backgroundColor: theme.colors.primary,
      color: '#FFFFFF',
    },
    statusCompleted: {
      backgroundColor: theme.colors.success,
      color: '#FFFFFF',
    },
    statusError: {
      backgroundColor: theme.colors.error,
      color: '#FFFFFF',
    },
    progressBar: {
      height: 4,
      backgroundColor: theme.colors.background,
      borderRadius: 2,
      marginTop: 8,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: theme.colors.primary,
    },
    removeButton: {
      padding: 8,
    },
    analyzeButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    analyzeButtonDisabled: {
      opacity: 0.6,
    },
    analyzeButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      marginLeft: 8,
    },
    analysisProgress: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 24,
      alignItems: 'center',
      marginBottom: 24,
    },
    progressTitle: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.text,
      marginBottom: 16,
    },
    progressIndicator: {
      marginBottom: 16,
    },
    progressText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    progressPercentage: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: theme.colors.primary,
      marginTop: 8,
    },
    resultsContainer: {
      gap: 20,
    },
    resultCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 20,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 5,
    },
    resultHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    resultTitle: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: theme.colors.text,
    },
    confidenceScore: {
      alignItems: 'center',
    },
    confidence: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: theme.colors.success,
    },
    confidenceLabel: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    resultDetails: {
      marginBottom: 20,
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    detailLabel: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    detailValue: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.text,
    },
    severityBadge: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
    },
    severityText: {
      fontSize: 12,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
    },
    findingsSection: {
      marginBottom: 20,
    },
    findingsTitle: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.text,
      marginBottom: 12,
    },
    findingItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    findingText: {
      fontSize: 14,
      color: theme.colors.text,
      marginLeft: 8,
      flex: 1,
      lineHeight: 20,
    },
    recommendationsSection: {
      marginBottom: 20,
    },
    recommendationItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    recommendationText: {
      fontSize: 14,
      color: theme.colors.text,
      marginLeft: 8,
      flex: 1,
      lineHeight: 20,
    },
    imagePreview: {
      width: '100%',
      height: 200,
      borderRadius: 8,
      marginBottom: 16,
    },
    actionButtons: {
      flexDirection: 'row',
      gap: 12,
    },
    actionButton: {
      flex: 1,
      backgroundColor: theme.colors.background,
      borderRadius: 8,
      paddingVertical: 12,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    actionButtonPrimary: {
      backgroundColor: theme.colors.primary,
    },
    actionButtonText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: theme.colors.text,
      marginLeft: 6,
    },
    actionButtonTextPrimary: {
      color: '#FFFFFF',
    },
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Upload & Analyze</Text>
        <Text style={styles.subtitle}>
          Upload retinal images for AI-powered diagnostic analysis
        </Text>
      </View>

      <View style={styles.content}>
        {/* Upload Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upload Images</Text>
          <TouchableOpacity
            style={[styles.uploadArea, files.length > 0 && styles.uploadAreaActive]}
            onPress={handleFileSelect}
          >
            <Upload size={48} color={theme.colors.primary} style={styles.uploadIcon} />
            <Text style={styles.uploadText}>Drop files here or click to upload</Text>
            <Text style={styles.uploadSubtext}>
              Supports JPEG, PNG, DICOM files up to 50MB
            </Text>
            <View style={styles.uploadButton}>
              <Text style={styles.uploadButtonText}>Select Files</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Files List */}
        {files.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Uploaded Files</Text>
            <View style={styles.filesList}>
              {files.map((file) => (
                <View key={file.id} style={styles.fileCard}>
                  <FileImage size={24} color={theme.colors.primary} style={styles.fileIcon} />
                  <View style={styles.fileInfo}>
                    <Text style={styles.fileName}>{file.name}</Text>
                    <View style={styles.fileDetails}>
                      <Text style={styles.fileSize}>{formatFileSize(file.size)}</Text>
                      <Text style={[
                        styles.fileStatus,
                        styles[`status${file.status.charAt(0).toUpperCase() + file.status.slice(1)}` as keyof typeof styles]
                      ]}>
                        {file.status.charAt(0).toUpperCase() + file.status.slice(1)}
                      </Text>
                    </View>
                    {file.status === 'uploading' && (
                      <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${file.progress}%` }]} />
                      </View>
                    )}
                  </View>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeFile(file.id)}
                  >
                    <X size={20} color={theme.colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Analyze Button */}
        {files.some(f => f.status === 'uploaded') && (
          <View style={styles.section}>
            <TouchableOpacity
              style={[styles.analyzeButton, isAnalyzing && styles.analyzeButtonDisabled]}
              onPress={handleAnalyze}
              disabled={isAnalyzing}
            >
              <Brain size={20} color="#FFFFFF" />
              <Text style={styles.analyzeButtonText}>
                {isAnalyzing ? 'Analyzing...' : 'Start AI Analysis'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Analysis Progress */}
        {isAnalyzing && (
          <View style={styles.analysisProgress}>
            <Text style={styles.progressTitle}>AI Analysis in Progress</Text>
            <ActivityIndicator size="large" color={theme.colors.primary} style={styles.progressIndicator} />
            <Text style={styles.progressText}>{currentStep}</Text>
            <Text style={styles.progressPercentage}>{Math.round(analysisProgress)}%</Text>
          </View>
        )}

        {/* Analysis Results */}
        {analysisResults.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Analysis Results</Text>
            <View style={styles.resultsContainer}>
              {analysisResults.map((result) => {
                const file = files.find(f => f.id === result.fileId);
                return (
                  <View key={result.id} style={styles.resultCard}>
                    <View style={styles.resultHeader}>
                      <Text style={styles.resultTitle}>{result.condition}</Text>
                      <View style={styles.confidenceScore}>
                        <Text style={styles.confidence}>{result.confidence}%</Text>
                        <Text style={styles.confidenceLabel}>Confidence</Text>
                      </View>
                    </View>

                    {file && (
                      <Image source={{ uri: file.uri }} style={styles.imagePreview} resizeMode="cover" />
                    )}

                    <View style={styles.resultDetails}>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Severity</Text>
                        <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(result.severity) }]}>
                          <Text style={styles.severityText}>{result.severity}</Text>
                        </View>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Risk Level</Text>
                        <View style={[styles.severityBadge, { backgroundColor: getRiskColor(result.riskLevel) }]}>
                          <Text style={styles.severityText}>{result.riskLevel}</Text>
                        </View>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Processing Time</Text>
                        <Text style={styles.detailValue}>{result.processingTime}s</Text>
                      </View>
                    </View>

                    <View style={styles.findingsSection}>
                      <Text style={styles.findingsTitle}>Key Findings</Text>
                      {result.findings.map((finding, index) => (
                        <View key={index} style={styles.findingItem}>
                          <Target size={12} color={theme.colors.primary} />
                          <Text style={styles.findingText}>{finding}</Text>
                        </View>
                      ))}
                    </View>

                    <View style={styles.recommendationsSection}>
                      <Text style={styles.findingsTitle}>Recommendations</Text>
                      {result.recommendations.map((recommendation, index) => (
                        <View key={index} style={styles.recommendationItem}>
                          <CheckCircle size={12} color={theme.colors.success} />
                          <Text style={styles.recommendationText}>{recommendation}</Text>
                        </View>
                      ))}
                    </View>

                    <View style={styles.actionButtons}>
                      <TouchableOpacity style={styles.actionButton}>
                        <Download size={16} color={theme.colors.text} />
                        <Text style={styles.actionButtonText}>Download</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.actionButton}>
                        <Share size={16} color={theme.colors.text} />
                        <Text style={styles.actionButtonText}>Share</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.actionButton, styles.actionButtonPrimary]}>
                        <FileText size={16} color="#FFFFFF" />
                        <Text style={[styles.actionButtonText, styles.actionButtonTextPrimary]}>
                          Generate Report
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}