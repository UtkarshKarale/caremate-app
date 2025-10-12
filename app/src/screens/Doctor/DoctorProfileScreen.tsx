import React from 'react';
import { Box, Text, HStack, VStack, ScrollView, Pressable, Icon, Avatar } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

export default function DoctorProfileScreen({ navigation }: any) {
    const menuItems = [
        { id: '1', title: 'Edit Profile', icon: 'edit', color: 'blue.600' },
        { id: '2', title: 'Availability', icon: 'event-available', color: 'green.600' },
        { id: '3', title: 'Specializations', icon: 'school', color: 'purple.600' },
        { id: '4', title: 'Notifications', icon: 'notifications', color: 'orange.600' },
        { id: '5', title: 'Settings', icon: 'settings', color: 'gray.600' },
        { id: '6', title: 'Help & Support', icon: 'help', color: 'blue.500' },
        { id: '7', title: 'Logout', icon: 'logout', color: 'red.600' },
    ];

    return (
        <ScrollView flex={1} bg="gray.50">
            {/* Header */}
            <Box bg="green.600" pb={12} pt={4} px={4} borderBottomLeftRadius={24} borderBottomRightRadius={24}>
                <HStack justifyContent="space-between" alignItems="center" mb={6}>
                    <Text fontSize="2xl" fontWeight="bold" color="white">My Profile</Text>
                    <Pressable bg="green.500" p={2} borderRadius="full">
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
                            source={{ uri: 'https://images.unsplash.com/photo-1559839734-2b716b17f7d1?w=400' }}
                            borderWidth={4}
                            borderColor="green.600"
                        />
                        <VStack alignItems="center">
                            <Text fontSize="2xl" fontWeight="bold">Dr. Sarah Johnson</Text>
                            <Text fontSize="md" color="gray.600">Cardiologist</Text>
                            <HStack space={1} alignItems="center" mt={1}>
                                <Icon as={MaterialIcons} name="star" size={5} color="yellow.400" />
                                <Text fontSize="md" fontWeight="semibold">4.8</Text>
                                <Text fontSize="sm" color="gray.500">(245 reviews)</Text>
                            </HStack>
                        </VStack>

                        {/* Stats */}
                        <HStack space={6} mt={4}>
                            <VStack alignItems="center">
                                <Text fontSize="2xl" fontWeight="bold" color="green.600">1,234</Text>
                                <Text fontSize="xs" color="gray.600">Patients</Text>
                            </VStack>
                            <Box w="1px" bg="gray.300" />
                            <VStack alignItems="center">
                                <Text fontSize="2xl" fontWeight="bold" color="blue.600">12</Text>
                                <Text fontSize="xs" color="gray.600">Years Exp.</Text>
                            </VStack>
                            <Box w="1px" bg="gray.300" />
                            <VStack alignItems="center">
                                <Text fontSize="2xl" fontWeight="bold" color="purple.600">98%</Text>
                                <Text fontSize="xs" color="gray.600">Success</Text>
                            </VStack>
                        </HStack>
                    </VStack>
                </Box>

                {/* Menu Items */}
                <VStack space={3} mb={24}>
                    {menuItems.map(item => (
                        <Pressable key={item.id}>
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