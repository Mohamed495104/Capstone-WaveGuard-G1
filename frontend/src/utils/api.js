import axios from "axios";
import { auth } from "@/lib/firebase";

// Helper to get a fresh ID token for the current user
export async function getIdToken(forceRefresh = false) {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user.");
    // Use forceRefresh=true for critical actions
    return await user.getIdToken(forceRefresh);
}

// Wrapper for API calls that always sends fresh token
export async function apiCall(method, url, data = {}, forceRefresh = false) {
    const idToken = await getIdToken(forceRefresh);
    const config = {
        headers: { Authorization: `Bearer ${idToken}` },
    };
    return axios[method](url, data, config);
}