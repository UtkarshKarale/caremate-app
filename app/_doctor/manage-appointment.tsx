import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, ScrollView, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { users, appointments } from '@/lib/data';
import { addPrescription, addReport, updateAppointmentStatus } from '@/lib/api';
import { Appointment, Prescription, Report, User } from '@/lib/schema';
import { getUser } from '@/lib/auth';

const ManageAppointmentScreen = () => {
  const router = useRouter();
  const { appointmentId } = useLocalSearchParams();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [patient, setPatient] = useState<User | null>(null);
  const [loggedInDoctor, setLoggedInDoctor] = useState<User | null>(null);
  const [newStatus, setNewStatus] = useState<Appointment['status'] | null>(null);

  // Prescription state
  const [medication, setMedication] = useState('');
  const [dosage, setDosage] = useState('');
  const [instructions, setInstructions] = useState('');

  // Report state
  const [reportType, setReportType] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [reportFileUrl, setReportFileUrl] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const currentAppointment = appointments.find(a => a.id === appointmentId as string);
      setAppointment(currentAppointment || null);

      if (currentAppointment) {
        const currentPatient = users.find(u => u.id === currentAppointment.patientId);
        setPatient(currentPatient || null);
        setNewStatus(currentAppointment.status);
      }

      const doctor = await getUser();
      setLoggedInDoctor(doctor);
    };
    fetchData();
  }, [appointmentId]);

  const handleUpdateStatus = async () => {
    if (!appointment || !newStatus) return;
    try {
      await updateAppointmentStatus(appointment.id, newStatus);
      Alert.alert('Success', `Appointment status updated to ${newStatus}`);
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to update appointment status.');
      console.error('Error updating status:', error);
    }
  };

  const handleAddPrescription = async () => {
    if (!appointment || !loggedInDoctor || !medication || !dosage || !instructions) {
      Alert.alert('Error', 'Please fill all prescription fields.');
      return;
    }
    const newPrescription: Prescription = {
      id: `P${Date.now()}`,
      patientId: appointment.patientId,
      doctorId: loggedInDoctor.id,
      medication,
      dosage,
      instructions,
      datePrescribed: new Date().toISOString().split('T')[0],
    };
    try {
      await addPrescription(newPrescription);
      Alert.alert('Success', 'Prescription added.');
      setMedication(''); setDosage(''); setInstructions('');
    } catch (error) {
      Alert.alert('Error', 'Failed to add prescription.');
      console.error('Error adding prescription:', error);
    }
  };

  const handleAddReport = async () => {
    if (!appointment || !loggedInDoctor || !reportType || !reportDetails) {
      Alert.alert('Error', 'Please fill all report fields.');
      return;
    }
    const newReport: Report = {
      id: `R${Date.now()}`,
      patientId: appointment.patientId,
      doctorId: loggedInDoctor.id,
      type: reportType,
      details: reportDetails,
      dateGenerated: new Date().toISOString().split('T')[0],
      fileUrl: reportFileUrl || undefined,
    };
    try {
      await addReport(newReport);
      Alert.alert('Success', 'Report added.');
      setReportType(''); setReportDetails(''); setReportFileUrl('');
    } catch (error) {
      Alert.alert('Error', 'Failed to add report.');
      console.error('Error adding report:', error);
    }
  };

  if (!appointment) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Appointment not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerTitle}>Manage Appointment</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appointment Details</Text>
          <Text style={styles.detailText}>Patient: {patient?.name || 'N/A'}</Text>
          <Text style={styles.detailText}>Date: {appointment.date}</Text>
          <Text style={styles.detailText}>Time: {appointment.time}</Text>
          <Text style={styles.detailText}>Reason: {appointment.reason}</Text>
          <Text style={styles.detailText}>Current Status: {appointment.status}</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Update Status</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={newStatus}
                onValueChange={(itemValue) => setNewStatus(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Scheduled" value="scheduled" />
                <Picker.Item label="Completed" value="completed" />
                <Picker.Item label="Cancelled" value="cancelled" />
              </Picker>
            </View>
            <TouchableOpacity style={styles.updateButton} onPress={handleUpdateStatus}>
              <Text style={styles.updateButtonText}>Update Status</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add Prescription</Text>
          <TextInput style={styles.input} placeholder="Medication" value={medication} onChangeText={setMedication} />
          <TextInput style={styles.input} placeholder="Dosage" value={dosage} onChangeText={setDosage} />
          <TextInput style={[styles.input, styles.textArea]} placeholder="Instructions" multiline value={instructions} onChangeText={setInstructions} />
          <TouchableOpacity style={styles.addButton} onPress={handleAddPrescription}>
            <Text style={styles.addButtonText}>Add Prescription</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add Report</Text>
          <TextInput style={styles.input} placeholder="Report Type (e.g., Blood Test)" value={reportType} onChangeText={setReportType} />
          <TextInput style={[styles.input, styles.textArea]} placeholder="Report Details" multiline value={reportDetails} onChangeText={setReportDetails} />
          <TextInput style={styles.input} placeholder="File URL (Optional)" value={reportFileUrl} onChangeText={setReportFileUrl} />
          <TouchableOpacity style={styles.addButton} onPress={handleAddReport}>
            <Text style={styles.addButtonText}>Add Report</Text>
          </TouchableOpacity>
        </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#64748B',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 15,
  },
  detailText: {
    fontSize: 16,
    color: '#334155',
    marginBottom: 5,
  },
  inputGroup: {
    marginTop: 15,
  },
  label: {
    fontSize: 16,
    color: '#334155',
    marginBottom: 8,
    fontWeight: '600',
  },
  pickerContainer: {
    backgroundColor: '#F0F4F8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  updateButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#F0F4F8',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 45,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingVertical: 10,
  },
  addButton: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ManageAppointmentScreen;
