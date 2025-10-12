import React from 'react';
import { Box, Text, HStack, VStack, ScrollView, Pressable, Badge, Icon, Avatar } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

const todayAppointments = [
    { id: '1', patient: 'John Smith', time: '09:00 AM', type: 'Check-up', status: 'Waiting', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400' },
    { id: '2', patient: 'Emma Wilson', time: '10:30 AM', type: 'Follow-up', status: 'In Progress', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400' },
    { id: '3', patient: 'Michael Brown', time: '11:00 AM', type: 'Consultation', status: 'Scheduled', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
    { id: '4', patient: 'Sarah Davis', time: '02:00 PM', type: 'Emergency', status: 'Urgent', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400' },
];

export default function DoctorHomeScreen({ navigation }: any) {
    return (
        <ScrollView flex={1} bg="gray.50">
            {/* Header */}
            <Box bg="green.600" pb={6} pt={4} px={4} borderBottomLeftRadius={24} borderBottomRightRadius={24}>
                <HStack justifyContent="space-between" alignItems="center" mb={6}>
                    <VStack>
                        <Text fontSize="sm" color="green.100">Welcome back,</Text>
                        <Text fontSize="2xl" fontWeight="bold" color="white">Dr. Sarah Johnson</Text>
                        <Text fontSize="sm" color="green.100">Cardiologist</Text>
                    </VStack>
                    <HStack space={2}>
                        <Pressable bg="green.500" p={2} borderRadius="full">
                            <Icon as={MaterialIcons} name="notifications" size={5} color="white" />
                            <Badge
                                position="absolute"
                                top={-1}
                                right={-1}
                                bg="red.500"
                                borderRadius="full"
                                _text={{ fontSize: 'xs', color: 'white' }}
                            >
                                3
                            </Badge>
                        </Pressable>
                        <Pressable bg="green.500" p={2} borderRadius="full">
                            <Icon as={MaterialIcons} name="settings" size={5} color="white" />
                        </Pressable>
                    </HStack>
                </HStack>

                {/* Stats Cards */}
                <HStack space={3}>
                    <Box flex={1} bg="white" p={4} borderRadius="xl" shadow={2}>
                        <VStack space={1}>
                            <Text fontSize="2xl" fontWeight="bold" color="green.600">12</Text>
                            <Text fontSize="xs" color="gray.600">Today's Patients</Text>
                        </VStack>
                    </Box>
                    <Box flex={1} bg="white" p={4} borderRadius="xl" shadow={2}>
                        <VStack space={1}>
                            <Text fontSize="2xl" fontWeight="bold" color="blue.600">8</Text>
                            <Text fontSize="xs" color="gray.600">Completed</Text>
                        </VStack>
                    </Box>
                    <Box flex={1} bg="white" p={4} borderRadius="xl" shadow={2}>
                        <VStack space={1}>
                            <Text fontSize="2xl" fontWeight="bold" color="orange.600">4</Text>
                            <Text fontSize="xs" color="gray.600">Pending</Text>
                        </VStack>
                    </Box>
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
                        onPress={() => navigation.navigate('DoctorAppointments')}
                    >
                        <VStack alignItems="center" space={2}>
                            <Box bg="green.100" p={4} borderRadius="2xl">
                                <Icon as={MaterialIcons} name="calendar-today" size={7} color="green.600" />
                            </Box>
                            <Text fontWeight="semibold" textAlign="center" fontSize="sm">Appointments</Text>
                        </VStack>
                    </Pressable>

                    <Pressable
                        flex={1}
                        bg="white"
                        p={6}
                        borderRadius="2xl"
                        shadow={1}
                        onPress={() => navigation.navigate('DoctorPatients')}
                    >
                        <VStack alignItems="center" space={2}>
                            <Box bg="blue.100" p={4} borderRadius="2xl">
                                <Icon as={MaterialIcons} name="people" size={7} color="blue.600" />
                            </Box>
                            <Text fontWeight="semibold" textAlign="center" fontSize="sm">My Patients</Text>
                        </VStack>
                    </Pressable>
                </HStack>

                <HStack space={4}>
                    <Pressable flex={1} bg="white" p={6} borderRadius="2xl" shadow={1}>
                        <VStack alignItems="center" space={2}>
                            <Box bg="purple.100" p={4} borderRadius="2xl">
                                <Icon as={MaterialIcons} name="analytics" size={7} color="purple.600" />
                            </Box>
                            <Text fontWeight="semibold" textAlign="center" fontSize="sm">Reports</Text>
                        </VStack>
                    </Pressable>

                    <Pressable flex={1} bg="white" p={6} borderRadius="2xl" shadow={1}>
                        <VStack alignItems="center" space={2}>
                            <Box bg="orange.100" p={4} borderRadius="2xl">
                                <Icon as={MaterialIcons} name="medication" size={7} color="orange.600" />
                            </Box>
                            <Text fontWeight="semibold" textAlign="center" fontSize="sm">Prescriptions</Text>
                        </VStack>
                    </Pressable>
                </HStack>
            </Box>

            {/* Today's Appointments */}
            <Box px={4} pb={24}>
                <HStack justifyContent="space-between" alignItems="center" mb={4}>
                    <Text fontSize="lg" fontWeight="bold" color="gray.800">Today's Schedule</Text>
                    <Pressable onPress={() => navigation.navigate('DoctorAppointments')}>
                        <Text fontSize="sm" fontWeight="semibold" color="green.600">View All</Text>
                    </Pressable>
                </HStack>

                {todayAppointments.map(apt => (
                    <Pressable key={apt.id}>
                        <Box bg="white" p={4} borderRadius="xl" shadow={1} mb={3}>
                            <HStack space={3} alignItems="center">
                                <Avatar size="md" source={{ uri: apt.avatar }} />
                                <VStack flex={1}>
                                    <Text fontWeight="bold" fontSize="md">{apt.patient}</Text>
                                    <Text fontSize="sm" color="gray.600">{apt.type}</Text>
                                    <HStack alignItems="center" space={1} mt={1}>
                                        <Icon as={MaterialIcons} name="access-time" size={4} color="gray.500" />
                                        <Text fontSize="sm" color="gray.500">{apt.time}</Text>
                                    </HStack>
                                </VStack>
                                <Badge
                                    bg={
                                        apt.status === 'Urgent' ? 'red.100' :
                                            apt.status === 'In Progress' ? 'blue.100' :
                                                apt.status === 'Waiting' ? 'yellow.100' : 'green.100'
                                    }
                                    _text={{
                                        color:
                                            apt.status === 'Urgent' ? 'red.700' :
                                                apt.status === 'In Progress' ? 'blue.700' :
                                                    apt.status === 'Waiting' ? 'yellow.700' : 'green.700',
                                        fontWeight: 'semibold',
                                        fontSize: 'xs'
                                    }}
                                    borderRadius="full"
                                    px={3}
                                    py={1}
                                >
                                    {apt.status}
                                </Badge>
                            </HStack>
                        </Box>
                    </Pressable>
                ))}
            </Box>
        </ScrollView>
    );
}