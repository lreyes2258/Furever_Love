import * as React from "react";
import { Animated, PanResponder, Dimensions } from "react-native";

const { width: SCREEN_W } = Dimensions.get("window");

/**
 * Reveal Behind Photo
 * Slides the photo right to reveal the info panel beneath
 */
export function useRevealBehindPhoto() {
  const revealX = React.useRef(new Animated.Value(0)).current;
  const MAX = Math.min(260, SCREEN_W * 0.72);

  const toggle = React.useCallback(() => {
    revealX.stopAnimation((v) => {
      Animated.spring(revealX, {
        toValue: v > 10 ? 0 : MAX,
        useNativeDriver: true,
      }).start();
    });
  }, [MAX, revealX]);

  const reset = React.useCallback(() => {
    revealX.setValue(0);
  }, [revealX]);

  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dx) > Math.abs(g.dy) && g.dx > 6,
      onPanResponderMove: (_, g) =>
        revealX.setValue(Math.max(0, Math.min(MAX, g.dx))),
      onPanResponderRelease: (_, g) =>
        Animated.spring(revealX, {
          toValue: g.dx > MAX * 0.35 ? MAX : 0,
          useNativeDriver: true,
        }).start(),
    })
  ).current;

  return { revealX, panResponder, toggle, reset };
}