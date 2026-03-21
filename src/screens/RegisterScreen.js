import * as React from "react";
import { SafeAreaView, View, Text, TextInput, TouchableOpacity } from "react-native";
import BackBubble from "../components/BackBubble";
import { styles } from "../styles/styles";

/**
 * RegisterScreen
 * Handles user account creation.
 */
export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  /**
   * Placeholder register handler
   * Bypasses backend and returns user to login screen
   */
  const handleRegister = () => {
    // Placeholder: simulate successful account creation
    navigation.navigate("Login");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <BackBubble navigation={navigation} />

      <View style={styles.center}>
        <Text style={styles.pageTitle}>Create Account</Text>

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

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          activeOpacity={0.9}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginTop: 12 }}
        >
          <Text style={{ color: "#6b7280", fontWeight: "700" }}>
            Already have an account? Log In
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}