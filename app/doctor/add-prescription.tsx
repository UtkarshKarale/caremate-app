import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';

const AddPrescriptionScreen = () => {
  const [patientId, setPatientId] = useState('');
  const [medication, setMedication] = useState('');
  const [dosage, setDosage] = useState('');
  const [instructions, setInstructions] = useState('');
  const router = useRouter();

  const handleAddPrescription = () => {
    if (!patientId || !medication || !dosage || !instructions) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    // Here you would typically send this data to your backend API
    console.log({
      patientId,
      medication,
      dosage,
      instructions,
      datePrescribed: new Date().toISOString().split('T')[0],
    });
    Alert.alert('Success', 'Prescription added successfully!');
    router.back(); // Go back to the previous screen (Doctor Dashboard)
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ title: 'Add Prescription' }} />
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Add New Prescription</Text>

        <TextInput
          style={styles.input}
          placeholder="Patient ID"
          value={patientId}
          onChangeText={setPatientId}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Medication Name"
          value={medication}
          onChangeText={setMedication}
        />
        <TextInput
          style={styles.input}
          placeholder="Dosage (e.g., 10mg, 1 tablet)"
          value={dosage}
          onChangeText={setDosage}
        />
        <TextInput
          style={styles.input}
          placeholder="Instructions (e.g., Take once daily)"
          value={instructions}
          onChangeText={setInstructions}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity style={styles.addButton} onPress={handleAddPrescription}>
          <Text style={styles.addButtonText}>Add Prescription</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#1E293B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  addButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 15,
    borderRadius: 8,
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