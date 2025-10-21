import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
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
    '/careers'
  ]

  const staticRoutes = staticPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' || route === '/tasks' ? 'daily' as const : 'weekly' as const,
    priority: route === '' ? 1 : route === '/tasks' ? 0.9 : 0.7
  }))

  // TODO: Add dynamic routes for tasks and user profiles
  // This will be populated from database when we have real data
  // Example:
  // const tasks = await supabase.from('tasks').select('id, updated_at')
  // const taskRoutes = tasks.map(task => ({
  //   url: `${baseUrl}/task/${task.id}`,
  //   lastModified: task.updated_at,
  //   changeFrequency: 'daily',
  //   priority: 0.8
  // }))

  return staticRoutes
}

