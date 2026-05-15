import * as React from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, Animated } from "react-native";
import { styles } from "../styles/styles";

const posterDots = Array.from({ length: 24 });

/**
 * DogCard
 * Displays the revealable photo and info panel underneath.
 */
export default function DogCard({ dog, isFavorite, onToggleFavorite, reveal, onContact }) {
  return (
    <View style={styles.card}>
      <ScrollView
        style={styles.infoBehind}
        contentContainerStyle={{ padding: 16, paddingBottom: 18 }}
      >
        <View style={styles.signalRail}>
          <View style={styles.signalChip}>
            <Text style={styles.signalChipText}>AI match scan</Text>
          </View>
          <View style={styles.signalChip}>
            <Text style={styles.signalChipText}>Puppy aimed</Text>
          </View>
        </View>

        <Text style={styles.infoTitle}>{dog.dog_name}</Text>

        <Text style={styles.infoLine}>
          <Text style={styles.infoLabel}>Breed: </Text>
          {dog.breed}
        </Text>

        <Text style={styles.infoLine}>
          <Text style={styles.infoLabel}>Age: </Text>
          {dog.age} years
        </Text>

        <Text style={styles.infoLine}>
          <Text style={styles.infoLabel}>Shelter arrival: </Text>
          {dog.shelter_arrival}
        </Text>

        <Text style={styles.infoLine}>
          <Text style={styles.infoLabel}>Description: </Text>
          {dog.dog_description}
        </Text>

        <Text style={styles.infoLine}>
          <Text style={styles.infoLabel}>Shelter ID: </Text>
          {dog.shelter_id}
        </Text>

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.contactButton}
          activeOpacity={0.8}
          onPress={onContact}
        >
          <Text style={styles.contactButtonText}>Contact Shelter</Text>
        </TouchableOpacity>

        <Text style={styles.infoHint}>
          Drag the photo → to reveal or hide this info.
        </Text>
      </ScrollView>

      <Animated.View
        style={[styles.photoFront, { transform: [{ translateX: reveal.revealX }] }]}
        {...reveal.panResponder.panHandlers}
      >
        <Image source={dog.image} style={styles.photo} resizeMode="cover" />
        <View style={styles.dogPosterStripe} />
        <View style={styles.dogSignalBadge}>
          <Text style={styles.dogSignalText}>AI match 94%</Text>
        </View>
        <View style={styles.dogDotCluster}>
          {posterDots.map((_, index) => (
            <View key={index} style={styles.dogDot} />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.star, isFavorite && styles.starActive]}
          onPress={onToggleFavorite}
          activeOpacity={0.9}
        >
          <Text style={styles.starText}>{isFavorite ? "★" : "☆"}</Text>
        </TouchableOpacity>

        <View style={styles.overlay}>
          <Text style={styles.name}>
            {dog.dog_name} ({dog.age})
          </Text>
          <View style={styles.overlayFooter}>
            <View style={styles.overlayMetaGroup}>
              <Text style={styles.meta}>{dog.breed}</Text>
            </View>

            <View style={styles.overlayActionRow}>
              <TouchableOpacity
                style={[
                  styles.overlayContactButton,
                  styles.overlayFavoriteButton,
                ]}
                activeOpacity={0.85}
                onPress={onToggleFavorite}
              >
                <Text style={styles.overlayContactText}>
                  {isFavorite ? "Saved" : "Save"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.overlayContactButton}
                activeOpacity={0.85}
                onPress={onContact}
              >
                <Text style={styles.overlayContactText}>Contact</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}
