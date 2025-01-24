import { Tabs } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';


export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#ffd33d',
                headerStyle: {
                    backgroundColor: '#25292e',
                },
                headerShadowVisible: false,
                headerTintColor: '#fff',
                tabBarStyle: {
                backgroundColor: '#25292e',
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Boulders',
                    headerTitle: 'Boulders',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24}/>
                    ),
                }} 
            />
            <Tabs.Screen
                name="board"
                options={{
                title: 'Wall',
                tabBarIcon: ({ color, focused }) => (
                    <Ionicons name={focused ? 'cube' : 'cube-outline'} color={color} size={24}/>
                ),
                }}
            />
        </Tabs>
    );
}