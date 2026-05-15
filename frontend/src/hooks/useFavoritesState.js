import * as React from "react";

/**
 * Favorites State
 * Tracks favorited dog cards so Favorites works with local and backend decks.
 */
export function useFavoritesState() {
  const [favorites, setFavorites] = React.useState({
    ids: new Set(),
    dogsById: {},
  });

  const toggleFavorite = React.useCallback((dogOrId) => {
    const dog = typeof dogOrId === "object" ? dogOrId : null;
    const dogId = String(dog?.dog_id ?? dogOrId ?? "");

    if (!dogId) return;

    setFavorites((prev) => {
      const ids = new Set(prev.ids);
      const dogsById = { ...prev.dogsById };

      if (ids.has(dogId)) {
        ids.delete(dogId);
        delete dogsById[dogId];
      } else {
        ids.add(dogId);

        if (dog) {
          dogsById[dogId] = dog;
        }
      }

      return { ids, dogsById };
    });
  }, []);

  const favoriteDogs = React.useMemo(
    () => Object.values(favorites.dogsById),
    [favorites.dogsById]
  );

  return {
    favoriteIds: favorites.ids,
    favoriteDogs,
    toggleFavorite,
  };
}
