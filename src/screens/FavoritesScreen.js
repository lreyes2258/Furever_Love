import * as React from "react";
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, Image } from "react-native";

import BackBubble from "../components/BackBubble";
import HeaderBar from "../components/HeaderBar";

import { DOGS } from "../data/dogs";
import { styles } from "../styles/styles";

/**
 * FavoritesScreen
 * Lists favorited dogs (client-side state for now)
 */
export default function FavoritesScreen({ navigation, favorites }) {
  const { favoriteIds } = favorites;
  const favDogs = DOGS.filter((d) => favoriteIds.has(d.dog_id));

  return (
    <SafeAreaView style={styles.safe}>
      <BackBubble navigation={navigation} />

      <HeaderBar
        title="Favorites"
        right={
          <TouchableOpacity
            style={styles.headerPill}
            onPress={() => navigation.navigate("Swipe")}
            activeOpacity={0.9}
          >
            <Text style={styles.headerPillText}>Discover</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 28 }}>
        {favDogs.length === 0 ? (
          <View style={{ paddingTop: 12 }}>
            <Text style={styles.muted}>No favorites yet.</Text>
          </View>
        ) : (
          favDogs.map((dog) => (
            <View key={dog.dog_id} style={styles.favRow}>
              <Image source={dog.image} style={styles.favImg} />
              <View style={{ flex: 1 }}>
                <Text style={styles.favName}>{dog.dog_name}</Text>
                <Text style={styles.favMeta}>{dog.breed}</Text>
                <Text style={styles.favMeta}>Age: {dog.age}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}