import { Tabs, useFocusEffect } from 'expo-router';
import React, { useState, useCallback } from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getRole } from '@/lib/auth';

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const [userRole, setUserRole] = useState<string | null>(null);

    useFocusEffect(
        useCallback(() => {
            const fetchRole = async () => {
                const role = await getRole();
                setUserRole(role);
            };
            fetchRole();
        }, [])
    );

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                headerShown: false,
                tabBarButton: HapticTab,
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
                }}
            />

            {userRole === 'ADMIN' && (
                <Tabs.Screen
                    name="admin"
                    options={{
                        title: 'Users',
                        tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.2.fill" color={color} />,
                    }}
                />
            )}

            {userRole === 'USER' && (
                <Tabs.Screen
                    name="my-appointments"
                    options={{
                        title: 'My Appointments',
                        tabBarIcon: ({ color }) => <IconSymbol size={28} name="calendar" color={color} />,
                    }}
                />
            )}

            {(userRole === 'DOCTOR' || userRole === 'RECEPTIONIST') && (
                <Tabs.Screen
                    name="doctor"
                    options={{
                        title: 'Dashboard',
                        tabBarIcon: ({ color }) => <IconSymbol size={28} name="square.grid.2x2.fill" color={color} />,
                    }}
                />
            )}

            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
                }}
            />
        </Tabs>
    );
}