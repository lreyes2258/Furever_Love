import * as React from "react";
import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import BackBubble from "../components/BackBubble";
import { styles } from "../styles/styles";

/**
 * HomeScreen
 * Simple navigation hub.
 */
export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <BackBubble navigation={navigation} />

      <View style={styles.center}>
        <Text style={styles.pageTitle}>Home</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Swipe")}
          activeOpacity={0.9}
        >
          <Text style={styles.buttonText}>Discover</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Favorites")}
          activeOpacity={0.9}
        >
          <Text style={styles.buttonText}>Favorites</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}