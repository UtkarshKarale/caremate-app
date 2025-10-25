import React, { useState, useEffect } from 'react';
import { Box, Text, HStack, VStack, ScrollView, Icon, Pressable, Spinner } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { getAppointmentsByDate } from '@/lib/api';

const appointmentData = [
    { day: 'Mon', appointments: 30 },
    { day: 'Tue', appointments: 45 },
    { day: 'Wed', appointments: 60 },
    { day: 'Thu', appointments: 50 },
    { day: 'Fri', appointments: 70 },
    { day: 'Sat', appointments: 85 },
    { day: 'Sun', appointments: 40 },
];

const billingsData = [
    { id: '1', patient: 'John Smith', amount: '$150', status: 'Paid', date: '2023-10-24' },
    { id: '2', patient: 'Jane Doe', amount: '$200', status: 'Pending', date: '2023-10-24' },
    { id: '3', patient: 'Peter Jones', amount: '$75', status: 'Paid', date: '2023-10-23' },
    { id: '4', patient: 'Mary Johnson', amount: '$300', status: 'Overdue', date: '2023-10-20' },
];

export default function ReportsAnalyticsScreen({ navigation }: any) {
    const [loading, setLoading] = useState(true);
    const [patientsToday, setPatientsToday] = useState(0);
    const [doctorsPresent, setDoctorsPresent] = useState(0);
    const [appoeintmentsToday, setAppointmentsToday] = useState(0);

    useEffect(() => {
        const fetchTodaysData = async () => {
            setLoading(true);
            try {
                const today = new Date().toISOString().split('T')[0];
                const appointments = await getAppointmentsByDate(today) || [];
                const patientIds = new Set(appointments.map((a: any) => a.patientId));
                const doctorIds = new Set(appointments.map((a: any) => a.doctorId));
                setPatientsToday(patientIds.size);
                setDoctorsPresent(doctorIds.size);
                setAppointmentsToday(appointments.length);
                
            } catch (error) {
                console.error('Error fetching today\'s data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTodaysData();
    }, []);

    const reportStats = [
        { id: '1', label: 'Total Appointments', value: appoeintmentsToday, icon: 'event', color: 'blue.600', bgColor: 'blue.100' },
        { id: '2', label: 'Patients Today', value: patientsToday, icon: 'person', color: 'green.600', bgColor: 'green.100' },
        { id: '3', label: 'Doctors Present', value: doctorsPresent, icon: 'medical-services', color: 'purple.600', bgColor: 'purple.100' },
        { id: '4', label: 'Total Revenue', value: '$15,789', icon: 'attach-money', color: 'orange.600', bgColor: 'orange.100' },
    ];

    return (
        <ScrollView flex={1} bg="gray.50">
            {/* Header */}
            <Box bg="red.600" pb={6} pt={4} px={4} borderBottomLeftRadius={24} borderBottomRightRadius={24}>
                <HStack alignItems="center" mb={3}>
                    <Pressable mr={3} onPress={() => navigation.goBack()}>
                        <Icon as={MaterialIcons} name="arrow-back" size={6} color="white" />
                    </Pressable>
                    <VStack flex={1} mt={5}>
                        <Text fontSize="2xl" fontWeight="bold" color="white">Reports & Analytics</Text>
                        <Text fontSize="sm" color="red.100">Insights into hospital performance</Text>
                    </VStack>
                </HStack>
            </Box>

            {/* Stats Cards */}
            {loading ? (
                <HStack justifyContent="center" alignItems="center" h={100}>
                    <Spinner color="red.600" size="lg" />
                </HStack>
            ) : (
                <Box p={4} mt={-10}>
                    <HStack space={3} flexWrap="wrap">
                        {reportStats.map(stat => (
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
            )}

            {/* Appointments Chart */}
            <Box p={4}>
                <Text fontSize="lg" fontWeight="bold" mb={4} color="gray.800">Weekly Appointments</Text>
                <Box bg="white" borderRadius="xl" shadow={2} p={4}>
                    <HStack justifyContent="space-around" alignItems="flex-end" h={150}>
                        {appointmentData.map(item => (
                            <VStack key={item.day} alignItems="center" space={2}>
                                <Box h={`${item.appointments / 100 * 130}px`} w={4} bg="blue.500" borderRadius="sm" />
                                <Text fontSize="xs" fontWeight="bold">{item.day}</Text>
                            </VStack>
                        ))}
                    </HStack>
                </Box>
            </Box>

            {/* Recent Billings */}
            <Box p={4}>
                <Text fontSize="lg" fontWeight="bold" mb={4} color="gray.800">Recent Billings</Text>
                <VStack space={3}>
                    {billingsData.map(bill => (
                        <Box key={bill.id} bg="white" borderRadius="xl" shadow={1} p={4}>
                            <HStack justifyContent="space-between" alignItems="center">
                                <VStack>
                                    <Text fontWeight="bold">{bill.patient}</Text>
                                    <Text fontSize="sm" color="gray.500">{bill.date}</Text>
                                </VStack>
                                <VStack alignItems="flex-end">
                                    <Text fontWeight="bold" fontSize="lg">{bill.amount}</Text>
                                    <Text
                                        fontSize="sm"
                                        fontWeight="semibold"
                                        color={bill.status === 'Paid' ? 'green.600' : (bill.status === 'Pending' ? 'orange.600' : 'red.600')}
                                    >
                                        {bill.status}
                                    </Text>
                                </VStack>
                            </HStack>
                        </Box>
                    ))}
                </VStack>
            </Box>
        </ScrollView>
    );
}