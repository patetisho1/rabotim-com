'use client'

import { useState, useEffect } from 'react'
import { Facebook, Twitter, Instagram, Linkedin, ExternalLink, Heart, MessageCircle, Share2 } from 'lucide-react'

interface SocialPost {
  id: string
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin'
  content: string
  author: string
  avatar: string
  timestamp: string
  likes: number
  comments: number
  shares: number
  image?: string
  url: string
}

interface SocialFeedProps {
  className?: string
  maxPosts?: number
}

export default function SocialFeed({ className = '', maxPosts = 6 }: SocialFeedProps) {
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Mock data - in real app this would come from API
  useEffect(() => {
    const mockPosts: SocialPost[] = [
      {
        id: '1',
        platform: 'facebook',
        content: '🎉 Отличен ден! Помогнахме на 50+ семейства да намерят надеждни изпълнители за дома. Благодарим на всички, които използват Rabotim.com!',
        author: 'Rabotim.com',
        avatar: '/logo.png',
        timestamp: '2 часа',
        likes: 24,
        comments: 8,
        shares: 5,
        image: '/social-post-1.jpg',
        url: 'https://facebook.com/rabotim/posts/1'
      },
      {
        id: '2',
        platform: 'instagram',
        content: '✨ Преглед на деня: Мария от София намери перфектен градинар за 15 минути! Вижте как работи Rabotim.com 👆 #работа #българия #услуги',
        author: 'rabotim_bg',
        avatar: '/logo.png',
        timestamp: '4 часа',
        likes: 156,
        comments: 12,
        shares: 8,
        image: '/social-post-2.jpg',
        url: 'https://instagram.com/rabotim_bg/posts/2'
      },
      {
        id: '3',
        platform: 'twitter',
        content: '🔥 Нова функция! Сега можете да виждате рейтинга на изпълнителите преди да ги наемете. Качеството гарантирано! #работа #качество',
        author: '@rabotim_bg',
        avatar: '/logo.png',
        timestamp: '6 часа',
        likes: 89,
        comments: 15,
        shares: 23,
        url: 'https://twitter.com/rabotim_bg/status/3'
      },
      {
        id: '4',
        platform: 'linkedin',
        content: '📈 Статистики за месеца: 1000+ нови регистрации, 5000+ завършени задачи, 98% удовлетворени клиенти. Растем заедно! 🚀',
        author: 'Rabotim.com',
        avatar: '/logo.png',
        timestamp: '1 ден',
        likes: 67,
        comments: 9,
        shares: 12,
        url: 'https://linkedin.com/company/rabotim/posts/4'
      },
      {
        id: '5',
        platform: 'facebook',
        content: '💡 Съвет за деня: Когато публикувате задача, бъдете конкретни в описанието. Това ще ви спести време и ще привлече по-добри кандидати!',
        author: 'Rabotim.com',
        avatar: '/logo.png',
        timestamp: '2 дни',
        likes: 45,
        comments: 6,
        shares: 3,
        url: 'https://facebook.com/rabotim/posts/5'
      },
      {
        id: '6',
        platform: 'instagram',
        content: '🌟 История на успеха: Петър от Пловдив изкара 1000 € само за един месец като изпълнител в Rabotim.com. Неговата история вдъхновява! 💪',
        author: 'rabotim_bg',
        avatar: '/logo.png',
        timestamp: '3 дни',
        likes: 234,
        comments: 28,
        shares: 15,
        image: '/social-post-6.jpg',
        url: 'https://instagram.com/rabotim_bg/posts/6'
      }
    ]

    setTimeout(() => {
      setPosts(mockPosts.slice(0, maxPosts))
      setIsLoading(false)
    }, 1000)
  }, [maxPosts])

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return Facebook
      case 'twitter':
        return Twitter
      case 'instagram':
        return Instagram
      case 'linkedin':
        return Linkedin
      default:
        return Facebook
    }
  }

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return 'bg-blue-600'
      case 'twitter':
        return 'bg-sky-500'
      case 'instagram':
        return 'bg-gradient-to-r from-purple-500 to-pink-500'
      case 'linkedin':
        return 'bg-blue-700'
      default:
        return 'bg-gray-600'
    }
  }

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 bg-gray-300 dark:bg-gray-600 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-1" />
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/4" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded" />
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Следете ни в социалните мрежи
        </h3>
        <div className="flex gap-2">
          <a
            href="https://facebook.com/rabotim"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Facebook className="h-4 w-4" />
          </a>
          <a
            href="https://twitter.com/rabotim_bg"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
          >
            <Twitter className="h-4 w-4" />
          </a>
          <a
            href="https://instagram.com/rabotim_bg"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors"
          >
            <Instagram className="h-4 w-4" />
          </a>
          <a
            href="https://linkedin.com/company/rabotim"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
          >
            <Linkedin className="h-4 w-4" />
          </a>
        </div>
      </div>

      <div className="grid gap-4">
        {posts.map((post) => {
          const PlatformIcon = getPlatformIcon(post.platform)
          const platformColor = getPlatformColor(post.platform)

          return (
            <div
              key={post.id}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="relative">
                  <img
                    src={post.avatar}
                    alt={post.author}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className={`absolute -bottom-1 -right-1 p-1 rounded-full text-white ${platformColor}`}>
                    <PlatformIcon className="h-3 w-3" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      {post.author}
                    </h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {post.timestamp}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {post.platform}
                    </span>
                  </div>
                </div>
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                {post.content}
              </p>

              {post.image && (
                <div className="mb-3">
                  <img
                    src={post.image}
                    alt="Post image"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}

              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  <span>{post.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.comments}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Share2 className="h-4 w-4" />
                  <span>{post.shares}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="text-center pt-4">
        <a
          href="/social"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Вижте всички постове
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  )
}


