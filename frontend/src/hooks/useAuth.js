import { auth } from "@/lib/firebase";
import axios from "axios";
import {
    setPersistence,
    browserSessionPersistence,
    signInWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
} from "firebase/auth";
import { requestCache } from "@/utils/requestCache";
import { useAuthContext } from "@/context/AuthContext";

// Detect mobile device
function isMobileDevice() {
    if (typeof window === 'undefined') return false;

    // Check if running as PWA in standalone mode - prefer popup for better compatibility
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) return false;

    // Check for mobile user agent and touch capability
    const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const mobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    return mobileUA && hasTouchScreen;
}

// Check if storage is accessible
function isStorageAccessible() {
    if (typeof window === 'undefined') return false;
    try {
        const testKey = '__storage_test__';
        sessionStorage.setItem(testKey, 'test');
        sessionStorage.removeItem(testKey);
        return true;
    } catch (e) {
        console.warn('sessionStorage is not accessible:', e);
        return false;
    }
}

// Sync user with backend (used for popup login)
async function syncUser(idToken, retries = 2) {
    try {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/sync`, { idToken }, { withCredentials: true });
    } catch (err) {
        if (retries > 0) {
            await new Promise((res) => setTimeout(res, 500));
            return syncUser(idToken, retries - 1);
        }
        throw new Error("Failed to sync user. Please check your connection and try again.");
    }
}

export default function useAuth() {
    const { markSessionReady, markSessionNotReady } = useAuthContext();

    const ensureSessionPersistence = async () => {
        await setPersistence(auth, browserSessionPersistence);
    };

    const createSession = async (idToken) => {
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/create-session`,
                { idToken },
                { withCredentials: true }
            );
            // Signal to AuthContext that session is ready
            markSessionReady();
        } catch (err) {
            console.error("Session creation failed:", err);
            throw new Error("Failed to create secure session. Please try again.");
        }
    };

    const login = async (email, password) => {
        await ensureSessionPersistence();

        const userCred = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await userCred.user.getIdToken(true);

        await createSession(idToken);
    };

    const signup = async (email, password, name) => {
        await ensureSessionPersistence();

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
                email,
                password,
                name,
            });
        } catch (err) {
            if (err.response?.data?.message) {
                throw new Error(err.response.data.message);
            }
            throw new Error("Registration failed. Please try again.");
        }

        try {
            await login(email, password);
        } catch (error) {
            console.error("Login after signup failed:", error);
            throw new Error("Account created, but login failed. Please login manually.");
        }
    };

    const googleLogin = async () => {
        const provider = new GoogleAuthProvider();

        // Check storage accessibility first
        const storageAvailable = isStorageAccessible();

        // Decide authentication method
        // Priority: Always use popup if storage is unavailable (redirect requires storage)
        // Otherwise: Use redirect only on actual mobile devices
        const useRedirect = storageAvailable && isMobileDevice();

        try {
            if (useRedirect) {
                // Mobile with storage: Use redirect
                await ensureSessionPersistence();
                await signInWithRedirect(auth, provider);
            } else {
                // Desktop OR storage unavailable: Use popup
                // Note: No persistence call needed for popup - it completes in same context
                const result = await signInWithPopup(auth, provider);
                if (result.user) {
                    const idToken = await result.user.getIdToken(true);
                    await createSession(idToken);
                    await syncUser(idToken);
                }
            }
        } catch (error) {
            // Provide user-friendly error messages
            if (error.code === 'auth/popup-blocked') {
                throw new Error('Popup was blocked by your browser. Please allow popups for this site and try again.');
            } else if (error.code === 'auth/popup-closed-by-user') {
                throw new Error('Sign-in was cancelled. Please try again.');
            } else if (error.code === 'auth/web-storage-unsupported') {
                throw new Error('Your browser settings prevent sign-in. Please enable cookies and storage, or try a different browser.');
            } else {
                throw error;
            }
        }
    };

    const logout = async () => {
        // Clear the API request cache to prevent stale profile data
        requestCache.clear();
        
        // Signal that session is no longer ready
        markSessionNotReady();
        
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
                {},
                { withCredentials: true }
            );
        } catch (err) {
            console.error("Backend logout failed:", err);
        }
        await signOut(auth);
    };

    /**
     * Handles mobile Google redirect login flow
     */
    const handleRedirectResult = async () => {
        try {
            const result = await getRedirectResult(auth);

            if (result && result.user) {
                const idToken = await result.user.getIdToken(true);
                await createSession(idToken);
                await syncUser(idToken);
                return result.user;
            }

            return null;

        } catch (error) {
            console.error("Error handling redirect result:", error);
            throw error;
        }
    };

    return { login, signup, googleLogin, logout, handleRedirectResult };
}
