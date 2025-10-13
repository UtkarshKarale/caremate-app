import React, { useState } from 'react';
import { Box, Text, Input, VStack, HStack, Pressable, Icon, Button, Image, Checkbox } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

export default function LoginScreen({ navigation }: any) {
    const [email, setEmail] = useState<string | null>(null);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleLogin = () => {
        // Add authentication logic here
        // For now, navigate based on user type
        navigation.replace('RoleSelection');
    };

    return (
        <Box flex={1} bg="white">
            {/* Header with wave design */}
            <Box bg="blue.600" h="40%" borderBottomLeftRadius={40} borderBottomRightRadius={40} pt={12} px={6}>
                <VStack space={2} alignItems="center" mt={8}>
                    <Box bg="white" p={4} borderRadius="full" mb={4}>
                        <Icon as={MaterialIcons} name="local-hospital" size={12} color="blue.600" />
                    </Box>
                    <Text fontSize="3xl" fontWeight="bold" color="white">Welcome Back</Text>
                    <Text fontSize="md" color="blue.100">Sign in to continue</Text>
                </VStack>
            </Box>

            {/* Login Form */}
            <VStack flex={1} px={6} space={4} mt={-10}>
                <Box bg="white" borderRadius="2xl" shadow={6} p={6}>
                    <VStack space={4}>
                        {/* Email Input */}
                        <VStack space={2}>
                            <Text fontSize="sm" fontWeight="semibold" color="gray.700">Email Address</Text>
                            <Input
                                value={email ?? ""}
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

                        {/* Password Input */}
                        <VStack space={2}>
                            <Text fontSize="sm" fontWeight="semibold" color="gray.700">Password</Text>
                            <Input
                                value={password}
                                onChangeText={setPassword}
                                placeholder="Enter your password"
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

                        {/* Remember Me & Forgot Password */}
                        <HStack justifyContent="space-between" alignItems="center">
                            <Checkbox
                                value="remember"
                                isChecked={rememberMe}
                                onChange={setRememberMe}
                                colorScheme="blue"
                            >
                                <Text fontSize="sm" color="gray.600">Remember me</Text>
                            </Checkbox>
                            <Pressable>
                                <Text fontSize="sm" color="blue.600" fontWeight="semibold">
                                    Forgot Password?
                                </Text>
                            </Pressable>
                        </HStack>

                        {/* Login Button */}
                        <Button
                            bg="blue.600"
                            borderRadius="xl"
                            py={4}
                            mt={2}
                            onPress={handleLogin}
                            _pressed={{ bg: 'blue.700' }}
                        >
                            <Text color="white" fontSize="md" fontWeight="bold">
                                Sign In
                            </Text>
                        </Button>

                        {/* Or Divider */}
                        <HStack alignItems="center" space={3} my={2}>
                            <Box flex={1} h="1px" bg="gray.300" />
                            <Text fontSize="sm" color="gray.500">OR</Text>
                            <Box flex={1} h="1px" bg="gray.300" />
                        </HStack>

                        {/* Social Login */}
                        <HStack space={3}>
                            <Pressable flex={1} borderWidth={1} borderColor="gray.300" borderRadius="xl" py={3} alignItems="center">
                                <Icon as={MaterialIcons} name="g-translate" size={6} color="red.600" />
                            </Pressable>
                            <Pressable flex={1} borderWidth={1} borderColor="gray.300" borderRadius="xl" py={3} alignItems="center">
                                <Icon as={MaterialIcons} name="facebook" size={6} color="blue.700" />
                            </Pressable>
                            <Pressable flex={1} borderWidth={1} borderColor="gray.300" borderRadius="xl" py={3} alignItems="center">
                                <Icon as={MaterialIcons} name="apple" size={6} color="gray.800" />
                            </Pressable>
                        </HStack>
                    </VStack>
                </Box>

                {/* Sign Up Link */}
                <HStack justifyContent="center" space={2} mt={4}>
                    <Text color="gray.600">Don't have an account?</Text>
                    <Pressable onPress={() => navigation.navigate('Signup')}>
                        <Text color="blue.600" fontWeight="bold">Sign Up</Text>
                    </Pressable>
                </HStack>
            </VStack>
        </Box>
    );
}