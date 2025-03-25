import React from "react";
import { StyleSheet } from "react-native";
import { Text, useFont, Group } from "@shopify/react-native-skia";
import {Roboto_700Bold} from '@expo-google-fonts/roboto';

interface Props {
    x: number;
    y: number;
    text: string;

};

const XAxisText = ({x, y, text}: Props) => {
    const font = useFont(Roboto_700Bold, 10);
    if (!font) {
        return null;
    }
    const fontSize = font.measureText(text);
    return (
        <Group>
            <Text
                font={font}
                x={x - fontSize.width / 2} 
                y={y - 5} 
                text={text} 
                color={'#111111'}
            />
        </Group>
    );
}
export default XAxisText;
const styles = StyleSheet.create({

});