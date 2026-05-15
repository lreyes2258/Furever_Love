import * as React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import PopPuppyHero from "../components/PopPuppyHero";
import ScreenScaffold from "../components/ScreenScaffold";
import { styles } from "../styles/styles";

/**
 * LoginScreen
 * Entry point for selecting user role.
 */
export default function LoginScreen({ navigation }) {
  const handleGuestLogin = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Home", params: { guest: true } }],
    });
  };

  return (
    <ScreenScaffold>
      <View style={styles.center}>
        <View style={styles.loginPanel}>
          <View style={styles.brandRow}>
            <View style={styles.brandMark}>
              <View style={styles.brandMarkInner} />
            </View>
            <Text style={styles.eyebrow}>001 / Match ledger</Text>
          </View>

          <Text style={styles.appTitle}>Furever Love</Text>
          <Text style={styles.appSubtitle}>
            Pop-art puppy radar for AI-age adoption matches.
          </Text>

          <PopPuppyHero />

          <View style={styles.signalRail}>
            <View style={styles.signalChip}>
              <Text style={styles.signalChipText}>AI-age</Text>
            </View>
            <View style={styles.signalChip}>
              <Text style={styles.signalChipText}>Puppy aimed</Text>
            </View>
            <View style={styles.signalChip}>
              <Text style={styles.signalChipText}>Pop match</Text>
            </View>
          </View>

          <View style={styles.buttonStack}>
            <TouchableOpacity
              style={[styles.button, styles.buttonPink]}
              onPress={() => navigation.navigate("AdopteeLogin")}
              activeOpacity={0.9}
            >
              <Text style={[styles.buttonText, styles.buttonTextInk]}>
                Login as Adoptee
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.buttonCyan]}
              onPress={() => navigation.navigate("ShelterLogin")}
              activeOpacity={0.9}
            >
              <Text style={[styles.buttonText, styles.buttonTextInk]}>
                Login as Shelter
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.buttonYellow]}
              onPress={handleGuestLogin}
              activeOpacity={0.9}
            >
              <Text style={[styles.buttonText, styles.buttonTextInk]}>
                Login as Guest
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.ledgerStrip}>
            <View style={styles.ledgerItem}>
              <Text style={styles.ledgerCode}>LIVE</Text>
              <Text style={styles.ledgerValue}>Dogs</Text>
            </View>
            <View style={styles.ledgerItem}>
              <Text style={styles.ledgerCode}>MODE</Text>
              <Text style={styles.ledgerValue}>Guest ok</Text>
            </View>
          </View>
        </View>
      </View>
    </ScreenScaffold>
  );
}
