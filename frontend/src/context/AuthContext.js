"use client";
import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import { onAuthStateChanged, getRedirectResult } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Box, CircularProgress } from "@mui/material";
import axios from "axios";
import { requestCache } from "@/utils/requestCache";

const AuthContext = createContext();

// Helper: Create session cookie (HttpOnly, XSS-safe)
// This also syncs the user to MongoDB on the backend
async function createSession(idToken, retries = 2) {
    try {
        await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/create-session`,
            { idToken },
            { withCredentials: true }
        );
        return true;
    } catch (err) {
        if (retries > 0) {
            await new Promise((res) => setTimeout(res, 500));
            return createSession(idToken, retries - 1);
        }
        throw new Error("Failed to create session. Please check your connection and try again.");
    }
}

// Helper: Verify session is valid by making a test API call
async function verifySession() {
    try {
        await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/profile`,
            { withCredentials: true }
        );
        return true;
    } catch {
        return false;
    }
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sessionReady, setSessionReady] = useState(false); // Track when session cookie is set
    const [authVersion, setAuthVersion] = useState(0); // Track auth state changes
    const previousUserUid = useRef(null); // Track previous user to detect user switches
    const sessionCreationInProgress = useRef(false); // Prevent duplicate session creation

    // Callback to mark session as ready (called by useAuth after session creation)
    const markSessionReady = useCallback(() => {
        setSessionReady(true);
        setAuthVersion(prev => prev + 1);
    }, []);

    // Callback to mark session as not ready (called during logout)
    const markSessionNotReady = useCallback(() => {
        setSessionReady(false);
    }, []);

    useEffect(() => {
        // Check for redirect result first (for mobile Google sign-in)
        const checkRedirectResult = async () => {
            try {
                const result = await getRedirectResult(auth);
                if (result && result.user) {
                    // User signed in via redirect
                    // Create session cookie (this also syncs user to MongoDB on backend)
                    const idToken = await result.user.getIdToken(true);
                    await createSession(idToken);
                    setSessionReady(true);
                    setAuthVersion(prev => prev + 1); // Increment version on auth change
                }
            } catch (error) {
                console.error("Error handling redirect result:", error);
            }
        };

        checkRedirectResult();

        // This is the primary listener for Firebase authentication state changes.
        // It will fire automatically after signInWithPopup/signInWithRedirect is successful.
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            // Clear cache when user changes (logout or different user login)
            // Only clear if previous user existed and is different from current user
            const currentUid = currentUser?.uid || null;
            const prevUid = previousUserUid.current;
            if (prevUid !== null && prevUid !== currentUid) {
                requestCache.clear();
                setSessionReady(false); // Reset session state when user changes
            }
            previousUserUid.current = currentUid;
            
            setUser(currentUser);
            
            // If user is logged out, reset session state
            if (!currentUser) {
                setSessionReady(false);
                setLoading(false);
                return;
            }

            // For page refresh: Check if session is still valid
            // This handles the case where the page is refreshed and Firebase auth state is restored
            if (currentUser && !sessionReady && !sessionCreationInProgress.current) {
                sessionCreationInProgress.current = true;
                try {
                    // First, verify if existing session is valid
                    const isValid = await verifySession();
                    if (isValid) {
                        setSessionReady(true);
                    } else {
                        // Session is invalid or expired, create new session
                        try {
                            const idToken = await currentUser.getIdToken(true);
                            await createSession(idToken);
                            setSessionReady(true);
                        } catch (sessionError) {
                            console.error("Failed to create session on auth state change:", sessionError);
                            // Don't set sessionReady to true if session creation failed
                        }
                    }
                } catch (error) {
                    console.error("Error verifying/creating session:", error);
                } finally {
                    sessionCreationInProgress.current = false;
                }
            }
            
            setLoading(false);
            setAuthVersion(prev => prev + 1); // Increment version on every auth state change
        });

        // Cleanup the listener when the component unmounts
        return () => unsubscribe();
    }, [sessionReady]);

    const value = {
        user,
        isAuthenticated: !!user,
        sessionReady, // Expose sessionReady state for components to wait on
        loading,
        authVersion, // Expose version for components that need to react to auth changes
        markSessionReady, // Expose callback for useAuth to signal session creation
        markSessionNotReady, // Expose callback for logout
    };

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => {
    return useContext(AuthContext);
};