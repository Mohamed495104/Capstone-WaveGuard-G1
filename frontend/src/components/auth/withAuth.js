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
            // If Firebase is done checking and the user is NOT authenticated...
            if (!loading && !isAuthenticated) {
                // ...redirect them to the login page.
                router.push('/login');
            }
        }, [isAuthenticated, loading, router]);

        // While Firebase is checking, show a full-page loading spinner.
        if (loading) {
            return (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress />
                </Box>
            );
        }

        // If the user IS authenticated, show them the page they requested.
        if (isAuthenticated) {
            return <WrappedComponent {...props} />;
        }

        // Otherwise, render nothing while the redirect happens.
        return null;
    };

    return AuthHOC;
};

export default withAuth;