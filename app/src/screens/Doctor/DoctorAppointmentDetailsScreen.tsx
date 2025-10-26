import React, { useState, useEffect } from 'react';
import { Box, Text, VStack, HStack, Avatar, Icon, Pressable, Button, Spinner, ScrollView } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { getPrescriptionsByPatientId } from '@/lib/api';
import { Modal, StyleSheet, View, TouchableOpacity } from 'react-native';

const PrescriptionDetailModal = ({ prescription, onClose, visible }) => {
    if (!prescription) return null;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <HStack justifyContent="space-between" alignItems="center" mb={4}>
                        <Text style={styles.modalTitle}>Prescription Details</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Icon as={MaterialIcons} name="close" size={6} color="black" />
                        </TouchableOpacity>
                    </HStack>
                    
                    <ScrollView>
                        <VStack space={3}>
                            <HStack justifyContent="space-between">
                                <Text color="gray.500">Date</Text>
                                <Text fontWeight="medium">{formatDate(prescription.prescriptionDate)}</Text>
                            </HStack>
                            <HStack justifyContent="space-between">
                                <Text color="gray.500">Diagnosis</Text>
                                <Text fontWeight="medium">{prescription.diagnosis}</Text>
                            </HStack>
                            <VStack>
                                <Text color="gray.500">Symptoms</Text>
                                <Text>{prescription.symptoms || 'N/A'}</Text>
                            </VStack>
                            <VStack>
                                <Text color="gray.500">Notes</Text>
                                <Text>{prescription.notes || 'N/A'}</Text>
                            </VStack>
                            <VStack>
                                <Text color="gray.500" mb={2}>Medicines</Text>
                                {prescription.medicines.map((med, index) => (
                                    <Box key={index} p={2} bg="gray.100" borderRadius="md" mb={2}>
                                        <Text fontWeight="bold">{med.medicineName}</Text>
                                        <Text>Dosage: {med.dosage}</Text>
                                        <Text>Frequency: {med.frequency}</Text>
                                        <Text>Duration: {med.duration}</Text>
                                        <Text>Timing: {med.timing}</Text>
                                        <Text>Instructions: {med.instructions}</Text>
                                    </Box>
                                ))}
                            </VStack>
                        </VStack>
                    </ScrollView>

                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default function DoctorAppointmentDetailsScreen({ route, navigation }: any) {
    const { appointment } = route.params;
    const [pastPrescriptions, setPastPrescriptions] = useState<any[]>([]);
    const [loadingPrescriptions, setLoadingPrescriptions] = useState(true);
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        const fetchPrescriptions = async () => {
            if (!appointment?.patient?.id) return;
            setLoadingPrescriptions(true);
            try {
                const data = await getPrescriptionsByPatientId(appointment.patient.id);
                setPastPrescriptions(data);
            } catch (error) {
                console.error("Failed to fetch past prescriptions", error);
            } finally {
                setLoadingPrescriptions(false);
            }
        };

        fetchPrescriptions();
    }, [appointment]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    const handleOpenModal = (prescription) => {
        setSelectedPrescription(prescription);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedPrescription(null);
    };

    return (
        <Box flex={1} bg="gray.50">
            {/* Header */}
            <Box bg="green.600" pb={6} pt={4} px={4} borderBottomLeftRadius={24} borderBottomRightRadius={24}>
                <HStack alignItems="center">
                    <Pressable mr={3} onPress={() => navigation.goBack()}>
                        <Icon mt={6} as={MaterialIcons} name="arrow-back" size={6} color="white" />
                    </Pressable>
                    <Text mt={6} fontSize="xl" fontWeight="bold" color="white">Appointment</Text>
                </HStack>
            </Box>

            <ScrollView>
                <VStack p={4} space={4}>
                    {/* Patient Info */}
                    <Box bg="white" p={4} borderRadius="lg" shadow={1}>
                        <HStack alignItems="center" space={4}>
                            <Avatar bg="blue.100" size="lg">
                                <Text color="blue.600" fontWeight="bold" fontSize="2xl">
                                    {appointment.patient?.fullName?.charAt(0).toUpperCase()}
                                </Text>
                            </Avatar>
                            <VStack>
                                <Text fontWeight="bold" fontSize="lg">{appointment.patient?.fullName}</Text>
                                <Text color="gray.500">Patient</Text>
                            </VStack>
                        </HStack>
                    </Box>

                    <Button 
                        mt={4} 
                        bg="green.600" 
                        onPress={() => navigation.navigate('AddPrescription', { appointment: appointment })}
                        startIcon={<Icon as={MaterialIcons} name="add" color="white" />}
                    >
                        Add Prescription
                    </Button>

                    {/* Past Prescriptions */}
                    <Box mt={4}>
                        <Text fontSize="lg" fontWeight="bold" mb={2}>Past Prescriptions</Text>
                        {loadingPrescriptions ? (
                            <Spinner />
                        ) : pastPrescriptions.length > 0 ? (
                            pastPrescriptions.map(presc => (
                                <Pressable key={presc.id} onPress={() => handleOpenModal(presc)}>
                                    <Box bg="white" p={4} borderRadius="lg" shadow={1} mb={2}>
                                        <HStack justifyContent="space-between">
                                            <Text fontWeight="bold">{presc.diagnosis}</Text>
                                            <Text color="gray.500">{formatDate(presc.prescriptionDate)}</Text>
                                        </HStack>
                                        <Text mt={1} color="gray.600">{presc.medicines.length} medicines</Text>
                                    </Box>
                                </Pressable>
                            ))
                        ) : (
                            <Text>No past prescriptions found.</Text>
                        )}
                    </Box>
                </VStack>
            </ScrollView>

            {isModalVisible && (
                <PrescriptionDetailModal prescription={selectedPrescription} onClose={handleCloseModal} visible={isModalVisible} />
            )}
        </Box>
    );
}

const styles = StyleSheet.create({
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
        width: '90%',
        maxHeight: '80%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#16a34a',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
