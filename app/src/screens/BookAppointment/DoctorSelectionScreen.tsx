import React, { useState } from 'react';
import { Box, Text, Input, HStack, VStack, ScrollView, Pressable, Avatar, Icon } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { doctors, specialties } from '@/app/src/data/doctor';

export default function DoctorSelectionScreen({ navigation }: any) {
    const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredDoctors = doctors.filter(doctor => {
        const matchesSpecialty = selectedSpecialty === 'All Specialties' || doctor.specialty === selectedSpecialty;
        const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSpecialty && matchesSearch;
    });

    return (
        <Box flex={1} bg="gray.50">
            {/* Header */}
            <Box bg="blue.600" pb={6} pt={4} px={4} borderBottomLeftRadius={24} borderBottomRightRadius={24}>
                <HStack alignItems="center" mb={3}>
                    <Pressable mr={3} onPress={() => navigation.goBack()}>
                        <Icon as={MaterialIcons} name="arrow-back" size={6} color="white" />
                    </Pressable>
                    <VStack flex={1}>
                        <Text fontSize="2xl" fontWeight="bold" color="white">Book Appointment</Text>
                        <Text fontSize="sm" color="blue.100">Find the right doctor for you</Text>
                    </VStack>
                </HStack>
            </Box>

            {/* Search */}
            <Box p={4}>
                <Input
                    placeholder="Search doctors, specialties..."
                    width="100%"
                    borderRadius="xl"
                    py={3}
                    px={4}
                    fontSize="md"
                    bg="white"
                    borderWidth={0}
                    shadow={1}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    InputLeftElement={
                        <Icon as={MaterialIcons} name="search" size={5} color="gray.400" ml={3} />
                    }
                    mb={4}
                />

                {/* Specialty Filter */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} mb={4}>
                    <HStack space={2}>
                        {specialties.map(specialty => (
                            <Pressable
                                key={specialty}
                                onPress={() => setSelectedSpecialty(specialty)}
                                bg={selectedSpecialty === specialty ? 'blue.600' : 'white'}
                                px={4}
                                py={2}
                                borderRadius="full"
                                borderWidth={selectedSpecialty === specialty ? 0 : 1}
                                borderColor="gray.200"
                                shadow={selectedSpecialty === specialty ? 2 : 0}
                            >
                                <Text
                                    fontWeight="semibold"
                                    fontSize="sm"
                                    color={selectedSpecialty === specialty ? 'white' : 'gray.700'}
                                >
                                    {specialty}
                                </Text>
                            </Pressable>
                        ))}
                    </HStack>
                </ScrollView>

                <Text fontSize="lg" fontWeight="bold" mb={4}>{filteredDoctors.length} Doctors Available</Text>
            </Box>

            {/* Doctor Cards */}
            <ScrollView flex={1} px={4} showsVerticalScrollIndicator={false}>
                {filteredDoctors.map(doctor => (
                    <Pressable
                        key={doctor.id}
                        onPress={() => navigation.navigate('TimeSlotSelection', { doctor })}
                    >
                        <Box bg="white" borderRadius="xl" shadow={2} p={4} mb={4}>
                            <HStack space={4}>
                                <Avatar size="lg" source={{ uri: doctor.image }} />
                                <VStack flex={1}>
                                    <HStack justifyContent="space-between" alignItems="flex-start" mb={1}>
                                        <Text fontWeight="bold" fontSize="md" flex={1}>{doctor.name}</Text>
                                        <HStack alignItems="center" space={1}>
                                            <Icon as={MaterialIcons} name="star" size={4} color="yellow.400" />
                                            <Text fontSize="sm" fontWeight="semibold">{doctor.rating}</Text>
                                            <Icon as={MaterialIcons} name="chevron-right" size={5} color="gray.400" />
                                        </HStack>
                                    </HStack>
                                    <HStack alignItems="center" space={1} mb={1}>
                                        <Icon as={MaterialIcons} name="medical-services" size={3} color="gray.600" />
                                        <Text fontSize="sm" color="gray.600">{doctor.specialty}</Text>
                                    </HStack>
                                    <HStack alignItems="center" space={1} mb={1}>
                                        <Icon as={MaterialIcons} name="location-on" size={3} color="gray.600" />
                                        <Text fontSize="sm" color="gray.600" numberOfLines={1}>{doctor.hospital}</Text>
                                    </HStack>
                                    <HStack alignItems="center" space={1}>
                                        <Icon as={MaterialIcons} name="work" size={3} color="gray.600" />
                                        <Text fontSize="sm" color="gray.600">{doctor.experience} years experience</Text>
                                    </HStack>
                                </VStack>
                            </HStack>
                        </Box>
                    </Pressable>
                ))}
            </ScrollView>
        </Box>
    );
}