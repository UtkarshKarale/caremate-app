import React, { useEffect, useState } from 'react';
import { Box, Text, HStack, VStack, ScrollView, Icon } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { getPrescriptionsByPatientId } from '../../../lib/api'; // Adjust the import path as needed

export default function MedicalRecordsScreen() {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPrescriptions = async () => {
            try {
                // Assuming a patient ID of 1 for now
                const data = await getPrescriptionsByPatientId('1');
                setPrescriptions(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPrescriptions();
    }, []);

    return (
        <ScrollView flex={1} bg="gray.50">
            {/* Header */}
            <Box  bg="blue.600" pb={6} pt={4} px={4} borderBottomLeftRadius={24} borderBottomRightRadius={24}>
                <Text mt={5} fontSize="2xl" fontWeight="bold" color="white">Medical Records</Text>
            </Box>

            <Box p={4} pb={24}>
                {/* Lab Results */}
                <Box bg="white" borderRadius="xl" shadow={1} p={6} mb={4}>
                    <Text fontSize="lg" fontWeight="bold" mb={4}>Lab Results</Text>
                    {['Blood Test - Complete', 'Urine Analysis', 'X-Ray Chest'].map((test, idx) => (
                        <Box key={idx} borderBottomWidth={idx < 2 ? 1 : 0} borderBottomColor="gray.200" py={3}>
                            <HStack justifyContent="space-between" alignItems="center">
                                <VStack>
                                    <Text fontWeight="semibold">{test}</Text>
                                    <Text fontSize="sm" color="gray.500">Oct {10 - idx}, 2025</Text>
                                </VStack>
                                <Text color="blue.600" fontWeight="semibold" fontSize="sm">View</Text>
                            </HStack>
                        </Box>
                    ))}
                </Box>

                {/* Prescriptions */}
                <Box bg="white" borderRadius="xl" shadow={1} p={6} mb={4}>
                    <Text fontSize="lg" fontWeight="bold" mb={4}>Prescriptions</Text>
                    {loading ? (
                        <Text>Loading prescriptions...</Text>
                    ) : error ? (
                        <Text>Error fetching prescriptions.</Text>
                    ) : (
                        prescriptions.map((med, idx) => (
                            <Box key={idx} borderBottomWidth={idx < prescriptions.length - 1 ? 1 : 0} borderBottomColor="gray.200" py={3}>
                                <HStack justifyContent="space-between" alignItems="center">
                                    <VStack>
                                        <Text fontWeight="semibold">{med.medication}</Text>
                                        <Text fontSize="sm" color="gray.500">Prescribed by Dr. {med.doctorName}</Text>
                                    </VStack>
                                    <Text color="green.600" fontWeight="semibold" fontSize="sm">{med.status}</Text>
                                </HStack>
                            </Box>
                        ))
                    )}
                </Box>

                {/* Documents */}
                <Box bg="white" borderRadius="xl" shadow={1} p={6}>
                    <Text fontSize="lg" fontWeight="bold" mb={4}>Documents</Text>
                    {['Vaccination Record', 'Allergy Information', 'Surgical History'].map((doc, idx) => (
                        <Box key={idx} borderBottomWidth={idx < 2 ? 1 : 0} borderBottomColor="gray.200" py={3}>
                            <HStack justifyContent="space-between" alignItems="center">
                                <HStack space={3} alignItems="center">
                                    <Box bg="blue.100" p={2} borderRadius="lg">
                                        <Icon as={MaterialIcons} name="description" size={5} color="blue.600" />
                                    </Box>
                                    <Text fontWeight="semibold">{doc}</Text>
                                </HStack>
                                <Text color="blue.600" fontWeight="semibold" fontSize="sm">Open</Text>
                            </HStack>
                        </Box>
                    ))}
                </Box>
            </Box>
        </ScrollView>
    );
}