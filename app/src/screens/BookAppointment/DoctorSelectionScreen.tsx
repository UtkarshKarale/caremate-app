import React, { useEffect, useMemo, useState } from 'react';
import { Box, Text, HStack, VStack, ScrollView, Pressable, Avatar, Icon, Spinner, Button } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { getAllDoctors, getHospitals } from '../../../../lib/api';
import { TextInput, StyleSheet, View } from 'react-native';

type Doctor = {
  id: number;
  fullName?: string;
  specialist?: string;
  experience?: number;
  rating?: number;
  image?: string;
};

type Hospital = {
  id: number;
  hospitalName?: string;
  specialization?: string;
  address?: string;
  assignedDoctors?: Doctor[];
};

export default function DoctorSelectionScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const [selectedHospitalId, setSelectedHospitalId] = useState<number | null>(null);
  const [selectedHospitalFilter, setSelectedHospitalFilter] = useState('All Hospitals');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [fetchedHospitals, fetchedDoctors] = await Promise.all([getHospitals(), getAllDoctors()]);
        setHospitals(fetchedHospitals || []);
        setAllDoctors(fetchedDoctors || []);
      } catch (error) {
        console.error('Error loading booking data:', error);
        setHospitals([]);
        setAllDoctors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const selectedHospital = useMemo(
    () => hospitals.find((hospital) => hospital.id === selectedHospitalId) || null,
    [hospitals, selectedHospitalId]
  );

  const doctorsById = useMemo(() => {
    const map = new Map<number, Doctor>();
    allDoctors.forEach((doctor) => map.set(doctor.id, doctor));
    return map;
  }, [allDoctors]);

  const hospitalDoctors = useMemo(() => {
    if (!selectedHospital) return [];
    return (selectedHospital.assignedDoctors || []).map((doctor) => ({
      ...doctorsById.get(doctor.id),
      ...doctor,
      hospitalName: selectedHospital.hospitalName || 'Hospital',
    }));
  }, [selectedHospital, doctorsById]);

  const specialties = useMemo(() => {
    if (!selectedHospital) return ['All Specialties'];
    return [
      'All Specialties',
      ...new Set(hospitalDoctors.map((doctor: any) => doctor.specialist || 'Unknown').filter(Boolean)),
    ];
  }, [selectedHospital, hospitalDoctors]);

  const filteredHospitals = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return hospitals.filter((hospital) => {
      const matchesFilter =
        selectedHospitalFilter === 'All Hospitals' ||
        (hospital.specialization || 'General').toLowerCase() === selectedHospitalFilter.toLowerCase();

      const matchesQuery =
        !query ||
        (hospital.hospitalName || '').toLowerCase().includes(query) ||
        (hospital.specialization || '').toLowerCase().includes(query) ||
        (hospital.address || '').toLowerCase().includes(query);

      return matchesFilter && matchesQuery;
    });
  }, [hospitals, searchQuery, selectedHospitalFilter]);

  const hospitalSpecializationFilters = useMemo(
    () => [
      'All Hospitals',
      ...new Set((hospitals || []).map((hospital) => hospital.specialization || 'General').filter(Boolean)),
    ],
    [hospitals]
  );

  const filteredDoctors = useMemo(() => {
    if (!selectedHospital) return [];
    const query = searchQuery.trim().toLowerCase();
    return hospitalDoctors.filter((doctor: any) => {
      const name = (doctor.fullName || '').toLowerCase();
      const specialty = (doctor.specialist || '').toLowerCase();
      const matchesSpecialty =
        selectedSpecialty === 'All Specialties' || (doctor.specialist || 'Unknown') === selectedSpecialty;
      const matchesSearch = !query || name.includes(query) || specialty.includes(query);
      return matchesSpecialty && matchesSearch;
    });
  }, [selectedHospital, hospitalDoctors, selectedSpecialty, searchQuery]);

  const handleHeaderBack = () => {
    if (selectedHospital) {
      setSelectedHospitalId(null);
      setSelectedSpecialty('All Specialties');
      setSearchQuery('');
      return;
    }
    navigation.goBack();
  };

  return (
    <Box flex={1} bg="gray.50">
      <Box bg="blue.600" pb={6} pt={4} px={4} borderBottomLeftRadius={24} borderBottomRightRadius={24}>
        <HStack mt={4} alignItems="center" mb={3}>
          <Pressable mr={3} onPress={handleHeaderBack}>
            <Icon as={MaterialIcons} name="arrow-back" size={6} color="white" />
          </Pressable>
          <VStack flex={1}>
            <Text mt={5} fontSize="2xl" fontWeight="bold" color="white">Book Appointment</Text>
            <Text fontSize="sm" color="blue.100">
              {selectedHospital ? 'Step 2: Select doctor from chosen hospital' : 'Step 1: Select hospital'}
            </Text>
          </VStack>
        </HStack>
      </Box>

      <Box p={4}>
        <View style={styles.inputContainer}>
          <Icon as={MaterialIcons} name="search" size={5} color="gray.400" style={styles.inputIcon} />
          <TextInput
            placeholder={selectedHospital ? 'Search doctors or specialties...' : 'Search hospitals...'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.input}
          />
        </View>

        {selectedHospital && (
          <Box bg="white" borderRadius="xl" shadow={1} p={4} mb={4}>
            <HStack justifyContent="space-between" alignItems="center">
              <VStack flex={1} pr={2}>
                <Text fontWeight="bold" fontSize="md">{selectedHospital.hospitalName || 'Hospital'}</Text>
                <Text fontSize="sm" color="gray.600">{selectedHospital.specialization || 'General Care'}</Text>
                <Text fontSize="sm" color="gray.500" numberOfLines={1}>{selectedHospital.address || '-'}</Text>
              </VStack>
              <Button size="sm" variant="outline" borderColor="blue.600" onPress={() => setSelectedHospitalId(null)}>
                Change
              </Button>
            </HStack>
          </Box>
        )}
      </Box>

      {loading ? (
        <VStack flex={1} alignItems="center" justifyContent="center">
          <Spinner size="lg" color="blue.600" />
          <Text mt={2} color="gray.500">Loading booking data...</Text>
        </VStack>
      ) : !selectedHospital ? (
        <ScrollView flex={1} px={4} showsVerticalScrollIndicator={false}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} mb={4}>
            <HStack space={2}>
              {hospitalSpecializationFilters.map((filter) => (
                <Pressable
                  key={filter}
                  onPress={() => setSelectedHospitalFilter(filter)}
                  bg={selectedHospitalFilter === filter ? 'blue.600' : 'white'}
                  px={4}
                  py={2}
                  borderRadius="full"
                  borderWidth={selectedHospitalFilter === filter ? 0 : 1}
                  borderColor="gray.200"
                >
                  <Text fontWeight="semibold" fontSize="sm" color={selectedHospitalFilter === filter ? 'white' : 'gray.700'}>
                    {filter}
                  </Text>
                </Pressable>
              ))}
            </HStack>
          </ScrollView>

          <Text fontSize="lg" fontWeight="bold" mb={4}>{filteredHospitals.length} Hospitals Available</Text>
          {filteredHospitals.map((hospital) => (
            <Pressable key={hospital.id} onPress={() => setSelectedHospitalId(hospital.id)}>
              <Box bg="white" borderRadius="xl" shadow={2} p={4} mb={4}>
                <HStack justifyContent="space-between" alignItems="center">
                  <VStack flex={1} pr={2}>
                    <Text fontWeight="bold" fontSize="md">{hospital.hospitalName || 'Hospital'}</Text>
                    <Text fontSize="sm" color="gray.600">{hospital.specialization || 'General Care'}</Text>
                    <Text fontSize="sm" color="gray.500" numberOfLines={1}>{hospital.address || '-'}</Text>
                    <Text mt={1} fontSize="xs" color="blue.600" fontWeight="semibold">
                      {(hospital.assignedDoctors || []).length} Doctors Available
                    </Text>
                  </VStack>
                  <Icon as={MaterialIcons} name="chevron-right" size={6} color="gray.400" />
                </HStack>
              </Box>
            </Pressable>
          ))}
          {filteredHospitals.length === 0 && (
            <VStack mt={10} alignItems="center">
              <Icon as={MaterialIcons} name="local-hospital" size={16} color="gray.300" />
              <Text mt={3} color="gray.500">No hospitals found</Text>
            </VStack>
          )}
        </ScrollView>
      ) : (
        <Box flex={1}>
          <Box px={4} mb={2}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <HStack space={2}>
                {specialties.map((specialty) => (
                  <Pressable
                    key={specialty}
                    onPress={() => setSelectedSpecialty(specialty)}
                    bg={selectedSpecialty === specialty ? 'blue.600' : 'white'}
                    px={4}
                    py={2}
                    borderRadius="full"
                    borderWidth={selectedSpecialty === specialty ? 0 : 1}
                    borderColor="gray.200"
                  >
                    <Text fontWeight="semibold" fontSize="sm" color={selectedSpecialty === specialty ? 'white' : 'gray.700'}>
                      {specialty}
                    </Text>
                  </Pressable>
                ))}
              </HStack>
            </ScrollView>
            <Text mt={3} fontSize="lg" fontWeight="bold">{filteredDoctors.length} Doctors Available</Text>
          </Box>

          <ScrollView flex={1} px={4} showsVerticalScrollIndicator={false}>
            {filteredDoctors.map((doctor: any) => (
              <Pressable
                key={doctor.id}
                onPress={() => navigation.navigate('TimeSlotSelection', { doctor, hospital: selectedHospital })}
              >
                <Box bg="white" borderRadius="xl" shadow={2} p={4} mb={4}>
                  <HStack space={4}>
                    <Avatar bg="green.600" size="lg" source={{ uri: doctor.image || undefined }}>
                      {(doctor.fullName || 'D').substring(0, 1).toUpperCase()}
                    </Avatar>
                    <VStack flex={1}>
                      <HStack justifyContent="space-between" alignItems="flex-start" mb={1}>
                        <Text fontWeight="bold" fontSize="md" flex={1}>{doctor.fullName || 'Doctor'}</Text>
                        <HStack alignItems="center" space={1}>
                          <Icon as={MaterialIcons} name="star" size={4} color="yellow.400" />
                          <Text fontSize="sm" fontWeight="semibold">{doctor.rating ?? '-'}</Text>
                          <Icon as={MaterialIcons} name="chevron-right" size={5} color="gray.400" />
                        </HStack>
                      </HStack>
                      <HStack alignItems="center" space={1} mb={1}>
                        <Icon as={MaterialIcons} name="medical-services" size={3} color="gray.600" />
                        <Text fontSize="sm" color="gray.600">{doctor.specialist || 'General'}</Text>
                      </HStack>
                      <HStack alignItems="center" space={1} mb={1}>
                        <Icon as={MaterialIcons} name="local-hospital" size={3} color="gray.600" />
                        <Text fontSize="sm" color="gray.600" numberOfLines={1}>
                          {selectedHospital.hospitalName || '-'}
                        </Text>
                      </HStack>
                      <HStack alignItems="center" space={1}>
                        <Icon as={MaterialIcons} name="work" size={3} color="gray.600" />
                        <Text fontSize="sm" color="gray.600">{doctor.experience ?? '-'} years experience</Text>
                      </HStack>
                    </VStack>
                  </HStack>
                </Box>
              </Pressable>
            ))}
            {filteredDoctors.length === 0 && (
              <VStack mt={10} alignItems="center">
                <Icon as={MaterialIcons} name="person-search" size={16} color="gray.300" />
                <Text mt={3} color="gray.500">No doctors found for this hospital</Text>
              </VStack>
            )}
          </ScrollView>
        </Box>
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
