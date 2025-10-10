import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

const DoctorAppointments = () => {
  // This component will display doctor-specific appointments management
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Doctor Appointments</Text>
        <Text>Manage your appointments here.</Text>
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
});

export default DoctorAppointments;