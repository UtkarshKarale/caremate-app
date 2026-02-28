import React, { useCallback, useMemo, useState } from 'react';
import { Box, Text, HStack, VStack, ScrollView, Pressable, Icon, Avatar, Badge, Spinner } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { TextInput, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getAllAppointments, getAllUsers } from '@/lib/api';

type User = {
  id: number;
  fullName?: string;
  phoneNumber?: string;
  email?: string;
  roles?: string[];
};

type Appointment = {
  appointmentTime?: string;
  status?: string;
  patient?: {
    id?: number;
  };
};

export default function PatientRegistryScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState<User[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [usersData, appointmentsData] = await Promise.all([getAllUsers(), getAllAppointments()]);
      const patientUsers = (usersData || []).filter((user: User) => (user.roles || []).includes('PATIENT'));
      setPatients(patientUsers);
      setAppointments((appointmentsData || []) as Appointment[]);
    } catch (error) {
      console.error('Error fetching patient registry data:', error);
      setPatients([]);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const lastVisitByPatientId = useMemo(() => {
    const map: Record<number, string> = {};

    appointments.forEach((apt) => {
      const patientId = apt.patient?.id;
      if (!patientId || !apt.appointmentTime) {
        return;
      }

      if (!map[patientId] || new Date(apt.appointmentTime).getTime() > new Date(map[patientId]).getTime()) {
        map[patientId] = apt.appointmentTime;
      }
    });

    return map;
  }, [appointments]);

  const filteredPatients = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return patients;
    }

    return patients.filter((patient) =>
      (patient.fullName || '').toLowerCase().includes(query) ||
      (patient.phoneNumber || '').toLowerCase().includes(query) ||
      (patient.email || '').toLowerCase().includes(query)
    );
  }, [patients, searchQuery]);

  const formatLastVisit = (timestamp?: string) => {
    if (!timestamp) return 'No visits yet';
    return new Date(timestamp).toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
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
            <Text mt={5} fontSize="2xl" fontWeight="bold" color="white">Patient Registry</Text>
            <Text fontSize="sm" color="purple.100">
              {loading ? 'Loading patients...' : `${patients.length} Registered Patients`}
            </Text>
          </VStack>
          <Pressable bg="purple.500" p={2} borderRadius="full" onPress={() => fetchData()}>
            <Icon as={MaterialIcons} name="refresh" size={6} color="white" />
          </Pressable>
        </HStack>
      </Box>

      <Box p={4}>
        <View style={styles.inputContainer}>
          <Icon as={MaterialIcons} name="search" size={5} color="gray.400" style={styles.inputIcon} />
          <TextInput
            placeholder="Search by patient name, phone, or email"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.input}
          />
        </View>
      </Box>

      <ScrollView flex={1} px={4} showsVerticalScrollIndicator={false}>
        {loading ? (
          <VStack alignItems="center" mt={12}>
            <Spinner size="lg" color="purple.600" />
            <Text mt={3} color="gray.500">Loading patient registry...</Text>
          </VStack>
        ) : filteredPatients.length > 0 ? (
          filteredPatients.map((patient) => {
            const lastVisit = lastVisitByPatientId[patient.id];
            const hasVisit = Boolean(lastVisit);
            return (
              <Pressable key={patient.id}>
                <Box bg="white" borderRadius="xl" shadow={2} p={4} mb={4}>
                  <HStack space={4} alignItems="center">
                    <Avatar bg="purple.100" size="lg">
                      <Text color="purple.700" fontWeight="bold">
                        {(patient.fullName || 'P').charAt(0).toUpperCase()}
                      </Text>
                    </Avatar>
                    <VStack flex={1}>
                      <HStack justifyContent="space-between" alignItems="center" mb={1}>
                        <Text fontWeight="bold" fontSize="md">{patient.fullName || 'Unknown Patient'}</Text>
                        <Badge
                          bg={hasVisit ? 'green.100' : 'gray.100'}
                          _text={{
                            color: hasVisit ? 'green.700' : 'gray.700',
                            fontWeight: 'semibold',
                            fontSize: 'xs',
                          }}
                          borderRadius="full"
                          px={3}
                          py={1}
                        >
                          {hasVisit ? 'Active' : 'New'}
                        </Badge>
                      </HStack>
                      <HStack alignItems="center" space={1} mb={1}>
                        <Icon as={MaterialIcons} name="phone" size={4} color="gray.500" />
                        <Text fontSize="sm" color="gray.600">{patient.phoneNumber || 'Phone not available'}</Text>
                      </HStack>
                      <HStack alignItems="center" space={1}>
                        <Icon as={MaterialIcons} name="access-time" size={4} color="gray.500" />
                        <Text fontSize="sm" color="gray.500">Last visit: {formatLastVisit(lastVisit)}</Text>
                      </HStack>
                    </VStack>
                    <Icon as={MaterialIcons} name="chevron-right" size={6} color="gray.400" />
                  </HStack>
                </Box>
              </Pressable>
            );
          })
        ) : (
          <VStack alignItems="center" mt={10} px={4}>
            <Icon as={MaterialIcons} name="groups" size={16} color="gray.300" />
            <Text mt={4} fontSize="lg" color="gray.500">No patients found</Text>
            <Text mt={1} fontSize="sm" color="gray.400" textAlign="center">
              Try a different search or add patients from registration flow.
            </Text>
          </VStack>
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
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
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
