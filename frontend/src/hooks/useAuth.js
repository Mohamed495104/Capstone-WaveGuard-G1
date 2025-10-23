import { auth } from "@/lib/firebase";
import { apiCall } from     "@/utils/api";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function useAuth() {
    const login = async (email, password) => {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        // Sync user with backend using fresh token
        await apiCall("post", `${process.env.NEXT_PUBLIC_API_URL}/api/auth/sync`, { idToken: await userCred.user.getIdToken(true) });
    };

    const signup = async (email, password) => {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        await apiCall("post", `${process.env.NEXT_PUBLIC_API_URL}/api/auth/sync`, { idToken: await userCred.user.getIdToken(true) });
    };

    const googleLogin = async () => {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        await apiCall("post", `${process.env.NEXT_PUBLIC_API_URL}/api/auth/sync`, { idToken: await result.user.getIdToken(true) });
    };

    const logout = async () => {
        await signOut(auth);
    };

    return { login, signup, googleLogin, logout };
}