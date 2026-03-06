import * as React from "react";

/**
 * Favorites State
 * Tracks favorited dog_id values
 */
export function useFavoritesState() {
  const [favoriteIds, setFavoriteIds] = React.useState(new Set());

  const toggleFavorite = React.useCallback((dog_id) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(dog_id)) next.delete(dog_id);
      else next.add(dog_id);
      return next;
    });
  }, []);

  return { favoriteIds, toggleFavorite };
}