/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
    transpilePackages: ["@egodb/ui"],
  },
};

module.exports = nextConfig
