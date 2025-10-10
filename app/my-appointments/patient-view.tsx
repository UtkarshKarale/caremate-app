import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { getUser } from '@/lib/auth';
import { getAppointments } from '@/lib/api';
import { Appointment, User, Doctor } from '@/lib/schema';
import { doctors } from '@/lib/data'; // Assuming doctors data is available here for lookup
import { useFocusEffect } from 'expo-router';

const PatientAppointments = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userAppointments, setUserAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const loggedInUser = await getUser();
        setUser(loggedInUser);

        if (loggedInUser) {
          const appointmentsData = await getAppointments(loggedInUser.id);
          setUserAppointments(appointmentsData as Appointment[]);
        }
        setLoading(false);
      };
      fetchData();
    }, [])
  );

  const getDoctorName = (doctorId: string) => {
    const doctor = doctors.find(doc => doc.id === doctorId);
    return doctor ? doctor.name : 'Unknown Doctor';
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading appointments...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>My Appointments</Text>
        {userAppointments.length > 0 ? (
          <FlatList
            data={userAppointments}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <Text style={styles.doctorText}>Dr. {getDoctorName(item.doctorId)}</Text>
                <Text style={styles.reasonText}>{item.reason}</Text>
                <Text style={styles.dateText}>{item.date} at {item.time}</Text>
                <Text style={styles.statusText}>Status: {item.status}</Text>
              </View>
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <View style={styles.noAppointmentsContainer}>
            <Text style={styles.noAppointmentsText}>No appointments found.</Text>
          </View>
        )}
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 20,
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
  listContainer: {
    paddingTop: 10,
  },
  itemContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  doctorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#334155',
  },
  reasonText: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 4,
  },
  dateText: {
    fontSize: 14,
    color: '#047857',
    marginTop: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#475569',
    marginTop: 4,
    fontStyle: 'italic',
  },
  noAppointmentsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noAppointmentsText: {
    fontSize: 18,
    color: '#64748B',
  },
});

export default PatientAppointments;