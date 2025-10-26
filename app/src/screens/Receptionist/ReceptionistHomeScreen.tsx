import React, { useEffect, useState } from 'react';
import { Box, Text, HStack, VStack, ScrollView, Pressable, Badge, Icon, Avatar, Spinner } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../screens/context/AuthContext';
import { getAllAppointments, updateAppointmentStatus } from '@/lib/api';
import { Modal, Picker, Button, StyleSheet, View } from 'react-native';

export default function ReceptionistHomeScreen({ navigation }: any) {
    const { user, isLoading } = useAuth(); // Assuming user is the receptionist
    const [todayAppointments, setTodayAppointments] = useState([]);
    const [loadingAppointments, setLoadingAppointments] = useState(true);
    const [totalToday, setTotalToday] = useState(0);
    const [checkedIn, setCheckedIn] = useState(0);
    const [waiting, setWaiting] = useState(0);

    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [newStatus, setNewStatus] = useState('');

    useEffect(() => {
        const fetchAppointments = async () => {
            if (!user?.id) return;

            setLoadingAppointments(true);
            try {
                const allAppointments = await getAllAppointments();
                console.log('Fetched appointments for receptionist:', allAppointments);
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Set to start of today

                const filteredTodayAppointments = allAppointments.filter(apt => {
                    const aptDate = new Date(apt.appointmentTime);
                    aptDate.setHours(0, 0, 0, 0);
                    return aptDate.getTime() === today.getTime();
                });

                setTodayAppointments(filteredTodayAppointments);

                // Calculate stats
                const total = filteredTodayAppointments.length;
                const checkedInCount = filteredTodayAppointments.filter(apt => apt.status === 'CHECKED_IN').length;
                const waitingCount = filteredTodayAppointments.filter(apt => apt.status === 'WAITING').length;

                setTotalToday(total);
                setCheckedIn(checkedInCount);
                setWaiting(waitingCount);

            } catch (error) {
                console.error('Error fetching receptionist appointments:', error);
            } finally {
                setLoadingAppointments(false);
            }
        };

        fetchAppointments();
    }, [user, isLoading ]);

    const formatAppointmentTime = (timestamp: string) => {
      const date = new Date(timestamp);
      const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      };
      return date.toLocaleString('en-US', options);
    };

    const handleAppointmentClick = (appointment: any) => {
        setSelectedAppointment(appointment);
        setNewStatus(appointment.status); // Set initial status to current status
        setShowStatusModal(true);
    };

    const handleStatusUpdate = async () => {
        if (!selectedAppointment || !newStatus) return;

        try {
            await updateAppointmentStatus(selectedAppointment.id, newStatus);
            alert('Appointment status updated successfully!');
            fetchAppointments(); // Refresh the list
            setShowStatusModal(false);
        } catch (error) {
            console.error('Error updating appointment status:', error);
            alert('Failed to update appointment status.');
        }
    };
    return (
        <ScrollView flex={1} bg="gray.50">
            {/* Header */}
            <Box bg="purple.600" pb={6} pt={4} px={4} borderBottomLeftRadius={24} borderBottomRightRadius={24}>
                <HStack justifyContent="space-between" alignItems="center" mb={6}>
                    <VStack>
                        <Text fontSize="sm" color="purple.100">Good Morning,</Text>
                        <Text fontSize="2xl" fontWeight="bold" color="white">{user?.name || 'Receptionist'}</Text>
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
                {loadingAppointments ? (
                    <HStack justifyContent="center" alignItems="center" h={100}>
                        <Spinner color="white" size="lg" />
                    </HStack>
                ) : (
                    <HStack space={3}>
                        <Box flex={1} bg="white" p={4} borderRadius="xl" shadow={2}>
                            <VStack space={1}>
                                <Text fontSize="2xl" fontWeight="bold" color="purple.600">{totalToday}</Text>
                                <Text fontSize="xs" color="gray.600">Total Today</Text>
                            </VStack>
                        </Box>
                        <Box flex={1} bg="white" p={4} borderRadius="xl" shadow={2}>
                            <VStack space={1}>
                                <Text fontSize="2xl" fontWeight="bold" color="green.600">{checkedIn}</Text>
                                <Text fontSize="xs" color="gray.600">Checked In</Text>
                            </VStack>
                        </Box>
                        <Box flex={1} bg="white" p={4} borderRadius="xl" shadow={2}>
                            <VStack space={1}>
                                <Text fontSize="2xl" fontWeight="bold" color="orange.600">{waiting}</Text>
                                <Text fontSize="xs" color="gray.600">Waiting</Text>
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

                {loadingAppointments ? (
                    <Box alignItems="center" mt={4}>
                        <Spinner size="lg" color="purple.600" />
                        <Text mt={2} color="gray.600">Loading today's check-ins...</Text>
                    </Box>
                ) : todayAppointments.length > 0 ? (
                    todayAppointments.map(apt => (
                        <Pressable key={apt.id} onPress={() => handleAppointmentClick(apt)}>
                            <Box bg="white" p={4} borderRadius="xl" shadow={1} mb={3}>
                                <HStack space={3} alignItems="center">
                                    <Avatar size="md" source={{ uri: apt.patient?.image }} >
                                        {apt.patient?.fullName ? apt.patient.fullName.charAt(0).toUpperCase() : 'P'}
                                    </Avatar>
                                    <VStack flex={1}>
                                        <Text fontWeight="bold" fontSize="md">{apt.patient?.fullName || 'N/A'}</Text>
                                        <Text fontSize="sm" color="gray.600">Dr. {apt.doctor?.fullName || 'N/A'}</Text>
                                        <HStack alignItems="center" space={1} mt={1}>
                                            <Icon as={MaterialIcons} name="access-time" size={4} color="gray.500" />
                                            <Text fontSize="sm" color="gray.500">{formatAppointmentTime(apt.appointmentTime)}</Text>
                                        </HStack>
                                    </VStack>
                                    <Badge
                                        bg={
                                            apt.status === 'CHECKED_IN' ? 'green.100' :
                                                apt.status === 'WAITING' ? 'yellow.100' : 'gray.100'
                                        }
                                        _text={{
                                            color:
                                                apt.status === 'CHECKED_IN' ? 'green.700' :
                                                    apt.status === 'WAITING' ? 'yellow.700' : 'gray.700',
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
                        <Text color="gray.600">No check-ins scheduled for today.</Text>
                    </Box>
                )}
            </Box>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        width: '80%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    pickerContainer: {
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        overflow: 'hidden',
        marginBottom: 15,
    },
    picker: {
        height: 50,
        width: '100%',
    },
});