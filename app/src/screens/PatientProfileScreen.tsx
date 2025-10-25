import React, { useState, useEffect } from 'react';
import { Box, Text, HStack, VStack, ScrollView, Pressable, Icon, Button, Spinner } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/app/src/screens/context/AuthContext';
import { findUserById } from '@/lib/api';

export default function PatientProfileScreen({ navigation }: any) {
    const { logout, user, isLoading } = useAuth();
    const [patientData, setPatientData] = useState<any>(null);
    const [isFetchingProfile, setIsFetchingProfile] = useState(true);

    useEffect(() => {
        const fetchPatientData = async () => {
            if (user?.id) {
                try {
                    setIsFetchingProfile(true);
                    const data = await findUserById(user.id);
                    setPatientData(data);
                } catch (error) {
                    console.error("Error fetching patient profile:", error);
                } finally {
                    setIsFetchingProfile(false);
                }
            }
        };
        fetchPatientData();
    }, [user]);

    if (isLoading || isFetchingProfile) {
        return (
            <Box flex={1} justifyContent="center" alignItems="center" bg="gray.50">
                <Spinner size="lg" color="blue.600" />
                <Text mt={2} color="gray.600">Loading profile...</Text>
            </Box>
        );
    }

    if (!user || !patientData) {
        return (
            <Box flex={1} justifyContent="center" alignItems="center" bg="gray.50">
                <Text color="gray.600">No patient data found.</Text>
            </Box>
        );
    }

    return (
        <ScrollView flex={1} bg="gray.50">
            {/* Header */}
            <Box bg="blue.600" pb={6} pt={4} px={4} borderBottomLeftRadius={24} borderBottomRightRadius={24}>
                <HStack justifyContent="space-between" alignItems="center">
                    <Text fontSize="2xl" fontWeight="bold" color="white">Patient Profile</Text>
                    <Pressable bg="blue.500" p={2} borderRadius="full" onPress={() => navigation.navigate('EditUserScreen')}>
                        <Icon as={MaterialIcons} name="edit" size={5} color="white" />
                    </Pressable>
                </HStack>
            </Box>

            {/* Profile Info */}
            <Box p={4}>
                <Box bg="white" borderRadius="xl" shadow={1} p={6} mb={4}>
                    <HStack space={4} mb={4}>
                        <VStack flex={1}>
                            <Text fontSize="sm" color="gray.500">ID</Text>
                            <Text fontWeight="semibold">{patientData.id}</Text>
                        </VStack>
                        <VStack flex={1}>
                            <Text fontSize="sm" color="gray.500">Date of Birth</Text>
                            <Text fontWeight="semibold">{patientData.dob}</Text>
                        </VStack>
                    </HStack>
                    <HStack space={4}>
                        <VStack flex={1}>
                            <Text fontSize="sm" color="gray.500">Gender</Text>
                            <Text fontWeight="semibold">{patientData.gender}</Text>
                        </VStack>
                        <VStack flex={1}>
                            <Text fontSize="sm" color="gray.500">Blood Type</Text>
                            <Text fontWeight="semibold">{patientData.bloodType}</Text>
                        </VStack>
                    </HStack>
                </Box>

                {/* Medical History */}
                <Box bg="white" borderRadius="xl" shadow={1} p={6} mb={4}>
                    <Text fontSize="lg" fontWeight="bold" mb={4}>Medical History</Text>
                    {patientData.medicalHistory?.map((item: any, idx: number) => (
                        <Box key={idx} borderBottomWidth={idx < patientData.medicalHistory.length - 1 ? 1 : 0} borderBottomColor="gray.200" py={3}>
                            <HStack justifyContent="space-between" alignItems="flex-start">
                                <VStack>
                                    <Text fontWeight="semibold">{item.condition}</Text>
                                    <Text fontSize="sm" color="gray.500">Diagnosed: {item.diagnosed}</Text>
                                </VStack>
                                <Text color="blue.600" fontSize="sm" fontWeight="semibold">{item.status}</Text>
                            </HStack>
                        </Box>
                    ))}
                </Box>

                {/* Insurance Information */}
                <Box bg="white" borderRadius="xl" shadow={1} p={6} mb={24}>
                    <Text fontSize="lg" fontWeight="bold" mb={4}>Insurance Information</Text>
                    <VStack space={3}>
                        <Box>
                            <Text fontSize="sm" color="gray.500">Provider</Text>
                            <Text fontWeight="semibold">{patientData.insurance?.provider}</Text>
                        </Box>
                        <HStack space={4}>
                            <VStack flex={1}>
                                <Text fontSize="sm" color="gray.500">Policy Number</Text>
                                <Text fontWeight="semibold">{patientData.insurance?.policyNumber}</Text>
                            </VStack>
                            <VStack flex={1}>
                                <Text fontSize="sm" color="gray.500">Group Number</Text>
                                <Text fontWeight="semibold">{patientData.insurance?.groupNumber}</Text>
                            </VStack>
                        </HStack>
                        <Box>
                            <Text fontSize="sm" color="gray.500">Plan Type</Text>
                            <Text fontWeight="semibold">{patientData.insurance?.planType}</Text>
                        </Box>
                        <Box>
                            <Text fontSize="sm" color="gray.500">Effective Date</Text>
                            <Text fontWeight="semibold">{patientData.insurance?.effectiveDate}</Text>
                        </Box>
                    </VStack>
                </Box>
                <Button onPress={logout} colorScheme="red">Logout</Button>
            </Box>
        </ScrollView>
    );
}