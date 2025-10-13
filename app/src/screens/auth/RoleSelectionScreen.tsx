import React from 'react';
import {Box, Text, VStack, Pressable, Icon, HStack} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

export default function RoleSelectionScreen({ navigation }: any) {
    const roles = [
        {
            id: 'patient',
            title: 'Patient',
            description: 'Book appointments, view records',
            icon: 'person',
            color: 'blue.600',
            bgColor: 'blue.100',
            route: 'PatientTabs'
        },
        {
            id: 'doctor',
            title: 'Doctor',
            description: 'Manage appointments, patient records',
            icon: 'medical-services',
            color: 'green.600',
            bgColor: 'green.100',
            route: 'DoctorTabs'
        },
        {
            id: 'receptionist',
            title: 'Receptionist',
            description: 'Manage appointments, check-ins',
            icon: 'desktop-windows',
            color: 'purple.600',
            bgColor: 'purple.100',
            route: 'ReceptionistTabs'
        },
        {
            id: 'admin',
            title: 'admin',
            description: 'Manage appointments, check-ins',
            icon: 'desktop-windows',
            color: 'purple.600',
            bgColor: 'purple.100',
            route: 'ReceptionistTabs'
        }
    ];

    const handleRoleSelect = (route: string) => {
        navigation.replace(route);
    };

    return (
        <Box flex={1} bg="white">
            {/* Header */}
            <Box bg="blue.600" pt={12} pb={12} px={6} borderBottomLeftRadius={40} borderBottomRightRadius={40}>
                <VStack space={2} alignItems="center" mt={8}>
                    <Text fontSize="3xl" fontWeight="bold" color="white">Select Your Role</Text>
                    <Text fontSize="md" color="blue.100" textAlign="center">
                        Choose how you want to continue
                    </Text>
                </VStack>
            </Box>

            {/* Role Cards */}
            <VStack flex={1} px={6} space={4} mt={-8}>
                {roles.map((role) => (
                    <Pressable
                        key={role.id}
                        onPress={() => handleRoleSelect(role.route)}
                    >
                        <Box
                            bg="white"
                            borderRadius="2xl"
                            shadow={4}
                            p={6}
                            borderWidth={2}
                            borderColor="gray.100"
                        >
                            <HStack space={4} alignItems="center">
                                <Box bg={role.bgColor} p={4} borderRadius="2xl">
                                    <Icon as={MaterialIcons} name={role.icon} size={10} color={role.color} />
                                </Box>
                                <VStack flex={1}>
                                    <Text fontSize="xl" fontWeight="bold" color="gray.800">
                                        {role.title}
                                    </Text>
                                    <Text fontSize="sm" color="gray.600">
                                        {role.description}
                                    </Text>
                                </VStack>
                                <Icon as={MaterialIcons} name="chevron-right" size={8} color="gray.400" />
                            </HStack>
                        </Box>
                    </Pressable>
                ))}
            </VStack>
        </Box>
    );
}