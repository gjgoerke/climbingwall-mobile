import { router, useLocalSearchParams } from "expo-router";
import { useState, useRef } from 'react';
import { Appbar, Button } from "react-native-paper";
import { View, StyleSheet, LayoutChangeEvent, Platform} from "react-native";
import * as ImagePicker from 'expo-image-picker';

import { Canvas, Circle, Rect, Mask, Group, Image, useImage } from "@shopify/react-native-skia";
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { runOnJS, SharedValue, useSharedValue } from 'react-native-reanimated';
import HoldCircle from "@/components/HoldCircle";
import LedConfig from "@/components/LedConfig";
import CircleGestureHandler from "@/components/CircleGestureHandler";


type Hold = {
    enabled: true;
    x: SharedValue<number>;
    y: SharedValue<number>;
    r: SharedValue<number>;
} | {
    enabled:false
}

export default function BoardConfiguration() {
    const params = useLocalSearchParams();
    const [image, setImage] = useState<string|null>(null);
    const skiaImage = useImage(image);
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
    const ledCount = Number(params.ledQuantity);
    // Radius of each HoldCircle, needs to be its own SharedValue instance.
    const radii = Array(ledCount).fill(0).map(() => useSharedValue<number>(20));  
    const positions = Array(ledCount).fill(0).map(() => ({
        x: useSharedValue(0),
        y: useSharedValue(0)
    }));
    const [holds, setHolds] = useState<Hold[]>(Array(ledCount).fill({enabled: false}));
    const scales = Array(ledCount).fill(0).map(() => useSharedValue<number>(1));
    const savedScales = Array(ledCount).fill(0).map(() => useSharedValue<number>(1));
    const [selectedLed, setSelectedLed] = useState<number>(1);

    // Image handling
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          quality: 1,
        });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    }

    const handleImageLayout = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        setImageDimensions({ width, height });
    }

    // Buttons
    const leftOnPress = () => {
        if (selectedLed > 1) {
            setSelectedLed(selectedLed - 1);
        }
    }

    const rightOnPress = () => {
        if (selectedLed < ledCount) {
            setSelectedLed(selectedLed + 1);
        }
    }

    // Gestures 
    const pinchGesture = Gesture.Pinch()
        .onBegin(()=> {})
        .onUpdate((e) => {
            scales[selectedLed - 1].value = savedScales[selectedLed - 1].value * e.scale;
            radii[selectedLed - 1].value = 20 * scales[selectedLed - 1].value;
        })
        .onEnd((_event, success) => {
            savedScales[selectedLed - 1].value = scales[selectedLed - 1].value;
            if(success) {
                console.log('pinch!')
            }})
    
    const tapGesture = Gesture.Tap()
            .onEnd((event) => {
                console.log('tap!')
                if(!holds[selectedLed - 1].enabled) {
                    positions[selectedLed - 1].x.value = event.x;
                    positions[selectedLed - 1].y.value = event.y;
                    console.log('tap: selected LED: ', selectedLed)
                    const newHoldsArr = [...holds]
                    newHoldsArr[selectedLed - 1] = {
                        enabled: true, 
                        x: positions[selectedLed - 1].x, 
                        y: positions[selectedLed - 1].y, 
                        r: radii[selectedLed - 1] 
                    }
                   setHolds(newHoldsArr);
                }
            }).runOnJS(true);

            const gestures = Gesture.Exclusive(pinchGesture, tapGesture);

    return (
        <>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => {router.back();}} />
                <Appbar.Content title="Configure LEDs"/>
            </Appbar.Header>
            {!image ? 
                <Button onPress={pickImage} mode='outlined'>Choose a photo</Button>
            :
            <View style={{flex: 1}}>
                <GestureHandlerRootView style={{flex: 1}}>
                    <GestureDetector gesture={gestures}>
                        <Canvas 
                            style={styles.imageContainer}
                            onLayout={handleImageLayout}>
                            {skiaImage && (
                                <Image 
                                    image={skiaImage}
                                    fit="contain"
                                    rect={{
                                        x: 0,
                                        y: 0,
                                        width: imageDimensions.width,
                                        height: imageDimensions.height
                                    }}
                                />
                            )}
                            {imageDimensions.width > 0 && imageDimensions.height > 0 && (
                                <Group>
                                    {holds.filter((hold) => hold.enabled).map((hold, index) => (
                                        <HoldCircle
                                            key={index}
                                            index={index}
                                            x={hold.x}
                                            y={hold.y}
                                            r={radii[index]}
                                            isActive={index == selectedLed - 1}
                                            changeSelectedLed={setSelectedLed}
                                        />
                                    ))}
                                </Group>
                            )}
                        </Canvas>
                        </GestureDetector>
                        {holds.filter((hold) => hold.enabled).map((hold, index) => (
                                        <CircleGestureHandler
                                            key={index}
                                            index={index}
                                            x={hold.x}
                                            y={hold.y}
                                            r={radii[index]}
                                            isActive={index == selectedLed - 1}
                                            changeSelectedLed={setSelectedLed}
                                        />
                                    ))}
                    
                </GestureHandlerRootView>
                <LedConfig 
                imgWidth={imageDimensions.width} 
                imgHeight = {imageDimensions.height}
                ledIndex={selectedLed}
                leftOnPress={leftOnPress}
                rightOnPress={rightOnPress}/>
            </View>
            }
        </>
    )
}

const styles = StyleSheet.create({
    imageContainer: {
        flex: 1,
        backgroundColor: 'black',
        ...StyleSheet.absoluteFillObject,
    }
})