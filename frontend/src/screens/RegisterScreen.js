import * as React from "react";
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import BackBubble from "../components/BackBubble";
import { styles } from "../styles/styles";
import { useAuth } from "../hooks/useAuth";

const API_BASE_URL = "https://nonseasonal-superelaborately-velma.ngrok-free.dev";

/**
 * RegisterScreen
 * Handles user account creation.
 */
export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [role, setRole] = React.useState("adopter");

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert("Validation Error", "Email and password are required");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      console.log("Registered user:", data); // data.id should exist
      
      if (data.devVerifyLink) {
        const tokenParam = data.devVerifyLink.split("token=")[1];
        await fetch(`${API_BASE_URL}/api/auth/verify-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: tokenParam }),
        });
        console.log("Email auto-verified for dev");
      }

      Alert.alert("Success", "Registration and verification succeeded!");

      // Step 3: Navigate to login
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Register failed", error.message);
    }
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

        <Text style={{ marginTop: 10, fontWeight: "700" }}>
          Account Type:
        </Text>

        <View style={{ flexDirection: "row", marginTop: 6 }}>
          <TouchableOpacity onPress={() => setRole("adopter")}>
            <Text
              style={{
                marginRight: 15,
                fontWeight: "800",
                color: role === "adopter" ? "#ff6b6b" : "#6b7280",
              }}
            >
              Adopter
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setRole("shelter")}>
            <Text
              style={{
                fontWeight: "800",
                color: role === "shelter" ? "#ff6b6b" : "#6b7280",
              }}
            >
              Shelter
            </Text>
          </TouchableOpacity>
        </View>

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
