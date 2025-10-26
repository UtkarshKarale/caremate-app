import React, { useState, useEffect, useRef } from 'react';
import { Box, Text, VStack, HStack, Avatar, Icon, useToast } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { getAppointmentById, updateAppointmentStatus } from '@/lib/api';
import { Alert, Modal, StyleSheet, TextInput, View, TouchableOpacity, ActivityIndicator, Pressable } from 'react-native';

const appointmentStatuses = ['SCHEDULED', 'CHECKED_IN', 'WAITING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

export default function AppointmentDetailsScreen({ route, navigation }: any) {
    const { appointment: appointmentFromParams } = route.params;
    const toast = useToast();

    const [appointment, setAppointment] = useState<any>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [notes, setNotes] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    // Ref to check if component is mounted
    const isMounted = useRef(true);
    useEffect(() => {
        return () => { isMounted.current = false; }
    }, []);

    useEffect(() => {
        if (appointmentFromParams) {
            setAppointment(appointmentFromParams);
            setSelectedStatus(appointmentFromParams.status);
            setNotes(appointmentFromParams.notes || '');
        }
    }, [appointmentFromParams]);

    const handleUpdateStatus = () => {
        if (selectedStatus === appointment.status && notes === (appointment.notes || '')) {
            toast.show({ description: "No changes to save." });
            return;
        }

        Alert.alert(
            "Confirm Update",
            `Are you sure you want to update the status to ${selectedStatus}?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Update",
                    onPress: () => updateStatusAsync(),
                },
            ]
        );
    };

    const updateStatusAsync = async () => {
        setIsUpdating(true);
        try {
            // Update status via API
            await updateAppointmentStatus(appointment.id, selectedStatus);
            toast.show({ description: "Appointment updated successfully!" });

            // Navigate back safely
            setTimeout(() => {
                if (isMounted.current) navigation.goBack();
            }, 100);
        } catch (err) {
            console.error('Error updating appointment:', err);
            toast.show({ description: "Failed to update appointment." });
        } finally {
            setIsUpdating(false);
        }
    };

    const formatAppointmentTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: true,
        });
    };

    if (!appointment) {
        return (
            <VStack flex={1} justifyContent="center" alignItems="center">
                <Text>No appointment found.</Text>
            </VStack>
        );
    }

    return (
        <Box flex={1} bg="gray.50">
            {/* Header */}
            <Box bg="purple.600" pb={6} pt={4} px={4} borderBottomLeftRadius={24} borderBottomRightRadius={24}>
                <HStack alignItems="center">
                    <Pressable mr={3} onPress={() => navigation.goBack()}>
                        <Icon as={MaterialIcons} name="arrow-back" size={6} color="white" />
                    </Pressable>
                    <Text fontSize="xl" fontWeight="bold" color="white">Appointment Details</Text>
                </HStack>
            </Box>

            <VStack p={4} space={4}>
                {/* Patient Info */}
                <Box bg="white" p={4} borderRadius="lg" shadow={1}>
                    <HStack alignItems="center" space={4}>
                        <Avatar bg="purple.100" size="lg">
                            <Text color="purple.600" fontWeight="bold" fontSize="2xl">
                                {appointment.patient?.fullName?.charAt(0).toUpperCase()}
                            </Text>
                        </Avatar>
                        <VStack>
                            <Text fontWeight="bold" fontSize="lg">{appointment.patient?.fullName}</Text>
                            <Text color="gray.500">Patient</Text>
                        </VStack>
                    </HStack>
                </Box>

                {/* Doctor Info */}
                <Box bg="white" p={4} borderRadius="lg" shadow={1}>
                    <HStack alignItems="center" space={4}>
                        <Avatar bg="green.100" size="lg">
                            <Icon as={MaterialIcons} name="medical-services" size={8} color="green.600" />
                        </Avatar>
                        <VStack>
                            <Text fontWeight="bold" fontSize="lg">Dr. {appointment.doctor?.fullName}</Text>
                            <Text color="gray.500">Doctor</Text>
                        </VStack>
                    </HStack>
                </Box>

                {/* Appointment Details */}
                <Box bg="white" p={4} borderRadius="lg" shadow={1}>
                    <VStack space={3}>
                        <HStack justifyContent="space-between">
                            <Text color="gray.500">Time</Text>
                            <Text fontWeight="medium">{formatAppointmentTime(appointment.appointmentDateTime)}</Text>
                        </HStack>
                        <HStack justifyContent="space-between">
                            <Text color="gray.500">Reason</Text>
                            <Text fontWeight="medium">{appointment.reason || 'N/A'}</Text>
                        </HStack>
                    </VStack>
                </Box>

                {/* Status Changer */}
                <Box bg="white" p={4} borderRadius="lg" shadow={1}>
                    <Text mb={2} color="gray.500">Change Status</Text>
                    <TouchableOpacity onPress={() => setIsModalVisible(true)} style={styles.dropdownButton}>
                        <Text style={{ fontSize: 16 }}>{selectedStatus}</Text>
                        <MaterialIcons name="arrow-drop-down" size={24} color="black" />
                    </TouchableOpacity>
                </Box>

                {/* Notes */}
                <Box bg="white" p={4} borderRadius="lg" shadow={1}>
                    <Text mb={2} color="gray.500">Notes</Text>
                    <TextInput
                        style={styles.notesInput}
                        placeholder="Add notes for the appointment..."
                        value={notes}
                        onChangeText={setNotes}
                        multiline
                    />
                </Box>

                {/* Update Button */}
                <TouchableOpacity onPress={handleUpdateStatus} style={styles.updateButton} disabled={isUpdating}>
                    {isUpdating ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.updateButtonText}>Update Appointment</Text>
                    )}
                </TouchableOpacity>
            </VStack>

            {/* Status Selection Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select Status</Text>
                        {appointmentStatuses.map(status => (
                            <Pressable
                                key={status}
                                style={styles.modalItem}
                                onPress={() => {
                                    setSelectedStatus(status);
                                    setIsModalVisible(false);
                                }}
                            >
                                <Text>{status}</Text>
                            </Pressable>
                        ))}
                        <Pressable style={styles.modalCloseButton} onPress={() => setIsModalVisible(false)}>
                            <Text style={{ color: 'red' }}>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </Box>
    );
}

const styles = StyleSheet.create({
    dropdownButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        padding: 12,
        height: 50,
    },
    updateButton: {
        marginTop: 16,
        backgroundColor: '#9333ea',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
    },
    updateButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    notesInput: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        padding: 12,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '80%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    modalItem: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    modalCloseButton: {
        paddingVertical: 15,
        alignItems: 'center',
    },
});
