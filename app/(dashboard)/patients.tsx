import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import {
  Users,
  Plus,
  Search,
  Filter,
  Calendar,
  Phone,
  Mail,
  FileText,
  Edit,
  Trash2,
  Eye,
  X,
  User,
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { usePatients, Patient } from '@/contexts/PatientContext';

export default function PatientsScreen() {
  const { theme } = useTheme();
  const { patients, addPatient, updatePatient, deletePatient, getPatientAnalyses } = usePatients();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    phone: '',
    medicalHistory: '',
  });

  const filteredPatients = patients.filter(patient =>
    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddPatient = async () => {
    if (!formData.firstName || !formData.lastName || !formData.dateOfBirth) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      await addPatient({
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        email: formData.email,
        phone: formData.phone,
        medicalHistory: formData.medicalHistory.split(',').map(item => item.trim()).filter(Boolean),
      });

      setShowAddModal(false);
      resetForm();
      Alert.alert('Success', 'Patient added successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to add patient');
    }
  };

  const handleDeletePatient = (patient: Patient) => {
    Alert.alert(
      'Delete Patient',
      `Are you sure you want to delete ${patient.firstName} ${patient.lastName}? This will also delete all associated analyses.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deletePatient(patient.id),
        },
      ]
    );
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      email: '',
      phone: '',
      medicalHistory: '',
    });
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
    addButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },
    addButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      marginLeft: 6,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      marginBottom: 16,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: theme.colors.text,
      marginLeft: 8,
    },
    filterButton: {
      padding: 8,
      marginLeft: 8,
    },
    statsContainer: {
      flexDirection: 'row',
      gap: 16,
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.colors.background,
      borderRadius: 8,
      padding: 12,
      alignItems: 'center',
    },
    statNumber: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: theme.colors.primary,
    },
    statLabel: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    content: {
      flex: 1,
      padding: 24,
    },
    patientsList: {
      gap: 12,
    },
    patientCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 16,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    patientHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    patientInfo: {
      flex: 1,
    },
    patientName: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.text,
      marginBottom: 4,
    },
    patientAge: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 8,
    },
    patientActions: {
      flexDirection: 'row',
      gap: 8,
    },
    actionButton: {
      padding: 8,
      borderRadius: 6,
      backgroundColor: theme.colors.background,
    },
    patientDetails: {
      gap: 8,
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    detailText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginLeft: 8,
    },
    medicalHistory: {
      marginTop: 8,
    },
    historyTitle: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.text,
      marginBottom: 4,
    },
    historyItems: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
    },
    historyItem: {
      backgroundColor: theme.colors.background,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    historyItemText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    analysesCount: {
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    analysesText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    viewAnalysesButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
    },
    viewAnalysesText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontFamily: 'Inter-SemiBold',
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 60,
    },
    emptyStateText: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.text,
      marginTop: 16,
      marginBottom: 8,
    },
    emptyStateSubtext: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 24,
      width: '90%',
      maxWidth: 500,
      maxHeight: '80%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
    },
    modalTitle: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: theme.colors.text,
    },
    closeButton: {
      padding: 4,
    },
    form: {
      gap: 16,
    },
    inputGroup: {
      gap: 6,
    },
    label: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.text,
    },
    required: {
      color: theme.colors.error,
    },
    input: {
      backgroundColor: theme.colors.background,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 12,
      fontSize: 16,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    textArea: {
      height: 80,
      textAlignVertical: 'top',
    },
    modalButtons: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 24,
    },
    modalButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: theme.colors.background,
    },
    saveButton: {
      backgroundColor: theme.colors.primary,
    },
    modalButtonText: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
    },
    cancelButtonText: {
      color: theme.colors.text,
    },
    saveButtonText: {
      color: '#FFFFFF',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Patient Management</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
            <Plus size={16} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add Patient</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Search size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search patients..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{patients.length}</Text>
            <Text style={styles.statLabel}>Total Patients</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {patients.filter(p => p.lastVisit && 
                new Date(p.lastVisit) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
              ).length}
            </Text>
            <Text style={styles.statLabel}>Recent Visits</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {patients.filter(p => p.medicalHistory.length > 0).length}
            </Text>
            <Text style={styles.statLabel}>With History</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {filteredPatients.length === 0 ? (
          <View style={styles.emptyState}>
            <Users size={48} color={theme.colors.textSecondary} />
            <Text style={styles.emptyStateText}>
              {searchQuery ? 'No patients found' : 'No patients yet'}
            </Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery 
                ? 'Try adjusting your search terms'
                : 'Add your first patient to get started'
              }
            </Text>
          </View>
        ) : (
          <ScrollView style={styles.patientsList} showsVerticalScrollIndicator={false}>
            {filteredPatients.map((patient) => {
              const analyses = getPatientAnalyses(patient.id);
              return (
                <View key={patient.id} style={styles.patientCard}>
                  <View style={styles.patientHeader}>
                    <View style={styles.patientInfo}>
                      <Text style={styles.patientName}>
                        {patient.firstName} {patient.lastName}
                      </Text>
                      <Text style={styles.patientAge}>
                        {calculateAge(patient.dateOfBirth)} years old
                      </Text>
                    </View>
                    <View style={styles.patientActions}>
                      <TouchableOpacity style={styles.actionButton}>
                        <Edit size={16} color={theme.colors.textSecondary} />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => handleDeletePatient(patient)}
                      >
                        <Trash2 size={16} color={theme.colors.error} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.patientDetails}>
                    <View style={styles.detailRow}>
                      <Calendar size={16} color={theme.colors.textSecondary} />
                      <Text style={styles.detailText}>
                        Born {formatDate(patient.dateOfBirth)}
                      </Text>
                    </View>
                    {patient.email && (
                      <View style={styles.detailRow}>
                        <Mail size={16} color={theme.colors.textSecondary} />
                        <Text style={styles.detailText}>{patient.email}</Text>
                      </View>
                    )}
                    {patient.phone && (
                      <View style={styles.detailRow}>
                        <Phone size={16} color={theme.colors.textSecondary} />
                        <Text style={styles.detailText}>{patient.phone}</Text>
                      </View>
                    )}
                    {patient.lastVisit && (
                      <View style={styles.detailRow}>
                        <Eye size={16} color={theme.colors.textSecondary} />
                        <Text style={styles.detailText}>
                          Last visit: {formatDate(patient.lastVisit)}
                        </Text>
                      </View>
                    )}
                  </View>

                  {patient.medicalHistory.length > 0 && (
                    <View style={styles.medicalHistory}>
                      <Text style={styles.historyTitle}>Medical History</Text>
                      <View style={styles.historyItems}>
                        {patient.medicalHistory.map((condition, index) => (
                          <View key={index} style={styles.historyItem}>
                            <Text style={styles.historyItemText}>{condition}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}

                  <View style={styles.analysesCount}>
                    <Text style={styles.analysesText}>
                      {analyses.length} analysis{analyses.length !== 1 ? 'es' : ''}
                    </Text>
                    {analyses.length > 0 && (
                      <TouchableOpacity style={styles.viewAnalysesButton}>
                        <Text style={styles.viewAnalysesText}>View Analyses</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })}
          </ScrollView>
        )}
      </View>

      {/* Add Patient Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Patient</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowAddModal(false)}
              >
                <X size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  First Name <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter first name"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={formData.firstName}
                  onChangeText={(text) => setFormData({ ...formData, firstName: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Last Name <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter last name"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={formData.lastName}
                  onChangeText={(text) => setFormData({ ...formData, lastName: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Date of Birth <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={formData.dateOfBirth}
                  onChangeText={(text) => setFormData({ ...formData, dateOfBirth: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter email address"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter phone number"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={formData.phone}
                  onChangeText={(text) => setFormData({ ...formData, phone: text })}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Medical History</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Enter medical conditions (comma separated)"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={formData.medicalHistory}
                  onChangeText={(text) => setFormData({ ...formData, medicalHistory: text })}
                  multiline
                />
              </View>
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={[styles.modalButtonText, styles.cancelButtonText]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddPatient}
              >
                <Text style={[styles.modalButtonText, styles.saveButtonText]}>
                  Add Patient
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}