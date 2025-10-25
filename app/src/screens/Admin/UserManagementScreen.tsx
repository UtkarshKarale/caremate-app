import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Image,
  ActivityIndicator,
  StyleSheet,
  TextInput,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getAllUsers, updateUser } from '@/lib/api';
import { useAuth } from '../context/AuthContext';
import { Box, Text, HStack, Icon, Pressable } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

export default function UserManagementScreen() {
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { user: adminUser } = useAuth();
  const userRoles = ['ALL', 'USER', 'ADMIN', 'DOCTOR', 'PATIENT', 'RECEPTIONIST'];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const fetchedUsers = (await getAllUsers()) || [];
      const otherUsers = fetchedUsers.filter((u: any) => u.id !== adminUser?.id);
      setUsers(otherUsers);
      setFilteredUsers(otherUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [adminUser?.id]);

  useEffect(() => {
    let result = users;

    if (selectedRole !== 'ALL') {
      result = result.filter(user => user.roles.includes(selectedRole));
    }

    if (searchQuery) {
      result = result.filter(user =>
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredUsers(result);
  }, [searchQuery, selectedRole, users]);

  const handleRoleChange = async (newRole: string, userId: string) => {
    const prevRole = users.find(u => u.id === userId)?.roles;

    // Optimistic update
    const updateUserInList = (list: any[]) => list.map(u => (u.id === userId ? { ...u, roles: [newRole] } : u));
    setUsers(updateUserInList);


    try {
      await updateUser(userId, { roles: newRole });
      alert('User role updated successfully');
    } catch (error) {
      console.error('Error updating role:', error);
      // Revert if fails
      const revertUserInList = (list: any[]) => list.map(u => (u.id === userId ? { ...u, roles: prevRole } : u));
      setUsers(revertUserInList);

      alert('Error updating user role');
    }
  };

  return (
    <View style={styles.container}>
      <Box bg="red.600" pb={2} pt={4} px={4} borderBottomLeftRadius={24} borderBottomRightRadius={24}>
        <HStack justifyContent="space-between" mt={5} alignItems="center" mb={6}>
          <Text fontSize="2xl" mt={6} fontWeight="bold" color="white">Users</Text>
        </HStack>
      </Box>

      <View style={styles.controlsContainer}>
        <HStack bg="white" borderWidth={1} borderColor="gray.200" borderRadius="xl" alignItems="center" style={styles.searchContainer}>
          <Icon as={MaterialIcons} name="search" size={5} color="gray.400" ml={4} />
          <TextInput
            style={styles.input}
            placeholder="Search by name or email"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </HStack>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
          {userRoles.map(role => (
            <Pressable
              key={role}
              onPress={() => setSelectedRole(role)}
              style={[styles.filterButton, selectedRole === role && styles.activeFilterButton]}
            >
              <Text style={[styles.filterButtonText, selectedRole === role && styles.activeFilterButtonText]}>{role}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : filteredUsers.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>No users found</Text>
      ) : (
        <ScrollView style={{ flex: 1, padding: 10 }}>
          {filteredUsers.map(user => {
            const currentRole = Array.isArray(user.roles)
              ? user.roles[0]
              : user.roles ?? '';

            return (
              <View key={user.id} style={styles.card}>
                {user.image ? (
                  <Image
                    source={{ uri: user.image }}
                    style={styles.avatar}
                  />
                ) : (
                  <View style={[styles.avatar, styles.initialsContainer]}>
                    <Text style={styles.initialsText}>
                      {user.fullName
                        ? user.fullName
                          .split(' ')
                          .map(name => name[0])
                          .join('')
                          .toUpperCase()
                        : 'U'}
                    </Text>
                  </View>
                )}
                <View style={{ flex: 1, marginLeft: 15 }}>
                  <Text style={styles.name}>{user.fullName || 'Unnamed'}</Text>
                  <Text style={styles.email}>{user.email || 'No email'}</Text>

                  <Picker
                    selectedValue={currentRole}
                    onValueChange={itemValue => handleRoleChange(itemValue, user.id)}
                    style={styles.picker}
                  >
                    {userRoles.filter(r => r !== 'ALL').map(role => (
                      <Picker.Item key={role} label={role} value={role} />
                    ))}
                  </Picker>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  controlsContainer: {
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  searchContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    paddingRight: 12,
    color: '#2D3748',
  },
  filterContainer: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'white',
    marginRight: 10,
  },
  activeFilterButton: {
    backgroundColor: 'red',
  },
  filterButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  activeFilterButtonText: {
    color: 'white',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  initialsContainer: {
    backgroundColor: 'red', // blue circle
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  name: { fontWeight: 'bold', fontSize: 16 },
  email: { fontSize: 14, color: 'gray', marginBottom: 5 },
  picker: { height: 50, width: 150 },
});
