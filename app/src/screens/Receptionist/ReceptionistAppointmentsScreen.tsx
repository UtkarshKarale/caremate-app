import React, { useState } from 'react';
import { Box, Text, HStack, VStack, ScrollView, Pressable, Badge, Icon, Avatar, Input } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

const appointments = [
    { id: '1', patient: 'John Smith', doctor: 'Dr. Sarah Johnson', time: '09:00 AM', status: 'Confirmed', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400' },
    { id: '2', patient: 'Emma Wilson', doctor: 'Dr. Michael Chen', time: '10:30 AM', status: 'Checked In', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400' },
    { id: '3', patient: 'Michael Brown', doctor: 'Dr. Emily Rodriguez', time: '11:00 AM', status: 'Pending', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
    { id: '4', patient: 'Sarah Davis', doctor: 'Dr. James Wilson', time: '02:00 PM', status: 'Confirmed', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400' },
    { id: '5', patient: 'David Lee', doctor: 'Dr. Sarah Johnson', time: '03:00 PM', status: 'Cancelled', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400' },
];

export default function ReceptionistAppointmentsScreen({ navigation }: any) {
    const [selectedFilter, setSelectedFilter] = useState('All');
    const filters = ['All', 'Confirmed', 'Pending', 'Checked In', 'Cancelled'];

    return (
        <Box flex={1} bg="gray.50">
            {/* Header */}
            <Box bg="purple.600" pb={6} pt={4} px={4} borderBottomLeftRadius={24} borderBottomRightRadius={24}>
                <HStack alignItems="center" mb={3}>
                    <Pressable mr={3} onPress={() => navigation.goBack()}>
                        <Icon as={MaterialIcons} name="arrow-back" size={6} color="white" />
                    </Pressable>
                    <VStack flex={1}>
                        <Text fontSize="2xl" fontWeight="bold" color="white">Appointments</Text>
                        <Text fontSize="sm" color="purple.100">Manage all appointments</Text>
                    </VStack>
                    <Pressable bg="purple.500" p={2} borderRadius="full">
                        <Icon as={MaterialIcons} name="add" size={6} color="white" />
                    </Pressable>
                </HStack>
            </Box>

            {/* Search & Filter */}
            <Box p={4}>
                <Input
                    placeholder="Search appointments..."
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
                    mb={4}
                />

                {/* Filter Tabs */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <HStack space={2}>
                        {filters.map(filter => (
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
                                <Text
                                    fontWeight="semibold"
                                    fontSize="sm"
                                    color={selectedFilter === filter ? 'white' : 'gray.700'}
                                >
                                    {filter}
                                </Text>
                            </Pressable>
                        ))}
                    </HStack>
                </ScrollView>
            </Box>

            {/* Appointments List */}
            <ScrollView flex={1} px={4} showsVerticalScrollIndicator={false}>
                {appointments.map(apt => (
                    <Pressable key={apt.id}>
                        <Box bg="white" borderRadius="xl" shadow={2} p={4} mb={4}>
                            <HStack space={3} alignItems="center">
                                <Avatar size="md" source={{ uri: apt.avatar }} />
                                <VStack flex={1}>
                                    <Text fontWeight="bold" fontSize="md">{apt.patient}</Text>
                                    <Text fontSize="sm" color="gray.600">{apt.doctor}</Text>
                                    <HStack alignItems="center" space={1} mt={1}>
                                        <Icon as={MaterialIcons} name="access-time" size={4} color="gray.500" />
                                        <Text fontSize="sm" color="gray.500">{apt.time}</Text>
                                    </HStack>
                                </VStack>
                                <VStack alignItems="flex-end" space={2}>
                                    <Badge
                                        bg={
                                            apt.status === 'Checked In' ? 'green.100' :
                                                apt.status === 'Confirmed' ? 'blue.100' :
                                                    apt.status === 'Pending' ? 'yellow.100' : 'red.100'
                                        }
                                        _text={{
                                            color:
                                                apt.status === 'Checked In' ? 'green.700' :
                                                    apt.status === 'Confirmed' ? 'blue.700' :
                                                        apt.status === 'Pending' ? 'yellow.700' : 'red.700',
                                            fontWeight: 'semibold',
                                            fontSize: 'xs'
                                        }}
                                        borderRadius="full"
                                        px={3}
                                        py={1}
                                    >
                                        {apt.status}
                                    </Badge>
                                    <Icon as={MaterialIcons} name="more-vert" size={6} color="gray.400" />
                                </VStack>
                            </HStack>
                        </Box>
                    </Pressable>
                ))}
            </ScrollView>
        </Box>
    );
}
