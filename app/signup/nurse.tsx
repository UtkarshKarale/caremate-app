
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { signup } from '@/lib/api';
import { saveToken } from '@/lib/auth';

const NurseSignupScreen = () => {
  const router = useRouter();
  const { name, email, password } = useLocalSearchParams();
  const [department, setDepartment] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');

  const handleSignup = async () => {
    try {
      const { token } = await signup({ name, email, password, role: 'nurse', department, licenseNumber });
      await saveToken(token);
      router.push('/(tabs)');
    } catch (error) {
      Alert.alert('Signup Failed', 'An error occurred during signup. Please try again.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
        <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#1f2937', marginBottom: 32 }}>Nurse Details</Text>

        <View style={{ width: '100%', marginBottom: 16 }}>
          <Text style={{ fontSize: 16, color: '#4b5563', marginBottom: 8 }}>Department</Text>
          <TextInput
            style={{ width: '100%', height: 48, backgroundColor: 'white', borderRadius: 8, paddingHorizontal: 16, fontSize: 16 }}
            placeholder="e.g., Emergency Room"
            value={department}
            onChangeText={setDepartment}
          />
        </View>

        <View style={{ width: '100%', marginBottom: 24 }}>
          <Text style={{ fontSize: 16, color: '#4b5563', marginBottom: 8 }}>License Number</Text>
          <TextInput
            style={{ width: '100%', height: 48, backgroundColor: 'white', borderRadius: 8, paddingHorizontal: 16, fontSize: 16 }}
            placeholder="Enter your license number"
            value={licenseNumber}
            onChangeText={setLicenseNumber}
          />
        </View>

        <TouchableOpacity
          style={{ width: '100%', height: 48, backgroundColor: '#3b82f6', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}
          onPress={handleSignup}
        >
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: '#3b82f6' }}>Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default NurseSignupScreen;
