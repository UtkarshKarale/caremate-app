import React from 'react';
import { Box, Text, HStack, VStack, ScrollView, Icon } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

export default function MedicalRecordsScreen() {
    return (
        <ScrollView flex={1} bg="gray.50">
            {/* Header */}
            <Box bg="blue.600" pb={6} pt={4} px={4} borderBottomLeftRadius={24} borderBottomRightRadius={24}>
                <Text fontSize="2xl" fontWeight="bold" color="white">Medical Records</Text>
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
                    {['Lisinopril 10mg', 'Metformin 500mg', 'Vitamin D3'].map((med, idx) => (
                        <Box key={idx} borderBottomWidth={idx < 2 ? 1 : 0} borderBottomColor="gray.200" py={3}>
                            <HStack justifyContent="space-between" alignItems="center">
                                <VStack>
                                    <Text fontWeight="semibold">{med}</Text>
                                    <Text fontSize="sm" color="gray.500">Prescribed by Dr. Sarah Miller</Text>
                                </VStack>
                                <Text color="green.600" fontWeight="semibold" fontSize="sm">Active</Text>
                            </HStack>
                        </Box>
                    ))}
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