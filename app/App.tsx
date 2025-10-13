import React from 'react';
import { NativeBaseProvider, extendTheme } from 'native-base';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from '@/app/src/screens/context/AuthContext';
import {patchNativeBaseOutlineBug} from "@/app/src/fixes/nativeBaseFix";

patchNativeBaseOutlineBug();
// 🩹 Patch to prevent "outlineWidth string→number" crash on Android (RN 0.81+)
const theme = extendTheme({
    components: {
        Input: {
            baseStyle: {
                _focus: {
                    borderColor: 'blue.600',
                    bg: 'white',
                    outlineWidth: undefined, // 👈 remove outlineWidth
                },
            },
        },
        Button: {
            baseStyle: {
                _focus: {
                    bg: 'blue.700',
                    outlineWidth: undefined, // 👈 remove outlineWidth
                },
            },
        },
        Pressable: {
            baseStyle: {
                _focus: {
                    outlineWidth: undefined, // 👈 remove outlineWidth
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
                    <AppNavigator />
                </AuthProvider>
            </NativeBaseProvider>
        </SafeAreaProvider>
    );
}
