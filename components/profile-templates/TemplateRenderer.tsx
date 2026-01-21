'use client'

import { ProfessionalProfile, ProfileTemplate, profileTemplates, professionCategories } from '@/types/professional-profile'
import ModernTemplate from './ModernTemplate'
import ClassicTemplate from './ClassicTemplate'
import BoldTemplate from './BoldTemplate'
import ElegantTemplate from './ElegantTemplate'
import FitnessTemplate from './FitnessTemplate'
import BeautyTemplate from './BeautyTemplate'
import TechTemplate from './TechTemplate'
import CraftTemplate from './CraftTemplate'

interface TemplateRendererProps {
  profile: ProfessionalProfile
  isPreview?: boolean
  onContact?: () => void
  onShare?: () => void
  userRating?: number
  reviewCount?: number
}

export default function TemplateRenderer({ 
  profile, 
  isPreview = false,
  onContact,
  onShare,
  userRating = 0,
  reviewCount = 0
}: TemplateRendererProps) {
  const templateConfig = profileTemplates.find(t => t.id === profile.template) || profileTemplates[0]
  const professionConfig = professionCategories.find(p => p.id === profile.profession)
  
  const commonProps = {
    profile,
    templateConfig,
    professionConfig,
    isPreview,
    onContact,
    onShare,
    userRating,
    reviewCount
  }

  // Render template based on type
  switch (profile.template) {
    case 'modern':
      return <ModernTemplate {...commonProps} />
    case 'classic':
      return <ClassicTemplate {...commonProps} />
    case 'bold':
      return <BoldTemplate {...commonProps} />
    case 'elegant':
      return <ElegantTemplate {...commonProps} />
    case 'fitness':
      return <FitnessTemplate {...commonProps} />
    case 'beauty':
      return <BeautyTemplate {...commonProps} />
    case 'tech':
      return <TechTemplate {...commonProps} />
    case 'craft':
      return <CraftTemplate {...commonProps} />
    case 'creative':
      return <BoldTemplate {...commonProps} /> // Use Bold as fallback
    case 'professional':
      return <ClassicTemplate {...commonProps} /> // Use Classic as fallback
    default:
      return <ModernTemplate {...commonProps} />
  }
}

// Export common types for templates
export interface TemplateProps {
  profile: ProfessionalProfile
  templateConfig: typeof profileTemplates[0]
  professionConfig?: typeof professionCategories[0]
  isPreview: boolean
  onContact?: () => void
  onShare?: () => void
  userRating: number
  reviewCount: number
}

