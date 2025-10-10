
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, StatusBar, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getUser } from '@/lib/auth';
import { getDoctorAppointments } from '@/lib/api';
import { Appointment, User } from '@/lib/schema';
import { users } from '@/lib/data'; // Assuming users data is available here for lookup
import { useRouter } from 'expo-router';

const DoctorScreen = () => {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [doctorAppointments, setDoctorAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const user = await getUser();
      setLoggedInUser(user);

      if (user && user.role === 'doctor') {
        const appointmentsData = await getDoctorAppointments(user.id);
        setDoctorAppointments(appointmentsData as Appointment[]);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const getPatientName = (patientId: string) => {
    const patient = users.find(u => u.id === patientId);
    return patient ? patient.name : 'Unknown Patient';
  };

  const renderItem = ({ item }: { item: Appointment }) => (
    <View style={styles.itemContainer}>
      <View style={styles.detailsContainer}>
        <Text style={styles.patientText}>{getPatientName(item.patientId)}</Text>
        <Text style={styles.reasonText}>{item.reason}</Text>
        <Text style={styles.dateText}>{item.date} at {item.time}</Text>
        <Text style={styles.statusText}>Status: {item.status}</Text>
      </View>
      <TouchableOpacity style={styles.manageButton} onPress={() => router.push(`/_doctor/manage-appointment?appointmentId=${item.id}`)}>
        <Text style={styles.manageButtonText}>Manage</Text>
      </TouchableOpacity>
    </View>
  );

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
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Doctor&apos;s Dashboard</Text>
          <View style={styles.headerStats}>
            <Text style={styles.statText}>Total Appointments: {doctorAppointments.length}</Text>
          </View>
        </View>
        {doctorAppointments.length > 0 ? (
          <FlatList
            data={doctorAppointments}
            renderItem={renderItem}
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
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  headerStats: {
    marginTop: 8,
  },
  statText: {
    fontSize: 16,
    color: '#475569',
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
    padding: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  detailsContainer: {
    flex: 1,
  },
  patientText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#334155',
  },
  reasonText: {
    fontSize: 14,
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
  manageButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginLeft: 10,
  },
  manageButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  noAppointmentsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noAppointmentsText: {
    fontSize: 18,
    color: '#64748B',
    textAlign: 'center',
  },
});

export default DoctorScreen;
