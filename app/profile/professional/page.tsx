'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Crown, 
  Plus, 
  Trash2, 
  Image as ImageIcon,
  Globe,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
  Palette,
  CreditCard
} from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useAccountMode } from '@/contexts/AccountModeContext'
import { 
  ProfessionalProfile, 
  ServiceItem,
  GalleryItem,
  Certification,
  WorkingHours,
  SocialLink,
  ProfileTemplate,
  profileTemplates,
  professionCategories,
  defaultWorkingHours,
  createEmptyProfessionalProfile,
  validateUsername
} from '@/types/professional-profile'
import { cities } from '@/lib/locations'

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 9)

// Day translations
const dayTranslations: Record<string, string> = {
  monday: 'Понеделник',
  tuesday: 'Вторник',
  wednesday: 'Сряда',
  thursday: 'Четвъртък',
  friday: 'Петък',
  saturday: 'Събота',
  sunday: 'Неделя'
}

export default function ProfessionalProfileEditor() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { professionalStatus, refreshStatus } = useAccountMode()
  
  const [profile, setProfile] = useState<ProfessionalProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'basic' | 'services' | 'gallery' | 'artist' | 'contact' | 'settings'>('basic')
  const [usernameError, setUsernameError] = useState<string | null>(null)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  const [checkingUsername, setCheckingUsername] = useState(false)
  const [displayNameError, setDisplayNameError] = useState<string | null>(null)
  const [displayNameAvailable, setDisplayNameAvailable] = useState<boolean | null>(null)
  const [checkingDisplayName, setCheckingDisplayName] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
      return
    }
    
    if (user) {
      loadProfile()
    }
  }, [user, authLoading])

  const loadProfile = async () => {
    if (!user) return
    
    setIsLoading(true)
    try {
      const response = await fetch(`/api/professional-profiles?userId=${user.id}`)
      const data = await response.json()
      
      if (data.profile) {
        // Transform database format to frontend format
        setProfile({
          username: data.profile.username || '',
          displayName: data.profile.display_name || user.email?.split('@')[0] || '',
          tagline: data.profile.tagline || '',
          profession: data.profile.profession || 'other',
          professionTitle: data.profile.profession_title || '',
          template: data.profile.template || 'modern',
          primaryColor: data.profile.primary_color,
          coverImage: data.profile.cover_image,
          aboutMe: data.profile.about_me || '',
          services: data.profile.services || [],
          gallery: data.profile.gallery || [],
          certifications: data.profile.certifications || [],
          contactEmail: data.profile.contact_email || user.email,
          contactPhone: data.profile.contact_phone,
          whatsapp: data.profile.whatsapp,
          address: data.profile.address,
          city: data.profile.city || '',
          neighborhood: data.profile.neighborhood,
          serviceArea: data.profile.service_area || [],
          workingHours: data.profile.working_hours || defaultWorkingHours,
          socialLinks: data.profile.social_links || [],
          viewCount: data.profile.view_count || 0,
          contactRequests: data.profile.contact_requests || 0,
          isPublished: data.profile.is_published || false,
          showPrices: data.profile.show_prices ?? true,
          showPhone: data.profile.show_phone ?? true,
          showEmail: data.profile.show_email ?? true,
          acceptOnlineBooking: data.profile.accept_online_booking || false,
          isArtist: data.profile.is_artist ?? false,
          revolutEnabled: data.profile.revolut_enabled ?? false,
          revolutBarcodeUrl: data.profile.revolut_barcode_url ?? null,
          createdAt: data.profile.created_at || new Date().toISOString(),
          updatedAt: data.profile.updated_at || new Date().toISOString()
        })
      } else {
        // Create new empty profile
        const newProfile = createEmptyProfessionalProfile(user.id, '')
        newProfile.displayName = user.email?.split('@')[0] || ''
        newProfile.contactEmail = user.email
        setProfile(newProfile)
      }
    } catch (error) {
      console.error('Failed to load profile:', error)
      toast.error('Грешка при зареждане на профила')
    } finally {
      setIsLoading(false)
    }
  }

  const checkUsernameAvailability = async (username: string) => {
    if (!username) {
      setUsernameError(null)
      setUsernameAvailable(null)
      return
    }

    const validation = validateUsername(username)
    if (!validation.valid) {
      setUsernameError(validation.error || null)
      setUsernameAvailable(false)
      return
    }

    setUsernameError(null)
    setCheckingUsername(true)
    try {
      const params = new URLSearchParams({ username, userId: user?.id ?? '' })
      const response = await fetch(`/api/professional-profiles/check-username?${params}`)
      const data = await response.json()
      if (data.available) {
        setUsernameAvailable(true)
        setUsernameError(null)
      } else {
        setUsernameAvailable(false)
        setUsernameError(data.error || 'Това потребителско име е заето')
      }
    } catch (error) {
      setUsernameAvailable(true)
      setUsernameError(null)
    } finally {
      setCheckingUsername(false)
    }
  }

  const checkDisplayNameAvailability = async (displayName: string) => {
    const trimmed = (displayName || '').trim()
    if (!trimmed) {
      setDisplayNameError(null)
      setDisplayNameAvailable(null)
      return
    }
    setCheckingDisplayName(true)
    setDisplayNameError(null)
    try {
      const params = new URLSearchParams({ displayName: trimmed, userId: user?.id ?? '' })
      const response = await fetch(`/api/professional-profiles/check-display-name?${params}`)
      const data = await response.json()
      if (data.available) {
        setDisplayNameAvailable(true)
        setDisplayNameError(null)
      } else {
        setDisplayNameAvailable(false)
        setDisplayNameError(data.error || 'Това име за показване е заето')
      }
    } catch {
      setDisplayNameAvailable(true)
      setDisplayNameError(null)
    } finally {
      setCheckingDisplayName(false)
    }
  }

  const handleSave = async (): Promise<boolean> => {
    if (!user || !profile) return false

    if (!profile.username) {
      toast.error('Моля, въведете потребителско име')
      setActiveTab('basic')
      return false
    }

    const validation = validateUsername(profile.username)
    if (!validation.valid) {
      toast.error(validation.error || 'Невалидно потребителско име')
      setActiveTab('basic')
      return false
    }

    setIsSaving(true)
    try {
      const response = await fetch('/api/professional-profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          profile
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save profile')
      }

      // Refresh the professional status after saving
      await refreshStatus()
      
      toast.success('Профилът е запазен успешно!')
      return true
    } catch (error: any) {
      toast.error(error.message || 'Грешка при запазване на профила')
      return false
    } finally {
      setIsSaving(false)
    }
  }

  const handlePreview = async () => {
    if (!profile?.username) {
      toast.error('Въведете потребителско име и запазете, за да прегледате')
      return
    }
    const ok = await handleSave()
    if (ok) {
      const url = `${typeof window !== 'undefined' ? window.location.origin : 'https://rabotim.com'}/p/${profile.username}?v=${Date.now()}`
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  const updateProfile = (updates: Partial<ProfessionalProfile>) => {
    if (!profile) return
    setProfile({ ...profile, ...updates })
  }

  // Service management
  const addService = () => {
    if (!profile) return
    const newService: ServiceItem = {
      id: generateId(),
      name: '',
      description: '',
      price: 0,
      priceType: 'fixed'
    }
    updateProfile({ services: [...profile.services, newService] })
  }

  const updateService = (id: string, updates: Partial<ServiceItem>) => {
    if (!profile) return
    updateProfile({
      services: profile.services.map(s => s.id === id ? { ...s, ...updates } : s)
    })
  }

  const removeService = (id: string) => {
    if (!profile) return
    updateProfile({ services: profile.services.filter(s => s.id !== id) })
  }

  // Gallery management
  const addGalleryItem = () => {
    if (!profile) return
    const newItem: GalleryItem = {
      id: generateId(),
      url: '',
      type: 'image'
    }
    updateProfile({ gallery: [...profile.gallery, newItem] })
  }

  const updateGalleryItem = (id: string, updates: Partial<GalleryItem>) => {
    if (!profile) return
    updateProfile({
      gallery: profile.gallery.map(g => g.id === id ? { ...g, ...updates } : g)
    })
  }

  const removeGalleryItem = (id: string) => {
    if (!profile) return
    updateProfile({ gallery: profile.gallery.filter(g => g.id !== id) })
  }

  // Certification management
  const addCertification = () => {
    if (!profile) return
    const newCert: Certification = {
      id: generateId(),
      name: '',
      issuer: '',
      year: new Date().getFullYear()
    }
    updateProfile({ certifications: [...profile.certifications, newCert] })
  }

  const updateCertification = (id: string, updates: Partial<Certification>) => {
    if (!profile) return
    updateProfile({
      certifications: profile.certifications.map(c => c.id === id ? { ...c, ...updates } : c)
    })
  }

  const removeCertification = (id: string) => {
    if (!profile) return
    updateProfile({ certifications: profile.certifications.filter(c => c.id !== id) })
  }

  // Social link management
  const addSocialLink = () => {
    if (!profile) return
    const newLink: SocialLink = {
      platform: 'website',
      url: ''
    }
    updateProfile({ socialLinks: [...profile.socialLinks, newLink] })
  }

  const updateSocialLink = (index: number, updates: Partial<SocialLink>) => {
    if (!profile) return
    const newLinks = [...profile.socialLinks]
    newLinks[index] = { ...newLinks[index], ...updates }
    updateProfile({ socialLinks: newLinks })
  }

  const removeSocialLink = (index: number) => {
    if (!profile) return
    updateProfile({ socialLinks: profile.socialLinks.filter((_, i) => i !== index) })
  }

  // Working hours management
  const updateWorkingHours = (day: string, updates: Partial<WorkingHours>) => {
    if (!profile) return
    updateProfile({
      workingHours: profile.workingHours.map(wh => 
        wh.day === day ? { ...wh, ...updates } : wh
      )
    })
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Зареждане...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Грешка при зареждане на профила</p>
      </div>
    )
  }

  const profileUrl = profile.username 
    ? `${typeof window !== 'undefined' ? window.location.origin : 'https://rabotim.com'}/p/${profile.username}`
    : null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Професионален профил
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Създай своя мини-сайт
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {profileUrl && (
                <button
                  type="button"
                  onClick={handlePreview}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors disabled:opacity-50"
                >
                  <Eye size={18} />
                  <span className="hidden sm:inline">Преглед</span>
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isSaving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                <span className="hidden sm:inline">Запази</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Profile Status Banner */}
        {professionalStatus.isActive ? (
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-4 mb-6 text-white">
            <div className="flex items-center gap-3">
              <CheckCircle size={24} />
              <div className="flex-1">
                <h3 className="font-semibold">Профилът е активен</h3>
                <p className="text-sm text-green-100">
                  Профилът ти се показва в каталога „Професионалисти". 
                  {professionalStatus.planType && ` План: ${professionalStatus.planType.charAt(0).toUpperCase() + professionalStatus.planType.slice(1)}`}
                </p>
              </div>
              {profileUrl && (
                <a
                  href={profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-white text-green-600 rounded-lg font-medium hover:bg-green-50 transition-colors"
                >
                  <ExternalLink size={16} />
                  Отвори профила
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl p-4 mb-6 text-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-3 flex-1">
                <AlertCircle size={24} />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">Профилът е в режим „Чернова"</h3>
                    <span className="px-2 py-0.5 bg-white/20 rounded text-xs font-medium">Не е активен</span>
                  </div>
                  <p className="text-sm text-yellow-100 mt-1">
                    Попълни профила и избери план, за да се покажеш в каталога с професионалисти. 
                    Клиентите ще могат да те намерят и да се свържат директно с теб.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => router.push('/premium')}
                className="flex items-center gap-2 px-4 py-2.5 bg-white text-orange-600 rounded-lg font-medium hover:bg-yellow-50 transition-colors whitespace-nowrap"
              >
                <Crown size={18} />
                Активирай от 29€/мес
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto">
          <div className="flex">
            {[
              { id: 'basic', label: 'Основни' },
              { id: 'services', label: 'Услуги' },
              { id: 'gallery', label: 'Галерия' },
              { id: 'artist', label: 'Художник' },
              { id: 'contact', label: 'Контакти' },
              { id: 'settings', label: 'Настройки' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-4 px-4 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          {/* Basic Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Потребителско име (URL) *
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">rabotim.com/p/</span>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={profile.username}
                      onChange={(e) => {
                        const value = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '')
                        updateProfile({ username: value })
                        checkUsernameAvailability(value)
                      }}
                      placeholder="fitnessGuru"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {checkingUsername && (
                      <Loader2 size={18} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-gray-400" />
                    )}
                    {!checkingUsername && usernameAvailable === true && (
                      <CheckCircle size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
                    )}
                    {!checkingUsername && usernameAvailable === false && (
                      <AlertCircle size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500" />
                    )}
                  </div>
                </div>
                {usernameError && (
                  <p className="mt-1 text-sm text-red-500">{usernameError}</p>
                )}
                {usernameAvailable && !usernameError && (
                  <p className="mt-1 text-sm text-green-500">✓ Потребителското име е свободно</p>
                )}
              </div>

              {/* Display Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Име за показване *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={profile.displayName}
                    onChange={(e) => {
                      updateProfile({ displayName: e.target.value })
                      setDisplayNameError(null)
                      setDisplayNameAvailable(null)
                    }}
                    onBlur={() => checkDisplayNameAvailability(profile.displayName || '')}
                    placeholder="Иван Петров"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                  />
                  {checkingDisplayName && (
                    <Loader2 size={18} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-gray-400" />
                  )}
                  {!checkingDisplayName && displayNameAvailable === true && (
                    <CheckCircle size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
                  )}
                  {!checkingDisplayName && displayNameAvailable === false && (
                    <AlertCircle size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500" />
                  )}
                </div>
                {displayNameError && (
                  <p className="mt-1 text-sm text-red-500">{displayNameError}</p>
                )}
                {displayNameAvailable && !displayNameError && (
                  <p className="mt-1 text-sm text-green-500">✓ Името е свободно</p>
                )}
              </div>

              {/* Profession Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Категория професия *
                </label>
                <select
                  value={profile.profession}
                  onChange={(e) => updateProfile({ profession: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {professionCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.nameBg}
                    </option>
                  ))}
                </select>
              </div>

              {/* Profession Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Професия / Заглавие *
                </label>
                <input
                  type="text"
                  value={profile.professionTitle}
                  onChange={(e) => updateProfile({ professionTitle: e.target.value })}
                  placeholder="Персонален треньор"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Слоган
                </label>
                <input
                  type="text"
                  value={profile.tagline}
                  onChange={(e) => updateProfile({ tagline: e.target.value })}
                  placeholder="Професионален фитнес треньор с 10+ години опит"
                  maxLength={100}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">{profile.tagline.length}/100</p>
              </div>

              {/* About Me */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  За мен
                </label>
                <textarea
                  value={profile.aboutMe}
                  onChange={(e) => updateProfile({ aboutMe: e.target.value })}
                  placeholder="Разкажете за себе си, опита си и какво предлагате..."
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>

              {/* Template Selection - всички опции са премиум, избираеми за преглед */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Шаблон
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Изберете шаблон и прегледайте профила си. Всички шаблони са част от премиум акаунта.
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-400 mb-3">
                  При преглед ще видите различно оформление: цветове, подредба и стил (напр. Модерен – светъл, Ударен – тъмен с червен акцент, Класически – кадифе/сив). Натиснете „Преглед” – промените се запазват и отваря се избраният шаблон.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {profileTemplates.map((template, index) => {
                    const isSelected = profile.template === template.id
                    const primary = template.primaryColor || '#3B82F6'
                    const secondary = template.secondaryColor || primary
                    const iconShapes = ['rounded-full', 'rounded-xl', 'rounded-lg', 'rounded-full', 'rounded-2xl', 'rounded-full', 'rounded-lg', 'rounded-xl', 'rounded-full'] as const
                    const iconShape = iconShapes[index % iconShapes.length]
                    return (
                      <button
                        key={template.id}
                        type="button"
                        onClick={() => updateProfile({ template: template.id })}
                        className={`
                          relative p-4 rounded-xl border-2 transition-all duration-200
                          hover:scale-[1.02] hover:shadow-md
                          ${!isSelected ? 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600' : ''}
                        `}
                        style={isSelected ? {
                          borderColor: primary,
                          backgroundColor: `${primary}18`,
                          boxShadow: `0 4px 12px ${primary}30`
                        } : {
                          background: `linear-gradient(135deg, ${primary}0a 0%, ${secondary}06 100%)`
                        }}
                      >
                        <div
                          className={`w-10 h-10 mx-auto mb-2 flex items-center justify-center ${iconShape}`}
                          style={{
                            backgroundColor: primary,
                            boxShadow: isSelected ? `0 4px 14px ${primary}50` : undefined
                          }}
                        />
                        <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                          {template.nameBg}
                        </p>
                        <span className="text-xs text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1 mt-1">
                          <Crown size={12} />
                          Премиум
                        </span>
                        {isSelected && (
                          <div
                            className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs"
                            style={{ backgroundColor: primary }}
                          >
                            ✓
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Снимка за корица (URL)
                </label>
                <input
                  type="url"
                  value={profile.coverImage || ''}
                  onChange={(e) => updateProfile({ coverImage: e.target.value })}
                  placeholder="https://example.com/cover.jpg"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Certifications */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Сертификати
                  </label>
                  <button
                    onClick={addCertification}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Plus size={16} />
                    Добави
                  </button>
                </div>
                <div className="space-y-3">
                  {profile.certifications.map((cert) => (
                    <div key={cert.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                          type="text"
                          value={cert.name}
                          onChange={(e) => updateCertification(cert.id, { name: e.target.value })}
                          placeholder="Име на сертификат"
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                        />
                        <input
                          type="text"
                          value={cert.issuer}
                          onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })}
                          placeholder="Издател"
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                        />
                        <input
                          type="number"
                          value={cert.year}
                          onChange={(e) => updateCertification(cert.id, { year: parseInt(e.target.value) })}
                          placeholder="Година"
                          min={1990}
                          max={new Date().getFullYear()}
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                        />
                      </div>
                      <button
                        onClick={() => removeCertification(cert.id)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Вашите услуги
                </h3>
                <button
                  onClick={addService}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={18} />
                  Добави услуга
                </button>
              </div>

              {profile.services.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p>Нямате добавени услуги</p>
                  <button
                    onClick={addService}
                    className="mt-4 text-blue-600 hover:text-blue-700"
                  >
                    Добавете първата си услуга
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {profile.services.map((service, index) => (
                    <div 
                      key={service.id}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <span className="text-sm text-gray-500">Услуга #{index + 1}</span>
                        <button
                          onClick={() => removeService(service.id)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Име на услугата *
                          </label>
                          <input
                            type="text"
                            value={service.name}
                            onChange={(e) => updateService(service.id, { name: e.target.value })}
                            placeholder="Персонална тренировка"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          />
                        </div>

                        <div className="flex gap-2">
                          <div className="flex-1">
                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                              Цена (€)
                            </label>
                            <input
                              type="number"
                              value={service.price}
                              onChange={(e) => updateService(service.id, { price: parseFloat(e.target.value) || 0 })}
                              min={0}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                              Тип
                            </label>
                            <select
                              value={service.priceType}
                              onChange={(e) => updateService(service.id, { priceType: e.target.value as any })}
                              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            >
                              <option value="fixed">Фиксирана</option>
                              <option value="hourly">На час</option>
                              <option value="starting_from">От</option>
                              <option value="negotiable">По договаряне</option>
                            </select>
                          </div>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Описание
                          </label>
                          <textarea
                            value={service.description}
                            onChange={(e) => updateService(service.id, { description: e.target.value })}
                            placeholder="Опишете услугата..."
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Продължителност
                          </label>
                          <input
                            type="text"
                            value={service.duration || ''}
                            onChange={(e) => updateService(service.id, { duration: e.target.value })}
                            placeholder="60 мин"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          />
                        </div>

                        <div className="flex items-center">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={service.popular || false}
                              onChange={(e) => updateService(service.id, { popular: e.target.checked })}
                              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Отбележи като популярна
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Artist Tab - Premium for artists: paintings/portraits, Revolut */}
          {activeTab === 'artist' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Palette size={24} className="text-amber-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Профил за художник
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Включете тази опция, ако приемате поръчки за картини или портрети по снимка. Клиентите ще могат да попълнят форма за поръчка с тип, размер и референтна снимка.
              </p>

              <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl cursor-pointer">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Профил за художник</p>
                  <p className="text-sm text-gray-500">Приемам поръчки за картини / портрети по снимка</p>
                </div>
                <input
                  type="checkbox"
                  checked={profile.isArtist ?? false}
                  onChange={(e) => updateProfile({ isArtist: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </label>

              {(profile.isArtist ?? false) && (
                <>
                  <div className="flex justify-end">
                    <Link
                      href="/profile/orders"
                      className="text-sm text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                    >
                      Преглед на поръчките
                      <ExternalLink size={14} />
                    </Link>
                  </div>
                  <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl cursor-pointer">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <CreditCard size={18} />
                        Плащане с Revolut
                      </p>
                      <p className="text-sm text-gray-500">Показвам баркод/линк за плащане с Revolut при поръчка</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={profile.revolutEnabled ?? false}
                      onChange={(e) => updateProfile({ revolutEnabled: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </label>

                  {(profile.revolutEnabled ?? false) && (
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Снимка / URL на Revolut баркод
                      </label>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="url"
                          value={profile.revolutBarcodeUrl || ''}
                          onChange={(e) => updateProfile({ revolutBarcodeUrl: e.target.value || null })}
                          placeholder="https://... или качете снимка по-долу"
                          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                        <label className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                          <ImageIcon size={18} />
                          <span>Качи снимка</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0]
                              if (!file) return
                              const formData = new FormData()
                              formData.append('file', file)
                              formData.append('folder', 'revolut')
                              try {
                                const res = await fetch('/api/upload', { method: 'POST', body: formData })
                                const data = await res.json()
                                if (data?.file?.url) updateProfile({ revolutBarcodeUrl: data.file.url })
                                else toast.error('Грешка при качване')
                              } catch {
                                toast.error('Грешка при качване')
                              }
                              e.target.value = ''
                            }}
                          />
                        </label>
                      </div>
                      {profile.revolutBarcodeUrl && (
                        <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg inline-block">
                          <img src={profile.revolutBarcodeUrl} alt="Revolut баркод" className="max-h-24 object-contain" />
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Gallery Tab */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Галерия
                </h3>
                <button
                  onClick={addGalleryItem}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={18} />
                  Добави снимка
                </button>
              </div>

              {profile.gallery.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <ImageIcon size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>Нямате добавени снимки</p>
                  <button
                    onClick={addGalleryItem}
                    className="mt-4 text-blue-600 hover:text-blue-700"
                  >
                    Добавете първата снимка
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {profile.gallery.map((item) => (
                    <div 
                      key={item.id}
                      className="relative group"
                    >
                      <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                        {item.url ? (
                          <img
                            src={item.url}
                            alt={item.caption || 'Gallery'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon size={32} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                        <button
                          onClick={() => removeGalleryItem(item.id)}
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="mt-2 space-y-2">
                        <input
                          type="url"
                          value={item.url}
                          onChange={(e) => updateGalleryItem(item.id, { url: e.target.value })}
                          placeholder="URL на снимката"
                          className="w-full px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                        <input
                          type="text"
                          value={item.caption || ''}
                          onChange={(e) => updateGalleryItem(item.id, { caption: e.target.value })}
                          placeholder="Описание"
                          className="w-full px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Контактна информация
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profile.contactEmail || ''}
                    onChange={(e) => updateProfile({ contactEmail: e.target.value })}
                    placeholder="email@example.com"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    value={profile.contactPhone || ''}
                    onChange={(e) => updateProfile({ contactPhone: e.target.value })}
                    placeholder="+359 888 123 456"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={profile.whatsapp || ''}
                    onChange={(e) => updateProfile({ whatsapp: e.target.value })}
                    placeholder="+359888123456"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Град
                  </label>
                  <select
                    value={profile.city}
                    onChange={(e) => updateProfile({ city: e.target.value, neighborhood: '' })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="">Изберете град</option>
                    {cities.map((city) => (
                      <option key={city.value} value={city.value}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>

                {profile.city && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Квартал
                    </label>
                    <select
                      value={profile.neighborhood || ''}
                      onChange={(e) => updateProfile({ neighborhood: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="">Изберете квартал</option>
                      {cities.find(c => c.value === profile.city)?.neighborhoods.map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Адрес
                  </label>
                  <input
                    type="text"
                    value={profile.address || ''}
                    onChange={(e) => updateProfile({ address: e.target.value })}
                    placeholder="ул. Пример 123"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              {/* Working Hours */}
              <div>
                <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Работно време
                </h4>
                <div className="space-y-3">
                  {profile.workingHours.map((wh) => (
                    <div key={wh.day} className="flex items-center gap-4">
                      <div className="w-28 text-sm text-gray-600 dark:text-gray-400">
                        {dayTranslations[wh.day]}
                      </div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={wh.isOpen}
                          onChange={(e) => updateWorkingHours(wh.day, { isOpen: e.target.checked })}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Работен</span>
                      </label>
                      {wh.isOpen && (
                        <>
                          <input
                            type="time"
                            value={wh.openTime || '09:00'}
                            onChange={(e) => updateWorkingHours(wh.day, { openTime: e.target.value })}
                            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                          />
                          <span className="text-gray-500">-</span>
                          <input
                            type="time"
                            value={wh.closeTime || '18:00'}
                            onChange={(e) => updateWorkingHours(wh.day, { closeTime: e.target.value })}
                            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                          />
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">
                    Социални мрежи
                  </h4>
                  <button
                    onClick={addSocialLink}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Plus size={16} />
                    Добави
                  </button>
                </div>
                <div className="space-y-3">
                  {profile.socialLinks.map((link, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <select
                        value={link.platform}
                        onChange={(e) => updateSocialLink(index, { platform: e.target.value as any })}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      >
                        <option value="facebook">Facebook</option>
                        <option value="instagram">Instagram</option>
                        <option value="youtube">YouTube</option>
                        <option value="tiktok">TikTok</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="website">Уебсайт</option>
                        <option value="other">Друго</option>
                      </select>
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) => updateSocialLink(index, { url: e.target.value })}
                        placeholder="https://"
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                      <button
                        onClick={() => removeSocialLink(index)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Настройки на профила
              </h3>

              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl cursor-pointer">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Публикуван профил</p>
                    <p className="text-sm text-gray-500">Профилът ви ще бъде видим за всички</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={profile.isPublished}
                    onChange={(e) => updateProfile({ isPublished: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl cursor-pointer">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Покажи цени</p>
                    <p className="text-sm text-gray-500">Цените на услугите ще бъдат видими</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={profile.showPrices}
                    onChange={(e) => updateProfile({ showPrices: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl cursor-pointer">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Покажи телефон</p>
                    <p className="text-sm text-gray-500">Телефонният ви номер ще бъде видим</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={profile.showPhone}
                    onChange={(e) => updateProfile({ showPhone: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl cursor-pointer">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Покажи email</p>
                    <p className="text-sm text-gray-500">Email адресът ви ще бъде видим</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={profile.showEmail}
                    onChange={(e) => updateProfile({ showEmail: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl cursor-pointer">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Онлайн резервации</p>
                    <p className="text-sm text-gray-500">Показване на бутон за резервация</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={profile.acceptOnlineBooking}
                    onChange={(e) => updateProfile({ acceptOnlineBooking: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>
              </div>

              {/* Profile Stats */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Статистика
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <p className="text-2xl font-bold text-blue-600">{profile.viewCount}</p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">Прегледи</p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <p className="text-2xl font-bold text-green-600">{profile.contactRequests}</p>
                    <p className="text-sm text-green-700 dark:text-green-300">Запитвания</p>
                  </div>
                </div>
              </div>

              {/* Profile URL */}
              {profile.username && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-4">
                    Вашият профил URL
                  </h4>
                  <div className="flex items-center gap-2 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <Globe size={20} className="text-gray-500" />
                    <code className="flex-1 text-sm text-blue-600">
                      {profileUrl}
                    </code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(profileUrl || '')
                        toast.success('URL копиран!')
                      }}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Копирай
                    </button>
                    <a
                      href={profileUrl || ''}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      <ExternalLink size={18} />
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

