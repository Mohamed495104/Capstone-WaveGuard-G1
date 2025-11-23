/**
 * API Configuration
 * Centralized configuration for API endpoints
 * Handles URL normalization to prevent double slashes
 */

/**
 * Get the base API URL from environment variables
 * Ensures no trailing slash to prevent double slash issues
 * @returns {string} Normalized API URL
 */
export function getApiUrl() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    // In development, use localhost with HTTP (it's acceptable for local dev)
    // In production, environment variable must be set
    if (!apiUrl) {
        if (process.env.NODE_ENV === 'production') {
            console.error('NEXT_PUBLIC_API_URL is not set in production environment');
            throw new Error('API URL is not configured. Please set NEXT_PUBLIC_API_URL environment variable.');
        }
        // Development fallback
        return 'http://localhost:5000';
    }
    
    // Remove trailing slash if present
    return apiUrl.replace(/\/$/, '');
}

/**
 * Build a full API endpoint URL
 * @param {string} path - API path (should start with /)
 * @returns {string} Full API URL
 * @throws {Error} If path is not a string
 */
export function buildApiUrl(path) {
    // Validate input
    if (typeof path !== 'string') {
        throw new Error(`buildApiUrl expects a string path, received: ${typeof path}`);
    }
    
    if (!path) {
        throw new Error('buildApiUrl requires a non-empty path');
    }
    
    const baseUrl = getApiUrl();
    // Ensure path starts with /
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${normalizedPath}`;
}

// Export the base API URL for backward compatibility
export const API_URL = getApiUrl();
