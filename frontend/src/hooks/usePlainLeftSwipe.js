import * as React from "react";
import { Animated, PanResponder, Dimensions } from "react-native";

const { width: SCREEN_W } = Dimensions.get("window");

/**
 * Plain Left Swipe
 * Translates the card left and advances to next dog
 */
export function usePlainLeftSwipe({ onSwipeLeft }) {
  const swipeX = React.useRef(new Animated.Value(0)).current;

  const swipeLeft = React.useCallback(() => {
    Animated.timing(swipeX, {
      toValue: -SCREEN_W,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      swipeX.setValue(0);
      onSwipeLeft();
    });
  }, [onSwipeLeft, swipeX]);

  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dx) > Math.abs(g.dy) && g.dx < -6,
      onPanResponderMove: (_, g) => swipeX.setValue(g.dx),
      onPanResponderRelease: (_, g) => {
        if (g.dx < -SCREEN_W * 0.25) swipeLeft();
        else Animated.spring(swipeX, { toValue: 0, useNativeDriver: true }).start();
      },
    })
  ).current;

  return { swipeX, panResponder, swipeLeft };
}