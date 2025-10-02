
import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, StatusBar } from 'react-native';

const appointments = [
  { id: '1', time: '09:00 AM', patient: 'John Doe', reason: 'Follow-up' },
  { id: '2', time: '10:00 AM', patient: 'Jane Smith', reason: 'New patient consultation' },
  { id: '3', time: '11:00 AM', patient: 'Sam Wilson', reason: 'Annual check-up' },
  { id: '4', time: '01:00 PM', patient: 'Alice Johnson', reason: 'Pre-op assessment' },
  { id: '5', time: '02:00 PM', patient: 'Michael Brown', reason: 'Test results review' },
];

const DoctorScreen = () => {
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{item.time}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.patientText}>{item.patient}</Text>
        <Text style={styles.reasonText}>{item.reason}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Doctor&apos;s Dashboard</Text>
          <View style={styles.headerStats}>
            <Text style={styles.statText}>Total: {appointments.length}</Text>
          </View>
        </View>
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
  },
  timeContainer: {
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#047857',
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
});

export default DoctorScreen;
