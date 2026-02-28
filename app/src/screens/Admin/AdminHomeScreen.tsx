import React, { useEffect, useMemo, useState } from 'react';
import { Box, Text, HStack, VStack, ScrollView, Pressable, Icon, Spinner } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { getAllBills, getAllUsers, getHospitals } from '@/lib/api';
import { useAuth } from '../context/AuthContext';

type Bill = {
  id: number;
  billNumber: string;
  totalAmount?: number;
  paidAmount?: number;
  dueAmount?: number;
  status?: string;
  patient?: { fullName?: string };
  billDate?: string;
};

export default function AdminHomeScreen({ navigation }: any) {
  const [users, setUsers] = useState<any[]>([]);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const { user: adminUser } = useAuth();

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const [allUsers, allHospitals, allBills] = await Promise.all([
          getAllUsers(),
          getHospitals(),
          getAllBills(),
        ]);

        const otherUsers = (allUsers || []).filter((u: any) => u.id !== adminUser?.id);
        setUsers(otherUsers);
        setHospitals(allHospitals || []);
        setBills(allBills || []);
      } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [adminUser?.id]);

  const totalUsers = users.length;
  const totalDoctors = users.filter((u) => String(u.roles).includes('DOCTOR')).length;
  const totalPatients = users.filter((u) => String(u.roles).includes('PATIENT')).length;
  const totalHospitals = hospitals.length;
  const pendingBills = bills.filter((b) => b.status === 'PENDING' || b.status === 'PARTIALLY_PAID').length;
  const revenueCollected = bills.reduce((sum, bill) => sum + Number(bill.paidAmount || 0), 0);

  const systemStats = [
    { id: '1', label: 'Total Users', value: totalUsers, icon: 'people', color: 'blue.600', bgColor: 'blue.100' },
    { id: '2', label: 'Doctors', value: totalDoctors, icon: 'medical-services', color: 'green.600', bgColor: 'green.100' },
    { id: '3', label: 'Patients', value: totalPatients, icon: 'person', color: 'purple.600', bgColor: 'purple.100' },
    { id: '4', label: 'Hospitals', value: totalHospitals, icon: 'local-hospital', color: 'orange.600', bgColor: 'orange.100' },
    { id: '5', label: 'Pending Bills', value: pendingBills, icon: 'pending-actions', color: 'red.600', bgColor: 'red.100' },
    { id: '6', label: 'Revenue', value: `$${revenueCollected.toFixed(2)}`, icon: 'attach-money', color: 'emerald.600', bgColor: 'emerald.100' },
  ];

  const latestDoctors = useMemo(
    () => users.filter((u) => String(u.roles).includes('DOCTOR')).slice(0, 5),
    [users]
  );

  const recentBills = useMemo(() => bills.slice(0, 5), [bills]);

  return (
    <ScrollView flex={1} bg="gray.50">
      <Box bg="red.600" pb={6} pt={4} px={4} borderBottomLeftRadius={24} borderBottomRightRadius={24}>
        <HStack justifyContent="space-between" alignItems="center" mb={6}>
          <VStack mt={5}>
            <Text fontSize="sm" color="red.100">Welcome back,</Text>
            <Text fontSize="2xl" fontWeight="bold" color="white">Admin Dashboard</Text>
            <Text fontSize="sm" color="red.100">Live system overview</Text>
          </VStack>
          <HStack space={2}>
            <Pressable bg="red.500" p={2} borderRadius="full" onPress={() => navigation.navigate('AdminProfile')}>
              <Icon as={MaterialIcons} name="settings" size={5} color="white" />
            </Pressable>
          </HStack>
        </HStack>

        {loading ? (
          <HStack justifyContent="center" alignItems="center" h={110}>
            <Spinner color="white" size="lg" />
          </HStack>
        ) : (
          <HStack space={3} flexWrap="wrap">
            {systemStats.map((stat) => (
              <Box key={stat.id} flex={1} minW="45%" bg="white" p={4} borderRadius="xl" shadow={2} mb={3}>
                <HStack space={3} alignItems="center">
                  <Box bg={stat.bgColor} p={3} borderRadius="xl">
                    <Icon as={MaterialIcons} name={stat.icon} size={6} color={stat.color} />
                  </Box>
                  <VStack>
                    <Text fontSize="xl" fontWeight="bold" color={stat.color}>{stat.value}</Text>
                    <Text fontSize="xs" color="gray.600">{stat.label}</Text>
                  </VStack>
                </HStack>
              </Box>
            ))}
          </HStack>
        )}
      </Box>

      <Box p={4}>
        <Text fontSize="lg" fontWeight="bold" mb={4} color="gray.800">Quick Actions</Text>
        <HStack space={4} mb={4}>
          <Pressable flex={1} bg="white" p={6} borderRadius="2xl" shadow={1} onPress={() => navigation.navigate('Users')}>
            <VStack alignItems="center" space={2}>
              <Box bg="blue.100" p={4} borderRadius="2xl">
                <Icon as={MaterialIcons} name="people" size={7} color="blue.600" />
              </Box>
              <Text fontWeight="semibold" textAlign="center" fontSize="sm">User Management</Text>
            </VStack>
          </Pressable>

          <Pressable
            flex={1}
            bg="white"
            p={6}
            borderRadius="2xl"
            shadow={1}
            onPress={() => navigation.navigate('Users', { initialRole: 'DOCTOR' })}
          >
            <VStack alignItems="center" space={2}>
              <Box bg="green.100" p={4} borderRadius="2xl">
                <Icon as={MaterialIcons} name="medical-services" size={7} color="green.600" />
              </Box>
              <Text fontWeight="semibold" textAlign="center" fontSize="sm">View Doctors</Text>
            </VStack>
          </Pressable>
        </HStack>

        <HStack space={4}>
          <Pressable flex={1} bg="white" p={6} borderRadius="2xl" shadow={1} onPress={() => navigation.navigate('Hospitals')}>
            <VStack alignItems="center" space={2}>
              <Box bg="orange.100" p={4} borderRadius="2xl">
                <Icon as={MaterialIcons} name="local-hospital" size={7} color="orange.600" />
              </Box>
              <Text fontWeight="semibold" textAlign="center" fontSize="sm">Manage Hospitals</Text>
            </VStack>
          </Pressable>

          <Pressable flex={1} bg="white" p={6} borderRadius="2xl" shadow={1} onPress={() => navigation.navigate('Reports')}>
            <VStack alignItems="center" space={2}>
              <Box bg="purple.100" p={4} borderRadius="2xl">
                <Icon as={MaterialIcons} name="analytics" size={7} color="purple.600" />
              </Box>
              <Text fontWeight="semibold" textAlign="center" fontSize="sm">Billing & Reports</Text>
            </VStack>
          </Pressable>
        </HStack>
      </Box>

      <Box px={4} pb={6}>
        <HStack justifyContent="space-between" alignItems="center" mb={3}>
          <Text fontSize="lg" fontWeight="bold" color="gray.800">Latest Doctors</Text>
          <Pressable onPress={() => navigation.navigate('Users', { initialRole: 'DOCTOR' })}>
            <Text color="red.600" fontWeight="semibold">View All</Text>
          </Pressable>
        </HStack>

        {loading ? (
          [1, 2, 3].map((idx) => (
            <Box key={idx} bg="white" p={4} borderRadius="xl" shadow={1} mb={3}>
              <Box h={4} w="60%" bg="gray.200" borderRadius="md" mb={2} />
              <Box h={3} w="40%" bg="gray.100" borderRadius="md" />
            </Box>
          ))
        ) : latestDoctors.length === 0 ? (
          <Box bg="white" p={4} borderRadius="xl" shadow={1} mb={3}>
            <Text color="gray.500">No doctors found yet.</Text>
          </Box>
        ) : (
          latestDoctors.map((doc) => (
            <Box key={doc.id} bg="white" p={4} borderRadius="xl" shadow={1} mb={3}>
              <Text fontWeight="bold" fontSize="md">{doc.fullName}</Text>
              <Text color="gray.600">{doc.email}</Text>
              <Text color="gray.500" fontSize="xs">{doc.specialist || 'General'}</Text>
            </Box>
          ))
        )}
      </Box>

      <Box px={4} pb={24}>
        <HStack justifyContent="space-between" alignItems="center" mb={3}>
          <Text fontSize="lg" fontWeight="bold" color="gray.800">Recent Billing</Text>
          <Pressable onPress={() => navigation.navigate('Reports')}>
            <Text color="red.600" fontWeight="semibold">Manage</Text>
          </Pressable>
        </HStack>

        {loading ? (
          [1, 2, 3].map((idx) => (
            <Box key={idx} bg="white" p={4} borderRadius="xl" shadow={1} mb={3}>
              <Box h={4} w="55%" bg="gray.200" borderRadius="md" mb={2} />
              <Box h={3} w="35%" bg="gray.100" borderRadius="md" />
            </Box>
          ))
        ) : recentBills.length === 0 ? (
          <Box bg="white" p={4} borderRadius="xl" shadow={1} mb={3}>
            <Text color="gray.500">No billing records available yet.</Text>
          </Box>
        ) : (
          recentBills.map((bill) => (
            <Box key={bill.id} bg="white" p={4} borderRadius="xl" shadow={1} mb={3}>
              <HStack justifyContent="space-between" alignItems="center">
                <VStack flex={1}>
                  <Text fontWeight="bold">{bill.billNumber}</Text>
                  <Text color="gray.600">{bill.patient?.fullName || 'Unknown Patient'}</Text>
                </VStack>
                <VStack alignItems="flex-end">
                  <Text fontWeight="bold">${Number(bill.totalAmount || 0).toFixed(2)}</Text>
                  <Text
                    color={bill.status === 'PAID' ? 'green.600' : bill.status === 'CANCELLED' ? 'red.600' : 'orange.600'}
                    fontSize="xs"
                    fontWeight="semibold"
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
