'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Search, Filter, Star, MapPin, Clock, Crown, Shield, 
  Grid, List, ChevronRight, Phone, MessageCircle, Eye
} from 'lucide-react'
import { professionCategories, ProfessionCategory } from '@/types/professional-profile'
import { BULGARIAN_CITIES } from '@/lib/locations'

interface ProfessionalProfileData {
  id: string
  user_id: string
  username: string
  display_name: string
  tagline: string
  profession: ProfessionCategory
  profession_title: string
  template: string
  primary_color: string
  cover_image: string
  services: any[]
  city: string
  neighborhood: string
  view_count: number
  contact_requests: number
  is_published: boolean
  is_premium: boolean
  user?: {
    full_name: string
    avatar_url: string
    rating: number
    total_reviews: number
    verified: boolean
  }
}

interface ProfessionalProfilesCatalogProps {
  className?: string
  initialProfession?: ProfessionCategory
  initialCity?: string
}

export default function ProfessionalProfilesCatalog({ 
  className = '',
  initialProfession,
  initialCity
}: ProfessionalProfilesCatalogProps) {
  const router = useRouter()
  const [profiles, setProfiles] = useState<ProfessionalProfileData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProfession, setSelectedProfession] = useState<string>(initialProfession || '')
  const [selectedCity, setSelectedCity] = useState<string>(initialCity || '')
  const [sortBy, setSortBy] = useState('view_count')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadProfiles()
  }, [selectedProfession, selectedCity])

  const loadProfiles = async () => {
    setIsLoading(true)
    try {
      let url = '/api/professional-profiles?'
      if (selectedProfession) url += `profession=${selectedProfession}&`
      if (selectedCity) url += `city=${selectedCity}&`
      url += 'limit=50'

      const response = await fetch(url)
      const data = await response.json()
      
      if (data.profiles) {
        setProfiles(data.profiles)
      } else {
        // Demo data for when no profiles exist yet
        setProfiles(getDemoProfiles())
      }
    } catch (error) {
      console.error('Failed to load profiles:', error)
      setProfiles(getDemoProfiles())
    } finally {
      setIsLoading(false)
    }
  }

  const getDemoProfiles = (): ProfessionalProfileData[] => [
    {
      id: 'demo-1',
      user_id: 'demo',
      username: 'fitness-trainer',
      display_name: 'Мария Иванова',
      tagline: 'Персонален фитнес треньор с 10+ години опит',
      profession: 'fitness',
      profession_title: 'Персонален треньор',
      template: 'fitness',
      primary_color: '#10B981',
      cover_image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop',
      services: [{ name: 'Персонална тренировка', price: 50 }],
      city: 'София',
      neighborhood: 'Център',
      view_count: 1250,
      contact_requests: 89,
      is_published: true,
      is_premium: true,
      user: { full_name: 'Мария Иванова', avatar_url: '', rating: 4.9, total_reviews: 127, verified: true }
    },
    {
      id: 'demo-2',
      user_id: 'demo',
      username: 'beauty-expert',
      display_name: 'Елена Петрова',
      tagline: 'Професионален козметик и визажист',
      profession: 'beauty',
      profession_title: 'Козметик',
      template: 'beauty',
      primary_color: '#F472B6',
      cover_image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop',
      services: [{ name: 'Пълен грим', price: 80 }],
      city: 'София',
      neighborhood: 'Лозенец',
      view_count: 890,
      contact_requests: 56,
      is_published: true,
      is_premium: true,
      user: { full_name: 'Елена Петрова', avatar_url: '', rating: 4.8, total_reviews: 94, verified: true }
    },
    {
      id: 'demo-3',
      user_id: 'demo',
      username: 'master-electrician',
      display_name: 'Георги Димитров',
      tagline: 'Лицензиран електротехник с 15 години опит',
      profession: 'repairs',
      profession_title: 'Електротехник',
      template: 'craft',
      primary_color: '#D97706',
      cover_image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop',
      services: [{ name: 'Електрически ремонт', price: 40 }],
      city: 'Пловдив',
      neighborhood: 'Тракия',
      view_count: 670,
      contact_requests: 45,
      is_published: true,
      is_premium: false,
      user: { full_name: 'Георги Димитров', avatar_url: '', rating: 4.7, total_reviews: 78, verified: true }
    },
    {
      id: 'demo-4',
      user_id: 'demo',
      username: 'dev-expert',
      display_name: 'Иван Стоянов',
      tagline: 'Full-stack разработчик и IT консултант',
      profession: 'it',
      profession_title: 'Софтуерен разработчик',
      template: 'tech',
      primary_color: '#06B6D4',
      cover_image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop',
      services: [{ name: 'Уеб разработка', price: 80 }],
      city: 'София',
      neighborhood: 'Студентски град',
      view_count: 1100,
      contact_requests: 67,
      is_published: true,
      is_premium: true,
      user: { full_name: 'Иван Стоянов', avatar_url: '', rating: 4.9, total_reviews: 156, verified: true }
    },
    {
      id: 'demo-5',
      user_id: 'demo',
      username: 'english-teacher',
      display_name: 'Анна Георгиева',
      tagline: 'Преподавател по английски език, IELTS експерт',
      profession: 'teaching',
      profession_title: 'Преподавател по английски',
      template: 'classic',
      primary_color: '#1F2937',
      cover_image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop',
      services: [{ name: 'Частен урок', price: 40 }],
      city: 'Варна',
      neighborhood: 'Център',
      view_count: 520,
      contact_requests: 34,
      is_published: true,
      is_premium: false,
      user: { full_name: 'Анна Георгиева', avatar_url: '', rating: 4.8, total_reviews: 89, verified: true }
    },
    {
      id: 'demo-6',
      user_id: 'demo',
      username: 'photographer-pro',
      display_name: 'Петър Николов',
      tagline: 'Професионален фотограф - събития, портрети, продукти',
      profession: 'photography',
      profession_title: 'Фотограф',
      template: 'elegant',
      primary_color: '#7C3AED',
      cover_image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600&h=400&fit=crop',
      services: [{ name: 'Фотосесия', price: 150 }],
      city: 'Бургас',
      neighborhood: 'Център',
      view_count: 780,
      contact_requests: 42,
      is_published: true,
      is_premium: true,
      user: { full_name: 'Петър Николов', avatar_url: '', rating: 4.9, total_reviews: 112, verified: true }
    }
  ]

  // Filter profiles by search query
  const filteredProfiles = profiles.filter(profile => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      profile.display_name.toLowerCase().includes(query) ||
      profile.profession_title.toLowerCase().includes(query) ||
      profile.tagline.toLowerCase().includes(query) ||
      profile.city.toLowerCase().includes(query)
    )
  })

  // Sort profiles
  const sortedProfiles = [...filteredProfiles].sort((a, b) => {
    switch (sortBy) {
      case 'view_count':
        return b.view_count - a.view_count
      case 'rating':
        return (b.user?.rating || 0) - (a.user?.rating || 0)
      case 'reviews':
        return (b.user?.total_reviews || 0) - (a.user?.total_reviews || 0)
      default:
        return 0
    }
  })

  const handleProfileClick = (username: string) => {
    router.push(`/p/${username}`)
  }

  const getProfessionIcon = (profession: ProfessionCategory) => {
    return professionCategories.find(p => p.id === profession)?.icon || '✨'
  }

  const getProfessionName = (profession: ProfessionCategory) => {
    return professionCategories.find(p => p.id === profession)?.nameBg || 'Друго'
  }

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 animate-pulse">
              <div className="h-32 bg-gray-200 dark:bg-gray-700"></div>
              <div className="p-4">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Търси по име, професия, град..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex gap-2 flex-wrap">
            <select
              value={selectedProfession}
              onChange={(e) => setSelectedProfession(e.target.value)}
              className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Всички категории</option>
              {professionCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.icon} {cat.nameBg}</option>
              ))}
            </select>

            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Всички градове</option>
              {BULGARIAN_CITIES.map(city => (
                <option key={city.name} value={city.name}>{city.name}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="view_count">Популярност</option>
              <option value="rating">Рейтинг</option>
              <option value="reviews">Отзиви</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count & Legend */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600 dark:text-gray-400">
          Намерени <span className="font-semibold text-gray-900 dark:text-gray-100">{sortedProfiles.length}</span> професионалисти
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Crown className="h-4 w-4 text-yellow-500" /> Premium
          </span>
          <span className="flex items-center gap-1">
            <Shield className="h-4 w-4 text-green-500" /> Верифициран
          </span>
        </div>
      </div>

      {/* Profiles Grid */}
      {sortedProfiles.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Няма намерени професионалисти
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Опитайте с различни филтри или търсене
          </p>
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedProfession('')
              setSelectedCity('')
            }}
            className="text-blue-600 hover:underline"
          >
            Изчисти филтрите
          </button>
        </div>
      ) : (
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {sortedProfiles.map((profile) => (
            <div
              key={profile.id}
              onClick={() => handleProfileClick(profile.username)}
              className={`bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-600 transition-all cursor-pointer group ${
                viewMode === 'list' ? 'flex' : ''
              }`}
            >
              {/* Cover Image */}
              <div 
                className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'h-32'}`}
                style={{
                  backgroundImage: profile.cover_image 
                    ? `linear-gradient(to bottom, transparent, rgba(0,0,0,0.6)), url(${profile.cover_image})`
                    : `linear-gradient(135deg, ${profile.primary_color || '#3B82F6'}, ${profile.primary_color || '#3B82F6'}88)`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {profile.is_premium && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full">
                      <Crown size={12} /> Pro
                    </span>
                  )}
                  {profile.user?.verified && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                      <Shield size={12} />
                    </span>
                  )}
                </div>

                {/* Category Badge */}
                <div className="absolute bottom-3 left-3">
                  <span className="px-2 py-1 bg-white/90 dark:bg-gray-800/90 text-xs font-medium rounded-full">
                    {getProfessionIcon(profile.profession)} {getProfessionName(profile.profession)}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className={`p-4 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-center' : ''}`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-colors">
                      {profile.display_name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {profile.profession_title}
                    </p>
                  </div>
                  {profile.user?.rating && (
                    <div className="flex items-center gap-1 text-sm">
                      <Star size={14} className="text-yellow-500 fill-current" />
                      <span className="font-medium">{profile.user.rating.toFixed(1)}</span>
                      <span className="text-gray-500">({profile.user.total_reviews})</span>
                    </div>
                  )}
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                  {profile.tagline}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <MapPin size={14} />
                    {profile.city}{profile.neighborhood ? `, ${profile.neighborhood}` : ''}
                  </div>

                  {profile.services[0] && (
                    <div className="text-sm font-medium" style={{ color: profile.primary_color || '#3B82F6' }}>
                      от {profile.services[0].price} лв
                    </div>
                  )}
                </div>

                {/* Stats for list view */}
                {viewMode === 'list' && (
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <span className="flex items-center gap-1 text-sm text-gray-500">
                      <Eye size={14} /> {profile.view_count} прегледа
                    </span>
                    <span className="flex items-center gap-1 text-sm text-gray-500">
                      <MessageCircle size={14} /> {profile.contact_requests} запитвания
                    </span>
                  </div>
                )}
              </div>

              {/* Arrow for list view */}
              {viewMode === 'list' && (
                <div className="flex items-center px-4">
                  <ChevronRight size={20} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* CTA for non-premium users */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 md:p-8 text-white text-center">
        <h3 className="text-xl md:text-2xl font-bold mb-2">
          Искаш и ти да си тук?
        </h3>
        <p className="text-blue-100 mb-4 max-w-2xl mx-auto">
          Създай професионален профил и бъди намерен от клиенти, търсещи твоите услуги
        </p>
        <button
          onClick={() => router.push('/premium')}
          className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
        >
          Стани Premium
        </button>
      </div>
    </div>
  )
}
