import React, { useState } from 'react';
import { Box, Text, HStack, VStack, ScrollView, Pressable, Icon, Badge } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { TextInput, StyleSheet, View } from 'react-native';

const billingHistory = [
    { id: '1', billNumber: 'BILL-001234', patientName: 'John Smith', amount: 2500, date: '2025-10-14', status: 'Paid', paymentMethod: 'Cash' },
    { id: '2', billNumber: 'BILL-001235', patientName: 'Emma Wilson', amount: 3200, date: '2025-10-14', status: 'Paid', paymentMethod: 'Card' },
    { id: '3', billNumber: 'BILL-001236', patientName: 'Michael Brown', amount: 1800, date: '2025-10-13', status: 'Pending', paymentMethod: '' },
    { id: '4', billNumber: 'BILL-001237', patientName: 'Sarah Davis', amount: 4500, date: '2025-10-13', status: 'Paid', paymentMethod: 'UPI' },
    { id: '5', billNumber: 'BILL-001238', patientName: 'David Lee', amount: 2100, date: '2025-10-12', status: 'Paid', paymentMethod: 'Insurance' },
];

export default function BillingHistoryScreen({ navigation }: any) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('All');

    const filters = ['All', 'Paid', 'Pending', 'Cancelled'];

    return (
        <Box flex={1} bg="gray.50">
            {/* Header */}
            <Box bg="purple.600" pb={6} pt={4} px={4} borderBottomLeftRadius={24} borderBottomRightRadius={24}>
                <HStack alignItems="center" mb={3}>
                    <Pressable mr={3} onPress={() => navigation.goBack()}>
                        <Icon as={MaterialIcons} name="arrow-back" size={6} color="white" />
                    </Pressable>
                    <VStack flex={1}>
                        <Text fontSize="2xl" fontWeight="bold" color="white">Billing History</Text>
                        <Text fontSize="sm" color="purple.100">View all transactions</Text>
                    </VStack>
                </HStack>
            </Box>

            {/* Search & Filter */}
            <Box p={4}>
                <View style={styles.inputContainer}>
                    <Icon as={MaterialIcons} name="search" size={5} color="gray.400" style={styles.inputIcon} />
                    <TextInput
                        placeholder="Search by bill number or patient..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        style={styles.input}
                    />
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <HStack space={2}>
                        {filters.map(filter => (
                            <Pressable
                                key={filter}
                                onPress={() => setSelectedFilter(filter)}
                                bg={selectedFilter === filter ? 'purple.600' : 'white'}
                                px={4}
                                py={2}
                                borderRadius="full"
                                shadow={selectedFilter === filter ? 2 : 0}
                            >
                                <Text
                                    fontWeight="semibold"
                                    fontSize="sm"
                                    color={selectedFilter === filter ? 'white' : 'gray.700'}
                                >
                                    {filter}
                                </Text>
                            </Pressable>
                        ))}
                    </HStack>
                </ScrollView>
            </Box>

            {/* Billing History List */}
            <ScrollView flex={1} px={4} showsVerticalScrollIndicator={false}>
                {billingHistory.map(bill => (
                    <Pressable key={bill.id}>
                        <Box bg="white" borderRadius="xl" shadow={2} p={4} mb={4}>
                            <HStack justifyContent="space-between" alignItems="flex-start" mb={2}>
                                <VStack flex={1}>
                                    <Text fontWeight="bold" fontSize="md">{bill.billNumber}</Text>
                                    <Text fontSize="sm" color="gray.600">{bill.patientName}</Text>
                                    <Text fontSize="xs" color="gray.500" mt={1}>{bill.date}</Text>
                                </VStack>
                                <VStack alignItems="flex-end">
                                    <Text fontSize="lg" fontWeight="bold" color="purple.600">${bill.amount}</Text>
                                    <Badge
                                        bg={bill.status === 'Paid' ? 'green.100' : 'orange.100'}
                                        _text={{
                                            color: bill.status === 'Paid' ? 'green.700' : 'orange.700',
                                            fontWeight: 'semibold',
                                            fontSize: 'xs'
                                        }}
                                        borderRadius="full"
                                        px={3}
                                        py={1}
                                        mt={1}
                                    >
                                        {bill.status}
                                    </Badge>
                                </VStack>
                            </HStack>
                            {bill.paymentMethod && (
                                <HStack alignItems="center" space={2} mt={2} bg="gray.50" p={2} borderRadius="lg">
                                    <Icon as={MaterialIcons} name="payment" size={4} color="gray.600" />
                                    <Text fontSize="sm" color="gray.600">Payment: {bill.paymentMethod}</Text>
                                </HStack>
                            )}
                        </Box>
                    </Pressable>
                ))}
            </ScrollView>
        </Box>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 12,
        paddingHorizontal: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
    },
    inputIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
    },
});