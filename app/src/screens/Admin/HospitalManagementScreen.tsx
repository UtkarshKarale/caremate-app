import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { Box, HStack, Icon, Pressable, Switch, Text, VStack } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import {
  createHospital,
  deleteHospital,
  getAvailableDoctors,
  getHospitals,
  replaceHospitalDoctors,
  updateHospital,
} from '@/lib/api';

type HospitalType = 'GOVERNMENT' | 'PRIVATE' | 'TRUST';

type AssignedDoctor = {
  id: number;
  fullName: string;
  specialist?: string;
  email?: string;
};

type Hospital = {
  id: number;
  hospitalName: string;
  specialization: string;
  address: string;
  mobileNo: string;
  email?: string;
  website?: string;
  totalBeds?: number;
  hospitalType?: HospitalType;
  active: boolean;
  assignedDoctors?: AssignedDoctor[];
};

type Doctor = {
  id: number;
  fullName: string;
  specialist?: string;
  email?: string;
};

const HOSPITAL_TYPES: HospitalType[] = ['GOVERNMENT', 'PRIVATE', 'TRUST'];

const emptyForm = {
  hospitalName: '',
  specialization: '',
  address: '',
  mobileNo: '',
  email: '',
  website: '',
  totalBeds: '',
  hospitalType: 'PRIVATE' as HospitalType,
  isActive: true,
};

export default function HospitalManagementScreen() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [availableDoctors, setAvailableDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);

  const [formVisible, setFormVisible] = useState(false);
  const [assignVisible, setAssignVisible] = useState(false);
  const [editingHospital, setEditingHospital] = useState<Hospital | null>(null);
  const [assignHospital, setAssignHospital] = useState<Hospital | null>(null);

  const [formData, setFormData] = useState(emptyForm);
  const [selectedDoctorIds, setSelectedDoctorIds] = useState<number[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [hospitalList, doctorList] = await Promise.all([getHospitals(), getAvailableDoctors()]);
      const normalizedHospitals = (hospitalList || []).map((h: any) => ({
        ...h,
        active: typeof h.active === 'boolean' ? h.active : !!h.isActive,
      }));
      setHospitals(normalizedHospitals);
      setAvailableDoctors(doctorList || []);
    } catch (error) {
      console.error('Error loading hospital data:', error);
      Alert.alert('Error', 'Could not load hospitals.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditingHospital(null);
    setFormData(emptyForm);
    setFormVisible(true);
  };

  const openEditModal = (hospital: Hospital) => {
    setEditingHospital(hospital);
    setFormData({
      hospitalName: hospital.hospitalName || '',
      specialization: hospital.specialization || '',
      address: hospital.address || '',
      mobileNo: hospital.mobileNo || '',
      email: hospital.email || '',
      website: hospital.website || '',
      totalBeds: hospital.totalBeds?.toString() || '',
      hospitalType: hospital.hospitalType || 'PRIVATE',
      isActive: hospital.active,
    });
    setFormVisible(true);
  };

  const submitHospital = async () => {
    if (!formData.hospitalName || !formData.specialization || !formData.address || !formData.mobileNo) {
      Alert.alert('Validation', 'Please fill hospital name, specialization, address, and mobile number.');
      return;
    }

    const payload = {
      hospitalName: formData.hospitalName,
      specialization: formData.specialization,
      address: formData.address,
      mobileNo: formData.mobileNo,
      email: formData.email || null,
      website: formData.website || null,
      totalBeds: formData.totalBeds ? Number(formData.totalBeds) : null,
      hospitalType: formData.hospitalType,
      isActive: formData.isActive,
    };

    try {
      if (editingHospital) {
        await updateHospital(editingHospital.id, payload);
      } else {
        await createHospital(payload);
      }
      setFormVisible(false);
      await fetchData();
    } catch (error) {
      console.error('Error saving hospital:', error);
      Alert.alert('Error', 'Could not save hospital.');
    }
  };

  const handleDeleteHospital = (hospital: Hospital) => {
    Alert.alert(
      'Delete Hospital',
      `Delete ${hospital.hospitalName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteHospital(hospital.id);
              await fetchData();
            } catch (error) {
              console.error('Error deleting hospital:', error);
              Alert.alert('Error', 'Could not delete hospital.');
            }
          },
        },
      ]
    );
  };

  const openAssignModal = (hospital: Hospital) => {
    setAssignHospital(hospital);
    setSelectedDoctorIds((hospital.assignedDoctors || []).map((d) => d.id));
    setAssignVisible(true);
  };

  const toggleDoctor = (doctorId: number) => {
    setSelectedDoctorIds((prev) =>
      prev.includes(doctorId) ? prev.filter((id) => id !== doctorId) : [...prev, doctorId]
    );
  };

  const submitDoctorAssignments = async () => {
    if (!assignHospital) {
      return;
    }

    try {
      await replaceHospitalDoctors(assignHospital.id, selectedDoctorIds);
      setAssignVisible(false);
      setAssignHospital(null);
      await fetchData();
    } catch (error) {
      console.error('Error assigning doctors:', error);
      Alert.alert('Error', 'Could not update doctor assignments.');
    }
  };

  const doctorNameMap = useMemo(() => {
    const map = new Map<number, string>();
    availableDoctors.forEach((doc) => map.set(doc.id, doc.fullName));
    return map;
  }, [availableDoctors]);

  return (
    <View style={styles.container}>
      <Box bg="red.600" pb={2} pt={4} px={4} borderBottomLeftRadius={24} borderBottomRightRadius={24}>
        <HStack justifyContent="space-between" mt={5} alignItems="center" mb={6}>
          <Text fontSize="2xl" mt={6} fontWeight="bold" color="white">Hospitals</Text>
          <Pressable bg="white" px={3} py={2} borderRadius="lg" onPress={openCreateModal}>
            <HStack alignItems="center" space={1}>
              <Icon as={MaterialIcons} name="add" size={5} color="red.600" />
              <Text color="red.600" fontWeight="bold">Add</Text>
            </HStack>
          </Pressable>
        </HStack>
      </Box>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : (
        <ScrollView style={{ flex: 1, padding: 12 }}>
          {hospitals.length === 0 ? (
            <Text textAlign="center" mt={4} color="gray.500">No hospitals added yet.</Text>
          ) : (
            hospitals.map((hospital) => (
              <Box key={hospital.id} bg="white" p={4} borderRadius="xl" shadow={1} mb={3}>
                <HStack justifyContent="space-between" alignItems="flex-start">
                  <VStack flex={1} space={1}>
                    <Text fontWeight="bold" fontSize="lg">{hospital.hospitalName}</Text>
                    <Text color="gray.600">{hospital.specialization}</Text>
                    <Text color="gray.500">{hospital.address}</Text>
                    <Text color="gray.500">{hospital.mobileNo}</Text>
                    <Text color={hospital.active ? 'green.600' : 'gray.400'} fontWeight="medium">
                      {hospital.active ? 'Active' : 'Inactive'}
                    </Text>
                    <Text color="gray.700" mt={1}>
                      Doctors: {(hospital.assignedDoctors || []).length}
                    </Text>
                    {(hospital.assignedDoctors || []).length > 0 && (
                      <Text color="gray.500" numberOfLines={2}>
                        {(hospital.assignedDoctors || [])
                          .map((d) => doctorNameMap.get(d.id) || d.fullName)
                          .join(', ')}
                      </Text>
                    )}
                  </VStack>

                  <VStack space={2} ml={2}>
                    <Pressable onPress={() => openEditModal(hospital)}>
                      <Icon as={MaterialIcons} name="edit" size={5} color="blue.600" />
                    </Pressable>
                    <Pressable onPress={() => openAssignModal(hospital)}>
                      <Icon as={MaterialIcons} name="person-add" size={5} color="green.600" />
                    </Pressable>
                    <Pressable onPress={() => handleDeleteHospital(hospital)}>
                      <Icon as={MaterialIcons} name="delete" size={5} color="red.600" />
                    </Pressable>
                  </VStack>
                </HStack>
              </Box>
            ))
          )}
        </ScrollView>
      )}

      <Modal visible={formVisible} animationType="slide" onRequestClose={() => setFormVisible(false)}>
        <ScrollView style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{editingHospital ? 'Edit Hospital' : 'Add Hospital'}</Text>

          <TextInput
            style={styles.input}
            placeholder="Hospital Name"
            value={formData.hospitalName}
            onChangeText={(text) => setFormData((prev) => ({ ...prev, hospitalName: text }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Specialization"
            value={formData.specialization}
            onChangeText={(text) => setFormData((prev) => ({ ...prev, specialization: text }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={formData.address}
            onChangeText={(text) => setFormData((prev) => ({ ...prev, address: text }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Mobile No"
            value={formData.mobileNo}
            onChangeText={(text) => setFormData((prev) => ({ ...prev, mobileNo: text }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Email (optional)"
            value={formData.email}
            onChangeText={(text) => setFormData((prev) => ({ ...prev, email: text }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Website (optional)"
            value={formData.website}
            onChangeText={(text) => setFormData((prev) => ({ ...prev, website: text }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Total Beds (optional)"
            value={formData.totalBeds}
            keyboardType="numeric"
            onChangeText={(text) => setFormData((prev) => ({ ...prev, totalBeds: text }))}
          />

          <Text style={styles.label}>Hospital Type</Text>
          <View style={styles.chipsContainer}>
            {HOSPITAL_TYPES.map((type) => (
              <Pressable
                key={type}
                onPress={() => setFormData((prev) => ({ ...prev, hospitalType: type }))}
                style={[
                  styles.chip,
                  formData.hospitalType === type && styles.activeChip,
                ]}
              >
                <Text style={formData.hospitalType === type ? styles.activeChipText : styles.chipText}>{type}</Text>
              </Pressable>
            ))}
          </View>

          <HStack justifyContent="space-between" alignItems="center" mt={3} mb={4}>
            <Text fontSize="md" fontWeight="medium">Active</Text>
            <Switch
              isChecked={formData.isActive}
              onToggle={(value) => setFormData((prev) => ({ ...prev, isActive: value }))}
            />
          </HStack>

          <HStack space={3} mt={2} mb={8}>
            <Pressable flex={1} style={styles.cancelBtn} onPress={() => setFormVisible(false)}>
              <Text color="white" fontWeight="bold" textAlign="center">Cancel</Text>
            </Pressable>
            <Pressable flex={1} style={styles.saveBtn} onPress={submitHospital}>
              <Text color="white" fontWeight="bold" textAlign="center">Save</Text>
            </Pressable>
          </HStack>
        </ScrollView>
      </Modal>

      <Modal visible={assignVisible} animationType="slide" onRequestClose={() => setAssignVisible(false)}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            Assign Doctors {assignHospital ? `- ${assignHospital.hospitalName}` : ''}
          </Text>

          <ScrollView style={{ flex: 1 }}>
            {availableDoctors.map((doctor) => {
              const selected = selectedDoctorIds.includes(doctor.id);
              return (
                <Pressable
                  key={doctor.id}
                  onPress={() => toggleDoctor(doctor.id)}
                  style={[styles.doctorRow, selected && styles.selectedDoctorRow]}
                >
                  <VStack flex={1}>
                    <Text fontWeight="bold">{doctor.fullName}</Text>
                    <Text color="gray.600">{doctor.specialist || 'General'}</Text>
                    <Text color="gray.500" fontSize="xs">{doctor.email || ''}</Text>
                  </VStack>
                  <Icon
                    as={MaterialIcons}
                    name={selected ? 'check-circle' : 'radio-button-unchecked'}
                    size={6}
                    color={selected ? 'green.600' : 'gray.400'}
                  />
                </Pressable>
              );
            })}
          </ScrollView>

          <HStack space={3} mt={3}>
            <Pressable flex={1} style={styles.cancelBtn} onPress={() => setAssignVisible(false)}>
              <Text color="white" fontWeight="bold" textAlign="center">Cancel</Text>
            </Pressable>
            <Pressable flex={1} style={styles.saveBtn} onPress={submitDoctorAssignments}>
              <Text color="white" fontWeight="bold" textAlign="center">Update</Text>
            </Pressable>
          </HStack>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  modalContainer: { flex: 1, backgroundColor: 'white', padding: 16 },
  modalTitle: { fontSize: 22, fontWeight: '700', marginBottom: 16, color: '#111827' },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    fontSize: 15,
    backgroundColor: '#fafafa',
  },
  label: { fontSize: 15, fontWeight: '600', color: '#374151', marginBottom: 8, marginTop: 4 },
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 4 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  activeChip: { backgroundColor: '#dc2626', borderColor: '#dc2626' },
  chipText: { color: '#374151', fontWeight: '600' },
  activeChipText: { color: 'white', fontWeight: '700' },
  cancelBtn: {
    backgroundColor: '#6b7280',
    paddingVertical: 12,
    borderRadius: 10,
  },
  saveBtn: {
    backgroundColor: '#dc2626',
    paddingVertical: 12,
    borderRadius: 10,
  },
  doctorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 8,
  },
  selectedDoctorRow: {
    borderColor: '#16a34a',
    backgroundColor: '#f0fdf4',
  },
});
