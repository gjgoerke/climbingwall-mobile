import { Slot } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { AuthProvider } from "@/context/AuthContext";
import { BoardProvider } from "@/context/BoardContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <BoardProvider>
        <AuthProvider>
          <PaperProvider>
            <Slot/>
          </PaperProvider>
        </AuthProvider>
      </BoardProvider>
    </GestureHandlerRootView>
  );
}
