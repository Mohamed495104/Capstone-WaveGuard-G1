// next.config.mjs
import nextPWA from "next-pwa";

const withPWA = nextPWA({
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: false,
    fallbacks: {
        document: "/offline.html",
    },
    runtimeCaching: [
        {
            urlPattern: /^https?:\/\/.*\/api\/challenges(?:\/.*)?$/,
            handler: "StaleWhileRevalidate",
            options: {
                cacheName: "challenges-cache",
                expiration: {
                    maxEntries: 50,
                    maxAgeSeconds: 86400,
                },
            },
        },
        {
            urlPattern: /^https?:\/\/.*\/api\/profile(?:\/.*)?$/,
            handler: "StaleWhileRevalidate",
            options: {
                cacheName: "profile-cache",
                expiration: {
                    maxEntries: 10,
                    maxAgeSeconds: 86400,
                },
            },
        },
        {
            urlPattern: /^https?:\/\/.*\/api\/achievements(?:\/.*)?$/,
            handler: "StaleWhileRevalidate",
            options: {
                cacheName: "achievements-cache",
                expiration: {
                    maxEntries: 50,
                    maxAgeSeconds: 86400,
                },
            },
        },
        {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
            handler: "CacheFirst",
            options: {
                cacheName: "images-cache",
                expiration: {
                    maxEntries: 100,
                    maxAgeSeconds: 60 * 60 * 24 * 30,
                },
            },
        },
    ],
});

const nextConfig = {
    reactStrictMode: true,

    // ✅ NEW VALID WAY TO FORCE WEBPACK in Next.js 16
    turbopack: {
        enabled: false,
    },

    images: {
        formats: ['image/webp', 'image/avif'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },

    webpack(config) {
        return config; // required for next-pwa to work
    },
};

export default withPWA(nextConfig);
