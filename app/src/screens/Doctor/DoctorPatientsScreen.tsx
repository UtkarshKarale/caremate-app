import React, { useState, useEffect, useMemo } from 'react';
import { Box, Text, HStack, VStack, ScrollView, Pressable, Icon, Avatar, Spinner } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { TextInput, StyleSheet, View } from 'react-native';
import { useAuth } from '@/app/src/screens/context/AuthContext';
import { getAppointmentsByDoctor } from '@/lib/api';

export default function DoctorPatientsScreen({ navigation }: any) {
    const { user } = useAuth();
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchPatients = async () => {
            if (!user?.id) return;
            setLoading(true);
            try {
                const appointments = await getAppointmentsByDoctor(user.id);
                const uniquePatients = Array.from(new Map(appointments.map(apt => [apt.patient.id, apt.patient])).values());
                setPatients(uniquePatients);
            } catch (err) {
                setError('Failed to load patients.');
                console.error('Error fetching patients:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, [user]);

    const filteredPatients = useMemo(() => {
        if (!searchQuery) {
            return patients;
        }
        return patients.filter(p => 
            p.fullName.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [patients, searchQuery]);

    const renderContent = () => {
        if (loading) {
            return <VStack flex={1} justifyContent="center" alignItems="center"><Spinner size="lg" /></VStack>;
        }

        if (error) {
            return <VStack flex={1} justifyContent="center" alignItems="center"><Text color="red.500">{error}</Text></VStack>;
        }

        if (filteredPatients.length === 0) {
            return <VStack flex={1} justifyContent="center" alignItems="center"><Text>No patients found.</Text></VStack>;
        }

        return (
            <ScrollView flex={1} px={4} showsVerticalScrollIndicator={false}>
                {filteredPatients.map(patient => (
                    <Pressable key={patient.id} onPress={() => navigation.navigate('DoctorPatientDetails', { patient: patient })}>
                        <Box bg="white" borderRadius="xl" shadow={2} p={4} mb={4}>
                            <HStack space={4} alignItems="center">
                                <Avatar bg="blue.100" size="lg">
                                    <Text color="blue.600" fontWeight="bold" fontSize="2xl">
                                        {patient.fullName?.charAt(0).toUpperCase()}
                                    </Text>
                                </Avatar>
                                <VStack flex={1}>
                                    <HStack justifyContent="space-between" alignItems="center" mb={1}>
                                        <Text fontWeight="bold" fontSize="md">{patient.fullName}</Text>
                                        <Icon as={MaterialIcons} name="chevron-right" size={6} color="gray.400" />
                                    </HStack>
                                    {/* Additional patient info can be added here if available */}
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
                    <VStack flex={1}>
                        <Text mt={5} fontSize="2xl" fontWeight="bold" color="white">My Patients</Text>
                        <Text fontSize="sm" color="green.100">{patients.length} Total Patients</Text>
                    </VStack>
                </HStack>
            </Box>

            {/* Search */}
            <Box p={4}>
                <View style={styles.inputContainer}>
                <Icon as={MaterialIcons} name="search" size={5} color="gray.400" style={styles.inputIcon} />
                <TextInput
                    placeholder="Search patients..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    style={styles.input}
                />
                </View>
            </Box>

            {/* Patients List */}
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
