
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { login } from '@/lib/api';
import { saveToken } from '@/lib/auth';

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const { token } = await login(email, password);
      await saveToken(token);
      router.push('/(tabs)');
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#111827' }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
        {/* Replace with your logo */}
        <Image
          source={{ uri: 'https://via.placeholder.com/150' }} // Replace with your logo URL or local image
          style={{ width: 150, height: 150, marginBottom: 32 }}
        />

        <Text style={{ fontSize: 32, fontWeight: 'bold', color: 'white', marginBottom: 32 }}>Welcome Back</Text>

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

        <View style={{ width: '100%', marginBottom: 24 }}>
          <Text style={{ fontSize: 16, color: '#9CA3AF', marginBottom: 8 }}>Password</Text>
          <TextInput
            style={{ width: '100%', height: 48, backgroundColor: '#1F2937', borderRadius: 8, paddingHorizontal: 16, fontSize: 16, color: 'white' }}
            placeholder="Enter your password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity>
            <Text style={{ textAlign: 'right', color: '#3B82F6', marginTop: 8 }}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={{ width: '100%', height: 48, backgroundColor: '#3B82F6', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}
          onPress={handleLogin}
        >
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Login</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row' }}>
          <Text style={{ color: '#9CA3AF' }}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/signup')}>
            <Text style={{ color: '#3B82F6' }}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
