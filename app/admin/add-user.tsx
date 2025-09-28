
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { addUser } from '@/lib/api';
import { Picker } from '@react-native-picker/picker';

const AddUserScreen = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');

  const handleAddUser = async () => {
    if (!name || !email || !password) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }
    try {
      await addUser({ name, email, password, role });
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to add user.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#111827' }}>
      <View style={{ flex: 1, padding: 32 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 32 }}>Add New User</Text>

        <View style={{ width: '100%', marginBottom: 16 }}>
          <Text style={{ fontSize: 16, color: '#9CA3AF', marginBottom: 8 }}>Full Name</Text>
          <TextInput
            style={{ width: '100%', height: 48, backgroundColor: '#1F2937', borderRadius: 8, paddingHorizontal: 16, fontSize: 16, color: 'white' }}
            placeholder="Enter full name"
            placeholderTextColor="#9CA3AF"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={{ width: '100%', marginBottom: 16 }}>
          <Text style={{ fontSize: 16, color: '#9CA3AF', marginBottom: 8 }}>Email</Text>
          <TextInput
            style={{ width: '100%', height: 48, backgroundColor: '#1F2937', borderRadius: 8, paddingHorizontal: 16, fontSize: 16, color: 'white' }}
            placeholder="Enter email"
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
            placeholder="Enter password"
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
              <Picker.Item label="Patient" value="patient" />
              <Picker.Item label="Doctor" value="doctor" />
              <Picker.Item label="Receptionist" value="receptionist" />
              <Picker.Item label="Admin" value="admin" />
            </Picker>
          </View>
        </View>

        <TouchableOpacity
          style={{ width: '100%', height: 48, backgroundColor: '#3B82F6', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}
          onPress={handleAddUser}
        >
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Add User</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: '#3B82F6', textAlign: 'center' }}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AddUserScreen;
