import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rabotim.com'
  
  const staticPages = [
    '',
    '/tasks',
    '/post-task',
    '/how-it-works',
    '/about',
    '/contact',
    '/categories',
    '/become-tasker',
    '/careers',
    '/ratings',
    '/favorites',
    '/search'
  ]

  const staticRoutes = staticPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' || route === '/tasks' ? 'daily' as const : 'weekly' as const,
    priority: route === '' ? 1 : route === '/tasks' ? 0.9 : 0.7
  }))

  // Add dynamic routes for tasks
  try {
    const { data: tasks } = await supabase
      .from('tasks')
      .select('id, updated_at, created_at')
      .eq('status', 'active')
      .limit(1000) // Limit to avoid too large sitemap
    
    const taskRoutes = tasks?.map(task => ({
      url: `${baseUrl}/task/${task.id}`,
      lastModified: new Date(task.updated_at || task.created_at),
      changeFrequency: 'daily' as const,
      priority: 0.8
    })) || []

    // Add category pages
    const categories = [
      'ремонт', 'почистване', 'доставка', 'обучение', 'градинарство', 
      'it-услуги', 'транспорт', 'охрана', 'кулинария', 'красота'
    ]
    
    const categoryRoutes = categories.map(category => ({
      url: `${baseUrl}/tasks?category=${category}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6
    }))

    return [...staticRoutes, ...taskRoutes, ...categoryRoutes]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return staticRoutes
  }
}


