'use client'

import { ProfessionalProfile } from '@/types/professional-profile'
import { ProfileTemplateConfig } from '@/types/professional-profile'
import { profileTemplates, professionCategories } from '@/types/professional-profile'
import ModernTemplate from './ModernTemplate'
import ClassicTemplate from './ClassicTemplate'
import BoldTemplate from './BoldTemplate'
import ElegantTemplate from './ElegantTemplate'
import FitnessTemplate from './FitnessTemplate'
import BeautyTemplate from './BeautyTemplate'
import TechTemplate from './TechTemplate'
import CraftTemplate from './CraftTemplate'
import { Palette } from 'lucide-react'

export interface TemplateProps {
  profile: ProfessionalProfile
  templateConfig: ProfileTemplateConfig
  professionConfig: (typeof professionCategories)[number] | undefined
  isPreview?: boolean
  onContact: () => void
  onShare: () => void
  onBook?: () => void
  onOrderArt?: () => void
  userRating: number
  reviewCount: number
}

const templateMap = {
  modern: ModernTemplate,
  classic: ClassicTemplate,
  bold: BoldTemplate,
  elegant: ElegantTemplate,
  fitness: FitnessTemplate,
  beauty: BeautyTemplate,
  tech: TechTemplate,
  craft: CraftTemplate,
  creative: ElegantTemplate,
  professional: ClassicTemplate
} as const

export default function TemplateRenderer({
  profile,
  onContact,
  onShare,
  onBook,
  onOrderArt,
  userRating,
  reviewCount
}: Omit<TemplateProps, 'templateConfig' | 'professionConfig'>) {
  const templateId = profile.template || 'modern'
  const TemplateComponent = templateMap[templateId] || ModernTemplate
  const templateConfig = profileTemplates.find((t) => t.id === templateId) || profileTemplates[0]
  const professionConfig = professionCategories.find((c) => c.id === profile.profession)

  return (
    <>
      {/* Artist CTA: show when profile is artist and onOrderArt is provided */}
      {profile.isArtist && onOrderArt && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800">
          <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-800/50 flex items-center justify-center">
                <Palette size={20} className="text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Картини по поръчка</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Портрети и картини по снимка</p>
              </div>
            </div>
            <button
              onClick={onOrderArt}
              className="px-6 py-3 rounded-xl font-medium bg-amber-500 hover:bg-amber-600 text-white transition-colors shadow-md flex items-center gap-2"
            >
              <Palette size={18} />
              Поръчай картина
            </button>
          </div>
        </div>
      )}

      <TemplateComponent
        profile={profile}
        templateConfig={templateConfig}
        professionConfig={professionConfig}
        isPreview={false}
        onContact={onContact}
        onShare={onShare}
        onBook={onBook}
        onOrderArt={onOrderArt}
        userRating={userRating}
        reviewCount={reviewCount}
      />
    </>
  )
}
