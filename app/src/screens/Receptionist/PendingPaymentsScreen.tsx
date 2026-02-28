import React, { useEffect, useMemo, useState } from 'react';
import { Box, Text, HStack, VStack, ScrollView, Pressable, Icon, Badge, Button, Spinner } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { getPendingBills } from '@/lib/api';

type Bill = {
  id: number;
  billNumber: string;
  status: string;
  dueAmount?: number;
  billDate?: string;
  patient?: {
    fullName?: string;
    id?: number;
  };
};

export default function PendingPaymentsScreen({ navigation }: any) {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingBills = async () => {
    setLoading(true);
    try {
      const data = await getPendingBills();
      setBills(data || []);
    } catch (error) {
      console.error('Error fetching pending bills:', error);
      setBills([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingBills();
  }, []);

  const totalPending = useMemo(
    () => bills.reduce((sum, bill) => sum + Number(bill.dueAmount || 0), 0),
    [bills]
  );

  const handleProcessPayment = (bill: Bill) => {
    navigation.navigate('PaymentAcceptance', {
      billId: bill.id,
      billNumber: bill.billNumber,
      patientName: bill.patient?.fullName || 'Unknown Patient',
      patientId: bill.patient?.id?.toString() || '',
      total: Number(bill.dueAmount || 0),
      dueAmount: Number(bill.dueAmount || 0),
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
            <Text fontSize="2xl" fontWeight="bold" color="white">Pending Payments</Text>
            <Text fontSize="sm" color="purple.100">{bills.length} bills pending</Text>
          </VStack>
        </HStack>
      </Box>

      <Box p={4}>
        <Box bg="red.50" borderRadius="xl" p={4} borderWidth={1} borderColor="red.200">
          <HStack justifyContent="space-between" alignItems="center">
            <VStack>
              <Text fontSize="sm" color="red.600" fontWeight="semibold">Total Pending</Text>
              <Text fontSize="2xl" fontWeight="bold" color="red.600">${totalPending.toFixed(2)}</Text>
            </VStack>
            <Icon as={MaterialIcons} name="warning" size={12} color="red.400" />
          </HStack>
        </Box>
      </Box>

      <ScrollView flex={1} px={4} showsVerticalScrollIndicator={false}>
        {loading ? (
          <VStack flex={1} alignItems="center" justifyContent="center" mt={8}>
            <Spinner color="purple.600" size="lg" />
            <Text mt={2} color="gray.600">Loading pending bills...</Text>
          </VStack>
        ) : bills.length === 0 ? (
          <Box bg="white" borderRadius="xl" shadow={1} p={4} mb={4}>
            <Text color="gray.500">No pending bills found.</Text>
          </Box>
        ) : (
          bills.map((bill) => (
            <Box key={bill.id} bg="white" borderRadius="xl" shadow={2} p={4} mb={4}>
              <HStack justifyContent="space-between" alignItems="flex-start" mb={3}>
                <VStack flex={1}>
                  <Text fontWeight="bold" fontSize="md">{bill.billNumber}</Text>
                  <Text fontSize="sm" color="gray.600">{bill.patient?.fullName || 'Unknown Patient'}</Text>
                  <HStack alignItems="center" space={2} mt={2}>
                    <Icon as={MaterialIcons} name="calendar-today" size={4} color="gray.500" />
                    <Text fontSize="xs" color="gray.500">{bill.billDate ? new Date(bill.billDate).toLocaleDateString() : 'No date'}</Text>
                  </HStack>
                </VStack>
                <VStack alignItems="flex-end">
                  <Text fontSize="xl" fontWeight="bold" color="red.600">${Number(bill.dueAmount || 0).toFixed(2)}</Text>
                  <Badge bg="orange.100" _text={{ color: 'orange.700', fontWeight: 'semibold', fontSize: 'xs' }} borderRadius="full" px={3} py={1} mt={1}>
                    {bill.status}
                  </Badge>
                </VStack>
              </HStack>

              <Button bg="purple.600" size="sm" borderRadius="lg" onPress={() => handleProcessPayment(bill)} _pressed={{ bg: 'purple.700' }}>
                <HStack space={2} alignItems="center">
                  <Icon as={MaterialIcons} name="payment" size={4} color="white" />
                  <Text color="white" fontSize="sm" fontWeight="bold">Process Payment</Text>
                </HStack>
              </Button>
            </Box>
          ))
        )}
      </ScrollView>
    </Box>
  );
}
