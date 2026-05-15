import * as React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import BackBubble from "../components/BackBubble";
import PopPuppyHero from "../components/PopPuppyHero";
import ScreenScaffold from "../components/ScreenScaffold";
import { styles } from "../styles/styles";

/**
 * HomeScreen
 * Simple navigation hub.
 */
export default function HomeScreen({ navigation, route }) {
  const isGuest = route?.params?.guest;

  return (
    <ScreenScaffold>
      {navigation.canGoBack() && <BackBubble navigation={navigation} />}

      <View style={styles.center}>
        <View style={styles.loginPanel}>
          <Text style={styles.eyebrow}>
            002 / Live deck{isGuest ? " / Guest" : ""}
          </Text>
          <Text style={styles.pageTitle}>Adoption dashboard</Text>
          <Text style={styles.pageSubtitle}>
            Tune the love model, scan the dog deck, revisit the favorites.
          </Text>

          <PopPuppyHero compact />

          <View style={styles.signalRail}>
            <View style={styles.signalChip}>
              <Text style={styles.signalChipText}>Taste model online</Text>
            </View>
            <View style={styles.signalChip}>
              <Text style={styles.signalChipText}>Love vector warm</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, styles.buttonLavender]}
            onPress={() => navigation.navigate("Swipe")}
            activeOpacity={0.9}
          >
            <Text style={[styles.buttonText, styles.buttonTextInk]}>
              Discover
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonCyan]}
            onPress={() => navigation.navigate("Favorites")}
            activeOpacity={0.9}
          >
            <Text style={[styles.buttonText, styles.buttonTextInk]}>
              Favorites
            </Text>
          </TouchableOpacity>

          <View style={styles.ledgerStrip}>
            <View style={styles.ledgerItem}>
              <Text style={styles.ledgerCode}>ACCESS</Text>
              <Text style={styles.ledgerValue}>{isGuest ? "Guest" : "User"}</Text>
            </View>
            <View style={styles.ledgerItem}>
              <Text style={styles.ledgerCode}>FLOW</Text>
              <Text style={styles.ledgerValue}>Swipe</Text>
            </View>
          </View>
        </View>
      </View>
    </ScreenScaffold>
  );
}
