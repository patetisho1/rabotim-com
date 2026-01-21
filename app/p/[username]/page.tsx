'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'
import { TemplateRenderer } from '@/components/profile-templates'
import ShareButtons from '@/components/ShareButtons'
import { 
  ProfessionalProfile, 
  profileTemplates,
  professionCategories,
  defaultWorkingHours
} from '@/types/professional-profile'

export default function PublicProfilePage() {
  const params = useParams()
  const router = useRouter()
  const username = params.username as string
  const { user } = useAuth()
  
  const [profile, setProfile] = useState<ProfessionalProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showShareModal, setShowShareModal] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const [reviewCount, setReviewCount] = useState(0)

  useEffect(() => {
    loadProfile()
  }, [username])

  const loadProfile = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/professional-profiles/${username}`)
      
      if (response.ok) {
        const data = await response.json()
        setProfile(data.profile)
        
        // Set rating from user data if available
        if (data.user) {
          setUserRating(data.user.rating || 4.8)
          setReviewCount(data.user.total_reviews || 0)
        }
      } else if (response.status === 404) {
        // Demo profile for testing
        setProfile(getDemoProfile(username))
        setUserRating(4.9)
        setReviewCount(127)
      } else {
        throw new Error('Failed to load profile')
      }
    } catch (error) {
      // Fallback to demo profile
      setProfile(getDemoProfile(username))
      setUserRating(4.9)
      setReviewCount(127)
    } finally {
      setIsLoading(false)
    }
  }

  const getDemoProfile = (username: string): ProfessionalProfile => {
    // Determine template based on username for demo purposes
    let template: ProfessionalProfile['template'] = 'modern'
    let profession: ProfessionalProfile['profession'] = 'other'
    let professionTitle = 'Професионалист'
    
    if (username.toLowerCase().includes('fitness') || username.toLowerCase().includes('gym')) {
      template = 'fitness'
      profession = 'fitness'
      professionTitle = 'Персонален треньор'
    } else if (username.toLowerCase().includes('beauty') || username.toLowerCase().includes('salon')) {
      template = 'beauty'
      profession = 'beauty'
      professionTitle = 'Козметик'
    } else if (username.toLowerCase().includes('tech') || username.toLowerCase().includes('dev')) {
      template = 'tech'
      profession = 'it'
      professionTitle = 'Софтуерен разработчик'
    } else if (username.toLowerCase().includes('craft') || username.toLowerCase().includes('repair')) {
      template = 'craft'
      profession = 'repairs'
      professionTitle = 'Майстор'
    } else if (username.toLowerCase().includes('elegant') || username.toLowerCase().includes('premium')) {
      template = 'elegant'
      profession = 'legal'
      professionTitle = 'Бизнес консултант'
    } else if (username.toLowerCase().includes('bold')) {
      template = 'bold'
      profession = 'transport'
      professionTitle = 'Професионален шофьор'
    } else if (username.toLowerCase().includes('classic')) {
      template = 'classic'
      profession = 'accounting'
      professionTitle = 'Счетоводител'
    }

    return {
      username,
      displayName: 'Демо Профил',
      tagline: 'Професионален изпълнител с богат опит и много доволни клиенти',
      profession,
      professionTitle,
      template,
      primaryColor: profileTemplates.find(t => t.id === template)?.primaryColor,
      coverImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=400&fit=crop',
      aboutMe: `Здравейте! Аз съм професионалист с над 10 години опит в индустрията. Специализирам се в предоставянето на качествени услуги на моите клиенти.

Моята мисия е да помогна на всеки клиент да постигне своите цели. Работя с индивидуален подход и гарантирам качество.

Свържете се с мен за консултация!`,
      services: [
        { id: '1', name: 'Основна услуга', description: 'Пълен пакет услуги за вашите нужди', price: 50, priceType: 'fixed', duration: '60 мин', popular: true },
        { id: '2', name: 'Консултация', description: 'Професионална консултация и съвети', price: 30, priceType: 'fixed', duration: '45 мин' },
        { id: '3', name: 'Премиум пакет', description: 'Разширен пакет с допълнителни бонуси', price: 150, priceType: 'fixed' },
        { id: '4', name: 'Групова услуга', description: 'Услуга за малки групи до 5 човека', price: 20, priceType: 'fixed', duration: '60 мин' }
      ],
      gallery: [
        { id: '1', url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop', type: 'image', caption: 'Работа 1' },
        { id: '2', url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=400&fit=crop', type: 'image', caption: 'Резултат' },
        { id: '3', url: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400&h=400&fit=crop', type: 'image', caption: 'Процес' },
        { id: '4', url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=400&fit=crop', type: 'image', caption: 'Клиенти' }
      ],
      certifications: [
        { id: '1', name: 'Професионален сертификат', issuer: 'Национална асоциация', year: 2020 },
        { id: '2', name: 'Допълнителна квалификация', issuer: 'Международна организация', year: 2022 }
      ],
      contactEmail: 'demo@rabotim.com',
      contactPhone: '+359 888 123 456',
      whatsapp: '+359888123456',
      city: 'София',
      neighborhood: 'Център',
      serviceArea: ['София', 'Пловдив', 'Варна'],
      workingHours: defaultWorkingHours,
      socialLinks: [
        { platform: 'instagram', url: 'https://instagram.com/demo' },
        { platform: 'facebook', url: 'https://facebook.com/demo' }
      ],
      viewCount: 1234,
      contactRequests: 56,
      isPublished: true,
      showPrices: true,
      showPhone: true,
      showEmail: true,
      acceptOnlineBooking: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }

  const handleContact = async () => {
    if (!user) {
      toast.error('Моля, влезте в акаунта си за да се свържете')
      router.push('/login')
      return
    }

    // Track contact request
    try {
      await fetch(`/api/professional-profiles/${username}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'contact' })
      })
    } catch (error) {
      // Ignore tracking errors
    }

    router.push('/messages')
    toast.success('Ще бъдете пренасочени към съобщенията')
  }

  const handleShare = () => {
    setShowShareModal(true)
  }

  const profileUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/p/${username}` 
    : `https://rabotim.com/p/${username}`

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Зареждане на профила...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🔍</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Профилът не е намерен
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Не намерихме профил с потребителско име "{username}"
          </p>
          <button
            onClick={() => router.push('/professionals')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Разгледай професионалисти
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <TemplateRenderer
        profile={profile}
        onContact={handleContact}
        onShare={handleShare}
        userRating={userRating}
        reviewCount={reviewCount}
      />

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Сподели профила
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
            <ShareButtons
              url={profileUrl}
              title={`${profile.displayName} - ${profile.professionTitle}`}
              description={profile.tagline}
            />
          </div>
        </div>
      )}
    </>
  )
}
