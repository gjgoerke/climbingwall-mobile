import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSharedValue, useAnimatedProps, SharedValue} from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import { Circle } from '@shopify/react-native-skia';
import type { Dispatch, SetStateAction } from 'react';

interface HoldCircleProps {
    x: SharedValue<number>;
    y: SharedValue<number>;
    r: SharedValue<number>;
    isActive: boolean;
    index: number;
    changeSelectedLed: Dispatch<SetStateAction<number>>;
}

// Create animated component from the forwarded ref version

export default function HoldCircle({x, y, r, isActive, index, changeSelectedLed} : HoldCircleProps) {

    return (
        <Circle 
            cx={x}
            cy= {y}
            r={r}
            // stroke={isActive ? "purple" : "black"}
            // strokeWidth={2}
        />
    );
}
