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
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    // Remove trailing slash if present
    return apiUrl.replace(/\/$/, '');
}

/**
 * Build a full API endpoint URL
 * @param {string} path - API path (should start with /)
 * @returns {string} Full API URL
 */
export function buildApiUrl(path) {
    const baseUrl = getApiUrl();
    // Ensure path starts with /
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${normalizedPath}`;
}

// Export the base API URL for backward compatibility
export const API_URL = getApiUrl();
