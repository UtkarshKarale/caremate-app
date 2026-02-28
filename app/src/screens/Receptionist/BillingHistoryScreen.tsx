import React, { useEffect, useMemo, useState } from 'react';
import { Box, Text, HStack, VStack, ScrollView, Pressable, Icon, Badge, Spinner } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { TextInput, StyleSheet, View } from 'react-native';
import { getAllBills } from '@/lib/api';

type Bill = {
  id: number;
  billNumber: string;
  status: string;
  totalAmount?: number;
  billDate?: string;
  paymentMethod?: string;
  patient?: {
    fullName?: string;
  };
};

export default function BillingHistoryScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);

  const filters = ['All', 'PAID', 'PENDING', 'PARTIALLY_PAID', 'CANCELLED'];

  const fetchBills = async () => {
    setLoading(true);
    try {
      const data = await getAllBills();
      setBills(data || []);
    } catch (error) {
      console.error('Error fetching billing history:', error);
      setBills([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const filteredBills = useMemo(() => {
    let result = [...bills];

    if (selectedFilter !== 'All') {
      result = result.filter((bill) => bill.status === selectedFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((bill) =>
        (bill.billNumber || '').toLowerCase().includes(query) ||
        (bill.patient?.fullName || '').toLowerCase().includes(query)
      );
    }

    return result;
  }, [bills, searchQuery, selectedFilter]);

  return (
    <Box flex={1} bg="gray.50">
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
            {filters.map((filter) => (
              <Pressable
                key={filter}
                onPress={() => setSelectedFilter(filter)}
                bg={selectedFilter === filter ? 'purple.600' : 'white'}
                px={4}
                py={2}
                borderRadius="full"
                shadow={selectedFilter === filter ? 2 : 0}
              >
                <Text fontWeight="semibold" fontSize="sm" color={selectedFilter === filter ? 'white' : 'gray.700'}>
                  {filter}
                </Text>
              </Pressable>
            ))}
          </HStack>
        </ScrollView>
      </Box>

      <ScrollView flex={1} px={4} showsVerticalScrollIndicator={false}>
        {loading ? (
          <VStack alignItems="center" justifyContent="center" mt={8}>
            <Spinner color="purple.600" size="lg" />
            <Text mt={2} color="gray.600">Loading billing history...</Text>
          </VStack>
        ) : filteredBills.length === 0 ? (
          <Box bg="white" borderRadius="xl" shadow={1} p={4} mb={4}>
            <Text color="gray.500">No bills found for current filter.</Text>
          </Box>
        ) : (
          filteredBills.map((bill) => (
            <Pressable key={bill.id}>
              <Box bg="white" borderRadius="xl" shadow={2} p={4} mb={4}>
                <HStack justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <VStack flex={1}>
                    <Text fontWeight="bold" fontSize="md">{bill.billNumber}</Text>
                    <Text fontSize="sm" color="gray.600">{bill.patient?.fullName || 'Unknown Patient'}</Text>
                    <Text fontSize="xs" color="gray.500" mt={1}>
                      {bill.billDate ? new Date(bill.billDate).toLocaleDateString() : 'No date'}
                    </Text>
                  </VStack>
                  <VStack alignItems="flex-end">
                    <Text fontSize="lg" fontWeight="bold" color="purple.600">${Number(bill.totalAmount || 0).toFixed(2)}</Text>
                    <Badge
                      bg={bill.status === 'PAID' ? 'green.100' : bill.status === 'CANCELLED' ? 'red.100' : 'orange.100'}
                      _text={{
                        color: bill.status === 'PAID' ? 'green.700' : bill.status === 'CANCELLED' ? 'red.700' : 'orange.700',
                        fontWeight: 'semibold',
                        fontSize: 'xs',
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
          ))
        )}
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
    shadowOpacity: 0.2,
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
