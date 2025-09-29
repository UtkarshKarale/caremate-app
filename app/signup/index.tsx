
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { register } from '@/lib/api';

const SignupScreen = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');

  const handleSignup = async () => {
    try {
      await register({ fullName, email, password, mobile, roles: 'USER' });
      Alert.alert('Success', 'User registered successfully. Please login.');
      router.push('/login');
    } catch (error) {
      Alert.alert('Signup Failed', 'An error occurred during signup. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: '#111827' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
          <Text style={{ fontSize: 32, fontWeight: 'bold', color: 'white', marginBottom: 32 }}>Create Account</Text>

          <View style={{ width: '100%', marginBottom: 16 }}>
            <Text style={{ fontSize: 16, color: '#9CA3AF', marginBottom: 8 }}>Full Name</Text>
            <TextInput
              style={{ width: '100%', height: 48, backgroundColor: '#1F2937', borderRadius: 8, paddingHorizontal: 16, fontSize: 16, color: 'white' }}
              placeholder="Enter your full name"
              placeholderTextColor="#9CA3AF"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <View style={{ width: '100%', marginBottom: 16 }}>
            <Text style={{ fontSize: 16, color: '#9CA3AF', marginBottom: 8 }}>Email</Text>
            <TextInput
              style={{ width: '100%', height: 48, backgroundColor: '#1F2937', borderRadius: 8, paddingHorizontal: 16, fontSize: 16, color: 'white' }}
              placeholder="Enter your email"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={{ width: '100%', marginBottom: 16 }}>
            <Text style={{ fontSize: 16, color: '#9CA3AF', marginBottom: 8 }}>Mobile Number</Text>
            <TextInput
              style={{ width: '100%', height: 48, backgroundColor: '#1F2937', borderRadius: 8, paddingHorizontal: 16, fontSize: 16, color: 'white' }}
              placeholder="Enter your mobile number"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
              value={mobile}
              onChangeText={setMobile}
            />
          </View>

          <View style={{ width: '100%', marginBottom: 16 }}>
            <Text style={{ fontSize: 16, color: '#9CA3AF', marginBottom: 8 }}>Password</Text>
            <TextInput
              style={{ width: '100%', height: 48, backgroundColor: '#1F2937', borderRadius: 8, paddingHorizontal: 16, fontSize: 16, color: 'white' }}
              placeholder="Enter your password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity
            style={{ width: '100%', height: 48, backgroundColor: '#3B82F6', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}
            onPress={handleSignup}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Sign Up</Text>
          </TouchableOpacity>

          <View style={{ flexDirection: 'row' }}>
            <Text style={{ color: '#9CA3AF' }}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={{ color: '#3B82F6' }}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;
