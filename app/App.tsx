import React from 'react';
import { NativeBaseProvider, extendTheme } from 'native-base';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from '@/app/src/screens/context/AuthContext';
import { ToastProvider } from '@/app/src/screens/context/ToastContext';
import { patchNativeBaseOutlineBug } from "@/app/src/fixes/nativeBaseFix";

patchNativeBaseOutlineBug();

const theme = extendTheme({
    components: {
        Button: {
            baseStyle: {
                _focus: {
                    bg: 'blue.700',
                    outlineWidth: undefined,
                },
            },
        },
        Pressable: {
            baseStyle: {
                _focus: {
                    outlineWidth: undefined,
                },
            },
        },
    },
});

export default function App() {
    return (
        <SafeAreaProvider>
            <NativeBaseProvider theme={theme}>
                <AuthProvider>
                    <ToastProvider>
                        <NavigationContainer>
                            <AppNavigator />
                        </NavigationContainer>
                    </ToastProvider>
                </AuthProvider>
            </NativeBaseProvider>
        </SafeAreaProvider>
    );
}