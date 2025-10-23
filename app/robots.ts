import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rabotim.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/tasks',
          '/task/*',
          '/categories',
          '/about',
          '/contact',
          '/how-it-works',
          '/become-tasker',
          '/careers',
          '/ratings',
          '/search'
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/profile',
          '/my-tasks',
          '/my-applications',
          '/messages',
          '/notifications',
          '/settings',
          '/auth/',
          '/auth/*',
          '/submit-offer/',
          '/review/',
          '/payment/',
          '/archived-tasks',
          '/task/*/edit',
          '/task/*/promote',
          '/task/*/analytics',
          '/task/*/applicants',
          '/task/*/complete'
        ],
        crawlDelay: 1
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/tasks',
          '/task/*',
          '/categories',
          '/about',
          '/contact',
          '/how-it-works',
          '/become-tasker',
          '/careers',
          '/ratings',
          '/search'
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/profile',
          '/my-tasks',
          '/my-applications',
          '/messages',
          '/notifications',
          '/settings',
          '/auth/',
          '/auth/*',
          '/submit-offer/',
          '/review/',
          '/payment/',
          '/archived-tasks',
          '/task/*/edit',
          '/task/*/promote',
          '/task/*/analytics',
          '/task/*/applicants',
          '/task/*/complete'
        ],
        crawlDelay: 1
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl
  }
}


