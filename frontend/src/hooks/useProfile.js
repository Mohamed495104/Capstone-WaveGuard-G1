import { useState, useEffect, useCallback } from "react";
import { apiCall } from "@/utils/api";
import { useAuthContext } from "@/context/AuthContext";

export default function useProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { sessionReady } = useAuthContext();

    const fetchProfile = useCallback(async () => {
        // Don't fetch if session is not ready yet
        if (!sessionReady) {
            setLoading(false);
            return;
        }
        
        setLoading(true);
        try {
            const res = await apiCall('get', `${process.env.NEXT_PUBLIC_API_URL}/api/profile`);
            setProfile(res.data);
            setError("");
        } catch (err) {
            if (err.response?.status === 401) {
                // Silently handle 401 errors during auth setup
                console.debug('Session not ready yet for profile fetch');
            } else {
                setError("Failed to load profile");
            }
        } finally {
            setLoading(false);
        }
    }, [sessionReady]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]); // Re-fetch when session becomes ready

    const updateProfile = async (updates) => {
        setLoading(true);
        try {
            const res = await apiCall("patch", "/api/profile", updates);
            setProfile(res.data);
            setError("");
        } catch (err) {
            setError("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return { profile, loading, error, fetchProfile, updateProfile };
}