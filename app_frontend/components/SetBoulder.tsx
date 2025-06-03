import React, { Dispatch, SetStateAction } from 'react';
import { Canvas, Circle, Image, Paint, useImage } from "@shopify/react-native-skia";
import { useEffect, useState } from "react";
import { StyleSheet, LayoutChangeEvent } from "react-native";
import { useAnimatedStyle } from "react-native-reanimated";
import Animated from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

import { useBoard } from "@/context/BoardContext";
import { Boulder, LedConfig } from "@/types/models";
import type { BoulderHold } from '@/app/(app)/(tabs)/(boulders)/set_boulder';
import { imgCoordsToScreen } from "@/services/image_drawing";

const styles = StyleSheet.create({
    canvas: {
        flex: 1,
    }
});

interface CircleOverlayProps {
    hold: BoulderHold;
    boulderHolds: BoulderHold[];
    setBoulderHolds: Dispatch<SetStateAction<BoulderHold[]>>;
    cycleHoldType: (hold: BoulderHold, boulderHolds: BoulderHold[]) => void;
    canvasWidth: number;
    canvasHeight: number;
    imgWidth: number;
    imgHeight: number;
}

const CircleOverlay = ({ 
    hold,
    boulderHolds,
    cycleHoldType, 
    canvasWidth, 
    canvasHeight, 
    imgWidth, 
    imgHeight 
}: CircleOverlayProps) => {

    const screenCoords = imgCoordsToScreen(
        hold.relative_x,
        hold.relative_y,
        canvasWidth,
        canvasHeight,
        imgWidth,
        imgHeight,
        hold.radius
    );

    const gestureStyle = useAnimatedStyle(() => ({
        height: 2 * screenCoords.screen_r + 2,
        width: 2 * screenCoords.screen_r + 2,
        borderRadius: screenCoords.screen_r + 1,
        backgroundColor: 'rgba(0,0,0,0)',
        borderWidth:0.1,
        borderColor: '#adbce6', // stroke
        position: 'absolute',
        top: screenCoords.screen_y,
        left: screenCoords.screen_x,
        transform: [
            { translateX: -screenCoords.screen_r - 1},  // Center horizontally
            { translateY: -screenCoords.screen_r - 1},  // Center vertically
        ]
    }));

    const tap = Gesture.Tap()
        .onEnd(() => {
            cycleHoldType(hold, boulderHolds)
            console.log('cycle hold type')
        })
        .runOnJS(true);

    return(
        <GestureDetector gesture={tap}>
            <Animated.View style={gestureStyle}/>
        </GestureDetector>
    );

}

interface SetBoulderProps {
    boulderHolds: BoulderHold[];
    setBoulderHolds: Dispatch<SetStateAction<BoulderHold[]>>;
    holdTypeColor:  { UNSELECTED: string; START: string; GENERAL: string; FEET: string; FINISH: string; };
}

export default function SetBoulder ({boulderHolds, setBoulderHolds, holdTypeColor}: SetBoulderProps) {
    const { selectedBoard, boardLedConfig } = useBoard();
    const skiaImage = useImage(selectedBoard?.image);
    const [imageDimensions, setImageDimensions] = useState({width: 0, height: 0});

    const handleLayout = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        console.log('onLayout called w x h = ',{width, height})
        setImageDimensions({ width, height });
    } 

    const cycleHoldType = (hold: BoulderHold, boulderHolds: BoulderHold[]) => {
        const holdIndex = boulderHolds.indexOf(hold);
        const newHoldArr = [...boulderHolds];
        const holdTypes = Object.keys(holdTypeColor) as Array<keyof typeof holdTypeColor>;
        hold.type = holdTypes[(holdTypes.indexOf(hold.type) + 1 ) % holdTypes.length];
        newHoldArr[holdIndex] = hold;
        setBoulderHolds(newHoldArr);
    }

    return(
        <>
            <Canvas style={styles.canvas} onLayout={handleLayout}>
                {skiaImage && <Image 
                    image={skiaImage}  
                    rect={{
                        x: 0,
                        y: 0,
                        width: imageDimensions.width,
                        height: imageDimensions.height
                    }}
                    fit={'contain'}
                />}

                {
                    skiaImage && boulderHolds.map((hold: BoulderHold) => {
                        const screenCoords = imgCoordsToScreen(
                            hold.relative_x, 
                            hold.relative_y,
                            imageDimensions.width,
                            imageDimensions.height,
                            skiaImage.width(),
                            skiaImage.height(),
                            hold.radius
                        );
                        return(
                            <Circle
                                key={hold.led_number}
                                cx={screenCoords.screen_x}
                                cy={screenCoords.screen_y}
                                r={screenCoords.screen_r || 20}
                                color={holdTypeColor[hold.type]}
                                style="stroke"       // This makes it outline only
                                strokeWidth={2}  
                            />
                        );
                    })
                }
            </Canvas>
            {skiaImage && boulderHolds.map((hold: BoulderHold) => (
                <CircleOverlay
                    key={hold.led_number}
                    hold={hold}
                    boulderHolds={boulderHolds}
                    setBoulderHolds={setBoulderHolds}
                    cycleHoldType={cycleHoldType}
                    canvasWidth={imageDimensions.width}
                    canvasHeight={imageDimensions.height}
                    imgWidth={skiaImage.width()}
                    imgHeight={skiaImage.height()}
                />
            ))}
        </>
    );
}