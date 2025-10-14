import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { Icon, Box, Spinner, Text, VStack  } from 'native-base';

// Auth Screens
import LoginScreen from '@/app/src/screens/auth/LoginScreen';
import SignupScreen from '@/app/src/screens/auth/SignupScreen';
import ReportsAnalyticsScreen from '@/app/src/screens/Admin/ReportsAnalyticsScreen';
import AdminProfileScreen from '@/app/src/screens/Admin/AdminProfileScreen';

// Billing Screens
import BillingScreen from '../screens/Receptionist/BillingScreen';
import GenerateBillScreen from '../screens/Receptionist/GenerateBillScreen';
import BillPreviewScreen from '../screens/Receptionist/BillPreviewScreen';
import PaymentAcceptanceScreen from '../screens/Receptionist/PaymentAcceptanceScreen';
import PaymentSuccessScreen from '../screens/Receptionist/PaymentSuccessScreen';
import BillingHistoryScreen from '../screens/Receptionist/BillingHistoryScreen';
import PendingPaymentsScreen from '../screens/Receptionist/PendingPaymentsScreen';


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
import UserManagementScreen from "@/app/src/screens/Admin/UserManagementScreen";
import AdminHomeScreen from "@/app/src/screens/Admin/AdminHomeScreen";
import {useAuth} from "@/app/src/screens/context/AuthContext";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

//billing stack
function BillingStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="BillingMain" component={BillingScreen} />
            <Stack.Screen name="GenerateBill" component={GenerateBillScreen} />
            <Stack.Screen name="BillPreview" component={BillPreviewScreen} />
            <Stack.Screen name="PaymentAcceptance" component={PaymentAcceptanceScreen} />
            <Stack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} />
            <Stack.Screen name="BillingHistory" component={BillingHistoryScreen} />
            <Stack.Screen name="PendingPayments" component={PendingPaymentsScreen} />
        </Stack.Navigator>
    );
}
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
                name="Billing"
                component={BillingStack}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon as={MaterialIcons} name="receipt" size={size} color={color} />
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

// admin

function HomeStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="AdminHomeMain" component={AdminHomeScreen} />
            <Stack.Screen name="UserManagement" component={UserManagementScreen} />
        </Stack.Navigator>
    );
}

function AdminTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#dc2626',
                tabBarInactiveTintColor: '#9ca3af',
                tabBarStyle: {
                    paddingBottom: 5,
                    paddingTop: 5,
                    height: 60,
                },
            }}
        >
            <Tab.Screen
                name="AdminHome"
                component={HomeStack}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Icon as={MaterialIcons} name="dashboard" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Users"
                component={UserManagementScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon as={MaterialIcons} name="people" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Reports"
                component={ReportsAnalyticsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon as={MaterialIcons} name="analytics" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="AdminProfile"
                component={AdminProfileScreen}
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
    const { user, isLoading } = useAuth();


    if (isLoading) {
        return (
            <Box flex={1} justifyContent="center" alignItems="center" bg="white">
                <VStack space={4} alignItems="center">
                    <Spinner size="lg" color="blue.600" />
                    <Text fontSize="md" color="gray.600">Loading...</Text>
                </VStack>
            </Box>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!user ? (
                    // ========== NOT LOGGED IN ==========
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Signup" component={SignupScreen} />
                    </>
                ) : (
                    // ========== LOGGED IN - ROLE BASED ==========
                    <>
                        {user?.role.toLowerCase() === 'user' ? (
                            <Stack.Screen name="PatientApp" component={PatientTabNavigator} />
                        ) : user?.role === 'doctor' ? (
                            <Stack.Screen name="DoctorApp" component={DoctorTabNavigator} />
                        ) : user?.role === 'receptionist' ? (
                            <Stack.Screen name="ReceptionistApp" component={ReceptionistTabNavigator} />
                        ) : user?.role.toLowerCase() === 'admin' ? (
                            <Stack.Screen name="AdminApp" component={AdminTabNavigator} />
                        ) : (
                            <Stack.Screen name="PatientApp" component={PatientTabNavigator} />
                        )}
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}



