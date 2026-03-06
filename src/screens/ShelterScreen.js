import * as React from "react";
import { SafeAreaView, View, Text } from "react-native";
import BackBubble from "../components/BackBubble";
import HeaderBar from "../components/HeaderBar";
import { styles } from "../styles/styles";

/**
 * ShelterScreen
 * UI placeholder
 */
export default function ShelterScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <BackBubble navigation={navigation} />
      <HeaderBar title="Shelter" />
      <View style={styles.center}>
        <Text style={styles.muted}>(UI Placeholder)</Text>
      </View>
    </SafeAreaView>
  );
}