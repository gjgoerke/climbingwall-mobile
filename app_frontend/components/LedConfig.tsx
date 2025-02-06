import { StyleSheet, View, Text } from "react-native";
import CircleButton from "./CircleButton";

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        right: 5,
        top: 30,
        alignItems: 'center', 
        gap: 0,
        backgroundColor: '#fff',
        borderRadius: 15,
        elevation: 10
    },
    buttonsContainer : {
        gap: 10,
        flexDirection: 'row'
    },
    ledCounter : {
        paddingTop: 10
    }
});

interface props {
    imgWidth: number;
    imgHeight: number;
    ledIndex: number;
    leftOnPress: () => void;
    rightOnPress: () => void;
}

export default function LedConfig({imgWidth, imgHeight, ledIndex, leftOnPress, rightOnPress} : props) {

    return(
        <View style={styles.container}>
            <View style={styles.ledCounter}>
                <Text>LED {ledIndex}</Text>
            </View>
            <View style={styles.buttonsContainer}>
                <CircleButton onPress={leftOnPress} icon="keyboard-arrow-left"/>
                <CircleButton onPress={rightOnPress} icon="keyboard-arrow-right"/>
            </View>
        </View>
    );
}