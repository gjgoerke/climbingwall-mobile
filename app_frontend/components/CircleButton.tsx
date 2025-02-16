import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, View, Pressable } from "react-native"


interface props {
    onPress: () => void;
    icon: keyof typeof MaterialIcons.glyphMap; 
}

const styles = StyleSheet.create({
    buttonContainer: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        width: 40,
        height: 40,
        borderRadius: 20,
        elevation: 3,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    }
});

export default function CircleButton({ onPress, icon } : props) {
    return(
        <View style={styles.buttonContainer}>
            <Pressable 
                style={({ pressed }) => [
                    styles.button,
                    pressed && { opacity: 0.8 }
                ]} 
                onPress={onPress}
            >
                <MaterialIcons 
                    name={icon} 
                    size={28}
                    color="#424242"
                />
            </Pressable>
        </View>
    );
}

