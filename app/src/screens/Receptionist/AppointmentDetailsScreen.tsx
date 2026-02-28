import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Text, VStack, HStack, Avatar, Icon, useToast, Pressable, Button, Spinner, ScrollView } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { getAppointmentById, updateAppointmentStatus } from '@/lib/api';
import { useFocusEffect } from '@react-navigation/native';

const STATUS_OPTIONS = ['PENDING', 'CHECKED_IN', 'COMPLETED', 'CANCELLED'];

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
  return normalized.charAt(0) + normalized.slice(1).toLowerCase();
};

const statusColor = (status?: string) => {
  const normalized = normalizeStatus(status);
  if (normalized === 'PENDING') return 'yellow.600';
  if (normalized === 'CHECKED_IN') return 'green.600';
  if (normalized === 'WAITING') return 'orange.600';
  if (normalized === 'IN_PROGRESS') return 'blue.600';
  if (normalized === 'COMPLETED') return 'gray.700';
  if (normalized === 'CANCELLED') return 'red.600';
  return 'gray.600';
};

export default function AppointmentDetailsScreen({ route, navigation }: any) {
  const appointmentFromParams = route?.params?.appointment;
  const appointmentId = route?.params?.appointmentId || appointmentFromParams?.id;
  const toast = useToast();

  const [appointment, setAppointment] = useState<any>(appointmentFromParams || null);
  const [selectedStatus, setSelectedStatus] = useState<string>(normalizeStatus(appointmentFromParams?.status));
  const [loading, setLoading] = useState(!appointmentFromParams);
  const [saving, setSaving] = useState(false);

  const loadAppointment = useCallback(async () => {
    if (!appointmentId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const latest = await getAppointmentById(String(appointmentId));
      setAppointment(latest);
      setSelectedStatus(normalizeStatus(latest?.status));
    } catch (error) {
      console.error('Error loading appointment details:', error);
      if (!appointmentFromParams) {
        toast.show({ description: 'Failed to load appointment details.' });
      }
    } finally {
      setLoading(false);
    }
  }, [appointmentId, appointmentFromParams, toast]);

  useEffect(() => {
    if (!appointmentFromParams && appointmentId) {
      loadAppointment();
    } else if (appointmentFromParams) {
      setAppointment(appointmentFromParams);
      setSelectedStatus(normalizeStatus(appointmentFromParams.status));
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [appointmentFromParams, appointmentId, loadAppointment]);

  useFocusEffect(
    useCallback(() => {
      if (appointmentId) {
        loadAppointment();
      }
    }, [appointmentId, loadAppointment])
  );

  const formatAppointmentTime = (timestamp?: string) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const currentStatus = useMemo(() => normalizeStatus(appointment?.status), [appointment?.status]);

  const handleStatusUpdate = async () => {
    if (!appointment?.id) {
      toast.show({ description: 'Appointment ID missing. Please reload this screen.' });
      return;
    }

    try {
      setSaving(true);
      toast.show({ description: `Updating status to ${statusLabel(selectedStatus)}...` });
      await updateAppointmentStatus(String(appointment.id), selectedStatus);
      await loadAppointment();
      toast.show({ description: `Appointment status updated to ${statusLabel(selectedStatus)}.` });
    } catch (error) {
      console.error('Error updating appointment:', error);
      // @ts-ignore
      const backendError = error?.response?.data?.message || error?.response?.data || error?.message;
      toast.show({ description: `Failed to update appointment status. ${String(backendError || '')}` });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" bg="gray.50">
        <Spinner size="lg" color="purple.600" />
        <Text mt={2} color="gray.500">Loading appointment details...</Text>
      </Box>
    );
  }

  if (!appointment) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" bg="gray.50" px={6}>
        <Text fontSize="md" color="gray.600" textAlign="center">Unable to load appointment details.</Text>
        <HStack mt={4} space={3}>
          <Button onPress={() => loadAppointment()} bg="purple.600" isDisabled={!appointmentId}>
            Retry
          </Button>
          <Button variant="outline" onPress={() => navigation.goBack()} borderColor="purple.600">
            Go Back
          </Button>
        </HStack>
      </Box>
    );
  }

  return (
    <Box flex={1} bg="gray.50">
      <Box bg="purple.600" pb={6} pt={4} px={4} borderBottomLeftRadius={24} borderBottomRightRadius={24}>
        <HStack alignItems="center">
          <Pressable mr={3} onPress={() => navigation.goBack()}>
            <Icon as={MaterialIcons} name="arrow-back" size={6} color="white" />
          </Pressable>
          <Text fontSize="xl" fontWeight="bold" color="white">Appointment Details</Text>
        </HStack>
      </Box>

      <ScrollView flex={1} contentContainerStyle={{ padding: 16, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
      <VStack space={4}>
        <Box bg="white" p={4} borderRadius="lg" shadow={1}>
          <HStack alignItems="center" space={4}>
            <Avatar bg="purple.100" size="lg">
              <Text color="purple.600" fontWeight="bold" fontSize="2xl">
                {(appointment.patient?.fullName || 'P').charAt(0).toUpperCase()}
              </Text>
            </Avatar>
            <VStack>
              <Text fontWeight="bold" fontSize="lg">{appointment.patient?.fullName || 'Unknown Patient'}</Text>
              <Text color="gray.500">Patient</Text>
            </VStack>
          </HStack>
        </Box>

        <Box bg="white" p={4} borderRadius="lg" shadow={1}>
          <HStack alignItems="center" space={4}>
            <Avatar bg="green.100" size="lg">
              <Icon as={MaterialIcons} name="medical-services" size={8} color="green.600" />
            </Avatar>
            <VStack>
              <Text fontWeight="bold" fontSize="lg">Dr. {appointment.doctor?.fullName || 'Unknown'}</Text>
              <Text color="gray.500">Doctor</Text>
            </VStack>
          </HStack>
        </Box>

        <Box bg="white" p={4} borderRadius="lg" shadow={1}>
          <VStack space={3}>
            <HStack justifyContent="space-between">
              <Text color="gray.500">Time</Text>
              <Text fontWeight="medium">{formatAppointmentTime(appointment.appointmentTime)}</Text>
            </HStack>
            <HStack justifyContent="space-between">
              <Text color="gray.500">Reason</Text>
              <Text fontWeight="medium">{appointment.disease || 'N/A'}</Text>
            </HStack>
            <HStack justifyContent="space-between">
              <Text color="gray.500">Current Status</Text>
              <Text fontWeight="bold" color={statusColor(currentStatus)}>{statusLabel(currentStatus)}</Text>
            </HStack>
          </VStack>
        </Box>

        <Box bg="white" p={4} borderRadius="lg" shadow={1}>
          <Text mb={3} color="gray.500" fontWeight="semibold">Update Status</Text>
          <HStack flexWrap="wrap" space={2}>
            {STATUS_OPTIONS.map((status) => {
              const selected = selectedStatus === status;
              return (
                <Pressable key={status} onPress={() => setSelectedStatus(status)} mb={2}>
                  <Box
                    px={3}
                    py={2}
                    borderRadius="full"
                    borderWidth={1}
                    borderColor={selected ? 'purple.600' : 'gray.300'}
                    bg={selected ? 'purple.100' : 'white'}
                  >
                    <Text fontSize="xs" fontWeight="semibold" color={selected ? 'purple.700' : 'gray.700'}>
                      {statusLabel(status)}
                    </Text>
                  </Box>
                </Pressable>
              );
            })}
          </HStack>

          <Button mt={3} bg="purple.600" onPress={handleStatusUpdate} isLoading={saving} isDisabled={saving}>
            Save Status
          </Button>
        </Box>

        {currentStatus === 'COMPLETED' && (
          <Button
            bg="green.600"
            onPress={() =>
              navigation.navigate('GenerateBill', {
                patientId: appointment.patient?.id?.toString() || '',
                patientName: appointment.patient?.fullName || '',
                appointmentId: appointment.id,
              })
            }
          >
            Generate Bill For This Visit
          </Button>
        )}
      </VStack>
      </ScrollView>
    </Box>
  );
}
