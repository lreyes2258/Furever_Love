import AsyncStorage from "@react-native-async-storage/async-storage";

const configuredApiBaseUrl =
  typeof process !== "undefined"
    ? process.env?.EXPO_PUBLIC_API_BASE_URL
    : undefined;
const isLocalWeb =
  typeof window !== "undefined" &&
  ["localhost", "127.0.0.1"].includes(window.location.hostname);
export const API_BASE_URL = (configuredApiBaseUrl ||
  (isLocalWeb ? "http://localhost:4000" : undefined)
)?.replace(/\/+$/, "");
const LOCAL_USERS_KEY = "furever-love.local-users";

export function isLocalDemoToken(token) {
  return typeof token === "string" && token.startsWith("local-demo-token-");
}

async function requestJson(path, options) {
  if (!API_BASE_URL) {
    throw new Error("No auth server configured.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    let response;

    try {
      response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        signal: controller.signal,
      });
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error("Auth server timed out.");
      }

      throw error;
    }

    const text = await response.text();
    let data = {};

    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Auth server is offline.");
      }
    }

    if (!response.ok) {
      throw new Error(data.error || data.message || "Request failed.");
    }

    return data;
  } finally {
    clearTimeout(timeout);
  }
}

async function readLocalUsers() {
  const raw = await AsyncStorage.getItem(LOCAL_USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

async function writeLocalUsers(users) {
  await AsyncStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
}

function toAuthData(user, localOnly = false) {
  return {
    token: localOnly ? `local-demo-token-${user.id}` : undefined,
    localOnly,
    user: {
      id: String(user.id),
      email: user.email,
      role: user.role,
      isEmailVerified: true,
    },
  };
}

async function localRegister({ role, email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const users = await readLocalUsers();
  const exists = users.some((user) => user.email === normalizedEmail);

  if (exists) {
    throw new Error("A local demo account already exists for this email.");
  }

  const user = {
    id: Date.now().toString(),
    email: normalizedEmail,
    password,
    role: role === "shelter" ? "shelter" : "adopter",
  };

  await writeLocalUsers([...users, user]);

  return {
    ...toAuthData(user, true),
    message: "Registered locally for this demo device.",
  };
}

async function localLogin({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const users = await readLocalUsers();
  const user = users.find(
    (candidate) =>
      candidate.email === normalizedEmail && candidate.password === password
  );

  if (!user) {
    throw new Error("Invalid credentials.");
  }

  return toAuthData(user, true);
}

/**
 * loginRequest
 * Sends login credentials to the backend, then falls back to local demo users
 * when the temporary tunnel/backend is unavailable.
 */
export async function loginRequest({ email, password }) {
  if (!API_BASE_URL) {
    return localLogin({ email, password });
  }

  try {
    return await requestJson("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
  } catch (error) {
    try {
      return await localLogin({ email, password });
    } catch (localError) {
      if (
        /Failed to fetch|Network request failed|offline|No auth server|timed out/i.test(
          error.message
        )
      ) {
        throw localError;
      }

      throw error;
    }
  }
}

/**
 * registerRequest
 * Sends registration to the backend. If the temporary backend is offline,
 * creates a local demo account so the UI remains usable.
 */
export async function registerRequest({ role, email, password }) {
  if (!API_BASE_URL) {
    return localRegister({ role, email, password });
  }

  try {
    const data = await requestJson("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role, email, password }),
    });

    return {
      ...data,
      user: {
        id: String(data.id || data.user?.id),
        email: data.email || data.user?.email,
        role: data.role || data.user?.role,
        isEmailVerified: Boolean(data.isEmailVerified),
      },
    };
  } catch (error) {
    if (/already exists/i.test(error.message)) {
      throw error;
    }

    return localRegister({ role, email, password });
  }
}
