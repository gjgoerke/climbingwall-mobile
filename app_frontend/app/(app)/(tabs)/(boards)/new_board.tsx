import { router } from "expo-router";
import { Appbar } from "react-native-paper";
export default function NewBoard() {
    return(
        <>
        <Appbar.Header>
            <Appbar.BackAction onPress={() => {router.back();}} />
            <Appbar.Content title="New Board"/>
        </Appbar.Header>
        </>
    );
}