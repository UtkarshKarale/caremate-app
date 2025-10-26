import React, { useState } from 'react';
import { Box, Text, VStack, HStack, Icon, Pressable, useToast, ScrollView } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { TextInput, StyleSheet, View, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { useAuth } from '@/app/src/screens/context/AuthContext';
import { createPrescription } from '@/lib/api';

const medicineTimings = ['BEFORE_MEAL', 'AFTER_MEAL', 'WITH_MEAL', 'EMPTY_STOMACH', 'ANYTIME'];

export default function AddPrescriptionScreen({ route, navigation }: any) {
    const { appointment } = route.params;
    const { user } = useAuth();
    const toast = useToast();

    const [diagnosis, setDiagnosis] = useState('');
    const [symptoms, setSymptoms]
    = useState('');
    const [notes, setNotes] = useState('');
    const [medicines, setMedicines] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // State for the new medicine form
    const [medicineName, setMedicineName] = useState('');
    const [dosage, setDosage] = useState('');
    const [frequency, setFrequency] = useState('');
    const [timing, setTiming] = useState(medicineTimings[0]);
    const [duration, setDuration] = useState('');
    const [instructions, setInstructions] = useState('');

    const [isTimingModalVisible, setIsTimingModalVisible] = useState(false);

    const handleAddMedicine = () => {
        if (!medicineName) {
            toast.show({ description: "Medicine name is required." });
            return;
        }
        const newMedicine = { medicineName, dosage, frequency, timing, duration, instructions };
        setMedicines([...medicines, newMedicine]);
        // Reset form
        setMedicineName('');
        setDosage('');
        setFrequency('');
        setTiming(medicineTimings[0]);
        setDuration('');
        setInstructions('');
    };

    const handleSavePrescription = async () => {
        if (!diagnosis) {
            toast.show({ description: "Diagnosis is required." });
            return;
        }
        if (medicines.length === 0) {
            toast.show({ description: "Please add at least one medicine." });
            return;
        }

        const prescriptionData = {
            patientId: appointment.patient.id,
            doctorId: user.id,
            appointmentId: appointment.id, // Assuming you need to link the prescription to the appointment
            diagnosis,
            symptoms,
            notes,
            prescriptionDate: new Date(),
            medicines: medicines.map(m => ({ ...m })),
        };

        setIsSubmitting(true);
        try {
            await createPrescription(prescriptionData);
            navigation.goBack();
        } catch (err) {
            console.error('Error saving prescription:', err);
            toast.show({ description: "Failed to save prescription." });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box flex={1} bg="gray.50">
            <Box bg="green.600" pb={6} pt={4} px={4} borderBottomLeftRadius={24} borderBottomRightRadius={24}>
                <HStack alignItems="center">
                    <Pressable mr={3} onPress={() => navigation.goBack()}>
                        <Icon as={MaterialIcons} name="arrow-back" size={6} color="white" />
                    </Pressable>
                    <Text fontSize="xl" fontWeight="bold" color="white">Add Prescription</Text>
                </HStack>
            </Box>

            <ScrollView>
                <VStack p={4} space={4}>
                    <Text fontSize="lg" fontWeight="bold">Prescription for {appointment.patient?.fullName}</Text>

                    {/* General Info */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Details</Text>
                        <TextInput style={styles.input} placeholder="Diagnosis" value={diagnosis} onChangeText={setDiagnosis} />
                        <TextInput style={styles.input} placeholder="Symptoms" value={symptoms} onChangeText={setSymptoms} multiline />
                        <TextInput style={styles.input} placeholder="General Notes" value={notes} onChangeText={setNotes} multiline />
                    </View>

                    {/* Added Medicines */}
                    {medicines.length > 0 && (
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Medicines</Text>
                            {medicines.map((med, index) => (
                                <Box key={index} p={2} bg="gray.100" borderRadius="md" mb={2}>
                                    <Text fontWeight="bold">{med.medicineName}</Text>
                                    <Text>{med.dosage} - {med.frequency} - {med.duration}</Text>
                                    <Text color="gray.500">{med.timing} - {med.instructions}</Text>
                                </Box>
                            ))}
                        </View>
                    )}

                    {/* Add Medicine Form */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Add New Medicine</Text>
                        <TextInput style={styles.input} placeholder="Medicine Name" value={medicineName} onChangeText={setMedicineName} />
                        <TextInput style={styles.input} placeholder="Dosage (e.g., 500mg)" value={dosage} onChangeText={setDosage} />
                        <TextInput style={styles.input} placeholder="Frequency (e.g., 1-0-1)" value={frequency} onChangeText={setFrequency} />
                        <TouchableOpacity onPress={() => setIsTimingModalVisible(true)} style={styles.dropdownButton}>
                            <Text style={{ fontSize: 16 }}>{timing}</Text>
                            <MaterialIcons name="arrow-drop-down" size={24} color="black" />
                        </TouchableOpacity>
                        <TextInput style={styles.input} placeholder="Duration (e.g., 7 days)" value={duration} onChangeText={setDuration} />
                        <TextInput style={styles.input} placeholder="Instructions" value={instructions} onChangeText={setInstructions} multiline />
                        <TouchableOpacity onPress={handleAddMedicine} style={styles.addButton}>
                            <Text style={styles.addButtonText}>+ Add Medicine</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={handleSavePrescription} style={styles.saveButton} disabled={isSubmitting}>
                        {isSubmitting ? <ActivityIndicator color="white" /> : <Text style={styles.saveButtonText}>Save Prescription</Text>}
                    </TouchableOpacity>
                </VStack>
            </ScrollView>

            {/* Timing Modal */}
            <Modal transparent={true} visible={isTimingModalVisible} onRequestClose={() => setIsTimingModalVisible(false)}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {medicineTimings.map(t => (
                            <Pressable key={t} style={styles.modalItem} onPress={() => { setTiming(t); setIsTimingModalVisible(false); }}>
                                <Text>{t}</Text>
                            </Pressable>
                        ))}
                    </View>
                </View>
            </Modal>
        </Box>
    );
}

const styles = StyleSheet.create({
    card: { backgroundColor: 'white', padding: 16, borderRadius: 8, marginBottom: 16 },
    cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
    input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 16 },
    dropdownButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 12, height: 50, marginBottom: 12 },
    addButton: { backgroundColor: '#10b981', padding: 12, borderRadius: 8, alignItems: 'center' },
    addButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    saveButton: { backgroundColor: '#16a34a', padding: 16, borderRadius: 8, alignItems: 'center', height: 50, justifyContent: 'center' },
    saveButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { backgroundColor: 'white', borderRadius: 10, padding: 20, width: '80%' },
    modalItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
});
