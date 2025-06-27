import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export interface AIModel {
  id: string;
  name: string;
  version: string;
  accuracy: number;
  specialty: string;
  description: string;
  isActive: boolean;
  lastUpdated: string;
}

export interface DiagnosticResult {
  id: string;
  patientId: string;
  modelId: string;
  imageUrl: string;
  imageType: 'fundus' | 'oct' | 'visual_field' | 'anterior_segment';
  findings: Finding[];
  overallRisk: 'low' | 'moderate' | 'high' | 'critical';
  confidence: number;
  processingTime: number;
  timestamp: string;
  annotations: Annotation[];
  recommendations: string[];
  followUpRequired: boolean;
  reportGenerated: boolean;
}

export interface Finding {
  condition: string;
  severity: 'normal' | 'mild' | 'moderate' | 'severe';
  confidence: number;
  location: string;
  description: string;
  icdCode?: string;
  urgency: 'routine' | 'urgent' | 'emergent';
}

export interface Annotation {
  id: string;
  type: 'circle' | 'rectangle' | 'polygon' | 'arrow';
  coordinates: number[];
  label: string;
  color: string;
  confidence: number;
}

export interface AIAnalysisProgress {
  stage: 'preprocessing' | 'analysis' | 'postprocessing' | 'complete';
  progress: number;
  message: string;
  estimatedTimeRemaining: number;
}

interface AIContextType {
  models: AIModel[];
  diagnosticResults: DiagnosticResult[];
  currentAnalysis: AIAnalysisProgress | null;
  analyzeImage: (imageUri: string, imageType: string, patientId: string) => Promise<DiagnosticResult>;
  getModelPerformance: (modelId: string) => Promise<any>;
  generateReport: (resultId: string) => Promise<string>;
  compareResults: (resultIds: string[]) => Promise<any>;
  updateModel: (modelId: string) => Promise<boolean>;
  exportResults: (resultIds: string[], format: 'pdf' | 'dicom' | 'json') => Promise<string>;
  loading: boolean;
  error: string | null;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};

interface AIProviderProps {
  children: ReactNode;
}

export const AIProvider: React.FC<AIProviderProps> = ({ children }) => {
  const [models, setModels] = useState<AIModel[]>([]);
  const [diagnosticResults, setDiagnosticResults] = useState<DiagnosticResult[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<AIAnalysisProgress | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeAI();
  }, []);

  const initializeAI = async () => {
    try {
      setLoading(true);
      
      // Load AI models
      const savedModels = await AsyncStorage.getItem('aiModels');
      if (savedModels) {
        setModels(JSON.parse(savedModels));
      } else {
        const defaultModels = await loadDefaultModels();
        setModels(defaultModels);
        await AsyncStorage.setItem('aiModels', JSON.stringify(defaultModels));
      }

      // Load diagnostic results
      const savedResults = await AsyncStorage.getItem('diagnosticResults');
      if (savedResults) {
        setDiagnosticResults(JSON.parse(savedResults));
      }
    } catch (err) {
      setError('Failed to initialize AI system');
      console.error('AI initialization error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadDefaultModels = async (): Promise<AIModel[]> => {
    return [
      {
        id: 'retina-ai-v3',
        name: 'RetinaAI Pro',
        version: '3.2.1',
        accuracy: 96.8,
        specialty: 'Diabetic Retinopathy',
        description: 'Advanced deep learning model for diabetic retinopathy detection and grading',
        isActive: true,
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 'glaucoma-detect-v2',
        name: 'GlaucomaDetect',
        version: '2.1.5',
        accuracy: 94.2,
        specialty: 'Glaucoma',
        description: 'Specialized model for glaucoma screening and optic disc analysis',
        isActive: true,
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 'amd-classifier-v1',
        name: 'AMD Classifier',
        version: '1.8.3',
        accuracy: 92.5,
        specialty: 'Age-related Macular Degeneration',
        description: 'AI model for AMD detection and severity assessment',
        isActive: true,
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 'oct-analyzer-v2',
        name: 'OCT Analyzer Pro',
        version: '2.0.7',
        accuracy: 95.1,
        specialty: 'OCT Analysis',
        description: 'Comprehensive OCT scan analysis for retinal pathology',
        isActive: true,
        lastUpdated: new Date().toISOString(),
      },
    ];
  };

  const analyzeImage = async (imageUri: string, imageType: string, patientId: string): Promise<DiagnosticResult> => {
    try {
      setError(null);
      setCurrentAnalysis({
        stage: 'preprocessing',
        progress: 0,
        message: 'Preparing image for analysis...',
        estimatedTimeRemaining: 45,
      });

      // Simulate preprocessing
      await simulateProgress('preprocessing', 'Enhancing image quality and extracting features...', 15);
      
      setCurrentAnalysis({
        stage: 'analysis',
        progress: 25,
        message: 'Running AI models on image data...',
        estimatedTimeRemaining: 30,
      });

      // Simulate AI analysis
      await simulateProgress('analysis', 'Analyzing retinal structures and detecting abnormalities...', 25);
      
      setCurrentAnalysis({
        stage: 'postprocessing',
        progress: 75,
        message: 'Generating diagnostic report and recommendations...',
        estimatedTimeRemaining: 10,
      });

      // Simulate postprocessing
      await simulateProgress('postprocessing', 'Finalizing results and creating annotations...', 20);

      // Generate mock diagnostic result
      const result = await generateMockDiagnosticResult(imageUri, imageType, patientId);
      
      setCurrentAnalysis({
        stage: 'complete',
        progress: 100,
        message: 'Analysis complete',
        estimatedTimeRemaining: 0,
      });

      // Save result
      const updatedResults = [...diagnosticResults, result];
      setDiagnosticResults(updatedResults);
      await AsyncStorage.setItem('diagnosticResults', JSON.stringify(updatedResults));

      setTimeout(() => setCurrentAnalysis(null), 2000);
      
      return result;
    } catch (err) {
      setError('Analysis failed. Please try again.');
      setCurrentAnalysis(null);
      throw err;
    }
  };

  const simulateProgress = async (stage: string, message: string, duration: number) => {
    const steps = 10;
    const stepDuration = (duration * 1000) / steps;
    
    for (let i = 0; i < steps; i++) {
      await new Promise(resolve => setTimeout(resolve, stepDuration));
      const stageProgress = (i + 1) / steps;
      const overallProgress = getStageBaseProgress(stage) + (stageProgress * getStageWeight(stage));
      
      setCurrentAnalysis(prev => prev ? {
        ...prev,
        progress: Math.round(overallProgress),
        estimatedTimeRemaining: Math.max(0, prev.estimatedTimeRemaining - (duration / steps)),
      } : null);
    }
  };

  const getStageBaseProgress = (stage: string): number => {
    switch (stage) {
      case 'preprocessing': return 0;
      case 'analysis': return 25;
      case 'postprocessing': return 75;
      default: return 0;
    }
  };

  const getStageWeight = (stage: string): number => {
    switch (stage) {
      case 'preprocessing': return 25;
      case 'analysis': return 50;
      case 'postprocessing': return 25;
      default: return 0;
    }
  };

  const generateMockDiagnosticResult = async (imageUri: string, imageType: string, patientId: string): Promise<DiagnosticResult> => {
    const conditions = [
      'Diabetic Retinopathy',
      'Glaucoma',
      'Age-related Macular Degeneration',
      'Hypertensive Retinopathy',
      'Normal Retina',
    ];

    const severities: Array<'normal' | 'mild' | 'moderate' | 'severe'> = ['normal', 'mild', 'moderate', 'severe'];
    const risks: Array<'low' | 'moderate' | 'high' | 'critical'> = ['low', 'moderate', 'high', 'critical'];

    const primaryCondition = conditions[Math.floor(Math.random() * conditions.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const overallRisk = risks[Math.floor(Math.random() * risks.length)];

    const findings: Finding[] = [
      {
        condition: primaryCondition,
        severity,
        confidence: 85 + Math.random() * 10,
        location: 'Posterior pole',
        description: `${severity} ${primaryCondition.toLowerCase()} detected in the posterior pole region`,
        icdCode: 'H36.0',
        urgency: severity === 'severe' ? 'emergent' : severity === 'moderate' ? 'urgent' : 'routine',
      },
    ];

    if (Math.random() > 0.7) {
      findings.push({
        condition: 'Microaneurysms',
        severity: 'mild',
        confidence: 78 + Math.random() * 15,
        location: 'Superior temporal quadrant',
        description: 'Multiple microaneurysms observed in the superior temporal region',
        urgency: 'routine',
      });
    }

    const annotations: Annotation[] = [
      {
        id: '1',
        type: 'circle',
        coordinates: [150, 120, 25],
        label: 'Microaneurysm',
        color: '#FF6B6B',
        confidence: 92,
      },
      {
        id: '2',
        type: 'rectangle',
        coordinates: [200, 180, 40, 30],
        label: 'Hemorrhage',
        color: '#4ECDC4',
        confidence: 87,
      },
    ];

    const recommendations = [
      'Follow-up examination in 3-6 months',
      'Consider fluorescein angiography for detailed vascular assessment',
      'Monitor blood glucose levels closely',
      'Refer to retinal specialist if progression noted',
    ];

    return {
      id: Date.now().toString(),
      patientId,
      modelId: 'retina-ai-v3',
      imageUrl: imageUri,
      imageType: imageType as any,
      findings,
      overallRisk,
      confidence: 85 + Math.random() * 10,
      processingTime: 2.3 + Math.random() * 1.5,
      timestamp: new Date().toISOString(),
      annotations,
      recommendations,
      followUpRequired: severity !== 'normal',
      reportGenerated: false,
    };
  };

  const getModelPerformance = async (modelId: string) => {
    // Mock performance data
    return {
      accuracy: 96.8,
      sensitivity: 94.2,
      specificity: 98.1,
      auc: 0.97,
      totalAnalyses: 15420,
      lastUpdated: new Date().toISOString(),
    };
  };

  const generateReport = async (resultId: string): Promise<string> => {
    // Mock report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    return `report_${resultId}.pdf`;
  };

  const compareResults = async (resultIds: string[]) => {
    // Mock comparison data
    return {
      progression: 'stable',
      changes: [],
      recommendations: ['Continue current monitoring schedule'],
    };
  };

  const updateModel = async (modelId: string): Promise<boolean> => {
    try {
      // Mock model update
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const updatedModels = models.map(model => 
        model.id === modelId 
          ? { ...model, lastUpdated: new Date().toISOString(), version: incrementVersion(model.version) }
          : model
      );
      
      setModels(updatedModels);
      await AsyncStorage.setItem('aiModels', JSON.stringify(updatedModels));
      
      return true;
    } catch (err) {
      setError('Failed to update model');
      return false;
    }
  };

  const exportResults = async (resultIds: string[], format: 'pdf' | 'dicom' | 'json'): Promise<string> => {
    // Mock export
    await new Promise(resolve => setTimeout(resolve, 1500));
    return `export_${Date.now()}.${format}`;
  };

  const incrementVersion = (version: string): string => {
    const parts = version.split('.');
    const patch = parseInt(parts[2]) + 1;
    return `${parts[0]}.${parts[1]}.${patch}`;
  };

  const value = {
    models,
    diagnosticResults,
    currentAnalysis,
    analyzeImage,
    getModelPerformance,
    generateReport,
    compareResults,
    updateModel,
    exportResults,
    loading,
    error,
  };

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  );
};