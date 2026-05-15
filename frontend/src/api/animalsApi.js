import AsyncStorage from "@react-native-async-storage/async-storage";

import { API_BASE_URL, isLocalDemoToken } from "./authApi";
import { DOGS } from "../data/dogs";

const REQUEST_TIMEOUT_MS = 3500;
const dogImages = DOGS.map((dog) => dog.image);

function imageForAnimal(animal, index) {
  if (animal.image_url) {
    return { uri: animal.image_url };
  }

  if (animal.image) {
    return typeof animal.image === "string" ? { uri: animal.image } : animal.image;
  }

  return dogImages[index % dogImages.length];
}

function displayDate(value, fallback) {
  if (!value) return fallback;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function normalizeAnimal(animal, index = 0) {
  const fallback = DOGS[index % DOGS.length];
  const dogId = animal.dog_id ?? animal.id ?? fallback.dog_id;
  const name = animal.dog_name ?? animal.name ?? fallback.dog_name;
  const shelterId = animal.shelter_id ?? fallback.shelter_id;

  return {
    dog_id: String(dogId),
    dog_name: name,
    age: animal.age ?? fallback.age,
    breed: animal.breed || animal.species || fallback.breed,
    shelter_arrival:
      animal.shelter_arrival ||
      displayDate(animal.created_at, fallback.shelter_arrival),
    shelter_id: shelterId,
    shelter_name: animal.shelter_name || `Shelter ${shelterId}`,
    shelter_contact: animal.shelter_contact || "Available in chat",
    shelter_location: animal.shelter_location || "Local rescue network",
    dog_description:
      animal.dog_description ||
      animal.description ||
      fallback.dog_description ||
      "Ready for a loving home.",
    image: imageForAnimal(animal, index),
    backendStatus: animal.status,
  };
}

async function readBackendJson(path, options = {}) {
  if (!API_BASE_URL) {
    throw new Error("No backend server configured.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const token = await AsyncStorage.getItem("token");
  const headers = {
    Accept: "application/json",
    ...(options.headers || {}),
  };

  if (token && !isLocalDemoToken(token)) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      throw new Error(data.error || data.message || "Backend request failed.");
    }

    return data;
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchAnimalDeck() {
  try {
    const data = await readBackendJson("/api/animals");
    const rows = Array.isArray(data) ? data : data.animals || [];
    const backendDogs = rows.map((animal, index) =>
      normalizeAnimal(animal, index)
    );

    if (backendDogs.length === 0) {
      return {
        dogs: DOGS,
        source: "demo",
        message: "No backend dogs yet. Showing the pop demo deck.",
      };
    }

    return {
      dogs: backendDogs,
      source: "backend",
      message: "Live backend dog deck loaded.",
    };
  } catch {
    return {
      dogs: DOGS,
      source: "demo",
      message: "Demo deck active while backend data is unavailable.",
    };
  }
}

export async function submitAnimalSwipe(dogId, action = "like") {
  const token = await AsyncStorage.getItem("token");
  const endpoint = action === "pass" ? "pass" : "like";

  if (!API_BASE_URL || !token || isLocalDemoToken(token)) {
    return {
      ok: false,
      placeholder: true,
      message: "Swipe saved in demo mode.",
    };
  }

  try {
    const data = await readBackendJson(`/api/animals/${dogId}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return data;
  } catch (error) {
    return {
      ok: false,
      placeholder: true,
      message: error.message,
    };
  }
}
