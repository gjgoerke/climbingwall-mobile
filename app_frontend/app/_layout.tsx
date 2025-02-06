import { Slot } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { AuthProvider } from "@/context/AuthContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <AuthProvider>
        <PaperProvider>
          <Slot/>
        </PaperProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
