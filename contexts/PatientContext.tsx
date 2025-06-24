import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email?: string;
  phone?: string;
  medicalHistory: string[];
  createdAt: string;
  lastVisit?: string;
}

export interface Analysis {
  id: string;
  patientId: string;
  fileId: string;
  condition: string;
  severity: string;
  confidence: number;
  date: string;
  findings: string[];
  recommendations: string[];
}

interface PatientContextType {
  patients: Patient[];
  analyses: Analysis[];
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt'>) => Promise<void>;
  updatePatient: (id: string, updates: Partial<Patient>) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;
  addAnalysis: (analysis: Omit<Analysis, 'id'>) => Promise<void>;
  getPatientAnalyses: (patientId: string) => Analysis[];
  loading: boolean;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export const usePatients = () => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatients must be used within a PatientProvider');
  }
  return context;
};

interface PatientProviderProps {
  children: ReactNode;
}

export const PatientProvider: React.FC<PatientProviderProps> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [storedPatients, storedAnalyses] = await Promise.all([
        AsyncStorage.getItem('patients'),
        AsyncStorage.getItem('analyses'),
      ]);

      if (storedPatients) {
        setPatients(JSON.parse(storedPatients));
      } else {
        // Initialize with mock data
        const mockPatients: Patient[] = [
          {
            id: '1',
            firstName: 'Sarah',
            lastName: 'Johnson',
            dateOfBirth: '1985-03-15',
            email: 'sarah.johnson@email.com',
            phone: '+1 (555) 123-4567',
            medicalHistory: ['Diabetes Type 2', 'Hypertension'],
            createdAt: '2024-01-15T10:00:00Z',
            lastVisit: '2024-06-20T14:30:00Z',
          },
          {
            id: '2',
            firstName: 'Michael',
            lastName: 'Chen',
            dateOfBirth: '1972-08-22',
            email: 'michael.chen@email.com',
            phone: '+1 (555) 987-6543',
            medicalHistory: ['Glaucoma Family History'],
            createdAt: '2024-02-10T09:15:00Z',
            lastVisit: '2024-06-18T11:00:00Z',
          },
          {
            id: '3',
            firstName: 'Emily',
            lastName: 'Davis',
            dateOfBirth: '1990-12-05',
            email: 'emily.davis@email.com',
            phone: '+1 (555) 456-7890',
            medicalHistory: ['Myopia'],
            createdAt: '2024-03-05T16:45:00Z',
            lastVisit: '2024-06-22T09:30:00Z',
          },
        ];
        setPatients(mockPatients);
        await AsyncStorage.setItem('patients', JSON.stringify(mockPatients));
      }

      if (storedAnalyses) {
        setAnalyses(JSON.parse(storedAnalyses));
      }
    } catch (error) {
      console.error('Error loading patient data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPatient = async (patientData: Omit<Patient, 'id' | 'createdAt'>) => {
    try {
      const newPatient: Patient = {
        ...patientData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      const updatedPatients = [...patients, newPatient];
      setPatients(updatedPatients);
      await AsyncStorage.setItem('patients', JSON.stringify(updatedPatients));
    } catch (error) {
      console.error('Error adding patient:', error);
    }
  };

  const updatePatient = async (id: string, updates: Partial<Patient>) => {
    try {
      const updatedPatients = patients.map(patient =>
        patient.id === id ? { ...patient, ...updates } : patient
      );
      setPatients(updatedPatients);
      await AsyncStorage.setItem('patients', JSON.stringify(updatedPatients));
    } catch (error) {
      console.error('Error updating patient:', error);
    }
  };

  const deletePatient = async (id: string) => {
    try {
      const updatedPatients = patients.filter(patient => patient.id !== id);
      const updatedAnalyses = analyses.filter(analysis => analysis.patientId !== id);
      
      setPatients(updatedPatients);
      setAnalyses(updatedAnalyses);
      
      await Promise.all([
        AsyncStorage.setItem('patients', JSON.stringify(updatedPatients)),
        AsyncStorage.setItem('analyses', JSON.stringify(updatedAnalyses)),
      ]);
    } catch (error) {
      console.error('Error deleting patient:', error);
    }
  };

  const addAnalysis = async (analysisData: Omit<Analysis, 'id'>) => {
    try {
      const newAnalysis: Analysis = {
        ...analysisData,
        id: Date.now().toString(),
      };

      const updatedAnalyses = [...analyses, newAnalysis];
      setAnalyses(updatedAnalyses);
      await AsyncStorage.setItem('analyses', JSON.stringify(updatedAnalyses));
    } catch (error) {
      console.error('Error adding analysis:', error);
    }
  };

  const getPatientAnalyses = (patientId: string): Analysis[] => {
    return analyses.filter(analysis => analysis.patientId === patientId);
  };

  const value = {
    patients,
    analyses,
    addPatient,
    updatePatient,
    deletePatient,
    addAnalysis,
    getPatientAnalyses,
    loading,
  };

  return (
    <PatientContext.Provider value={value}>
      {children}
    </PatientContext.Provider>
  );
};