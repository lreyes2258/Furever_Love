import * as React from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, Animated } from "react-native";
import { styles } from "../styles/styles";

/**
 * DogCard
 * Displays the revealable photo + info panel underneath
 */
export default function DogCard({ dog, isFavorite, onToggleFavorite, reveal }) {
  return (
    <View style={styles.card}>
      <ScrollView style={styles.infoBehind} contentContainerStyle={{ padding: 16, paddingBottom: 18 }}>
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
          onPress={() => {}}
        >
          <Text style={styles.contactButtonText}>Contact Shelter</Text>
        </TouchableOpacity>

        <Text style={styles.infoHint}>Drag the photo → to reveal/hide this info.</Text>
      </ScrollView>

      <Animated.View
        style={[styles.photoFront, { transform: [{ translateX: reveal.revealX }] }]}
        {...reveal.panResponder.panHandlers}
      >
        <Image source={dog.image} style={styles.photo} />

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
          <Text style={styles.meta}>{dog.breed}</Text>
        </View>
      </Animated.View>
    </View>
  );
}