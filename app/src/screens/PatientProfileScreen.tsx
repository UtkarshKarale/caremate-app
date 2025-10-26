import React, { useState, useEffect } from 'react';
import { Box, Text, HStack, VStack, ScrollView, Pressable, Icon, Avatar, Spinner } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from "@/app/src/screens/context/AuthContext";
import { getAllUsers } from '@/lib/api';

export default function PatientProfileScreen({ navigation }: any) {
    const { user, logout } = useAuth();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const fetchedUsers = (await getAllUsers()) || [];
                setUsers(fetchedUsers);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const totalUsers = users.length;
    const totalDoctors = users.filter(u => u.roles.includes('DOCTOR')).length;

    const menuItems = [
        { id: '1', title: 'Edit Profile', icon: 'edit', color: 'blue.600', screen: 'EditUserScreen' },
        { id: '9', title: 'Logout', icon: 'logout', color: 'red.600', action: 'logout' },
    ];

    const handleMenuPress = async (item: any) => {
        if (item.action === 'logout') {
            await logout();
        } else if (item.screen) {
            navigation.navigate(item.screen);
        }
    };

    if (loading) {
        return (
            <Box flex={1} justifyContent="center" alignItems="center">
                <Spinner size="lg" />
            </Box>
        );
    }

    return (
        <ScrollView flex={1} bg="gray.50">
            {/* Header */}
            <Box bg="blue.600" pb={12} pt={4} px={4} borderBottomLeftRadius={24} borderBottomRightRadius={24}>
                <HStack justifyContent="space-between"mt={5} alignItems="center" mb={6}>
                    <Text fontSize="2xl" fontWeight="bold" color="white">My Profile</Text>
                    <Pressable bg="blue.500" p={2} borderRadius="full">
                        <Icon as={MaterialIcons} name="settings" size={5} color="white" />
                    </Pressable>
                </HStack>
            </Box>

            {/* Profile Card */}
            <Box px={4} mt={-10}>
                <Box bg="white" borderRadius="2xl" shadow={4} p={6} mb={4}>
                    <VStack alignItems="center" space={3}>
                        <Avatar
                            size="2xl"
                            source={{ uri: user?.image || undefined }}
                            borderWidth={4}
                            borderColor="blue.600"
                        >
                            {user?.name? user.name?.charAt(0).toUpperCase() : 'P'}
                            <Avatar.Badge bg="green.500" />
                        </Avatar>
                        <VStack alignItems="center">
                            <Text fontSize="2xl" fontWeight="bold">{user?.name || 'Admin User'}</Text>
                            <Text fontSize="sm" color="gray.500" mt={1}>{user?.email || 'N/A'}</Text>
                        </VStack>

                    </VStack>
                </Box>

                {/* Quick Info */}
                <Box bg="white" borderRadius="xl" shadow={1} p={6} mb={4}>
                    <Text fontSize="md" fontWeight="bold" mb={4}>Account Information</Text>
                    <VStack space={3}>
                        <HStack justifyContent="space-between">
                            <Text fontSize="sm" color="gray.600">User ID:</Text>
                            <Text fontSize="sm" fontWeight="semibold"> user_{ user?.id || 'N/A'}</Text>
                        </HStack>
                        <HStack justifyContent="space-between">
                            <Text fontSize="sm" color="gray.600">Role:</Text>
                            <Text fontSize="sm" fontWeight="semibold">{user?.role || 'N/A'}</Text>
                        </HStack>
                        <HStack justifyContent="space-between">
                            <Text fontSize="sm" color="gray.600">Member Since:</Text>
                            <Text fontSize="sm" fontWeight="semibold">{user?.createdOn ? new Date(user.createdOn).toLocaleDateString() : 'N/A'}</Text>
                        </HStack>
                        <HStack justifyContent="space-between">
                            <Text fontSize="sm" color="gray.600">Account Status:</Text>
                            <Box bg="green.100" px={2} py={1} borderRadius="md">
                                <Text fontSize="xs" fontWeight="semibold" color="green.700">Active</Text>
                            </Box>
                        </HStack>
                    </VStack>
                </Box>

                {/* Menu Items */}
                <VStack space={3} mb={24}>
                    {menuItems.map(item => (
                        <Pressable key={item.id} onPress={() => handleMenuPress(item)}>
                            <Box bg="white" borderRadius="xl" shadow={1} p={4}>
                                <HStack alignItems="center" space={3}>
                                    <Box bg={`${item.color.split('.')[0]}.100`} p={3} borderRadius="xl">
                                        <Icon as={MaterialIcons} name={item.icon} size={6} color={item.color} />
                                    </Box>
                                    <Text flex={1} fontSize="md" fontWeight="semibold">{item.title}</Text>
                                    <Icon as={MaterialIcons} name="chevron-right" size={6} color="gray.400" />
                                </HStack>
                            </Box>
                        </Pressable>
                    ))}
                </VStack>
            </Box>
        </ScrollView>
    );
}
