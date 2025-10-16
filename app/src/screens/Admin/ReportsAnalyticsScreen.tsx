import React, { useState } from 'react';
import { Box, Text, HStack, VStack, ScrollView, Pressable, Icon, Avatar, Badge } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { TextInput, StyleSheet, View } from 'react-native';

const users = [
    { id: '1', name: 'Dr. Sarah Johnson', role: 'Doctor', email: 'sarah@hospital.com', status: 'Active', avatar: 'https://images.unsplash.com/photo-1559839734-2b716b17f7d1?w=400' },
    { id: '2', name: 'John Smith', role: 'Patient', email: 'john@email.com', status: 'Active', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400' },
    { id: '3', name: 'Jessica Martinez', role: 'Receptionist', email: 'jessica@hospital.com', status: 'Active', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400' },
    { id: '4', name: 'Michael Chen', role: 'Doctor', email: 'michael@hospital.com', status: 'Inactive', avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400' },
];

export default function UserManagementScreen({ navigation }: any) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('All');
    const filters = ['All', 'Doctor', 'Patient', 'Receptionist', 'Admin'];

    return (
        <Box flex={1} bg="gray.50">
            {/* Header */}
            <Box bg="red.600" pb={6} pt={4} px={4} borderBottomLeftRadius={24} borderBottomRightRadius={24}>
                <HStack alignItems="center" mb={3}>
                    <Pressable mr={3} onPress={() => navigation.goBack()}>
                        <Icon as={MaterialIcons} name="arrow-back" size={6} color="white" />
                    </Pressable>
                    <VStack flex={1}>
                        <Text fontSize="2xl" fontWeight="bold" color="white">User Management</Text>
                        <Text fontSize="sm" color="red.100">Manage all system users</Text>
                    </VStack>
                    <Pressable bg="red.500" p={2} borderRadius="full">
                        <Icon as={MaterialIcons} name="person-add" size={6} color="white" />
                    </Pressable>
                </HStack>
            </Box>

            {/* Search & Filter */}
            <Box p={4}>
                <View style={styles.inputContainer}>
                    <Icon as={MaterialIcons} name="search" size={5} color="gray.400" style={styles.inputIcon} />
                    <TextInput
                        placeholder="Search users..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        style={styles.input}
                    />
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <HStack space={2}>
                        {filters.map(filter => (
                            <Pressable
                                key={filter}
                                onPress={() => setSelectedFilter(filter)}
                                bg={selectedFilter === filter ? 'red.600' : 'white'}
                                px={4}
                                py={2}
                                borderRadius="full"
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

            {/* Users List */}
            <ScrollView flex={1} px={4} showsVerticalScrollIndicator={false}>
                {users.map(user => (
                    <Pressable key={user.id}>
                        <Box bg="white" borderRadius="xl" shadow={2} p={4} mb={4}>
                            <HStack space={4} alignItems="center">
                                <Avatar size="lg" source={{ uri: user.avatar }} />
                                <VStack flex={1}>
                                    <Text fontWeight="bold" fontSize="md">{user.name}</Text>
                                    <Text fontSize="sm" color="gray.600">{user.role}</Text>
                                    <Text fontSize="sm" color="gray.500">{user.email}</Text>
                                </VStack>
                                <VStack alignItems="flex-end" space={2}>
                                    <Badge
                                        bg={user.status === 'Active' ? 'green.100' : 'red.100'}
                                        _text={{
                                            color: user.status === 'Active' ? 'green.700' : 'red.700',
                                            fontWeight: 'semibold',
                                            fontSize: 'xs'
                                        }}
                                        borderRadius="full"
                                        px={3}
                                        py={1}
                                    >
                                        {user.status}
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
