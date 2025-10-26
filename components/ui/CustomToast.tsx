import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface ToastProps {
    message: string;
    type: 'success' | 'error';
    visible: boolean;
    onHide: () => void;
}

const CustomToast = ({ message, type, visible, onHide }: ToastProps) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();

            const timer = setTimeout(() => {
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }).start(() => onHide());
            }, 3000);

            return () => clearTimeout(timer);
        } else {
            fadeAnim.setValue(0);
        }
    }, [visible, fadeAnim, onHide]);

    if (!visible) {
        return null;
    }

    const backgroundColor = type === 'success' ? '#10b981' : '#ef4444';
    const icon = type === 'success' ? 'check-circle' : 'error';

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim, backgroundColor }]}>
            <MaterialIcons name={icon} size={24} color="white" />
            <Text style={styles.message}>{message}</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 50,
        left: 20,
        right: 20,
        padding: 16,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    message: {
        color: 'white',
        marginLeft: 12,
        fontSize: 16,
    },
});

export default CustomToast;
