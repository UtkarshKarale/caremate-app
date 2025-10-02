
import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';

const appointments = [
  { id: '1', doctor: 'Dr. Smith', hospital: 'City General Hospital', date: '2025-10-20', time: '10:00 AM' },
  { id: '2', doctor: 'Dr. Jones', hospital: 'Sunrise Medical Center', date: '2025-11-15', time: '02:30 PM' },
];

const MyAppointmentsScreen = () => {
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.doctorText}>{item.doctor}</Text>
      <Text style={styles.hospitalText}>{item.hospital}</Text>
      <Text style={styles.dateText}>{item.date} at {item.time}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>My Appointments</Text>
        <FlatList
          data={appointments}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
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
  hospitalText: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 4,
  },
  dateText: {
    fontSize: 14,
    color: '#047857',
    marginTop: 8,
  },
});

export default MyAppointmentsScreen;
