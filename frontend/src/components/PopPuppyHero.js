import * as React from "react";
import { Image, Text, View } from "react-native";
import { styles } from "../styles/styles";

const puppy = require("../../assets/shiba.png");

const tiles = [
  { label: "PUPPY AIM", style: styles.puppyTilePink },
  { label: "AI MATCH", style: styles.puppyTileCyan },
  { label: "0xPAW", style: styles.puppyTileYellow },
  { label: "LIVE LOVE", style: styles.puppyTileLavender },
];

export default function PopPuppyHero({ compact = false }) {
  return (
    <View style={[styles.puppyHero, compact && styles.puppyHeroCompact]}>
      <View style={styles.puppyHeroGrid}>
        {tiles.map((tile, index) => (
          <View
            key={tile.label}
            style={[
              styles.puppyTile,
              !compact && styles.puppyTileLarge,
              tile.style,
            ]}
          >
            <Text style={styles.puppyTileLabel}>{tile.label}</Text>
            <Image
              source={puppy}
              resizeMode="cover"
              style={[
                styles.puppyImage,
                !compact && styles.puppyImageLarge,
                { opacity: index === 1 ? 0.72 : 0.9 },
              ]}
            />
            {index === 1 && (
              <View style={styles.puppyScanner}>
                <View style={styles.puppyScannerFill} />
              </View>
            )}
          </View>
        ))}
      </View>

      <View style={styles.puppyHeroCaption}>
        <Text style={styles.puppyHeroCaptionText}>
          Neural puppy radar / soft hearts, sharp signal
        </Text>
      </View>
    </View>
  );
}
