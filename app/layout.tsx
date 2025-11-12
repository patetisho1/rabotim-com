import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
// import PWAInstall from '@/components/PWAInstall'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BottomNav from '@/components/BottomNav'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import { OrganizationStructuredData, WebSiteStructuredData } from '@/components/StructuredData'
import AuthProvider from '@/providers/AuthProvider'
import SPANavigation from '@/components/SPANavigation'
// import MobileNav from '@/components/MobileNav'
// import NotificationManager from '@/components/NotificationManager'

// Validate environment variables on app startup
if (typeof window === 'undefined') {
  try {
    require('@/lib/env-init')
  } catch (error) {
    // Silently fail in case of import issues
    console.warn('Could not initialize environment validation:', error)
  }
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://rabotim.com'),
  title: {
    default: 'Rabotim.com - Намери работа и изпълнители в България',
    template: '%s | Rabotim.com'
  },
  description: 'Водещата платформа за намиране на почасова работа и професионални изпълнители в България. Повече от 10,000 завършени задачи. Регистрацията е безплатна!',
  keywords: 'работа българия, почасова работа, изпълнители, freelance българия, временна работа, услуги българия, ремонт, почистване, доставка, rabotim, работа софия, работа пловдив, работа варна, работа бургас, работа плевен, работа русе, работа стара загора, работа шумен, работа ямбол, работа благоевград, работа видин, работа ловеч, работа монтана, работа разград, работа силистра, работа сливен, работа смолян, работа търговище, работа хасково, работа перник, работа кърджали, работа кюстендил, работа добрич, работа габрово, работа пазарджик, работа смолян, работа търговище, работа хасково',
  authors: [{ name: 'Rabotim.com' }],
  creator: 'Rabotim.com',
  publisher: 'Rabotim.com',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://rabotim.com',
    languages: {
      'bg-BG': 'https://rabotim.com',
      'en-US': 'https://rabotim.com/en'
    }
  },
  openGraph: {
    type: 'website',
    locale: 'bg_BG',
    url: 'https://rabotim.com',
    siteName: 'Rabotim.com',
    title: 'Rabotim.com - Намери работа и изпълнители в България',
    description: 'Водещата платформа за намиране на почасова работа и професионални изпълнители в България. Повече от 10,000 завършени задачи.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Rabotim.com - Намери работа и изпълнители в България',
        type: 'image/png'
      }
    ],
    countryName: 'Bulgaria'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rabotim.com - Намери работа и изпълнители в България',
    description: 'Водещата платформа за намиране на почасова работа и професионални изпълнители в България. Повече от 10,000 завършени задачи.',
    images: ['/og-image.png'],
    creator: '@rabotim_bg',
    site: '@rabotim_bg'
  },
  themeColor: '#3b82f6',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5
  },
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
    url: false
  },
  verification: {
    google: 'verification_token_here', // TODO: Add real token
  },
  category: 'Business',
  classification: 'Job Board, Freelance Platform',
  referrer: 'origin-when-cross-origin',
  colorScheme: 'light dark',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="bg">
      <head>
        {/* Preconnect to external domains for better performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://wwbxzkbilklullziiogr.supabase.co" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://firebasestorage.googleapis.com" />
        
        {/* Critical CSS inlining */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical above-the-fold styles */
            body { margin: 0; font-family: 'Inter', sans-serif; }
            .loading-spinner { display: inline-block; width: 20px; height: 20px; border: 2px solid #f3f3f3; border-top: 2px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          `
        }} />
      </head>
      <body>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
        <OrganizationStructuredData />
        <WebSiteStructuredData />
        <AuthProvider>
          <SPANavigation>
            <Header />
            <main className="pb-safe">
              {children}
            </main>
            <Footer />
            <BottomNav />
          </SPANavigation>
        </AuthProvider>
        {/* <MobileNav /> */}
        {/* <NotificationManager /> */}
        {/* Демо данни за тестване */}
        <script src="/demo-data.js" />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
        {/* <PWAInstall /> */}
        
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
              
              // SPA Navigation Enhancement
              document.addEventListener('DOMContentLoaded', function() {
                // Preload critical pages
                const criticalPages = ['/tasks', '/favorites', '/login'];
                criticalPages.forEach(page => {
                  const link = document.createElement('link');
                  link.rel = 'prefetch';
                  link.href = page;
                  document.head.appendChild(link);
                });
              });
            `,
          }}
        />
        
        {/* <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        /> */}
      </body>
    </html>
  )
}