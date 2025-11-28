'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[]
  className?: string
  showHome?: boolean
}

// Route to label mapping for Bulgarian
const routeLabels: Record<string, string> = {
  'tasks': 'Задачи',
  'categories': 'Категории',
  'post-task': 'Публикувай задача',
  'my-tasks': 'Моите задачи',
  'profile': 'Профил',
  'messages': 'Съобщения',
  'notifications': 'Известия',
  'how-it-works': 'Как работи',
  'about': 'За нас',
  'contact': 'Контакти',
  'login': 'Вход',
  'register': 'Регистрация',
  'privacy-policy': 'Поверителност',
  'terms-of-service': 'Условия за ползване',
  'faq': 'ЧЗВ',
  'support-center': 'Поддръжка',
  'pechelete-pari': 'Печелете пари',
  'rabotim-za-biznes': 'За бизнес',
  'favorites': 'Любими',
  'settings': 'Настройки',
}

// Category labels
const categoryLabels: Record<string, string> = {
  'cleaning': 'Почистване',
  'handyman': 'Майсторски услуги',
  'moving': 'Преместване',
  'delivery': 'Доставки',
  'gardening': 'Градинарство',
  'assembly': 'Сглобяване',
  'painting': 'Боядисване',
  'plumbing': 'ВиК услуги',
  'electrical': 'Електро услуги',
  'tutoring': 'Уроци',
  'pet-care': 'Грижа за домашни любимци',
  'tech-help': 'Техническа помощ',
  'other': 'Други',
}

export default function Breadcrumbs({ 
  items, 
  className = '',
  showHome = true 
}: BreadcrumbsProps) {
  const pathname = usePathname()
  
  // Generate breadcrumbs from pathname if items not provided
  const breadcrumbs: BreadcrumbItem[] = items || generateBreadcrumbs(pathname)
  
  if (breadcrumbs.length === 0 && !showHome) return null
  
  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`flex items-center text-sm text-gray-500 dark:text-gray-400 ${className}`}
    >
      <ol className="flex items-center flex-wrap gap-1" itemScope itemType="https://schema.org/BreadcrumbList">
        {showHome && (
          <li 
            className="flex items-center"
            itemProp="itemListElement" 
            itemScope 
            itemType="https://schema.org/ListItem"
          >
            <Link 
              href="/" 
              className="flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              itemProp="item"
            >
              <Home className="h-4 w-4" />
              <span className="sr-only" itemProp="name">Начало</span>
            </Link>
            <meta itemProp="position" content="1" />
            {breadcrumbs.length > 0 && (
              <ChevronRight className="h-4 w-4 mx-1 text-gray-400" />
            )}
          </li>
        )}
        
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1
          const position = showHome ? index + 2 : index + 1
          
          return (
            <li 
              key={item.href}
              className="flex items-center"
              itemProp="itemListElement" 
              itemScope 
              itemType="https://schema.org/ListItem"
            >
              {isLast ? (
                <span 
                  className="text-gray-900 dark:text-gray-100 font-medium truncate max-w-[200px]"
                  itemProp="name"
                >
                  {item.label}
                </span>
              ) : (
                <>
                  <Link 
                    href={item.href}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate max-w-[150px]"
                    itemProp="item"
                  >
                    <span itemProp="name">{item.label}</span>
                  </Link>
                  <ChevronRight className="h-4 w-4 mx-1 text-gray-400 flex-shrink-0" />
                </>
              )}
              <meta itemProp="position" content={String(position)} />
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  if (!pathname || pathname === '/') return []
  
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = []
  let currentPath = ''
  
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]
    currentPath += `/${segment}`
    
    // Check if this is a dynamic segment (UUID or number)
    const isDynamic = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment) ||
                      /^\d+$/.test(segment)
    
    if (isDynamic) {
      // For task detail pages, use generic label
      if (segments[i - 1] === 'tasks') {
        breadcrumbs.push({
          label: 'Детайли',
          href: currentPath
        })
      }
      continue
    }
    
    // Get label from mappings
    let label = routeLabels[segment] || categoryLabels[segment] || formatSegment(segment)
    
    // Handle category parameter in tasks URL
    if (segment.startsWith('category=')) {
      const category = segment.split('=')[1]
      label = categoryLabels[category] || formatSegment(category)
    }
    
    breadcrumbs.push({
      label,
      href: currentPath
    })
  }
  
  return breadcrumbs
}

function formatSegment(segment: string): string {
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Helper component for task pages with custom title
export function TaskBreadcrumbs({ 
  taskTitle, 
  category,
  className = '' 
}: { 
  taskTitle: string
  category?: string
  className?: string 
}) {
  const items: BreadcrumbItem[] = [
    { label: 'Задачи', href: '/tasks' }
  ]
  
  if (category && categoryLabels[category]) {
    items.push({
      label: categoryLabels[category],
      href: `/tasks?category=${category}`
    })
  }
  
  items.push({
    label: taskTitle.length > 40 ? taskTitle.substring(0, 40) + '...' : taskTitle,
    href: '#' // Current page
  })
  
  return <Breadcrumbs items={items} className={className} />
}

// Helper for category pages
export function CategoryBreadcrumbs({ 
  categorySlug,
  categoryName,
  className = '' 
}: { 
  categorySlug: string
  categoryName?: string
  className?: string 
}) {
  const items: BreadcrumbItem[] = [
    { label: 'Категории', href: '/categories' },
    { 
      label: categoryName || categoryLabels[categorySlug] || formatSegment(categorySlug), 
      href: `/tasks?category=${categorySlug}` 
    }
  ]
  
  return <Breadcrumbs items={items} className={className} />
}

