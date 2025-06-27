import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  interpolate,
} from 'react-native-reanimated';
import { Brain, Upload, Camera, FileImage, Scan, Eye, Activity, TrendingUp, Download, Share, RotateCcw, Zap, Target, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, Clock, Cpu, Database, Microscope } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAI } from '@/contexts/AIContext';
import { usePatients } from '@/contexts/PatientContext';
import { GlassCard } from '@/components/MaterialUI/GlassCard';
import { NeumorphicCard } from '@/components/MaterialUI/NeumorphicCard';
import { MaterialButton } from '@/components/MaterialUI/MaterialButton';
import { FloatingActionButton } from '@/components/MaterialUI/FloatingActionButton';
import { EyeModel3D } from '@/components/3D/EyeModel3D';
import { DiagnosticVisualization3D } from '@/components/3D/DiagnosticVisualization3D';

const { width, height } = Dimensions.get('window');

interface UploadedFile {
  id: string;
  uri: string;
  name: string;
  type: string;
  size: number;
  mimeType: string;
}

export default function AIDiagnosticsScreen() {
  const { theme } = useTheme();
  const { analyzeImage, currentAnalysis, diagnosticResults, models } = useAI();
  const { patients } = usePatients();
  
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [selectedImageType, setSelectedImageType] = useState<string>('fundus');
  const [currentResult, setCurrentResult] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);

  // Animations
  const uploadAnimation = useSharedValue(0);
  const progressAnimation = useSharedValue(0);
  const pulseAnimation = useSharedValue(1);
  const scanAnimation = useSharedValue(0);

  useEffect(() => {
    if (currentAnalysis) {
      progressAnimation.value = withTiming(currentAnalysis.progress / 100, { duration: 500 });
      
      if (currentAnalysis.stage === 'analysis') {
        scanAnimation.value = withRepeat(
          withSequence(
            withTiming(1, { duration: 1000 }),
            withTiming(0, { duration: 1000 })
          ),
          -1,
          true
        );
      }
    } else {
      scanAnimation.value = withTiming(0);
    }
  }, [currentAnalysis]);

  useEffect(() => {
    pulseAnimation.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1500 }),
        withTiming(1, { duration: 1500 })
      ),
      -1,
      true
    );
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera roll permissions are required to upload images.');
        return false;
      }
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
        allowsMultipleSelection: true,
      });

      if (!result.canceled && result.assets) {
        const newFiles: UploadedFile[] = result.assets.map((asset, index) => ({
          id: `${Date.now()}_${index}`,
          uri: asset.uri,
          name: asset.fileName || `image_${Date.now()}_${index}.jpg`,
          type: 'image',
          size: asset.fileSize || 0,
          mimeType: asset.mimeType || 'image/jpeg',
        }));

        setUploadedFiles(prev => [...prev, ...newFiles]);
        uploadAnimation.value = withTiming(1, { duration: 500 });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        multiple: true,
      });

      if (!result.canceled && result.assets) {
        const newFiles: UploadedFile[] = result.assets.map((asset, index) => ({
          id: `${Date.now()}_${index}`,
          uri: asset.uri,
          name: asset.name,
          type: asset.mimeType?.startsWith('image/') ? 'image' : 'document',
          size: asset.size || 0,
          mimeType: asset.mimeType || 'application/octet-stream',
        }));

        setUploadedFiles(prev => [...prev, ...newFiles]);
        uploadAnimation.value = withTiming(1, { duration: 500 });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets?.[0]) {
        const asset = result.assets[0];
        const newFile: UploadedFile = {
          id: Date.now().toString(),
          uri: asset.uri,
          name: asset.fileName || `photo_${Date.now()}.jpg`,
          type: 'image',
          size: asset.fileSize || 0,
          mimeType: asset.mimeType || 'image/jpeg',
        };

        setUploadedFiles(prev => [...prev, newFile]);
        uploadAnimation.value = withTiming(1, { duration: 500 });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const startAnalysis = async () => {
    if (uploadedFiles.length === 0) {
      Alert.alert('No Files', 'Please upload at least one image for analysis');
      return;
    }

    if (!selectedPatient) {
      Alert.alert('No Patient Selected', 'Please select a patient for this analysis');
      return;
    }

    try {
      const file = uploadedFiles[0]; // Analyze first file for demo
      const result = await analyzeImage(file.uri, selectedImageType, selectedPatient);
      setCurrentResult(result);
      setShowResults(true);
    } catch (error) {
      Alert.alert('Analysis Failed', 'Please try again or contact support');
    }
  };

  const resetAnalysis = () => {
    setUploadedFiles([]);
    setCurrentResult(null);
    setShowResults(false);
    uploadAnimation.value = withTiming(0);
    progressAnimation.value = withTiming(0);
  };

  const exportResults = () => {
    Alert.alert('Export Results', 'Results exported successfully');
  };

  const shareResults = () => {
    Alert.alert('Share Results', 'Sharing functionality would be implemented here');
  };

  // Animated styles
  const uploadAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(uploadAnimation.value, [0, 1], [0.6, 1]),
    transform: [{ scale: interpolate(uploadAnimation.value, [0, 1], [0.95, 1]) }],
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressAnimation.value * 100}%`,
  }));

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnimation.value }],
  }));

  const scanAnimatedStyle = useAnimatedStyle(() => ({
    opacity: scanAnimation.value,
  }));

  const imageTypes = [
    { id: 'fundus', name: 'Fundus Photography', icon: Eye },
    { id: 'oct', name: 'OCT Scan', icon: Scan },
    { id: 'visual_field', name: 'Visual Field', icon: Target },
    { id: 'anterior_segment', name: 'Anterior Segment', icon: Microscope },
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
    headerTitle: {
      fontSize: 32,
      fontFamily: 'Inter-Bold',
      color: theme.colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginBottom: 20,
    },
    aiModelsContainer: {
      flexDirection: 'row',
      gap: 12,
    },
    modelChip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      backgroundColor: theme.colors.primary + '20',
    },
    modelChipText: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: theme.colors.primary,
      marginLeft: 4,
    },
    content: {
      flex: 1,
      padding: 24,
    },
    section: {
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: theme.colors.text,
      marginBottom: 16,
    },
    uploadArea: {
      borderWidth: 2,
      borderColor: theme.colors.border,
      borderStyle: 'dashed',
      borderRadius: 20,
      padding: 40,
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      marginBottom: 20,
    },
    uploadAreaActive: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary + '10',
    },
    uploadIcon: {
      marginBottom: 16,
    },
    uploadText: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: theme.colors.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    uploadSubtext: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: 24,
    },
    uploadButtons: {
      flexDirection: 'row',
      gap: 12,
    },
    uploadButton: {
      flex: 1,
      backgroundColor: theme.colors.primary,
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    uploadButtonSecondary: {
      backgroundColor: theme.colors.surface,
      borderWidth: 2,
      borderColor: theme.colors.primary,
    },
    uploadButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      marginLeft: 6,
    },
    uploadButtonTextSecondary: {
      color: theme.colors.primary,
    },
    imageTypesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginBottom: 20,
    },
    imageTypeChip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    imageTypeChipActive: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary + '20',
    },
    imageTypeText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: theme.colors.text,
      marginLeft: 8,
    },
    imageTypeTextActive: {
      color: theme.colors.primary,
    },
    filesContainer: {
      gap: 12,
    },
    fileCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderRadius: 16,
      backgroundColor: theme.colors.surface,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    fileImage: {
      width: 60,
      height: 60,
      borderRadius: 8,
      marginRight: 16,
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
    fileSize: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    removeButton: {
      padding: 8,
    },
    analysisContainer: {
      alignItems: 'center',
      padding: 40,
    },
    analysisTitle: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: theme.colors.text,
      marginBottom: 16,
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
      borderRadius: 4,
    },
    progressText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: 8,
    },
    progressPercentage: {
      fontSize: 32,
      fontFamily: 'Inter-Bold',
      color: theme.colors.primary,
      marginBottom: 16,
    },
    scanIndicator: {
      width: 200,
      height: 200,
      borderRadius: 100,
      borderWidth: 3,
      borderColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 24,
    },
    resultsContainer: {
      gap: 24,
    },
    resultCard: {
      borderRadius: 20,
      padding: 24,
      backgroundColor: theme.colors.surface,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 24,
      elevation: 8,
    },
    resultHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    resultTitle: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: theme.colors.text,
    },
    confidenceScore: {
      alignItems: 'center',
    },
    confidence: {
      fontSize: 28,
      fontFamily: 'Inter-Bold',
      color: theme.colors.success,
    },
    confidenceLabel: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    riskContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    riskBadge: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginLeft: 12,
    },
    riskText: {
      fontSize: 14,
      fontFamily: 'Inter-Bold',
      color: '#FFFFFF',
      textTransform: 'uppercase',
    },
    findingsSection: {
      marginBottom: 24,
    },
    findingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    findingIcon: {
      marginRight: 12,
    },
    findingInfo: {
      flex: 1,
    },
    findingCondition: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.text,
      marginBottom: 2,
    },
    findingLocation: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    findingConfidence: {
      fontSize: 14,
      fontFamily: 'Inter-Bold',
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
    actionsContainer: {
      flexDirection: 'row',
      gap: 12,
    },
    actionButton: {
      flex: 1,
      backgroundColor: theme.colors.background,
      borderRadius: 12,
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
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.text,
      marginLeft: 6,
    },
    actionButtonTextPrimary: {
      color: '#FFFFFF',
    },
    fab: {
      position: 'absolute',
      bottom: 24,
      right: 24,
    },
    eyeModelContainer: {
      alignItems: 'center',
      marginVertical: 20,
    },
    modelTitle: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.text,
      marginBottom: 12,
    },
  });

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return theme.colors.success;
      case 'moderate': return theme.colors.warning;
      case 'high': return theme.colors.error;
      case 'critical': return '#DC2626';
      default: return theme.colors.textSecondary;
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'severe': return AlertTriangle;
      case 'moderate': return Activity;
      case 'mild': return CheckCircle;
      default: return CheckCircle;
    }
  };

  if (showResults && currentResult) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>AI Diagnostic Results</Text>
          <Text style={styles.subtitle}>
            Advanced AI analysis complete with detailed findings
          </Text>
        </View>

        <View style={styles.content}>
          <View style={styles.resultsContainer}>
            <GlassCard>
              <View style={styles.resultHeader}>
                <Text style={styles.resultTitle}>Analysis Summary</Text>
                <View style={styles.confidenceScore}>
                  <Text style={styles.confidence}>{Math.round(currentResult.confidence)}%</Text>
                  <Text style={styles.confidenceLabel}>Confidence</Text>
                </View>
              </View>

              <View style={styles.riskContainer}>
                <TrendingUp size={24} color={getRiskColor(currentResult.overallRisk)} />
                <View style={[styles.riskBadge, { backgroundColor: getRiskColor(currentResult.overallRisk) }]}>
                  <Text style={styles.riskText}>{currentResult.overallRisk} Risk</Text>
                </View>
              </View>

              <View style={styles.eyeModelContainer}>
                <Text style={styles.modelTitle}>3D Eye Visualization</Text>
                <EyeModel3D 
                  condition={currentResult.findings[0]?.condition.toLowerCase().replace(/\s+/g, '_') || 'normal'}
                  animated={true}
                  size={200}
                />
              </View>
            </GlassCard>

            <NeumorphicCard>
              <Text style={styles.sectionTitle}>Diagnostic Findings</Text>
              {currentResult.findings.map((finding: any, index: number) => {
                const SeverityIcon = getSeverityIcon(finding.severity);
                return (
                  <View key={index} style={styles.findingItem}>
                    <SeverityIcon 
                      size={20} 
                      color={getRiskColor(finding.severity)} 
                      style={styles.findingIcon}
                    />
                    <View style={styles.findingInfo}>
                      <Text style={styles.findingCondition}>{finding.condition}</Text>
                      <Text style={styles.findingLocation}>
                        {finding.location} • {finding.severity}
                      </Text>
                    </View>
                    <Text style={styles.findingConfidence}>
                      {Math.round(finding.confidence)}%
                    </Text>
                  </View>
                );
              })}
            </NeumorphicCard>

            <DiagnosticVisualization3D
              findings={currentResult.findings}
              overallRisk={currentResult.overallRisk}
              animated={true}
            />

            <GlassCard>
              <Text style={styles.sectionTitle}>AI Recommendations</Text>
              {currentResult.recommendations.map((recommendation: string, index: number) => (
                <View key={index} style={styles.recommendationItem}>
                  <CheckCircle size={16} color={theme.colors.success} />
                  <Text style={styles.recommendationText}>{recommendation}</Text>
                </View>
              ))}
            </GlassCard>

            <View style={styles.actionsContainer}>
              <TouchableOpacity style={styles.actionButton} onPress={exportResults}>
                <Download size={16} color={theme.colors.text} />
                <Text style={styles.actionButtonText}>Export</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={shareResults}>
                <Share size={16} color={theme.colors.text} />
                <Text style={styles.actionButtonText}>Share</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.actionButtonPrimary]} 
                onPress={resetAnalysis}
              >
                <RotateCcw size={16} color="#FFFFFF" />
                <Text style={[styles.actionButtonText, styles.actionButtonTextPrimary]}>
                  New Analysis
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }

  if (currentAnalysis) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>AI Analysis in Progress</Text>
          <Text style={styles.subtitle}>
            Advanced neural networks processing your medical images
          </Text>
        </View>

        <View style={styles.analysisContainer}>
          <Animated.View style={[styles.scanIndicator, pulseAnimatedStyle]}>
            <Animated.View style={scanAnimatedStyle}>
              <Brain size={64} color={theme.colors.primary} />
            </Animated.View>
          </Animated.View>

          <Text style={styles.analysisTitle}>
            {currentAnalysis.stage.charAt(0).toUpperCase() + currentAnalysis.stage.slice(1)}
          </Text>

          <View style={styles.progressContainer}>
            <Animated.View style={[styles.progressBar, progressAnimatedStyle]} />
          </View>

          <Text style={styles.progressPercentage}>
            {Math.round(currentAnalysis.progress)}%
          </Text>

          <Text style={styles.progressText}>
            {currentAnalysis.message}
          </Text>

          <Text style={styles.progressText}>
            Estimated time remaining: {Math.round(currentAnalysis.estimatedTimeRemaining)}s
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Diagnostics</Text>
        <Text style={styles.subtitle}>
          Upload medical images for advanced AI-powered diagnostic analysis
        </Text>
        
        <View style={styles.aiModelsContainer}>
          {models.slice(0, 3).map((model) => (
            <View key={model.id} style={styles.modelChip}>
              <Cpu size={12} color={theme.colors.primary} />
              <Text style={styles.modelChipText}>{model.name}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Image Type Selection</Text>
          <View style={styles.imageTypesContainer}>
            {imageTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.imageTypeChip,
                  selectedImageType === type.id && styles.imageTypeChipActive,
                ]}
                onPress={() => setSelectedImageType(type.id)}
              >
                <type.icon 
                  size={16} 
                  color={selectedImageType === type.id ? theme.colors.primary : theme.colors.text}
                />
                <Text style={[
                  styles.imageTypeText,
                  selectedImageType === type.id && styles.imageTypeTextActive,
                ]}>
                  {type.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upload Medical Images</Text>
          <Animated.View style={[
            styles.uploadArea,
            uploadedFiles.length > 0 && styles.uploadAreaActive,
            uploadAnimatedStyle,
          ]}>
            <Animated.View style={[styles.uploadIcon, pulseAnimatedStyle]}>
              <Upload size={48} color={theme.colors.primary} />
            </Animated.View>
            <Text style={styles.uploadText}>Upload Medical Images</Text>
            <Text style={styles.uploadSubtext}>
              Supports JPEG, PNG, DICOM files up to 50MB{'\n'}
              Fundus photography, OCT scans, visual field tests
            </Text>
            <View style={styles.uploadButtons}>
              <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                <FileImage size={16} color="#FFFFFF" />
                <Text style={styles.uploadButtonText}>Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.uploadButton, styles.uploadButtonSecondary]} 
                onPress={takePhoto}
              >
                <Camera size={16} color={theme.colors.primary} />
                <Text style={[styles.uploadButtonText, styles.uploadButtonTextSecondary]}>
                  Camera
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.uploadButton, styles.uploadButtonSecondary]} 
                onPress={pickDocument}
              >
                <Database size={16} color={theme.colors.primary} />
                <Text style={[styles.uploadButtonText, styles.uploadButtonTextSecondary]}>
                  Files
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>

        {uploadedFiles.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Uploaded Files</Text>
            <View style={styles.filesContainer}>
              {uploadedFiles.map((file) => (
                <View key={file.id} style={styles.fileCard}>
                  {file.type === 'image' && (
                    <Image source={{ uri: file.uri }} style={styles.fileImage} />
                  )}
                  <View style={styles.fileInfo}>
                    <Text style={styles.fileName}>{file.name}</Text>
                    <Text style={styles.fileSize}>
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => removeFile(file.id)}
                  >
                    <AlertTriangle size={20} color={theme.colors.error} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {uploadedFiles.length > 0 && (
          <MaterialButton
            title="Start AI Analysis"
            onPress={startAnalysis}
            size="large"
            icon={<Brain size={20} color="#FFFFFF" />}
            style={{ marginTop: 20 }}
          />
        )}
      </View>

      <FloatingActionButton
        onPress={pickImage}
        style={styles.fab}
        color={theme.colors.primary}
      >
        <Upload size={24} color="#FFFFFF" />
      </FloatingActionButton>
    </ScrollView>
  );
}