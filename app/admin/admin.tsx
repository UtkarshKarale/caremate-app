import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { users, appointments, doctors } from '@/lib/data';
import { User, Appointment, Doctor } from '@/lib/schema';

const AdminScreen = () => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    setAllUsers(users);
    setAllAppointments(appointments);
    setAllDoctors(doctors);
  }, []);

  const renderUserItem = ({ item }: { item: User }) => (
    <View style={styles.listItem}>
      <Text style={styles.listItemTitle}>{item.name}</Text>
      <Text style={styles.listItemSubtitle}>{item.email} - {item.role}</Text>
    </View>
  );

  const renderAppointmentItem = ({ item }: { item: Appointment }) => (
    <View style={styles.listItem}>
      <Text style={styles.listItemTitle}>Appointment ID: {item.id}</Text>
      <Text style={styles.listItemSubtitle}>Patient: {users.find(u => u.id === item.patientId)?.name}</Text>
      <Text style={styles.listItemSubtitle}>Doctor: {doctors.find(d => d.id === item.doctorId)?.name}</Text>
      <Text style={styles.listItemSubtitle}>Date: {item.date} at {item.time}</Text>
      <Text style={styles.listItemSubtitle}>Reason: {item.reason}</Text>
      <Text style={styles.listItemSubtitle}>Status: {item.status}</Text>
    </View>
  );

  const renderDoctorItem = ({ item }: { item: Doctor }) => (
    <View style={styles.listItem}>
      <Text style={styles.listItemTitle}>{item.name}</Text>
      <Text style={styles.listItemSubtitle}>{item.specialty}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Users ({allUsers.length})</Text>
          <FlatList
            data={allUsers}
            renderItem={renderUserItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Doctors ({allDoctors.length})</Text>
          <FlatList
            data={allDoctors}
            renderItem={renderDoctorItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Appointments ({allAppointments.length})</Text>
          <FlatList
            data={allAppointments}
            renderItem={renderAppointmentItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
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
    padding: 20,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 15,
  },
  listItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
  },
  listItemSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
});

export default AdminScreen;