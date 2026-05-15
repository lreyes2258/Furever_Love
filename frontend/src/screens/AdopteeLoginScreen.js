import * as React from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import BackBubble from "../components/BackBubble";
import ScreenScaffold from "../components/ScreenScaffold";
import { styles } from "../styles/styles";
import { useAuth } from "../hooks/useAuth";

/**
 * AdopteeLoginScreen
 * Handles adoptee login input.
 */
export default function AdopteeLoginScreen({ navigation }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      await login({ email, password });
      navigation.navigate("Home");
    } catch (error) {
      Alert.alert("Login failed", error.message);
    }
  };

  return (
    <ScreenScaffold>
      <BackBubble navigation={navigation} />

      <View style={styles.center}>
        <View style={styles.formPanel}>
          <Text style={styles.eyebrow}>A01 / Adoptee access</Text>
          <Text style={styles.pageTitle}>Adoptee Login</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#687179"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#687179"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            style={[styles.button, styles.buttonPink]}
            onPress={handleLogin}
            activeOpacity={0.9}
          >
            <Text style={[styles.buttonText, styles.buttonTextInk]}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Register")}
            style={styles.linkButton}
          >
            <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenScaffold>
  );
}
