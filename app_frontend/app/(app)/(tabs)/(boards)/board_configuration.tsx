import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useState, useRef } from 'react';
import { Appbar, Button } from "react-native-paper";
import { View, StyleSheet, LayoutChangeEvent } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { Canvas, Image, useImage } from "@shopify/react-native-skia";
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { SharedValue, useSharedValue } from 'react-native-reanimated';

import LedConfig from "@/components/LedConfig";
import api from "@/services/api";
import AnimatedCircleGestureHandlers from "@/components/AnimatedGestureHandlers";
import AnimatedHoldCircles from "@/components/AnimatedHoldCircles";
import { screenCoordsToImg } from "@/services/image_drawing";

// x,y values are absolute screen coordiinates.
export type Hold = {
    x: SharedValue<number>;
    y: SharedValue<number>;
    r: SharedValue<number>;
}

interface ImageUpload {
    uri: string;
    type: string;
    name: string;
}

export default function BoardConfiguration() {
    const params = useLocalSearchParams();
    const [image, setImage] = useState<string|null>(null);
    const [imageB64, setImageB64] = useState<string|null>(null);
    const skiaImage = useImage(image);
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
    const canvasHeightRef = useRef(0);
    const canvasWidthRef = useRef(0);
    const ledCount = Number(params.ledQuantity);
    const [holds, setHolds] = useState<Hold[]>(Array(ledCount).fill(0).map(() => ({
        x: useSharedValue(0),
        y: useSharedValue(0),
        r: useSharedValue(20),
    })));
    const [enabledHolds, setEnabledHolds] = useState<boolean[]>(Array(ledCount).fill(false));
    const scales = Array(ledCount).fill(0).map(() => useSharedValue<number>(1));
    const savedScales = Array(ledCount).fill(0).map(() => useSharedValue<number>(1));
    const [selectedLed, setSelectedLed] = useState<number>(1);

    // Need the following:
        // Loading spinner while submitting
        // Post basic board data to the board endpoint (1 function)
        // Post LedConfig data if applicable

    const createBoard = async () => {
        try {
            const formData = new FormData();
            formData.append('name', params.name as string);
            formData.append('description', params.description as string || "");
            formData.append('angle', params.angle as string);
            formData.append('city', params.city as string);
            formData.append('led_quantity', params.ledQuantity as string);
            
            if (params.latitude) formData.append('latitude', params.latitude as string);
            if (params.longitude) formData.append('longitude', params.longitude as string);

            if (image) {
                const imageUpload: ImageUpload = {
                    uri:  image,
                    type: 'image/jpeg',
                    name: 'board_image.jpg'
                };
                formData.append('image', imageUpload as unknown as Blob);
            }

            console.log('FormData contents:', Object.fromEntries(formData as any));

            const response = await api.post('/boards/create/', formData, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
                transformRequest: (data) => data,
            });
            
            return response;
        } catch(error) {
            throw error;
        }
    }

    const handleBoardCreate = async () => {
        const createBoardResponse = await createBoard();
        try {
            console.log('createBoardResponse: ', createBoardResponse?.data);
            const ledConfigData = holds.map((hold, index) => {
                if(enabledHolds[index]) {
                    const {img_x, img_y, img_r} = screenCoordsToImg(
                        hold.x.value, 
                        hold.y.value,
                        canvasWidthRef.current,
                        canvasHeightRef.current,
                        skiaImage?.width() || 0,
                        skiaImage?.height() || 0,
                        hold.r.value
                    )
                    return {
                        led_number: index + 1,
                        relative_x: img_x,
                        relative_y: img_y,
                        radius: img_r
                    }
                }
            }).filter((hold) => !!hold);
            console.log('LED config data: ', ledConfigData);
            const ledConfigResponse = await api.post(
                '/boards/' + String(createBoardResponse?.data.id) + '/led-config/', {
                    board: createBoardResponse.data.id,
                    hold_data: ledConfigData
                },
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
            }});
            if(ledConfigResponse.status === 201 || ledConfigResponse.status === 200) {
                router.replace('/(tabs)/(boards)');
            }
            console.log('ledConfigResponse status: ', ledConfigResponse.status)
            
            return ledConfigResponse;
        } catch (error) {
            
        }
    }

    const deleteHoldCircle = (index: number) => {
        const newHoldArr = [...holds];
        newHoldArr[index].x.value = 0;
        newHoldArr[index].y.value = 0;
        newHoldArr[index].r.value = 20;
        setHolds(newHoldArr);
        const newEnabledArr = [...enabledHolds];
        newEnabledArr[index] = false;
        setEnabledHolds(newEnabledArr);
    }

    // Image handling
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          quality: 1,
          base64: true
        });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
            setImageB64(result.assets[0].base64 || null);
        }
    }

    const handleLayout = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        canvasWidthRef.current = width;
        canvasHeightRef.current = height;
        const imgAspect = skiaImage?.height() && skiaImage?.width() 
        ? skiaImage.height() / skiaImage.width() 
        : height / width;
        setImageDimensions({ width, height: width * imgAspect });
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
            holds[selectedLed - 1].r.value = 20 * scales[selectedLed - 1].value;
        })
        .onEnd((_event, success) => {
            savedScales[selectedLed - 1].value = scales[selectedLed - 1].value;
            if(success) {
                console.log('pinch!')
            }})
    
    const tapGesture = Gesture.Tap()
            .onEnd((event) => {
                console.log('tap!')
                if(!enabledHolds[selectedLed - 1]) {
                    console.log('tap: selected LED: ', selectedLed)

                    const newHoldsArr = [...holds]
                    newHoldsArr[selectedLed - 1].x.value = event.x;
                    newHoldsArr[selectedLed - 1].y.value = event.y;
                    setHolds(newHoldsArr);

                    const newEnabledArr = [...enabledHolds];
                    newEnabledArr[selectedLed - 1] = true;
                    setEnabledHolds(newEnabledArr);
                   
                }
            })
            .runOnJS(true);

    const gestures = Gesture.Exclusive(pinchGesture, tapGesture);

    return (
        <>
            <Appbar.Header>
                <Appbar.Action icon={'arrow-left'} onPress={() => {router.back();}}/>
                <Appbar.Content title="Configure LEDs"/>
                {image && <Appbar.Action icon={'help-circle-outline'}/>}
            </Appbar.Header>
            {!image ? 
                <Button onPress={pickImage} mode='outlined'>Choose a photo</Button>
            :
            <View style={{flex: 1}}>
                <GestureHandlerRootView style={{flex: 1}}>
                    <GestureDetector gesture={gestures} >
                        <Canvas 
                            style={styles.imageContainer}
                            onLayout={handleLayout}>
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
                                <AnimatedHoldCircles holds={holds} enabledHolds={enabledHolds} selectedLed={selectedLed}/>
                            )}
                        </Canvas>
                    </GestureDetector>

                    <AnimatedCircleGestureHandlers 
                        holds={holds}
                        enabledHolds={enabledHolds}
                        selectedLed={selectedLed}
                        setSelectedLed={setSelectedLed}
                        canvasHeight={canvasHeightRef.current}
                        canvasWidth={canvasWidthRef.current}
                        deleteHoldCircle={deleteHoldCircle}
                    />
                    
                </GestureHandlerRootView>
                <LedConfig 
                    ledIndex={selectedLed}
                    ledCount={ledCount}
                    leftOnPress={leftOnPress}
                    rightOnPress={rightOnPress}
                    handleSubmit={handleBoardCreate}
                    canvasHeight={canvasHeightRef.current}
                    canvasWidth={canvasWidthRef.current}
                />
            </View>
            }
        </>
    )
}

const styles = StyleSheet.create({
    imageContainer: {
        flex: 1,
        width: '100%',
        height: '100%'
    }
})