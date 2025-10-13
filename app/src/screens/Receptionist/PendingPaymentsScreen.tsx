import React from 'react';
import { Box, Text, HStack, VStack, ScrollView, Pressable, Icon, Badge, Button } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

const pendingPayments = [
    { id: '1', billNumber: 'BILL-001236', patientName: 'Michael Brown', amount: 1800, dueDate: '2025-10-15', daysPending: 1 },
    { id: '2', billNumber: 'BILL-001240', patientName: 'Lisa Johnson', amount: 2300, dueDate: '2025-10-14', daysPending: 0 },
    { id: '3', billNumber: 'BILL-001232', patientName: 'Robert Chen', amount: 5600, dueDate: '2025-10-10', daysPending: 4 },
];

export default function PendingPaymentsScreen({ navigation }: any) {
    const handleProcessPayment = (bill: any) => {
        navigation.navigate('PaymentAcceptance', {
            billNumber: bill.billNumber,
            patientName: bill.patientName,
            patientId: 'PENDING',
            total: bill.amount,
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
                        <Text fontSize="2xl" fontWeight="bold" color="white">Pending Payments</Text>
                        <Text fontSize="sm" color="purple.100">{pendingPayments.length} bills pending</Text>
                    </VStack>
                </HStack>
            </Box>

            {/* Total Pending Amount */}
            <Box p={4}>
                <Box bg="red.50" borderRadius="xl" p={4} borderWidth={1} borderColor="red.200">
                    <HStack justifyContent="space-between" alignItems="center">
                        <VStack>
                            <Text fontSize="sm" color="red.600" fontWeight="semibold">Total Pending</Text>
                            <Text fontSize="2xl" fontWeight="bold" color="red.600">
                                ${pendingPayments.reduce((sum, bill) => sum + bill.amount, 0)}
                            </Text>
                        </VStack>
                        <Icon as={MaterialIcons} name="warning" size={12} color="red.400" />
                    </HStack>
                </Box>
            </Box>

            {/* Pending Payments List */}
            <ScrollView flex={1} px={4} showsVerticalScrollIndicator={false}>
                {pendingPayments.map(bill => (
                    <Box key={bill.id} bg="white" borderRadius="xl" shadow={2} p={4} mb={4}>
                        <HStack justifyContent="space-between" alignItems="flex-start" mb={3}>
                            <VStack flex={1}>
                                <Text fontWeight="bold" fontSize="md">{bill.billNumber}</Text>
                                <Text fontSize="sm" color="gray.600">{bill.patientName}</Text>
                                <HStack alignItems="center" space={2} mt={2}>
                                    <Icon as={MaterialIcons} name="calendar-today" size={4} color="gray.500" />
                                    <Text fontSize="xs" color="gray.500">Due: {bill.dueDate}</Text>
                                </HStack>
                            </VStack>
                            <VStack alignItems="flex-end">
                                <Text fontSize="xl" fontWeight="bold" color="red.600">${bill.amount}</Text>
                                <Badge
                                    bg={bill.daysPending === 0 ? 'yellow.100' : bill.daysPending < 3 ? 'orange.100' : 'red.100'}
                                    _text={{
                                        color: bill.daysPending === 0 ? 'yellow.700' : bill.daysPending < 3 ? 'orange.700' : 'red.700',
                                        fontWeight: 'semibold',
                                        fontSize: 'xs'
                                    }}
                                    borderRadius="full"
                                    px={3}
                                    py={1}
                                    mt={1}
                                >
                                    {bill.daysPending === 0 ? 'Due Today' : `${bill.daysPending}d overdue`}
                                </Badge>
                            </VStack>
                        </HStack>

                        <Button
                            bg="purple.600"
                            size="sm"
                            borderRadius="lg"
                            onPress={() => handleProcessPayment(bill)}
                            _pressed={{ bg: 'purple.700' }}
                        >
                            <HStack space={2} alignItems="center">
                                <Icon as={MaterialIcons} name="payment" size={4} color="white" />
                                <Text color="white" fontSize="sm" fontWeight="bold">
                                    Process Payment
                                </Text>
                            </HStack>
                        </Button>
                    </Box>
                ))}
            </ScrollView>
        </Box>
    );
}