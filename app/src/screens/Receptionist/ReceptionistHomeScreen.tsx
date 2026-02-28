import React, { useCallback, useMemo, useState } from 'react';
import { Box, Text, HStack, VStack, ScrollView, Pressable, Badge, Icon, Avatar, Spinner, Button } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { getAllAppointments, updateAppointmentStatus } from '@/lib/api';
import { useAuth } from '../../screens/context/AuthContext';

type Appointment = {
  id: number;
  status: string;
  appointmentTime: string;
  disease?: string;
  patient?: {
    id?: number;
    fullName?: string;
  };
  doctor?: {
    id?: number;
    fullName?: string;
  };
};

const normalizeStatus = (status?: string) => {
  const value = String(status || '').toUpperCase();
  if (value === 'CHECK_IN') return 'CHECKED_IN';
  if (value === 'SCHEDULED') return 'PENDING';
  return value || 'PENDING';
};

const statusStyle = (status?: string) => {
  const normalized = normalizeStatus(status);
  if (normalized === 'PENDING') return { bg: 'yellow.100', color: 'yellow.700', label: 'Pending' };
  if (normalized === 'CHECKED_IN') return { bg: 'green.100', color: 'green.700', label: 'Checked In' };
  if (normalized === 'WAITING') return { bg: 'orange.100', color: 'orange.700', label: 'Waiting' };
  if (normalized === 'IN_PROGRESS') return { bg: 'blue.100', color: 'blue.700', label: 'In Progress' };
  if (normalized === 'COMPLETED') return { bg: 'gray.200', color: 'gray.700', label: 'Completed' };
  if (normalized === 'CANCELLED') return { bg: 'red.100', color: 'red.700', label: 'Cancelled' };
  return { bg: 'gray.100', color: 'gray.700', label: normalized };
};

export default function ReceptionistHomeScreen({ navigation }: any) {
  const { user } = useAuth();
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchAppointments = useCallback(async () => {
    setLoadingAppointments(true);
    try {
      const allAppointments = await getAllAppointments();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const filteredTodayAppointments = (allAppointments || []).filter((apt: Appointment) => {
        const aptDate = new Date(apt.appointmentTime);
        aptDate.setHours(0, 0, 0, 0);
        return aptDate.getTime() === today.getTime();
      });

      setTodayAppointments(filteredTodayAppointments);
    } catch (error) {
      console.error('Error fetching receptionist appointments:', error);
      setTodayAppointments([]);
    } finally {
      setLoadingAppointments(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAppointments();
    }, [fetchAppointments])
  );

  const statusCounts = useMemo(() => {
    const counts = {
      total: todayAppointments.length,
      pending: 0,
      checkedIn: 0,
      waiting: 0,
      inProgress: 0,
      completed: 0,
    };

    todayAppointments.forEach((apt) => {
      const status = normalizeStatus(apt.status);
      if (status === 'PENDING') counts.pending += 1;
      if (status === 'CHECKED_IN') counts.checkedIn += 1;
      if (status === 'WAITING') counts.waiting += 1;
      if (status === 'IN_PROGRESS') counts.inProgress += 1;
      if (status === 'COMPLETED') counts.completed += 1;
    });

    return counts;
  }, [todayAppointments]);

  const formatAppointmentTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const quickTransition = async (appointmentId: number, nextStatus: string) => {
    try {
      setUpdatingId(appointmentId);
      await updateAppointmentStatus(String(appointmentId), nextStatus);
      await fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment status:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <ScrollView flex={1} bg="gray.50">
      <Box bg="purple.600" pb={6} pt={4} px={4} borderBottomLeftRadius={24} borderBottomRightRadius={24}>
        <HStack justifyContent="space-between" alignItems="center" mb={6}>
          <VStack>
            <Text fontSize="sm" color="purple.100">Reception Desk</Text>
            <Text fontSize="2xl" fontWeight="bold" color="white">{user?.name || 'Receptionist'}</Text>
            <Text fontSize="sm" color="purple.100">Live appointment operations</Text>
          </VStack>
          <Pressable bg="purple.500" p={2} borderRadius="full" onPress={fetchAppointments}>
            <Icon as={MaterialIcons} name="refresh" size={5} color="white" />
          </Pressable>
        </HStack>

        {loadingAppointments ? (
          <HStack justifyContent="center" alignItems="center" h={100}>
            <Spinner color="white" size="lg" />
          </HStack>
        ) : (
          <HStack space={3} flexWrap="wrap">
            <Box flex={1} minW="45%" bg="white" p={4} borderRadius="xl" shadow={2}>
              <Text fontSize="2xl" fontWeight="bold" color="purple.600">{statusCounts.total}</Text>
              <Text fontSize="xs" color="gray.600">Total Today</Text>
            </Box>
            <Box flex={1} minW="45%" bg="white" p={4} borderRadius="xl" shadow={2}>
              <Text fontSize="2xl" fontWeight="bold" color="yellow.600">{statusCounts.pending}</Text>
              <Text fontSize="xs" color="gray.600">Pending</Text>
            </Box>
            <Box flex={1} minW="45%" bg="white" p={4} borderRadius="xl" shadow={2}>
              <Text fontSize="2xl" fontWeight="bold" color="green.600">{statusCounts.checkedIn}</Text>
              <Text fontSize="xs" color="gray.600">Checked In</Text>
            </Box>
            <Box flex={1} minW="45%" bg="white" p={4} borderRadius="xl" shadow={2}>
              <Text fontSize="2xl" fontWeight="bold" color="blue.600">{statusCounts.inProgress}</Text>
              <Text fontSize="xs" color="gray.600">In Progress</Text>
            </Box>
          </HStack>
        )}
      </Box>

      <Box p={4}>
        <Text fontSize="lg" fontWeight="bold" mb={4} color="gray.800">Quick Actions</Text>
        <HStack space={4} mb={4}>
          <Pressable flex={1} bg="white" p={6} borderRadius="2xl" shadow={1} onPress={() => navigation.navigate('CheckIn')}>
            <VStack alignItems="center" space={2}>
              <Box bg="purple.100" p={4} borderRadius="2xl">
                <Icon as={MaterialIcons} name="person-add" size={7} color="purple.600" />
              </Box>
              <Text fontWeight="semibold" textAlign="center" fontSize="sm">Check-In</Text>
            </VStack>
          </Pressable>

          <Pressable flex={1} bg="white" p={6} borderRadius="2xl" shadow={1} onPress={() => navigation.navigate('ReceptionistAppointments')}>
            <VStack alignItems="center" space={2}>
              <Box bg="blue.100" p={4} borderRadius="2xl">
                <Icon as={MaterialIcons} name="calendar-today" size={7} color="blue.600" />
              </Box>
              <Text fontWeight="semibold" textAlign="center" fontSize="sm">Appointments</Text>
            </VStack>
          </Pressable>
        </HStack>

        <HStack space={4}>
          <Pressable flex={1} bg="white" p={6} borderRadius="2xl" shadow={1} onPress={() => navigation.navigate('Billing')}>
            <VStack alignItems="center" space={2}>
              <Box bg="orange.100" p={4} borderRadius="2xl">
                <Icon as={MaterialIcons} name="payment" size={7} color="orange.600" />
              </Box>
              <Text fontWeight="semibold" textAlign="center" fontSize="sm">Billing</Text>
            </VStack>
          </Pressable>

          <Pressable flex={1} bg="white" p={6} borderRadius="2xl" shadow={1} onPress={() => navigation.navigate('PatientRegistry')}>
            <VStack alignItems="center" space={2}>
              <Box bg="green.100" p={4} borderRadius="2xl">
                <Icon as={MaterialIcons} name="people" size={7} color="green.600" />
              </Box>
              <Text fontWeight="semibold" textAlign="center" fontSize="sm">Patients</Text>
            </VStack>
          </Pressable>
        </HStack>
      </Box>

      <Box px={4} pb={24}>
        <HStack justifyContent="space-between" alignItems="center" mb={4}>
          <Text fontSize="lg" fontWeight="bold" color="gray.800">Today Appointments</Text>
          <Pressable onPress={() => navigation.navigate('ReceptionistAppointments')}>
            <Text fontSize="sm" fontWeight="semibold" color="purple.600">View All</Text>
          </Pressable>
        </HStack>

        {loadingAppointments ? (
          <Box alignItems="center" mt={4}>
            <Spinner size="lg" color="purple.600" />
            <Text mt={2} color="gray.600">Loading appointments...</Text>
          </Box>
        ) : todayAppointments.length > 0 ? (
          todayAppointments.slice(0, 8).map((apt) => {
            const status = normalizeStatus(apt.status);
            const style = statusStyle(status);
            return (
              <Box key={apt.id} bg="white" p={4} borderRadius="xl" shadow={1} mb={3}>
                <HStack space={3} alignItems="center">
                  <Avatar size="md" bg="purple.100">
                    {(apt.patient?.fullName || 'P').charAt(0).toUpperCase()}
                  </Avatar>
                  <VStack flex={1}>
                    <Text fontWeight="bold" fontSize="md">{apt.patient?.fullName || 'Unknown Patient'}</Text>
                    <Text fontSize="sm" color="gray.600">Dr. {apt.doctor?.fullName || 'Unknown Doctor'}</Text>
                    <HStack alignItems="center" space={1} mt={1}>
                      <Icon as={MaterialIcons} name="access-time" size={4} color="gray.500" />
                      <Text fontSize="sm" color="gray.500">{formatAppointmentTime(apt.appointmentTime)}</Text>
                    </HStack>
                  </VStack>
                  <Badge
                    bg={style.bg}
                    _text={{ color: style.color, fontWeight: 'semibold', fontSize: 'xs' }}
                    borderRadius="full"
                    px={3}
                    py={1}
                  >
                    {style.label}
                  </Badge>
                </HStack>

                <HStack mt={3} space={2}>
                  {(status === 'PENDING' || status === 'CHECKED_IN' || status === 'WAITING' || status === 'IN_PROGRESS') && (
                    <Button
                      size="sm"
                      variant="outline"
                      onPress={() => navigation.navigate('AppointmentDetails', { appointment: apt, appointmentId: apt.id })}
                    >
                      Manage
                    </Button>
                  )}

                  {status === 'PENDING' && (
                    <Button size="sm" bg="green.600" onPress={() => quickTransition(apt.id, 'CHECKED_IN')} isLoading={updatingId === apt.id}>
                      Check-In
                    </Button>
                  )}
                </HStack>
              </Box>
            );
          })
        ) : (
          <Box alignItems="center" mt={4}>
            <Text color="gray.600">No appointments scheduled for today.</Text>
          </Box>
        )}
      </Box>
    </ScrollView>
  );
}
