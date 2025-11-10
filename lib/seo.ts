import { Metadata } from 'next'

interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  canonical?: string
  image?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
  tags?: string[]
}

export function generateMetadata(config: SEOConfig): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rabotim.com'
  
  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords?.join(', '),
    alternates: {
      canonical: config.canonical || `${baseUrl}${config.canonical || ''}`
    },
    openGraph: {
      title: config.title,
      description: config.description,
      url: config.canonical || `${baseUrl}${config.canonical || ''}`,
      siteName: 'Rabotim.com',
      images: [
        {
          url: config.image || '/og-image.png',
          width: 1200,
          height: 630,
          alt: config.title
        }
      ],
      locale: 'bg_BG',
      type: config.type || 'website',
      publishedTime: config.publishedTime,
      modifiedTime: config.modifiedTime,
      authors: config.author ? [config.author] : undefined,
      section: config.section,
      tags: config.tags
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
      images: [config.image || '/og-image.png']
    }
  }
}

export const defaultSEOConfig = {
  title: 'Rabotim.com - Намери работа и изпълнители в България',
  description: 'Водещата платформа за намиране на почасова работа и професионални изпълнители в България. Повече от 10,000 завършени задачи.',
  keywords: [
    'работа българия',
    'почасова работа',
    'изпълнители',
    'freelance българия',
    'временна работа',
    'услуги българия',
    'ремонт',
    'почистване',
    'доставка',
    'обучение',
    'градинарство',
    'it услуги',
    'rabotim'
  ]
}

export function generateTaskMetadata(task: any) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rabotim.com'
  
  return generateMetadata({
    title: `${task.title} - ${task.location} | Rabotim.com`,
    description: `${task.description.substring(0, 160)}... Намери работа в ${task.location} с Rabotim.com`,
    keywords: [
      task.category,
      task.location,
      'работа',
      'изпълнители',
      'услуги',
      'rabotim'
    ],
    canonical: `/task/${task.id}`,
    type: 'article',
    publishedTime: task.created_at,
    modifiedTime: task.updated_at,
    author: 'Rabotim.com',
    section: task.category,
    tags: [task.category, task.location, task.price_type]
  })
}

export function generateCategoryMetadata(category: string, location?: string) {
  const locationText = location ? ` в ${location}` : ''
  
  return generateMetadata({
    title: `${category}${locationText} | Rabotim.com`,
    description: `Намери ${category.toLowerCase()} услуги${locationText} с Rabotim.com. Професионални изпълнители и конкурентни цени.`,
    keywords: [
      category,
      location || 'българия',
      'услуги',
      'изпълнители',
      'работа',
      'rabotim'
    ],
    canonical: `/tasks?category=${category}${location ? `&location=${location}` : ''}`,
    section: category
  })
}

export function generateLocationMetadata(location: string) {
  return generateMetadata({
    title: `Работа в ${location} | Rabotim.com`,
    description: `Намери работа и изпълнители в ${location} с Rabotim.com. Повече от 10,000 завършени задачи.`,
    keywords: [
      location,
      'работа',
      'изпълнители',
      'услуги',
      'българия',
      'rabotim'
    ],
    canonical: `/tasks?location=${location}`,
    section: location
  })
}