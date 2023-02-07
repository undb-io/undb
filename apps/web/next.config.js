/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@egodb/ui', '@egodb/store'],
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
