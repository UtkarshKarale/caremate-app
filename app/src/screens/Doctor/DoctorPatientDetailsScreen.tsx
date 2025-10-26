import { Box, Text, VStack, HStack, Avatar, Icon, Spinner, ScrollView } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { getPrescriptionsByPatientId } from '@/lib/api';
import { StyleSheet, View, TouchableOpacity, Modal, Pressable, ActivityIndicator } from 'react-native';
import {useEffect, useState} from 'react'

// Using the same modal from DoctorAppointmentDetailsScreen, could be moved to a shared component
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

export default function DoctorPatientDetailsScreen({ route, navigation }: any) {
    const { patient } = route.params;
    const [prescriptions, setPrescriptions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!patient?.id) return;
            setLoading(true);
            try {
                const prescData = await getPrescriptionsByPatientId(patient.id);
                setPrescriptions(prescData);
            } catch (error) {
                console.error("Failed to fetch patient history", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [patient]);

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
                        <Icon mt={5} as={MaterialIcons} name="arrow-back" size={6} color="white" />
                    </Pressable>
                    <Text mt={5} fontSize="xl" fontWeight="bold" color="white">Patient Details</Text>
                </HStack>
            </Box>

            <ScrollView>
                <VStack p={4} space={4}>
                    {/* Patient Info */}
                    <Box bg="white" p={4} borderRadius="lg" shadow={1}>
                        <HStack alignItems="center" space={4}>
                            <Avatar bg="blue.100" size="lg">
                                <Text color="blue.600" fontWeight="bold" fontSize="2xl">
                                    {patient.fullName?.charAt(0).toUpperCase()}
                                </Text>
                            </Avatar>
                            <VStack>
                                <Text fontWeight="bold" fontSize="lg">{patient.fullName}</Text>
                                {/* Other patient details can go here */}
                            </VStack>
                        </HStack>
                    </Box>

                    {/* Past Prescriptions */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Past Prescriptions</Text>
                        {loading ? (
                            <ActivityIndicator size="large" color="#16a34a" />
                        ) : prescriptions.length > 0 ? (
                            prescriptions.map(presc => (
                                <Pressable key={presc.id} onPress={() => handleOpenModal(presc)} style={styles.prescriptionItem}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{ fontWeight: 'bold' }}>{presc.diagnosis}</Text>
                                        <Text style={{ color: 'gray' }}>{formatDate(presc.prescriptionDate)}</Text>
                                    </View>
                                    <Text style={{ marginTop: 4, color: 'darkgray' }}>{presc.medicines.length} medicines</Text>
                                </Pressable>
                            ))
                        ) : (
                            <Text>No past prescriptions found.</Text>
                        )}
                    </View>

                    {/* Medical Reports Placeholder */}
                    <Box mt={4}>
                        <Text fontSize="lg" fontWeight="bold" mb={2}>Medical Reports</Text>
                        <Box bg="white" p={4} borderRadius="lg" shadow={1}>
                            <Text color="gray.400">Medical reports functionality is not yet available.</Text>
                        </Box>
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
    card: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    prescriptionItem: {
        backgroundColor: '#f8fafc',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
});
