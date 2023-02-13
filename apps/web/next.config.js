/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@egodb/ui', '@egodb/store', '@egodb/domain', '@egodb/core', '@egodb/cqrs'],
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
