'use client'

import { useEffect } from 'react'

interface DynamicMetaTagsProps {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'article'
  keywords?: string[]
}

/**
 * Dynamic Meta Tags Component
 * Updates page meta tags dynamically for client components
 * Works with Next.js App Router
 */
export default function DynamicMetaTags({
  title,
  description,
  image,
  url,
  type = 'website',
  keywords = []
}: DynamicMetaTagsProps) {
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Update document title
    if (title) {
      document.title = title
    }

    // Helper function to update or create meta tags
    const updateMetaTag = (name: string, content: string, attribute: string = 'name') => {
      if (!content) return
      
      let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute(attribute, name)
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    }

    // Update description
    if (description) {
      updateMetaTag('description', description)
      updateMetaTag('og:description', description, 'property')
      updateMetaTag('twitter:description', description)
    }

    // Update Open Graph tags
    if (title) {
      updateMetaTag('og:title', title, 'property')
      updateMetaTag('twitter:title', title)
    }

    if (url) {
      updateMetaTag('og:url', url, 'property')
    }

    if (image) {
      updateMetaTag('og:image', image, 'property')
      updateMetaTag('twitter:image', image)
    }

    updateMetaTag('og:type', type, 'property')

    // Update keywords
    if (keywords && keywords.length > 0) {
      updateMetaTag('keywords', keywords.join(', '))
    }

    // Update canonical URL
    if (url) {
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
      if (!canonical) {
        canonical = document.createElement('link')
        canonical.setAttribute('rel', 'canonical')
        document.head.appendChild(canonical)
      }
      canonical.setAttribute('href', url)
    }
  }, [title, description, image, url, type, keywords])

  return null
}

