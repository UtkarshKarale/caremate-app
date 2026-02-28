import React, { useCallback, useMemo, useState } from 'react';
import { Box, Text, HStack, VStack, ScrollView, Pressable, Badge, Icon, Spinner } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/app/src/screens/context/AuthContext';
import { getUserAppointments } from '@/lib/api';
import { useFocusEffect } from '@react-navigation/native';

const normalizeStatus = (status?: string) => {
  const value = String(status || '').toUpperCase();
  if (value === 'SCHEDULED') return 'PENDING';
  if (value === 'CHECK_IN') return 'CHECKED_IN';
  return value || 'PENDING';
};

const isTerminalStatus = (status?: string) => {
  const normalized = normalizeStatus(status);
  return normalized === 'COMPLETED' || normalized === 'CANCELLED';
};

export default function HomeScreen({ navigation }: any) {
  const { user, isLoading } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);

  const fetchAppointments = useCallback(async () => {
    if (isLoading || !user?.id) {
      if (!isLoading) setLoadingAppointments(false);
      return;
    }

    try {
      setLoadingAppointments(true);
      const data = await getUserAppointments(user.id);
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setAppointments([]);
    } finally {
      setLoadingAppointments(false);
    }
  }, [isLoading, user?.id]);

  useFocusEffect(
    useCallback(() => {
      fetchAppointments();
    }, [fetchAppointments])
  );

  const { upcomingAppointments, appointmentHistory } = useMemo(() => {
    const now = Date.now();
    const upcoming = (appointments || [])
      .filter((apt) => new Date(apt.appointmentTime).getTime() > now && !isTerminalStatus(apt.status))
      .sort((a, b) => new Date(a.appointmentTime).getTime() - new Date(b.appointmentTime).getTime());

    const history = (appointments || [])
      .filter((apt) => new Date(apt.appointmentTime).getTime() <= now || isTerminalStatus(apt.status))
      .sort((a, b) => new Date(b.appointmentTime).getTime() - new Date(a.appointmentTime).getTime());

    return { upcomingAppointments: upcoming, appointmentHistory: history };
  }, [appointments]);

  const latestUpcomingAppointment = upcomingAppointments.length > 0 ? upcomingAppointments[0] : null;

  const formatAppointmentTime = (timestamp: string) =>
    new Date(timestamp).toLocaleString('en-US', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true });

  const statusStyle = (status?: string) => {
    const normalized = normalizeStatus(status);
    if (normalized === 'COMPLETED') return { bg: 'green.100', color: 'green.700' };
    if (normalized === 'CANCELLED') return { bg: 'red.100', color: 'red.700' };
    if (normalized === 'CHECKED_IN') return { bg: 'purple.100', color: 'purple.700' };
    return { bg: 'blue.100', color: 'blue.700' };
  };

  return (
    <ScrollView flex={1} bg="gray.50">
      <Box bg="blue.600" pb={6} pt={4} px={4} borderBottomLeftRadius={24} borderBottomRightRadius={24}>
        <HStack mt={4} justifyContent="space-between" alignItems="center" mb={6}>
          <Box>
            <Text fontSize="2xl" fontWeight="bold" color="white">Hello, {user?.name || user?.fullName || 'Patient'}</Text>
            <Text fontSize="sm" color="blue.100">Welcome back!</Text>
          </Box>
          <HStack space={2}>
            <Pressable bg="blue.500" p={2} borderRadius="full">
              <Icon as={MaterialIcons} name="notifications" size={5} color="white" />
            </Pressable>
            <Pressable bg="blue.500" p={2} borderRadius="full">
              <Icon as={MaterialIcons} name="settings" size={5} color="white" />
            </Pressable>
          </HStack>
        </HStack>

        {loadingAppointments ? (
          <Box bg="white" p={4} borderRadius="xl" shadow={2} alignItems="center">
            <Spinner size="lg" color="blue.600" />
            <Text mt={2} color="gray.600">Loading appointments...</Text>
          </Box>
        ) : latestUpcomingAppointment ? (
          <Box bg="white" p={4} borderRadius="xl" shadow={2}>
            <HStack space={3} alignItems="center">
              <Box bg="blue.100" p={3} borderRadius="full">
                <Icon as={MaterialIcons} name="person" size={6} color="blue.600" />
              </Box>
              <VStack flex={1}>
                <Text fontSize="xs" fontWeight="semibold" color="gray.600">Your Next Appointment</Text>
                <Text fontSize="md" fontWeight="bold" mt={1}>Dr. {latestUpcomingAppointment.doctor?.fullName || 'Unknown'}</Text>
                <HStack space={2} mt={1} alignItems="center">
                  <Icon as={MaterialIcons} name="calendar-today" size={4} color="gray.500" />
                  <Text fontSize="sm" color="gray.600">{formatAppointmentTime(latestUpcomingAppointment.appointmentTime)}</Text>
                </HStack>
                <HStack space={2} mt={1} alignItems="center">
                  <Icon as={MaterialIcons} name="medical-services" size={4} color="gray.500" />
                  <Text fontSize="sm" color="gray.600">Reason: {latestUpcomingAppointment.disease || 'N/A'}</Text>
                </HStack>
              </VStack>
            </HStack>
          </Box>
        ) : (
          <Box bg="white" p={4} borderRadius="xl" shadow={2} alignItems="center">
            <Text color="gray.600">No upcoming appointments.</Text>
          </Box>
        )}
      </Box>

      <Box p={4}>
        <Text fontSize="lg" fontWeight="bold" mb={4} color="gray.800">Quick Actions</Text>
        <HStack space={4} mb={4}>
          <Pressable flex={1} bg="white" p={6} borderRadius="2xl" shadow={1} onPress={() => navigation.navigate('DoctorSelection')}>
            <VStack alignItems="center" space={2}>
              <Box bg="blue.100" p={4} borderRadius="2xl">
                <Icon as={MaterialIcons} name="calendar-today" size={7} color="blue.600" />
              </Box>
              <Text fontWeight="semibold" textAlign="center">Book Appointment</Text>
            </VStack>
          </Pressable>

          <Pressable flex={1} bg="white" p={6} borderRadius="2xl" shadow={1} onPress={() => navigation.navigate('DoctorSelection')}>
            <VStack alignItems="center" space={2}>
              <Box bg="green.100" p={4} borderRadius="2xl">
                <Icon as={MaterialIcons} name="medical-services" size={7} color="green.600" />
              </Box>
              <Text fontWeight="semibold" textAlign="center">Find Doctor</Text>
            </VStack>
          </Pressable>
        </HStack>

        <HStack space={4}>
          <Pressable flex={1} bg="white" p={6} borderRadius="2xl" shadow={1} onPress={() => navigation.navigate('Records')}>
            <VStack alignItems="center" space={2}>
              <Box bg="purple.100" p={4} borderRadius="2xl">
                <Icon as={MaterialIcons} name="folder" size={7} color="purple.600" />
              </Box>
              <Text fontWeight="semibold" textAlign="center">My Records</Text>
            </VStack>
          </Pressable>

          <Pressable flex={1} bg="white" p={6} borderRadius="2xl" shadow={1}>
            <VStack alignItems="center" space={2}>
              <Box bg="orange.100" p={4} borderRadius="2xl">
                <Icon as={MaterialIcons} name="phone" size={7} color="orange.600" />
              </Box>
              <Text fontWeight="semibold" textAlign="center">Emergency</Text>
            </VStack>
          </Pressable>
        </HStack>
      </Box>

      <Box px={4} pb={24}>
        <HStack justifyContent="space-between" alignItems="center" mb={4}>
          <Text fontSize="lg" fontWeight="bold" color="gray.800">Appointment History</Text>
          <Text fontSize="sm" fontWeight="semibold" color="blue.600">{appointmentHistory.length} Records</Text>
        </HStack>

        {loadingAppointments ? (
          <Box alignItems="center" mt={4}>
            <Spinner size="lg" color="blue.600" />
            <Text mt={2} color="gray.600">Loading history...</Text>
          </Box>
        ) : appointmentHistory.length > 0 ? (
          appointmentHistory.map((apt) => {
            const style = statusStyle(apt.status);
            return (
              <Box key={apt.id} bg="white" p={4} borderRadius="xl" shadow={1} mb={3}>
                <HStack justifyContent="space-between" alignItems="flex-start">
                  <VStack flex={1}>
                    <Text fontWeight="bold" fontSize="md">Dr. {apt.doctor?.fullName || 'Unknown'}</Text>
                    <Text fontSize="sm" color="gray.600">{apt.doctor?.specialist || 'General'}</Text>
                    <HStack alignItems="center" space={1} mt={2}>
                      <Icon as={MaterialIcons} name="access-time" size={4} color="gray.500" />
                      <Text fontSize="sm" color="gray.500">{formatAppointmentTime(apt.appointmentTime)}</Text>
                    </HStack>
                    <HStack alignItems="center" space={1} mt={2}>
                      <Icon as={MaterialIcons} name="medical-services" size={4} color="gray.500" />
                      <Text fontSize="sm" color="gray.600">Reason: {apt.disease || 'N/A'}</Text>
                    </HStack>
                  </VStack>
                  <Badge bg={style.bg} _text={{ color: style.color, fontWeight: 'semibold', fontSize: 'xs' }} borderRadius="full" px={3} py={1}>
                    {normalizeStatus(apt.status)}
                  </Badge>
                </HStack>
              </Box>
            );
          })
        ) : (
          <Box alignItems="center" mt={4}>
            <Text color="gray.600">No appointment history found.</Text>
          </Box>
        )}
      </Box>
    </ScrollView>
  );
}
