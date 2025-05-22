import { Gesture, GestureDetector } from "react-native-gesture-handler";
import type { SharedValue } from "react-native-reanimated";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { SetStateAction, Dispatch } from "react";
import type { Hold } from "@/app/(app)/(tabs)/(boards)/board_configuration";
import { highlightLed } from "@/services/lights";
interface Props {
    hold: Hold;
    isActive: boolean;
    index: number;
    setSelectedLed: Dispatch<SetStateAction<number>>;
    deleteHoldCircle: (index: number) => void;
    canvasWidth: number;
    canvasHeight: number;
}

export default function CircleGestureHandler ({ 
        hold,
        isActive, 
        index, 
        setSelectedLed,
        deleteHoldCircle, 
        canvasHeight, 
        canvasWidth 
    } : Props) {
    
    const x = hold.x;
    const y = hold.y;
    const r = hold.r;
    // Style
    const style = useAnimatedStyle(() => ({
        height: 2 * r.value,
        width: 2 * r.value,
        borderRadius: r.value,
        backgroundColor: 'rgba(0,0,0,0)',
        borderWidth:0.1,
        borderColor: '#adbce6', // stroke
        position: 'absolute',
        top: y.value,
        left: x.value,
        transform: [
            { translateX: -r.value },  // Center horizontally
            { translateY: -r.value },  // Center vertically
        ]
    }));

    // Gestures
    const singleTap = Gesture.Tap()
        .onEnd(() => {
            highlightLed(index + 1)
            setSelectedLed(index + 1)
        })
        .runOnJS(true);

    const doubleTap = Gesture.Tap()
    .maxDuration(250)
    .numberOfTaps(2)
    .onEnd(() => {
      deleteHoldCircle(index);
    })
    .enabled(isActive)
    .runOnJS(true);

    const drag = Gesture.Pan()
        .onChange(event => {
            const newX = x.value + event.changeX;
            const newY = y.value + event.changeY;
            if(newY < canvasHeight - r.value && newY > r.value) {
                y.value = newY;
            }
            if(newX < canvasWidth - r.value && newX > r.value ) {
                x.value = newX;
            }
            console.log(x.value/canvasWidth, y.value/canvasHeight)
        })
        .enabled(isActive);
    
    const gestures = Gesture.Exclusive(drag, doubleTap, singleTap);

    return(
        <GestureDetector gesture={gestures}>
            <Animated.View style={style}/>
        </GestureDetector>
    );
}