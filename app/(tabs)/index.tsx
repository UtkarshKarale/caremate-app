
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { getToken, deleteToken } from '@/lib/auth';
import { findUserById } from '@/lib/api';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'expo-router';

const HomeScreen = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await getToken();
        if (token) {
          const decodedToken = jwtDecode(token);
          console.log('Decoded Token:', decodedToken);
          const userId = decodedToken.userId; // Assuming the user ID is in the 'userId' claim
          console.log('User ID:', userId);
          const userData = await findUserById(userId);
          setUser(userData);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch user data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await deleteToken();
    router.push('/login');
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111827' }}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111827' }}>
        <Text style={{ color: 'white', fontSize: 18 }}>Could not load user data.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#111827', padding: 32, paddingTop: 80 }}>
      <Text style={{ fontSize: 32, fontWeight: 'bold', color: 'white', marginBottom: 16 }}>
        {user.roles === 'ADMIN' ? 'Welcome Admin!' : `Welcome, ${user.fullName}!`}
      </Text>
      <View style={{ backgroundColor: '#1F2937', borderRadius: 8, padding: 16 }}>
        <Text style={{ fontSize: 18, color: 'white', marginBottom: 8 }}>Email: {user.email}</Text>
        <Text style={{ fontSize: 18, color: 'white', marginBottom: 8 }}>Mobile: {user.mobile}</Text>
        <Text style={{ fontSize: 18, color: 'white' }}>Role: {user.roles}</Text>
      </View>
      <TouchableOpacity
        style={{ position: 'absolute', top: 40, right: 20 }}
        onPress={handleLogout}
      >
        <Text style={{ color: '#3B82F6', fontSize: 16 }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
