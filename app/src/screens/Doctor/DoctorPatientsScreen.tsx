import React, { useState } from 'react';
import { Box, Text, HStack, VStack, ScrollView, Pressable, Icon, Avatar, Input } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

const patients = [
    { id: '1', name: 'John Smith', age: 45, condition: 'Hypertension', lastVisit: '2 days ago', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400' },
    { id: '2', name: 'Emma Wilson', age: 32, condition: 'Diabetes', lastVisit: '1 week ago', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400' },
    { id: '3', name: 'Michael Brown', age: 58, condition: 'Heart Disease', lastVisit: '3 days ago', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
    { id: '4', name: 'Sarah Davis', age: 28, condition: 'Asthma', lastVisit: 'Today', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400' },
    { id: '5', name: 'David Lee', age: 65, condition: 'Arthritis', lastVisit: '5 days ago', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400' },
];

export default function DoctorPatientsScreen({ navigation }: any) {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <Box flex={1} bg="gray.50">
            {/* Header */}
            <Box bg="green.600" pb={6} pt={4} px={4} borderBottomLeftRadius={24} borderBottomRightRadius={24}>
                <HStack alignItems="center" mb={3}>
                    <Pressable mr={3} onPress={() => navigation.goBack()}>
                        <Icon as={MaterialIcons} name="arrow-back" size={6} color="white" />
                    </Pressable>
                    <VStack flex={1}>
                        <Text fontSize="2xl" fontWeight="bold" color="white">My Patients</Text>
                        <Text fontSize="sm" color="green.100">{patients.length} Total Patients</Text>
                    </VStack>
                </HStack>
            </Box>

            {/* Search */}
            <Box p={4}>
                <Input
                    placeholder="Search patients..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    width="100%"
                    borderRadius="xl"
                    py={3}
                    px={4}
                    fontSize="md"
                    bg="white"
                    borderWidth={0}
                    shadow={1}
                    InputLeftElement={
                        <Icon as={MaterialIcons} name="search" size={5} color="gray.400" ml={3} />
                    }
                />
            </Box>

            {/* Patients List */}
            <ScrollView flex={1} px={4} showsVerticalScrollIndicator={false}>
                {patients.map(patient => (
                    <Pressable key={patient.id}>
                        <Box bg="white" borderRadius="xl" shadow={2} p={4} mb={4}>
                            <HStack space={4} alignItems="center">
                                <Avatar size="lg" source={{ uri: patient.avatar }} />
                                <VStack flex={1}>
                                    <HStack justifyContent="space-between" alignItems="center" mb={1}>
                                        <Text fontWeight="bold" fontSize="md">{patient.name}</Text>
                                        <Icon as={MaterialIcons} name="chevron-right" size={6} color="gray.400" />
                                    </HStack>
                                    <Text fontSize="sm" color="gray.600">{patient.age} years old</Text>
                                    <HStack alignItems="center" space={1} mt={1}>
                                        <Icon as={MaterialIcons} name="medical-services" size={4} color="green.600" />
                                        <Text fontSize="sm" color="gray.600">{patient.condition}</Text>
                                    </HStack>
                                    <HStack alignItems="center" space={1} mt={1}>
                                        <Icon as={MaterialIcons} name="access-time" size={4} color="gray.500" />
                                        <Text fontSize="sm" color="gray.500">Last visit: {patient.lastVisit}</Text>
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
