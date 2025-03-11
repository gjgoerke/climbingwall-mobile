import { MaterialCommunityIcons } from "@expo/vector-icons"
import { StyleSheet } from "react-native";

interface MaterialIconButtonProps {
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    onPress: () => void
}

const styles = StyleSheet.create({

});

export default function MaterialIconButton ({ icon, onPress } : MaterialIconButtonProps) {
    return(
        <MaterialCommunityIcons name={icon} onPress={onPress} size={24}></MaterialCommunityIcons>
    );
}