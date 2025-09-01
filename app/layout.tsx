import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
// import PWAInstall from '@/components/PWAInstall'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import AuthProvider from '@/providers/AuthProvider'
import SPANavigation from '@/components/SPANavigation'
// import MobileNav from '@/components/MobileNav'
// import NotificationManager from '@/components/NotificationManager'

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: 'Rabotim.com - Почасова работа в България',
  description: 'Намерете или предложете почасова работа в България. Ремонт, почистване, грижа, доставка и много други услуги.',
  keywords: 'почасова работа, временна работа, България, услуги, ремонт, почистване',
  authors: [{ name: 'Rabotim.com' }],
  openGraph: {
    title: 'Rabotim.com - Почасова работа в България',
    description: 'Намерете или предложете почасова работа в България',
    type: 'website',
    locale: 'bg_BG',
  },
  themeColor: '#3b82f6',
  viewport: 'width=device-width, initial-scale=1',
  formatDetection: {
    telephone: false,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="bg">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800;900&family=Roboto:wght@300;400;500;700;900&family=Open+Sans:wght@300;400;500;600;700;800&family=Montserrat:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
        <AuthProvider>
          <SPANavigation>
            <Header />
            <main>
              {children}
            </main>
            <Footer />
          </SPANavigation>
        </AuthProvider>
        {/* <MobileNav /> */}
        {/* <NotificationManager /> */}
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