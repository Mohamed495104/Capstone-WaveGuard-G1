"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, getRedirectResult } from "firebase/auth";
import { auth } from "@/lib/firebase";
import axios from "axios";
import { Box, CircularProgress } from "@mui/material";

// Create the context to be shared across the application
const AuthContext = createContext();

// Create the provider component that will wrap the application
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // This is the primary listener for Firebase authentication state changes.
        // It's the official way to track if a user is logged in or out.
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        // This handles the result from a Google Sign-In redirect.
        // It runs once when the app loads after being redirected back from Google.
        const handleRedirect = async () => {
            try {
                const result = await getRedirectResult(auth);
                if (result?.user) {
                    // If a user is found, sync them with the backend.
                    const idToken = await result.user.getIdToken(true);
                    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/sync`, { idToken });
                    // The onAuthStateChanged listener above will automatically update the user state.
                }
            } catch (error) {
                console.error("Error handling Google redirect result:", error);
            }
        };

        handleRedirect();

        // Cleanup the listener when the component unmounts
        return () => unsubscribe();
    }, []);

    const value = {
        user,
        isAuthenticated: !!user, // A boolean flag for convenience
        loading,
    };

    // While Firebase is checking the user's status, show a full-page loading spinner.
    // This prevents a "flash" of the login page for already-authenticated users.
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// Create a custom hook for easy access to the auth context in other components
export const useAuthContext = () => {
    return useContext(AuthContext);
};