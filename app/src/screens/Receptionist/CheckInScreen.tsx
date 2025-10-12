import React, { useState } from 'react';
import { Box, Text, Input, VStack, HStack, ScrollView, Pressable, Icon, Button, Radio } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

export default function CheckInScreen({ navigation }: any) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPatient, setSelectedPatient] = useState('');
    const [appointmentType, setAppointmentType] = useState('scheduled');

    const patients = [
        { id: '1', name: 'John Smith', phone: '+1 234-567-8900', appointmentTime: '09:00 AM' },
        { id: '2', name: 'Emma Wilson', phone: '+1 234-567-8901', appointmentTime: '10:30 AM' },
        { id: '3', name: 'Michael Brown', phone: '+1 234-567-8902', appointmentTime: '11:00 AM' },
    ];

    const handleCheckIn = () => {
        // Handle check-in logic
        navigation.goBack();
    };

    // @ts-ignore
    return (
        <Box flex={1} bg="gray.50">
            {/* Header */}
            <Box bg="purple.600" pb={6} pt={4} px={4} borderBottomLeftRadius={24} borderBottomRightRadius={24}>
                <HStack alignItems="center" mb={3}>
                    <Pressable mr={3} onPress={() => navigation.goBack()}>
                        <Icon as={MaterialIcons} name="arrow-back" size={6} color="white" />
                    </Pressable>
                    <VStack flex={1}>
                        <Text fontSize="2xl" fontWeight="bold" color="white">Check-In Patient</Text>
                        <Text fontSize="sm" color="purple.100">Process patient arrival</Text>
                    </VStack>
                </HStack>
            </Box>

            <ScrollView flex={1} px={4} py={4}>
                {/* Appointment Type */}
                <Box bg="white" borderRadius="xl" shadow={1} p={6} mb={4}>
                    <Text fontSize="md" fontWeight="bold" mb={3}>Appointment Type</Text>
                    <Radio.Group name={"appointmentType"} value={appointmentType} onChange={setAppointmentType}>
                        <VStack space={3}>
                            <Radio value="scheduled" colorScheme="purple">
                                <Text fontWeight="semibold" ml={2}>Scheduled Appointment</Text>
                            </Radio>
                            <Radio value="walkin" colorScheme="purple">
                                <Text fontWeight="semibold" ml={2}>Walk-In</Text>
                            </Radio>
                            <Radio value="emergency" colorScheme="purple">
                                <Text fontWeight="semibold" ml={2}>Emergency</Text>
                            </Radio>
                        </VStack>
                    </Radio.Group>
                </Box>

                {/* Search Patient */}
                <Box bg="white" borderRadius="xl" shadow={1} p={6} mb={4}>
                    <Text fontSize="md" fontWeight="bold" mb={3}>Search Patient</Text>
                    <Input
                        placeholder="Search by name or phone..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        borderRadius="xl"
                        py={3}
                        px={4}
                        fontSize="md"
                        bg="gray.50"
                        borderWidth={1}
                        borderColor="gray.200"
                        _focus={{ borderColor: 'purple.600', bg: 'white' }}
                        InputLeftElement={
                            <Icon as={MaterialIcons} name="search" size={5} color="gray.400" ml={3} />
                        }
                        mb={4}
                    />

                    {/* Patient List */}
                    <VStack space={2}>
                        {patients.map(patient => (
                            <Pressable
                                key={patient.id}
                                onPress={() => setSelectedPatient(patient?.id.toString)}
                            >
                                <Box
                                    bg={selectedPatient === patient.id ? 'purple.50' : 'gray.50'}
                                    borderRadius="lg"
                                    p={3}
                                    borderWidth={selectedPatient === patient.id ? 2 : 1}
                                    borderColor={selectedPatient === patient.id ? 'purple.600' : 'gray.200'}
                                >
                                    <HStack justifyContent="space-between" alignItems="center">
                                        <VStack>
                                            <Text fontWeight="semibold">{patient.name}</Text>
                                            <Text fontSize="sm" color="gray.600">{patient.phone}</Text>
                                            <Text fontSize="xs" color="purple.600" mt={1}>Appointment: {patient.appointmentTime}</Text>
                                        </VStack>
                                        {selectedPatient === patient.id && (
                                            <Icon as={MaterialIcons} name="check-circle" size={6} color="purple.600" />
                                        )}
                                    </HStack>
                                </Box>
                            </Pressable>
                        ))}
                    </VStack>
                </Box>

                {/* Additional Information */}
                {selectedPatient && (
                    <Box bg="white" borderRadius="xl" shadow={1} p={6} mb={4}>
                        <Text fontSize="md" fontWeight="bold" mb={3}>Additional Information</Text>
                        <VStack space={3}>
                            <Input
                                placeholder="Reason for visit"
                                borderRadius="xl"
                                py={3}
                                px={4}
                                bg="gray.50"
                                borderWidth={1}
                                borderColor="gray.200"
                            />
                            <Input
                                placeholder="Special notes (optional)"
                                borderRadius="xl"
                                py={3}
                                px={4}
                                bg="gray.50"
                                borderWidth={1}
                                borderColor="gray.200"
                                multiline
                                numberOfLines={3}
                            />
                        </VStack>
                    </Box>
                )}

                {/* Check-In Button */}
                <Button
                    bg="purple.600"
                    borderRadius="xl"
                    py={4}
                    mb={6}
                    isDisabled={!selectedPatient}
                    onPress={handleCheckIn}
                    _pressed={{ bg: 'purple.700' }}
                >
                    <Text color="white" fontSize="md" fontWeight="bold">
                        Complete Check-In
                    </Text>
                </Button>
            </ScrollView>
        </Box>
    );
}