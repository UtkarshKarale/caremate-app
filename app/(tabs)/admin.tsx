import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';

const AdminScreen = () => {
  const stats = [
    { title: 'Users', value: '1,250', icon: 'person.3.fill', color: '#3B82F6' },
    { title: 'Doctors', value: '75', icon: 'heart.text.square.fill', color: '#10B981' },
    { title: 'Receptionists', value: '20', icon: 'person.crop.circle.badge.plus', color: '#F59E0B' },
    { title: 'Appointments', value: '450', icon: 'calendar', color: '#8B5CF6' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerTitle}>Users</Text>

        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={[styles.statCard, { backgroundColor: stat.color }]}>
              <IconSymbol name={stat.icon} size={32} color="#FFFFFF" />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statTitle}>{stat.title}</Text>
            </View>
          ))}
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Patient Statistics</Text>
          <View style={styles.chartPlaceholder}>
            <Text style={styles.chartPlaceholderText}>Graph will be shown here</Text>
          </View>
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
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  statTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 4,
  },
  chartContainer: {
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  chartPlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E2E8F0',
    borderRadius: 8,
  },
  chartPlaceholderText: {
    color: '#64748B',
    fontSize: 16,
  },
});

export default AdminScreen;