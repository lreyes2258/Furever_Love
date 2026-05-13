import { useContext } from "react";
import { AuthContext } from "../context/authContext";

/**
 * useAuth
 * -----------------------------------------------------------------------------
 * Custom hook to make it easy to access auth state and functions.
 */
export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside an AuthProvider.");
    }

    return context;
}