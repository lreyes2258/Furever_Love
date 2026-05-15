import * as React from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";

import BackBubble from "../components/BackBubble";
import HeaderBar from "../components/HeaderBar";
import DogCard from "../components/DogCard";
import ScreenScaffold from "../components/ScreenScaffold";

import { fetchAnimalDeck, submitAnimalSwipe } from "../api/animalsApi";
import { usePlainLeftSwipe } from "../hooks/usePlainLeftSwipe";
import { useRevealBehindPhoto } from "../hooks/useRevealBehindPhoto";

import { styles } from "../styles/styles";

/**
 * SwipeScreen
 * UI layer for viewing dogs and sending swipe actions.
 * Daily swipe enforcement should be handled by backend/database logic.
 */
export default function SwipeScreen({ navigation, route, favorites }) {
  const { favoriteIds, toggleFavorite } = favorites;
  const selectedDogId = route?.params?.selectedDogId ?? null;
  const selectedDogKey = selectedDogId === null ? null : String(selectedDogId);
  const openedFromFavorites = selectedDogKey !== null;

  const [dogs, setDogs] = React.useState([]);
  const [index, setIndex] = React.useState(0);
  const [isLoadingDogs, setIsLoadingDogs] = React.useState(true);
  const [deckMessage, setDeckMessage] = React.useState("");
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
  const resetReveal = reveal.reset;
  const current = dogs[index];
  const remainingSwipes = Math.max(0, 10 - dailySwipes);

  /**
   * Load the live backend deck when available, falling back to local pop cards.
   */
  React.useEffect(() => {
    let mounted = true;

    async function loadDogs() {
      setIsLoadingDogs(true);

      const result = await fetchAnimalDeck();
      if (!mounted) return;

      const nextDogs = result.dogs;
      const foundIndex = selectedDogKey
        ? nextDogs.findIndex((dog) => String(dog.dog_id) === selectedDogKey)
        : 0;

      setDogs(nextDogs);
      setIndex(foundIndex >= 0 ? foundIndex : 0);
      setDeckMessage(result.message);
      setStatusMessage("");
      resetReveal();
      setIsLoadingDogs(false);
    }

    loadDogs();

    return () => {
      mounted = false;
    };
  }, [selectedDogKey, resetReveal]);

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
    resetReveal();
    setIndex((prev) => prev + 1);
  }, [resetReveal]);

  /**
   * trackSwipe
   * Placeholder local swipe tracking for UI feedback only.
   * Backend/database should become the source of truth when auth is fully enabled.
   */
  const trackSwipe = React.useCallback(
    (dogId) => {
      const dogKey = String(dogId);

      if (openedFromFavorites) {
        return false;
      }

      if (swipedDogs.has(dogKey)) {
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
        next.add(dogKey);
        return next;
      });

      return true;
    },
    [dailySwipes, swipedDogs, openedFromFavorites]
  );

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

      const result = await submitAnimalSwipe(current.dog_id, "pass");
      setStatusMessage(
        result.placeholder ? "Pass recorded in demo mode" : "Pass recorded"
      );

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

        const result = await submitAnimalSwipe(dog.dog_id, "like");

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
    <ScreenScaffold>
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
            <Text style={styles.emptyTitle}>
              {isLoadingDogs ? "Loading matches" : "No more dogs"}
            </Text>
            <Text style={styles.emptySubtitle}>
              {isLoadingDogs
                ? "Fetching the latest adoption deck..."
                : "Check back later for new arrivals!"}
            </Text>
          </View>
        ) : (
          <Animated.View
            key={current.dog_id}
            style={{ flex: 1, transform: [{ translateX: swipe.swipeX }] }}
            {...(!openedFromFavorites ? swipe.panResponder.panHandlers : {})}
          >
            <DogCard
              dog={current}
              isFavorite={favoriteIds.has(String(current.dog_id))}
              onToggleFavorite={() => toggleFavorite(current)}
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

      {!!deckMessage && <Text style={styles.hintLine}>{deckMessage}</Text>}
      {!!statusMessage && <Text style={styles.hintLine}>{statusMessage}</Text>}
    </ScreenScaffold>
  );
}
