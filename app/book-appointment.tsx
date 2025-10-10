import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, ScrollView, TextInput, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getAllDoctors } from '@/lib/api';
import { Doctor } from '@/lib/schema';

const BookAppointmentScreen = () => {
  const router = useRouter();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [appointmentDate, setAppointmentDate] = useState(new Date());
  const [appointmentTime, setAppointmentTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [reason, setReason] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      const allDoctors = await getAllDoctors();
      setDoctors(allDoctors as Doctor[]);
      if (allDoctors.length > 0) {
        setSelectedDoctor(allDoctors[0].id);
      }
    };
    fetchDoctors();
  }, []);

  const onChangeDate = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || appointmentDate;
    setShowDatePicker(Platform.OS === 'ios');
    setAppointmentDate(currentDate);
  };

  const onChangeTime = (event: any, selectedTime?: Date) => {
    const currentTime = selectedTime || appointmentTime;
    setShowTimePicker(Platform.OS === 'ios');
    setAppointmentTime(currentTime);
  };

  const handleBookAppointment = () => {
    if (!selectedDoctor || !reason) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    const doctorName = doctors.find(doc => doc.id === selectedDoctor)?.name;
    const formattedDate = appointmentDate.toISOString().split('T')[0];
    const formattedTime = appointmentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    Alert.alert(
      'Appointment Details',
      `Doctor: ${doctorName}\nDate: ${formattedDate}\nTime: ${formattedTime}\nReason: ${reason}`,
      [
        { text: 'OK', onPress: () => router.back() },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerTitle}>Book New Appointment</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Select Doctor</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedDoctor}
              onValueChange={(itemValue) => setSelectedDoctor(itemValue)}
              style={styles.picker}
            >
              {doctors.map((doctor) => (
                <Picker.Item key={doctor.id} label={doctor.name} value={doctor.id} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Appointment Date</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
            <Text style={styles.datePickerButtonText}>{appointmentDate.toDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              testID="datePicker"
              value={appointmentDate}
              mode="date"
              display="default"
              onChange={onChangeDate}
            />
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Appointment Time</Text>
          <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.datePickerButton}>
            <Text style={styles.datePickerButtonText}>{appointmentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              testID="timePicker"
              value={appointmentTime}
              mode="time"
              display="default"
              onChange={onChangeTime}
            />
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Reason for Appointment</Text>
          <TextInput
            style={[styles.input, styles.reasonInput]}
            placeholder="Describe your symptoms or reason for visit"
            multiline
            numberOfLines={4}
            value={reason}
            onChangeText={setReason}
          />
        </View>

        <TouchableOpacity style={styles.bookButton} onPress={handleBookAppointment}>
          <Text style={styles.bookButtonText}>Book Appointment</Text>
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
  reasonInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingVertical: 10,
  },
  datePickerButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  datePickerButtonText: {
    fontSize: 16,
    color: '#1E293B',
  },
  bookButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BookAppointmentScreen;
