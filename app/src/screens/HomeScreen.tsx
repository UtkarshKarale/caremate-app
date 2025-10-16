import React from 'react';
import { Box, Text, HStack, VStack, ScrollView, Pressable, Badge, Icon } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { upcomingAppointments } from '@/app/src/data/doctor';
import {useAuth} from "@/app/src/screens/context/AuthContext";

export default function HomeScreen({ navigation }: any) {
    const { user } = useAuth();

    return (
        <ScrollView flex={1} bg="gray.50">
            {/* Header */}
            <Box bg="blue.600" pb={6} pt={4} px={4} borderBottomLeftRadius={24} borderBottomRightRadius={24}>
                <HStack justifyContent="space-between" alignItems="center" mb={6}>
                    <Box>
                        <Text fontSize="2xl" fontWeight="bold" color="white">Hello, {user?.name}</Text>
                        <Text fontSize="sm" color="blue.100">Welcome back!</Text>
                    </Box>
                    <HStack space={2}>
                        <Pressable bg="blue.500" p={2} borderRadius="full">
                            <Icon as={MaterialIcons} name="notifications" size={5} color="white" />
                        </Pressable>
                        <Pressable bg="blue.500" p={2} borderRadius="full">
                            <Icon as={MaterialIcons} name="settings" size={5} color="white" />
                        </Pressable>
                    </HStack>
                </HStack>

                {/* Upcoming Appointment Card */}
                <Box bg="white" p={4} borderRadius="xl" shadow={2}>
                    <HStack space={3} alignItems="center">
                        <Box bg="blue.100" p={3} borderRadius="full">
                            <Icon as={MaterialIcons} name="person" size={6} color="blue.600" />
                        </Box>
                        <VStack flex={1}>
                            <Text fontSize="xs" fontWeight="semibold" color="gray.600">Upcoming Appointment</Text>
                            <Text fontSize="md" fontWeight="bold">Dr. Sarah Miller • Today, 3:30 PM</Text>
                        </VStack>
                    </HStack>
                </Box>
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
                        onPress={() => navigation.navigate('PatientApp', { screen: 'DoctorSelection' })}
                    >
                        <VStack alignItems="center" space={2}>
                            <Box bg="blue.100" p={4} borderRadius="2xl">
                                <Icon as={MaterialIcons} name="calendar-today" size={7} color="blue.600" />
                            </Box>
                            <Text fontWeight="semibold" textAlign="center">Book Appointment</Text>
                        </VStack>
                    </Pressable>

                    <Pressable flex={1} bg="white" p={6} borderRadius="2xl" shadow={1} onPress={() => navigation.navigate('PatientApp', { screen: 'DoctorSelection' })}>
                        <VStack alignItems="center" space={2}>
                            <Box bg="green.100" p={4} borderRadius="2xl">
                                <Icon as={MaterialIcons} name="medical-services" size={7} color="green.600" />
                            </Box>
                            <Text fontWeight="semibold" textAlign="center">Find Doctor</Text>
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
                        onPress={() => navigation.navigate('MedicalRecords')}
                    >
                        <VStack alignItems="center" space={2}>
                            <Box bg="purple.100" p={4} borderRadius="2xl">
                                <Icon as={MaterialIcons} name="folder" size={7} color="purple.600" />
                            </Box>
                            <Text fontWeight="semibold" textAlign="center">My Records</Text>
                        </VStack>
                    </Pressable>

                    <Pressable flex={1} bg="white" p={6} borderRadius="2xl" shadow={1}>
                        <VStack alignItems="center" space={2}>
                            <Box bg="orange.100" p={4} borderRadius="2xl">
                                <Icon as={MaterialIcons} name="phone" size={7} color="orange.600" />
                            </Box>
                            <Text fontWeight="semibold" textAlign="center">Emergency</Text>
                        </VStack>
                    </Pressable>
                </HStack>
            </Box>

            {/* Upcoming Appointments */}
            <Box px={4} pb={24}>
                <HStack justifyContent="space-between" alignItems="center" mb={4}>
                    <Text fontSize="lg" fontWeight="bold" color="gray.800">Upcoming Appointments</Text>
                    <Text fontSize="sm" fontWeight="semibold" color="blue.600">View All</Text>
                </HStack>

                {upcomingAppointments.map(apt => (
                    <Box key={apt.id} bg="white" p={4} borderRadius="xl" shadow={1} mb={3}>
                        <HStack justifyContent="space-between" alignItems="flex-start">
                            <VStack flex={1}>
                                <Text fontWeight="bold" fontSize="md">{apt.doctor}</Text>
                                <Text fontSize="sm" color="gray.600">{apt.specialty}</Text>
                                <HStack alignItems="center" space={1} mt={2}>
                                    <Icon as={MaterialIcons} name="access-time" size={4} color="gray.500" />
                                    <Text fontSize="sm" color="gray.500">{apt.time}</Text>
                                </HStack>
                            </VStack>
                            <Badge
                                bg={apt.status === 'Confirmed' ? 'green.100' : 'blue.100'}
                                _text={{
                                    color: apt.status === 'Confirmed' ? 'green.700' : 'blue.700',
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
                ))}
            </Box>
        </ScrollView>
    );
}