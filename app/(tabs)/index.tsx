import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter, useFocusEffect } from 'expo-router';
import { getUser } from '@/lib/auth';
import { User } from '@/lib/schema';

const hospitals = [
  { id: '1', name: 'City General Hospital', location: '123 Main St, Anytown', rating: 4.5 },
  { id: '2', name: 'Sunrise Medical Center', location: '456 Oak Ave, Anytown', rating: 4.8 },
  { id: '3', name: 'Evergreen Health', location: '789 Pine Ln, Anytown', rating: 4.2 },
];

const PatientDashboard = () => {
  const router = useRouter();

  const renderItem = ({ item }) => (
    <View style={styles.hospitalCard}>
      <View style={styles.hospitalInfo}>
        <Text style={styles.hospitalName}>{item.name}</Text>
        <Text style={styles.hospitalLocation}>{item.location}</Text>
        <View style={styles.ratingContainer}>
          <IconSymbol name="star.fill" size={16} color="#F59E0B" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.bookButton}>
        <Text style={styles.bookButtonText}>Book</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Find a Hospital</Text>
          <TouchableOpacity style={styles.bookAppointmentButton} onPress={() => router.push('/book-appointment')}>
            <Text style={styles.bookAppointmentButtonText}>Book Appointment</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.searchContainer}>
          <IconSymbol name="magnifyingglass" size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for hospitals, doctors..."
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <FlatList
          data={hospitals}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const DoctorDashboard = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Doctor Dashboard</Text>
      {/* Doctor specific content goes here */}
    </View>
  );
};

const AdminDashboard = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Admin Dashboard</Text>
      {/* Admin specific content goes here */}
    </View>
  );
};

export default function IndexScreen() {
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    // This case should ideally be handled by _layout.tsx redirect
    return <Text>Error: User not found.</Text>;
  }

  switch (user.role?.toLowerCase()) {
    case 'patient':
      return <PatientDashboard />;
    case 'doctor':
      return <DoctorDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <Text>Unknown Role</Text>;
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50, // Increased top padding
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  bookAppointmentButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  bookAppointmentButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#1E293B',
  },
  hospitalCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  hospitalInfo: {
    flex: 1,
  },
  hospitalName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  hospitalLocation: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#475569',
  },
  bookButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

// export default UserScreen;