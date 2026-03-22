import * as React from "react";
import { SafeAreaView, View, Text, TextInput, TouchableOpacity } from "react-native";
import BackBubble from "../components/BackBubble";
import { styles } from "../styles/styles";

/**
 * AdopteeLoginScreen
 * Handles adoptee login input.
 */
export default function AdopteeLoginScreen({ navigation }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  /**
   * Placeholder login handler
   * Bypasses authentication and enters the app directly.
   */
  const handleLogin = () => {
    // Placeholder
    navigation.navigate("Home");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <BackBubble navigation={navigation} />

      <View style={styles.center}>
        <Text style={styles.pageTitle}>Adoptee Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
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
          onPress={handleLogin}
          activeOpacity={0.9}
        >
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