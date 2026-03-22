import * as React from "react";
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import BackBubble from "../components/BackBubble";
import { styles } from "../styles/styles";
import { useAuth } from "../hooks/useAuth";

/**
 * RegisterScreen
 * Handles user account creation.
 */
export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [role, setRole] = React.useState("adopter");
  const { register } = useAuth();


  const handleRegister = async () => {
    try {
      await register({ email, password });
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
