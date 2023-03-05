/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  transpilePackages: ['@egodb/ui', '@egodb/store', '@egodb/domain', '@egodb/core', '@egodb/cqrs', 'lodash-es'],
  experimental: {
    appDir: true,
    outputFileTracingRoot: path.join(__dirname, '../../'),
  },
}

module.exports = withBundleAnalyzer(nextConfig)
