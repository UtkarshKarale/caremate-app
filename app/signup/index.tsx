
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

const SignupScreen = () => {
  const router = useRouter();
  const [role, setRole] = useState('doctor');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleContinue = () => {
    router.push({
      pathname: `/signup/${role}`,
      params: { name, email, password },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#111827' }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
        <Text style={{ fontSize: 32, fontWeight: 'bold', color: 'white', marginBottom: 32 }}>Create Account</Text>

        <View style={{ width: '100%', marginBottom: 16 }}>
          <Text style={{ fontSize: 16, color: '#9CA3AF', marginBottom: 8 }}>Full Name</Text>
          <TextInput
            style={{ width: '100%', height: 48, backgroundColor: '#1F2937', borderRadius: 8, paddingHorizontal: 16, fontSize: 16, color: 'white' }}
            placeholder="Enter your full name"
            placeholderTextColor="#9CA3AF"
            value={name}
            onChangeText={setName}
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

        <View style={{ width: '100%', marginBottom: 24 }}>
          <Text style={{ fontSize: 16, color: '#9CA3AF', marginBottom: 8 }}>Role</Text>
          <View style={{ width: '100%', height: 48, backgroundColor: '#1F2937', borderRadius: 8, justifyContent: 'center' }}>
            <Picker
              selectedValue={role}
              onValueChange={(itemValue) => setRole(itemValue)}
              style={{ height: 48, width: '100%', color: 'white' }}
              itemStyle={{ color: 'white' }}
            >
              <Picker.Item label="Doctor" value="doctor" />
              <Picker.Item label="Nurse" value="nurse" />
              <Picker.Item label="Receptionist" value="receptionist" />
            </Picker>
          </View>
        </View>

        <TouchableOpacity
          style={{ width: '100%', height: 48, backgroundColor: '#3B82F6', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}
          onPress={handleContinue}
        >
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Continue</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row' }}>
          <Text style={{ color: '#9CA3AF' }}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={{ color: '#3B82F6' }}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignupScreen;
