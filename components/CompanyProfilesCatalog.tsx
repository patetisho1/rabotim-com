'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Star, MapPin, Building2, Users, Crown, Shield, SortAsc, Grid, List } from 'lucide-react'
import CompanyProfileCard from './CompanyProfileCard'

interface CompanyProfile {
  id: string
  name: string
  industry: string
  logo: string
  location: string
  rating: number
  totalReviews: number
  foundedYear: number
  employeeCount: string
  isVerified: boolean
  isPremium: boolean
  description: string
  website: string
  phone: string
  email: string
  services: string[]
  specializations: string[]
  activeJobs: number
  completedJobs: number
  avgResponseTime: string
  joinedDate: string
  socialLinks: {
    website?: string
    linkedin?: string
    facebook?: string
    twitter?: string
  }
  awards: {
    name: string
    year: string
    issuer: string
  }[]
  certifications: {
    name: string
    issuer: string
    date: string
  }[]
}

interface CompanyProfilesCatalogProps {
  className?: string
}

export default function CompanyProfilesCatalog({ className = '' }: CompanyProfilesCatalogProps) {
  const [companies, setCompanies] = useState<CompanyProfile[]>([])
  const [filteredCompanies, setFilteredCompanies] = useState<CompanyProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState('')
  const [selectedRating, setSelectedRating] = useState('')
  const [selectedEmployeeCount, setSelectedEmployeeCount] = useState('')
  const [sortBy, setSortBy] = useState('rating')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)

  // Mock data - in real app this would come from API
  useEffect(() => {
    const mockCompanies: CompanyProfile[] = [
      {
        id: '1',
        name: 'TechCorp Bulgaria',
        industry: 'IT услуги',
        logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=150&fit=crop&crop=center',
        location: 'София',
        rating: 4.8,
        totalReviews: 156,
        foundedYear: 2015,
        employeeCount: '50-100',
        isVerified: true,
        isPremium: true,
        description: 'Водеща IT компания в България, специализирана в уеб разработка, мобилни приложения и цифрови решения.',
        website: 'https://techcorp.bg',
        phone: '+359 2 123 4567',
        email: 'info@techcorp.bg',
        services: ['Уеб разработка', 'Мобилни приложения', 'E-commerce', 'UI/UX дизайн'],
        specializations: ['React', 'Node.js', 'React Native', 'AWS'],
        activeJobs: 12,
        completedJobs: 89,
        avgResponseTime: '2 часа',
        joinedDate: '2024-01-15',
        socialLinks: {
          website: 'https://techcorp.bg',
          linkedin: 'https://linkedin.com/company/techcorp-bg'
        },
        awards: [
          { name: 'Best IT Company 2023', year: '2023', issuer: 'IT Awards Bulgaria' }
        ],
        certifications: [
          { name: 'ISO 9001:2015', issuer: 'BDS', date: '2023' }
        ]
      },
      {
        id: '2',
        name: 'Creative Studio',
        industry: 'Дизайн и реклама',
        logo: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=150&h=150&fit=crop&crop=center',
        location: 'Пловдив',
        rating: 4.7,
        totalReviews: 98,
        foundedYear: 2018,
        employeeCount: '10-50',
        isVerified: true,
        isPremium: false,
        description: 'Креативно студио за графичен дизайн, брандинг и маркетингови кампании.',
        website: 'https://creativestudio.bg',
        phone: '+359 32 987 6543',
        email: 'hello@creativestudio.bg',
        services: ['Графичен дизайн', 'Брандинг', 'Маркетинг', 'Печатни материали'],
        specializations: ['Adobe Creative Suite', 'Branding', 'Social Media Marketing'],
        activeJobs: 8,
        completedJobs: 67,
        avgResponseTime: '4 часа',
        joinedDate: '2024-02-01',
        socialLinks: {
          website: 'https://creativestudio.bg'
        },
        awards: [],
        certifications: []
      },
      {
        id: '3',
        name: 'Green Solutions',
        industry: 'Екология и устойчивост',
        logo: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=150&h=150&fit=crop&crop=center',
        location: 'Варна',
        rating: 4.9,
        totalReviews: 134,
        foundedYear: 2012,
        employeeCount: '20-50',
        isVerified: true,
        isPremium: true,
        description: 'Екологични решения за бизнеса и дома. Специализираме в устойчиво развитие и зелена енергия.',
        website: 'https://greensolutions.bg',
        phone: '+359 52 555 7777',
        email: 'info@greensolutions.bg',
        services: ['Слънчеви панели', 'Енергийна ефективност', 'Екологично консултиране'],
        specializations: ['Solar Energy', 'Energy Efficiency', 'Sustainability Consulting'],
        activeJobs: 15,
        completedJobs: 112,
        avgResponseTime: '1 час',
        joinedDate: '2024-01-10',
        socialLinks: {
          website: 'https://greensolutions.bg',
          linkedin: 'https://linkedin.com/company/green-solutions-bg'
        },
        awards: [
          { name: 'Green Business Award 2023', year: '2023', issuer: 'Ministry of Environment' }
        ],
        certifications: [
          { name: 'ISO 14001:2015', issuer: 'BDS', date: '2022' }
        ]
      },
      {
        id: '4',
        name: 'Legal Partners',
        industry: 'Правни услуги',
        logo: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=150&h=150&fit=crop&crop=center',
        location: 'София',
        rating: 4.6,
        totalReviews: 87,
        foundedYear: 2010,
        employeeCount: '10-20',
        isVerified: true,
        isPremium: false,
        description: 'Адвокатска кантора с опит в корпоративното право, търговски спорове и недвижими имоти.',
        website: 'https://legalpartners.bg',
        phone: '+359 2 444 3333',
        email: 'office@legalpartners.bg',
        services: ['Корпоративно право', 'Търговски спорове', 'Недвижими имоти', 'Консултации'],
        specializations: ['Corporate Law', 'Commercial Disputes', 'Real Estate Law'],
        activeJobs: 6,
        completedJobs: 45,
        avgResponseTime: '6 часа',
        joinedDate: '2024-03-05',
        socialLinks: {
          website: 'https://legalpartners.bg'
        },
        awards: [],
        certifications: []
      },
      {
        id: '5',
        name: 'HealthCare Plus',
        industry: 'Здравеопазване',
        logo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=150&h=150&fit=crop&crop=center',
        location: 'Бургас',
        rating: 4.8,
        totalReviews: 203,
        foundedYear: 2016,
        employeeCount: '100+',
        isVerified: true,
        isPremium: true,
        description: 'Модерен медицински център с най-нови технологии и опитни специалисти.',
        website: 'https://healthcareplus.bg',
        phone: '+359 56 777 8888',
        email: 'info@healthcareplus.bg',
        services: ['Медицински консултации', 'Диагностика', 'Лабораторни изследвания', 'Физиотерапия'],
        specializations: ['Cardiology', 'Neurology', 'Orthopedics', 'Dermatology'],
        activeJobs: 25,
        completedJobs: 178,
        avgResponseTime: '30 мин',
        joinedDate: '2024-01-20',
        socialLinks: {
          website: 'https://healthcareplus.bg',
          linkedin: 'https://linkedin.com/company/healthcare-plus-bg'
        },
        awards: [
          { name: 'Best Medical Center 2023', year: '2023', issuer: 'Medical Association' }
        ],
        certifications: [
          { name: 'ISO 15189:2012', issuer: 'BDS', date: '2023' }
        ]
      },
      {
        id: '6',
        name: 'EduTech Solutions',
        industry: 'Образование',
        logo: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=150&h=150&fit=crop&crop=center',
        location: 'Русе',
        rating: 4.7,
        totalReviews: 145,
        foundedYear: 2019,
        employeeCount: '20-50',
        isVerified: true,
        isPremium: false,
        description: 'Иновативни образователни решения и онлайн обучение за всички възрасти.',
        website: 'https://edutech.bg',
        phone: '+359 82 111 2222',
        email: 'contact@edutech.bg',
        services: ['Онлайн обучение', 'Корпоративно обучение', 'Езикови курсове', 'IT курсове'],
        specializations: ['Online Learning', 'Corporate Training', 'Language Courses', 'Programming'],
        activeJobs: 18,
        completedJobs: 123,
        avgResponseTime: '3 часа',
        joinedDate: '2024-02-15',
        socialLinks: {
          website: 'https://edutech.bg'
        },
        awards: [],
        certifications: []
      }
    ]

    setTimeout(() => {
      setCompanies(mockCompanies)
      setFilteredCompanies(mockCompanies)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filter and sort companies
  useEffect(() => {
    let filtered = companies.filter(company => {
      const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           company.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           company.services.some(service => service.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesLocation = !selectedLocation || company.location === selectedLocation
      const matchesIndustry = !selectedIndustry || company.industry === selectedIndustry
      const matchesRating = !selectedRating || company.rating >= parseFloat(selectedRating)
      const matchesEmployeeCount = !selectedEmployeeCount || company.employeeCount === selectedEmployeeCount

      return matchesSearch && matchesLocation && matchesIndustry && matchesRating && matchesEmployeeCount
    })

    // Sort companies
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'reviews':
          return b.totalReviews - a.totalReviews
        case 'active-jobs':
          return b.activeJobs - a.activeJobs
        case 'newest':
          return new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime()
        case 'oldest':
          return new Date(a.joinedDate).getTime() - new Date(b.joinedDate).getTime()
        default:
          return 0
      }
    })

    setFilteredCompanies(filtered)
  }, [companies, searchQuery, selectedLocation, selectedIndustry, selectedRating, selectedEmployeeCount, sortBy])

  const locations = Array.from(new Set(companies.map(c => c.location)))
  const industries = Array.from(new Set(companies.map(c => c.industry)))
  const employeeCounts = Array.from(new Set(companies.map(c => c.employeeCount)))

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
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
          Компании партньори
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Открийте доверени компании, които предлагат качествени услуги и имат доказан опит.
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
              placeholder="Търсете по име, индустрия или услуги..."
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
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

            {/* Industry */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Индустрия
              </label>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Всички индустрии</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
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

            {/* Employee Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Размер на компанията
              </label>
              <select
                value={selectedEmployeeCount}
                onChange={(e) => setSelectedEmployeeCount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Всички размери</option>
                {employeeCounts.map(count => (
                  <option key={count} value={count}>{count} служители</option>
                ))}
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
                <option value="reviews">По брой отзиви</option>
                <option value="active-jobs">По активни задачи</option>
                <option value="newest">Най-нови</option>
                <option value="oldest">Най-стари</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-600 dark:text-gray-400">
          Намерени {filteredCompanies.length} компании
        </p>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Crown className="h-4 w-4 text-yellow-500" />
          <span>Premium</span>
          <Shield className="h-4 w-4 text-green-500 ml-2" />
          <span>Верифицирана</span>
        </div>
      </div>

      {/* Companies Grid */}
      <div className={`grid gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
          : 'grid-cols-1'
      }`}>
        {filteredCompanies.map((company) => (
          <CompanyProfileCard
            key={company.id}
            company={company}
            variant={viewMode === 'list' ? 'detailed' : 'default'}
          />
        ))}
      </div>

      {filteredCompanies.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-600 mb-4">
            <Search className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Няма намерени компании
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Опитайте да промените критериите за търсене или филтрите.
          </p>
        </div>
      )}
    </div>
  )
}
