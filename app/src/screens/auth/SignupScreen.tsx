import React, { useState } from 'react';
import { Box, Text, Input, VStack, HStack, Pressable, Icon, Button, Radio, ScrollView } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

export default function SignupScreen({ navigation }: any) {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [userType, setUserType] = useState('patient');

    const handleSignup = () => {
        // Add registration logic here
        navigation.replace('RoleSelection');
    };

    return (
        <Box flex={1} bg="white">
            {/* Header */}
            <Box bg="blue.600" pt={12} pb={8} px={6} borderBottomLeftRadius={40} borderBottomRightRadius={40}>
                <HStack alignItems="center" mb={6}>
                    <Pressable onPress={() => navigation.goBack()} mr={3}>
                        <Icon as={MaterialIcons} name="arrow-back" size={6} color="white" />
                    </Pressable>
                    <VStack flex={1}>
                        <Text fontSize="3xl" fontWeight="bold" color="white">Create Account</Text>
                        <Text fontSize="md" color="blue.100">Sign up to get started</Text>
                    </VStack>
                </HStack>
            </Box>

            <ScrollView flex={1} px={6} showsVerticalScrollIndicator={false}>
                <Box bg="white" borderRadius="2xl" shadow={6} p={6} mt={-6} mb={6}>
                    <VStack space={4}>
                        {/* User Type Selection */}
                        <VStack space={2}>
                            <Text fontSize="sm" fontWeight="semibold" color="gray.700">I am a</Text>
                            <Radio.Group name={"bac"} value={userType} onChange={setUserType}>
                                <HStack space={4}>
                                    <Radio value="patient" colorScheme="blue">
                                        <Text fontSize="sm" ml={2}>Patient</Text>
                                    </Radio>
                                    <Radio value="doctor" colorScheme="blue">
                                        <Text fontSize="sm" ml={2}>Doctor</Text>
                                    </Radio>
                                    <Radio value="receptionist" colorScheme="blue">
                                        <Text fontSize="sm" ml={2}>Receptionist</Text>
                                    </Radio>
                                </HStack>
                            </Radio.Group>
                        </VStack>

                        {/* Full Name */}
                        <VStack space={2}>
                            <Text fontSize="sm" fontWeight="semibold" color="gray.700">Full Name</Text>
                            <Input
                                value={fullName}
                                onChangeText={setFullName}
                                placeholder="Enter your full name"
                                fontSize="md"
                                borderRadius="xl"
                                py={3}
                                px={4}
                                bg="gray.50"
                                borderWidth={1}
                                borderColor="gray.200"
                                _focus={{ borderColor: 'blue.600', bg: 'white' }}
                                InputLeftElement={
                                    <Icon as={MaterialIcons} name="person" size={5} color="gray.400" ml={4} />
                                }
                            />
                        </VStack>

                        {/* Email */}
                        <VStack space={2}>
                            <Text fontSize="sm" fontWeight="semibold" color="gray.700">Email Address</Text>
                            <Input
                                value={email}
                                onChangeText={setEmail}
                                placeholder="Enter your email"
                                fontSize="md"
                                borderRadius="xl"
                                py={3}
                                px={4}
                                bg="gray.50"
                                borderWidth={1}
                                borderColor="gray.200"
                                _focus={{ borderColor: 'blue.600', bg: 'white' }}
                                InputLeftElement={
                                    <Icon as={MaterialIcons} name="email" size={5} color="gray.400" ml={4} />
                                }
                            />
                        </VStack>

                        {/* Phone */}
                        <VStack space={2}>
                            <Text fontSize="sm" fontWeight="semibold" color="gray.700">Phone Number</Text>
                            <Input
                                value={phone}
                                onChangeText={setPhone}
                                placeholder="Enter your phone number"
                                keyboardType="phone-pad"
                                fontSize="md"
                                borderRadius="xl"
                                py={3}
                                px={4}
                                bg="gray.50"
                                borderWidth={1}
                                borderColor="gray.200"
                                _focus={{ borderColor: 'blue.600', bg: 'white' }}
                                InputLeftElement={
                                    <Icon as={MaterialIcons} name="phone" size={5} color="gray.400" ml={4} />
                                }
                            />
                        </VStack>

                        {/* Password */}
                        <VStack space={2}>
                            <Text fontSize="sm" fontWeight="semibold" color="gray.700">Password</Text>
                            <Input
                                value={password}
                                onChangeText={setPassword}
                                placeholder="Create a password"
                                type={showPassword ? 'text' : 'password'}
                                fontSize="md"
                                borderRadius="xl"
                                py={3}
                                px={4}
                                bg="gray.50"
                                borderWidth={1}
                                borderColor="gray.200"
                                _focus={{ borderColor: 'blue.600', bg: 'white' }}
                                InputLeftElement={
                                    <Icon as={MaterialIcons} name="lock" size={5} color="gray.400" ml={4} />
                                }
                                InputRightElement={
                                    <Pressable onPress={() => setShowPassword(!showPassword)} mr={4}>
                                        <Icon
                                            as={MaterialIcons}
                                            name={showPassword ? 'visibility' : 'visibility-off'}
                                            size={5}
                                            color="gray.400"
                                        />
                                    </Pressable>
                                }
                            />
                        </VStack>

                        {/* Confirm Password */}
                        <VStack space={2}>
                            <Text fontSize="sm" fontWeight="semibold" color="gray.700">Confirm Password</Text>
                            <Input
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                placeholder="Confirm your password"
                                type={showConfirmPassword ? 'text' : 'password'}
                                fontSize="md"
                                borderRadius="xl"
                                py={3}
                                px={4}
                                bg="gray.50"
                                borderWidth={1}
                                borderColor="gray.200"
                                _focus={{ borderColor: 'blue.600', bg: 'white' }}
                                InputLeftElement={
                                    <Icon as={MaterialIcons} name="lock" size={5} color="gray.400" ml={4} />
                                }
                                InputRightElement={
                                    <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)} mr={4}>
                                        <Icon
                                            as={MaterialIcons}
                                            name={showConfirmPassword ? 'visibility' : 'visibility-off'}
                                            size={5}
                                            color="gray.400"
                                        />
                                    </Pressable>
                                }
                            />
                        </VStack>

                        {/* Terms & Conditions */}
                        <HStack space={2} alignItems="center">
                            <Icon as={MaterialIcons} name="check-box" size={5} color="blue.600" />
                            <Text fontSize="xs" color="gray.600" flex={1}>
                                I agree to the <Text color="blue.600" fontWeight="semibold">Terms & Conditions</Text> and <Text color="blue.600" fontWeight="semibold">Privacy Policy</Text>
                            </Text>
                        </HStack>

                        {/* Sign Up Button */}
                        <Button
                            bg="blue.600"
                            borderRadius="xl"
                            py={4}
                            mt={2}
                            onPress={handleSignup}
                            _pressed={{ bg: 'blue.700' }}
                        >
                            <Text color="white" fontSize="md" fontWeight="bold">
                                Create Account
                            </Text>
                        </Button>
                    </VStack>
                </Box>

                {/* Sign In Link */}
                <HStack justifyContent="center" space={2} mb={6}>
                    <Text color="gray.600">Already have an account?</Text>
                    <Pressable onPress={() => navigation.navigate('Login')}>
                        <Text color="blue.600" fontWeight="bold">Sign In</Text>
                    </Pressable>
                </HStack>
            </ScrollView>
        </Box>
    );
}