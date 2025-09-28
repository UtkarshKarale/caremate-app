
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
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
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1 justify-center items-center p-8">
        <Text className="text-4xl font-bold text-gray-800 mb-8">Welcome Back</Text>

        <View className="w-full mb-4">
          <Text className="text-lg text-gray-600 mb-2">Email</Text>
          <TextInput
            className="w-full h-12 bg-white rounded-lg px-4 text-lg"
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View className="w-full mb-6">
          <Text className="text-lg text-gray-600 mb-2">Password</Text>
          <TextInput
            className="w-full h-12 bg-white rounded-lg px-4 text-lg"
            placeholder="Enter your password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity>
            <Text className="text-right text-blue-500 mt-2">Forgot password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="w-full h-12 bg-blue-500 rounded-lg justify-center items-center mb-4"
          onPress={handleLogin}
        >
          <Text className="text-white text-lg font-bold">Login</Text>
        </TouchableOpacity>

        <View className="flex-row">
          <Text className="text-gray-600">Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/signup')}>
            <Text className="text-blue-500">Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
