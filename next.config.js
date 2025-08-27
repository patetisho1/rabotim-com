/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  images: {
    domains: ['localhost', 'firebasestorage.googleapis.com', 'images.unsplash.com'],
    formats: ['image/webp', 'image/avif'],
  },
  // Google Maps CSP
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://maps.googleapis.com https://maps.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://maps.gstatic.com; img-src 'self' data: https://maps.googleapis.com https://maps.gstatic.com https://*.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://maps.googleapis.com;"
          }
        ]
      }
    ]
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