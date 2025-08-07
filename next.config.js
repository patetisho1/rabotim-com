/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: false,
  images: {
    domains: ['localhost', 'firebasestorage.googleapis.com'],
  },
}

module.exports = nextConfig 