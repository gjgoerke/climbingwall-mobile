import { useBoard } from "@/context/BoardContext";
import { useImage, Canvas, Image, Circle, Paint } from "@shopify/react-native-skia";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import { View, StyleSheet, LayoutChangeEvent } from "react-native";
import { Appbar } from "react-native-paper";
import { Text } from "react-native";

import { holdTypeColor } from "./set_boulder";
import { Boulder } from "@/types/models";
import { imgCoordsToScreen } from "@/services/image_drawing";
import { updateLights } from "@/services/lights";

const styles = StyleSheet.create({
    canvas : {
        flex: 1,
        width: '100%',
        height: '100%'
    },
    header : {
        justifyContent: 'space-between'
    },
    headerContent: {

    }
});
interface HeaderProps {
    parsedBoulder: Boulder | null;
}

export const HeaderContent = ({ parsedBoulder } : HeaderProps) => {
    return (
        <View style={styles.headerContent}>
            <Text style={{ fontSize: 20, color: 'black' }}>{parsedBoulder?.name || ''}</Text>
            <Text style={{ fontSize: 14, color: 'rgba(0, 0, 0, 0.7)' }}>
                {`V${parsedBoulder?.consensus_grade || 'project'} - ${parsedBoulder?.like_count || 0} likes`}
            </Text>
        </View>
    );
};

export default function BoulderDetail() {
    const { boulder } = useLocalSearchParams();
    const [parsedBoulder, setParsedBoulder] = useState<Boulder|null>(null);
    const { selectedBoard, boardLedConfig } = useBoard();
    const skiaImage = useImage(selectedBoard?.image);
    const [imageDimensions, setImageDimensions] = useState({width: 0, height: 0});

    useEffect(() => {
        if(boulder && boardLedConfig) {
            try {
                let parsed = JSON.parse(boulder as string);
                if (parsed.holds) {
                    const newBoulderHoldsArr = parsed.holds.map((hold: any) => {
                        const matchingLed = boardLedConfig.hold_data.find((h) => h.led_number === hold.led_number);
                        return ({
                            led_number: hold.led_number,
                            relative_x: matchingLed?.relative_x || 0,
                            relative_y: matchingLed?.relative_y || 0,
                            radius: matchingLed?.radius || 0,
                            type: hold.type
                        })
                    });
                    parsed.holds = newBoulderHoldsArr;
                    setParsedBoulder(parsed);
                }
            } catch (error) {
                console.error('Error parsing boulder data:', error);
            }
        }
    },[boulder, boardLedConfig])

    const handleLayout = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        setImageDimensions({ width, height });
    } 

    const handleLogAscentPress = () => {
        router.push({
            pathname: "/log_ascent",
            params: { 
                boulder: boulder
            }
        });
    }

    const handleInfoPress = () => {
        router.push({
            pathname: "/(app)/(tabs)/(boulders)/boulder_info" as const,
            params: { 
                boulder: boulder
            }
        });
    }

    const handleLightsPress = () => {
        if (parsedBoulder?.holds) {
            updateLights(parsedBoulder.holds);
        }
    }

    return(
        <View style={{flex: 1}}>
            <Appbar.Header style={styles.header}>
                <Appbar.Action icon={'arrow-left'} onPress={() => {router.back();}} />
                <HeaderContent parsedBoulder={parsedBoulder}/>
                <View style={{ flexDirection: 'row' }}>
                    <Appbar.Action icon={'lightbulb-on-outline'} onPress={handleLightsPress}/>
                    <Appbar.Action icon={'check'} onPress={handleLogAscentPress}/>
                    <Appbar.Action icon={'information-outline'} onPress={handleInfoPress}/>
                </View>
            </Appbar.Header>
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
                    skiaImage && parsedBoulder && parsedBoulder.holds.map((hold) => {
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
        </View>
    );
}