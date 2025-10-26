import React, { useEffect, useState } from 'react';
import { Box, Text, HStack, VStack, ScrollView, Pressable, Badge, Icon, Avatar, Spinner } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../screens/context/AuthContext';
import { getDoctorTodaysAppointments } from '@/lib/api';

export default function DoctorHomeScreen({ navigation }: any) {
    const { user } = useAuth(); // Assuming user is the doctor
    const [doctorAppointments, setDoctorAppointments] = useState([]);
    const [loadingAppointments, setLoadingAppointments] = useState(true);
    const [todaysPatients, setTodaysPatients] = useState(0);
    const [completedAppointments, setCompletedAppointments] = useState(0);
    const [pendingAppointments, setPendingAppointments] = useState(0);

    useEffect(() => {
        const fetchAppointments = async () => {
            if (!user?.id) return;

            setLoadingAppointments(true);
            try {
                const data = await getDoctorTodaysAppointments(user.id);

                // Client-side filter to ensure only today's appointments are shown
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Set to start of today

                const filteredData = data.filter(apt => {
                    const aptDate = new Date(apt.appointmentTime);
                    aptDate.setHours(0, 0, 0, 0);
                    return aptDate.getTime() === today.getTime();
                });

                setDoctorAppointments(filteredData);

                // Calculate stats
                const total = filteredData.length;
                const completed = filteredData.filter(apt => apt.status === 'COMPLETED').length;
                const pending = filteredData.filter(apt => apt.status === 'SCHEDULED' || apt.status === 'PENDING').length;

                setTodaysPatients(total);
                setCompletedAppointments(completed);
                setPendingAppointments(pending);

            } catch (error) {
                console.error('Error fetching doctor appointments:', error);
            } finally {
                setLoadingAppointments(false);
            }
        };

        fetchAppointments();
    }, [user?.id]);

    const formatAppointmentTime = (timestamp: string) => {
      const date = new Date(timestamp);
      const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      };
      return date.toLocaleString('en-US', options);
    };

    const formatAppointmentDate = (timestamp: string) => {
      const date = new Date(timestamp);
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      };
      return date.toLocaleString('en-US', options);
    };
    return (
        <ScrollView flex={1} bg="gray.50">
            {/* Header */}
            <Box bg="green.600" pb={6} pt={4} px={4} borderBottomLeftRadius={24} borderBottomRightRadius={24}>
                <HStack justifyContent="space-between" alignItems="center" mb={6}>
                    <VStack>
                        <Text fontSize="sm" color="green.100">Welcome back,</Text>
                        <Text fontSize="2xl" fontWeight="bold" color="white">Dr. {user?.name || 'Doctor'}</Text>
                        <Text fontSize="sm" color="green.100">{user?.speciality || 'General Physician'}</Text>
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
                {loadingAppointments ? (
                    <HStack justifyContent="center" alignItems="center" h={100}>
                        <Spinner color="white" size="lg" />
                    </HStack>
                ) : (
                    <HStack space={3}>
                        <Box flex={1} bg="white" p={4} borderRadius="xl" shadow={2}>
                            <VStack space={1}>
                                <Text fontSize="2xl" fontWeight="bold" color="green.600">{todaysPatients}</Text>
                                <Text fontSize="xs" color="gray.600">Today's Patients</Text>
                            </VStack>
                        </Box>
                        <Box flex={1} bg="white" p={4} borderRadius="xl" shadow={2}>
                            <VStack space={1}>
                                <Text fontSize="2xl" fontWeight="bold" color="blue.600">{completedAppointments}</Text>
                                <Text fontSize="xs" color="gray.600">Completed</Text>
                            </VStack>
                        </Box>
                        <Box flex={1} bg="white" p={4} borderRadius="xl" shadow={2}>
                            <VStack space={1}>
                                <Text fontSize="2xl" fontWeight="bold" color="orange.600">{pendingAppointments}</Text>
                                <Text fontSize="xs" color="gray.600">Pending</Text>
                            </VStack>
                        </Box>
                    </HStack>
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

                {loadingAppointments ? (
                    <Box alignItems="center" mt={4}>
                        <Spinner size="lg" color="green.600" />
                        <Text mt={2} color="gray.600">Loading today's appointments...</Text>
                    </Box>
                ) : doctorAppointments.length > 0 ? (
                    doctorAppointments.map(apt => (
                        <Pressable key={apt.id}>
                            <Box bg="white" p={4} borderRadius="xl" shadow={1} mb={3}>
                                <HStack space={3} alignItems="center">
                                    <Avatar size="md" source={{ uri: apt.patient.image }} >
                                        {apt.patient.fullName ? apt.patient.fullName.charAt(0).toUpperCase() : 'P'}
                                    </Avatar>
                                    <VStack flex={1}>
                                    <Text fontWeight="bold" fontSize="md">{apt.patient.fullName}</Text>
                                    <Text fontSize="sm" color="gray.600"> Reason : {apt.disease}</Text>
                                    <HStack alignItems="center" space={1} mt={1}>
                                        <Icon as={MaterialIcons} name="calendar-today" size={4} color="gray.500" />
                                        <Text fontSize="sm" color="gray.500">{formatAppointmentDate(apt.appointmentTime)}</Text>
                                    </HStack>
                                    <HStack alignItems="center" space={1} mt={1}>
                                        <Icon as={MaterialIcons} name="access-time" size={4} color="gray.500" />
                                        <Text fontSize="sm" color="gray.500">{formatAppointmentTime(apt.appointmentTime)}</Text>
                                    </HStack>
                                    </VStack>
                                    <Badge
                                        bg={
                                            apt.status === 'URGENT' ? 'red.100' :
                                                apt.status === 'IN_PROGRESS' ? 'blue.100' :
                                                    apt.status === 'WAITING' ? 'yellow.100' : 'green.100'
                                        }
                                        _text={{
                                            color:
                                                apt.status === 'URGENT' ? 'red.700' :
                                                    apt.status === 'IN_PROGRESS' ? 'blue.700' :
                                                        apt.status === 'WAITING' ? 'yellow.700' : 'green.700',
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
                    ))
                ) : (
                    <Box alignItems="center" mt={4}>
                        <Text color="gray.600">No appointments scheduled for today.</Text>
                    </Box>
                )}
            </Box>
        </ScrollView>
    );
}