// Professional Profile Types for Rabotim.com
// This allows users (especially premium) to create a mini-website for their services

export type ProfessionCategory = 
  | 'fitness'
  | 'beauty'
  | 'repairs'
  | 'cleaning'
  | 'teaching'
  | 'it'
  | 'design'
  | 'photography'
  | 'music'
  | 'transport'
  | 'legal'
  | 'accounting'
  | 'medical'
  | 'other'

export interface ServiceItem {
  id: string
  name: string
  description: string
  price: number
  priceType: 'fixed' | 'hourly' | 'starting_from' | 'negotiable'
  duration?: string // e.g., "1 час", "30 мин"
  popular?: boolean
}

export interface GalleryItem {
  id: string
  url: string
  caption?: string
  type: 'image' | 'video'
}

export interface WorkingHours {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
  isOpen: boolean
  openTime?: string // e.g., "09:00"
  closeTime?: string // e.g., "18:00"
}

export interface SocialLink {
  platform: 'facebook' | 'instagram' | 'youtube' | 'tiktok' | 'linkedin' | 'github' | 'website' | 'other'
  url: string
}

export interface Certification {
  id: string
  name: string
  issuer: string
  year: number
  imageUrl?: string
}

export interface ProfessionalProfile {
  id?: string // DB id (for artist orders)
  // Basic Info
  username: string // URL slug - e.g., "fitnessGuru" -> rabotim.com/p/fitnessGuru
  displayName: string
  tagline: string // Short description, e.g., "Персонален фитнес треньор с 10+ години опит"
  profession: ProfessionCategory
  professionTitle: string // Custom title, e.g., "Персонален треньор", "Масажист"
  
  // Template & Design
  template: ProfileTemplate
  primaryColor?: string
  coverImage?: string
  
  // Content Sections
  aboutMe: string
  services: ServiceItem[]
  gallery: GalleryItem[]
  certifications: Certification[]
  
  // Contact & Location
  contactEmail?: string
  contactPhone?: string
  whatsapp?: string
  address?: string
  city: string
  neighborhood?: string
  serviceArea?: string[] // Areas where they provide service
  
  // Schedule
  workingHours: WorkingHours[]
  
  // Social
  socialLinks: SocialLink[]
  
  // SEO
  metaTitle?: string
  metaDescription?: string
  
  // Stats (auto-calculated)
  viewCount: number
  contactRequests: number
  
  // Settings
  isPublished: boolean
  showPrices: boolean
  showPhone: boolean
  showEmail: boolean
  acceptOnlineBooking: boolean

  // Artist premium: картини по поръчка, Revolut
  isArtist?: boolean
  revolutEnabled?: boolean
  revolutBarcodeUrl?: string | null
  
  createdAt: string
  updatedAt: string
}

export type ProfileTemplate = 
  | 'modern'      // Clean, minimalist design
  | 'classic'     // Traditional business card style
  | 'bold'        // High contrast, attention-grabbing
  | 'elegant'     // Sophisticated, premium feel
  | 'creative'    // Artistic, colorful
  | 'fitness'     // Sports/gym themed
  | 'beauty'      // Spa/salon themed
  | 'tech'        // Modern tech/IT themed
  | 'craft'       // Handmade/artisan themed
  | 'professional' // Corporate/business themed

export interface ProfileTemplateConfig {
  id: ProfileTemplate
  name: string
  nameBg: string
  description: string
  descriptionBg: string
  previewImage: string
  primaryColor: string
  secondaryColor: string
  fontFamily: string
  isPremium: boolean
  recommendedFor: ProfessionCategory[]
}

// Template configurations
export const profileTemplates: ProfileTemplateConfig[] = [
  {
    id: 'modern',
    name: 'Modern',
    nameBg: 'Модерен',
    description: 'Clean and minimalist design perfect for any profession',
    descriptionBg: 'Изчистен и минималистичен дизайн, подходящ за всяка професия',
    previewImage: '/templates/modern.png',
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF',
    fontFamily: 'Inter',
    isPremium: false,
    recommendedFor: ['it', 'design', 'teaching', 'other']
  },
  {
    id: 'classic',
    name: 'Classic',
    nameBg: 'Класически',
    description: 'Traditional business card style that never goes out of fashion',
    descriptionBg: 'Традиционен стил на визитна картичка, който никога не излиза от мода',
    previewImage: '/templates/classic.png',
    primaryColor: '#1F2937',
    secondaryColor: '#374151',
    fontFamily: 'Georgia',
    isPremium: false,
    recommendedFor: ['legal', 'accounting', 'medical', 'other']
  },
  {
    id: 'bold',
    name: 'Bold',
    nameBg: 'Смел',
    description: 'High contrast design that grabs attention',
    descriptionBg: 'Контрастен дизайн, който привлича вниманието',
    previewImage: '/templates/bold.png',
    primaryColor: '#DC2626',
    secondaryColor: '#991B1B',
    fontFamily: 'Poppins',
    isPremium: true,
    recommendedFor: ['fitness', 'transport', 'repairs', 'other']
  },
  {
    id: 'elegant',
    name: 'Elegant',
    nameBg: 'Елегантен',
    description: 'Sophisticated design for premium services',
    descriptionBg: 'Изискан дизайн за премиум услуги',
    previewImage: '/templates/elegant.png',
    primaryColor: '#7C3AED',
    secondaryColor: '#5B21B6',
    fontFamily: 'Playfair Display',
    isPremium: true,
    recommendedFor: ['beauty', 'photography', 'design', 'legal']
  },
  {
    id: 'creative',
    name: 'Creative',
    nameBg: 'Креативен',
    description: 'Artistic and colorful for creative professionals',
    descriptionBg: 'Артистичен и цветен за творчески професионалисти',
    previewImage: '/templates/creative.png',
    primaryColor: '#EC4899',
    secondaryColor: '#BE185D',
    fontFamily: 'Montserrat',
    isPremium: true,
    recommendedFor: ['design', 'photography', 'music', 'other']
  },
  {
    id: 'fitness',
    name: 'Fitness',
    nameBg: 'Фитнес',
    description: 'Energetic design for fitness and sports professionals',
    descriptionBg: 'Енергичен дизайн за фитнес и спортни професионалисти',
    previewImage: '/templates/fitness.png',
    primaryColor: '#10B981',
    secondaryColor: '#047857',
    fontFamily: 'Oswald',
    isPremium: false,
    recommendedFor: ['fitness']
  },
  {
    id: 'beauty',
    name: 'Beauty',
    nameBg: 'Красота',
    description: 'Soft and elegant design for beauty professionals',
    descriptionBg: 'Нежен и елегантен дизайн за професионалисти в красотата',
    previewImage: '/templates/beauty.png',
    primaryColor: '#F472B6',
    secondaryColor: '#DB2777',
    fontFamily: 'Cormorant Garamond',
    isPremium: false,
    recommendedFor: ['beauty']
  },
  {
    id: 'tech',
    name: 'Tech',
    nameBg: 'Технологичен',
    description: 'Modern tech-inspired design for IT professionals',
    descriptionBg: 'Модерен технологично вдъхновен дизайн за IT професионалисти',
    previewImage: '/templates/tech.png',
    primaryColor: '#06B6D4',
    secondaryColor: '#0891B2',
    fontFamily: 'JetBrains Mono',
    isPremium: true,
    recommendedFor: ['it']
  },
  {
    id: 'craft',
    name: 'Craft',
    nameBg: 'Занаятчийски',
    description: 'Warm and rustic design for craftsmen and artisans',
    descriptionBg: 'Топъл и рустикален дизайн за занаятчии и майстори',
    previewImage: '/templates/craft.png',
    primaryColor: '#D97706',
    secondaryColor: '#B45309',
    fontFamily: 'Merriweather',
    isPremium: false,
    recommendedFor: ['repairs', 'other']
  },
  {
    id: 'professional',
    name: 'Professional',
    nameBg: 'Професионален',
    description: 'Corporate design for business professionals',
    descriptionBg: 'Корпоративен дизайн за бизнес професионалисти',
    previewImage: '/templates/professional.png',
    primaryColor: '#4F46E5',
    secondaryColor: '#3730A3',
    fontFamily: 'Source Sans Pro',
    isPremium: true,
    recommendedFor: ['legal', 'accounting', 'medical', 'teaching']
  }
]

// Profession categories with Bulgarian translations
export const professionCategories: { id: ProfessionCategory; name: string; nameBg: string; icon: string }[] = [
  { id: 'fitness', name: 'Fitness & Sports', nameBg: 'Фитнес и спорт', icon: '💪' },
  { id: 'beauty', name: 'Beauty & Wellness', nameBg: 'Красота и уелнес', icon: '💅' },
  { id: 'repairs', name: 'Repairs & Construction', nameBg: 'Ремонти и строителство', icon: '🔧' },
  { id: 'cleaning', name: 'Cleaning', nameBg: 'Почистване', icon: '🧹' },
  { id: 'teaching', name: 'Education & Tutoring', nameBg: 'Образование и уроци', icon: '📚' },
  { id: 'it', name: 'IT & Technology', nameBg: 'IT и технологии', icon: '💻' },
  { id: 'design', name: 'Design & Creative', nameBg: 'Дизайн и творчество', icon: '🎨' },
  { id: 'photography', name: 'Photography & Video', nameBg: 'Фотография и видео', icon: '📷' },
  { id: 'music', name: 'Music & Entertainment', nameBg: 'Музика и забавления', icon: '🎵' },
  { id: 'transport', name: 'Transport & Moving', nameBg: 'Транспорт и преместване', icon: '🚚' },
  { id: 'legal', name: 'Legal Services', nameBg: 'Правни услуги', icon: '⚖️' },
  { id: 'accounting', name: 'Accounting & Finance', nameBg: 'Счетоводство и финанси', icon: '📊' },
  { id: 'medical', name: 'Medical & Health', nameBg: 'Медицина и здраве', icon: '🏥' },
  { id: 'other', name: 'Other', nameBg: 'Друго', icon: '✨' }
]

// Default working hours template
export const defaultWorkingHours: WorkingHours[] = [
  { day: 'monday', isOpen: true, openTime: '09:00', closeTime: '18:00' },
  { day: 'tuesday', isOpen: true, openTime: '09:00', closeTime: '18:00' },
  { day: 'wednesday', isOpen: true, openTime: '09:00', closeTime: '18:00' },
  { day: 'thursday', isOpen: true, openTime: '09:00', closeTime: '18:00' },
  { day: 'friday', isOpen: true, openTime: '09:00', closeTime: '18:00' },
  { day: 'saturday', isOpen: false },
  { day: 'sunday', isOpen: false }
]

// Helper to create empty professional profile
export function createEmptyProfessionalProfile(userId: string, username: string): ProfessionalProfile {
  return {
    username,
    displayName: '',
    tagline: '',
    profession: 'other',
    professionTitle: '',
    template: 'modern',
    aboutMe: '',
    services: [],
    gallery: [],
    certifications: [],
    city: '',
    workingHours: defaultWorkingHours,
    socialLinks: [],
    viewCount: 0,
    contactRequests: 0,
    isPublished: false,
    showPrices: true,
    showPhone: true,
    showEmail: true,
    acceptOnlineBooking: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
}

// Username validation
export function validateUsername(username: string): { valid: boolean; error?: string } {
  if (!username) {
    return { valid: false, error: 'Потребителското име е задължително' }
  }
  
  if (username.length < 3) {
    return { valid: false, error: 'Потребителското име трябва да е поне 3 символа' }
  }
  
  if (username.length > 30) {
    return { valid: false, error: 'Потребителското име не може да е повече от 30 символа' }
  }
  
  // Only allow alphanumeric, underscores, and hyphens
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return { valid: false, error: 'Потребителското име може да съдържа само букви, цифри, тирета и долни черти' }
  }
  
  // Reserved usernames
  const reserved = ['admin', 'api', 'login', 'register', 'profile', 'settings', 'premium', 'tasks', 'messages', 'notifications', 'user', 'users', 'p', 'professionals']
  if (reserved.includes(username.toLowerCase())) {
    return { valid: false, error: 'Това потребителско име е запазено' }
  }
  
  return { valid: true }
}

