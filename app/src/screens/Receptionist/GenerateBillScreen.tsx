import React, { useState } from 'react';
import { Box, Text, HStack, VStack, ScrollView, Pressable, Icon, Button, Select, CheckIcon } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { TextInput, StyleSheet, View } from 'react-native';

const services = [
    { id: '1', name: 'Consultation', price: 500 },
    { id: '2', name: 'Blood Test', price: 800 },
    { id: '3', name: 'X-Ray', price: 1200 },
    { id: '4', name: 'ECG', price: 600 },
    { id: '5', name: 'Ultrasound', price: 1500 },
    { id: '6', name: 'Medicine', price: 0 },
];

export default function GenerateBillScreen({ navigation }: any) {
    const [patientName, setPatientName] = useState('');
    const [patientId, setPatientId] = useState('');
    const [selectedServices, setSelectedServices] = useState<any[]>([]);
    const [customPrice, setCustomPrice] = useState('');

    const addService = (service: any) => {
        const price = service.name === 'Medicine' ? parseFloat(customPrice) || 0 : service.price;
        setSelectedServices([...selectedServices, { ...service, price, quantity: 1 }]);
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

    const getTotalAmount = () => {
        return selectedServices.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const handleGenerateBill = () => {
        navigation.navigate('BillPreview', {
            patientName,
            patientId,
            services: selectedServices,
            total: getTotalAmount(),
        });
    };

    return (
        <Box flex={1} bg="gray.50">
            {/* Header */}
            <Box bg="purple.600" pb={6} pt={4} px={4} borderBottomLeftRadius={24} borderBottomRightRadius={24}>
                <HStack alignItems="center" mb={3}>
                    <Pressable mr={3} onPress={() => navigation.goBack()}>
                        <Icon as={MaterialIcons} name="arrow-back" size={6} color="white" />
                    </Pressable>
                    <VStack flex={1}>
                        <Text fontSize="2xl" fontWeight="bold" color="white">Generate Bill</Text>
                        <Text fontSize="sm" color="purple.100">Create new patient bill</Text>
                    </VStack>
                </HStack>
            </Box>

            <ScrollView flex={1} px={4} py={4} showsVerticalScrollIndicator={false}>
                {/* Patient Information */}
                <Box bg="white" borderRadius="xl" shadow={1} p={6} mb={4}>
                    <Text fontSize="md" fontWeight="bold" mb={4}>Patient Information</Text>
                    <VStack space={3}>
                        <VStack space={2}>
                            <Text fontSize="sm" fontWeight="semibold" color="gray.700">Patient Name</Text>
                            <TextInput
                                value={patientName}
                                onChangeText={setPatientName}
                                placeholder="Enter patient name"
                                style={styles.input}
                            />
                        </VStack>
                        <VStack space={2}>
                            <Text fontSize="sm" fontWeight="semibold" color="gray.700">Patient ID</Text>
                            <TextInput
                                value={patientId}
                                onChangeText={setPatientId}
                                placeholder="Enter patient ID"
                                style={styles.input}
                            />
                        </VStack>
                    </VStack>
                </Box>

                {/* Services */}
                <Box bg="white" borderRadius="xl" shadow={1} p={6} mb={4}>
                    <Text fontSize="md" fontWeight="bold" mb={4}>Add Services</Text>
                    <VStack space={3}>
                        {services.map(service => (
                            <HStack key={service.id} justifyContent="space-between" alignItems="center" py={2}>
                                <VStack flex={1}>
                                    <Text fontWeight="semibold">{service.name}</Text>
                                    <Text fontSize="sm" color="gray.600">
                                        ${service.price === 0 ? 'Custom' : service.price}
                                    </Text>
                                </VStack>
                                {service.name === 'Medicine' ? (
                                    <HStack space={2} alignItems="center">
                                        <TextInput
                                            value={customPrice}
                                            onChangeText={setCustomPrice}
                                            placeholder="Price"
                                            keyboardType="numeric"
                                            style={styles.input}
                                        />
                                        <Pressable
                                            bg="purple.600"
                                            px={3}
                                            py={2}
                                            borderRadius="lg"
                                            onPress={() => addService(service)}
                                        >
                                            <Icon as={MaterialIcons} name="add" size={5} color="white" />
                                        </Pressable>
                                    </HStack>
                                ) : (
                                    <Pressable
                                        bg="purple.600"
                                        px={3}
                                        py={2}
                                        borderRadius="lg"
                                        onPress={() => addService(service)}
                                    >
                                        <Icon as={MaterialIcons} name="add" size={5} color="white" />
                                    </Pressable>
                                )}
                            </HStack>
                        ))}
                    </VStack>
                </Box>

                {/* Selected Services */}
                {selectedServices.length > 0 && (
                    <Box bg="white" borderRadius="xl" shadow={1} p={6} mb={4}>
                        <Text fontSize="md" fontWeight="bold" mb={4}>Bill Items</Text>
                        <VStack space={3}>
                            {selectedServices.map((item, index) => (
                                <HStack key={index} justifyContent="space-between" alignItems="center" py={2} borderBottomWidth={1} borderBottomColor="gray.200">
                                    <VStack flex={1}>
                                        <Text fontWeight="semibold">{item.name}</Text>
                                        <Text fontSize="sm" color="gray.600">${item.price} x {item.quantity}</Text>
                                    </VStack>
                                    <HStack space={2} alignItems="center">
                                        <Pressable
                                            bg="gray.200"
                                            p={1}
                                            borderRadius="md"
                                            onPress={() => updateQuantity(index, Math.max(1, item.quantity - 1))}
                                        >
                                            <Icon as={MaterialIcons} name="remove" size={4} />
                                        </Pressable>
                                        <Text fontWeight="bold" w={8} textAlign="center">{item.quantity}</Text>
                                        <Pressable
                                            bg="gray.200"
                                            p={1}
                                            borderRadius="md"
                                            onPress={() => updateQuantity(index, item.quantity + 1)}
                                        >
                                            <Icon as={MaterialIcons} name="add" size={4} />
                                        </Pressable>
                                        <Text fontWeight="bold" w={16} textAlign="right">${item.price * item.quantity}</Text>
                                        <Pressable onPress={() => removeService(index)}>
                                            <Icon as={MaterialIcons} name="delete" size={5} color="red.600" />
                                        </Pressable>
                                    </HStack>
                                </HStack>
                            ))}
                        </VStack>
                    </Box>
                )}

                {/* Total */}
                {selectedServices.length > 0 && (
                    <Box bg="purple.600" borderRadius="xl" shadow={2} p={6} mb={4}>
                        <HStack justifyContent="space-between" alignItems="center">
                            <Text fontSize="lg" fontWeight="bold" color="white">Total Amount</Text>
                            <Text fontSize="2xl" fontWeight="bold" color="white">${getTotalAmount()}</Text>
                        </HStack>
                    </Box>
                )}

                {/* Generate Bill Button */}
                <Button
                    bg="purple.600"
                    borderRadius="xl"
                    py={4}
                    mb={6}
                    isDisabled={!patientName || !patientId || selectedServices.length === 0}
                    onPress={handleGenerateBill}
                    _pressed={{ bg: 'purple.700' }}
                >
                    <HStack space={2} alignItems="center">
                        <Icon as={MaterialIcons} name="receipt" size={5} color="white" />
                        <Text color="white" fontSize="md" fontWeight="bold">
                            Generate Bill
                        </Text>
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
});