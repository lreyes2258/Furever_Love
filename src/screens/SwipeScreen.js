import * as React from "react";
import { SafeAreaView, View, Text, TouchableOpacity, Animated } from "react-native";

import BackBubble from "../components/BackBubble";
import HeaderBar from "../components/HeaderBar";
import DogCard from "../components/DogCard";

import { DOGS } from "../data/dogs";
import { usePlainLeftSwipe } from "../hooks/usePlainLeftSwipe";
import { useRevealBehindPhoto } from "../hooks/useRevealBehindPhoto";

import { styles } from "../styles/styles";

/**
 * SwipeScreen
 * Plain left swipe for next dog; slide photo right to reveal info
 */
export default function SwipeScreen({ navigation, favorites }) {
  const { favoriteIds, toggleFavorite } = favorites;
  const [index, setIndex] = React.useState(0);

  const reveal = useRevealBehindPhoto();
  const swipe = usePlainLeftSwipe({
    onSwipeLeft: () => {
      reveal.reset();
      setIndex((i) => i + 1);
    },
  });

  const current = DOGS[index];

  return (
    <SafeAreaView style={styles.safe}>
      <BackBubble navigation={navigation} />

      <HeaderBar
        title="Discover"
        right={
          <TouchableOpacity
            style={styles.headerPill}
            onPress={() => navigation.navigate("Favorites")}
            activeOpacity={0.9}
          >
            <Text style={styles.headerPillText}>Favorites</Text>
          </TouchableOpacity>
        }
      />

      <View style={{ flex: 1 }}>
        {!current ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No more dogs</Text>
            <Text style={styles.emptySubtitle}>Check back later for new arrivals!</Text>
          </View>
        ) : (
          <Animated.View
            style={{ flex: 1, transform: [{ translateX: swipe.swipeX }] }}
            {...swipe.panResponder.panHandlers}
          >
            <DogCard
              dog={current}
              isFavorite={favoriteIds.has(current.dog_id)}
              onToggleFavorite={() => toggleFavorite(current.dog_id)}
              reveal={reveal}
            />
          </Animated.View>
        )}
      </View>

      {current && (
        <View style={styles.bottomRow}>
          <TouchableOpacity
            style={styles.roundBtn}
            onPress={swipe.swipeLeft}
            activeOpacity={0.9}
          >
            <Text style={styles.roundBtnText}>✕</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.roundBtnPrimary}
            onPress={reveal.toggle}
            activeOpacity={0.9}
          >
            <Text style={styles.roundBtnPrimaryText}>Info</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.hintLine}>
        Swipe left for next dog • Slide photo right for info • Tap ☆ to favorite
      </Text>
    </SafeAreaView>
  );
}