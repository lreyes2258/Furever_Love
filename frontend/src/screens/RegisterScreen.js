import * as React from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import BackBubble from "../components/BackBubble";
import ScreenScaffold from "../components/ScreenScaffold";
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
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [isError, setIsError] = React.useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!email.trim() || !password) {
      setIsError(true);
      setMessage("Email and password are required.");
      Alert.alert("Validation Error", "Email and password are required");
      return;
    }

    if (password.length < 6) {
      setIsError(true);
      setMessage("Use a password with at least 6 characters.");
      return;
    }

    try {
      setIsSubmitting(true);
      setIsError(false);
      setMessage("Creating account...");

      const data = await register({
        email: email.trim(),
        password,
        role,
      });

      setMessage(
        data.localOnly
          ? "Account saved locally. Opening the demo."
          : "Account created. Opening your dashboard."
      );

      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: role === "shelter" ? "Shelter" : "Home" }],
        });
      }, 650);
    } catch (error) {
      setIsError(true);
      setMessage(error.message || "Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenScaffold>
      <BackBubble navigation={navigation} />

      <View style={styles.center}>
        <View style={styles.formPanel}>
          <Text style={styles.eyebrow}>R01 / New record</Text>
          <Text style={styles.pageTitle}>Create Account</Text>

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

          <Text style={styles.roleLabel}>Account Type:</Text>

          <View style={styles.roleRow}>
            <TouchableOpacity
              onPress={() => setRole("adopter")}
              style={[
                styles.roleChip,
                role === "adopter" && styles.roleChipActive,
              ]}
              activeOpacity={0.9}
            >
              <Text
                style={[
                  styles.roleChipText,
                  role === "adopter" && styles.roleChipTextActive,
                ]}
              >
                Adopter
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setRole("shelter")}
              style={[
                styles.roleChip,
                role === "shelter" && styles.roleChipActive,
              ]}
              activeOpacity={0.9}
            >
              <Text
                style={[
                  styles.roleChipText,
                  role === "shelter" && styles.roleChipTextActive,
                ]}
              >
                Shelter
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.button, styles.buttonYellow]}
            onPress={handleRegister}
            activeOpacity={0.9}
            disabled={isSubmitting}
          >
            <Text style={[styles.buttonText, styles.buttonTextInk]}>
              {isSubmitting ? "Signing Up..." : "Sign Up"}
            </Text>
          </TouchableOpacity>

          {!!message && (
            <Text
              style={[
                styles.formMessage,
                isError && styles.formMessageError,
              ]}
            >
              {message}
            </Text>
          )}

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.linkButton}
          >
            <Text style={styles.linkText}>Already have an account? Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenScaffold>
  );
}
