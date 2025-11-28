/** @type {import('next').NextConfig} */
const nextConfig = {
  // Оптимизации за производителност
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  
  // Оптимизации за изображения
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wwbxzkbilklullziiogr.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
    // AVIF first for better compression, then WebP fallback
    formats: ['image/avif', 'image/webp'],
    // Longer cache for better performance
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Optimized device sizes - removed very large sizes to reduce bundle
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    // Unoptimized for external images if needed
    unoptimized: false,
  },

  // Оптимизации за кеширане
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },

  // Оптимизации за bundle size
  experimental: {
    optimizePackageImports: [
      'lucide-react', 
      '@supabase/supabase-js',
      'react-hot-toast',
      'date-fns',
    ],
  },
  
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

  // Webpack оптимизации
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Оптимизации за production
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          supabase: {
            test: /[\\/]node_modules[\\/]@supabase[\\/]/,
            name: 'supabase',
            chunks: 'all',
          },
        },
      };
    }
    return config;
  },

  // Headers за кеширане
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, s-maxage=60',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig 