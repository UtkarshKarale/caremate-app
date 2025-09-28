
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { signup } from '@/lib/api';
import { saveToken } from '@/lib/auth';

const DoctorSignupScreen = () => {
  const router = useRouter();
  const { name, email, password } = useLocalSearchParams();
  const [specialization, setSpecialization] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');

  const handleSignup = async () => {
    try {
      const { token } = await signup({ name, email, password, role: 'doctor', specialization, licenseNumber });
      await saveToken(token);
      router.push('/(tabs)');
    } catch (error) {
      Alert.alert('Signup Failed', 'An error occurred during signup. Please try again.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#111827' }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
        <Text style={{ fontSize: 32, fontWeight: 'bold', color: 'white', marginBottom: 32 }}>Doctor Details</Text>

        <View style={{ width: '100%', marginBottom: 16 }}>
          <Text style={{ fontSize: 16, color: '#9CA3AF', marginBottom: 8 }}>Specialization</Text>
          <TextInput
            style={{ width: '100%', height: 48, backgroundColor: '#1F2937', borderRadius: 8, paddingHorizontal: 16, fontSize: 16, color: 'white' }}
            placeholder="e.g., Cardiology"
            placeholderTextColor="#9CA3AF"
            value={specialization}
            onChangeText={setSpecialization}
          />
        </View>

        <View style={{ width: '100%', marginBottom: 24 }}>
          <Text style={{ fontSize: 16, color: '#9CA3AF', marginBottom: 8 }}>License Number</Text>
          <TextInput
            style={{ width: '100%', height: 48, backgroundColor: '#1F2937', borderRadius: 8, paddingHorizontal: 16, fontSize: 16, color: 'white' }}
            placeholder="Enter your license number"
            placeholderTextColor="#9CA3AF"
            value={licenseNumber}
            onChangeText={setLicenseNumber}
          />
        </View>

        <TouchableOpacity
          style={{ width: '100%', height: 48, backgroundColor: '#3B82F6', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}
          onPress={handleSignup}
        >
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: '#3B82F6' }}>Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default DoctorSignupScreen;
