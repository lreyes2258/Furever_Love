import * as React from "react";
import { View, Text } from "react-native";
import { styles } from "../styles/styles";

/**
 * HeaderBar
 * Displays a centered title with a right-aligned element.
 */
export default function HeaderBar({ title, right }) {
  return (
    <View style={styles.headerBar}>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.headerRight}>{right}</View>
    </View>
  );
}