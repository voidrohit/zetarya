import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,      // Enable React strict mode for improved error handling
    compiler: {
        // Strip console.* from production bundles, keeping error/warn.
        removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
    },
    poweredByHeader: false,
    async redirects() {
        return [
            // Superseded by the separate /terms and /privacy pages.
            { source: '/terms-and-privacy', destination: '/terms', permanent: true },
        ];
    },
    compress: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
            },
        ],
    },
};

export default withPWA({
    dest: "public",         // destination directory for the PWA files
    disable: process.env.NODE_ENV === "development",        // disable PWA in the development environment
    register: true,         // register the PWA service worker
    skipWaiting: true,      // skip waiting for service worker activation
})(nextConfig);