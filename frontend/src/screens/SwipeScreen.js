import * as React from "react";
import { SafeAreaView, View, Text, TouchableOpacity, Animated } from "react-native";

import BackBubble from "../components/BackBubble";
import HeaderBar from "../components/HeaderBar";
import DogCard from "../components/DogCard";

import { DOGS } from "../data/dogs";
import { usePlainLeftSwipe } from "../hooks/usePlainLeftSwipe";
import { useRevealBehindPhoto } from "../hooks/useRevealBehindPhoto";

import { styles } from "../styles/styles";

const API_BASE_URL = "http://localhost:4000/api";

/**
 * SwipeScreen
 * UI layer for viewing dogs and sending swipe actions.
 * Daily swipe enforcement should be handled by backend/database logic.
 */
export default function SwipeScreen({ navigation, route, favorites }) {
  const { favoriteIds, toggleFavorite } = favorites;
  const selectedDogId = route?.params?.selectedDogId ?? null;
  const openedFromFavorites = selectedDogId !== null;

  /**
   * Resolve the initial deck position once when the screen mounts.
   */
  const initialIndex = React.useMemo(() => {
    if (!selectedDogId) return 0;

    const foundIndex = DOGS.findIndex((dog) => dog.dog_id === selectedDogId);
    return foundIndex >= 0 ? foundIndex : 0;
  }, [selectedDogId]);

  const [index, setIndex] = React.useState(initialIndex);
  const [statusMessage, setStatusMessage] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  /**
   * Placeholder swipe state
   * Used only for demo UI feedback until backend integration is fully enabled.
   */
  const [dailySwipes, setDailySwipes] = React.useState(0);
  const [lastReset, setLastReset] = React.useState(new Date().toDateString());
  const [swipedDogs, setSwipedDogs] = React.useState(new Set());

  const reveal = useRevealBehindPhoto();
  const current = DOGS[index];
  const remainingSwipes = Math.max(0, 10 - dailySwipes);

  /**
   * If the screen is opened from Favorites with a selected dog,
   * move to that dog once when the route param changes.
   */
  React.useEffect(() => {
    if (!selectedDogId) return;

    const foundIndex = DOGS.findIndex((dog) => dog.dog_id === selectedDogId);
    if (foundIndex >= 0) {
      setIndex(foundIndex);
      reveal.reset();
      setStatusMessage("");
    }
  }, [selectedDogId, reveal]);

  /**
   * Reset placeholder daily swipe count when date changes.
   */
  React.useEffect(() => {
    const today = new Date().toDateString();
    if (today !== lastReset) {
      setDailySwipes(0);
      setLastReset(today);
      setSwipedDogs(new Set());
    }
  }, [lastReset]);

  /**
   * goNext
   * Advances to the next dog and resets the reveal state.
   */
  const goNext = React.useCallback(() => {
    reveal.reset();
    setIndex((prev) => prev + 1);
  }, [reveal]);

  /**
   * trackSwipe
   * Placeholder local swipe tracking for UI feedback only.
   * Backend/database should become the source of truth when auth is fully enabled.
   */
  const trackSwipe = React.useCallback(
    (dogId) => {
      if (openedFromFavorites) {
        return false;
      }

      if (swipedDogs.has(dogId)) {
        setStatusMessage("You already swiped on this dog");
        return false;
      }

      if (dailySwipes >= 10) {
        setStatusMessage("Daily swipe limit reached");
        return false;
      }

      setDailySwipes((prev) => Math.min(prev + 1, 10));
      setSwipedDogs((prev) => {
        const next = new Set(prev);
        next.add(dogId);
        return next;
      });

      return true;
    },
    [dailySwipes, swipedDogs, openedFromFavorites]
  );

  /**
   * submitLike
   * Attempts to call backend /like route.
   * Falls back to demo mode if auth/backend is not available.
   */
  const submitLike = async (dogId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/animals/${dogId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Like request failed");
      }

      return data;
    } catch (err) {
      return {
        ok: false,
        placeholder: true,
        message: err.message,
      };
    }
  };

  /**
   * handlePass
   * Moves to the next dog and records a local pass state for demo mode.
   */
  const handlePass = React.useCallback(async () => {
    if (!current || isSubmitting) return;

    if (openedFromFavorites) {
      setStatusMessage("Swipe is disabled when opened from Favorites");
      return;
    }

    const allowed = trackSwipe(current.dog_id);
    if (!allowed) return;

    try {
      setIsSubmitting(true);
      setStatusMessage("Pass recorded");
      goNext();
    } catch (err) {
      setStatusMessage("Could not record pass");
    } finally {
      setIsSubmitting(false);
    }
  }, [current, goNext, isSubmitting, trackSwipe, openedFromFavorites]);

  /**
   * handleContact
   * Records user interest, then opens chat to match the RAD/UML flow.
   */
  const handleContact = React.useCallback(
    async (dog) => {
      if (!dog || isSubmitting) return;

      if (openedFromFavorites) {
        navigation.navigate("Chat", {
          dog,
          shelterName: dog.shelter_name || `Shelter ${dog.shelter_id}`,
        });
        return;
      }

      const allowed = trackSwipe(dog.dog_id);
      if (!allowed) return;

      try {
        setIsSubmitting(true);

        const result = await submitLike(dog.dog_id);

        if (result.placeholder) {
          setStatusMessage("Contact recorded in demo mode");
        } else {
          setStatusMessage("Contact request recorded");
        }

        goNext();

        navigation.navigate("Chat", {
          dog,
          shelterName: dog.shelter_name || `Shelter ${dog.shelter_id}`,
        });
      } catch (err) {
        setStatusMessage("Could not record contact");
      } finally {
        setIsSubmitting(false);
      }
    },
    [goNext, isSubmitting, navigation, trackSwipe, openedFromFavorites]
  );

  const swipe = usePlainLeftSwipe({
    onSwipeLeft: handlePass,
  });

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
            {...(!openedFromFavorites ? swipe.panResponder.panHandlers : {})}
          >
            <DogCard
              dog={current}
              isFavorite={favoriteIds.has(current.dog_id)}
              onToggleFavorite={() => toggleFavorite(current.dog_id)}
              reveal={reveal}
              onContact={() => handleContact(current)}
            />
          </Animated.View>
        )}
      </View>

      {current && (
        <View style={styles.bottomRow}>
          <TouchableOpacity
            style={styles.roundBtn}
            onPress={handlePass}
            activeOpacity={0.9}
            disabled={isSubmitting || openedFromFavorites}
          >
            <Text style={styles.roundBtnText}>✕</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.roundBtnPrimary}
            onPress={reveal.toggle}
            activeOpacity={0.9}
            disabled={isSubmitting}
          >
            <Text style={styles.roundBtnPrimaryText}>Info</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.hintLine}>
        Swipe left for next dog • Slide photo right for info • Tap ☆ to favorite
      </Text>

      {!openedFromFavorites && (
        <Text style={styles.hintLine}>
          Swipes remaining today: {remainingSwipes}
        </Text>
      )}

      {!!statusMessage && <Text style={styles.hintLine}>{statusMessage}</Text>}
    </SafeAreaView>
  );
}