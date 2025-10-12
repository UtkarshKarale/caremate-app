import React, { useState } from 'react';
import { Box, Text, HStack, VStack, ScrollView, Pressable, Badge, Icon, Avatar, Input } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

const appointments = [
    { id: '1', patient: 'John Smith', time: '09:00 AM', date: 'Today', type: 'Check-up', status: 'Completed', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400' },
    { id: '2', patient: 'Emma Wilson', time: '10:30 AM', date: 'Today', type: 'Follow-up', status: 'In Progress', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400' },
    { id: '3', patient: 'Michael Brown', time: '11:00 AM', date: 'Today', type: 'Consultation', status: 'Scheduled', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
    { id: '4', patient: 'Sarah Davis', time: '02:00 PM', date: 'Today', type: 'Emergency', status: 'Urgent', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400' },
    { id: '5', patient: 'David Lee', time: '09:00 AM', date: 'Tomorrow', type: 'Check-up', status: 'Scheduled', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400' },
];

export default function DoctorAppointmentsScreen({ navigation }: any) {
    const [selectedFilter, setSelectedFilter] = useState('All');
    const filters = ['All', 'Today', 'Tomorrow', 'Upcoming'];

    return (
        <Box flex={1} bg="gray.50">
            {/* Header */}
            <Box bg="green.600" pb={6} pt={4} px={4} borderBottomLeftRadius={24} borderBottomRightRadius={24}>
                <HStack alignItems="center" mb={3}>
                    <Pressable mr={3} onPress={() => navigation.goBack()}>
                        <Icon as={MaterialIcons} name="arrow-back" size={6} color="white" />
                    </Pressable>
                    <VStack flex={1}>
                        <Text fontSize="2xl" fontWeight="bold" color="white">Appointments</Text>
                        <Text fontSize="sm" color="green.100">Manage your schedule</Text>
                    </VStack>
                    <Pressable bg="green.500" p={2} borderRadius="full">
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
                                bg={selectedFilter === filter ? 'green.600' : 'white'}
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
                                <Avatar size="lg" source={{ uri: apt.avatar }} />
                                <VStack flex={1}>
                                    <Text fontWeight="bold" fontSize="md">{apt.patient}</Text>
                                    <Text fontSize="sm" color="gray.600">{apt.type}</Text>
                                    <HStack alignItems="center" space={2} mt={1}>
                                        <HStack alignItems="center" space={1}>
                                            <Icon as={MaterialIcons} name="access-time" size={4} color="gray.500" />
                                            <Text fontSize="sm" color="gray.500">{apt.time}</Text>
                                        </HStack>
                                        <Text fontSize="sm" color="gray.400">•</Text>
                                        <Text fontSize="sm" color="gray.500">{apt.date}</Text>
                                    </HStack>
                                </VStack>
                                <VStack alignItems="flex-end" space={2}>
                                    <Badge
                                        bg={
                                            apt.status === 'Urgent' ? 'red.100' :
                                                apt.status === 'In Progress' ? 'blue.100' :
                                                    apt.status === 'Completed' ? 'green.100' : 'yellow.100'
                                        }
                                        _text={{
                                            color:
                                                apt.status === 'Urgent' ? 'red.700' :
                                                    apt.status === 'In Progress' ? 'blue.700' :
                                                        apt.status === 'Completed' ? 'green.700' : 'yellow.700',
                                            fontWeight: 'semibold',
                                            fontSize: 'xs'
                                        }}
                                        borderRadius="full"
                                        px={3}
                                        py={1}
                                    >
                                        {apt.status}
                                    </Badge>
                                    <Icon as={MaterialIcons} name="chevron-right" size={6} color="gray.400" />
                                </VStack>
                            </HStack>
                        </Box>
                    </Pressable>
                ))}
            </ScrollView>
        </Box>
    );
}
