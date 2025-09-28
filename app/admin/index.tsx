
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { getUsers, deleteUser } from '@/lib/api'; // Assuming you have these API functions

const AdminDashboard = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch users.');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      fetchUsers(); // Refresh the list
    } catch (error) {
      Alert.alert('Error', 'Failed to delete user.');
    }
  };

  const renderUser = ({ item }) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#374151' }}>
      <View>
        <Text style={{ color: 'white', fontSize: 16 }}>{item.name}</Text>
        <Text style={{ color: '#9CA3AF', fontSize: 14 }}>{item.email}</Text>
        <Text style={{ color: '#9CA3AF', fontSize: 14 }}>Role: {item.role}</Text>
        <Text style={{ color: item.isActive ? '#10B981' : '#EF4444', fontSize: 14 }}>
          {item.isActive ? 'Active' : 'Disabled'}
        </Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={() => router.push(`/admin/edit-user/${item.id}`)} style={{ marginRight: 16 }}>
          <Text style={{ color: '#3B82F6' }}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteUser(item.id)}>
          <Text style={{ color: '#EF4444' }}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#111827' }}>
      <View style={{ padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>Admin Dashboard</Text>
        <TouchableOpacity onPress={() => router.push('/admin/add-user')}>
          <Text style={{ color: '#3B82F6', fontSize: 16 }}>Add User</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={(item) => item.id.toString()}
      />
    </SafeAreaView>
  );
};

export default AdminDashboard;
