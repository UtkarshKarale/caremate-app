// src/fixes/nativeBaseFix.ts
import { Platform } from 'react-native';

// Monkey patch for NativeBase outlineWidth crash on Android RN 0.81+
export const patchNativeBaseOutlineBug = () => {
    if (Platform.OS === 'android') {
        const oldSetNativeProps = (global as any).__fbBatchedBridgeConfig;

        // Prevent any outlineWidth string injection
        const fixOutline = (style: any) => {
            if (style && typeof style.outlineWidth === 'string') {
                style.outlineWidth = Number(style.outlineWidth) || 0;
            }
        };

        const origCreateElement = global.ReactNativeElement_create || global.createElement;
        if (origCreateElement) {
            global.createElement = (...args: any) => {
                const element = origCreateElement(...args);
                if (element?.props?.style) fixOutline(element.props.style);
                return element;
            };
        }
    }
};
