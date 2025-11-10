'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Star, MapPin, Clock, Award, Crown, Zap, Shield, SortAsc, Grid, List } from 'lucide-react'
import ProfessionalProfileCard from './ProfessionalProfileCard'

interface ProfessionalProfile {
  id: string
  name: string
  title: string
  avatar: string
  location: string
  rating: number
  totalReviews: number
  hourlyRate: number
  responseTime: string
  completionRate: number
  skills: string[]
  specializations: string[]
  isVerified: boolean
  isPremium: boolean
  isAvailable: boolean
  bio: string
  portfolio: {
    id: string
    title: string
    image: string
    description: string
  }[]
  certifications: {
    name: string
    issuer: string
    date: string
  }[]
  languages: string[]
  experience: string
  education: string
  joinedDate: string
}

interface ProfessionalProfilesCatalogProps {
  className?: string
}

export default function ProfessionalProfilesCatalog({ className = '' }: ProfessionalProfilesCatalogProps) {
  const [profiles, setProfiles] = useState<ProfessionalProfile[]>([])
  const [filteredProfiles, setFilteredProfiles] = useState<ProfessionalProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedSkill, setSelectedSkill] = useState('')
  const [selectedRating, setSelectedRating] = useState('')
  const [sortBy, setSortBy] = useState('rating')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState({ min: 0, max: 200 })

  // Mock data - in real app this would come from API
  useEffect(() => {
    const mockProfiles: ProfessionalProfile[] = [
      {
        id: '1',
        name: 'Мария Петрова',
        title: 'Графичен дизайнер',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        location: 'София',
        rating: 4.9,
        totalReviews: 127,
        hourlyRate: 45,
        responseTime: '2 часа',
        completionRate: 98,
        skills: ['Photoshop', 'Illustrator', 'Figma', 'UI/UX Design', 'Branding'],
        specializations: ['Логотипи', 'Уеб дизайн', 'Печатни материали'],
        isVerified: true,
        isPremium: true,
        isAvailable: true,
        bio: 'Професионален графичен дизайнер с 8+ години опит в създаването на визуални идентичности и уеб дизайн. Специализирам в съвременни дизайн решения.',
        portfolio: [
          {
            id: '1',
            title: 'Логотип за ресторант',
            image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop',
            description: 'Съвременен логотип за ресторант'
          }
        ],
        certifications: [
          { name: 'Adobe Certified Expert', issuer: 'Adobe', date: '2023' }
        ],
        languages: ['Български', 'Английски'],
        experience: '8+ години',
        education: 'Национална художествена академия',
        joinedDate: '2024-01-15'
      },
      {
        id: '2',
        name: 'Иван Димитров',
        title: 'Водопроводчик',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        location: 'Пловдив',
        rating: 4.8,
        totalReviews: 89,
        hourlyRate: 35,
        responseTime: '1 час',
        completionRate: 95,
        skills: ['Водопроводни работи', 'Отопление', 'Канализация', 'Ремонт'],
        specializations: ['Аварийни ремонти', 'Модернизация', 'Монтаж'],
        isVerified: true,
        isPremium: false,
        isAvailable: true,
        bio: 'Лицензиран водопроводчик с 12 години опит. Специализирам в аварийни ремонти и модернизация на водопроводни системи.',
        portfolio: [],
        certifications: [
          { name: 'Лиценз за водопроводни работи', issuer: 'Строителен надзор', date: '2012' }
        ],
        languages: ['Български'],
        experience: '12+ години',
        education: 'Професионална гимназия',
        joinedDate: '2024-02-01'
      },
      {
        id: '3',
        name: 'Елена Георгиева',
        title: 'IT консултант',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        location: 'Варна',
        rating: 4.9,
        totalReviews: 156,
        hourlyRate: 60,
        responseTime: '30 мин',
        completionRate: 99,
        skills: ['JavaScript', 'React', 'Node.js', 'Python', 'DevOps'],
        specializations: ['Уеб разработка', 'Мобилни приложения', 'Системна интеграция'],
        isVerified: true,
        isPremium: true,
        isAvailable: true,
        bio: 'Senior IT консултант с 10+ години опит в уеб разработка и системна интеграция. Експерт в съвременни технологии.',
        portfolio: [],
        certifications: [
          { name: 'AWS Certified Developer', issuer: 'Amazon', date: '2023' },
          { name: 'Google Cloud Professional', issuer: 'Google', date: '2022' }
        ],
        languages: ['Български', 'Английски', 'Немски'],
        experience: '10+ години',
        education: 'ТУ-София',
        joinedDate: '2024-01-10'
      },
      {
        id: '4',
        name: 'Петър Николов',
        title: 'Градинар',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        location: 'Бургас',
        rating: 4.7,
        totalReviews: 73,
        hourlyRate: 25,
        responseTime: '4 часа',
        completionRate: 92,
        skills: ['Градинарство', 'Ландшафтен дизайн', 'Дървета', 'Цветя'],
        specializations: ['Поддръжка на градини', 'Ландшафтен дизайн', 'Озеленяване'],
        isVerified: true,
        isPremium: false,
        isAvailable: true,
        bio: 'Професионален градинар с 15 години опит в поддръжката и дизайна на градини. Специализирам в ландшафтен дизайн.',
        portfolio: [],
        certifications: [
          { name: 'Сертификат по градинарство', issuer: 'БАН', date: '2010' }
        ],
        languages: ['Български'],
        experience: '15+ години',
        education: 'Селскостопански университет',
        joinedDate: '2024-03-05'
      },
      {
        id: '5',
        name: 'Анна Стоянова',
        title: 'Преподавател по английски',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
        location: 'Русе',
        rating: 4.8,
        totalReviews: 94,
        hourlyRate: 40,
        responseTime: '1 час',
        completionRate: 96,
        skills: ['Английски език', 'Преподаване', 'TOEFL', 'IELTS', 'Бизнес английски'],
        specializations: ['Подготовка за изпити', 'Бизнес английски', 'Разговорен английски'],
        isVerified: true,
        isPremium: true,
        isAvailable: true,
        bio: 'Опитен преподавател по английски език с 7 години опит. Специализирам в подготовка за международни изпити.',
        portfolio: [],
        certifications: [
          { name: 'CELTA Certificate', issuer: 'Cambridge', date: '2017' },
          { name: 'IELTS Examiner', issuer: 'British Council', date: '2020' }
        ],
        languages: ['Български', 'Английски', 'Френски'],
        experience: '7+ години',
        education: 'СУ "Св. Климент Охридски"',
        joinedDate: '2024-01-20'
      },
      {
        id: '6',
        name: 'Георги Колев',
        title: 'Електрик',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        location: 'Стара Загора',
        rating: 4.6,
        totalReviews: 67,
        hourlyRate: 30,
        responseTime: '2 часа',
        completionRate: 94,
        skills: ['Електрически работи', 'Монтаж', 'Ремонт', 'Автоматизация'],
        specializations: ['Аварийни ремонти', 'Монтаж на осветление', 'Електрически системи'],
        isVerified: true,
        isPremium: false,
        isAvailable: true,
        bio: 'Лицензиран електрик с 9 години опит. Специализирам в монтаж и ремонт на електрически системи.',
        portfolio: [],
        certifications: [
          { name: 'Лиценз за електрически работи', issuer: 'Строителен надзор', date: '2015' }
        ],
        languages: ['Български'],
        experience: '9+ години',
        education: 'Техническо училище',
        joinedDate: '2024-02-15'
      }
    ]

    setTimeout(() => {
      setProfiles(mockProfiles)
      setFilteredProfiles(mockProfiles)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filter and sort profiles
  useEffect(() => {
    let filtered = profiles.filter(profile => {
      const matchesSearch = profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           profile.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           profile.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesLocation = !selectedLocation || profile.location === selectedLocation
      const matchesSkill = !selectedSkill || profile.skills.includes(selectedSkill)
      const matchesRating = !selectedRating || profile.rating >= parseFloat(selectedRating)
      const matchesPrice = profile.hourlyRate >= priceRange.min && profile.hourlyRate <= priceRange.max

      return matchesSearch && matchesLocation && matchesSkill && matchesRating && matchesPrice
    })

    // Sort profiles
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'price-low':
          return a.hourlyRate - b.hourlyRate
        case 'price-high':
          return b.hourlyRate - a.hourlyRate
        case 'reviews':
          return b.totalReviews - a.totalReviews
        case 'newest':
          return new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime()
        default:
          return 0
      }
    })

    setFilteredProfiles(filtered)
  }, [profiles, searchQuery, selectedLocation, selectedSkill, selectedRating, priceRange, sortBy])

  const locations = Array.from(new Set(profiles.map(p => p.location)))
  const skills = Array.from(new Set(profiles.flatMap(p => p.skills)))

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Професионални изпълнители
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Намерете най-добрите професионалисти за вашите задачи. Всички изпълнители са верифицирани и имат доказан опит.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Търсете по име, професия или умения..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Filter className="h-5 w-5" />
            Филтри
          </button>

          {/* View Mode */}
          <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400'}`}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400'}`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Локация
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Всички локации</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            {/* Skill */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Умение
              </label>
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Всички умения</option>
                {skills.map(skill => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Минимален рейтинг
              </label>
              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Всички рейтинги</option>
                <option value="4.5">4.5+ звезди</option>
                <option value="4.0">4.0+ звезди</option>
                <option value="3.5">3.5+ звезди</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Сортиране
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="rating">По рейтинг</option>
                <option value="price-low">Цена (ниска → висока)</option>
                <option value="price-high">Цена (висока → ниска)</option>
                <option value="reviews">По брой отзиви</option>
                <option value="newest">Най-нови</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-600 dark:text-gray-400">
          Намерени {filteredProfiles.length} професионалиста
        </p>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Crown className="h-4 w-4 text-yellow-500" />
          <span>Premium</span>
          <Shield className="h-4 w-4 text-green-500 ml-2" />
          <span>Верифициран</span>
        </div>
      </div>

      {/* Profiles Grid */}
      <div className={`grid gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
          : 'grid-cols-1'
      }`}>
        {filteredProfiles.map((profile) => (
          <ProfessionalProfileCard
            key={profile.id}
            profile={profile}
            variant={viewMode === 'list' ? 'detailed' : 'default'}
          />
        ))}
      </div>

      {filteredProfiles.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-600 mb-4">
            <Search className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Няма намерени професионалисти
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Опитайте да промените критериите за търсене или филтрите.
          </p>
        </div>
      )}
    </div>
  )
}
