import React from 'react';
import { Box, Text, HStack, VStack, ScrollView, Pressable, Icon, Avatar } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import {useAuth} from "@/app/src/screens/context/AuthContext";


export default function AdminProfileScreen({ navigation }: any) {
    const { logout } = useAuth();

    const menuItems = [
        { id: '1', title: 'Edit Profile', icon: 'edit', color: 'blue.600', screen: 'EditAdminProfile' },
        { id: '2', title: 'System Settings', icon: 'settings', color: 'purple.600', screen: 'SystemSettings' },
        { id: '3', title: 'Security', icon: 'security', color: 'green.600', screen: 'SecuritySettings' },
        { id: '4', title: 'Backup & Restore', icon: 'backup', color: 'orange.600', screen: 'BackupRestore' },
        { id: '5', title: 'Activity Log', icon: 'history', color: 'blue.500', screen: 'ActivityLog' },
        { id: '6', title: 'Notifications', icon: 'notifications', color: 'yellow.600', screen: 'NotificationSettings' },
        { id: '7', title: 'Help & Support', icon: 'help', color: 'cyan.600', screen: 'HelpSupport' },
        { id: '8', title: 'About System', icon: 'info', color: 'gray.600', screen: 'AboutSystem' },
        { id: '9', title: 'Logout', icon: 'logout', color: 'red.600', action: 'logout' },
    ];

    const handleMenuPress = async (item: any) => {
        if (item.action === 'logout') {
            await logout();
        } else if (item.screen) {
            navigation.navigate(item.screen);
        }
    };

    return (
        <ScrollView flex={1} bg="gray.50">
            {/* Header */}
            <Box bg="red.600" pb={12} pt={4} px={4} borderBottomLeftRadius={24} borderBottomRightRadius={24}>
                <HStack justifyContent="space-between" alignItems="center" mb={6}>
                    <Text fontSize="2xl" fontWeight="bold" color="white">Admin Profile</Text>
                    <Pressable bg="red.500" p={2} borderRadius="full">
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
                            source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400' }}
                            borderWidth={4}
                            borderColor="red.600"
                        >
                            <Avatar.Badge bg="green.500" />
                        </Avatar>
                        <VStack alignItems="center">
                            <Text fontSize="2xl" fontWeight="bold">Admin Mike</Text>
                            <Text fontSize="md" color="gray.600">System Administrator</Text>
                            <Text fontSize="sm" color="gray.500" mt={1}>admin@hospital.com</Text>
                        </VStack>

                        {/* Stats */}
                        <HStack space={6} mt={4} w="100%" justifyContent="center">
                            <VStack alignItems="center">
                                <Text fontSize="2xl" fontWeight="bold" color="red.600">1,234</Text>
                                <Text fontSize="xs" color="gray.600">Total Users</Text>
                            </VStack>
                            <Box w="1px" bg="gray.300" />
                            <VStack alignItems="center">
                                <Text fontSize="2xl" fontWeight="bold" color="blue.600">45</Text>
                                <Text fontSize="xs" color="gray.600">Doctors</Text>
                            </VStack>
                            <Box w="1px" bg="gray.300" />
                            <VStack alignItems="center">
                                <Text fontSize="2xl" fontWeight="bold" color="green.600">98%</Text>
                                <Text fontSize="xs" color="gray.600">Uptime</Text>
                            </VStack>
                        </HStack>

                        {/* Admin Badge */}
                        <HStack space={2} mt={3}>
                            <Box bg="red.100" px={3} py={1} borderRadius="full">
                                <Text fontSize="xs" fontWeight="bold" color="red.700">SUPER ADMIN</Text>
                            </Box>
                            <Box bg="green.100" px={3} py={1} borderRadius="full">
                                <Text fontSize="xs" fontWeight="bold" color="green.700">FULL ACCESS</Text>
                            </Box>
                        </HStack>
                    </VStack>
                </Box>

                {/* Quick Info */}
                <Box bg="white" borderRadius="xl" shadow={1} p={6} mb={4}>
                    <Text fontSize="md" fontWeight="bold" mb={4}>Account Information</Text>
                    <VStack space={3}>
                        <HStack justifyContent="space-between">
                            <Text fontSize="sm" color="gray.600">User ID:</Text>
                            <Text fontSize="sm" fontWeight="semibold">ADMIN-001</Text>
                        </HStack>
                        <HStack justifyContent="space-between">
                            <Text fontSize="sm" color="gray.600">Role:</Text>
                            <Text fontSize="sm" fontWeight="semibold">Super Administrator</Text>
                        </HStack>
                        <HStack justifyContent="space-between">
                            <Text fontSize="sm" color="gray.600">Last Login:</Text>
                            <Text fontSize="sm" fontWeight="semibold">Today, 09:30 AM</Text>
                        </HStack>
                        <HStack justifyContent="space-between">
                            <Text fontSize="sm" color="gray.600">Member Since:</Text>
                            <Text fontSize="sm" fontWeight="semibold">Jan 2020</Text>
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
