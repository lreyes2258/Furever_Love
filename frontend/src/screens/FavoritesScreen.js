import * as React from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";

import BackBubble from "../components/BackBubble";
import HeaderBar from "../components/HeaderBar";
import ScreenScaffold from "../components/ScreenScaffold";

import { styles } from "../styles/styles";

/**
 * FavoritesScreen
 * Lists favorited dogs and opens the selected dog in SwipeScreen.
 */
export default function FavoritesScreen({ navigation, favorites }) {
  const { favoriteDogs } = favorites;

  return (
    <ScreenScaffold>
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
        {favoriteDogs.length === 0 ? (
          <View style={styles.favEmpty}>
            <Text style={styles.muted}>No favorites yet.</Text>
          </View>
        ) : (
          favoriteDogs.map((dog) => (
            <TouchableOpacity
              key={dog.dog_id}
              style={styles.favRow}
              activeOpacity={0.9}
              onPress={() =>
                navigation.navigate("Swipe", {
                  selectedDogId: dog.dog_id,
                })
              }
            >
              <Image source={dog.image} style={styles.favImg} />
              <View style={{ flex: 1 }}>
                <Text style={styles.favName}>{dog.dog_name}</Text>
                <Text style={styles.favMeta}>{dog.breed}</Text>
                <Text style={styles.favMeta}>Age: {dog.age}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </ScreenScaffold>
  );
}
