import * as React from "react";
import { SafeAreaView, View, Text, TextInput, TouchableOpacity } from "react-native";
import BackBubble from "../components/BackBubble";
import { styles } from "../styles/styles";

/**
 * ShelterLoginScreen
 * Handles shelter login input.
 */
export default function ShelterLoginScreen({ navigation }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  /**
   * Placeholder login handler
   * Bypasses backend and logs user in locally
   */
  const handleLogin = () => {
    // Placeholder: skip authentication
    navigation.navigate("Shelter");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <BackBubble navigation={navigation} />

      <View style={styles.center}>
        <Text style={styles.pageTitle}>Shelter Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Register")}
          style={{ marginTop: 12 }}
        >
          <Text style={{ color: "#6b7280", fontWeight: "700" }}>
            Don’t have an account? Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}