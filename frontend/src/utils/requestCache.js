/**
 * Simple in-memory cache for API requests with IndexedDB persistence.
 * Reduces redundant calls, helps avoid rate limiting, and supports offline access.
 */

const DB_NAME = 'MarineCareCache';
const DB_VERSION = 1;
const STORE_NAME = 'requests';

/**
 * Initialize IndexedDB for cache persistence
 */
function openDatabase() {
    return new Promise((resolve, reject) => {
        if (typeof window === 'undefined' || !window.indexedDB) {
            resolve(null);
            return;
        }

        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => {
            console.warn('IndexedDB not available for cache persistence');
            resolve(null);
        };

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'key' });
            }
        };
    });
}

class RequestCache {
    constructor() {
        this.cache = new Map();
        this.defaultTTL = 60000; // 1 minute default TTL
        this.db = null;
        this.dbReady = this.initDB();
    }

    /**
     * Initialize database connection
     */
    async initDB() {
        this.db = await openDatabase();
        if (this.db) {
            await this.loadFromIndexedDB();
        }
    }

    /**
     * Load cached data from IndexedDB into memory
     */
    async loadFromIndexedDB() {
        if (!this.db) return;

        try {
            const transaction = this.db.transaction(STORE_NAME, 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.getAll();

            await new Promise((resolve, reject) => {
                request.onsuccess = () => {
                    const now = Date.now();
                    const entries = request.result || [];
                    entries.forEach(entry => {
                        if (now <= entry.expiresAt) {
                            this.cache.set(entry.key, {
                                data: entry.data,
                                expiresAt: entry.expiresAt,
                            });
                        }
                    });
                    resolve();
                };
                request.onerror = () => {
                    console.warn('Failed to load cache from IndexedDB');
                    resolve();
                };
            });
        } catch (err) {
            console.warn('Error loading from IndexedDB:', err);
        }
    }

    /**
     * Save a cache entry to IndexedDB
     */
    async saveToIndexedDB(key, data, expiresAt) {
        if (!this.db) return;

        try {
            const transaction = this.db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            store.put({ key, data, expiresAt });
        } catch (err) {
            console.warn('Error saving to IndexedDB:', err);
        }
    }

    /**
     * Remove a cache entry from IndexedDB
     */
    async removeFromIndexedDB(key) {
        if (!this.db) return;

        try {
            const transaction = this.db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            store.delete(key);
        } catch (err) {
            console.warn('Error removing from IndexedDB:', err);
        }
    }

    /**
     * Clear all entries from IndexedDB
     */
    async clearIndexedDB() {
        if (!this.db) return;

        try {
            const transaction = this.db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            store.clear();
        } catch (err) {
            console.warn('Error clearing IndexedDB:', err);
        }
    }

    /**
     * Generate a cache key from request parameters
     */
    generateKey(method, url) {
        return `${method.toUpperCase()}:${url}`;
    }

    /**
     * Get cached response if available and not expired
     */
    get(method, url) {
        const key = this.generateKey(method, url);
        const cached = this.cache.get(key);

        if (!cached) {
            return null;
        }

        const now = Date.now();
        if (now > cached.expiresAt) {
            // Cache expired, remove it
            this.cache.delete(key);
            this.removeFromIndexedDB(key);
            return null;
        }

        return cached.data;
    }

    /**
     * Store response in cache with TTL
     */
    set(method, url, data, ttl = this.defaultTTL) {
        const key = this.generateKey(method, url);
        const expiresAt = Date.now() + ttl;
        this.cache.set(key, {
            data,
            expiresAt,
        });
        this.saveToIndexedDB(key, data, expiresAt);
    }

    /**
     * Invalidate cache for a specific request
     */
    invalidate(method, url) {
        const key = this.generateKey(method, url);
        this.cache.delete(key);
        this.removeFromIndexedDB(key);
    }

    /**
     * Invalidate all cache entries matching a pattern
     */
    invalidatePattern(pattern) {
        for (const key of this.cache.keys()) {
            if (key.includes(pattern)) {
                this.cache.delete(key);
                this.removeFromIndexedDB(key);
            }
        }
    }

    /**
     * Clear all cache
     */
    clear() {
        this.cache.clear();
        this.clearIndexedDB();
    }

    /**
     * Clean up expired entries
     */
    cleanup() {
        const now = Date.now();
        for (const [key, value] of this.cache.entries()) {
            if (now > value.expiresAt) {
                this.cache.delete(key);
                this.removeFromIndexedDB(key);
            }
        }
    }
}

// Export singleton instance
export const requestCache = new RequestCache();

// Cleanup expired entries every 5 minutes
// Store interval ID so it can be cleared if needed
let cleanupIntervalId;

if (typeof window !== 'undefined') {
    cleanupIntervalId = setInterval(() => requestCache.cleanup(), 5 * 60 * 1000);
    
    // Clear interval on page unload to prevent memory leaks
    if (typeof window.addEventListener === 'function') {
        window.addEventListener('beforeunload', () => {
            if (cleanupIntervalId) {
                clearInterval(cleanupIntervalId);
            }
        });
    }
}

/**
 * Stop the cleanup interval (useful for cleanup in tests or when module is unloaded)
 */
export const stopCleanupInterval = () => {
    if (cleanupIntervalId) {
        clearInterval(cleanupIntervalId);
        cleanupIntervalId = null;
    }
};
