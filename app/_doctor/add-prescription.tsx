import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { users } from '@/lib/data'; // Assuming users data is available here for lookup
import { addPrescription } from '@/lib/api';
import { User, Prescription } from '@/lib/schema';
import { getUser } from '@/lib/auth';

const AddPrescriptionScreen = () => {
  const router = useRouter();
  const [patients, setPatients] = useState<User[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [medication, setMedication] = useState('');
  const [dosage, setDosage] = useState('');
  const [instructions, setInstructions] = useState('');
  const [loggedInDoctor, setLoggedInDoctor] = useState<User | null>(null);

  useEffect(() => {
    const fetchPatientsAndDoctor = async () => {
      const allPatients = users.filter(user => user.role === 'patient');
      setPatients(allPatients);
      if (allPatients.length > 0) {
        setSelectedPatient(allPatients[0].id);
      }
      const doctor = await getUser();
      setLoggedInDoctor(doctor);
    };
    fetchPatientsAndDoctor();
  }, []);

  const handleAddPrescription = async () => {
    if (!selectedPatient || !medication || !dosage || !instructions || !loggedInDoctor) {
      Alert.alert('Error', 'Please fill in all fields and ensure you are logged in as a doctor.');
      return;
    }

    const newPrescription: Prescription = {
      id: `P${Date.now()}`,
      patientId: selectedPatient,
      doctorId: loggedInDoctor.id,
      medication,
      dosage,
      instructions,
      datePrescribed: new Date().toISOString().split('T')[0],
    };

    try {
      await addPrescription(newPrescription);
      Alert.alert('Success', 'Prescription added successfully!');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to add prescription.');
      console.error('Error adding prescription:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerTitle}>Add New Prescription</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Select Patient</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedPatient}
              onValueChange={(itemValue) => setSelectedPatient(itemValue)}
              style={styles.picker}
            >
              {patients.map((patient) => (
                <Picker.Item key={patient.id} label={patient.name} value={patient.id} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Medication</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Amoxicillin"
            value={medication}
            onChangeText={setMedication}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Dosage</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 250mg, twice a day"
            value={dosage}
            onChangeText={setDosage}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Instructions</Text>
          <TextInput
            style={[styles.input, styles.instructionsInput]}
            placeholder="e.g., Take with food for 7 days."
            multiline
            numberOfLines={4}
            value={instructions}
            onChangeText={setInstructions}
          />
        </View>

        <TouchableOpacity style={styles.addButton} onPress={handleAddPrescription}>
          <Text style={styles.addButtonText}>Add Prescription</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  container: {
    flexGrow: 1,
    padding: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#334155',
    marginBottom: 8,
    fontWeight: '600',
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  instructionsInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingVertical: 10,
  },
  addButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddPrescriptionScreen;
