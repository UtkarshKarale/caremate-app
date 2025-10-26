import React from 'react';
import { Box, Text, VStack, Icon, Button } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { BackHandler } from 'react-native';

export default function SuccessScreen({ navigation }: any) {
  // Override back button behavior
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.popToTop(); // Go back to the first screen (Home)
        return true; // Prevent default back action
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );

      return () => subscription.remove(); // Proper cleanup
    }, [navigation])
  );

  const handleGoHome = () => {
    navigation.popToTop(); // Navigate to Home
  };

  return (
    <Box flex={1} bg="white" justifyContent="center" alignItems="center" p={4}>
      <VStack space={6} alignItems="center">
        <Icon as={MaterialIcons} name="check-circle" size="6xl" color="green.500" />
        <Text fontSize="3xl" fontWeight="bold" color="green.600" textAlign="center">
          Appointment Confirmed!
        </Text>
        <Text fontSize="lg" color="gray.600" textAlign="center">
          Your appointment has been successfully booked.
        </Text>
        <Button
          onPress={handleGoHome}
          colorScheme="blue"
        >
          Go to Home
        </Button>
      </VStack>
    </Box>
  );
}
