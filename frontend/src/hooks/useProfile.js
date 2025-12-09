import { useState, useEffect, useCallback } from "react";
import { apiCall } from "@/utils/api";
import { useAuthContext } from "@/context/AuthContext";

export default function useProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { sessionReady, authVersion } = useAuthContext();

    const fetchProfile = useCallback(async () => {
        // Don't fetch if session is not ready
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
                console.warn("Session expired when fetching profile");
            } else {
                setError("Failed to load profile");
            }
        } finally {
            setLoading(false);
        }
    }, [sessionReady]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile, authVersion]);

    const updateProfile = async (updates) => {
        // Don't update if session is not ready
        if (!sessionReady) {
            setError("Session not ready");
            return;
        }
        
        setLoading(true);
        try {
            const res = await apiCall("patch", `${process.env.NEXT_PUBLIC_API_URL}/api/profile`, updates);
            setProfile(res.data);
            setError("");
        } catch (err) {
            if (err.response?.status === 401) {
                setError("Session expired. Please login again.");
            } else {
                setError("Failed to update profile");
            }
        } finally {
            setLoading(false);
        }
    };

    return { profile, loading, error, fetchProfile, updateProfile };
}