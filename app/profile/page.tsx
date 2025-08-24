'use client'

import { useState, useEffect } from 'react'
import { 
  User, 
  Star, 
  Award, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  Edit,
  Camera,
  CheckCircle,
  Shield,
  Clock,
  DollarSign,
  MessageCircle,
  Heart,
  Share2,
  Settings,
  Plus
} from 'lucide-react'

interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  bio: string
  location: string
  joinDate: string
  rating: number
  totalReviews: number
  completedTasks: number
  totalEarnings: number
  responseRate: number
  avgResponseTime: string
  isVerified: boolean
  badges: Badge[]
  skills: Skill[]
  portfolio: PortfolioItem[]
  reviews: Review[]
}

interface Badge {
  id: string
  name: string
  description: string
  icon: string
  color: string
  earnedAt: string
}

interface Skill {
  id: string
  name: string
  level: 'beginner' | 'intermediate' | 'expert'
  category: string
}

interface PortfolioItem {
  id: string
  title: string
  description: string
  images: string[]
  category: string
  completedAt: string
  clientRating: number
  clientComment: string
}

interface Review {
  id: string
  taskTitle: string
  rating: number
  comment: string
  clientName: string
  clientAvatar: string
  date: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'portfolio' | 'reviews' | 'settings'>('overview')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Симулираме зареждане на профил
    setTimeout(() => {
      const mockProfile: UserProfile = {
        id: '1',
        name: 'Иван Петров',
        email: 'ivan.petrov@email.com',
        phone: '+359 888 123 456',
        avatar: '/api/placeholder/150/150',
        bio: 'Опитен майстор с над 10 години опит в ремонтни дейности. Специализиран в електрически инсталации, водопровод и общ ремонт. Работя качествено и навреме.',
        location: 'София, България',
        joinDate: '2023-01-15',
        rating: 4.8,
        totalReviews: 47,
        completedTasks: 156,
        totalEarnings: 12500,
        responseRate: 98,
        avgResponseTime: '2 часа',
        isVerified: true,
        badges: [
          {
            id: '1',
            name: 'Топ изпълнител',
            description: 'Най-висок рейтинг в категорията',
            icon: '🏆',
            color: 'bg-yellow-500',
            earnedAt: '2024-01-15'
          },
          {
            id: '2',
            name: 'Бърз отговор',
            description: 'Отговаря в рамките на 2 часа',
            icon: '⚡',
            color: 'bg-green-500',
            earnedAt: '2024-02-20'
          },
          {
            id: '3',
            name: 'Верифициран',
            description: 'Идентичността е потвърдена',
            icon: '✓',
            color: 'bg-blue-500',
            earnedAt: '2023-03-10'
          },
          {
            id: '4',
            name: '100+ задачи',
            description: 'Завършил над 100 задачи',
            icon: '💯',
            color: 'bg-purple-500',
            earnedAt: '2024-01-05'
          }
        ],
        skills: [
          { id: '1', name: 'Електрически инсталации', level: 'expert', category: 'Ремонт' },
          { id: '2', name: 'Водопровод', level: 'expert', category: 'Ремонт' },
          { id: '3', name: 'Общ ремонт', level: 'expert', category: 'Ремонт' },
          { id: '4', name: 'Плочки', level: 'intermediate', category: 'Ремонт' },
          { id: '5', name: 'Дърводелство', level: 'intermediate', category: 'Ремонт' },
          { id: '6', name: 'Боядисване', level: 'beginner', category: 'Ремонт' }
        ],
        portfolio: [
          {
            id: '1',
            title: 'Ремонт на баня',
            description: 'Пълен ремонт на баня - плочки, санитария, електрика',
            images: ['/api/placeholder/300/200', '/api/placeholder/300/200'],
            category: 'Ремонт',
            completedAt: '2024-02-15',
            clientRating: 5,
            clientComment: 'Отлично качество, навреме и подредено!'
          },
          {
            id: '2',
            title: 'Електрически инсталации',
            description: 'Монтаж на нови електрически инсталации в апартамент',
            images: ['/api/placeholder/300/200'],
            category: 'Ремонт',
            completedAt: '2024-01-20',
            clientRating: 5,
            clientComment: 'Професионална работа, препоръчвам!'
          }
        ],
        reviews: [
          {
            id: '1',
            taskTitle: 'Ремонт на баня',
            rating: 5,
            comment: 'Иван е отличен майстор! Работи качествено, навреме и подредено. Определено ще го наема отново.',
            clientName: 'Мария Георгиева',
            clientAvatar: '/api/placeholder/40/40',
            date: '2024-02-15'
          },
          {
            id: '2',
            taskTitle: 'Електрически инсталации',
            rating: 5,
            comment: 'Професионална работа, всичко е направено перфектно. Благодаря!',
            clientName: 'Петър Димитров',
            clientAvatar: '/api/placeholder/40/40',
            date: '2024-01-20'
          }
        ]
      }
      setProfile(mockProfile)
      setLoading(false)
    }, 1000)
  }, [])

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={`${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
  }

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'expert': return 'bg-green-500'
      case 'intermediate': return 'bg-yellow-500'
      case 'beginner': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Зареждане на профил...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Профилът не е намерен</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
                />
                <button className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                  <Camera size={16} />
                </button>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {profile.name}
                  </h1>
                  {profile.isVerified && (
                    <div className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-sm">
                      <CheckCircle size={14} />
                      Верифициран
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    {profile.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    Член от {new Date(profile.joinDate).toLocaleDateString('bg-BG')}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                <Share2 size={16} />
                Сподели
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <MessageCircle size={16} />
                Съобщение
              </button>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Edit size={16} />
                Редактирай
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Stats & Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Rating & Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="text-center mb-4">
                <div className="flex items-center justify-center gap-1 mb-2">
                  {renderStars(profile.rating)}
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {profile.rating}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {profile.totalReviews} отзива
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {profile.completedTasks}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Завършени задачи
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {profile.responseRate}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Процент отговори
                  </div>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Постижения
              </h3>
              <div className="space-y-3">
                {profile.badges.map(badge => (
                  <div key={badge.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className={`w-10 h-10 rounded-full ${badge.color} flex items-center justify-center text-white text-lg`}>
                      {badge.icon}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {badge.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {badge.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Контактна информация
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">{profile.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">{profile.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                За мен
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {profile.bio}
              </p>
            </div>

            {/* Skills */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Умения и опит
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {profile.skills.map(skill => (
                  <div key={skill.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-300">{skill.name}</span>
                    <span className={`px-2 py-1 rounded-full text-xs text-white ${getSkillLevelColor(skill.level)}`}>
                      {skill.level === 'expert' ? 'Експерт' : 
                       skill.level === 'intermediate' ? 'Напреднал' : 'Начинаещ'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Portfolio */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Портфолио
                </h3>
                <button className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  <Plus size={16} />
                  Добави проект
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profile.portfolio.map(item => (
                  <div key={item.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <div className="aspect-video bg-gray-100 dark:bg-gray-700 relative">
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {renderStars(item.clientRating)}
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(item.completedAt).toLocaleDateString('bg-BG')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Отзиви от клиенти
              </h3>
              <div className="space-y-4">
                {profile.reviews.map(review => (
                  <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
                    <div className="flex items-start gap-3">
                      <img
                        src={review.clientAvatar}
                        alt={review.clientName}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {review.clientName}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {review.taskTitle}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mb-2">
                          {review.comment}
                        </p>
                        <div className="text-sm text-gray-500">
                          {new Date(review.date).toLocaleDateString('bg-BG')}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 