import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { AuthProvider } from "@/context/AuthContext";
import { useAuth } from "@/context/AuthContext";

export const Layout = () => {
  const { authState, onLogout } = useAuth();
  return(
    <Stack screenOptions={{ headerShown: false }}>
      {/* If not authenticated, redirect to login */}
      {authState?.authenticated ? (
          // If authenticated, show main app screens
        <>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" options={{ presentation: 'modal' }} />
        </>
      ) : (
        <>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </>
      )}
    </Stack>
  );
}
export default function RootLayout() {
  return (
    <AuthProvider>
      <PaperProvider>
        <Layout>
        </Layout>
      </PaperProvider>
    </AuthProvider>
  );
}
