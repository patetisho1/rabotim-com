'use client'

import { useState } from 'react'
import { Star, MapPin, Clock, Award, MessageCircle, Heart, Share2, CheckCircle, Crown, Zap, Shield } from 'lucide-react'
import { useRouter } from 'next/navigation'
import SocialShare from './SocialShare'

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

interface ProfessionalProfileCardProps {
  profile: ProfessionalProfile
  variant?: 'default' | 'compact' | 'detailed'
  showActions?: boolean
  className?: string
}

export default function ProfessionalProfileCard({
  profile,
  variant = 'default',
  showActions = true,
  className = ''
}: ProfessionalProfileCardProps) {
  const router = useRouter()
  const [isFavorited, setIsFavorited] = useState(false)

  const handleContact = () => {
    router.push(`/profile/${profile.id}/contact`)
  }

  const handleViewProfile = () => {
    router.push(`/profile/${profile.id}`)
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
              src={profile.avatar}
              alt={profile.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            {profile.isVerified && (
              <CheckCircle className="absolute -bottom-1 -right-1 h-4 w-4 text-blue-600 bg-white rounded-full" />
            )}
            {profile.isPremium && (
              <Crown className="absolute -top-1 -right-1 h-4 w-4 text-yellow-500" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                {profile.name}
              </h3>
              {profile.isPremium && (
                <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-medium rounded-full">
                  Premium
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {profile.title}
            </p>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                <span>{profile.rating}</span>
                <span>({profile.totalReviews})</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{profile.location}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-green-600">
              {profile.hourlyRate} лв/час
            </div>
            <button
              onClick={handleViewProfile}
              className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
            >
              Виж профил
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
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
                {profile.isVerified && (
                  <CheckCircle className="absolute -bottom-1 -right-1 h-5 w-5 text-blue-600 bg-white rounded-full" />
                )}
                {profile.isPremium && (
                  <Crown className="absolute -top-1 -right-1 h-5 w-5 text-yellow-500" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {profile.name}
                  </h2>
                  {profile.isPremium && (
                    <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-medium rounded-full">
                      Premium
                    </span>
                  )}
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                  {profile.title}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{profile.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span>{profile.rating} ({profile.totalReviews} отзива)</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {profile.hourlyRate} лв/час
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                <Clock className="h-4 w-4" />
                <span>{profile.responseTime}</span>
              </div>
            </div>
          </div>

          {/* Bio */}
          <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
            {profile.bio}
          </p>

          {/* Skills */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Основни умения
            </h4>
            <div className="flex flex-wrap gap-2">
              {profile.skills.slice(0, 5).map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-sm rounded-full"
                >
                  {skill}
                </span>
              ))}
              {profile.skills.length > 5 && (
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm rounded-full">
                  +{profile.skills.length - 5} още
                </span>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {profile.completionRate}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Завършени задачи
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {profile.experience}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Години опит
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {profile.languages.length}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Езика
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
                onClick={handleViewProfile}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Виж профил
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
                url={`${typeof window !== 'undefined' ? window.location.origin : 'https://rabotim.com'}/profile/${profile.id}`}
                title={`${profile.name} - ${profile.title}`}
                description={profile.bio}
                hashtags={profile.skills}
                variant="minimal"
              />
            </div>
          )}
        </div>

        {/* Portfolio Preview */}
        {profile.portfolio.length > 0 && (
          <div className="px-6 pb-6">
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
              Портфолио
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {profile.portfolio.slice(0, 3).map((item) => (
                <div key={item.id} className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                    onClick={() => router.push(`/profile/${profile.id}/portfolio/${item.id}`)}
                  />
                </div>
              ))}
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
              src={profile.avatar}
              alt={profile.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            {profile.isVerified && (
              <CheckCircle className="absolute -bottom-1 -right-1 h-4 w-4 text-blue-600 bg-white rounded-full" />
            )}
            {profile.isPremium && (
              <Crown className="absolute -top-1 -right-1 h-4 w-4 text-yellow-500" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-gray-900 dark:text-gray-100">
                {profile.name}
              </h3>
              {profile.isPremium && (
                <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-medium rounded-full">
                  Premium
                </span>
              )}
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {profile.title}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{profile.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span>{profile.rating} ({profile.totalReviews})</span>
              </div>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-green-600">
            {profile.hourlyRate} лв/час
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {profile.responseTime}
          </div>
        </div>
      </div>

      <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
        {profile.bio}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {profile.skills.slice(0, 4).map((skill, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-sm rounded-full"
          >
            {skill}
          </span>
        ))}
        {profile.skills.length > 4 && (
          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm rounded-full">
            +{profile.skills.length - 4}
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
            onClick={handleViewProfile}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Виж профил
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


