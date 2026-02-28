import React, { useMemo, useState, useCallback } from 'react';
import { Box, Text, HStack, VStack, ScrollView, Pressable, Badge, Icon, Avatar, Spinner } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { TextInput, StyleSheet, View } from 'react-native';
import { useAuth } from '@/app/src/screens/context/AuthContext';
import { getAppointmentsByDoctor } from '@/lib/api';
import { useFocusEffect } from '@react-navigation/native';

const normalizeStatus = (status?: string) => {
  const value = String(status || '').toUpperCase();
  if (value === 'SCHEDULED') return 'PENDING';
  if (value === 'CHECK_IN') return 'CHECKED_IN';
  return value || 'PENDING';
};

const statusBadge = (status?: string) => {
  const normalized = normalizeStatus(status);
  if (normalized === 'COMPLETED') return { bg: 'green.100', color: 'green.700' };
  if (normalized === 'CANCELLED') return { bg: 'red.100', color: 'red.700' };
  if (normalized === 'IN_PROGRESS') return { bg: 'blue.100', color: 'blue.700' };
  if (normalized === 'WAITING') return { bg: 'yellow.100', color: 'yellow.700' };
  return { bg: 'purple.100', color: 'purple.700' };
};

const isTerminalStatus = (status?: string) => {
  const normalized = normalizeStatus(status);
  return normalized === 'COMPLETED' || normalized === 'CANCELLED';
};

export default function DoctorAppointmentsScreen({ navigation }: any) {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('Upcoming');
  const [searchQuery, setSearchQuery] = useState('');

  const filters = ['Upcoming', 'Today', 'History', 'Cancelled'];

  const fetchAppointments = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getAppointmentsByDoctor(user.id);
      setAppointments(data || []);
    } catch (err) {
      setError('Failed to load appointments.');
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      fetchAppointments();
    }, [fetchAppointments])
  );

  const filteredAppointments = useMemo(() => {
    const now = Date.now();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    let result = [...appointments];

    if (selectedFilter === 'Upcoming') {
      result = result.filter((apt) => new Date(apt.appointmentTime).getTime() > now && !isTerminalStatus(apt.status));
    }
    if (selectedFilter === 'Today') {
      result = result.filter((apt) => {
        const time = new Date(apt.appointmentTime).getTime();
        return time >= today.getTime() && time < tomorrow.getTime() && !isTerminalStatus(apt.status);
      });
    }
    if (selectedFilter === 'History') {
      result = result.filter((apt) => new Date(apt.appointmentTime).getTime() <= now || isTerminalStatus(apt.status));
    }
    if (selectedFilter === 'Cancelled') {
      result = result.filter((apt) => normalizeStatus(apt.status) === 'CANCELLED');
    }

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter((apt) => {
        const patient = String(apt.patient?.fullName || '').toLowerCase();
        const reason = String(apt.disease || '').toLowerCase();
        const status = String(normalizeStatus(apt.status) || '').toLowerCase();
        return patient.includes(query) || reason.includes(query) || status.includes(query);
      });
    }

    return result.sort((a, b) => new Date(a.appointmentTime).getTime() - new Date(b.appointmentTime).getTime());
  }, [appointments, selectedFilter, searchQuery]);

  const formatAppointmentTime = (timestamp: string) =>
    new Date(timestamp).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  const formatAppointmentDate = (timestamp: string) =>
    new Date(timestamp).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });

  const renderContent = () => {
    if (loading) {
      return (
        <VStack flex={1} justifyContent="center" alignItems="center">
          <Spinner size="lg" />
        </VStack>
      );
    }

    if (error) {
      return (
        <VStack flex={1} justifyContent="center" alignItems="center">
          <Text color="red.500">{error}</Text>
        </VStack>
      );
    }

    if (filteredAppointments.length === 0) {
      return (
        <VStack flex={1} justifyContent="center" alignItems="center">
          <Text>No appointments found.</Text>
        </VStack>
      );
    }

    return (
      <ScrollView flex={1} px={4} showsVerticalScrollIndicator={false}>
        {filteredAppointments.map((apt: any) => {
          const badge = statusBadge(apt.status);
          const normalized = normalizeStatus(apt.status);
          return (
            <Pressable key={apt.id} onPress={() => navigation.navigate('DoctorAppointmentDetails', { appointment: apt })}>
              <Box bg="white" borderRadius="xl" shadow={2} p={4} mb={4}>
                <HStack space={3} alignItems="center">
                  <Avatar bg="blue.100" size="lg">
                    <Text color="blue.600" fontWeight="bold" fontSize="2xl">
                      {(apt.patient?.fullName || 'P').charAt(0).toUpperCase()}
                    </Text>
                  </Avatar>
                  <VStack flex={1}>
                    <Text fontWeight="bold" fontSize="md">{apt.patient?.fullName || 'Unknown Patient'}</Text>
                    <Text fontSize="sm" color="gray.600">{apt.disease || 'N/A'}</Text>
                    <HStack alignItems="center" space={2} mt={1}>
                      <HStack alignItems="center" space={1}>
                        <Icon as={MaterialIcons} name="access-time" size={4} color="gray.500" />
                        <Text fontSize="sm" color="gray.500">{formatAppointmentTime(apt.appointmentTime)}</Text>
                      </HStack>
                      <Text fontSize="sm" color="gray.400">•</Text>
                      <Text fontSize="sm" color="gray.500">{formatAppointmentDate(apt.appointmentTime)}</Text>
                    </HStack>
                  </VStack>
                  <VStack alignItems="flex-end" space={2}>
                    <Badge bg={badge.bg} _text={{ color: badge.color, fontWeight: 'semibold', fontSize: 'xs' }}>
                      {normalized}
                    </Badge>
                    <Icon as={MaterialIcons} name="chevron-right" size={6} color="gray.400" />
                  </VStack>
                </HStack>
              </Box>
            </Pressable>
          );
        })}
      </ScrollView>
    );
  };

  return (
    <Box flex={1} bg="gray.50">
      <Box bg="green.600" pb={6} pt={4} px={4} borderBottomLeftRadius={24} borderBottomRightRadius={24}>
        <HStack alignItems="center" mb={3}>
          <Pressable mr={3} onPress={() => navigation.goBack()}>
            <Icon as={MaterialIcons} name="arrow-back" size={6} color="white" />
          </Pressable>
          <VStack flex={1}>
            <Text mt={5} fontSize="2xl" fontWeight="bold" color="white">Appointments</Text>
            <Text fontSize="sm" color="green.100">Upcoming and history records</Text>
          </VStack>
        </HStack>
      </Box>

      <Box p={4}>
        <View style={styles.inputContainer}>
          <Icon as={MaterialIcons} name="search" size={5} color="gray.400" style={styles.inputIcon} />
          <TextInput placeholder="Search patient, reason, status..." style={styles.input} value={searchQuery} onChangeText={setSearchQuery} />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <HStack space={2}>
            {filters.map((filter) => (
              <Pressable
                key={filter}
                onPress={() => setSelectedFilter(filter)}
                bg={selectedFilter === filter ? 'green.600' : 'white'}
                px={4}
                py={2}
                borderRadius="full"
                borderWidth={selectedFilter === filter ? 0 : 1}
                borderColor="gray.200"
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

      {renderContent()}
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
    shadowOffset: { width: 0, height: 1 },
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
