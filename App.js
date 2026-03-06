import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useFavoritesState } from "./src/hooks/useFavoritesState";

import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import SwipeScreen from "./src/screens/SwipeScreen";
import FavoritesScreen from "./src/screens/FavoritesScreen";
import ShelterScreen from "./src/screens/ShelterScreen";

const Stack = createNativeStackNavigator();

/**
 * Main App Component
 * Handles navigation and shared state injection
 */
export default function App() {
  const favorites = useFavoritesState();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />

        <Stack.Screen name="Swipe">
          {(props) => <SwipeScreen {...props} favorites={favorites} />}
        </Stack.Screen>

        <Stack.Screen name="Favorites">
          {(props) => <FavoritesScreen {...props} favorites={favorites} />}
        </Stack.Screen>

        <Stack.Screen name="Shelter" component={ShelterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}