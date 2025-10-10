import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, SplashScreen, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { getUser } from '@/lib/auth';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    ...MaterialIcons.font,
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const user = await getUser();
      setIsLoggedIn(!!user);
    };
    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (loaded && isLoggedIn !== null) {
      SplashScreen.hideAsync();
      if (isLoggedIn) {
        router.replace('/(tabs)');
      } else {
        router.replace('/login');
      }
    }
  }, [loaded, isLoggedIn]);

  if (!loaded || isLoggedIn === null) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="book-appointment" options={{ presentation: 'modal', title: 'Book Appointment' }} />
        <Stack.Screen name="(tabs)/_doctor/add-prescription" options={{ presentation: 'modal', title: 'Add Prescription' }} />
        <Stack.Screen name="(tabs)/_doctor/manage-appointment" options={{ presentation: 'modal', title: 'Manage Appointment' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}