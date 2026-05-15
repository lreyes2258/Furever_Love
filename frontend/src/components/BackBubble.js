import * as React from "react";
import { TouchableOpacity, Text } from "react-native";
import { styles } from "../styles/styles";

/**
 * BackBubble
 * Top-left return symbol in a bubble
 */
export default function BackBubble({ navigation }) {
  const handlePress = () => {
    if (navigation.canGoBack?.()) {
      navigation.goBack();
      return;
    }

    navigation.navigate("Login");
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.backBubble}
      activeOpacity={0.85}
    >
      <Text style={styles.backText}>←</Text>
    </TouchableOpacity>
  );
}
