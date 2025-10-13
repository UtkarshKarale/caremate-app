import React from 'react';
import { Box, Text, VStack, Button, Icon, HStack } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

export default function PaymentSuccessScreen({ navigation, route }: any) {
    const { billNumber, patientName, amount, paymentMethod, change } = route.params;

    const handlePrintReceipt = () => {
        alert('Print receipt functionality');
    };

    const handleNewPayment = () => {
        navigation.navigate('Billing');
    };

    const handleDone = () => {
        navigation.navigate('ReceptionistHome');
    };

    return (
        <Box flex={1} bg="gray.50" justifyContent="center" px={6}>
            {/* Success Animation */}
            <VStack space={6} alignItems="center">
                <Box bg="green.100" p={6} borderRadius="full">
                    <Icon as={MaterialIcons} name="check-circle" size={24} color="green.600" />
                </Box>

                <VStack space={2} alignItems="center">
                    <Text fontSize="3xl" fontWeight="bold" color="gray.800">
                        Payment Successful!
                    </Text>
                    <Text fontSize="md" color="gray.600" textAlign="center">
                        Payment has been processed successfully
                    </Text>
                </VStack>

                {/* Payment Details Card */}
                <Box bg="white" borderRadius="2xl" shadow={3} p={6} w="100%">
                    <VStack space={3}>
                        <HStack justifyContent="space-between" alignItems="center">
                            <Text fontSize="sm" color="gray.600">Bill Number:</Text>
                            <Text fontSize="sm" fontWeight="bold">{billNumber}</Text>
                        </HStack>
                        <HStack justifyContent="space-between" alignItems="center">
                            <Text fontSize="sm" color="gray.600">Patient:</Text>
                            <Text fontSize="sm" fontWeight="bold">{patientName}</Text>
                        </HStack>
                        <HStack justifyContent="space-between" alignItems="center">
                            <Text fontSize="sm" color="gray.600">Payment Method:</Text>
                            <Text fontSize="sm" fontWeight="bold" textTransform="capitalize">{paymentMethod}</Text>
                        </HStack>
                        <Box h="1px" bg="gray.200" my={2} />
                        <HStack justifyContent="space-between" alignItems="center">
                            <Text fontSize="md" fontWeight="bold">Amount Paid:</Text>
                            <Text fontSize="2xl" fontWeight="bold" color="green.600">${amount}</Text>
                        </HStack>
                        {change !== '0.00' && paymentMethod === 'cash' && (
                            <HStack justifyContent="space-between" alignItems="center" bg="green.50" p={3} borderRadius="lg">
                                <Text fontSize="md" fontWeight="semibold">Change Given:</Text>
                                <Text fontSize="xl" fontWeight="bold" color="green.600">${change}</Text>
                            </HStack>
                        )}
                        <Box h="1px" bg="gray.200" my={2} />
                        <Text fontSize="xs" color="gray.500" textAlign="center">
                            Transaction completed on {new Date().toLocaleString()}
                        </Text>
                    </VStack>
                </Box>

                {/* Action Buttons */}
                <VStack space={3} w="100%">
                    <Button
                        bg="purple.600"
                        borderRadius="xl"
                        py={4}
                        onPress={handlePrintReceipt}
                        _pressed={{ bg: 'purple.700' }}
                    >
                        <HStack space={2} alignItems="center">
                            <Icon as={MaterialIcons} name="print" size={5} color="white" />
                            <Text color="white" fontSize="md" fontWeight="bold">
                                Print Receipt
                            </Text>
                        </HStack>
                    </Button>

                    <Button
                        bg="white"
                        borderRadius="xl"
                        py={4}
                        borderWidth={1}
                        borderColor="purple.600"
                        onPress={handleNewPayment}
                        _pressed={{ bg: 'gray.50' }}
                    >
                        <HStack space={2} alignItems="center">
                            <Icon as={MaterialIcons} name="add-circle" size={5} color="purple.600" />
                            <Text color="purple.600" fontSize="md" fontWeight="bold">
                                New Payment
                            </Text>
                        </HStack>
                    </Button>

                    <Button
                        variant="ghost"
                        onPress={handleDone}
                    >
                        <Text color="gray.600" fontSize="md" fontWeight="semibold">
                            Back to Home
                        </Text>
                    </Button>
                </VStack>
            </VStack>
        </Box>
    );
}