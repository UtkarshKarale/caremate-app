
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getUser, updateUser } from '@/lib/api'; // Assuming you have these API functions
import { Picker } from '@react-native-picker/picker';

const EditUserScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('patient');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (id) {
      fetchUser(id);
    }
  }, [id]);

  const fetchUser = async (userId) => {
    try {
      const user = await getUser(userId);
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
      setIsActive(user.isActive);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch user details.');
    }
  };

  const handleUpdateUser = async () => {
    if (!name || !email) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }
    try {
      await updateUser(id, { name, email, role, isActive });
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to update user.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#111827' }}>
      <View style={{ flex: 1, padding: 32 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 32 }}>Edit User</Text>

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

        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <Text style={{ fontSize: 16, color: '#9CA3AF' }}>Active</Text>
          <Switch
            value={isActive}
            onValueChange={setIsActive}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isActive ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>

        <TouchableOpacity
          style={{ width: '100%', height: 48, backgroundColor: '#3B82F6', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}
          onPress={handleUpdateUser}
        >
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Update User</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: '#3B82F6', textAlign: 'center' }}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default EditUserScreen;
