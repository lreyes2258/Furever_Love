import * as React from "react";
import { TouchableOpacity, Text } from "react-native";
import { styles } from "../styles/styles";

/**
 * BackBubble
 * Top-left return symbol in a bubble
 */
export default function BackBubble({ navigation }) {
  return (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={styles.backBubble}
      activeOpacity={0.85}
    >
      <Text style={styles.backText}>←</Text>
    </TouchableOpacity>
  );
}