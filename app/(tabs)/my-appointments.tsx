import React, { useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, SafeAreaView, StyleSheet } from 'react-native';
import { getUser } from '@/lib/auth';
import { User } from '@/lib/schema';
import { useFocusEffect } from 'expo-router';
import PatientAppointments from '@/app/my-appointments/patient-view';
import DoctorAppointments from '@/app/my-appointments/doctor-view';
import ManageAppointmentScreen from "@/app/_doctor/manage-appointment";

export default function AppointmentsScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchUser = async () => {
        const loggedInUser = await getUser();
        setUser(loggedInUser);
        setLoadingUser(false);
      };
      fetchUser();
    }, [])
  );

  if (loadingUser) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading user data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return <Text>Error: User not found.</Text>;
  }

  switch (user.role?.toLowerCase()) {
    case 'patient':
      return <PatientAppointments />;
    case 'doctor':
      return <AppointmentsScreen />;
    default:
      return <AppointmentsScreen />;
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#64748B',
  },
});
