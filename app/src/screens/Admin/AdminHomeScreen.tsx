import React from 'react';
import { Box, Text, HStack, VStack, ScrollView, Pressable, Icon, Avatar } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

const systemStats = [
    { id: '1', label: 'Total Users', value: '1,234', icon: 'people', color: 'blue.600', bgColor: 'blue.100' },
    { id: '2', label: 'Doctors', value: '45', icon: 'medical-services', color: 'green.600', bgColor: 'green.100' },
    { id: '3', label: 'Patients', value: '1,150', icon: 'person', color: 'purple.600', bgColor: 'purple.100' },
    { id: '4', label: 'Revenue', value: '$125K', icon: 'attach-money', color: 'orange.600', bgColor: 'orange.100' },
];

const recentActivities = [
    { id: '1', user: 'Dr. Sarah Johnson', action: 'Completed 5 appointments', time: '10 mins ago', avatar: 'https://images.unsplash.com/photo-1559839734-2b716b17f7d1?w=400' },
    { id: '2', user: 'Admin Mike', action: 'Added new doctor', time: '1 hour ago', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400' },
    { id: '3', user: 'Receptionist Lisa', action: 'Processed 12 payments', time: '2 hours ago', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400' },
];

export default function AdminHomeScreen({ navigation }: any) {
    return (
        <ScrollView flex={1} bg="gray.50">
            {/* Header */}
            <Box bg="red.600" pb={6} pt={4} px={4} borderBottomLeftRadius={24} borderBottomRightRadius={24}>
                <HStack justifyContent="space-between" alignItems="center" mb={6}>
                    <VStack>
                        <Text fontSize="sm" color="red.100">Welcome back,</Text>
                        <Text fontSize="2xl" fontWeight="bold" color="white">Admin Dashboard</Text>
                        <Text fontSize="sm" color="red.100">System Overview</Text>
                    </VStack>
                    <HStack space={2}>
                        <Pressable bg="red.500" p={2} borderRadius="full">
                            <Icon as={MaterialIcons} name="notifications" size={5} color="white" />
                        </Pressable>
                        <Pressable bg="red.500" p={2} borderRadius="full">
                            <Icon as={MaterialIcons} name="settings" size={5} color="white" />
                        </Pressable>
                    </HStack>
                </HStack>

                {/* Stats Cards */}
                <HStack space={3} flexWrap="wrap">
                    {systemStats.map(stat => (
                        <Box key={stat.id} flex={1} minW="45%" bg="white" p={4} borderRadius="xl" shadow={2} mb={3}>
                            <HStack space={3} alignItems="center">
                                <Box bg={stat.bgColor} p={3} borderRadius="xl">
                                    <Icon as={MaterialIcons} name={stat.icon} size={6} color={stat.color} />
                                </Box>
                                <VStack>
                                    <Text fontSize="2xl" fontWeight="bold" color={stat.color}>{stat.value}</Text>
                                    <Text fontSize="xs" color="gray.600">{stat.label}</Text>
                                </VStack>
                            </HStack>
                        </Box>
                    ))}
                </HStack>
            </Box>

            {/* Quick Actions */}
            <Box p={4}>
                <Text fontSize="lg" fontWeight="bold" mb={4} color="gray.800">Quick Actions</Text>
                <HStack space={4} mb={4}>
                    <Pressable
                        flex={1}
                        bg="white"
                        p={6}
                        borderRadius="2xl"
                        shadow={1}
                        onPress={() => navigation.navigate('UserManagement')}
                    >
                        <VStack alignItems="center" space={2}>
                            <Box bg="blue.100" p={4} borderRadius="2xl">
                                <Icon as={MaterialIcons} name="people" size={7} color="blue.600" />
                            </Box>
                            <Text fontWeight="semibold" textAlign="center" fontSize="sm">User Management</Text>
                        </VStack>
                    </Pressable>

                    <Pressable
                        flex={1}
                        bg="white"
                        p={6}
                        borderRadius="2xl"
                        shadow={1}
                        onPress={() => navigation.navigate('ReportsAnalytics')}
                    >
                        <VStack alignItems="center" space={2}>
                            <Box bg="green.100" p={4} borderRadius="2xl">
                                <Icon as={MaterialIcons} name="analytics" size={7} color="green.600" />
                            </Box>
                            <Text fontWeight="semibold" textAlign="center" fontSize="sm">Reports & Analytics</Text>
                        </VStack>
                    </Pressable>
                </HStack>

                <HStack space={4}>
                    <Pressable
                        flex={1}
                        bg="white"
                        p={6}
                        borderRadius="2xl"
                        shadow={1}
                        onPress={() => navigation.navigate('SystemSettings')}
                    >
                        <VStack alignItems="center" space={2}>
                            <Box bg="purple.100" p={4} borderRadius="2xl">
                                <Icon as={MaterialIcons} name="settings" size={7} color="purple.600" />
                            </Box>
                            <Text fontWeight="semibold" textAlign="center" fontSize="sm">System Settings</Text>
                        </VStack>
                    </Pressable>

                    <Pressable
                        flex={1}
                        bg="white"
                        p={6}
                        borderRadius="2xl"
                        shadow={1}
                        onPress={() => navigation.navigate('BillingOverview')}
                    >
                        <VStack alignItems="center" space={2}>
                            <Box bg="orange.100" p={4} borderRadius="2xl">
                                <Icon as={MaterialIcons} name="receipt" size={7} color="orange.600" />
                            </Box>
                            <Text fontWeight="semibold" textAlign="center" fontSize="sm">Billing Overview</Text>
                        </VStack>
                    </Pressable>
                </HStack>
            </Box>

            {/* Recent Activities */}
            <Box px={4} pb={24}>
                <HStack justifyContent="space-between" alignItems="center" mb={4}>
                    <Text fontSize="lg" fontWeight="bold" color="gray.800">Recent Activities</Text>
                    <Text fontSize="sm" fontWeight="semibold" color="red.600">View All</Text>
                </HStack>

                {recentActivities.map(activity => (
                    <Box key={activity.id} bg="white" p={4} borderRadius="xl" shadow={1} mb={3}>
                        <HStack space={3} alignItems="center">
                            <Avatar size="md" source={{ uri: activity.avatar }} />
                            <VStack flex={1}>
                                <Text fontWeight="bold" fontSize="md">{activity.user}</Text>
                                <Text fontSize="sm" color="gray.600">{activity.action}</Text>
                                <Text fontSize="xs" color="gray.500" mt={1}>{activity.time}</Text>
                            </VStack>
                            <Icon as={MaterialIcons} name="chevron-right" size={6} color="gray.400" />
                        </HStack>
                    </Box>
                ))}
            </Box>
        </ScrollView>
    );
}
