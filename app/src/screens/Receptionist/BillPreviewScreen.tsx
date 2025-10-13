import React, { useRef } from 'react';
import { Box, Text, HStack, VStack, ScrollView, Pressable, Icon, Button } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

export default function BillPreviewScreen({ navigation, route }: any) {
    const { patientName, patientId, services, total } = route.params;
    const billNumber = `BILL-${Date.now().toString().slice(-6)}`;
    const billDate = new Date().toLocaleDateString();

    const handlePrintBill = () => {
        // Add print functionality
        alert('Print functionality would be implemented here');
    };

    const handleSendBill = () => {
        navigation.navigate('PaymentAcceptance', {
            billNumber,
            patientName,
            patientId,
            total,
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
                        <Text fontSize="2xl" fontWeight="bold" color="white">Bill Preview</Text>
                        <Text fontSize="sm" color="purple.100">Review and confirm</Text>
                    </VStack>
                    <Pressable bg="purple.500" p={2} borderRadius="full" onPress={handlePrintBill}>
                        <Icon as={MaterialIcons} name="print" size={6} color="white" />
                    </Pressable>
                </HStack>
            </Box>

            <ScrollView flex={1} px={4} py={4}>
                {/* Bill Container */}
                <Box bg="white" borderRadius="xl" shadow={3} p={6} mb={4}>
                    {/* Hospital Header */}
                    <VStack alignItems="center" mb={6} pb={4} borderBottomWidth={2} borderBottomColor="gray.200">
                        <Icon as={MaterialIcons} name="local-hospital" size={16} color="purple.600" mb={2} />
                        <Text fontSize="2xl" fontWeight="bold" color="purple.600">City General Hospital</Text>
                        <Text fontSize="sm" color="gray.600">123 Medical Street, Healthcare City</Text>
                        <Text fontSize="sm" color="gray.600">Phone: (555) 123-4567</Text>
                    </VStack>

                    {/* Bill Details */}
                    <HStack justifyContent="space-between" mb={4}>
                        <VStack>
                            <Text fontSize="xs" color="gray.500">Bill Number</Text>
                            <Text fontSize="md" fontWeight="bold">{billNumber}</Text>
                        </VStack>
                        <VStack alignItems="flex-end">
                            <Text fontSize="xs" color="gray.500">Date</Text>
                            <Text fontSize="md" fontWeight="bold">{billDate}</Text>
                        </VStack>
                    </HStack>

                    {/* Patient Details */}
                    <Box bg="gray.50" p={4} borderRadius="lg" mb={4}>
                        <Text fontSize="sm" fontWeight="bold" mb={2}>Patient Information</Text>
                        <HStack justifyContent="space-between" mb={1}>
                            <Text fontSize="sm" color="gray.600">Name:</Text>
                            <Text fontSize="sm" fontWeight="semibold">{patientName}</Text>
                        </HStack>
                        <HStack justifyContent="space-between">
                            <Text fontSize="sm" color="gray.600">Patient ID:</Text>
                            <Text fontSize="sm" fontWeight="semibold">{patientId}</Text>
                        </HStack>
                    </Box>

                    {/* Services Table */}
                    <VStack space={2} mb={4}>
                        <HStack justifyContent="space-between" pb={2} borderBottomWidth={1} borderBottomColor="gray.300">
                            <Text fontSize="sm" fontWeight="bold" flex={2}>Service</Text>
                            <Text fontSize="sm" fontWeight="bold" w={12} textAlign="center">Qty</Text>
                            <Text fontSize="sm" fontWeight="bold" w={16} textAlign="right">Price</Text>
                            <Text fontSize="sm" fontWeight="bold" w={20} textAlign="right">Total</Text>
                        </HStack>
                        {services.map((service: any, index: number) => (
                            <HStack key={index} justifyContent="space-between" py={2}>
                                <Text fontSize="sm" flex={2}>{service.name}</Text>
                                <Text fontSize="sm" w={12} textAlign="center">{service.quantity}</Text>
                                <Text fontSize="sm" w={16} textAlign="right">${service.price}</Text>
                                <Text fontSize="sm" fontWeight="semibold" w={20} textAlign="right">
                                    ${service.price * service.quantity}
                                </Text>
                            </HStack>
                        ))}
                    </VStack>

                    {/* Total Section */}
                    <VStack space={2} pt={4} borderTopWidth={2} borderTopColor="gray.300">
                        <HStack justifyContent="space-between">
                            <Text fontSize="md">Subtotal:</Text>
                            <Text fontSize="md" fontWeight="semibold">${total}</Text>
                        </HStack>
                        <HStack justifyContent="space-between">
                            <Text fontSize="md">Tax (10%):</Text>
                            <Text fontSize="md" fontWeight="semibold">${(total * 0.1).toFixed(2)}</Text>
                        </HStack>
                        <HStack justifyContent="space-between" pt={2} borderTopWidth={1} borderTopColor="gray.200">
                            <Text fontSize="lg" fontWeight="bold">Grand Total:</Text>
                            <Text fontSize="xl" fontWeight="bold" color="purple.600">
                                ${(total * 1.1).toFixed(2)}
                            </Text>
                        </HStack>
                    </VStack>

                    {/* Footer */}
                    <VStack alignItems="center" mt={6} pt={4} borderTopWidth={1} borderTopColor="gray.200">
                        <Text fontSize="xs" color="gray.500" textAlign="center">
                            Thank you for choosing City General Hospital
                        </Text>
                        <Text fontSize="xs" color="gray.500" textAlign="center">
                            For any queries, please contact: billing@hospital.com
                        </Text>
                    </VStack>
                </Box>

                {/* Action Buttons */}
                <VStack space={3} mb={6}>
                    <Button
                        bg="purple.600"
                        borderRadius="xl"
                        py={4}
                        onPress={handleSendBill}
                        _pressed={{ bg: 'purple.700' }}
                    >
                        <HStack space={2} alignItems="center">
                            <Icon as={MaterialIcons} name="payment" size={5} color="white" />
                            <Text color="white" fontSize="md" fontWeight="bold">
                                Proceed to Payment
                            </Text>
                        </HStack>
                    </Button>

                    <Button
                        bg="white"
                        borderRadius="xl"
                        py={4}
                        borderWidth={1}
                        borderColor="purple.600"
                        _pressed={{ bg: 'gray.50' }}
                        onPress={handlePrintBill}
                    >
                        <HStack space={2} alignItems="center">
                            <Icon as={MaterialIcons} name="print" size={5} color="purple.600" />
                            <Text color="purple.600" fontSize="md" fontWeight="bold">
                                Print Bill
                            </Text>
                        </HStack>
                    </Button>
                </VStack>
            </ScrollView>
        </Box>
    );
}