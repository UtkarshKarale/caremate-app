import React, { useEffect, useMemo, useState } from 'react';
import { Box, Text, VStack, HStack, ScrollView, Pressable, Icon, Button, Spinner } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { Alert, StyleSheet, TextInput, View } from 'react-native';
import { getAllAppointments, updateAppointmentStatus } from '@/lib/api';

type Appointment = {
  id: number;
  status: string;
  appointmentTime: string;
  disease?: string;
  patient?: {
    id?: number;
    fullName?: string;
    mobile?: string;
  };
  doctor?: {
    id?: number;
    fullName?: string;
  };
};

export default function CheckInScreen({ navigation }: any) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchTodayAppointments = async () => {
    setLoading(true);
    try {
      const all = await getAllAppointments();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todays = (all || []).filter((apt: Appointment) => {
        const aptDate = new Date(apt.appointmentTime);
        aptDate.setHours(0, 0, 0, 0);
        return aptDate.getTime() === today.getTime();
      });

      const checkInCandidates = todays.filter(
        (apt: Appointment) => apt.status === 'PENDING' || apt.status === 'SCHEDULED' || apt.status === 'CHECK_IN'
      );

      setAppointments(checkInCandidates);
    } catch (error) {
      console.error('Error fetching check-in appointments:', error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayAppointments();
  }, []);

  const filteredAppointments = useMemo(() => {
    if (!searchQuery.trim()) {
      return appointments;
    }

    const query = searchQuery.toLowerCase();
    return appointments.filter((apt) =>
      (apt.patient?.fullName || '').toLowerCase().includes(query) ||
      (apt.doctor?.fullName || '').toLowerCase().includes(query)
    );
  }, [appointments, searchQuery]);

  const selectedAppointment = appointments.find((apt) => apt.id === selectedAppointmentId) || null;

  const handleCheckIn = async () => {
    if (!selectedAppointmentId) {
      Alert.alert('Select Appointment', 'Please select an appointment for check-in.');
      return;
    }

    try {
      setSaving(true);
      await updateAppointmentStatus(selectedAppointmentId.toString(), 'CHECKED_IN');
      Alert.alert('Success', 'Patient checked in successfully.');
      await fetchTodayAppointments();
      setSelectedAppointmentId(null);
      navigation.goBack();
    } catch (error) {
      console.error('Check-in failed:', error);
      Alert.alert('Error', 'Failed to check in patient.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box flex={1} bg="gray.50">
      <Box bg="purple.600" pb={6} pt={4} px={4} borderBottomLeftRadius={24} borderBottomRightRadius={24}>
        <HStack alignItems="center" mb={3}>
          <Pressable mr={3} onPress={() => navigation.goBack()}>
            <Icon as={MaterialIcons} name="arrow-back" size={6} color="white" />
          </Pressable>
          <VStack flex={1}>
            <Text fontSize="2xl" fontWeight="bold" color="white">Check-In Patient</Text>
            <Text fontSize="sm" color="purple.100">Live appointments for today</Text>
          </VStack>
        </HStack>
      </Box>

      <ScrollView flex={1} px={4} py={4}>
        <Box bg="white" borderRadius="xl" shadow={1} p={6} mb={4}>
          <Text fontSize="md" fontWeight="bold" mb={3}>Search Appointment</Text>
          <View style={styles.inputContainer}>
            <Icon as={MaterialIcons} name="search" size={5} color="gray.400" mr={2} />
            <TextInput
              placeholder="Search patient or doctor"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.input}
            />
          </View>
        </Box>

        <Box bg="white" borderRadius="xl" shadow={1} p={6} mb={4}>
          <Text fontSize="md" fontWeight="bold" mb={3}>Today Check-In Queue</Text>
          {loading ? (
            <HStack alignItems="center" space={2}>
              <Spinner color="purple.600" size="sm" />
              <Text color="gray.500">Loading appointments...</Text>
            </HStack>
          ) : filteredAppointments.length === 0 ? (
            <Text color="gray.500">No pending/scheduled appointments found for today.</Text>
          ) : (
            <VStack space={2}>
              {filteredAppointments.map((apt) => {
                const selected = selectedAppointmentId === apt.id;
                return (
                  <Pressable key={apt.id} onPress={() => setSelectedAppointmentId(apt.id)}>
                    <Box
                      bg={selected ? 'purple.50' : 'gray.50'}
                      borderRadius="lg"
                      p={3}
                      borderWidth={selected ? 2 : 1}
                      borderColor={selected ? 'purple.600' : 'gray.200'}
                    >
                      <HStack justifyContent="space-between" alignItems="center">
                        <VStack flex={1}>
                          <Text fontWeight="semibold">{apt.patient?.fullName || 'Unknown Patient'}</Text>
                          <Text fontSize="sm" color="gray.600">Dr. {apt.doctor?.fullName || 'Unknown Doctor'}</Text>
                          <Text fontSize="xs" color="purple.600" mt={1}>
                            {new Date(apt.appointmentTime).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true,
                            })}
                          </Text>
                        </VStack>
                        {selected && <Icon as={MaterialIcons} name="check-circle" size={6} color="purple.600" />}
                      </HStack>
                    </Box>
                  </Pressable>
                );
              })}
            </VStack>
          )}
        </Box>

        {selectedAppointment && (
          <Box bg="white" borderRadius="xl" shadow={1} p={6} mb={4}>
            <Text fontSize="md" fontWeight="bold" mb={3}>Selected Appointment</Text>
            <Text fontWeight="semibold">Patient: {selectedAppointment.patient?.fullName || 'N/A'}</Text>
            <Text color="gray.600">Doctor: Dr. {selectedAppointment.doctor?.fullName || 'N/A'}</Text>
            <Text color="gray.600">Reason: {selectedAppointment.disease || 'N/A'}</Text>
          </Box>
        )}

        <Button
          bg="purple.600"
          borderRadius="xl"
          py={4}
          mb={6}
          isDisabled={!selectedAppointmentId || saving}
          isLoading={saving}
          onPress={handleCheckIn}
          _pressed={{ bg: 'purple.700' }}
        >
          <Text color="white" fontSize="md" fontWeight="bold">Complete Check-In</Text>
        </Button>
      </ScrollView>
    </Box>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
  },
});
