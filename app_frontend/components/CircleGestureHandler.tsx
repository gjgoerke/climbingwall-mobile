import { Gesture, GestureDetector } from "react-native-gesture-handler";
import type { SharedValue } from "react-native-reanimated";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { SetStateAction, Dispatch } from "react";

interface Props {
    x: SharedValue<number>;
    y: SharedValue<number>;
    r: SharedValue<number>;
    isActive: boolean;
    index: number;
    changeSelectedLed: Dispatch<SetStateAction<number>>;
}

export default function CircleGestureHandler ({ x, y, r, isActive, index, changeSelectedLed } : Props) {

    // Style
    const style = useAnimatedStyle(() => ({
        height: 2 * r.value,
        width: 2 * r.value,
        borderRadius: r.value,
        backgroundColor: 'rgba(0,0,0,0.7)',
        position: 'absolute',
        top: y.value,
        left: x.value,
        transform: [
            { translateX: -r.value },  // Center horizontally
            { translateY: -r.value },  // Center vertically
        ]
    }));

    // Gestures
    const tap = Gesture.Tap()
        .onEnd(() => changeSelectedLed(index + 1))
        .runOnJS(true);

    const drag = Gesture.Pan()
        .onChange(event => {
            x.value += event.changeX;
            y.value += event.changeY;
        })
        .enabled(isActive);
    
    const gestures = Gesture.Exclusive(drag, tap);

    return(
        <GestureDetector gesture={gestures}>
            <Animated.View style={style}/>
        </GestureDetector>
    );
}