import * as React from "react";
import { SafeAreaView, Text, View } from "react-native";
import { styles } from "../styles/styles";

const halftoneDots = Array.from({ length: 48 });

/**
 * ScreenScaffold
 * Shared paper-grid stage with pastel signal blocks.
 */
export default function ScreenScaffold({ children }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.backdrop}>
        <View style={[styles.ledgerLine, styles.ledgerLineLeft]} />
        <View style={[styles.ledgerLine, styles.ledgerLineRight]} />
        <View style={styles.pulseRing} />
        <View style={[styles.pulseRing, styles.pulseRingSmall]} />
        <View style={[styles.backdropBlock, styles.backdropBlockMint]} />
        <View style={[styles.backdropBlock, styles.backdropBlockPink]} />
        <View style={[styles.backdropBlock, styles.backdropBlockYellow]} />
        <View style={[styles.backdropBlock, styles.backdropBlockBlue]} />
        <View style={[styles.backdropBlock, styles.backdropBlockLavender]} />
        <View style={styles.halftoneField}>
          {halftoneDots.map((_, index) => (
            <View key={index} style={styles.halftoneDot} />
          ))}
        </View>
        <Text style={styles.verticalSignal}>AI LOVE SIGNAL</Text>
      </View>

      <View style={styles.screenContent}>{children}</View>
    </SafeAreaView>
  );
}
