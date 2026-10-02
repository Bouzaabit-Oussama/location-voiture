/** @type {import('next').NextConfig} */
const nextConfig = {
  // Strict mode for development quality
  reactStrictMode: true,

  // Image optimization — allow Supabase Storage images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },

  // Headers for security and PWA
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
      {
        // Service worker scope
        source: "/sw.js",
        headers: [
          {
            key: "Service-Worker-Allowed",
            value: "/",
          },
        ],
      },
    ];
  },

  // Vercel deployment — no trailing slashes
  trailingSlash: false,

  // Enable experimental features for App Router
  experimental: {
    // Enable server actions for form handling
    serverActions: {
      bodySizeLimit: "5mb", // For inspection photo uploads
    },
  },
};

export default nextConfig;
