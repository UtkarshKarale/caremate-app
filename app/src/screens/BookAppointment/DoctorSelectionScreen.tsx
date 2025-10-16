import React, { useEffect, useState } from 'react';
import { Box, Text, HStack, VStack, ScrollView, Pressable, Avatar, Icon } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { getAllDoctors } from '../../../../lib/api';
import { TextInput, StyleSheet, View } from 'react-native';

export default function DoctorSelectionScreen({ navigation }: any) {
    const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
    const [searchQuery, setSearchQuery] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [specialties, setSpecialties] = useState([]);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const fetchedDoctors = await getAllDoctors();
                setDoctors(fetchedDoctors);
                const uniqueSpecialties = ['All Specialties', ...new Set(fetchedDoctors.map(doc => doc.specialty))];
                // @ts-ignore
                setSpecialties(uniqueSpecialties);
            } catch (error) {
                console.error('Error fetching doctors:', error);
            }
        };

        fetchDoctors();
    }, []);

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
                <View style={styles.inputContainer}>
                    <Icon as={MaterialIcons} name="search" size={5} color="gray.400" style={styles.inputIcon} />
                    <TextInput
                        placeholder="Search doctors, specialties..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        style={styles.input}
                    />
                </View>

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

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 12,
        paddingHorizontal: 12,
        marginBottom: 16,
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