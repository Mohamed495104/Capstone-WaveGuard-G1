/**
 * Location Controller
 * Provides location search (Nominatim) and water body verification (Overpass API)
 * Using OpenStreetMap free APIs
 * 
 * Water Body Verification Strategy:
 * - Only allows significant water bodies suitable for cleanup activities
 * - Includes: beaches, coastlines, large lakes, rivers, conservation areas
 * - Excludes: small ponds, fountains, drainage ditches, streams
 */

import { calculateDistance } from '../utils/locationUtils.js';

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';
const OVERPASS_BASE_URL = 'https://overpass-api.de/api/interpreter';

// User agent required by Nominatim usage policy
const USER_AGENT = 'MarineCare/1.0 (cleanup-challenge-app)';

/**
 * Allowed water body types for cleanup challenges
 * These are significant water bodies where cleanup activities make sense
 */
const ALLOWED_WATER_TYPES = {
    // Natural features (high priority)
    beach: { priority: 1, label: 'Beach' },
    coastline: { priority: 1, label: 'Coastline' },
    
    // Large water bodies
    lake: { priority: 2, label: 'Lake' },
    reservoir: { priority: 2, label: 'Reservoir' },
    lagoon: { priority: 2, label: 'Lagoon' },
    
    // Rivers (significant waterways)
    river: { priority: 3, label: 'River' },
    canal: { priority: 3, label: 'Canal' },
    
    // Conservation areas
    nature_reserve: { priority: 2, label: 'Nature Reserve' },
    protected_area: { priority: 2, label: 'Protected Area' },
    
    // Generic water (if large enough based on name/context)
    water: { priority: 4, label: 'Water Body' }
};

/**
 * Excluded water body types - too small for organized cleanup
 * Note: Different tag systems are used in OSM:
 * - 'water' tag values for water bodies (pond, basin, etc.)
 * - 'waterway' tag values for flowing water (stream, ditch, drain)
 */
const EXCLUDED_WATER_TYPES = [
    // Water body types (used with natural=water + water=xxx)
    'pond',           // Small ponds
    'basin',          // Small basins
    'fish_pond',      // Fish farming ponds
    'wastewater',     // Wastewater treatment
    'sewage',         // Sewage systems
    'reflecting_pool', // Decorative pools
    'moat',           // Decorative moats
    
    // Waterway types (used with waterway=xxx)
    'stream',         // Small streams (use river instead)
    'brook',          // Small brooks
    'drain',          // Drainage channels
    'ditch',          // Irrigation/drainage ditches
    'canal',          // Note: We DO allow canals in query, but include here for reference
];

/**
 * Waterway types to explicitly exclude (checked separately from water body types)
 */
const EXCLUDED_WATERWAY_TYPES = [
    'stream',
    'brook', 
    'drain',
    'ditch',
    'tidal_channel'
];

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
 * Verify if a location is near significant water bodies (beaches, lakes, coastlines, rivers)
 * Uses Overpass API to query OpenStreetMap data with strict filtering
 * 
 * Only allows:
 * - Beaches (natural=beach)
 * - Coastlines (natural=coastline) 
 * - Large lakes (natural=water + water=lake/reservoir/lagoon)
 * - Rivers (waterway=river or waterway=canal)
 * - Conservation areas near water (leisure=nature_reserve, boundary=protected_area)
 * 
 * Excludes:
 * - Small ponds, fountains, pools
 * - Drainage ditches, streams
 * - Fish ponds, wastewater facilities
 * 
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

        // Enhanced Overpass QL query - only significant water bodies
        // This query is more restrictive to filter out small ponds, fountains, etc.
        const overpassQuery = `
            [out:json][timeout:25];
            (
                // BEACHES - Primary target for cleanup activities
                way["natural"="beach"](around:${searchRadius},${latitude},${longitude});
                node["natural"="beach"](around:${searchRadius},${latitude},${longitude});
                
                // COASTLINES - Ocean/sea access points
                way["natural"="coastline"](around:${searchRadius},${latitude},${longitude});
                
                // LARGE LAKES - Excludes ponds by requiring water=lake/reservoir/lagoon
                way["natural"="water"]["water"="lake"](around:${searchRadius},${latitude},${longitude});
                way["natural"="water"]["water"="reservoir"](around:${searchRadius},${latitude},${longitude});
                way["natural"="water"]["water"="lagoon"](around:${searchRadius},${latitude},${longitude});
                relation["natural"="water"]["water"="lake"](around:${searchRadius},${latitude},${longitude});
                relation["natural"="water"]["water"="reservoir"](around:${searchRadius},${latitude},${longitude});
                
                // RIVERS - Only main rivers, not streams or ditches
                way["waterway"="river"](around:${searchRadius},${latitude},${longitude});
                way["waterway"="canal"](around:${searchRadius},${latitude},${longitude});
                
                // CONSERVATION AREAS - Nature reserves often have water bodies
                way["leisure"="nature_reserve"](around:${searchRadius},${latitude},${longitude});
                way["boundary"="protected_area"](around:${searchRadius},${latitude},${longitude});
                relation["leisure"="nature_reserve"](around:${searchRadius},${latitude},${longitude});
                relation["boundary"="protected_area"](around:${searchRadius},${latitude},${longitude});
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
        const rawFeatures = data.elements || [];
        
        // Filter out excluded water types and validate features
        const validWaterFeatures = filterValidWaterFeatures(rawFeatures, latitude, longitude);

        // Check if any valid water features found
        const hasWaterNearby = validWaterFeatures.length > 0;

        // Get closest valid water feature info
        let closestWater = null;
        if (validWaterFeatures.length > 0) {
            // Sort by distance and get the closest one
            validWaterFeatures.sort((a, b) => a.distance - b.distance);
            const closest = validWaterFeatures[0];
            closestWater = {
                type: closest.type,
                typeLabel: closest.typeLabel,
                name: closest.name,
                distance: Math.round(closest.distance * 100) / 100
            };
        }

        res.json({
            success: true,
            isNearWater: hasWaterNearby,
            waterFeaturesCount: validWaterFeatures.length,
            closestWater,
            searchRadius: searchRadius / 1000, // Return in km
            allowedTypes: Object.keys(ALLOWED_WATER_TYPES),
            message: hasWaterNearby 
                ? `Found ${validWaterFeatures.length} valid water feature(s) within ${searchRadius / 1000}km`
                : `No suitable water bodies (beaches, lakes, coastlines, rivers) found within ${searchRadius / 1000}km. Small ponds and streams are not allowed.`
        });

    } catch (error) {
        console.error('[Water Verification] Error:', error.message);
        
        // If Overpass API fails, DO NOT allow creation - require verification
        // This is stricter than before to ensure location accuracy
        res.json({
            success: true,
            isNearWater: false, // Changed from true - require proper verification
            waterFeaturesCount: 0,
            closestWater: null,
            searchRadius: parseInt(req.query.radius || 5000) / 1000,
            message: 'Water verification service temporarily unavailable. Please try again.',
            warning: 'Could not verify water proximity. Please ensure you are near a beach, lake, coastline, or river.',
            retryable: true
        });
    }
};

/**
 * Filter and validate water features from Overpass response
 * Removes excluded types (ponds, fountains, etc.) and calculates distances
 * 
 * @param {Array} features - Raw features from Overpass API
 * @param {number} userLat - User's latitude
 * @param {number} userLon - User's longitude
 * @returns {Array} Filtered valid water features with distance info
 */
function filterValidWaterFeatures(features, userLat, userLon) {
    const validFeatures = [];
    
    for (const feature of features) {
        const tags = feature.tags || {};
        
        // Determine the water type from tags
        let waterType = null;
        let typeLabel = null;
        
        // Check natural features first (beaches, coastlines)
        if (tags.natural === 'beach') {
            waterType = 'beach';
            typeLabel = 'Beach';
        } else if (tags.natural === 'coastline') {
            waterType = 'coastline';
            typeLabel = 'Coastline';
        } else if (tags.natural === 'water') {
            // For water bodies, check the specific type
            const specificWaterType = tags.water;
            if (specificWaterType && EXCLUDED_WATER_TYPES.includes(specificWaterType)) {
                // Skip excluded types like ponds, pools, fountains
                continue;
            }
            if (specificWaterType === 'lake') {
                waterType = 'lake';
                typeLabel = 'Lake';
            } else if (specificWaterType === 'reservoir') {
                waterType = 'reservoir';
                typeLabel = 'Reservoir';
            } else if (specificWaterType === 'lagoon') {
                waterType = 'lagoon';
                typeLabel = 'Lagoon';
            } else {
                // Generic water - only include if it has a name (likely significant)
                if (tags.name) {
                    waterType = 'water';
                    typeLabel = 'Water Body';
                } else {
                    continue; // Skip unnamed generic water (likely small/insignificant)
                }
            }
        } else if (tags.waterway) {
            const waterwayType = tags.waterway;
            // Only allow rivers and canals, not streams/ditches/drains
            if (waterwayType === 'river') {
                waterType = 'river';
                typeLabel = 'River';
            } else if (waterwayType === 'canal') {
                waterType = 'canal';
                typeLabel = 'Canal';
            } else if (EXCLUDED_WATERWAY_TYPES.includes(waterwayType)) {
                continue; // Skip streams, ditches, drains explicitly
            } else {
                continue; // Skip other waterway types (be conservative)
            }
        } else if (tags.leisure === 'nature_reserve') {
            waterType = 'nature_reserve';
            typeLabel = 'Nature Reserve';
        } else if (tags.boundary === 'protected_area') {
            waterType = 'protected_area';
            typeLabel = 'Protected Area';
        } else {
            // Unknown type - skip
            continue;
        }
        
        // Get coordinates (center for ways/relations, direct for nodes)
        let featureLat, featureLon;
        if (feature.center) {
            featureLat = feature.center.lat;
            featureLon = feature.center.lon;
        } else if (feature.lat && feature.lon) {
            featureLat = feature.lat;
            featureLon = feature.lon;
        } else {
            continue; // No valid coordinates
        }
        
        // Calculate distance from user
        const distance = calculateDistance(userLat, userLon, featureLat, featureLon);
        
        validFeatures.push({
            type: waterType,
            typeLabel: typeLabel,
            name: tags.name || `Unnamed ${typeLabel}`,
            distance: distance,
            lat: featureLat,
            lon: featureLon
        });
    }
    
    return validFeatures;
}

/**
 * Combined location verification endpoint
 * Checks both user proximity to location AND water proximity with strict filtering
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

        // Check if location is near significant water bodies (strict check)
        let isNearWater = false; // Default to false - require verification
        let waterDetails = null;
        
        try {
            // Enhanced Overpass query - only significant water bodies
            const overpassQuery = `
                [out:json][timeout:15];
                (
                    // Beaches
                    way["natural"="beach"](around:5000,${locationLat},${locationLon});
                    node["natural"="beach"](around:5000,${locationLat},${locationLon});
                    
                    // Coastlines
                    way["natural"="coastline"](around:5000,${locationLat},${locationLon});
                    
                    // Large lakes only
                    way["natural"="water"]["water"="lake"](around:5000,${locationLat},${locationLon});
                    way["natural"="water"]["water"="reservoir"](around:5000,${locationLat},${locationLon});
                    relation["natural"="water"]["water"="lake"](around:5000,${locationLat},${locationLon});
                    
                    // Rivers (not streams)
                    way["waterway"="river"](around:5000,${locationLat},${locationLon});
                    way["waterway"="canal"](around:5000,${locationLat},${locationLon});
                    
                    // Conservation areas
                    way["leisure"="nature_reserve"](around:5000,${locationLat},${locationLon});
                    way["boundary"="protected_area"](around:5000,${locationLat},${locationLon});
                );
                out tags center;
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
                const rawFeatures = data.elements || [];
                
                // Filter to only valid water features
                const validFeatures = filterValidWaterFeatures(
                    rawFeatures, 
                    parseFloat(locationLat), 
                    parseFloat(locationLon)
                );
                
                isNearWater = validFeatures.length > 0;
                
                if (validFeatures.length > 0) {
                    validFeatures.sort((a, b) => a.distance - b.distance);
                    const closest = validFeatures[0];
                    waterDetails = {
                        type: closest.typeLabel,
                        name: closest.name,
                        distance: Math.round(closest.distance * 100) / 100
                    };
                }
            }
        } catch (waterError) {
            console.warn('[Location] Water check failed:', waterError.message);
            // On error, require retry rather than allowing through
            return res.json({
                success: true,
                isValid: false,
                userDistance: Math.round(userDistance * 100) / 100,
                isUserNearLocation,
                isNearWater: false,
                maxDistanceKm,
                message: 'Water verification temporarily unavailable. Please try again.',
                retryable: true
            });
        }

        res.json({
            success: true,
            isValid: isUserNearLocation && isNearWater,
            userDistance: Math.round(userDistance * 100) / 100,
            isUserNearLocation,
            isNearWater,
            waterDetails,
            maxDistanceKm,
            message: !isUserNearLocation 
                ? `You are ${Math.round(userDistance * 10) / 10}km from the selected location (max ${maxDistanceKm}km allowed)`
                : !isNearWater
                    ? 'Selected location is not near any suitable water bodies (beaches, lakes, coastlines, rivers). Small ponds and streams are not allowed.'
                    : `Location verified successfully - near ${waterDetails?.type || 'water body'}`
        });

    } catch (error) {
        console.error('[Location Verify] Error:', error.message);
        res.status(500).json({
            message: 'Location verification failed',
            error: error.message
        });
    }
};
