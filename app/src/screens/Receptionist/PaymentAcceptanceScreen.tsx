import React, { useState } from 'react';
import { Box, Text, HStack, VStack, ScrollView, Pressable, Icon, Button, Radio } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { TextInput, StyleSheet, View } from 'react-native';

export default function PaymentAcceptanceScreen({ navigation, route }: any) {
    const { billNumber, patientName, patientId, total } = route.params;
    const grandTotal = (total * 1.1).toFixed(2);

    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [amountReceived, setAmountReceived] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [transactionId, setTransactionId] = useState('');

    const calculateChange = () => {
        const received = parseFloat(amountReceived) || 0;
        const totalAmount = parseFloat(grandTotal);
        return Math.max(0, received - totalAmount).toFixed(2);
    };

    const handleProcessPayment = () => {
        navigation.navigate('PaymentSuccess', {
            billNumber,
            patientName,
            amount: grandTotal,
            paymentMethod,
            change: calculateChange(),
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
                        <Text fontSize="2xl" fontWeight="bold" color="white">Accept Payment</Text>
                        <Text fontSize="sm" color="purple.100">Process patient payment</Text>
                    </VStack>
                </HStack>
            </Box>

            <ScrollView flex={1} px={4} py={4}>
                {/* Bill Summary */}
                <Box bg="white" borderRadius="xl" shadow={1} p={6} mb={4}>
                    <Text fontSize="md" fontWeight="bold" mb={4}>Bill Summary</Text>
                    <VStack space={2}>
                        <HStack justifyContent="space-between">
                            <Text fontSize="sm" color="gray.600">Bill Number:</Text>
                            <Text fontSize="sm" fontWeight="semibold">{billNumber}</Text>
                        </HStack>
                        <HStack justifyContent="space-between">
                            <Text fontSize="sm" color="gray.600">Patient:</Text>
                            <Text fontSize="sm" fontWeight="semibold">{patientName}</Text>
                        </HStack>
                        <HStack justifyContent="space-between">
                            <Text fontSize="sm" color="gray.600">Patient ID:</Text>
                            <Text fontSize="sm" fontWeight="semibold">{patientId}</Text>
                        </HStack>
                        <Box h="1px" bg="gray.200" my={2} />
                        <HStack justifyContent="space-between">
                            <Text fontSize="lg" fontWeight="bold">Total Amount:</Text>
                            <Text fontSize="xl" fontWeight="bold" color="purple.600">${grandTotal}</Text>
                        </HStack>
                    </VStack>
                </Box>

                {/* Payment Method */}
                <Box bg="white" borderRadius="xl" shadow={1} p={6} mb={4}>
                    <Text fontSize="md" fontWeight="bold" mb={4}>Payment Method</Text>
                    <Radio.Group name={"paymentMethod"} value={paymentMethod} onChange={setPaymentMethod}>
                        <VStack space={3}>
                            <Radio value="cash" colorScheme="purple">
                                <HStack alignItems="center" space={2} ml={2}>
                                    <Icon as={MaterialIcons} name="money" size={5} color="green.600" />
                                    <Text fontWeight="semibold">Cash</Text>
                                </HStack>
                            </Radio>
                            <Radio value="card" colorScheme="purple">
                                <HStack alignItems="center" space={2} ml={2}>
                                    <Icon as={MaterialIcons} name="credit-card" size={5} color="blue.600" />
                                    <Text fontWeight="semibold">Credit/Debit Card</Text>
                                </HStack>
                            </Radio>
                            <Radio value="upi" colorScheme="purple">
                                <HStack alignItems="center" space={2} ml={2}>
                                    <Icon as={MaterialIcons} name="qr-code" size={5} color="purple.600" />
                                    <Text fontWeight="semibold">UPI</Text>
                                </HStack>
                            </Radio>
                            <Radio value="insurance" colorScheme="purple">
                                <HStack alignItems="center" space={2} ml={2}>
                                    <Icon as={MaterialIcons} name="shield" size={5} color="orange.600" />
                                    <Text fontWeight="semibold">Insurance</Text>
                                </HStack>
                            </Radio>
                        </VStack>
                    </Radio.Group>
                </Box>

                {/* Payment Details */}
                <Box bg="white" borderRadius="xl" shadow={1} p={6} mb={4}>
                    <Text fontSize="md" fontWeight="bold" mb={4}>Payment Details</Text>
                    <VStack space={4}>
                        {paymentMethod === 'cash' && (
                            <>
                                <VStack space={2}>
                                    <Text fontSize="sm" fontWeight="semibold" color="gray.700">Amount Received</Text>
                                    <View style={styles.inputContainer}>
                                        <Icon as={MaterialIcons} name="attach-money" size={5} style={styles.inputIcon} />
                                        <TextInput
                                            value={amountReceived}
                                            onChangeText={setAmountReceived}
                                            placeholder="Enter amount received"
                                            keyboardType="numeric"
                                            style={styles.input}
                                        />
                                    </View>
                                </VStack>
                                {amountReceived && (
                                    <Box bg="green.50" p={4} borderRadius="lg">
                                        <HStack justifyContent="space-between">
                                            <Text fontSize="md" fontWeight="semibold">Change to Return:</Text>
                                            <Text fontSize="xl" fontWeight="bold" color="green.600">
                                                ${calculateChange()}
                                            </Text>
                                        </HStack>
                                    </Box>
                                )}
                            </>
                        )}

                        {paymentMethod === 'card' && (
                            <VStack space={3}>
                                <VStack space={2}>
                                    <Text fontSize="sm" fontWeight="semibold" color="gray.700">Card Number</Text>
                                    <TextInput
                                        value={cardNumber}
                                        onChangeText={setCardNumber}
                                        placeholder="Enter last 4 digits"
                                        keyboardType="numeric"
                                        maxLength={4}
                                        style={styles.input}
                                    />
                                </VStack>
                                <VStack space={2}>
                                    <Text fontSize="sm" fontWeight="semibold" color="gray.700">Transaction ID</Text>
                                    <TextInput
                                        value={transactionId}
                                        onChangeText={setTransactionId}
                                        placeholder="Enter transaction ID"
                                        style={styles.input}
                                    />
                                </VStack>
                            </VStack>
                        )}

                        {paymentMethod === 'upi' && (
                            <VStack space={3}>
                                <VStack space={2}>
                                    <Text fontSize="sm" fontWeight="semibold" color="gray.700">UPI Transaction ID</Text>
                                    <TextInput
                                        value={transactionId}
                                        onChangeText={setTransactionId}
                                        placeholder="Enter UPI transaction ID"
                                        style={styles.input}
                                    />
                                </VStack>
                                <Box bg="purple.50" p={4} borderRadius="lg" alignItems="center">
                                    <Icon as={MaterialIcons} name="qr-code-2" size={32} color="purple.600" mb={2} />
                                    <Text fontSize="sm" color="gray.600" textAlign="center">
                                        Show QR code to patient for payment
                                    </Text>
                                </Box>
                            </VStack>
                        )}

                        {paymentMethod === 'insurance' && (
                            <VStack space={3}>
                                <VStack space={2}>
                                    <Text fontSize="sm" fontWeight="semibold" color="gray.700">Insurance Provider</Text>
                                    <TextInput
                                        placeholder="Enter insurance provider"
                                        style={styles.input}
                                    />
                                </VStack>
                                <VStack space={2}>
                                    <Text fontSize="sm" fontWeight="semibold" color="gray.700">Policy Number</Text>
                                    <TextInput
                                        placeholder="Enter policy number"
                                        style={styles.input}
                                    />
                                </VStack>
                                <VStack space={2}>
                                    <Text fontSize="sm" fontWeight="semibold" color="gray.700">Claim Number</Text>
                                    <TextInput
                                        placeholder="Enter claim number"
                                        style={styles.input}
                                    />
                                </VStack>
                            </VStack>
                        )}
                    </VStack>
                </Box>

                {/* Process Payment Button */}
                <Button
                    bg="purple.600"
                    borderRadius="xl"
                    py={4}
                    mb={6}
                    onPress={handleProcessPayment}
                    _pressed={{ bg: 'purple.700' }}
                >
                    <HStack space={2} alignItems="center">
                        <Icon as={MaterialIcons} name="check-circle" size={5} color="white" />
                        <Text color="white" fontSize="md" fontWeight="bold">
                            Process Payment ${grandTotal}
                        </Text>
                    </HStack>
                </Button>
            </ScrollView>
        </Box>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    inputIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
});