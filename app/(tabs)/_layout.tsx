import { Tabs, useFocusEffect, Redirect } from 'expo-router';
import React, { useState, useCallback } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getUser } from '@/lib/auth';
import { User } from '@/lib/schema';

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const [user, setUser] = useState<User | null>(null);
    const [loadingUser, setLoadingUser] = useState(true);

    useFocusEffect(
        useCallback(() => {
            const fetchUser = async () => {
                const loggedInUser = await getUser();
                setUser(loggedInUser);
                setLoadingUser(false);
            };
            fetchUser();
        }, [])
    );

    if (loadingUser) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!user) {
        return <Redirect href="/login" />;
    }

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarStyle: {
                    backgroundColor: Colors[colorScheme ?? 'light'].background,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={28} name="house.fill" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="my-appointments"
                options={{
                    title: 'Appointments',
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={28} name="calendar" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={28} name="person.fill" color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
