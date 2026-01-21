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
    // Фитнес треньор
    {
      id: 'demo-1',
      user_id: 'demo',
      username: 'fitness-maria',
      display_name: 'Мария Иванова',
      tagline: 'Персонален фитнес треньор с 10+ години опит. Специалист по трансформация и здравословен начин на живот.',
      profession: 'fitness',
      profession_title: 'Персонален треньор',
      template: 'fitness',
      primary_color: '#10B981',
      cover_image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=400&fit=crop',
      services: [{ name: 'Персонална тренировка', price: 35 }],
      city: 'София',
      neighborhood: 'Витоша',
      view_count: 1250,
      contact_requests: 89,
      is_published: true,
      is_premium: true,
      user: { full_name: 'Мария Иванова', avatar_url: '', rating: 4.9, total_reviews: 127, verified: true }
    },
    // Козметик
    {
      id: 'demo-2',
      user_id: 'demo',
      username: 'beauty-elena',
      display_name: 'Елена Петрова',
      tagline: 'Професионален козметик и визажист. Сватбен грим, дневен и вечерен makeup, процедури за лице.',
      profession: 'beauty',
      profession_title: 'Козметик и визажист',
      template: 'beauty',
      primary_color: '#EC4899',
      cover_image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=400&fit=crop',
      services: [{ name: 'Пълен грим', price: 50 }],
      city: 'София',
      neighborhood: 'Лозенец',
      view_count: 890,
      contact_requests: 56,
      is_published: true,
      is_premium: true,
      user: { full_name: 'Елена Петрова', avatar_url: '', rating: 4.8, total_reviews: 94, verified: true }
    },
    // Електротехник
    {
      id: 'demo-3',
      user_id: 'demo',
      username: 'electrician-georgi',
      display_name: 'Георги Димитров',
      tagline: 'Лицензиран електротехник с 15 години опит. Ремонт, монтаж, аварийни повиквания 24/7.',
      profession: 'repairs',
      profession_title: 'Електротехник',
      template: 'craft',
      primary_color: '#F59E0B',
      cover_image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop',
      services: [{ name: 'Електрически ремонт', price: 25 }],
      city: 'Пловдив',
      neighborhood: 'Тракия',
      view_count: 670,
      contact_requests: 45,
      is_published: true,
      is_premium: true,
      user: { full_name: 'Георги Димитров', avatar_url: '', rating: 4.7, total_reviews: 78, verified: true }
    },
    // IT разработчик
    {
      id: 'demo-4',
      user_id: 'demo',
      username: 'dev-ivan',
      display_name: 'Иван Стоянов',
      tagline: 'Full-stack разработчик и IT консултант. React, Node.js, Python. Изграждане на уеб приложения.',
      profession: 'it',
      profession_title: 'Софтуерен разработчик',
      template: 'tech',
      primary_color: '#06B6D4',
      cover_image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop',
      services: [{ name: 'Уеб разработка', price: 50 }],
      city: 'София',
      neighborhood: 'Студентски град',
      view_count: 1100,
      contact_requests: 67,
      is_published: true,
      is_premium: true,
      user: { full_name: 'Иван Стоянов', avatar_url: '', rating: 4.9, total_reviews: 156, verified: true }
    },
    // Учител по английски
    {
      id: 'demo-5',
      user_id: 'demo',
      username: 'teacher-anna',
      display_name: 'Анна Георгиева',
      tagline: 'Преподавател по английски език с Cambridge сертификат. IELTS, TOEFL подготовка, бизнес английски.',
      profession: 'teaching',
      profession_title: 'Преподавател по английски',
      template: 'classic',
      primary_color: '#3B82F6',
      cover_image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&h=400&fit=crop',
      services: [{ name: 'Частен урок (60 мин)', price: 25 }],
      city: 'Варна',
      neighborhood: 'Център',
      view_count: 520,
      contact_requests: 34,
      is_published: true,
      is_premium: false,
      user: { full_name: 'Анна Георгиева', avatar_url: '', rating: 4.8, total_reviews: 89, verified: true }
    },
    // Фотограф
    {
      id: 'demo-6',
      user_id: 'demo',
      username: 'photo-petar',
      display_name: 'Петър Николов',
      tagline: 'Професионален фотограф - сватби, събития, портрети, продуктова фотография. 8 години опит.',
      profession: 'photography',
      profession_title: 'Фотограф',
      template: 'elegant',
      primary_color: '#7C3AED',
      cover_image: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=600&h=400&fit=crop',
      services: [{ name: 'Фотосесия (2 часа)', price: 100 }],
      city: 'Бургас',
      neighborhood: 'Център',
      view_count: 780,
      contact_requests: 42,
      is_published: true,
      is_premium: true,
      user: { full_name: 'Петър Николов', avatar_url: '', rating: 4.9, total_reviews: 112, verified: true }
    },
    // Почистване
    {
      id: 'demo-7',
      user_id: 'demo',
      username: 'cleaning-pro',
      display_name: 'Надежда Колева',
      tagline: 'Професионално почистване на домове и офиси. Основно почистване, след ремонт, редовна поддръжка.',
      profession: 'cleaning',
      profession_title: 'Специалист почистване',
      template: 'modern',
      primary_color: '#22C55E',
      cover_image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop',
      services: [{ name: 'Почистване на апартамент', price: 15 }],
      city: 'София',
      neighborhood: 'Младост',
      view_count: 950,
      contact_requests: 78,
      is_published: true,
      is_premium: true,
      user: { full_name: 'Надежда Колева', avatar_url: '', rating: 4.9, total_reviews: 203, verified: true }
    },
    // Транспорт и преместване
    {
      id: 'demo-8',
      user_id: 'demo',
      username: 'moving-express',
      display_name: 'Транспорт Експрес',
      tagline: 'Хамалски услуги и преместване. Товарен бус, опаковане, монтаж/демонтаж на мебели. Коректност и бързина.',
      profession: 'transport',
      profession_title: 'Хамалски услуги',
      template: 'bold',
      primary_color: '#EF4444',
      cover_image: 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=600&h=400&fit=crop',
      services: [{ name: 'Преместване (до 3 часа)', price: 80 }],
      city: 'София',
      neighborhood: 'Надежда',
      view_count: 1450,
      contact_requests: 134,
      is_published: true,
      is_premium: true,
      user: { full_name: 'Транспорт Експрес', avatar_url: '', rating: 4.8, total_reviews: 287, verified: true }
    },
    // DJ / Музика
    {
      id: 'demo-9',
      user_id: 'demo',
      username: 'dj-alex',
      display_name: 'DJ Алекс',
      tagline: 'Професионален DJ за сватби, фирмени партита, рождени дни. Собствена техника, светлини, озвучаване.',
      profession: 'music',
      profession_title: 'DJ & Озвучаване',
      template: 'bold',
      primary_color: '#8B5CF6',
      cover_image: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=600&h=400&fit=crop',
      services: [{ name: 'DJ за събитие (4 часа)', price: 200 }],
      city: 'София',
      neighborhood: 'Център',
      view_count: 680,
      contact_requests: 45,
      is_published: true,
      is_premium: true,
      user: { full_name: 'Александър Тодоров', avatar_url: '', rating: 5.0, total_reviews: 67, verified: true }
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
    <div className={`space-y-4 md:space-y-6 ${className}`}>
      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl p-3 md:p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        {/* Search */}
        <div className="relative mb-3 md:mb-0">
          <Search className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Търси по име, професия, град..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-200 dark:border-gray-600 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Mobile Filters - Horizontal scroll */}
        <div className="flex gap-2 overflow-x-auto pb-1 md:hidden scrollbar-hide">
          <select
            value={selectedProfession}
            onChange={(e) => setSelectedProfession(e.target.value)}
            className="flex-shrink-0 px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">Категория</option>
            {professionCategories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nameBg}</option>
            ))}
          </select>

          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="flex-shrink-0 px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">Град</option>
            {BULGARIAN_CITIES.map(city => (
              <option key={city.name} value={city.name}>{city.name}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex-shrink-0 px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="view_count">Популярност</option>
            <option value="rating">Рейтинг</option>
            <option value="reviews">Отзиви</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex-shrink-0 flex border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Desktop Filters */}
        <div className="hidden md:flex gap-4 mt-4">
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
          <div className="flex border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden ml-auto">
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

      {/* Results Count & Legend */}
      <div className="flex items-center justify-between px-1">
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
          Намерени <span className="font-semibold text-gray-900 dark:text-gray-100">{sortedProfiles.length}</span> професионалисти
        </p>
        <div className="hidden md:flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
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
        <div className={`grid gap-3 md:gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {sortedProfiles.map((profile) => (
            <div
              key={profile.id}
              onClick={() => handleProfileClick(profile.username)}
              className={`bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-600 transition-all cursor-pointer group ${
                viewMode === 'list' ? 'flex' : ''
              }`}
            >
              {/* Cover Image */}
              <div 
                className={`relative ${viewMode === 'list' ? 'w-28 md:w-48 flex-shrink-0' : 'h-28 md:h-32'}`}
                style={{
                  backgroundImage: profile.cover_image 
                    ? `linear-gradient(to bottom, transparent, rgba(0,0,0,0.6)), url(${profile.cover_image})`
                    : `linear-gradient(135deg, ${profile.primary_color || '#3B82F6'}, ${profile.primary_color || '#3B82F6'}88)`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {/* Badges */}
                <div className="absolute top-2 md:top-3 left-2 md:left-3 flex gap-1 md:gap-2">
                  {profile.is_premium && (
                    <span className="flex items-center gap-0.5 md:gap-1 px-1.5 md:px-2 py-0.5 md:py-1 bg-yellow-500 text-white text-[10px] md:text-xs font-medium rounded-full">
                      <Crown size={10} className="md:w-3 md:h-3" /> Pro
                    </span>
                  )}
                  {profile.user?.verified && (
                    <span className="flex items-center gap-0.5 px-1.5 md:px-2 py-0.5 md:py-1 bg-green-500 text-white text-[10px] md:text-xs font-medium rounded-full">
                      <Shield size={10} className="md:w-3 md:h-3" />
                    </span>
                  )}
                </div>

                {/* Category Badge */}
                <div className="absolute bottom-2 md:bottom-3 left-2 md:left-3">
                  <span className="px-1.5 md:px-2 py-0.5 md:py-1 bg-white/90 dark:bg-gray-800/90 text-[10px] md:text-xs font-medium rounded-full">
                    {getProfessionIcon(profile.profession)} {getProfessionName(profile.profession)}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className={`p-3 md:p-4 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-center' : ''}`}>
                <div className="flex items-start justify-between mb-1 md:mb-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm md:text-base text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-colors truncate">
                      {profile.display_name}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 truncate">
                      {profile.profession_title}
                    </p>
                  </div>
                  {profile.user?.rating && (
                    <div className="flex items-center gap-0.5 md:gap-1 text-xs md:text-sm ml-2 flex-shrink-0">
                      <Star size={12} className="md:w-[14px] md:h-[14px] text-yellow-500 fill-current" />
                      <span className="font-medium">{profile.user.rating.toFixed(1)}</span>
                      <span className="text-gray-500 hidden sm:inline">({profile.user.total_reviews})</span>
                    </div>
                  )}
                </div>

                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-2 md:mb-3">
                  {profile.tagline}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs md:text-sm text-gray-500 dark:text-gray-400">
                    <MapPin size={12} className="md:w-[14px] md:h-[14px]" />
                    <span className="truncate max-w-[100px] md:max-w-none">{profile.city}</span>
                  </div>

                  {profile.services[0] && (
                    <div className="text-xs md:text-sm font-medium" style={{ color: profile.primary_color || '#3B82F6' }}>
                      от {profile.services[0].price} €
                    </div>
                  )}
                </div>

                {/* Stats for list view */}
                {viewMode === 'list' && (
                  <div className="hidden md:flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
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
                <div className="hidden md:flex items-center px-4">
                  <ChevronRight size={20} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* CTA for non-premium users */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl md:rounded-2xl p-4 md:p-8 text-white text-center">
        <h3 className="text-lg md:text-2xl font-bold mb-1 md:mb-2">
          Искаш и ти да си тук?
        </h3>
        <p className="text-xs md:text-base text-blue-100 mb-3 md:mb-4 max-w-2xl mx-auto">
          Създай профил и бъди намерен от клиенти
        </p>
        <button
          onClick={() => router.push('/premium')}
          className="px-4 md:px-6 py-2 md:py-3 bg-white text-blue-600 rounded-lg md:rounded-xl font-semibold hover:bg-blue-50 transition-colors text-sm md:text-base"
        >
          Стани Premium
        </button>
      </div>
    </div>
  )
}
