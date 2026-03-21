import * as React from "react";
import { SafeAreaView, View, Text } from "react-native";
import BackBubble from "../components/BackBubble";
import HeaderBar from "../components/HeaderBar";
import { styles } from "../styles/styles";

/**
 * ShelterScreen
 * Placeholder screen
 */
export default function ShelterScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <BackBubble navigation={navigation} />

      <HeaderBar title="Shelter" />

      <View style={styles.center}>
        <Text style={styles.pageTitle}>Shelter Dashboard</Text>

        <Text style={styles.muted}>
          This section is not implemented in the demo.
        </Text>
      </View>
    </SafeAreaView>
  );
}