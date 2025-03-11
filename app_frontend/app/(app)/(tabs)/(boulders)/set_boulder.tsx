import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { View, StyleSheet, Platform } from "react-native";
import { router } from "expo-router";
import { Appbar, useTheme } from "react-native-paper";
import { Ionicons } from '@expo/vector-icons';


import SetBoulder from "@/components/SetBoulder";
import { useBoard } from "@/context/BoardContext";

export const holdTypeColor = {
    'UNSELECTED' : 'rgba(0,0,0,0.35)',
    'START' : '#02d617',     // Green
    'GENERAL' : '#07c6e8',   // Blue
    'FEET' : '#e807ca',      // Purple
    'FINISH' : '#E0070E'     // Red
}

export interface BoulderHold {
    led_number: number;
    relative_x: number;
    relative_y: number;
    radius: number;
    type: keyof typeof holdTypeColor;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%'
    }
});



export default function SetBoulderScreen() {
    const theme = useTheme();
    const [boulderHolds, setBoulderHolds] = useState<BoulderHold[]>([]);
    const { selectedBoard, boardLedConfig } = useBoard();
    const nextIcon = Platform.OS === 'ios' 
        ? () => <Ionicons name="chevron-forward" size={32} color={theme.colors.onSurface} />
        : 'arrow-right';

    const handleNextPress = () => {
        const boulderData = boulderHolds.filter((value) => (value.type !== 'UNSELECTED'))
            .map((value) => ({led_number: value.led_number, type: value.type}));
        const params = JSON.stringify(boulderData);
        router.push({
            pathname: '/set_boulder2',
            params: { params }
        })
    }

    useFocusEffect(
        useCallback(() => {
            console.log("Set boulder screen focused - resetting holds");
            // Reset the boulder holds when screen comes into focus
            if (boardLedConfig) {
                setBoulderHolds(boardLedConfig.hold_data.map((hold) => ({
                    ...hold,
                    type: 'UNSELECTED'
                })));
            }
            
            return () => {
                // Optional cleanup
            };
        }, [boardLedConfig])
    );

    
    return(
        <>
            <Appbar.Header>
                <Appbar.Action icon={'arrow-left'} onPress={() => {router.back();}} />
                <Appbar.Content title={'Set Boulder'}/>
                <Appbar.Action icon={'arrow-right'} onPress={handleNextPress}/>
            </Appbar.Header>
            <View style={styles.container}>
                <SetBoulder
                    boulderHolds={boulderHolds}
                    setBoulderHolds={setBoulderHolds}
                    holdTypeColor={holdTypeColor} />
            </View>
        </>
    );
}
