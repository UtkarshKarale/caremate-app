import React from 'react';
import { NativeBaseProvider } from 'native-base';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
    return (
        <SafeAreaProvider>
            <NativeBaseProvider>
                <AppNavigator />
            </NativeBaseProvider>
        </SafeAreaProvider>
    );
}