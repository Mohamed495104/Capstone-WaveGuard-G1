/**
 * Location Controller
 * Provides location search (Nominatim) and water body verification (Overpass API)
 * Using OpenStreetMap free APIs
 */

import { calculateDistance } from '../utils/locationUtils.js';

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';
const OVERPASS_BASE_URL = 'https://overpass-api.de/api/interpreter';

// User agent required by Nominatim usage policy
const USER_AGENT = 'MarineCare/1.0 (cleanup-challenge-app)';

/**
 * Search for Canadian locations using Nominatim
 * @route GET /api/location/search
 * @param {string} q - Search query
 */
export const searchLocations = async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q || q.trim().length < 2) {
            return res.status(400).json({ 
                message: 'Search query must be at least 2 characters' 
            });
        }

        // Build Nominatim search URL
        const searchUrl = new URL(`${NOMINATIM_BASE_URL}/search`);
        searchUrl.searchParams.append('q', q);
        searchUrl.searchParams.append('countrycodes', 'ca'); // Canada only
        searchUrl.searchParams.append('format', 'json');
        searchUrl.searchParams.append('limit', '10');
        searchUrl.searchParams.append('addressdetails', '1');

        const response = await fetch(searchUrl.toString(), {
            headers: {
                'User-Agent': USER_AGENT,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Nominatim API error: ${response.status}`);
        }

        const results = await response.json();
        
        // Transform results to simpler format
        const locations = results.map(result => ({
            placeId: result.place_id,
            name: result.display_name,
            latitude: parseFloat(result.lat),
            longitude: parseFloat(result.lon),
            type: result.type,
            category: result.category,
            address: result.address || {}
        }));

        res.json({ 
            success: true,
            count: locations.length,
            locations 
        });

    } catch (error) {
        console.error('[Location Search] Error:', error.message);
        res.status(500).json({ 
            message: 'Failed to search locations',
            error: error.message 
        });
    }
};

/**
 * Verify if a location is near water bodies (shoreline, lake, beach, river)
 * Uses Overpass API to query OpenStreetMap data
 * @route GET /api/location/verify-water
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {number} radius - Search radius in meters (default 5000m = 5km)
 */
export const verifyWaterProximity = async (req, res) => {
    try {
        const { lat, lon, radius = 5000 } = req.query;
        
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);
        const searchRadius = parseInt(radius);

        if (isNaN(latitude) || isNaN(longitude)) {
            return res.status(400).json({ 
                message: 'Valid latitude and longitude required' 
            });
        }

        // Overpass QL query for water features within radius
        // Searches for: coastlines, lakes, rivers, beaches, reservoirs, streams
        const overpassQuery = `
            [out:json][timeout:25];
            (
                way["natural"="water"](around:${searchRadius},${latitude},${longitude});
                way["natural"="coastline"](around:${searchRadius},${latitude},${longitude});
                way["natural"="beach"](around:${searchRadius},${latitude},${longitude});
                way["water"](around:${searchRadius},${latitude},${longitude});
                way["waterway"](around:${searchRadius},${latitude},${longitude});
                relation["natural"="water"](around:${searchRadius},${latitude},${longitude});
                node["natural"="beach"](around:${searchRadius},${latitude},${longitude});
            );
            out tags center;
        `;

        const response = await fetch(OVERPASS_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': USER_AGENT
            },
            body: `data=${encodeURIComponent(overpassQuery)}`
        });

        if (!response.ok) {
            throw new Error(`Overpass API error: ${response.status}`);
        }

        const data = await response.json();
        const waterFeatures = data.elements || [];

        // Check if any water features found
        const hasWaterNearby = waterFeatures.length > 0;

        // Get closest water feature info
        let closestWater = null;
        let closestDistance = Infinity;

        for (const feature of waterFeatures) {
            // Get coordinates (center for ways/relations, direct for nodes)
            let featureLat, featureLon;
            if (feature.center) {
                featureLat = feature.center.lat;
                featureLon = feature.center.lon;
            } else if (feature.lat && feature.lon) {
                featureLat = feature.lat;
                featureLon = feature.lon;
            } else {
                continue;
            }

            const distance = calculateDistance(latitude, longitude, featureLat, featureLon);
            
            if (distance < closestDistance) {
                closestDistance = distance;
                closestWater = {
                    type: feature.tags?.natural || feature.tags?.water || feature.tags?.waterway || 'water',
                    name: feature.tags?.name || 'Unnamed water body',
                    distance: Math.round(distance * 100) / 100
                };
            }
        }

        res.json({
            success: true,
            isNearWater: hasWaterNearby,
            waterFeaturesCount: waterFeatures.length,
            closestWater,
            searchRadius: searchRadius / 1000, // Return in km
            message: hasWaterNearby 
                ? `Found ${waterFeatures.length} water feature(s) within ${searchRadius / 1000}km`
                : `No water features found within ${searchRadius / 1000}km`
        });

    } catch (error) {
        console.error('[Water Verification] Error:', error.message);
        
        // If Overpass API fails, allow creation with warning
        // This prevents blocking users when the API is slow/down
        res.json({
            success: true,
            isNearWater: true, // Allow on error (graceful fallback)
            waterFeaturesCount: 0,
            closestWater: null,
            searchRadius: parseInt(req.query.radius || 5000) / 1000,
            message: 'Water verification temporarily unavailable - proceeding with location',
            warning: 'Could not verify water proximity. Please ensure you are near a shoreline.'
        });
    }
};

/**
 * Combined location verification endpoint
 * Checks both user proximity to location AND water proximity
 * @route POST /api/location/verify
 */
export const verifyLocation = async (req, res) => {
    try {
        const { 
            userLat, 
            userLon, 
            locationLat, 
            locationLon,
            maxDistanceKm = 5 
        } = req.body;

        // Validate inputs
        if (!userLat || !userLon || !locationLat || !locationLon) {
            return res.status(400).json({
                message: 'User location and target location required'
            });
        }

        // Check user proximity to selected location
        const userDistance = calculateDistance(
            parseFloat(userLat),
            parseFloat(userLon),
            parseFloat(locationLat),
            parseFloat(locationLon)
        );

        const isUserNearLocation = userDistance <= maxDistanceKm;

        // Check if location is near water (call internal function)
        const waterCheckUrl = new URL(`${process.env.BACKEND_URL || 'http://localhost:5000'}/api/location/verify-water`);
        waterCheckUrl.searchParams.append('lat', locationLat);
        waterCheckUrl.searchParams.append('lon', locationLon);
        
        // Note: In production, you'd call verifyWaterProximity directly or make internal request
        // For simplicity, we'll do inline water check
        let isNearWater = true; // Default to true for graceful degradation
        
        try {
            const overpassQuery = `
                [out:json][timeout:15];
                (
                    way["natural"="water"](around:5000,${locationLat},${locationLon});
                    way["natural"="coastline"](around:5000,${locationLat},${locationLon});
                    way["natural"="beach"](around:5000,${locationLat},${locationLon});
                    way["waterway"](around:5000,${locationLat},${locationLon});
                );
                out count;
            `;

            const overpassResponse = await fetch(OVERPASS_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': USER_AGENT
                },
                body: `data=${encodeURIComponent(overpassQuery)}`
            });

            if (overpassResponse.ok) {
                const data = await overpassResponse.json();
                isNearWater = (data.elements?.length || 0) > 0;
            }
        } catch (waterError) {
            console.warn('[Location] Water check failed, allowing creation:', waterError.message);
        }

        res.json({
            success: true,
            isValid: isUserNearLocation && isNearWater,
            userDistance: Math.round(userDistance * 100) / 100,
            isUserNearLocation,
            isNearWater,
            maxDistanceKm,
            message: !isUserNearLocation 
                ? `You are ${Math.round(userDistance * 10) / 10}km from the selected location (max ${maxDistanceKm}km allowed)`
                : !isNearWater
                    ? 'Selected location is not near any water bodies (shorelines, lakes, rivers)'
                    : 'Location verified successfully'
        });

    } catch (error) {
        console.error('[Location Verify] Error:', error.message);
        res.status(500).json({
            message: 'Location verification failed',
            error: error.message
        });
    }
};
