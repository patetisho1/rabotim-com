import { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://rabotim.com'
const SITE_NAME = 'Rabotim.com'
const DEFAULT_TITLE = 'Rabotim.com - Намери работа и изпълнители в България'
const DEFAULT_DESCRIPTION = 'Rabotim.com е водещата платформа за намиране на почасова работа и професионални изпълнители в България. Публикувайте обяви безплатно или започнете да печелите като изпълнител.'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'profile'
  noIndex?: boolean
}

export function generateMetadata({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  noIndex = false
}: SEOProps = {}): Metadata {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE
  const fullDescription = description || DEFAULT_DESCRIPTION
  const fullUrl = url ? `${SITE_URL}${url}` : SITE_URL
  const ogImage = image || `${SITE_URL}/og-image.png`

  const defaultKeywords = [
    'работа българия',
    'почасова работа',
    'изпълнители',
    'freelance българия',
    'временна работа',
    'услуги българия',
    'ремонт',
    'почистване',
    'доставка',
    'rabotim'
  ]

  return {
    title: fullTitle,
    description: fullDescription,
    keywords: [...keywords, ...defaultKeywords].join(', '),
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    robots: noIndex ? 'noindex, nofollow' : 'index, follow',
    
    openGraph: {
      type,
      locale: 'bg_BG',
      url: fullUrl,
      title: fullTitle,
      description: fullDescription,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: fullTitle
        }
      ]
    },

    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: fullDescription,
      images: [ogImage],
      creator: '@rabotim_bg'
    },

    alternates: {
      canonical: fullUrl
    },

    other: {
      'theme-color': '#3b82f6',
      'mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default'
    }
  }
}

// Page-specific metadata generators
export const pageMetadata = {
  home: () => generateMetadata({
    title: 'Начало',
    description: 'Намерете или предложете почасова работа в България. Повече от 10,000 завършени задачи. Регистрацията е безплатна!',
    keywords: ['начална страница', 'работа онлайн', 'freelance платформа']
  }),

  tasks: () => generateMetadata({
    title: 'Разгледай задачи',
    description: 'Разгледайте хиляди активни обяви за работа в България. Намерете перфектната задача за вас - ремонт, почистване, доставка, IT услуги и много други.',
    url: '/tasks',
    keywords: ['обяви за работа', 'задачи', 'намери работа', 'freelance обяви']
  }),

  postTask: () => generateMetadata({
    title: 'Публикувай обява',
    description: 'Публикувайте обява за работа безплатно и намерете квалифицирани изпълнители за вашата задача. Бърза регистрация и лесна комуникация.',
    url: '/post-task',
    keywords: ['публикувай обява', 'намери изпълнител', 'наеми работник']
  }),

  profile: () => generateMetadata({
    title: 'Моят профил',
    description: 'Управлявайте вашия профил, обяви, кандидатури и настройки на Rabotim.com',
    url: '/profile',
    noIndex: true // Private page
  }),

  myTasks: () => generateMetadata({
    title: 'Моите задачи',
    description: 'Вижте и управлявайте вашите публикувани обяви, кандидати и статуси на задачите.',
    url: '/my-tasks',
    noIndex: true
  }),

  myApplications: () => generateMetadata({
    title: 'Моите кандидатури',
    description: 'Вижте статуса на вашите кандидатури и комуникирайте с работодателите.',
    url: '/my-applications',
    noIndex: true
  }),

  messages: () => generateMetadata({
    title: 'Съобщения',
    description: 'Комуникирайте директно с работодатели и изпълнители чрез нашата messaging система.',
    url: '/messages',
    noIndex: true
  }),

  login: () => generateMetadata({
    title: 'Вход',
    description: 'Влезте в профила си на Rabotim.com и започнете да работите или намерете изпълнители.',
    url: '/login',
    noIndex: true
  }),

  register: () => generateMetadata({
    title: 'Регистрация',
    description: 'Регистрирайте се безплатно на Rabotim.com и започнете да публикувате обяви или да печелите като изпълнител.',
    url: '/register'
  }),

  howItWorks: () => generateMetadata({
    title: 'Как работи',
    description: 'Научете как работи Rabotim.com - от публикуване на обява до успешно завършване на работата и оставяне на отзиви.',
    url: '/how-it-works'
  }),

  about: () => generateMetadata({
    title: 'За нас',
    description: 'Rabotim.com е българска платформа, която свързва хора, търсещи работа с тези, които предлагат услуги. Нашата мисия е да направим намирането на работа лесно и достъпно.',
    url: '/about'
  }),

  contact: () => generateMetadata({
    title: 'Контакти',
    description: 'Свържете се с екипа на Rabotim.com. Отговаряме на всички въпроси и предложения.',
    url: '/contact'
  }),

  categories: () => generateMetadata({
    title: 'Категории',
    description: 'Разгледайте всички категории услуги на Rabotim.com - ремонт, почистване, градинарство, IT, доставка и много други.',
    url: '/categories'
  }),

  // Dynamic pages
  task: (taskId: string, taskTitle?: string) => generateMetadata({
    title: taskTitle || 'Детайли за задача',
    description: taskTitle ? `Разгледайте детайлите и кандидатствайте за "${taskTitle}" на Rabotim.com` : 'Разгледайте детайлите за тази задача',
    url: `/task/${taskId}`,
    type: 'article'
  }),

  userProfile: (userId: string, userName?: string) => generateMetadata({
    title: userName ? `Профил на ${userName}` : 'Потребителски профил',
    description: userName ? `Вижте профила, рейтинга и отзивите на ${userName} на Rabotim.com` : 'Вижте потребителския профил',
    url: `/user/${userId}`,
    type: 'profile'
  })
}

