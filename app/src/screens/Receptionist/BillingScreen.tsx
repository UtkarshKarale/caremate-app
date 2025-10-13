import React, { useState } from 'react';
import { Box, Text, HStack, VStack, ScrollView, Pressable, Icon, Avatar, Input, Button } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

export default function BillingScreen({ navigation }: any) {
    return (
        <Box flex={1} bg="gray.50">
            {/* Header */}
            <Box bg="purple.600" pb={6} pt={4} px={4} borderBottomLeftRadius={24} borderBottomRightRadius={24}>
                <HStack alignItems="center" mb={3}>
                    <VStack flex={1}>
                        <Text fontSize="2xl" fontWeight="bold" color="white">Billing & Payments</Text>
                        <Text fontSize="sm" color="purple.100">Generate bills and process payments</Text>
                    </VStack>
                    <Pressable bg="purple.500" p={2} borderRadius="full">
                        <Icon as={MaterialIcons} name="receipt-long" size={6} color="white" />
                    </Pressable>
                </HStack>
            </Box>

            {/* Quick Actions */}
            <Box p={4}>
                <HStack space={4} mb={4}>
                    <Pressable
                        flex={1}
                        bg="white"
                        p={6}
                        borderRadius="2xl"
                        shadow={1}
                        onPress={() => navigation.navigate('GenerateBill')}
                    >
                        <VStack alignItems="center" space={2}>
                            <Box bg="green.100" p={4} borderRadius="2xl">
                                <Icon as={MaterialIcons} name="add-circle" size={8} color="green.600" />
                            </Box>
                            <Text fontWeight="bold" textAlign="center">Generate New Bill</Text>
                        </VStack>
                    </Pressable>

                    <Pressable
                        flex={1}
                        bg="white"
                        p={6}
                        borderRadius="2xl"
                        shadow={1}
                        onPress={() => navigation.navigate('PaymentAcceptance')}
                    >
                        <VStack alignItems="center" space={2}>
                            <Box bg="blue.100" p={4} borderRadius="2xl">
                                <Icon as={MaterialIcons} name="payment" size={8} color="blue.600" />
                            </Box>
                            <Text fontWeight="bold" textAlign="center">Accept Payment</Text>
                        </VStack>
                    </Pressable>
                </HStack>

                <HStack space={4}>
                    <Pressable
                        flex={1}
                        bg="white"
                        p={6}
                        borderRadius="2xl"
                        shadow={1}
                        onPress={() => navigation.navigate('BillingHistory')}
                    >
                        <VStack alignItems="center" space={2}>
                            <Box bg="orange.100" p={4} borderRadius="2xl">
                                <Icon as={MaterialIcons} name="history" size={8} color="orange.600" />
                            </Box>
                            <Text fontWeight="bold" textAlign="center">Billing History</Text>
                        </VStack>
                    </Pressable>

                    <Pressable
                        flex={1}
                        bg="white"
                        p={6}
                        borderRadius="2xl"
                        shadow={1}
                        onPress={() => navigation.navigate('PendingPayments')}
                    >
                        <VStack alignItems="center" space={2}>
                            <Box bg="red.100" p={4} borderRadius="2xl">
                                <Icon as={MaterialIcons} name="pending-actions" size={8} color="red.600" />
                            </Box>
                            <Text fontWeight="bold" textAlign="center">Pending Payments</Text>
                        </VStack>
                    </Pressable>
                </HStack>
            </Box>

            {/* Today's Summary */}
            <Box px={4}>
                <Text fontSize="lg" fontWeight="bold" mb={4}>Today's Summary</Text>
                <Box bg="white" borderRadius="xl" shadow={1} p={6}>
                    <HStack justifyContent="space-around">
                        <VStack alignItems="center">
                            <Text fontSize="2xl" fontWeight="bold" color="green.600">$12,450</Text>
                            <Text fontSize="sm" color="gray.600">Collected</Text>
                        </VStack>
                        <Box w="1px" bg="gray.300" />
                        <VStack alignItems="center">
                            <Text fontSize="2xl" fontWeight="bold" color="blue.600">32</Text>
                            <Text fontSize="sm" color="gray.600">Bills Generated</Text>
                        </VStack>
                        <Box w="1px" bg="gray.300" />
                        <VStack alignItems="center">
                            <Text fontSize="2xl" fontWeight="bold" color="red.600">8</Text>
                            <Text fontSize="sm" color="gray.600">Pending</Text>
                        </VStack>
                    </HStack>
                </Box>
            </Box>
        </Box>
    );
}
