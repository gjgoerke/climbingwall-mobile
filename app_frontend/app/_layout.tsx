import { Slot } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <PaperProvider>
        <Slot/>
      </PaperProvider>
    </AuthProvider>
  );
}
