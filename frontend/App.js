import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useFavoritesState } from "./src/hooks/useFavoritesState";
import { AuthProvider } from "./src/context/authContext"; 

// Screens
import LoginScreen from "./src/screens/LoginScreen";
import AdopteeLoginScreen from "./src/screens/AdopteeLoginScreen";
import ShelterLoginScreen from "./src/screens/ShelterLoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import HomeScreen from "./src/screens/HomeScreen";
import SwipeScreen from "./src/screens/SwipeScreen";
import FavoritesScreen from "./src/screens/FavoritesScreen";
import ShelterScreen from "./src/screens/ShelterScreen";
import ChatScreen from "./src/screens/ChatScreen";

const Stack = createNativeStackNavigator();

/**
 * Main App Component
 * Handles navigation and shared state injection
 */
export default function App() {
  const favorites = useFavoritesState();

  return (
<AuthProvider>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />

        <Stack.Screen
          name="AdopteeLogin"
          component={AdopteeLoginScreen}
        />

        <Stack.Screen
          name="ShelterLogin"
          component={ShelterLoginScreen}
        />

        <Stack.Screen
          name="Register"
          component={RegisterScreen}
        />

        <Stack.Screen name="Home" component={HomeScreen} />

        <Stack.Screen name="Swipe">
          {(props) => (
            <SwipeScreen {...props} favorites={favorites} />
          )}
        </Stack.Screen>

        <Stack.Screen name="Favorites">
          {(props) => (
            <FavoritesScreen {...props} favorites={favorites} />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="Shelter"
          component={ShelterScreen}
        />
            
        <Stack.Screen 
            name="Chat" 
            component={ChatScreen} 
        />
            
      </Stack.Navigator>
    </NavigationContainer>
</AuthProvider>
  );
}
