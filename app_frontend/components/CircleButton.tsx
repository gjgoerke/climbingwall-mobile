import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, View, Pressable } from "react-native"


interface props {
    onPress: () => void;
    icon: keyof typeof MaterialIcons.glyphMap; 
}

const styles = StyleSheet.create({
    buttonContainer: {
        
    },
    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        width: 35,
        height: 35,
        borderRadius: 17.5,
    }
});

export default function CircleButton({ onPress, icon } : props) {
    return(
        <View style={styles.buttonContainer}>
            <Pressable style={styles.button} onPress={onPress}>
                <MaterialIcons name={icon} size={30}/>
            </Pressable>
        </View>
    );
}

