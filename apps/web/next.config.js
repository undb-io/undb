/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@egodb/ui'],
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
