import React from 'react';
import { Box, Text, HStack, VStack, ScrollView, Pressable, Icon, Avatar } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

export default function ReceptionistProfileScreen({ navigation }: any) {
    const menuItems = [
        { id: '1', title: 'Edit Profile', icon: 'edit', color: 'blue.600' },
        { id: '2', title: 'Work Schedule', icon: 'schedule', color: 'purple.600' },
        { id: '3', title: 'Quick Actions', icon: 'flash-on', color: 'orange.600' },
        { id: '4', title: 'Notifications', icon: 'notifications', color: 'green.600' },
        { id: '5', title: 'Settings', icon: 'settings', color: 'gray.600' },
        { id: '6', title: 'Help & Support', icon: 'help', color: 'blue.500' },
        { id: '7', title: 'Logout', icon: 'logout', color: 'red.600' },
    ];

    return (
        <ScrollView flex={1} bg="gray.50">
            {/* Header */}
            <Box bg="purple.600" pb={12} pt={4} px={4} borderBottomLeftRadius={24} borderBottomRightRadius={24}>
                <HStack justifyContent="space-between" alignItems="center" mb={6}>
                    <Text fontSize="2xl" fontWeight="bold" color="white">My Profile</Text>
                    <Pressable bg="purple.500" p={2} borderRadius="full">
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
                            source={{ uri: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400' }}
                            borderWidth={4}
                            borderColor="purple.600"
                        />
                        <VStack alignItems="center">
                            <Text fontSize="2xl" fontWeight="bold">Jessica Martinez</Text>
                            <Text fontSize="md" color="gray.600">Front Desk Receptionist</Text>
                            <Text fontSize="sm" color="gray.500" mt={1}>City General Hospital</Text>
                        </VStack>

                        {/* Stats */}
                        <HStack space={6} mt={4} w="100%" justifyContent="center">
                            <VStack alignItems="center">
                                <Text fontSize="2xl" fontWeight="bold" color="purple.600">234</Text>
                                <Text fontSize="xs" color="gray.600">Check-Ins</Text>
                            </VStack>
                            <Box w="1px" bg="gray.300" />
                            <VStack alignItems="center">
                                <Text fontSize="2xl" fontWeight="bold" color="blue.600">3</Text>
                                <Text fontSize="xs" color="gray.600">Years</Text>
                            </VStack>
                            <Box w="1px" bg="gray.300" />
                            <VStack alignItems="center">
                                <Text fontSize="2xl" fontWeight="bold" color="green.600">98%</Text>
                                <Text fontSize="xs" color="gray.600">Rating</Text>
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