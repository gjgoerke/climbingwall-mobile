import { useRef } from "react";
import { StyleSheet, View, Text, LayoutChangeEvent } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated";

import CircleButton from "./CircleButton";

interface props {
    ledIndex: number;
    ledCount: number;
    leftOnPress: () => void;
    rightOnPress: () => void;
    handleSubmit: () => void;
    canvasHeight: number;
    canvasWidth: number;
}

export default function LedConfig({
    ledIndex, 
    ledCount, 
    leftOnPress, 
    rightOnPress, 
    handleSubmit,
    canvasHeight, 
    canvasWidth
} : props) {

    // Style
    const x_cord = useSharedValue(15);
    const y_cord = useSharedValue(15);
    const componentHeight = useSharedValue(0);
    const componentWidth = useSharedValue(0);
    const animatedStyle = useAnimatedStyle(() => ({
        top: y_cord.value,
        left: x_cord.value,
        position: 'absolute'
    })); 

    const styles = StyleSheet.create({
        container: {
            alignItems: 'center', 
            backgroundColor: '#fff',
            borderRadius: 20,
            elevation: 8,
            padding: 12,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 4,
            },
            shadowOpacity: 0.15,
            shadowRadius: 6,
        },
        buttonsContainer: {
            gap: 15,
            flexDirection: 'row',
            marginTop: 8,
        },
        ledCounter: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            paddingBottom: 4,
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(0,0,0,0.1)',
            justifyContent: 'center'
        },
        ledText: {
            fontSize: 18,
            fontWeight: '500',
            color: '#424242',
            lineHeight: 24
        }
    });

    const handleLayout = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        componentWidth.value = width;
        componentHeight.value = height;
    }

    const dragGesture = Gesture.Pan()
        .onChange((event) => {
            const newY = y_cord.value + event.changeY;
            const newX = x_cord.value + event.changeX;
            if(newX > 0 && newX < canvasWidth - componentWidth.value) {
                x_cord.value = newX;
            }
            if(newY > 0 && newY < canvasHeight - componentHeight.value) {
                y_cord.value = newY;
            }
        })
        .onEnd(() => {
            console.log('drag!');
        });

    return(
        <Animated.View style={[animatedStyle, styles.container]} onLayout={handleLayout}>
            <GestureDetector gesture={dragGesture}>
                <View style={styles.ledCounter}>
                    <MaterialCommunityIcons 
                        name="led-outline" 
                        size={24} 
                        color="#424242"
                    />
                    <Text style={styles.ledText}>{ledIndex}</Text>
                </View>
            </GestureDetector>
            <View style={styles.buttonsContainer}>
                <CircleButton 
                    onPress={leftOnPress} 
                    icon="keyboard-arrow-left"
                />
                {ledIndex < ledCount ? 
                    <CircleButton 
                        onPress={rightOnPress} 
                        icon="keyboard-arrow-right"
                    />
                :
                    <CircleButton
                        onPress={handleSubmit}
                        icon="check"
                    />
                }
                
            </View>
        </Animated.View>
        
    );
}