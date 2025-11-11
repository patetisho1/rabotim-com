'use client'

import { useState } from 'react'
import { Building2, MapPin, Users, Star, Calendar, MessageCircle, Heart, Share2, CheckCircle, Crown, Globe, Phone, Mail } from 'lucide-react'
import { useRouter } from 'next/navigation'
import SocialShare from './SocialShare'

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

interface CompanyProfileCardProps {
  company: CompanyProfile
  variant?: 'default' | 'compact' | 'detailed'
  showActions?: boolean
  className?: string
}

export default function CompanyProfileCard({
  company,
  variant = 'default',
  showActions = true,
  className = ''
}: CompanyProfileCardProps) {
  const router = useRouter()
  const [isFavorited, setIsFavorited] = useState(false)

  const handleContact = () => {
    router.push(`/company/${company.id}/contact`)
  }

  const handleViewProfile = () => {
    router.push(`/company/${company.id}`)
  }

  const handleViewJobs = () => {
    router.push(`/company/${company.id}/jobs`)
  }

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited)
    // TODO: Implement favorite functionality
  }

  if (variant === 'compact') {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow ${className}`}>
        <div className="flex items-start gap-3">
          <div className="relative">
            <img
              src={company.logo}
              alt={company.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
            {company.isVerified && (
              <CheckCircle className="absolute -bottom-1 -right-1 h-4 w-4 text-blue-600 bg-white rounded-full" />
            )}
            {company.isPremium && (
              <Crown className="absolute -top-1 -right-1 h-4 w-4 text-yellow-500" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                {company.name}
              </h3>
              {company.isPremium && (
                <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-medium rounded-full">
                  Premium
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {company.industry}
            </p>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                <span>{company.rating}</span>
                <span>({company.totalReviews})</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{company.location}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-blue-600">
              {company.activeJobs} активни задачи
            </div>
            <button
              onClick={handleViewJobs}
              className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
            >
              Виж задачите
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'detailed') {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow ${className}`}>
        {/* Header */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4">
              <div className="relative">
                <img
                  src={company.logo}
                  alt={company.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                {company.isVerified && (
                  <CheckCircle className="absolute -bottom-1 -right-1 h-5 w-5 text-blue-600 bg-white rounded-full" />
                )}
                {company.isPremium && (
                  <Crown className="absolute -top-1 -right-1 h-5 w-5 text-yellow-500" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {company.name}
                  </h2>
                  {company.isPremium && (
                    <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-medium rounded-full">
                      Premium
                    </span>
                  )}
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                  {company.industry}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{company.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span>{company.rating} ({company.totalReviews} отзива)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{company.employeeCount} служители</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-blue-600 mb-1">
                {company.activeJobs} активни задачи
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                От {company.foundedYear}
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
            {company.description}
          </p>

          {/* Services */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Услуги
            </h4>
            <div className="flex flex-wrap gap-2">
              {company.services.slice(0, 5).map((service, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-sm rounded-full"
                >
                  {service}
                </span>
              ))}
              {company.services.length > 5 && (
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm rounded-full">
                  +{company.services.length - 5} още
                </span>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {company.completedJobs}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Завършени задачи
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {company.avgResponseTime}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Средно време за отговор
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {company.foundedYear}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Година на основаване
              </div>
            </div>
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex gap-3">
              <button
                onClick={handleContact}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Свържете се
              </button>
              <button
                onClick={handleViewJobs}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Виж задачите
              </button>
              <button
                onClick={handleViewProfile}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Профил
              </button>
              <button
                onClick={toggleFavorite}
                className={`p-2 rounded-lg transition-colors ${
                  isFavorited
                    ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-red-100 hover:text-red-600'
                }`}
              >
                <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
              <SocialShare
                url={`${typeof window !== 'undefined' ? window.location.origin : 'https://rabotim.com'}/company/${company.id}`}
                title={`${company.name} - ${company.industry}`}
                description={company.description}
                hashtags={company.services}
                variant="minimal"
              />
            </div>
          )}
        </div>

        {/* Awards & Certifications */}
        {(company.awards.length > 0 || company.certifications.length > 0) && (
          <div className="px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {company.awards.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Награди
                  </h4>
                  <div className="space-y-1">
                    {company.awards.slice(0, 2).map((award, index) => (
                      <div key={index} className="text-sm text-gray-600 dark:text-gray-400">
                        {award.name} ({award.year})
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {company.certifications.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Сертификати
                  </h4>
                  <div className="space-y-1">
                    {company.certifications.slice(0, 2).map((cert, index) => (
                      <div key={index} className="text-sm text-gray-600 dark:text-gray-400">
                        {cert.name} - {cert.issuer}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Default variant
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <div className="relative">
            <img
              src={company.logo}
              alt={company.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            {company.isVerified && (
              <CheckCircle className="absolute -bottom-1 -right-1 h-4 w-4 text-blue-600 bg-white rounded-full" />
            )}
            {company.isPremium && (
              <Crown className="absolute -top-1 -right-1 h-4 w-4 text-yellow-500" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-gray-900 dark:text-gray-100">
                {company.name}
              </h3>
              {company.isPremium && (
                <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-medium rounded-full">
                  Premium
                </span>
              )}
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {company.industry}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{company.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span>{company.rating} ({company.totalReviews})</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{company.employeeCount}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-blue-600">
            {company.activeJobs} задачи
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            От {company.foundedYear}
          </div>
        </div>
      </div>

      <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
        {company.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {company.services.slice(0, 4).map((service, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-sm rounded-full"
          >
            {service}
          </span>
        ))}
        {company.services.length > 4 && (
          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm rounded-full">
            +{company.services.length - 4}
          </span>
        )}
      </div>

      {showActions && (
        <div className="flex gap-3">
          <button
            onClick={handleContact}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Свържете се
          </button>
          <button
            onClick={handleViewJobs}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Задачи
          </button>
          <button
            onClick={handleViewProfile}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Профил
          </button>
          <button
            onClick={toggleFavorite}
            className={`p-2 rounded-lg transition-colors ${
              isFavorited
                ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-red-100 hover:text-red-600'
            }`}
          >
            <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
        </div>
      )}
    </div>
  )
}


