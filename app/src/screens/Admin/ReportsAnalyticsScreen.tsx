import React, { useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { Box, Text, HStack, VStack, ScrollView, Icon, Pressable, Spinner, Button } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import {
  cancelBill,
  getAllBills,
  getAllUsers,
  getAppointmentsByDate,
  getHospitals,
  makeBillPayment,
} from '@/lib/api';

type Bill = {
  id: number;
  billNumber: string;
  totalAmount?: number;
  paidAmount?: number;
  dueAmount?: number;
  status?: string;
  paymentMethod?: string;
  patient?: { fullName?: string };
  billDate?: string;
};

export default function ReportsAnalyticsScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [patientsToday, setPatientsToday] = useState(0);
  const [doctorsPresent, setDoctorsPresent] = useState(0);
  const [appointmentsToday, setAppointmentsToday] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalHospitals, setTotalHospitals] = useState(0);
  const [bills, setBills] = useState<Bill[]>([]);

  const fetchDashboard = async (silent = false) => {
    if (!silent) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    try {
      const today = new Date().toISOString().split('T')[0];
      const [appointments, users, hospitals, billList] = await Promise.all([
        getAppointmentsByDate(today),
        getAllUsers(),
        getHospitals(),
        getAllBills(),
      ]);

      const aptList = appointments || [];
      const userList = users || [];
      const hospitalList = hospitals || [];
      const allBills = billList || [];

      const patientIds = new Set(aptList.map((a: any) => a.patient?.id || a.patientId).filter(Boolean));
      const doctorIds = new Set(aptList.map((a: any) => a.doctor?.id || a.doctorId).filter(Boolean));

      setPatientsToday(patientIds.size);
      setDoctorsPresent(doctorIds.size);
      setAppointmentsToday(aptList.length);
      setTotalUsers(userList.length);
      setTotalHospitals(hospitalList.length);
      setBills(allBills);
    } catch (error) {
      console.error('Error fetching reports data:', error);
      Alert.alert('Error', 'Unable to load reports right now.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const reportStats = useMemo(() => {
    const revenueCollected = bills.reduce((sum, bill) => sum + Number(bill.paidAmount || 0), 0);
    const pendingAmount = bills
      .filter((b) => b.status === 'PENDING' || b.status === 'PARTIALLY_PAID')
      .reduce((sum, b) => sum + Number(b.dueAmount || 0), 0);

    return [
      { id: '1', label: 'Appointments Today', value: appointmentsToday, icon: 'event', color: 'blue.600', bgColor: 'blue.100' },
      { id: '2', label: 'Patients Today', value: patientsToday, icon: 'person', color: 'green.600', bgColor: 'green.100' },
      { id: '3', label: 'Doctors Present', value: doctorsPresent, icon: 'medical-services', color: 'purple.600', bgColor: 'purple.100' },
      { id: '4', label: 'Total Users', value: totalUsers, icon: 'groups', color: 'orange.600', bgColor: 'orange.100' },
      { id: '5', label: 'Hospitals', value: totalHospitals, icon: 'local-hospital', color: 'red.600', bgColor: 'red.100' },
      { id: '6', label: 'Revenue Collected', value: `$${revenueCollected.toFixed(2)}`, icon: 'attach-money', color: 'emerald.600', bgColor: 'emerald.100' },
      { id: '7', label: 'Pending Amount', value: `$${pendingAmount.toFixed(2)}`, icon: 'payments', color: 'amber.600', bgColor: 'amber.100' },
      { id: '8', label: 'Total Bills', value: bills.length, icon: 'receipt-long', color: 'cyan.600', bgColor: 'cyan.100' },
    ];
  }, [appointmentsToday, patientsToday, doctorsPresent, totalUsers, totalHospitals, bills]);

  const pendingBills = useMemo(
    () => bills.filter((b) => b.status === 'PENDING' || b.status === 'PARTIALLY_PAID').slice(0, 8),
    [bills]
  );

  const recentBills = useMemo(() => bills.slice(0, 8), [bills]);

  const handleCollectDue = async (bill: Bill) => {
    const due = Number(bill.dueAmount || 0);
    if (!due || due <= 0) {
      Alert.alert('Info', 'This bill has no due amount.');
      return;
    }

    try {
      await makeBillPayment(bill.id, due, 'CASH', 'Collected by admin');
      await fetchDashboard(true);
    } catch (error) {
      console.error('Payment collection failed:', error);
      Alert.alert('Error', 'Could not collect payment for this bill.');
    }
  };

  const handleCancelBill = async (bill: Bill) => {
    Alert.alert('Cancel Bill', `Cancel ${bill.billNumber}?`, [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes, Cancel',
        style: 'destructive',
        onPress: async () => {
          try {
            await cancelBill(bill.id);
            await fetchDashboard(true);
          } catch (error) {
            console.error('Bill cancellation failed:', error);
            Alert.alert('Error', 'Could not cancel bill.');
          }
        },
      },
    ]);
  };

  return (
    <ScrollView flex={1} bg="gray.50">
      <Box bg="red.600" pb={6} pt={4} px={4} borderBottomLeftRadius={24} borderBottomRightRadius={24}>
        <HStack alignItems="center" justifyContent="space-between" mb={3}>
          <VStack flex={1} mt={5}>
            <Text fontSize="2xl" fontWeight="bold" color="white">Billing & Analytics</Text>
            <Text fontSize="sm" color="red.100">Backend live data for operations</Text>
          </VStack>
          <Pressable bg="red.500" p={2} borderRadius="full" onPress={() => fetchDashboard(true)}>
            <Icon as={MaterialIcons} name="refresh" size={6} color="white" />
          </Pressable>
        </HStack>
      </Box>

      {loading ? (
        <HStack justifyContent="center" alignItems="center" h={100}>
          <Spinner color="red.600" size="lg" />
        </HStack>
      ) : (
        <Box p={4} mt={-10}>
          <HStack space={3} flexWrap="wrap">
            {reportStats.map((stat) => (
              <Box key={stat.id} flex={1} minW="45%" bg="white" p={4} borderRadius="xl" shadow={2} mb={3}>
                <HStack space={3} alignItems="center">
                  <Box bg={stat.bgColor} p={3} borderRadius="xl">
                    <Icon as={MaterialIcons} name={stat.icon} size={6} color={stat.color} />
                  </Box>
                  <VStack>
                    <Text fontSize="lg" fontWeight="bold" color={stat.color}>{stat.value}</Text>
                    <Text fontSize="xs" color="gray.600">{stat.label}</Text>
                  </VStack>
                </HStack>
              </Box>
            ))}
          </HStack>
        </Box>
      )}

      <Box p={4} pt={0}>
        <Text fontSize="lg" fontWeight="bold" mb={4} color="gray.800">Pending Bills (Action Required)</Text>
        {loading || refreshing ? (
          [1, 2, 3].map((idx) => (
            <Box key={idx} bg="white" borderRadius="xl" shadow={1} p={4} mb={3}>
              <Box h={4} w="50%" bg="gray.200" borderRadius="md" mb={2} />
              <Box h={3} w="35%" bg="gray.100" borderRadius="md" />
            </Box>
          ))
        ) : pendingBills.length === 0 ? (
          <Box bg="white" borderRadius="xl" shadow={1} p={4} mb={3}>
            <Text color="gray.500">No pending bills. All caught up.</Text>
          </Box>
        ) : (
          pendingBills.map((bill) => (
            <Box key={bill.id} bg="white" borderRadius="xl" shadow={1} p={4} mb={3}>
              <HStack justifyContent="space-between" alignItems="center" mb={2}>
                <VStack flex={1}>
                  <Text fontWeight="bold">{bill.billNumber}</Text>
                  <Text color="gray.600">{bill.patient?.fullName || 'Unknown Patient'}</Text>
                </VStack>
                <VStack alignItems="flex-end">
                  <Text fontWeight="bold" color="orange.700">Due ${Number(bill.dueAmount || 0).toFixed(2)}</Text>
                  <Text color="orange.600" fontSize="xs" fontWeight="semibold">{bill.status}</Text>
                </VStack>
              </HStack>
              <HStack space={2} mt={2}>
                <Button flex={1} size="sm" bg="green.600" onPress={() => handleCollectDue(bill)}>
                  Collect Due
                </Button>
                <Button flex={1} size="sm" bg="red.600" onPress={() => handleCancelBill(bill)}>
                  Cancel Bill
                </Button>
              </HStack>
            </Box>
          ))
        )}
      </Box>

      <Box p={4} pt={0} pb={24}>
        <Text fontSize="lg" fontWeight="bold" mb={4} color="gray.800">Recent Billing Activity</Text>
        {loading || refreshing ? (
          [1, 2, 3].map((idx) => (
            <Box key={idx} bg="white" borderRadius="xl" shadow={1} p={4} mb={3}>
              <Box h={4} w="52%" bg="gray.200" borderRadius="md" mb={2} />
              <Box h={3} w="40%" bg="gray.100" borderRadius="md" />
            </Box>
          ))
        ) : recentBills.length === 0 ? (
          <Box bg="white" borderRadius="xl" shadow={1} p={4} mb={3}>
            <Text color="gray.500">No bills available yet.</Text>
          </Box>
        ) : (
          recentBills.map((bill) => (
            <Box key={bill.id} bg="white" borderRadius="xl" shadow={1} p={4} mb={3}>
              <HStack justifyContent="space-between" alignItems="center">
                <VStack flex={1}>
                  <Text fontWeight="bold">{bill.billNumber}</Text>
                  <Text fontSize="sm" color="gray.600">{bill.patient?.fullName || 'Unknown Patient'}</Text>
                </VStack>
                <VStack alignItems="flex-end">
                  <Text fontWeight="bold">${Number(bill.totalAmount || 0).toFixed(2)}</Text>
                  <Text
                    fontSize="xs"
                    fontWeight="semibold"
                    color={bill.status === 'PAID' ? 'green.600' : bill.status === 'CANCELLED' ? 'red.600' : 'orange.600'}
                  >
                    {bill.status || 'PENDING'}
                  </Text>
                </VStack>
              </HStack>
            </Box>
          ))
        )}
      </Box>
    </ScrollView>
  );
}
