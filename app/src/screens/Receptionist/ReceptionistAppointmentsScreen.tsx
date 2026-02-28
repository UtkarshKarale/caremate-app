import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Text, HStack, VStack, ScrollView, Pressable, Badge, Icon, Avatar, Spinner } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { TextInput, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getAllAppointments } from '@/lib/api';

type Appointment = {
  id: number;
  status: string;
  appointmentTime: string;
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

const statusLabel = (status?: string) => {
  const normalized = normalizeStatus(status);
  if (normalized === 'CHECKED_IN') return 'Checked In';
  if (normalized === 'IN_PROGRESS') return 'In Progress';
  if (normalized === 'PARTIALLY_PAID') return 'Partially Paid';
  return normalized.charAt(0) + normalized.slice(1).toLowerCase();
};

const statusStyle = (status?: string) => {
  const normalized = normalizeStatus(status);
  if (normalized === 'PENDING') return { bg: 'yellow.100', color: 'yellow.800' };
  if (normalized === 'CHECKED_IN') return { bg: 'green.100', color: 'green.800' };
  if (normalized === 'WAITING') return { bg: 'orange.100', color: 'orange.800' };
  if (normalized === 'IN_PROGRESS') return { bg: 'blue.100', color: 'blue.800' };
  if (normalized === 'COMPLETED') return { bg: 'gray.200', color: 'gray.800' };
  if (normalized === 'CANCELLED') return { bg: 'red.100', color: 'red.800' };
  return { bg: 'gray.100', color: 'gray.800' };
};

export default function ReceptionistAppointmentsScreen({ navigation }: any) {
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filters = ['All', 'PENDING', 'CHECKED_IN', 'WAITING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

  const fetchAppointments = useCallback(async () => {
    setLoadingAppointments(true);
    try {
      const data = await getAllAppointments();
      setAllAppointments((data || []) as Appointment[]);
    } catch (error) {
      console.error('Error fetching all appointments:', error);
      setAllAppointments([]);
    } finally {
      setLoadingAppointments(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  useFocusEffect(
    useCallback(() => {
      fetchAppointments();
    }, [fetchAppointments])
  );

  const filteredAppointments = useMemo(() => {
    let result = [...allAppointments];

    if (selectedFilter !== 'All') {
      result = result.filter((apt) => normalizeStatus(apt.status) === selectedFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (apt) =>
          (apt.patient?.fullName || '').toLowerCase().includes(query) ||
          (apt.doctor?.fullName || '').toLowerCase().includes(query)
      );
    }

    return result;
  }, [allAppointments, selectedFilter, searchQuery]);

  const formatAppointmentTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    return date.toLocaleString('en-US', options);
  };

  return (
    <Box flex={1} bg="gray.50">
      <Box bg="purple.600" pb={6} pt={4} px={4} borderBottomLeftRadius={24} borderBottomRightRadius={24}>
        <HStack alignItems="center" mb={3}>
          <Pressable mr={3} onPress={() => navigation.goBack()}>
            <Icon as={MaterialIcons} name="arrow-back" size={6} color="white" />
          </Pressable>
          <VStack flex={1}>
            <Text mt={5} fontSize="2xl" fontWeight="bold" color="white">Appointments</Text>
            <Text fontSize="sm" color="purple.100">Manage and update patient flow</Text>
          </VStack>
        </HStack>
      </Box>

      <Box p={4}>
        <View style={styles.inputContainer}>
          <Icon as={MaterialIcons} name="search" size={5} color="gray.400" style={styles.inputIcon} />
          <TextInput
            placeholder="Search patient or doctor"
            style={styles.input}
            value={searchQuery}
            onChangeText={setSearchQuery}
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
                borderWidth={selectedFilter === filter ? 0 : 1}
                borderColor="gray.200"
                shadow={selectedFilter === filter ? 2 : 0}
              >
                <Text fontWeight="semibold" fontSize="sm" color={selectedFilter === filter ? 'white' : 'gray.700'}>
                  {statusLabel(filter)}
                </Text>
              </Pressable>
            ))}
          </HStack>
        </ScrollView>
      </Box>

      {loadingAppointments ? (
        <VStack flex={1} justifyContent="center" alignItems="center">
          <Spinner size="lg" color="purple.600" />
          <Text mt={2} color="gray.500">Loading appointments...</Text>
        </VStack>
      ) : (
        <ScrollView flex={1} px={4} showsVerticalScrollIndicator={false}>
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((apt) => {
              const style = statusStyle(apt.status);
              return (
                <Pressable
                  key={apt.id}
                  onPress={() => navigation.navigate('AppointmentDetails', { appointment: apt, appointmentId: apt.id })}
                >
                  <Box bg="white" borderRadius="xl" shadow={2} p={4} mb={4}>
                    <HStack space={3} alignItems="center">
                      <Avatar bg="purple.100" size="md">
                        <Text color="purple.600" fontWeight="bold">
                          {(apt.patient?.fullName || 'P').charAt(0).toUpperCase()}
                        </Text>
                      </Avatar>
                      <VStack flex={1}>
                        <Text fontWeight="bold" fontSize="md">{apt.patient?.fullName || 'Unknown Patient'}</Text>
                        <Text fontSize="sm" color="gray.600">Dr. {apt.doctor?.fullName || 'Unknown Doctor'}</Text>
                        <HStack alignItems="center" space={1} mt={1}>
                          <Icon as={MaterialIcons} name="access-time" size={4} color="gray.500" />
                          <Text fontSize="sm" color="gray.500">{formatAppointmentTime(apt.appointmentTime)}</Text>
                        </HStack>
                      </VStack>
                      <VStack alignItems="flex-end" space={2}>
                        <Badge
                          bg={style.bg}
                          _text={{ color: style.color, fontWeight: 'semibold', fontSize: 'xs' }}
                          borderRadius="full"
                          px={3}
                          py={1}
                        >
                          {statusLabel(apt.status)}
                        </Badge>
                        <Icon as={MaterialIcons} name="chevron-right" size={6} color="gray.400" />
                      </VStack>
                    </HStack>
                  </Box>
                </Pressable>
              );
            })
          ) : (
            <VStack flex={1} justifyContent="center" alignItems="center" mt={10}>
              <Icon as={MaterialIcons} name="event-busy" size={16} color="gray.300" />
              <Text mt={4} fontSize="lg" color="gray.500">No appointments found</Text>
              <Text fontSize="sm" color="gray.400">Try another filter or search.</Text>
            </VStack>
          )}
        </ScrollView>
      )}
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
