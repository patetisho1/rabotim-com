import type { Metadata } from 'next'
import './globals.css'
// import { Toaster } from 'react-hot-toast'
// import PWAInstall from '@/components/PWAInstall'
import Header from '@/components/Header'
import GoogleAnalytics from '@/components/GoogleAnalytics'
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
  manifest: '/manifest.json',
  themeColor: '#3b82f6',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Rabotim.com',
  },
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
      <body>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
        <Header />
        <main>
          {children}
        </main>
        {/* <MobileNav /> */}
        {/* <NotificationManager /> */}
        {/* <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        /> */}
        {/* <PWAInstall /> */}
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