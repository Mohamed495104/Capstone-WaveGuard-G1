import { auth } from "@/lib/firebase";
import axios from "axios";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithRedirect,
} from "firebase/auth";

// This hook provides functions to perform authentication actions.
export default function useAuth() {

    const login = async (email, password) => {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await userCred.user.getIdToken(true);
        // Sync user with backend after successful Firebase login
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/sync`, { idToken });
    };

    const signup = async (email, password) => {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const idToken = await userCred.user.getIdToken(true);
        // Sync user with backend after successful Firebase signup
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/sync`, { idToken });
    };

    const googleLogin = async () => {
        const provider = new GoogleAuthProvider();
        // This is the mobile-friendly redirect flow.
        // It navigates the user away. The result is caught by the AuthProvider.
        await signInWithRedirect(auth, provider);
    };

    const logout = async () => {
        await signOut(auth);
    };

    return { login, signup, googleLogin, logout };
}