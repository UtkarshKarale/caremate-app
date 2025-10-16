import React from 'react';
import { Box, Text, HStack, VStack, ScrollView, Pressable, Icon } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/app/src/screens/context/AuthContext';

export default function DoctorProfileScreen() {
    const { logout } = useAuth();

    return (
        <ScrollView flex={1} bg="gray.50">
            {/* Header */}
            <Box bg="green.600" pb={6} pt={4} px={4} borderBottomLeftRadius={24} borderBottomRightRadius={24}>
                <HStack justifyContent="space-between" alignItems="center">
                    <Text fontSize="2xl" fontWeight="bold" color="white">Doctor Profile</Text>
                    <HStack>
                        <Pressable bg="green.500" p={2} borderRadius="full">
                            <Icon as={MaterialIcons} name="edit" size={5} color="white" />
                        </Pressable>
                        <Pressable bg="red.500" p={2} borderRadius="full" ml={2} onPress={logout}>
                            <Icon as={MaterialIcons} name="logout" size={5} color="white" />
                        </Pressable>
                    </HStack>
                </HStack>
            </Box>

            {/* Profile Info */}
            <Box p={4}>
                <Box bg="white" borderRadius="xl" shadow={1} p={6} mb={4}>
                    <HStack space={4} mb={4}>
                        <VStack flex={1}>
                            <Text fontSize="sm" color="gray.500">ID</Text>
                            <Text fontWeight="semibold">20001</Text>
                        </VStack>
                        <VStack flex={1}>
                            <Text fontSize="sm" color="gray.500">Specialty</Text>
                            <Text fontWeight="semibold">Cardiologist</Text>
                        </VStack>
                    </HStack>
                    <HStack space={4}>
                        <VStack flex={1}>
                            <Text fontSize="sm" color="gray.500">Experience</Text>
                            <Text fontWeight="semibold">15 years</Text>
                        </VStack>
                        <VStack flex={1}>
                            <Text fontSize="sm" color="gray.500">Consultation Fee</Text>
                            <Text fontWeight="semibold">$200</Text>
                        </VStack>
                    </HStack>
                </Box>
            </Box>
        </ScrollView>
    );
}