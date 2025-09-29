
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { getAllUsers, updateUser } from '@/lib/api';

const AdminScreen = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const allUsers = await getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch users.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = (user) => {
    Alert.prompt(
      'Change Role',
      `Enter new role for ${user.fullName}`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async (newRole) => {
            if (newRole) {
              try {
                await updateUser(user.id, { ...user, roles: newRole.toUpperCase() });
                fetchUsers(); // Refresh the list
              } catch (error) {
                Alert.alert('Error', `Failed to update user role. ${error.message}`);
              }
            }
          },
        },
      ],
      'plain-text',
      user.roles
    );
  };

  const renderItem = ({ item }) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#333' }}>
      <View>
        <Text style={{ color: 'white', fontSize: 16 }}>{item.fullName}</Text>
        <Text style={{ color: '#999', fontSize: 12 }}>{item.email}</Text>
        <Text style={{ color: '#999', fontSize: 12 }}>Role: {item.roles}</Text>
      </View>
      <TouchableOpacity onPress={() => handleRoleChange(item)} style={{ backgroundColor: '#3B82F6', padding: 8, borderRadius: 4 }}>
        <Text style={{ color: 'white' }}>Change Role</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#111827', paddingTop: 50 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: 20 }}>User Management</Text>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default AdminScreen;
