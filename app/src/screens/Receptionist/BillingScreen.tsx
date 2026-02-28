import React, { useCallback, useMemo, useState } from 'react';
import { Box, Text, HStack, VStack, Pressable, Icon, Spinner } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { getAllBills, getPendingBills } from '@/lib/api';

type Bill = {
  id: number;
  billNumber: string;
  status: string;
  totalAmount?: number;
  paidAmount?: number;
  dueAmount?: number;
};

export default function BillingScreen({ navigation }: any) {
  const [allBills, setAllBills] = useState<Bill[]>([]);
  const [pendingBills, setPendingBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBillingData = useCallback(async () => {
    setLoading(true);
    try {
      const [all, pending] = await Promise.all([getAllBills(), getPendingBills()]);
      setAllBills(all || []);
      setPendingBills(pending || []);
    } catch (error) {
      console.error('Error fetching billing summary:', error);
      setAllBills([]);
      setPendingBills([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchBillingData();
    }, [fetchBillingData])
  );

  const summary = useMemo(() => {
    const collected = allBills.reduce((sum, bill) => sum + Number(bill.paidAmount || 0), 0);
    const generated = allBills.length;
    const pending = pendingBills.length;
    return { collected, generated, pending };
  }, [allBills, pendingBills]);

  return (
    <Box flex={1} bg="gray.50">
      <Box bg="purple.600" pb={6} pt={4} px={4} borderBottomLeftRadius={24} borderBottomRightRadius={24}>
        <HStack alignItems="center" justifyContent="space-between" mb={3}>
          <VStack flex={1}>
            <Text fontSize="2xl" fontWeight="bold" color="white">Billing & Payments</Text>
            <Text fontSize="sm" color="purple.100">Generate, track, and collect payments</Text>
          </VStack>
          <Pressable bg="purple.500" p={2} borderRadius="full" onPress={fetchBillingData}>
            <Icon as={MaterialIcons} name="refresh" size={6} color="white" />
          </Pressable>
        </HStack>
      </Box>

      <Box p={4}>
        <HStack space={4} mb={4}>
          <Pressable flex={1} bg="white" p={6} borderRadius="2xl" shadow={1} onPress={() => navigation.navigate('GenerateBill')}>
            <VStack alignItems="center" space={2}>
              <Box bg="green.100" p={4} borderRadius="2xl">
                <Icon as={MaterialIcons} name="add-circle" size={8} color="green.600" />
              </Box>
              <Text fontWeight="bold" textAlign="center">Generate Bill</Text>
            </VStack>
          </Pressable>

          <Pressable flex={1} bg="white" p={6} borderRadius="2xl" shadow={1} onPress={() => navigation.navigate('PendingPayments')}>
            <VStack alignItems="center" space={2}>
              <Box bg="red.100" p={4} borderRadius="2xl">
                <Icon as={MaterialIcons} name="pending-actions" size={8} color="red.600" />
              </Box>
              <Text fontWeight="bold" textAlign="center">Pending Payments</Text>
            </VStack>
          </Pressable>
        </HStack>

        <HStack space={4}>
          <Pressable flex={1} bg="white" p={6} borderRadius="2xl" shadow={1} onPress={() => navigation.navigate('BillingHistory')}>
            <VStack alignItems="center" space={2}>
              <Box bg="orange.100" p={4} borderRadius="2xl">
                <Icon as={MaterialIcons} name="history" size={8} color="orange.600" />
              </Box>
              <Text fontWeight="bold" textAlign="center">Billing History</Text>
            </VStack>
          </Pressable>

          <Pressable flex={1} bg="white" p={6} borderRadius="2xl" shadow={1} onPress={() => navigation.navigate('ReceptionistAppointments')}>
            <VStack alignItems="center" space={2}>
              <Box bg="blue.100" p={4} borderRadius="2xl">
                <Icon as={MaterialIcons} name="event" size={8} color="blue.600" />
              </Box>
              <Text fontWeight="bold" textAlign="center">Visit Pipeline</Text>
            </VStack>
          </Pressable>
        </HStack>
      </Box>

      <Box px={4}>
        <Text fontSize="lg" fontWeight="bold" mb={4}>Today Summary</Text>
        <Box bg="white" borderRadius="xl" shadow={1} p={6}>
          {loading ? (
            <HStack alignItems="center" justifyContent="center" h={16}>
              <Spinner color="purple.600" />
            </HStack>
          ) : (
            <HStack justifyContent="space-around">
              <VStack alignItems="center">
                <Text fontSize="2xl" fontWeight="bold" color="green.600">${summary.collected.toFixed(2)}</Text>
                <Text fontSize="sm" color="gray.600">Collected</Text>
              </VStack>
              <Box w="1px" bg="gray.300" />
              <VStack alignItems="center">
                <Text fontSize="2xl" fontWeight="bold" color="blue.600">{summary.generated}</Text>
                <Text fontSize="sm" color="gray.600">Bills</Text>
              </VStack>
              <Box w="1px" bg="gray.300" />
              <VStack alignItems="center">
                <Text fontSize="2xl" fontWeight="bold" color="red.600">{summary.pending}</Text>
                <Text fontSize="sm" color="gray.600">Pending</Text>
              </VStack>
            </HStack>
          )}
        </Box>
      </Box>
    </Box>
  );
}
