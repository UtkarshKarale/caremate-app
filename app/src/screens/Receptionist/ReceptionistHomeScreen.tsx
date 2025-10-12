import React from 'react';
import { Box, Text, HStack, VStack, ScrollView, Pressable, Badge, Icon, Avatar } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

const checkIns = [
    { id: '1', patient: 'John Smith', doctor: 'Dr. Sarah Johnson', time: '09:00 AM', status: 'Waiting', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400' },
    { id: '2', patient: 'Emma Wilson', doctor: 'Dr. Michael Chen', time: '10:30 AM', status: 'In Room', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400' },
    { id: '3', patient: 'Michael Brown', doctor: 'Dr. Emily Rodriguez', time: '11:00 AM', status: 'Not Arrived', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
];

export default function ReceptionistHomeScreen({ navigation }: any) {
    return (
        <ScrollView flex={1} bg="gray.50">
            {/* Header */}
            <Box bg="purple.600" pb={6} pt={4} px={4} borderBottomLeftRadius={24} borderBottomRightRadius={24}>
                <HStack justifyContent="space-between" alignItems="center" mb={6}>
                    <VStack>
                        <Text fontSize="sm" color="purple.100">Good Morning,</Text>
                        <Text fontSize="2xl" fontWeight="bold" color="white">Reception Desk</Text>
                        <Text fontSize="sm" color="purple.100">City General Hospital</Text>
                    </VStack>
                    <HStack space={2}>
                        <Pressable bg="purple.500" p={2} borderRadius="full">
                            <Icon as={MaterialIcons} name="notifications" size={5} color="white" />
                            <Badge
                                position="absolute"
                                top={-1}
                                right={-1}
                                bg="red.500"
                                borderRadius="full"
                                _text={{ fontSize: 'xs', color: 'white' }}
                            >
                                5
                            </Badge>
                        </Pressable>
                        <Pressable bg="purple.500" p={2} borderRadius="full">
                            <Icon as={MaterialIcons} name="settings" size={5} color="white" />
                        </Pressable>
                    </HStack>
                </HStack>

                {/* Stats Cards */}
                <HStack space={3}>
                    <Box flex={1} bg="white" p={4} borderRadius="xl" shadow={2}>
                        <VStack space={1}>
                            <Text fontSize="2xl" fontWeight="bold" color="purple.600">24</Text>
                            <Text fontSize="xs" color="gray.600">Total Today</Text>
                        </VStack>
                    </Box>
                    <Box flex={1} bg="white" p={4} borderRadius="xl" shadow={2}>
                        <VStack space={1}>
                            <Text fontSize="2xl" fontWeight="bold" color="green.600">15</Text>
                            <Text fontSize="xs" color="gray.600">Checked In</Text>
                        </VStack>
                    </Box>
                    <Box flex={1} bg="white" p={4} borderRadius="xl" shadow={2}>
                        <VStack space={1}>
                            <Text fontSize="2xl" fontWeight="bold" color="orange.600">9</Text>
                            <Text fontSize="xs" color="gray.600">Waiting</Text>
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
                        onPress={() => navigation.navigate('CheckIn')}
                    >
                        <VStack alignItems="center" space={2}>
                            <Box bg="purple.100" p={4} borderRadius="2xl">
                                <Icon as={MaterialIcons} name="person-add" size={7} color="purple.600" />
                            </Box>
                            <Text fontWeight="semibold" textAlign="center" fontSize="sm">Check-In Patient</Text>
                        </VStack>
                    </Pressable>

                    <Pressable
                        flex={1}
                        bg="white"
                        p={6}
                        borderRadius="2xl"
                        shadow={1}
                        onPress={() => navigation.navigate('ReceptionistAppointments')}
                    >
                        <VStack alignItems="center" space={2}>
                            <Box bg="blue.100" p={4} borderRadius="2xl">
                                <Icon as={MaterialIcons} name="calendar-today" size={7} color="blue.600" />
                            </Box>
                            <Text fontWeight="semibold" textAlign="center" fontSize="sm">Appointments</Text>
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
                        onPress={() => navigation.navigate('PatientRegistry')}
                    >
                        <VStack alignItems="center" space={2}>
                            <Box bg="green.100" p={4} borderRadius="2xl">
                                <Icon as={MaterialIcons} name="people" size={7} color="green.600" />
                            </Box>
                            <Text fontWeight="semibold" textAlign="center" fontSize="sm">Patient Registry</Text>
                        </VStack>
                    </Pressable>

                    <Pressable flex={1} bg="white" p={6} borderRadius="2xl" shadow={1}>
                        <VStack alignItems="center" space={2}>
                            <Box bg="orange.100" p={4} borderRadius="2xl">
                                <Icon as={MaterialIcons} name="payment" size={7} color="orange.600" />
                            </Box>
                            <Text fontWeight="semibold" textAlign="center" fontSize="sm">Payments</Text>
                        </VStack>
                    </Pressable>
                </HStack>
            </Box>

            {/* Today's Check-Ins */}
            <Box px={4} pb={24}>
                <HStack justifyContent="space-between" alignItems="center" mb={4}>
                    <Text fontSize="lg" fontWeight="bold" color="gray.800">Today's Check-Ins</Text>
                    <Pressable>
                        <Text fontSize="sm" fontWeight="semibold" color="purple.600">View All</Text>
                    </Pressable>
                </HStack>

                {checkIns.map(checkIn => (
                    <Pressable key={checkIn.id}>
                        <Box bg="white" p={4} borderRadius="xl" shadow={1} mb={3}>
                            <HStack space={3} alignItems="center">
                                <Avatar size="md" source={{ uri: checkIn.avatar }} />
                                <VStack flex={1}>
                                    <Text fontWeight="bold" fontSize="md">{checkIn.patient}</Text>
                                    <Text fontSize="sm" color="gray.600">{checkIn.doctor}</Text>
                                    <HStack alignItems="center" space={1} mt={1}>
                                        <Icon as={MaterialIcons} name="access-time" size={4} color="gray.500" />
                                        <Text fontSize="sm" color="gray.500">{checkIn.time}</Text>
                                    </HStack>
                                </VStack>
                                <Badge
                                    bg={
                                        checkIn.status === 'In Room' ? 'green.100' :
                                            checkIn.status === 'Waiting' ? 'yellow.100' : 'gray.100'
                                    }
                                    _text={{
                                        color:
                                            checkIn.status === 'In Room' ? 'green.700' :
                                                checkIn.status === 'Waiting' ? 'yellow.700' : 'gray.700',
                                        fontWeight: 'semibold',
                                        fontSize: 'xs'
                                    }}
                                    borderRadius="full"
                                    px={3}
                                    py={1}
                                >
                                    {checkIn.status}
                                </Badge>
                            </HStack>
                        </Box>
                    </Pressable>
                ))}
            </Box>
        </ScrollView>
    );
}