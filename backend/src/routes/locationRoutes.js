/**
 * Location Routes
 * Provides endpoints for location search and water body verification
 */

import express from 'express';
import { 
    searchLocations, 
    verifyWaterProximity, 
    verifyLocation 
} from '../controllers/locationController.js';

const router = express.Router();

// Search locations (Nominatim) - no auth required
router.get('/search', searchLocations);

// Verify water proximity (Overpass) - no auth required
router.get('/verify-water', verifyWaterProximity);

// Combined location verification - no auth required
router.post('/verify', verifyLocation);

export default router;
