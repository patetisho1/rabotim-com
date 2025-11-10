'use client'

import { Phone, Mail, MapPin, Lock, Crown, CheckCircle } from 'lucide-react'
import { getVisibleProfile, getContactVisibilityMessage, canViewContacts, ProfileUser } from '@/lib/profile-utils'

interface ProfileContactInfoProps {
  profile: ProfileUser
  currentUserId: string | null
  hasAppliedToTask?: boolean
  showVisibilityHint?: boolean
}

export default function ProfileContactInfo({
  profile,
  currentUserId,
  hasAppliedToTask = false,
  showVisibilityHint = true
}: ProfileContactInfoProps) {
  const visibleProfile = getVisibleProfile(profile, currentUserId, hasAppliedToTask)
  const canView = canViewContacts(profile.id, currentUserId, hasAppliedToTask, profile.is_premium || false)
  const visibilityMessage = getContactVisibilityMessage(profile.is_premium || false, hasAppliedToTask)

  return (
    <div className="space-y-4">
      {/* Contact visibility banner */}
      {showVisibilityHint && !canView && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                Контактите са скрити
              </h4>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                {visibilityMessage}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Premium badge */}
      {profile.is_premium && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            <span className="text-sm font-semibold text-yellow-900 dark:text-yellow-100">
              Premium профил
            </span>
          </div>
        </div>
      )}

      {/* Contact information */}
      <div className="space-y-3">
        {/* Phone */}
        {visibleProfile.phone && (
          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <Phone className="h-5 w-5 text-gray-400" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className={canView ? 'font-medium' : 'text-gray-500'}>
                  {visibleProfile.phone}
                </span>
                {!canView && (
                  <Lock className="h-3 w-3 text-gray-400" />
                )}
              </div>
              {!canView && (
                <p className="text-xs text-gray-500 mt-0.5">
                  Скрит телефон
                </p>
              )}
            </div>
          </div>
        )}

        {/* Email */}
        {visibleProfile.email && (
          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <Mail className="h-5 w-5 text-gray-400" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className={canView ? 'font-medium' : 'text-gray-500'}>
                  {visibleProfile.email}
                </span>
                {!canView && (
                  <Lock className="h-3 w-3 text-gray-400" />
                )}
              </div>
              {!canView && (
                <p className="text-xs text-gray-500 mt-0.5">
                  Скрит имейл
                </p>
              )}
            </div>
          </div>
        )}

        {/* Location */}
        {visibleProfile.location && (
          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <MapPin className="h-5 w-5 text-gray-400" />
            <span className="font-medium">{visibleProfile.location}</span>
          </div>
        )}

        {/* Verification status */}
        {profile.verified && (
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
            <CheckCircle className="h-4 w-4" />
            <span className="font-medium">Верифициран потребител</span>
          </div>
        )}
      </div>

      {/* Action hint */}
      {!canView && !profile.is_premium && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
            💡 Кандидатствайте за обява или надградете до Premium профил за да видите пълните контакти
          </p>
        </div>
      )}
    </div>
  )
}




