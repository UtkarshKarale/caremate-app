import React, { useState, useEffect } from 'react';
import { Box, Text, HStack, VStack, ScrollView, Pressable, Avatar, Icon, Radio, Button } from 'native-base';
import { Picker } from '@react-native-picker/picker';
import { StyleSheet, TextInput, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getDoctorTodaysAppointments } from '../../../../lib/api';

const allTimeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
];

const commonReasons = [
    'General Check-up',
    'Fever',
    'Headache',
    'Stomach Pain',
    'Cough and Cold',
    'Follow-up',
    'Other'
];

const generateDates = () => {
    const today = new Date();
    const datesArray = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const day = date.toLocaleDateString('en-US', { weekday: 'short' });
        const dayOfMonth = date.getDate();
        const month = date.toLocaleDateString('en-US', { month: 'short' });
        const fullDate = date.toISOString().split('T')[0]; // YYYY-MM-DD
        datesArray.push({ id: i + 1, day, date: dayOfMonth, month, fullDate });
    }
    return datesArray;
};

export default function TimeSlotSelectionScreen({ navigation, route }: any) {
    const { doctor } = route.params;
    const generatedDates = generateDates();
    const [selectedDateId, setSelectedDateId] = useState(generatedDates[0].id);
    const [selectedTime, setSelectedTime] = useState('');
    const [appointmentType, setAppointmentType] = useState('in-person');
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [doctorFees, setDoctorFees] = useState(100); // Static doctor fees
    const [selectedReason, setSelectedReason] = useState('');
    const [customReason, setCustomReason] = useState(''); // For 'Other' option

    useEffect(() => {
        const fetchAppointments = async () => {
            if (doctor?.id) {
                console.log('Doctor ID for fetching appointments:', doctor.id);
                try {
                    setLoading(true);
                    const appointments = await getDoctorTodaysAppointments(doctor.id);
                    const bookedSlots = appointments.map(app => app.time);
                    const available = allTimeSlots.filter(slot => !bookedSlots.includes(slot));
                    setAvailableSlots(available);
                } catch (error) {
                    console.error('Error fetching appointments:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchAppointments();
    }, [doctor.id]);

    const handleConfirm = () => {
        const selectedDateObj = generatedDates.find(d => d.id === selectedDateId);
        // @ts-ignore
        const appointmentDetails = {
            doctor,
            date: selectedDateObj?.fullDate, // Pass YYYY-MM-DD format
            time: selectedTime,
            type: appointmentType,
            price: doctorFees, // Include doctor fees
            reasonForVisit: selectedReason === 'Other' ? customReason : selectedReason, // Include reason for visit
        };
        navigation.navigate('Confirmation', { appointmentDetails });
    };

    return (
        <Box flex={1} bg="gray.50">
            {/* Header */}
            <Box bg="blue.600" pb={6} pt={4} px={4} borderBottomLeftRadius={24} borderBottomRightRadius={24}>
                <HStack mt={5} alignItems="center" mb={3}>
                    <Pressable mt={5} mr={3} onPress={() => navigation.goBack()}>
                        <Icon as={MaterialIcons} name="arrow-back" size={6} color="white" />
                    </Pressable>
                    <VStack mt={5} flex={1}>
                        <Text fontSize="2xl" fontWeight="bold" color="white">Select Date & Time</Text>
                        <Text fontSize="sm" color="blue.100">Choose your preferred slot</Text>
                    </VStack>
                </HStack>
            </Box>

            <ScrollView flex={1} px={4} py={4} showsVerticalScrollIndicator={false}>
                {/* Doctor Info */}
                <Box bg="white" borderRadius="xl" shadow={1} p={4} mb={4}>
                    <HStack space={3} alignItems="center">
                        <Avatar bg="green.600" size="md" source={{ uri: doctor.image }} >
                            {doctor.fullName ? doctor.fullName.charAt(0).toUpperCase() : 'D'}
                        </Avatar>
                        <VStack flex={1}>
                            <Text fontWeight="bold" fontSize="md">{doctor.fullName}</Text>
                            <Text fontSize="sm" color="gray.600">{doctor.specialist}</Text>
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
                            {generatedDates.map(date => (
                                <Pressable
                                    key={date.id}
                                    onPress={() => setSelectedDateId(date.id)}
                                >
                                    <Box
                                        bg={selectedDateId === date.id ? 'blue.600' : 'white'}
                                        borderRadius="xl"
                                        p={4}
                                        minW={20}
                                        alignItems="center"
                                        shadow={selectedDateId === date.id ? 2 : 1}
                                        borderWidth={selectedDateId === date.id ? 0 : 1}
                                        borderColor="gray.200"
                                    >
                                        <Text
                                            fontSize="xs"
                                            fontWeight="semibold"
                                            color={selectedDateId === date.id ? 'white' : 'gray.500'}
                                            mb={1}
                                        >
                                            {date.day}
                                        </Text>
                                        <Text
                                            fontSize="2xl"
                                            fontWeight="bold"
                                            color={selectedDateId === date.id ? 'white' : 'gray.800'}
                                        >
                                            {date.date}
                                        </Text>
                                        <Text
                                            fontSize="xs"
                                            color={selectedDateId === date.id ? 'blue.100' : 'gray.500'}
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
                    {loading ? (
                        <Text>Loading available slots...</Text>
                    ) : (
                        <HStack flexWrap="wrap" space={3}>
                            {availableSlots.map((slot, idx) => (
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
                    )}
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

                {/* Doctor Fees */}
                <Box mb={6}>
                    <Text fontSize="lg" fontWeight="bold" mb={3}>Doctor Fees</Text>
                    <Box bg="white" p={4} borderRadius="xl" shadow={1}>
                        <HStack justifyContent="space-between" alignItems="center">
                            <Text fontSize="md" color="gray.700">Consultation Fee</Text>
                            <Text fontSize="md" fontWeight="bold" color="blue.600">Rs. {doctorFees}</Text>
                        </HStack>
                        <Text fontSize="xs" color="gray.500" mt={1}>
                            This is a static fee. It will be dynamic in future updates.
                        </Text>
                    </Box>
                </Box>

                {/* Reason for Visit / Notes */}
                <Box mb={6}>
                    <Text fontSize="lg" fontWeight="bold" mb={3}>Reason for Visit</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={selectedReason}
                            onValueChange={(itemValue) => setSelectedReason(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Choose Reason" value="" />
                            {commonReasons.map((reason, index) => (
                                <Picker.Item key={index} label={reason} value={reason} />
                            ))}
                        </Picker>
                    </View>
                    {selectedReason === 'Other' && (
                        <TextInput
                            style={styles.textInput}
                            placeholder="Please specify"
                            value={customReason}
                            onChangeText={setCustomReason}
                        />
                    )}
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

const styles = StyleSheet.create({
    pickerContainer: {
        backgroundColor: 'white',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0', // gray.200
        overflow: 'hidden', // Ensures the picker doesn't overflow rounded corners
    },
    picker: {
        height: 50, // Standard height for form elements
        width: '100%',
    },
    textInput: {
        backgroundColor: 'white',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0', // gray.200
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginTop: 12,
        fontSize: 16,
        color: '#2D3748', // gray.700
    },
});