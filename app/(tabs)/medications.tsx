import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Pill, Plus, Clock, AlertCircle, Trash2 } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  notes: string;
}

export default function MedicationsScreen() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMedication, setNewMedication] = useState<Medication>({
    id: '',
    name: '',
    dosage: '',
    frequency: '',
    time: '',
    notes: '',
  });

  useEffect(() => {
    loadMedications();
  }, []);

  const loadMedications = async () => {
    try {
      const savedMedications = await AsyncStorage.getItem('medications');
      if (savedMedications) {
        setMedications(JSON.parse(savedMedications));
      }
    } catch (error) {
      console.error('Error loading medications:', error);
    }
  };

  const saveMedications = async (updatedMedications: Medication[]) => {
    try {
      await AsyncStorage.setItem('medications', JSON.stringify(updatedMedications));
    } catch (error) {
      console.error('Error saving medications:', error);
    }
  };

  const handleAddMedication = async () => {
    if (newMedication.name && newMedication.dosage) {
      const medicationToAdd = {
        ...newMedication,
        id: Date.now().toString(),
      };
      const updatedMedications = [...medications, medicationToAdd];
      setMedications(updatedMedications);
      await saveMedications(updatedMedications);
      setShowAddForm(false);
      setNewMedication({
        id: '',
        name: '',
        dosage: '',
        frequency: '',
        time: '',
        notes: '',
      });
    }
  };

  const handleDeleteMedication = async (id: string) => {
    const updatedMedications = medications.filter(med => med.id !== id);
    setMedications(updatedMedications);
    await saveMedications(updatedMedications);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Medicine Reminders</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddForm(true)}>
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {showAddForm && (
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Add New Medication</Text>
          <TextInput
            style={styles.input}
            placeholder="Medication Name"
            value={newMedication.name}
            onChangeText={(text) => setNewMedication({ ...newMedication, name: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Dosage"
            value={newMedication.dosage}
            onChangeText={(text) => setNewMedication({ ...newMedication, dosage: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Frequency (e.g., twice daily)"
            value={newMedication.frequency}
            onChangeText={(text) => setNewMedication({ ...newMedication, frequency: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Time (e.g., 9:00 AM)"
            value={newMedication.time}
            onChangeText={(text) => setNewMedication({ ...newMedication, time: text })}
          />
          <TextInput
            style={[styles.input, styles.notesInput]}
            placeholder="Notes"
            multiline
            value={newMedication.notes}
            onChangeText={(text) => setNewMedication({ ...newMedication, notes: text })}
          />
          <View style={styles.formButtons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setShowAddForm(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleAddMedication}>
              <Text style={[styles.buttonText, styles.saveButtonText]}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {medications.length === 0 ? (
        <View style={styles.emptyState}>
          <Pill size={48} color="#007AFF" />
          <Text style={styles.emptyStateText}>No medications added yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Tap the + button to add your first medication reminder
          </Text>
        </View>
      ) : (
        medications.map((medication) => (
          <View key={medication.id} style={styles.medicationCard}>
            <View style={styles.medicationHeader}>
              <Pill size={24} color="#007AFF" />
              <Text style={styles.medicationName}>{medication.name}</Text>
              <TouchableOpacity
                onPress={() => handleDeleteMedication(medication.id)}
                style={styles.deleteButton}>
                <Trash2 size={20} color="#FF3B30" />
              </TouchableOpacity>
            </View>
            <View style={styles.medicationDetails}>
              <View style={styles.detailRow}>
                <AlertCircle size={16} color="#666666" />
                <Text style={styles.detailText}>Dosage: {medication.dosage}</Text>
              </View>
              <View style={styles.detailRow}>
                <Clock size={16} color="#666666" />
                <Text style={styles.detailText}>
                  {medication.frequency} at {medication.time}
                </Text>
              </View>
              {medication.notes && (
                <Text style={styles.notes}>{medication.notes}</Text>
              )}
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
  },
  addButton: {
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#000000',
  },
  input: {
    backgroundColor: '#F2F2F7',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: '#F2F2F7',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  saveButtonText: {
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 8,
  },
  medicationCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  medicationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  medicationName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginLeft: 12,
    flex: 1,
  },
  deleteButton: {
    padding: 4,
  },
  medicationDetails: {
    marginLeft: 36,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 16,
    color: '#666666',
    marginLeft: 8,
  },
  notes: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
    fontStyle: 'italic',
  },
});