import { useLocalSearchParams } from "expo-router";
import { router } from "expo-router";
import { View, StyleSheet, Text } from "react-native";
import { useState, useEffect } from "react";
import { AxiosError } from "axios";
import { Canvas, Circle, Paint, Image, useImage } from "@shopify/react-native-skia";
import { LayoutChangeEvent } from "react-native";
import { Appbar } from "react-native-paper";

import api from "@/services/api";
import { Board, LedConfig } from "@/types/models";
import { imgCoordsToScreen } from "@/services/image_drawing";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor:'#F8F8F8'
    },
    canvas: {
        flex: 1,
        width: '100%',
        height: '100%'
    }
})

export default function BoardDetail() {
    const boardID = useLocalSearchParams().id;
    const [boardData, setBoardData] = useState<Board>();
    const [ledConfigData, setLedConfigData] = useState<LedConfig>();
    const [imageDimensions, setImageDimensions] = useState({width: 0, height: 0});

    useEffect(() => {
        async function fetchBoard() {
          try {
            const [boardResp, ledConfigResp] = await Promise.all([
                api.get(`/boards/${boardID}/`),
                api.get(`/boards/${boardID}/led-config/`)
            ]);
            setBoardData(boardResp.data);
            setLedConfigData(ledConfigResp.data);
          } catch (error) {
            if (error instanceof AxiosError) {
              console.error('Board fetch error:', {
                status: error.response?.status,
                data: error.response?.data,
                headers: error.response?.headers
              })
            } else {
                console.error('Unexpected error: ', error);
            }
          }
        }
        fetchBoard();
        }, []);

        const handleLayout = (event: LayoutChangeEvent) => {
            const { width, height } = event.nativeEvent.layout;
            setImageDimensions({ width, height });
        } 

        const skiaImage = useImage(boardData?.image);
       
        return(
            <View style={styles.container}>
                <Appbar.Header>
                    <Appbar.BackAction onPress={() => {router.back();}} />
                    <Appbar.Content title={`${boardData?.name}`}/>
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
                        skiaImage && ledConfigData?.hold_data.map((hold) => {
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
                                    color={'rgba(0,0,0,0)'}
                                >
                                    <Paint color={"#adbce6"} style="stroke" strokeWidth={2} />
                                </Circle>
                            );
                        })
                    }
                </Canvas>
            </View>
        );

}