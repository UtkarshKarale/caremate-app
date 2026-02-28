import React, { useEffect, useMemo, useState } from 'react';
import { Box, Text, HStack, VStack, ScrollView, Pressable, Icon, Button, Spinner } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { Alert, TextInput, StyleSheet } from 'react-native';
import { getAllUsers } from '@/lib/api';

const services = [
  { id: '1', name: 'Consultation', price: 500 },
  { id: '2', name: 'Blood Test', price: 800 },
  { id: '3', name: 'X-Ray', price: 1200 },
  { id: '4', name: 'ECG', price: 600 },
  { id: '5', name: 'Ultrasound', price: 1500 },
  { id: '6', name: 'Medicine', price: 0 },
];

type PatientUser = {
  id: number;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  roles?: string[];
};

export default function GenerateBillScreen({ navigation, route }: any) {
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [appointmentId, setAppointmentId] = useState<string>('');
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [customPrice, setCustomPrice] = useState('');
  const [patientSearch, setPatientSearch] = useState('');
  const [patients, setPatients] = useState<PatientUser[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(true);

  useEffect(() => {
    if (route?.params?.patientId) {
      setSelectedPatientId(route.params.patientId.toString());
    }
    if (route?.params?.appointmentId) {
      setAppointmentId(route.params.appointmentId.toString());
    }
  }, [route?.params]);

  useEffect(() => {
    const loadPatients = async () => {
      setLoadingPatients(true);
      try {
        const users = await getAllUsers();
        const patientUsers = (users || []).filter((user: PatientUser) => (user.roles || []).includes('PATIENT'));
        setPatients(patientUsers);
      } catch (error) {
        console.error('Error loading patients for billing:', error);
        setPatients([]);
      } finally {
        setLoadingPatients(false);
      }
    };
    loadPatients();
  }, []);

  const selectedPatient = useMemo(
    () => patients.find((patient) => String(patient.id) === selectedPatientId),
    [patients, selectedPatientId]
  );

  const filteredPatients = useMemo(() => {
    const query = patientSearch.trim().toLowerCase();
    if (!query) return patients;
    return patients.filter((patient) =>
      String(patient.id).includes(query) ||
      (patient.fullName || '').toLowerCase().includes(query) ||
      (patient.email || '').toLowerCase().includes(query) ||
      (patient.phoneNumber || '').toLowerCase().includes(query)
    );
  }, [patients, patientSearch]);

  const addService = (service: any) => {
    const customServicePrice = parseFloat(customPrice);
    const price = service.name === 'Medicine' ? customServicePrice : service.price;

    if (service.name === 'Medicine' && (!Number.isFinite(price) || price <= 0)) {
      Alert.alert('Invalid Price', 'Enter a valid medicine price greater than 0.');
      return;
    }

    const existingIndex = selectedServices.findIndex((item) => item.id === service.id && item.price === price);
    if (existingIndex >= 0) {
      updateQuantity(existingIndex, selectedServices[existingIndex].quantity + 1);
    } else {
      setSelectedServices([...selectedServices, { ...service, price, quantity: 1 }]);
    }
    setCustomPrice('');
  };

  const removeService = (index: number) => {
    setSelectedServices(selectedServices.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, quantity: number) => {
    const updated = [...selectedServices];
    updated[index].quantity = quantity;
    setSelectedServices(updated);
  };

  const getTotalAmount = () => selectedServices.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleGenerateBill = () => {
    if (!selectedPatient) {
      Alert.alert('Select Patient', 'Please select a patient from the patient list.');
      return;
    }
    if (selectedServices.length === 0) {
      Alert.alert('No Services', 'Please add at least one service.');
      return;
    }

    navigation.navigate('BillPreview', {
      patientName: selectedPatient.fullName || 'Unknown Patient',
      patientId: String(selectedPatient.id),
      appointmentId: appointmentId ? Number(appointmentId) : null,
      services: selectedServices,
      total: getTotalAmount(),
    });
  };

  return (
    <Box flex={1} bg="gray.50">
      <Box bg="purple.600" pb={6} pt={4} px={4} borderBottomLeftRadius={24} borderBottomRightRadius={24}>
        <HStack alignItems="center" mb={3}>
          <Pressable mr={3} onPress={() => navigation.goBack()}>
            <Icon as={MaterialIcons} name="arrow-back" size={6} color="white" />
          </Pressable>
          <VStack flex={1}>
            <Text mt={5} fontSize="2xl" fontWeight="bold" color="white">Generate Bill</Text>
            <Text fontSize="sm" color="purple.100">Select patient, add services, create bill</Text>
          </VStack>
        </HStack>
      </Box>

      <ScrollView flex={1} px={4} py={4} showsVerticalScrollIndicator={false}>
        <Box bg="white" borderRadius="xl" shadow={1} p={6} mb={4}>
          <Text fontSize="md" fontWeight="bold" mb={4}>Select Patient</Text>
          <VStack space={3}>
            <TextInput
              value={patientSearch}
              onChangeText={setPatientSearch}
              placeholder="Search by patient name, ID, phone, or email"
              style={styles.input}
            />

            {loadingPatients ? (
              <HStack alignItems="center" space={2}>
                <Spinner size="sm" color="purple.600" />
                <Text fontSize="xs" color="gray.500">Loading patient list...</Text>
              </HStack>
            ) : (
              <Box maxH={220}>
                <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
                  <VStack space={2}>
                    {filteredPatients.length > 0 ? (
                      filteredPatients.map((patient) => {
                        const isSelected = String(patient.id) === selectedPatientId;
                        return (
                          <Pressable key={patient.id} onPress={() => setSelectedPatientId(String(patient.id))}>
                            <Box
                              p={3}
                              borderRadius="lg"
                              borderWidth={1}
                              borderColor={isSelected ? 'purple.600' : 'gray.200'}
                              bg={isSelected ? 'purple.50' : 'white'}
                            >
                              <HStack justifyContent="space-between" alignItems="center">
                                <VStack flex={1} pr={2}>
                                  <Text fontWeight="bold" color={isSelected ? 'purple.700' : 'gray.800'}>
                                    {patient.fullName || 'Unknown Patient'}
                                  </Text>
                                  <Text fontSize="xs" color="gray.600">ID: {patient.id}</Text>
                                  <Text fontSize="xs" color="gray.500">{patient.phoneNumber || patient.email || 'No contact info'}</Text>
                                </VStack>
                                {isSelected && <Icon as={MaterialIcons} name="check-circle" size={5} color="purple.600" />}
                              </HStack>
                            </Box>
                          </Pressable>
                        );
                      })
                    ) : (
                      <Text fontSize="sm" color="gray.500">No patients match your search.</Text>
                    )}
                  </VStack>
                </ScrollView>
              </Box>
            )}

            <VStack space={2}>
              <Text fontSize="sm" fontWeight="semibold" color="gray.700">Selected Patient</Text>
              <TextInput value={selectedPatient?.fullName || ''} editable={false} placeholder="No patient selected" style={styles.disabledInput} />
            </VStack>
          </VStack>
        </Box>

        <Box bg="white" borderRadius="xl" shadow={1} p={6} mb={4}>
          <Text fontSize="md" fontWeight="bold" mb={4}>Add Services</Text>
          <VStack space={3}>
            {services.map((service) => (
              <HStack key={service.id} justifyContent="space-between" alignItems="center" py={2}>
                <VStack flex={1} pr={3}>
                  <Text fontWeight="semibold">{service.name}</Text>
                  <Text fontSize="sm" color="gray.600">${service.price === 0 ? 'Custom' : service.price.toFixed(2)}</Text>
                </VStack>

                {service.name === 'Medicine' ? (
                  <HStack alignItems="center" space={2}>
                    <TextInput
                      value={customPrice}
                      onChangeText={setCustomPrice}
                      placeholder="Price"
                      keyboardType="numeric"
                      style={styles.compactInput}
                    />
                    <Pressable bg="purple.600" px={3} py={2} borderRadius="lg" onPress={() => addService(service)}>
                      <Icon as={MaterialIcons} name="add" size={5} color="white" />
                    </Pressable>
                  </HStack>
                ) : (
                  <Pressable bg="purple.600" px={3} py={2} borderRadius="lg" onPress={() => addService(service)}>
                    <Icon as={MaterialIcons} name="add" size={5} color="white" />
                  </Pressable>
                )}
              </HStack>
            ))}
          </VStack>
        </Box>

        {selectedServices.length > 0 && (
          <Box bg="white" borderRadius="xl" shadow={1} p={6} mb={4}>
            <Text fontSize="md" fontWeight="bold" mb={4}>Bill Items</Text>
            <VStack space={3}>
              {selectedServices.map((item, index) => (
                <HStack key={`${item.id}-${index}`} justifyContent="space-between" alignItems="center" py={2} borderBottomWidth={1} borderBottomColor="gray.200">
                  <VStack flex={1} pr={3}>
                    <Text fontWeight="semibold">{item.name}</Text>
                    <Text fontSize="sm" color="gray.600">
                      ${item.price.toFixed(2)} x {item.quantity}
                    </Text>
                  </VStack>
                  <HStack space={2} alignItems="center">
                    <Pressable bg="gray.200" p={1} borderRadius="md" onPress={() => updateQuantity(index, Math.max(1, item.quantity - 1))}>
                      <Icon as={MaterialIcons} name="remove" size={4} />
                    </Pressable>
                    <Text fontWeight="bold" w={8} textAlign="center">{item.quantity}</Text>
                    <Pressable bg="gray.200" p={1} borderRadius="md" onPress={() => updateQuantity(index, item.quantity + 1)}>
                      <Icon as={MaterialIcons} name="add" size={4} />
                    </Pressable>
                    <Text fontWeight="bold" w={20} textAlign="right">${(item.price * item.quantity).toFixed(2)}</Text>
                    <Pressable onPress={() => removeService(index)}>
                      <Icon as={MaterialIcons} name="delete" size={5} color="red.600" />
                    </Pressable>
                  </HStack>
                </HStack>
              ))}
            </VStack>
          </Box>
        )}

        {selectedServices.length > 0 && (
          <Box bg="purple.600" borderRadius="xl" shadow={2} p={6} mb={4}>
            <HStack justifyContent="space-between" alignItems="center">
              <Text fontSize="lg" fontWeight="bold" color="white">Total Amount</Text>
              <Text fontSize="2xl" fontWeight="bold" color="white">${getTotalAmount().toFixed(2)}</Text>
            </HStack>
          </Box>
        )}

        <Button
          bg="purple.600"
          borderRadius="xl"
          py={4}
          mb={6}
          isDisabled={!selectedPatient || selectedServices.length === 0}
          onPress={handleGenerateBill}
          _pressed={{ bg: 'purple.700' }}
        >
          <HStack space={2} alignItems="center">
            <Icon as={MaterialIcons} name="receipt" size={5} color="white" />
            <Text color="white" fontSize="md" fontWeight="bold">Generate Bill</Text>
          </HStack>
        </Button>
      </ScrollView>
    </Box>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 50,
    fontSize: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  compactInput: {
    width: 92,
    height: 40,
    fontSize: 14,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  disabledInput: {
    height: 50,
    fontSize: 16,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    color: '#64748b',
  },
});
