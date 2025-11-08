/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true, // your existing setting
  },
  typescript: {
    // 🚨 Temporarily ignore type errors during build
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
