import * as React from "react";
import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import { styles } from "../styles/styles";

/**
 * LoginScreen
 * Entry point for selecting user role.
 */
export default function LoginScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.center}>
        <Text style={styles.appTitle}>Furever Love</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("AdopteeLogin")}
          activeOpacity={0.9}
        >
          <Text style={styles.buttonText}>Login as Adoptee</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("ShelterLogin")}
          activeOpacity={0.9}
        >
          <Text style={styles.buttonText}>Login as Shelter</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}