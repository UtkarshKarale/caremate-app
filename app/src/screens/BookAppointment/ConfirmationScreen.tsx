import React from 'react';
import { Box, Text, HStack, VStack, ScrollView, Pressable, Avatar, Icon, Button } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { applyAppointment } from '@/lib/api';
import { useAuth } from '@/app/src/screens/context/AuthContext';

export default function ConfirmationScreen({ navigation, route }: any) {
    const { appointmentDetails } = route.params;
    const { user } = useAuth();

    const handleConfirm = async () => {
        try {
            const appointmentData = {
                patientId: user.id,
                doctorId: appointmentDetails.doctor.id,
                appointmentDate: new Date(), // This should be the selected date
                appointmentTime: appointmentDetails.time,
                status: 'SCHEDULED',
                reason: 'Regular Checkup', // This can be taken from a form
            };
            await applyAppointment(appointmentData);
            navigation.navigate('Success'); // Navigate to a success screen
        } catch (error) {
            console.error('Error booking appointment:', error);
        }
    };

    return (
        <Box flex={1} bg="gray.50">
            {/* Header */}
            <Box bg="blue.600" pb={6} pt={4} px={4} borderBottomLeftRadius={24} borderBottomRightRadius={24}>
                <HStack alignItems="center" mb={3}>
                    <Pressable mr={3} onPress={() => navigation.goBack()}>
                        <Icon as={MaterialIcons} name="arrow-back" size={6} color="white" />
                    </Pressable>
                    <VStack flex={1}>
                        <Text fontSize="2xl" fontWeight="bold" color="white">Confirm Appointment</Text>
                    </VStack>
                </HStack>
            </Box>

            <ScrollView flex={1} px={4} py={4} showsVerticalScrollIndicator={false}>
                {/* Appointment Details */}
                <Box bg="white" borderRadius="xl" shadow={1} p={4} mb={4}>
                    <VStack space={4}>
                        <HStack space={3} alignItems="center">
                            <Avatar size="md" source={{ uri: appointmentDetails.doctor.image }} />
                            <VStack flex={1}>
                                <Text fontWeight="bold" fontSize="md">{appointmentDetails.doctor.name}</Text>
                                <Text fontSize="sm" color="gray.600">{appointmentDetails.doctor.specialty}</Text>
                            </VStack>
                        </HStack>
                        <HStack justifyContent="space-between">
                            <Text color="gray.500">Date</Text>
                            <Text fontWeight="semibold">{appointmentDetails.date}</Text>
                        </HStack>
                        <HStack justifyContent="space-between">
                            <Text color="gray.500">Time</Text>
                            <Text fontWeight="semibold">{appointmentDetails.time}</Text>
                        </HStack>
                        <HStack justifyContent="space-between">
                            <Text color="gray.500">Type</Text>
                            <Text fontWeight="semibold">{appointmentDetails.type}</Text>
                        </HStack>
                    </VStack>
                </Box>

                {/* Confirm Button */}
                <Button
                    bg="blue.600"
                    borderRadius="xl"
                    py={4}
                    mb={4}
                    onPress={handleConfirm}
                    _pressed={{ bg: 'blue.700' }}
                >
                    <Text color="white" fontSize="md" fontWeight="bold">
                        Confirm & Book
                    </Text>
                </Button>
            </ScrollView>
        </Box>
    );
}
