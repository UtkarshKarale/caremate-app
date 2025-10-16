import React from 'react';
import { Box, Text, HStack, VStack, ScrollView, Pressable, Icon, Button } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { medicalHistory } from '@/app/src/data/doctor';

import { useAuth } from '@/app/src/screens/context/AuthContext';

export default function PatientProfileScreen() {
    const { logout } = useAuth();
    return (
        <ScrollView flex={1} bg="gray.50">
            {/* Header */}
            <Box bg="blue.600" pb={6} pt={4} px={4} borderBottomLeftRadius={24} borderBottomRightRadius={24}>
                <HStack justifyContent="space-between" alignItems="center">
                    <Text fontSize="2xl" fontWeight="bold" color="white">Patient Profile</Text>
                    <Pressable bg="blue.500" p={2} borderRadius="full">
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
                            <Text fontWeight="semibold">10001</Text>
                        </VStack>
                        <VStack flex={1}>
                            <Text fontSize="sm" color="gray.500">Date of Birth</Text>
                            <Text fontWeight="semibold">June 15, 1985</Text>
                        </VStack>
                    </HStack>
                    <HStack space={4}>
                        <VStack flex={1}>
                            <Text fontSize="sm" color="gray.500">Gender</Text>
                            <Text fontWeight="semibold">Male</Text>
                        </VStack>
                        <VStack flex={1}>
                            <Text fontSize="sm" color="gray.500">Blood Type</Text>
                            <Text fontWeight="semibold">O+</Text>
                        </VStack>
                    </HStack>
                </Box>

                {/* Medical History */}
                <Box bg="white" borderRadius="xl" shadow={1} p={6} mb={4}>
                    <Text fontSize="lg" fontWeight="bold" mb={4}>Medical History</Text>
                    {medicalHistory.map((item, idx) => (
                        <Box key={idx} borderBottomWidth={idx < medicalHistory.length - 1 ? 1 : 0} borderBottomColor="gray.200" py={3}>
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
                            <Text fontWeight="semibold">HealthCare Plus</Text>
                        </Box>
                        <HStack space={4}>
                            <VStack flex={1}>
                                <Text fontSize="sm" color="gray.500">Policy Number</Text>
                                <Text fontWeight="semibold">HCP-37664321</Text>
                            </VStack>
                            <VStack flex={1}>
                                <Text fontSize="sm" color="gray.500">Group Number</Text>
                                <Text fontWeight="semibold">G-98765</Text>
                            </VStack>
                        </HStack>
                        <Box>
                            <Text fontSize="sm" color="gray.500">Plan Type</Text>
                            <Text fontWeight="semibold">Premium Coverage</Text>
                        </Box>
                        <Box>
                            <Text fontSize="sm" color="gray.500">Effective Date</Text>
                            <Text fontWeight="semibold">Jan 1, 2023</Text>
                        </Box>
                    </VStack>
                </Box>
                <Button onPress={logout} colorScheme="red">Logout</Button>
            </Box>
        </ScrollView>
    );
}