import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { Icon } from 'native-base';

// Auth Screens
import LoginScreen from '@/app/src/screens/auth/LoginScreen';
import SignupScreen from '@/app/src/screens/auth/SignupScreen';
import RoleSelectionScreen from '@/app/src/screens/auth/RoleSelectionScreen';

// Patient Screens
import HomeScreen from '../screens/HomeScreen';
import PatientProfileScreen from '../screens/PatientProfileScreen';
import MedicalRecordsScreen from '../screens/MedicalRecordsScreen';
import DoctorSelectionScreen from '../screens/BookAppointment/DoctorSelectionScreen';
import TimeSlotSelectionScreen from '../screens/BookAppointment/TimeSlotSelectionScreen';
import ConfirmationScreen from '../screens/BookAppointment/ConfirmationScreen';

// Doctor Screens
import DoctorHomeScreen from '../screens/Doctor/DoctorHomeScreen';
import DoctorAppointmentsScreen from '../screens/Doctor/DoctorAppointmentsScreen';
import DoctorPatientsScreen from '../screens/Doctor/DoctorPatientsScreen';
import DoctorProfileScreen from '../screens/Doctor/DoctorProfileScreen';

// Receptionist Screens
import ReceptionistHomeScreen from '../screens/Receptionist/ReceptionistHomeScreen';
import CheckInScreen from '../screens/Receptionist/CheckInScreen';
import ReceptionistAppointmentsScreen from '../screens/Receptionist/ReceptionistAppointmentsScreen';
import PatientRegistryScreen from '../screens/Receptionist/PatientRegistryScreen';
import ReceptionistProfileScreen from '../screens/Receptionist/ReceptionistProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Patient Bottom Tab Navigator
function PatientTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#2563eb',
                tabBarInactiveTintColor: '#9ca3af',
                tabBarStyle: {
                    paddingBottom: 5,
                    paddingTop: 5,
                    height: 60,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon as={MaterialIcons} name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Records"
                component={MedicalRecordsScreen}
                options={{
                    tabBarLabel: 'Records',
                    tabBarIcon: ({ color, size }) => (
                        <Icon as={MaterialIcons} name="folder" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={PatientProfileScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon as={MaterialIcons} name="person" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

// Doctor Bottom Tab Navigator
function DoctorTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#16a34a',
                tabBarInactiveTintColor: '#9ca3af',
                tabBarStyle: {
                    paddingBottom: 5,
                    paddingTop: 5,
                    height: 60,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
            }}
        >
            <Tab.Screen
                name="DoctorHome"
                component={DoctorHomeScreen}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Icon as={MaterialIcons} name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="DoctorAppointments"
                component={DoctorAppointmentsScreen}
                options={{
                    tabBarLabel: 'Appointments',
                    tabBarIcon: ({ color, size }) => (
                        <Icon as={MaterialIcons} name="calendar-today" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="DoctorPatients"
                component={DoctorPatientsScreen}
                options={{
                    tabBarLabel: 'Patients',
                    tabBarIcon: ({ color, size }) => (
                        <Icon as={MaterialIcons} name="people" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="DoctorProfile"
                component={DoctorProfileScreen}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <Icon as={MaterialIcons} name="person" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

// Receptionist Bottom Tab Navigator
function ReceptionistTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#9333ea',
                tabBarInactiveTintColor: '#9ca3af',
                tabBarStyle: {
                    paddingBottom: 5,
                    paddingTop: 5,
                    height: 60,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
            }}
        >
            <Tab.Screen
                name="ReceptionistHome"
                component={ReceptionistHomeScreen}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Icon as={MaterialIcons} name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="CheckIn"
                component={CheckInScreen}
                options={{
                    tabBarLabel: 'Check-In',
                    tabBarIcon: ({ color, size }) => (
                        <Icon as={MaterialIcons} name="person-add" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="ReceptionistAppointments"
                component={ReceptionistAppointmentsScreen}
                options={{
                    tabBarLabel: 'Appointments',
                    tabBarIcon: ({ color, size }) => (
                        <Icon as={MaterialIcons} name="calendar-today" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="ReceptionistProfile"
                component={ReceptionistProfileScreen}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <Icon as={MaterialIcons} name="person" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

// Main Stack Navigator
export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}
                initialRouteName="Login"
            >
                {/* Auth Screens */}
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Signup" component={SignupScreen} />
                <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />

                {/* Patient Screens */}
                <Stack.Screen name="PatientTabs" component={PatientTabNavigator} />
                <Stack.Screen name="DoctorSelection" component={DoctorSelectionScreen} />
                <Stack.Screen name="TimeSlotSelection" component={TimeSlotSelectionScreen} />
                <Stack.Screen name="Confirmation" component={ConfirmationScreen} />

                {/* Doctor Screens */}
                <Stack.Screen name="DoctorTabs" component={DoctorTabNavigator} />

                {/* Receptionist Screens */}
                <Stack.Screen name="ReceptionistTabs" component={ReceptionistTabNavigator} />
                <Stack.Screen name="PatientRegistry" component={PatientRegistryScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
