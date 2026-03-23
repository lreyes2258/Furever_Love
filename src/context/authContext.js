import React, { createContext, useMemo, useState } from "react";
import { loginRequest, registerRequest } from "../api/authApi.js"
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [userId, setUserId] = useState(null);
    /*
       * login
       * ---------------------------------------------------------------------------
       * Uses the API helper to send login data to the backend.
       * If login succeeds, it stores the returned user ID in state.
       */
    const login = async ({ email, password }) => {
        try {
            const data = await loginRequest({ email, password });

            // Store the logged-in user's ID in state.
            const loggedInUserId = data?.user?.id;

            if (!loggedInUserId) {
                throw new Error("Login succeeded, but no user ID was returned.");
            }

            setUserId(loggedInUserId);

            // If your backend returns a token, you may want to store it.
            if (data.token) {
                await AsyncStorage.setItem("token", data.token);
            }

            return data;
        } catch (error) {
            console.error("Error during login:", error);
            throw error;
        }
    };

    /**
     * register
     * ---------------------------------------------------------------------------
     * Uses the API helper to send registration data to the backend.
     * If registration succeeds, it stores the returned user ID in state.
     */
    const register = async ({ name, email, password }) => {
        try {
            const data = await registerRequest({ name, email, password });

            // Store the new user's ID in state after successful registration.
            const newUserId = data?.user?.id;

            if (!newUserId) {
                throw new Error("Registration succeeded, but no user ID was returned.");
            }

            setUserId(newUserId);

            // Store token if one is returned from the backend.
            if (data.token) {
                await AsyncStorage.setItem("token", data.token);
            }

            return data;
        } catch (error) {
            console.error("Error during registration:", error);
            throw error;
        }
    };

    /**
     * logout
     * ---------------------------------------------------------------------------
     * Clears the user ID from state and removes any stored token.
     */
    const logout = async () => {
        setUserId(null);
        await AsyncStorage.removeItem("token");
    };

    /**
     * The context value is memoized to avoid unnecessary re-renders.
     */
    const value = useMemo(
        () => ({
            userId,
            setUserId,
            login,
            register,
            logout,
        }),
        [userId]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}