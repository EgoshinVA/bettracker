/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['@bettracker/shared'],
}
module.exports = nextConfig
