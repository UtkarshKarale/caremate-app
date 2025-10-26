import React, { useEffect, useState } from 'react';
import { Box, Text, HStack, VStack, ScrollView, Pressable, Badge, Icon, Spinner } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import {useAuth} from "@/app/src/screens/context/AuthContext";
import { getUserAppointments } from '@/lib/api';

export default function HomeScreen({ navigation }: any) {
    const { user, isLoading } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loadingAppointments, setLoadingAppointments] = useState(true);

    useEffect(() => {
        const fetchAppointments = async () => {
            // 🛑 Wait until auth is resolved and user is available
            if (isLoading || !user?.id) {
                if (!isLoading) {
                    setLoadingAppointments(false);
                }
                return;
            }

            console.log('User ID for fetching appointments:', user.id);

            try {
                setLoadingAppointments(true);
                console.log("✅ Auth ready, fetching appointments...");
                const data = await getUserAppointments(user.id);
                console.log('Received appointments data:', data);
                setAppointments(data);
            } catch (error) {
                console.error("Error fetching appointments:", error);
            } finally {
                setLoadingAppointments(false);
                console.log('Finished fetching appointments.');
            }
        };

        fetchAppointments();
    }, [user, isLoading]);

    const formatAppointmentTime = (timestamp: string) => {
      const date = new Date(timestamp);
      const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      };
      return date.toLocaleString('en-US', options);
    };


    console.log('Current appointments state:', appointments.map(apt => apt.id));

    return (
        <ScrollView flex={1} bg="gray.50">
            {/* Header */}
            <Box bg="blue.600" pb={6} pt={4} px={4} borderBottomLeftRadius={24} borderBottomRightRadius={24}>
                <HStack mt={4} justifyContent="space-between" alignItems="center" mb={6}>
                    <Box>
                        <Text fontSize="2xl" fontWeight="bold" color="white">Hello, {user?.name ? user.name : user.fullName }</Text>
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
                {loadingAppointments ? (
                    <Box bg="white" p={4} borderRadius="xl" shadow={2} alignItems="center">
                        <Spinner size="lg" color="blue.600" />
                        <Text mt={2} color="gray.600">Loading appointments...</Text>
                    </Box>
                ) : appointments.length > 0 ? (
                    <Box bg="white" p={4} borderRadius="xl" shadow={2}>
                      <HStack space={3} alignItems="center">
                        <Box bg="blue.100" p={3} borderRadius="full">
                          <Icon as={MaterialIcons} name="person" size={6} color="blue.600" />
                        </Box>
                        <VStack flex={1}>
                          <Text fontSize="xs" fontWeight="semibold" color="gray.600">
                            Upcoming Appointment
                          </Text>
                          <Text fontSize="md" fontWeight="bold" mt={1}>
                            Dr. {appointments[0].doctor.fullName}
                          </Text>
                          <HStack space={2} mt={1} alignItems="center">
                            <Icon as={MaterialIcons} name="calendar-today" size={4} color="gray.500" />
                            <Text fontSize="sm" color="gray.600">
                              {formatAppointmentTime(appointments[0].appointmentTime)}
                            </Text>
                          </HStack>
                          <HStack space={2} mt={1} alignItems="center">
                            <Icon as={MaterialIcons} name="medical-services" size={4} color="gray.500" />
                            <Text fontSize="sm" color="gray.600">
                              Reason: {appointments[0].disease}
                            </Text>
                          </HStack>
                        </VStack>
                      </HStack>
                    </Box>
                ) : (
                    <Box bg="white" p={4} borderRadius="xl" shadow={2} alignItems="center">
                        <Text color="gray.600">No upcoming appointments.</Text>
                    </Box>
                )}
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
                        onPress={() => navigation.navigate('DoctorSelection')}
                    >
                        <VStack alignItems="center" space={2}>
                            <Box bg="blue.100" p={4} borderRadius="2xl">
                                <Icon as={MaterialIcons} name="calendar-today" size={7} color="blue.600" />
                            </Box>
                            <Text fontWeight="semibold" textAlign="center">Book Appointment</Text>
                        </VStack>
                    </Pressable>

                    <Pressable
                        flex={1}
                        bg="white"
                        p={6}
                        borderRadius="2xl"
                        shadow={1}
                        onPress={() => navigation.navigate('DoctorSelection')}
                    >
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
                        onPress={() => navigation.navigate('Records')}
                    >
                        <VStack alignItems="center" space={2}>
                            <Box bg="purple.100" p={4} borderRadius="2xl">
                                <Icon as={MaterialIcons} name="folder" size={7} color="purple.600" />
                            </Box>
                            <Text fontWeight="semibold" textAlign="center">My Records</Text>
                        </VStack>
                    </Pressable>

                    <Pressable
                        flex={1}
                        bg="white"
                        p={6}
                        borderRadius="2xl"
                        shadow={1}
                        onPress={() => {
                            // You can add emergency call functionality here
                            console.log('Emergency call');
                        }}
                    >
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

                {loadingAppointments ? (
                    <Box alignItems="center" mt={4}>
                        <Spinner size="lg" color="blue.600" />
                        <Text mt={2} color="gray.600">Loading all appointments...</Text>
                    </Box>
                ) : appointments.length > 0 ? (
                    appointments.map(apt => (
                        <Box key={apt.id} bg="white" p={4} borderRadius="xl" shadow={1} mb={3}>
                            <HStack justifyContent="space-between" alignItems="flex-start">
                                <VStack flex={1}>
                                    <Text fontWeight="bold" fontSize="md">{apt.doctorName}</Text>
                                    <Text fontSize="sm" color="gray.600">{apt.specialty}</Text>
                                    <HStack alignItems="center" space={1} mt={2}>
                                        <Icon as={MaterialIcons} name="access-time" size={4} color="gray.500" />
                                        <Text fontSize="sm" color="gray.500">{apt.date}, {apt.time}</Text>
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
                    ))
                ) : (
                    <Box alignItems="center" mt={4}>
                        <Text color="gray.600">No upcoming appointments.</Text>
                    </Box>
                )}
            </Box>
        </ScrollView>
    );
}