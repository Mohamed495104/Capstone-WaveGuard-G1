"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

// This is our Gatekeeper component. It wraps pages that require authentication.
const withAuth = (WrappedComponent) => {
    const AuthHOC = (props) => {
        const router = useRouter();
        const { isAuthenticated, loading } = useAuthContext();

        useEffect(() => {
            // This effect runs whenever the loading or authentication state changes.

            // If Firebase is done checking and the user is NOT authenticated...
            if (!loading && !isAuthenticated) {
                // ...redirect them to the login page.
                router.push('/login');
            }
        }, [isAuthenticated, loading, router]);

        // --- THE FIX ---
        // While Firebase is checking for a user, or if the user is not authenticated
        // and we are waiting for the redirect effect to fire, render a full-page loader.
        // This prevents the wrapped component from ever rendering for an unauthorized user.
        if (loading || !isAuthenticated) {
            return (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress />
                </Box>
            );
        }

        // If we get past the check above, it means loading is false AND isAuthenticated is true.
        // Only then do we render the actual page component.
        return <WrappedComponent {...props} />;
    };

    return AuthHOC;
};

export default withAuth;