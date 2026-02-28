import React, { useCallback, useMemo, useState } from 'react';
import { Box, Text, HStack, VStack, ScrollView, Icon, Spinner, Pressable } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import {
  getBillsByPatientId,
  getHospitals,
  getPendingBillsByPatientId,
  getPrescriptionsByPatientId,
  getUserAppointments,
} from '../../../lib/api';
import { useAuth } from './context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

type Bill = {
  id: number;
  billNumber: string;
  status: string;
  totalAmount?: number;
  dueAmount?: number;
  paidAmount?: number;
  billDate?: string;
};

export default function MedicalRecordsScreen() {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bills, setBills] = useState<Bill[]>([]);
  const [pendingBills, setPendingBills] = useState<Bill[]>([]);
  const [doctorHospitalMap, setDoctorHospitalMap] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [prescriptionsData, billsData, pendingBillsData, appointmentsData, hospitalsData] = await Promise.all([
        getPrescriptionsByPatientId(user.id),
        getBillsByPatientId(user.id),
        getPendingBillsByPatientId(user.id),
        getUserAppointments(user.id),
        getHospitals(),
      ]);

      const mapping: Record<string, string> = {};
      (hospitalsData || []).forEach((hospital: any) => {
        (hospital.assignedDoctors || []).forEach((doctor: any) => {
          mapping[String(doctor.id)] = hospital.hospitalName;
        });
      });

      setDoctorHospitalMap(mapping);
      setPrescriptions(prescriptionsData || []);
      setBills(billsData || []);
      setPendingBills(pendingBillsData || []);
      setAppointments(appointmentsData || []);
    } catch (err) {
      console.error('Error fetching medical records:', err);
      setError('Could not load latest records.');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const totalPendingAmount = useMemo(
    () => pendingBills.reduce((sum, bill) => sum + Number(bill.dueAmount || 0), 0),
    [pendingBills]
  );

  const sortedAppointments = useMemo(
    () =>
      [...appointments]
        .filter((appointment) => Boolean(appointment?.appointmentTime))
        .sort((a, b) => new Date(b.appointmentTime).getTime() - new Date(a.appointmentTime).getTime()),
    [appointments]
  );

  return (
    <ScrollView flex={1} bg="gray.50">
      <Box bg="blue.600" pb={6} pt={4} px={4} borderBottomLeftRadius={24} borderBottomRightRadius={24}>
        <Text mt={5} fontSize="2xl" fontWeight="bold" color="white">Medical Records</Text>
      </Box>

      <Box p={4} pb={24}>
        {error ? (
          <Box bg="red.50" borderRadius="xl" p={4} mb={4}>
            <HStack justifyContent="space-between" alignItems="center">
              <Text color="red.700">{error}</Text>
              <Pressable onPress={fetchData}>
                <Text color="red.700" fontWeight="bold">Retry</Text>
              </Pressable>
            </HStack>
          </Box>
        ) : null}

        <Box bg="white" borderRadius="xl" shadow={1} p={6} mb={4}>
          <Text fontSize="lg" fontWeight="bold" mb={4}>Billing Summary</Text>
          {loading ? (
            <HStack alignItems="center" space={2}>
              <Spinner size="sm" color="blue.600" />
              <Text color="gray.500">Loading billing data...</Text>
            </HStack>
          ) : (
            <VStack space={2}>
              <HStack justifyContent="space-between">
                <Text color="gray.600">Total Bills</Text>
                <Text fontWeight="bold">{bills.length}</Text>
              </HStack>
              <HStack justifyContent="space-between">
                <Text color="gray.600">Pending Bills</Text>
                <Text fontWeight="bold" color="orange.600">{pendingBills.length}</Text>
              </HStack>
              <HStack justifyContent="space-between">
                <Text color="gray.600">Pending Amount</Text>
                <Text fontWeight="bold" color="red.600">${totalPendingAmount.toFixed(2)}</Text>
              </HStack>
            </VStack>
          )}
        </Box>

        <Box bg="white" borderRadius="xl" shadow={1} p={6} mb={4}>
          <Text fontSize="lg" fontWeight="bold" mb={4}>Recent Appointments</Text>
          {loading ? (
            <Text color="gray.500">Loading appointments...</Text>
          ) : sortedAppointments.length === 0 ? (
            <Text color="gray.500">No appointment records found.</Text>
          ) : (
            sortedAppointments.slice(0, 5).map((appointment: any, idx: number) => (
              <Box
                key={appointment.id || idx}
                borderBottomWidth={idx < Math.min(sortedAppointments.length, 5) - 1 ? 1 : 0}
                borderBottomColor="gray.200"
                py={3}
              >
                <HStack justifyContent="space-between" alignItems="center">
                  <VStack flex={1} pr={2}>
                    <Text fontWeight="semibold">
                      Dr. {appointment.doctor?.fullName || 'Unknown'}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {appointment.appointmentTime ? new Date(appointment.appointmentTime).toLocaleString() : 'No time'}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {doctorHospitalMap[String(appointment.doctor?.id)] || 'Hospital not assigned'}
                    </Text>
                  </VStack>
                  <Text
                    fontSize="xs"
                    fontWeight="bold"
                    color={String(appointment.status).toUpperCase() === 'COMPLETED' ? 'green.600' : 'orange.600'}
                  >
                    {String(appointment.status || 'PENDING').replace('_', ' ')}
                  </Text>
                </HStack>
              </Box>
            ))
          )}
        </Box>

        <Box bg="white" borderRadius="xl" shadow={1} p={6} mb={4}>
          <Text fontSize="lg" fontWeight="bold" mb={4}>Recent Bills</Text>
          {loading ? (
            <Text color="gray.500">Loading bills...</Text>
          ) : bills.length === 0 ? (
            <Text color="gray.500">No bills found.</Text>
          ) : (
            bills.slice(0, 5).map((bill, idx) => (
              <Box key={bill.id} borderBottomWidth={idx < Math.min(bills.length, 5) - 1 ? 1 : 0} borderBottomColor="gray.200" py={3}>
                <HStack justifyContent="space-between" alignItems="center">
                  <VStack>
                    <Text fontWeight="semibold">{bill.billNumber}</Text>
                    <Text fontSize="sm" color="gray.500">
                      {bill.billDate ? new Date(bill.billDate).toLocaleDateString() : 'No date'}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      Paid: ${Number(bill.paidAmount || 0).toFixed(2)} | Due: ${Number(bill.dueAmount || 0).toFixed(2)}
                    </Text>
                  </VStack>
                  <VStack alignItems="flex-end">
                    <Text fontWeight="bold">${Number(bill.totalAmount || 0).toFixed(2)}</Text>
                    <Text fontSize="xs" color={bill.status === 'PAID' ? 'green.600' : 'orange.600'}>{bill.status}</Text>
                  </VStack>
                </HStack>
              </Box>
            ))
          )}
        </Box>

        <Box bg="white" borderRadius="xl" shadow={1} p={6} mb={4}>
          <Text fontSize="lg" fontWeight="bold" mb={4}>Prescriptions</Text>
          {loading ? (
            <Text color="gray.500">Loading prescriptions...</Text>
          ) : prescriptions.length === 0 ? (
            <Text color="gray.500">No prescriptions found.</Text>
          ) : (
            prescriptions.map((med, idx) => (
              <Box key={idx} borderBottomWidth={idx < prescriptions.length - 1 ? 1 : 0} borderBottomColor="gray.200" py={3}>
                <HStack justifyContent="space-between" alignItems="center">
                  <VStack flex={1} pr={2}>
                    <Text fontWeight="semibold">{med.medication || med.name || 'Medication'}</Text>
                    <Text fontSize="sm" color="gray.500">Prescribed by Dr. {med.doctorName || med.doctor?.fullName || 'N/A'}</Text>
                    <Text fontSize="xs" color="gray.500">
                      {med.createdOn ? new Date(med.createdOn).toLocaleDateString() : 'No date'}
                    </Text>
                  </VStack>
                  <Text color="green.600" fontWeight="semibold" fontSize="sm">{med.status || 'Active'}</Text>
                </HStack>
              </Box>
            ))
          )}
        </Box>

        <Box bg="white" borderRadius="xl" shadow={1} p={6}>
          <Text fontSize="lg" fontWeight="bold" mb={4}>Documents</Text>
          {['Vaccination Record', 'Allergy Information', 'Surgical History'].map((doc, idx) => (
            <Box key={idx} borderBottomWidth={idx < 2 ? 1 : 0} borderBottomColor="gray.200" py={3}>
              <HStack justifyContent="space-between" alignItems="center">
                <HStack space={3} alignItems="center">
                  <Box bg="blue.100" p={2} borderRadius="lg">
                    <Icon as={MaterialIcons} name="description" size={5} color="blue.600" />
                  </Box>
                  <Text fontWeight="semibold">{doc}</Text>
                </HStack>
                <Text color="blue.600" fontWeight="semibold" fontSize="sm">Open</Text>
              </HStack>
            </Box>
          ))}
        </Box>
      </Box>
    </ScrollView>
  );
}
