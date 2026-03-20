const API_BASE_URL = "http://localhost:3000/api"


/**
 * loginRequest
 * -----------------------------------------------------------------------------
 * Sends the user's email and password to the backend.
 * Returns the parsed response data.
 */
export async function loginRequest({ email, password }) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  // If the backend returns an error status, throw an error.
  if (!response.ok) {
    throw new Error(data.message || "Login failed.");
  }

  return data;
}


/**
 * registerRequest
 * -----------------------------------------------------------------------------
 * Sends new user information to the backend.
 * Returns the parsed response data.
 */
export async function registerRequest({ name, email, password }) {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await response.json();

  // If the backend returns an error status, throw an error.
  if (!response.ok) {
    throw new Error(data.message || "Registration failed.");
  }

  return data;
}