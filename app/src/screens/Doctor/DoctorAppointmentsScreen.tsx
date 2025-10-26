import React, { useState, useEffect } from 'react';
import { Box, Text, HStack, VStack, ScrollView, Pressable, Badge, Icon, Avatar, Spinner } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { TextInput, StyleSheet, View } from 'react-native';
import { useAuth } from '@/app/src/screens/context/AuthContext';
import { getDoctorTodaysAppointments } from '@/lib/api';

export default function DoctorAppointmentsScreen({ navigation }: any) {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedFilter, setSelectedFilter] = useState('All');
    const filters = ['All', 'Today', 'Tomorrow', 'Upcoming'];

    useEffect(() => {
        const fetchAppointments = async () => {
            if (!user?.id) return;
            setLoading(true);
            try {
                const data = await getDoctorTodaysAppointments(user.id);
                setAppointments(data);
            } catch (err) {
                setError('Failed to load appointments.');
                console.error('Error fetching appointments:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [user]);

    const formatAppointmentTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            hour: '2-digit', minute: '2-digit', hour12: true,
        });
    };

    const formatAppointmentDate = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            day: '2-digit', month: 'short', year: 'numeric',
        });
    };

    const renderContent = () => {
        if (loading) {
            return <VStack flex={1} justifyContent="center" alignItems="center"><Spinner size="lg" /></VStack>;
        }

        if (error) {
            return <VStack flex={1} justifyContent="center" alignItems="center"><Text color="red.500">{error}</Text></VStack>;
        }

        if (appointments.length === 0) {
            return <VStack flex={1} justifyContent="center" alignItems="center"><Text>No appointments found for today.</Text></VStack>;
        }

        return (
            <ScrollView flex={1} px={4} showsVerticalScrollIndicator={false}>
                {appointments.map((apt: any) => (
                    <Pressable key={apt.id} onPress={() => navigation.navigate('DoctorAppointmentDetails', { appointment: apt })}>
                        <Box bg="white" borderRadius="xl" shadow={2} p={4} mb={4}>
                            <HStack space={3} alignItems="center">
                                <Avatar bg="blue.100" size="lg">
                                    <Text color="blue.600" fontWeight="bold" fontSize="2xl">
                                        {apt.patient?.fullName?.charAt(0).toUpperCase()}
                                    </Text>
                                </Avatar>
                                <VStack flex={1}>
                                    <Text fontWeight="bold" fontSize="md">{apt.patient?.fullName}</Text>
                                    <Text fontSize="sm" color="gray.600">{apt.reason || 'N/A'}</Text>
                                    <HStack alignItems="center" space={2} mt={1}>
                                        <HStack alignItems="center" space={1}>
                                            <Icon as={MaterialIcons} name="access-time" size={4} color="gray.500" />
                                            <Text fontSize="sm" color="gray.500">{formatAppointmentTime(apt.appointmentDateTime)}</Text>
                                        </HStack>
                                        <Text fontSize="sm" color="gray.400">•</Text>
                                        <Text fontSize="sm" color="gray.500">{formatAppointmentDate(apt.appointmentDateTime)}</Text>
                                    </HStack>
                                </VStack>
                                <VStack alignItems="flex-end" space={2}>
                                    <Badge
                                        colorScheme={apt.status === 'CANCELLED' ? 'error' : 'info'}
                                        variant="subtle"
                                    >
                                        {apt.status}
                                    </Badge>
                                    <Icon as={MaterialIcons} name="chevron-right" size={6} color="gray.400" />
                                </VStack>
                            </HStack>
                        </Box>
                    </Pressable>
                ))}
            </ScrollView>
        );
    };

    return (
        <Box flex={1} bg="gray.50">
            {/* Header */}
            <Box bg="green.600" pb={6} pt={4} px={4} borderBottomLeftRadius={24} borderBottomRightRadius={24}>
                <HStack alignItems="center" mb={3}>
                    <Pressable mr={3} onPress={() => navigation.goBack()}>
                        <Icon as={MaterialIcons} name="arrow-back" size={6} color="white" />
                    </Pressable>
                    <VStack  flex={1}>
                        <Text mt={5} fontSize="2xl" fontWeight="bold" color="white">Today's Appointments</Text>
                        <Text fontSize="sm" color="green.100">Manage your schedule</Text>
                    </VStack>
                </HStack>
            </Box>

            {/* Search & Filter */}
            <Box p={4}>
                <View style={styles.inputContainer}>
                    <Icon as={MaterialIcons} name="search" size={5} color="gray.400" style={styles.inputIcon} />
                    <TextInput
                        placeholder="Search appointments..."
                        style={styles.input}
                    />
                </View>

                {/* Filter Tabs - Note: API only fetches today's appointments, so these filters are for UI demonstration */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <HStack space={2}>
                        {filters.map(filter => (
                            <Pressable
                                key={filter}
                                onPress={() => setSelectedFilter(filter)}
                                bg={selectedFilter === filter ? 'green.600' : 'white'}
                                px={4}
                                py={2}
                                borderRadius="full"
                                borderWidth={selectedFilter === filter ? 0 : 1}
                                borderColor="gray.200"
                                shadow={selectedFilter === filter ? 2 : 0}
                            >
                                <Text
                                    fontWeight="semibold"
                                    fontSize="sm"
                                    color={selectedFilter === filter ? 'white' : 'gray.700'}
                                >
                                    {filter}
                                </Text>
                            </Pressable>
                        ))}
                    </HStack>
                </ScrollView>
            </Box>

            {/* Appointments List */}
            {renderContent()}
        </Box>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 12,
        paddingHorizontal: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
    },
    inputIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
    },
});
