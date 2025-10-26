import React, { useState, useEffect } from 'react';
import { Box, Text, HStack, VStack, ScrollView, Pressable, Badge, Icon, Avatar, Spinner } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { TextInput, StyleSheet, View } from 'react-native';
import { getAllAppointments } from '@/lib/api';

export default function ReceptionistAppointmentsScreen({ navigation }: any) {
    const [allAppointments, setAllAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [loadingAppointments, setLoadingAppointments] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('All');
    const filters = ['All', 'PENDING', 'CHECKED_IN', 'WAITING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']; // Updated filters to match backend statuses

    useEffect(() => {
        const fetchAppointments = async () => {
            setLoadingAppointments(true);
            try {
                const data = await getAllAppointments();
                setAllAppointments(data);
                setFilteredAppointments(data); // Initially show all
            } catch (error) {
                console.error('Error fetching all appointments:', error);
            } finally {
                setLoadingAppointments(false);
            }
        };

        fetchAppointments();
    }, []); // Empty dependency array to fetch once on mount

    useEffect(() => {
        let currentFiltered = [...allAppointments];

        // Apply status filter
        if (selectedFilter !== 'All') {
            currentFiltered = currentFiltered.filter(apt => apt.status === selectedFilter);
        }

        // Apply search query filter
        if (searchQuery) {
            const lowerCaseQuery = searchQuery.toLowerCase();
            currentFiltered = currentFiltered.filter(apt =>
                apt.patient?.fullName?.toLowerCase().includes(lowerCaseQuery) ||
                apt.doctor?.fullName?.toLowerCase().includes(lowerCaseQuery)
            );
        }

        setFilteredAppointments(currentFiltered);
    }, [allAppointments, selectedFilter, searchQuery]);

    const formatAppointmentTime = (timestamp: string) => {
      const date = new Date(timestamp);
      const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      };
      return date.toLocaleString('en-US', options);
    };

    return (
        <Box flex={1} bg="gray.50">
            {/* Header */}
            <Box bg="purple.600" pb={6} pt={4} px={4} borderBottomLeftRadius={24} borderBottomRightRadius={24}>
                <HStack alignItems="center" mb={3}>
                    <Pressable mr={3} onPress={() => navigation.goBack()}>
                        <Icon as={MaterialIcons} name="arrow-back" size={6} color="white" />
                    </Pressable>
                    <VStack flex={1}>
                        <Text mt={5} fontSize="2xl" fontWeight="bold" color="white">Appointments</Text>
                        <Text fontSize="sm" color="purple.100">Manage all appointments</Text>
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
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Filter Tabs */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <HStack space={2}>
                        {filters.map(filter => (
                            <Pressable
                                key={filter}
                                onPress={() => setSelectedFilter(filter)}
                                bg={selectedFilter === filter ? 'purple.600' : 'white'}
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
                                    {filter === 'SCHEDULED' ? 'Pending' : filter === 'CHECKED_IN' ? 'Checked In' : filter === 'WAITING' ? 'Waiting' : filter === 'IN_PROGRESS' ? 'In Progress' : filter === 'COMPLETED' ? 'Completed' : filter === 'CANCELLED' ? 'Cancelled' : filter}
                                </Text>
                            </Pressable>
                        ))}
                    </HStack>
                </ScrollView>
            </Box>

            {/* Appointments List */}
            {loadingAppointments ? (
                <VStack flex={1} justifyContent="center" alignItems="center">
                    <Spinner size="lg" color="purple.600" />
                    <Text mt={2} color="gray.500">Loading appointments...</Text>
                </VStack>
            ) : (
                <ScrollView flex={1} px={4} showsVerticalScrollIndicator={false}>
                    {filteredAppointments.length > 0 ? (
                        filteredAppointments.map((apt: any) => (
                            <Pressable key={apt.id} onPress={() => navigation.navigate('AppointmentDetails', { appointment: apt })}>
                                <Box bg="white" borderRadius="xl" shadow={2} p={4} mb={4}>
                                    <HStack space={3} alignItems="center">
                                        <Avatar bg="purple.100" size="md">
                                            <Text color="purple.600" fontWeight="bold">
                                                {apt.patient?.fullName?.charAt(0).toUpperCase()}
                                            </Text>
                                        </Avatar>
                                        <VStack flex={1}>
                                            <Text fontWeight="bold" fontSize="md">{apt.patient?.fullName}</Text>
                                            <Text fontSize="sm" color="gray.600">with Dr. {apt.doctor?.fullName}</Text>
                                            <HStack alignItems="center" space={1} mt={1}>
                                                <Icon as={MaterialIcons} name="access-time" size={4} color="gray.500" />
                                                <Text fontSize="sm" color="gray.500">{formatAppointmentTime(apt.appointmentDateTime)}</Text>
                                            </HStack>
                                        </VStack>
                                        <VStack alignItems="flex-end" space={2}>
                                            <Badge
                                                bg={
                                                    apt.status === 'SCHEDULED' ? 'yellow.100' :
                                                    apt.status === 'CHECKED_IN' ? 'green.100' :
                                                    apt.status === 'WAITING' ? 'orange.100' :
                                                    apt.status === 'IN_PROGRESS' ? 'blue.100' :
                                                    apt.status === 'COMPLETED' ? 'gray.200' :
                                                    apt.status === 'CANCELLED' ? 'red.100' : 'gray.100'
                                                }
                                                _text={{
                                                    color:
                                                        apt.status === 'SCHEDULED' ? 'yellow.800' :
                                                        apt.status === 'CHECKED_IN' ? 'green.800' :
                                                        apt.status === 'WAITING' ? 'orange.800' :
                                                        apt.status === 'IN_PROGRESS' ? 'blue.800' :
                                                        apt.status === 'COMPLETED' ? 'gray.800' :
                                                        apt.status === 'CANCELLED' ? 'red.800' : 'gray.800',
                                                    fontWeight: 'semibold',
                                                    fontSize: 'xs'
                                                }}
                                                borderRadius="full"
                                                px={3}
                                                py={1}
                                            >
                                                {apt.status === 'SCHEDULED' ? 'Pending' : apt.status === 'CHECKED_IN' ? 'Checked In' : apt.status === 'WAITING' ? 'Waiting' : apt.status === 'IN_PROGRESS' ? 'In Progress' : apt.status === 'COMPLETED' ? 'Completed' : apt.status === 'CANCELLED' ? 'Cancelled' : apt.status}
                                            </Badge>
                                            <Icon as={MaterialIcons} name="chevron-right" size={6} color="gray.400" />
                                        </VStack>
                                    </HStack>
                                </Box>
                            </Pressable>
                        ))
                    ) : (
                        <VStack flex={1} justifyContent="center" alignItems="center" mt={10}>
                            <Icon as={MaterialIcons} name="event-busy" size={16} color="gray.300" />
                            <Text mt={4} fontSize="lg" color="gray.500">No appointments found</Text>
                            <Text fontSize="sm" color="gray.400">Try adjusting your search or filter.</Text>
                        </VStack>
                    )}
                </ScrollView>
            )}
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
