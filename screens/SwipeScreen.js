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
 * Plain left swipe for next dog; slide photo right to reveal info.
 */
export default function SwipeScreen({ navigation, favorites }) {
  const { favoriteIds, toggleFavorite } = favorites;
  const [index, setIndex] = React.useState(0);

  /**
   * Daily swipe limit state
   */
  const [dailyLikes, setDailyLikes] = React.useState(0);
  const [lastReset, setLastReset] = React.useState(new Date().toDateString());
  const [contactedDogs, setContactedDogs] = React.useState(new Set());

  const reveal = useRevealBehindPhoto();

  /**
   * Reset daily swipe limit when date changes
   */
  React.useEffect(() => {
    const today = new Date().toDateString();
    if (today !== lastReset) {
      setDailyLikes(0);
      setLastReset(today);
      setContactedDogs(new Set());
    }
  }, [lastReset]);

  /**
   * Contact handler
   * Counts once per dog and enforces a max of 10 per day.
   */
  const handleContact = (dogId) => {
    if (contactedDogs.has(dogId)) return;

    if (dailyLikes >= 10) {
      alert("Daily like limit reached");
      return;
    }

    setDailyLikes((prev) => prev + 1);

    setContactedDogs((prev) => {
      const next = new Set(prev);
      next.add(dogId);
      return next;
    });
  };

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
            <Text style={styles.emptySubtitle}>
              Check back later for new arrivals!
            </Text>
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
              onContact={() => handleContact(current.dog_id)}
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

      <Text style={styles.hintLine}>
        Likes remaining today: {10 - dailyLikes}
      </Text>
    </SafeAreaView>
  );
}