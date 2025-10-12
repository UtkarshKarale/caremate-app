import React, { useState } from 'react';
import { Box, Text, HStack, VStack, ScrollView, Pressable, Avatar, Icon, Radio, Button } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { dates } from '@/app/src/data/doctor';

export default function TimeSlotSelectionScreen({ navigation, route }: any) {
    const { doctor } = route.params;
    const [selectedDate, setSelectedDate] = useState(dates[0].id);
    const [selectedTime, setSelectedTime] = useState('');
    const [appointmentType, setAppointmentType] = useState('in-person');

    const handleConfirm = () => {
        const selectedDateObj = dates.find(d => d.id === selectedDate);
        const appointmentDetails = {
            doctor,
            date: `${selectedDateObj?.day}, ${selectedDateObj?.date} ${selectedDateObj?.month}`,
            time: selectedTime,
            type: appointmentType
        };
        navigation.navigate('Confirmation', { appointmentDetails });
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
                        <Text fontSize="2xl" fontWeight="bold" color="white">Select Date & Time</Text>
                        <Text fontSize="sm" color="blue.100">Choose your preferred slot</Text>
                    </VStack>
                </HStack>
            </Box>

            <ScrollView flex={1} px={4} py={4} showsVerticalScrollIndicator={false}>
                {/* Doctor Info */}
                <Box bg="white" borderRadius="xl" shadow={1} p={4} mb={4}>
                    <HStack space={3} alignItems="center">
                        <Avatar size="md" source={{ uri: doctor.image }} />
                        <VStack flex={1}>
                            <Text fontWeight="bold" fontSize="md">{doctor.name}</Text>
                            <Text fontSize="sm" color="gray.600">{doctor.specialty}</Text>
                            <HStack alignItems="center" space={1}>
                                <Icon as={MaterialIcons} name="star" size={4} color="yellow.400" />
                                <Text fontSize="sm">{doctor.rating}</Text>
                            </HStack>
                        </VStack>
                    </HStack>
                </Box>

                {/* Date Selection */}
                <Box mb={4}>
                    <Text fontSize="lg" fontWeight="bold" mb={3}>Select Date</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <HStack space={3}>
                            {dates.map(date => (
                                <Pressable
                                    key={date.id}
                                    onPress={() => setSelectedDate(date.id)}
                                >
                                    <Box
                                        bg={selectedDate === date.id ? 'blue.600' : 'white'}
                                        borderRadius="xl"
                                        p={4}
                                        minW={20}
                                        alignItems="center"
                                        shadow={selectedDate === date.id ? 2 : 1}
                                        borderWidth={selectedDate === date.id ? 0 : 1}
                                        borderColor="gray.200"
                                    >
                                        <Text
                                            fontSize="xs"
                                            fontWeight="semibold"
                                            color={selectedDate === date.id ? 'white' : 'gray.500'}
                                            mb={1}
                                        >
                                            {date.day}
                                        </Text>
                                        <Text
                                            fontSize="2xl"
                                            fontWeight="bold"
                                            color={selectedDate === date.id ? 'white' : 'gray.800'}
                                        >
                                            {date.date}
                                        </Text>
                                        <Text
                                            fontSize="xs"
                                            color={selectedDate === date.id ? 'blue.100' : 'gray.500'}
                                        >
                                            {date.month}
                                        </Text>
                                    </Box>
                                </Pressable>
                            ))}
                        </HStack>
                    </ScrollView>
                </Box>

                {/* Time Slots */}
                <Box mb={4}>
                    <Text fontSize="lg" fontWeight="bold" mb={3}>Available Time Slots</Text>
                    <HStack flexWrap="wrap" space={3}>
                        {doctor.availableSlots.map((slot: any, idx: any) => (
                            <Pressable
                                key={idx}
                                onPress={() => setSelectedTime(slot)}
                                mb={3}
                            >
                                <Box
                                    bg={selectedTime === slot ? 'blue.600' : 'white'}
                                    borderRadius="lg"
                                    px={5}
                                    py={3}
                                    borderWidth={selectedTime === slot ? 0 : 1}
                                    borderColor="gray.200"
                                    shadow={selectedTime === slot ? 2 : 1}
                                >
                                    <Text
                                        fontWeight="semibold"
                                        color={selectedTime === slot ? 'white' : 'gray.700'}
                                    >
                                        {slot}
                                    </Text>
                                </Box>
                            </Pressable>
                        ))}
                    </HStack>
                </Box>

                {/* Appointment Type */}
                <Box mb={6}>
                    <Text fontSize="lg" fontWeight="bold" mb={3}>Appointment Type</Text>
                    <Radio.Group
                        name="appointmentType"
                        value={appointmentType}
                        onChange={setAppointmentType}
                    >
                        <VStack space={3}>
                            <Radio value="in-person" size="sm" colorScheme="blue">
                                <Text fontWeight="semibold" ml={2}>In-Person Visit</Text>
                            </Radio>
                            <Radio value="video" size="sm" colorScheme="blue">
                                <Text fontWeight="semibold" ml={2}>Video Consultation</Text>
                            </Radio>
                        </VStack>
                    </Radio.Group>
                </Box>

                {/* Confirm Button */}
                <Button
                    bg="blue.600"
                    borderRadius="xl"
                    py={4}
                    mb={4}
                    isDisabled={!selectedTime}
                    onPress={handleConfirm}
                    _pressed={{ bg: 'blue.700' }}
                >
                    <Text color="white" fontSize="md" fontWeight="bold">
                        Confirm Appointment
                    </Text>
                </Button>
            </ScrollView>
        </Box>
    );
}