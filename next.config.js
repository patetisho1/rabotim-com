/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  images: {
    domains: ['localhost', 'firebasestorage.googleapis.com', 'images.unsplash.com'],
    formats: ['image/webp', 'image/avif'],
  },
  // SPA оптимизации
  trailingSlash: false,
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  // Подобрено кеширане
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
}

module.exports = nextConfig 