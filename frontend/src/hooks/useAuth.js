import { auth } from "@/lib/firebase";
import axios from "axios";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";

// Helper: Sync user with backend and retry if needed
async function syncUser(idToken, retries = 2) {
    try {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/sync`, { idToken });
    } catch (err) {
        if (retries > 0) {
            await new Promise(res => setTimeout(res, 500));
            return syncUser(idToken, retries - 1);
        }
        throw new Error("Failed to sync user. Please check your connection and try again.");
    }
}

// Hook provides functions to perform authentication actions.
export default function useAuth() {
    const login = async (email, password) => {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await userCred.user.getIdToken(true);
        await syncUser(idToken);
    };

    const signup = async (email, password) => {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const idToken = await userCred.user.getIdToken(true);
        await syncUser(idToken);
    };

    const googleLogin = async () => {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        if (result.user) {
            const idToken = await result.user.getIdToken(true);
            await syncUser(idToken);
        }
    };

    const logout = async () => {
        await signOut(auth);
    };

    return { login, signup, googleLogin, logout };
}