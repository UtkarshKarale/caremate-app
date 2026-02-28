import React, { useCallback, useMemo, useState } from 'react';
import { Box, Text, HStack, VStack, ScrollView, Pressable, Icon, Avatar, Spinner } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { findUserById, getAllAppointments, getPendingBills } from '@/lib/api';
import { useAuth } from '@/app/src/screens/context/AuthContext';

type ProfileUser = {
  id?: number | string;
  fullName?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  hospitalName?: string;
  createdOn?: string;
};

export default function ReceptionistProfileScreen({ navigation }: any) {
  const { logout, user } = useAuth();
  const [profile, setProfile] = useState<ProfileUser | null>(null);
  const [todayCount, setTodayCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [pendingBillsCount, setPendingBillsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [userDetails, appointments, pendingBills] = await Promise.all([
        findUserById(String(user.id)),
        getAllAppointments(),
        getPendingBills(),
      ]);

      const todayKey = new Date().toISOString().split('T')[0];
      const todaysAppointments = (appointments || []).filter((apt: any) => {
        const time = apt?.appointmentTime;
        if (!time) return false;
        return new Date(time).toISOString().split('T')[0] === todayKey;
      });

      const pendingAppointments = todaysAppointments.filter((apt: any) => {
        const status = String(apt?.status || '').toUpperCase();
        return status === 'PENDING' || status === 'SCHEDULED' || status === 'CHECK_IN' || status === 'CHECKED_IN';
      });

      setProfile(userDetails || null);
      setTodayCount(todaysAppointments.length);
      setPendingCount(pendingAppointments.length);
      setPendingBillsCount((pendingBills || []).length);
    } catch (error) {
      console.error('Error loading receptionist profile:', error);
      setProfile(null);
      setTodayCount(0);
      setPendingCount(0);
      setPendingBillsCount(0);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile])
  );

  const displayName = useMemo(() => profile?.fullName || profile?.name || user?.name || 'Receptionist', [profile, user?.name]);

  const menuItems = [
    { id: '1', title: 'Edit Profile', icon: 'edit', color: 'blue.600' },
    { id: '2', title: 'Notifications', icon: 'notifications', color: 'green.600' },
    { id: '3', title: 'Settings', icon: 'settings', color: 'gray.600' },
    { id: '4', title: 'Help & Support', icon: 'help', color: 'blue.500' },
    { id: '5', title: 'Logout', icon: 'logout', color: 'red.600' },
  ];

  const handleMenuPress = async (item: any) => {
    if (item.title === 'Logout') {
      await logout();
    }
  };

  return (
    <ScrollView flex={1} bg="gray.50">
      <Box bg="purple.600" pb={12} pt={4} px={4} borderBottomLeftRadius={24} borderBottomRightRadius={24}>
        <HStack justifyContent="space-between" alignItems="center" mb={6}>
          <Text mt={5} fontSize="2xl" fontWeight="bold" color="white">My Profile</Text>
          <Pressable bg="purple.500" p={2} borderRadius="full" onPress={loadProfile}>
            <Icon as={MaterialIcons} name="refresh" size={5} color="white" />
          </Pressable>
        </HStack>
      </Box>

      <Box px={4} mt={-10}>
        <Box bg="white" borderRadius="2xl" shadow={4} p={6} mb={4}>
          {loading ? (
            <VStack alignItems="center" py={6}>
              <Spinner size="lg" color="purple.600" />
              <Text mt={2} color="gray.500">Loading profile...</Text>
            </VStack>
          ) : (
            <VStack alignItems="center" space={3}>
              <Avatar size="2xl" bg="purple.100" borderWidth={4} borderColor="purple.600">
                <Text fontSize="3xl" color="purple.700" fontWeight="bold">
                  {displayName.charAt(0).toUpperCase()}
                </Text>
              </Avatar>
              <VStack alignItems="center">
                <Text fontSize="2xl" fontWeight="bold" textAlign="center">{displayName}</Text>
                <Text fontSize="md" color="gray.600">Receptionist</Text>
                <Text fontSize="sm" color="gray.500" mt={1}>{profile?.email || user?.email || 'No email available'}</Text>
                <Text fontSize="sm" color="gray.500">{profile?.phoneNumber || 'No phone available'}</Text>
              </VStack>

              <HStack space={6} mt={4} w="100%" justifyContent="center">
                <VStack alignItems="center">
                  <Text fontSize="2xl" fontWeight="bold" color="purple.600">{todayCount}</Text>
                  <Text fontSize="xs" color="gray.600">Today Visits</Text>
                </VStack>
                <Box w="1px" bg="gray.300" />
                <VStack alignItems="center">
                  <Text fontSize="2xl" fontWeight="bold" color="orange.600">{pendingCount}</Text>
                  <Text fontSize="xs" color="gray.600">Pending Queue</Text>
                </VStack>
                <Box w="1px" bg="gray.300" />
                <VStack alignItems="center">
                  <Text fontSize="2xl" fontWeight="bold" color="green.600">{pendingBillsCount}</Text>
                  <Text fontSize="xs" color="gray.600">Pending Bills</Text>
                </VStack>
              </HStack>
            </VStack>
          )}
        </Box>

        <VStack space={3} mb={24}>
          {menuItems.map((item) => (
            <Pressable key={item.id} onPress={() => handleMenuPress(item)}>
              <Box bg="white" borderRadius="xl" shadow={1} p={4}>
                <HStack alignItems="center" space={3}>
                  <Box bg={`${item.color.split('.')[0]}.100`} p={3} borderRadius="xl">
                    <Icon as={MaterialIcons} name={item.icon as any} size={6} color={item.color} />
                  </Box>
                  <Text flex={1} fontSize="md" fontWeight="semibold">{item.title}</Text>
                  <Icon as={MaterialIcons} name="chevron-right" size={6} color="gray.400" />
                </HStack>
              </Box>
            </Pressable>
          ))}
        </VStack>
      </Box>
    </ScrollView>
  );
}
