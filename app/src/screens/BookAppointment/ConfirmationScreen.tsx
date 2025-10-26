import React, { useEffect, useState } from 'react';
import { Box, Text, HStack, VStack, ScrollView, Pressable, Avatar, Icon, Button, Spinner } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { applyAppointment } from '@/lib/api';
import { useAuth } from '@/app/src/screens/context/AuthContext';

export default function ConfirmationScreen({ navigation, route }: any) {
    const { appointmentDetails } = route.params;
    const { user } = useAuth();

    const [isLoading, setIsLoading] = useState(true);
    const [isUserReady, setIsUserReady] = useState(false);

    // 🧩 Check when user or appointmentDetails are available
    useEffect(() => {
        console.log('useEffect triggered: user or appointmentDetails changed');
        console.log('User from context:', user);
        console.log('Appointment details:', appointmentDetails);

        if (user && user.id) {
            setIsUserReady(true);
        } else {
            setIsUserReady(false);
        }

        setIsLoading(false);
    }, [user, appointmentDetails]);

    const handleConfirm = async () => {
        if (!user?.id) {
            console.error('❌ User ID is missing. Cannot book appointment.');
            alert('User not logged in. Please try again.');
            return;
        }

        try {
            const appointmentData = {
                patientId: user.id,
                doctorId: appointmentDetails.doctor.id,
                appointmentDate: appointmentDetails.date,
                appointmentTime: appointmentDetails.time,
                status: 'SCHEDULED',
                disease: appointmentDetails.reasonForVisit, // Use reasonForVisit from appointmentDetails
                price: appointmentDetails.price, // Include price
            };

            // 🕒 Convert time properly
            const timeMatch = appointmentDetails.time.match(/(\d+):(\d+)\s(AM|PM)/);
            if (!timeMatch) throw new Error('Invalid time format');

            const [_, hours, minutes, ampm] = timeMatch;
            const isPM = ampm === 'PM';
            const formattedHours =
                isPM && hours !== '12'
                    ? parseInt(hours, 10) + 12
                    : ampm === 'AM' && hours === '12'
                    ? 0
                    : parseInt(hours, 10);

            const combinedDateTimeString = `${appointmentDetails.date}T${formattedHours
                .toString()
                .padStart(2, '0')}:${minutes}:00`;
            const combinedDateTime = new Date(combinedDateTimeString);

            if (isNaN(combinedDateTime.getTime())) {
                throw new Error('Invalid date or time provided');
            }

            const finalAppointmentData = {
                ...appointmentData,
                appointmentDate: combinedDateTime.toISOString(),
                appointmentTime: combinedDateTime.toISOString(),
            };

            console.log('✅ Sending appointment data:', finalAppointmentData);
            await applyAppointment(finalAppointmentData);

            navigation.navigate('Success');
        } catch (error) {
            console.error('Error booking appointment:', error);
            alert('Failed to book appointment. Please try again.');
        }
    };

    if (isLoading) {
        return (
            <Box flex={1} justifyContent="center" alignItems="center" bg="gray.50">
                <Spinner color="blue.600" size="lg" />
                <Text mt={3} color="gray.500">Loading user details...</Text>
            </Box>
        );
    }

    return (
        <Box flex={1} bg="gray.50">
            {/* Header */}
            <Box bg="blue.600" pb={6} pt={4} px={4} borderBottomLeftRadius={24} borderBottomRightRadius={24}>
                <HStack mt={5} alignItems="center" mb={3}>
                    <Pressable mr={3} onPress={() => navigation.goBack()}>
                        <Icon as={MaterialIcons} name="arrow-back" size={6} color="white" />
                    </Pressable>
                    <VStack flex={1}>
                        <Text fontSize="2xl" fontWeight="bold" color="white">
                            Confirm Appointment
                        </Text>
                    </VStack>
                </HStack>
            </Box>

            <ScrollView flex={1} px={4} py={4} showsVerticalScrollIndicator={false}>
                <Box bg="white" borderRadius="xl" shadow={1} p={4} mb={4}>
                    <VStack space={4}>
                        <HStack space={3} alignItems="center">
                            <Avatar
                                size="md"
                                source={{ uri: appointmentDetails.doctor.image }}
                                bg="green.600"
                            >
                                {appointmentDetails.doctor.fullName
                                    ? appointmentDetails.doctor.fullName.charAt(0).toUpperCase()
                                    : 'D'}
                            </Avatar>
                            <VStack flex={1}>
                                <Text fontWeight="bold" fontSize="md">
                                    {appointmentDetails.doctor.fullName}
                                </Text>
                                <Text fontSize="sm" color="gray.600">
                                    {appointmentDetails.doctor.specialist}
                                </Text>
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
                        <HStack justifyContent="space-between">
                            <Text color="gray.500">Price</Text>
                            <Text fontWeight="semibold">Rs. {appointmentDetails.price}</Text>
                        </HStack>
                        <HStack justifyContent="space-between">
                            <Text color="gray.500">Reason</Text>
                            <Text fontWeight="semibold">{appointmentDetails.reasonForVisit}</Text>
                        </HStack>
                    </VStack>
                </Box>

                <Button
                    bg="blue.600"
                    borderRadius="xl"
                    py={4}
                    mb={4}
                    onPress={handleConfirm}
                    _pressed={{ bg: 'blue.700' }}
                    isDisabled={!isUserReady}
                >
                    <Text color="white" fontSize="md" fontWeight="bold">
                        Confirm & Book
                    </Text>
                </Button>
            </ScrollView>
        </Box>
    );
}
