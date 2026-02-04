'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'
import { TemplateRenderer } from '@/components/profile-templates'
import ShareButtons from '@/components/ShareButtons'
import BookingModal from '@/components/BookingModal'
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
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const [reviewCount, setReviewCount] = useState(0)
  const [professionalId, setProfessionalId] = useState<string>('')
  const [professionalUserId, setProfessionalUserId] = useState<string>('')
  const [isPreview, setIsPreview] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [username])

  const loadProfile = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/professional-profiles/${username}`, { cache: 'no-store' })
      
      if (response.ok) {
        const data = await response.json()
        setProfile(data.profile)
        setIsPreview(!!data.isPreview)
        
        // Set IDs for booking
        if (data.profile?.id) {
          setProfessionalId(data.profile.id)
        }
        if (data.profile?.userId) {
          setProfessionalUserId(data.profile.userId)
        }
        
        // Set rating from user data if available
        if (data.user) {
          setUserRating(data.user.rating || 4.8)
          setReviewCount(data.user.total_reviews || 0)
        }
      } else if (response.status === 404) {
        setIsPreview(false)
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
    // Demo profiles database
    const demoProfiles: { [key: string]: ProfessionalProfile } = {
      'fitness-maria': {
        username: 'fitness-maria',
        displayName: 'Мария Иванова',
        tagline: 'Персонален фитнес треньор с 10+ години опит. Специалист по трансформация и здравословен начин на живот.',
        profession: 'fitness',
        professionTitle: 'Персонален треньор',
        template: 'fitness',
        primaryColor: '#10B981',
        coverImage: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&h=400&fit=crop',
        aboutMe: `Здравейте! Аз съм Мария, персонален треньор с над 10 години опит във фитнес индустрията.

Специализирам се в:
• Трансформация на тялото и отслабване
• Изграждане на мускулна маса
• Подготовка за състезания
• Корективни упражнения

Работя с клиенти от всички възрасти и нива на подготовка. Вярвам, че всеки заслужава да се чувства добре в тялото си!`,
        services: [
          { id: '1', name: 'Персонална тренировка', description: 'Индивидуална тренировка във фитнес или на открито', price: 35, priceType: 'fixed', duration: '60 мин', popular: true },
          { id: '2', name: 'Хранителен план', description: 'Персонализиран хранителен режим за вашите цели', price: 60, priceType: 'fixed' },
          { id: '3', name: 'Месечен абонамент', description: '12 тренировки + хранителен план', price: 350, priceType: 'fixed' },
          { id: '4', name: 'Онлайн консултация', description: 'Видео консултация за фитнес съвети', price: 25, priceType: 'fixed', duration: '45 мин' }
        ],
        gallery: [
          { id: '1', url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=400&fit=crop', type: 'image', caption: 'Групова тренировка' },
          { id: '2', url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=400&fit=crop', type: 'image', caption: 'Силова тренировка' },
          { id: '3', url: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400&h=400&fit=crop', type: 'image', caption: 'Кардио' },
          { id: '4', url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=400&fit=crop', type: 'image', caption: 'Функционален тренинг' }
        ],
        certifications: [
          { id: '1', name: 'Сертифициран персонален треньор', issuer: 'NASM', year: 2014 },
          { id: '2', name: 'Специалист по хранене', issuer: 'Precision Nutrition', year: 2018 }
        ],
        contactEmail: 'maria@fitness.demo',
        contactPhone: '+359 888 111 222',
        whatsapp: '+359888111222',
        city: 'София',
        neighborhood: 'Витоша',
        serviceArea: ['София', 'Околността'],
        workingHours: defaultWorkingHours,
        socialLinks: [
          { platform: 'instagram', url: 'https://instagram.com/fitnessmaria' },
          { platform: 'facebook', url: 'https://facebook.com/fitnessmaria' }
        ],
        viewCount: 1250,
        contactRequests: 89,
        isPublished: true,
        showPrices: true,
        showPhone: true,
        showEmail: true,
        acceptOnlineBooking: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      'beauty-elena': {
        username: 'beauty-elena',
        displayName: 'Елена Петрова',
        tagline: 'Професионален козметик и визажист. Сватбен грим, дневен и вечерен makeup, процедури за лице.',
        profession: 'beauty',
        professionTitle: 'Козметик и визажист',
        template: 'beauty',
        primaryColor: '#EC4899',
        coverImage: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&h=400&fit=crop',
        aboutMe: `Здравейте, аз съм Елена - професионален козметик и визажист с над 8 години опит.

Специализирам се в:
• Сватбен и официален грим
• Дневен и вечерен makeup
• Процедури за лице и почистване
• Оформяне на вежди и мигли

Работя само с висококачествени продукти от световни марки. Всеки клиент е уникален и заслужава специално внимание!`,
        services: [
          { id: '1', name: 'Пълен грим', description: 'Дневен или вечерен грим с качествена козметика', price: 50, priceType: 'fixed', duration: '60 мин', popular: true },
          { id: '2', name: 'Сватбен грим', description: 'Пълен булченски грим + проба', price: 120, priceType: 'fixed', duration: '90 мин' },
          { id: '3', name: 'Почистване на лице', description: 'Дълбоко почистване с маска и масаж', price: 40, priceType: 'fixed', duration: '75 мин' },
          { id: '4', name: 'Ламиниране на мигли', description: 'Професионално ламиниране за естествен обем', price: 45, priceType: 'fixed', duration: '45 мин' }
        ],
        gallery: [
          { id: '1', url: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=400&fit=crop', type: 'image', caption: 'Сватбен грим' },
          { id: '2', url: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=400&fit=crop', type: 'image', caption: 'Вечерен makeup' },
          { id: '3', url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=400&fit=crop', type: 'image', caption: 'Студио' },
          { id: '4', url: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=400&h=400&fit=crop', type: 'image', caption: 'Продукти' }
        ],
        certifications: [
          { id: '1', name: 'Сертифициран визажист', issuer: 'Make Up For Ever Academy', year: 2016 },
          { id: '2', name: 'Козметик', issuer: 'CIDESCO', year: 2018 }
        ],
        contactEmail: 'elena@beauty.demo',
        contactPhone: '+359 888 222 333',
        whatsapp: '+359888222333',
        city: 'София',
        neighborhood: 'Лозенец',
        serviceArea: ['София'],
        workingHours: defaultWorkingHours,
        socialLinks: [
          { platform: 'instagram', url: 'https://instagram.com/beautyelena' },
          { platform: 'tiktok', url: 'https://tiktok.com/@beautyelena' }
        ],
        viewCount: 890,
        contactRequests: 56,
        isPublished: true,
        showPrices: true,
        showPhone: true,
        showEmail: true,
        acceptOnlineBooking: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      'electrician-georgi': {
        username: 'electrician-georgi',
        displayName: 'Георги Димитров',
        tagline: 'Лицензиран електротехник с 15 години опит. Ремонт, монтаж, аварийни повиквания 24/7.',
        profession: 'repairs',
        professionTitle: 'Електротехник',
        template: 'craft',
        primaryColor: '#F59E0B',
        coverImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&h=400&fit=crop',
        aboutMe: `Здравейте! Аз съм Георги - лицензиран електротехник с над 15 години практически опит.

Предлагам:
• Електрически ремонти в дома и офиса
• Монтаж на осветление и ел. инсталации
• Подмяна на табла и автомати
• Аварийни повиквания 24/7

Работя качествено, бързо и с гаранция. Всички материали са сертифицирани.`,
        services: [
          { id: '1', name: 'Диагностика на повреда', description: 'Откриване и оценка на електрически проблем', price: 25, priceType: 'fixed', duration: '30 мин', popular: true },
          { id: '2', name: 'Монтаж на осветление', description: 'Монтаж на лампи, лустри, LED осветление', price: 20, priceType: 'hourly' },
          { id: '3', name: 'Подмяна на ел. табло', description: 'Пълна подмяна с нови автомати', price: 150, priceType: 'fixed' },
          { id: '4', name: 'Аварийно повикване', description: 'Спешен ремонт при авария 24/7', price: 50, priceType: 'fixed' }
        ],
        gallery: [
          { id: '1', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', type: 'image', caption: 'Електрическо табло' },
          { id: '2', url: 'https://images.unsplash.com/photo-1565608438257-fac3c27beb36?w=400&h=400&fit=crop', type: 'image', caption: 'Монтаж' },
          { id: '3', url: 'https://images.unsplash.com/photo-1555963966-b7ae5404b6ed?w=400&h=400&fit=crop', type: 'image', caption: 'Инструменти' },
          { id: '4', url: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=400&fit=crop', type: 'image', caption: 'Завършен проект' }
        ],
        certifications: [
          { id: '1', name: 'Правоспособност до 1000V', issuer: 'БТПП', year: 2010 },
          { id: '2', name: 'КАТ електротехник', issuer: 'НОИ', year: 2015 }
        ],
        contactEmail: 'georgi@electrician.demo',
        contactPhone: '+359 888 333 444',
        whatsapp: '+359888333444',
        city: 'Пловдив',
        neighborhood: 'Тракия',
        serviceArea: ['Пловдив', 'Асеновград', 'Марица'],
        workingHours: defaultWorkingHours,
        socialLinks: [
          { platform: 'facebook', url: 'https://facebook.com/electriciangeorgi' }
        ],
        viewCount: 670,
        contactRequests: 45,
        isPublished: true,
        showPrices: true,
        showPhone: true,
        showEmail: true,
        acceptOnlineBooking: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      'dev-ivan': {
        username: 'dev-ivan',
        displayName: 'Иван Стоянов',
        tagline: 'Full-stack разработчик и IT консултант. React, Node.js, Python. Изграждане на уеб приложения.',
        profession: 'it',
        professionTitle: 'Софтуерен разработчик',
        template: 'tech',
        primaryColor: '#06B6D4',
        coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=400&fit=crop',
        aboutMe: `Здравейте! Аз съм Иван - full-stack разработчик с 8 години опит в софтуерната индустрия.

Технологии:
• Frontend: React, Next.js, TypeScript
• Backend: Node.js, Python, PostgreSQL
• DevOps: AWS, Docker, CI/CD

Създавам модерни уеб и мобилни приложения за бизнеси от всякакъв мащаб. Работя качествено и спазвам срокове!`,
        services: [
          { id: '1', name: 'Уеб приложение', description: 'Изработка на модерно уеб приложение по поръчка', price: 50, priceType: 'hourly', popular: true },
          { id: '2', name: 'Landing page', description: 'Еднолистов сайт с responsive дизайн', price: 300, priceType: 'fixed' },
          { id: '3', name: 'Консултация', description: 'IT консултация и код ревю', price: 40, priceType: 'hourly', duration: '60 мин' },
          { id: '4', name: 'Поддръжка', description: 'Месечна поддръжка на съществуващ проект', price: 200, priceType: 'fixed' }
        ],
        gallery: [
          { id: '1', url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=400&fit=crop', type: 'image', caption: 'Разработка' },
          { id: '2', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=400&fit=crop', type: 'image', caption: 'Код' },
          { id: '3', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=400&fit=crop', type: 'image', caption: 'Работна среда' },
          { id: '4', url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=400&fit=crop', type: 'image', caption: 'Мобилна разработка' }
        ],
        certifications: [
          { id: '1', name: 'AWS Solutions Architect', issuer: 'Amazon Web Services', year: 2021 },
          { id: '2', name: 'Meta Frontend Developer', issuer: 'Meta', year: 2023 }
        ],
        contactEmail: 'ivan@developer.demo',
        contactPhone: '+359 888 444 555',
        whatsapp: '+359888444555',
        city: 'София',
        neighborhood: 'Студентски град',
        serviceArea: ['Дистанционно', 'София'],
        workingHours: defaultWorkingHours,
        socialLinks: [
          { platform: 'github', url: 'https://github.com/devivan' },
          { platform: 'linkedin', url: 'https://linkedin.com/in/devivan' }
        ],
        viewCount: 1100,
        contactRequests: 67,
        isPublished: true,
        showPrices: true,
        showPhone: true,
        showEmail: true,
        acceptOnlineBooking: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      'teacher-anna': {
        username: 'teacher-anna',
        displayName: 'Анна Георгиева',
        tagline: 'Преподавател по английски език с Cambridge сертификат. IELTS, TOEFL подготовка, бизнес английски.',
        profession: 'teaching',
        professionTitle: 'Преподавател по английски',
        template: 'classic',
        primaryColor: '#3B82F6',
        coverImage: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1200&h=400&fit=crop',
        aboutMe: `Здравейте! Аз съм Анна - преподавател по английски език с над 12 години опит.

Предлагам:
• Подготовка за IELTS, TOEFL, Cambridge
• Бизнес английски за професионалисти
• Разговорен английски за всички нива
• Уроци за деца и ученици

Работя с индивидуален подход и гарантирам резултати!`,
        services: [
          { id: '1', name: 'Частен урок', description: 'Индивидуален урок по английски език', price: 25, priceType: 'fixed', duration: '60 мин', popular: true },
          { id: '2', name: 'IELTS подготовка', description: 'Интензивна подготовка за IELTS изпит', price: 35, priceType: 'fixed', duration: '90 мин' },
          { id: '3', name: 'Бизнес английски', description: 'Специализиран курс за професионалисти', price: 40, priceType: 'fixed', duration: '60 мин' },
          { id: '4', name: 'Групови уроци', description: 'Уроци за малки групи до 4 човека', price: 15, priceType: 'fixed', duration: '60 мин' }
        ],
        gallery: [
          { id: '1', url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=400&fit=crop', type: 'image', caption: 'Урок' },
          { id: '2', url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=400&fit=crop', type: 'image', caption: 'Учебни материали' },
          { id: '3', url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=400&fit=crop', type: 'image', caption: 'Онлайн урок' },
          { id: '4', url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=400&fit=crop', type: 'image', caption: 'Групово обучение' }
        ],
        certifications: [
          { id: '1', name: 'CELTA', issuer: 'Cambridge University', year: 2012 },
          { id: '2', name: 'DELTA Module 1', issuer: 'Cambridge University', year: 2017 }
        ],
        contactEmail: 'anna@teacher.demo',
        contactPhone: '+359 888 555 666',
        whatsapp: '+359888555666',
        city: 'Варна',
        neighborhood: 'Център',
        serviceArea: ['Варна', 'Онлайн'],
        workingHours: defaultWorkingHours,
        socialLinks: [
          { platform: 'facebook', url: 'https://facebook.com/teacheranna' },
          { platform: 'youtube', url: 'https://youtube.com/@teacheranna' }
        ],
        viewCount: 520,
        contactRequests: 34,
        isPublished: true,
        showPrices: true,
        showPhone: true,
        showEmail: true,
        acceptOnlineBooking: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      'photo-petar': {
        username: 'photo-petar',
        displayName: 'Петър Николов',
        tagline: 'Професионален фотограф - сватби, събития, портрети, продуктова фотография. 8 години опит.',
        profession: 'photography',
        professionTitle: 'Фотограф',
        template: 'elegant',
        primaryColor: '#7C3AED',
        coverImage: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=1200&h=400&fit=crop',
        aboutMe: `Здравейте! Аз съм Петър - професионален фотограф с 8 години опит.

Специализирам се в:
• Сватбена фотография
• Корпоративни събития
• Портретна фотография
• Продуктова и рекламна фотография

Работя с професионална техника Canon и студийно оборудване. Доставям обработени снимки до 2 седмици.`,
        services: [
          { id: '1', name: 'Фотосесия (2 часа)', description: 'Портретна или семейна фотосесия', price: 100, priceType: 'fixed', popular: true },
          { id: '2', name: 'Сватбен пакет', description: 'Пълно покритие на сватбения ден', price: 600, priceType: 'fixed' },
          { id: '3', name: 'Продуктова снимка', description: 'Професионална снимка на продукт', price: 15, priceType: 'fixed' },
          { id: '4', name: 'Събитие (4 часа)', description: 'Корпоративно събитие или парти', price: 250, priceType: 'fixed' }
        ],
        gallery: [
          { id: '1', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=400&fit=crop', type: 'image', caption: 'Сватба' },
          { id: '2', url: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&h=400&fit=crop', type: 'image', caption: 'Портрет' },
          { id: '3', url: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400&h=400&fit=crop', type: 'image', caption: 'Оборудване' },
          { id: '4', url: 'https://images.unsplash.com/photo-1505739998589-00fc191ce01d?w=400&h=400&fit=crop', type: 'image', caption: 'Събитие' }
        ],
        certifications: [
          { id: '1', name: 'Certified Professional Photographer', issuer: 'Bulgarian Photo Association', year: 2018 }
        ],
        contactEmail: 'petar@photo.demo',
        contactPhone: '+359 888 666 777',
        whatsapp: '+359888666777',
        city: 'Бургас',
        neighborhood: 'Център',
        serviceArea: ['Бургас', 'Слънчев бряг', 'Созопол'],
        workingHours: defaultWorkingHours,
        socialLinks: [
          { platform: 'instagram', url: 'https://instagram.com/photopetar' },
          { platform: 'website', url: 'https://photopetar.demo' }
        ],
        viewCount: 780,
        contactRequests: 42,
        isPublished: true,
        showPrices: true,
        showPhone: true,
        showEmail: true,
        acceptOnlineBooking: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      'cleaning-pro': {
        username: 'cleaning-pro',
        displayName: 'Надежда Колева',
        tagline: 'Професионално почистване на домове и офиси. Основно почистване, след ремонт, редовна поддръжка.',
        profession: 'cleaning',
        professionTitle: 'Специалист почистване',
        template: 'modern',
        primaryColor: '#22C55E',
        coverImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&h=400&fit=crop',
        aboutMe: `Здравейте! Аз съм Надежда и предлагам професионални почистващи услуги вече 6 години.

Услуги:
• Основно почистване на жилища
• Почистване след ремонт
• Редовна поддръжка на офиси
• Почистване на прозорци
• Пране на мека мебел и килими

Работя с екологични препарати. Гарантирам качество и коректност!`,
        services: [
          { id: '1', name: 'Почистване на апартамент', description: 'Основно почистване на 2-стаен апартамент', price: 15, priceType: 'hourly', popular: true },
          { id: '2', name: 'Почистване след ремонт', description: 'Цялостно почистване след строителни дейности', price: 20, priceType: 'hourly' },
          { id: '3', name: 'Пране на диван', description: 'Професионално пране на мека мебел', price: 50, priceType: 'fixed' },
          { id: '4', name: 'Офис почистване', description: 'Редовна поддръжка на офис площи', price: 12, priceType: 'hourly' }
        ],
        gallery: [
          { id: '1', url: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400&h=400&fit=crop', type: 'image', caption: 'Чиста кухня' },
          { id: '2', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=400&fit=crop', type: 'image', caption: 'Баня' },
          { id: '3', url: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=400&h=400&fit=crop', type: 'image', caption: 'Всекидневна' },
          { id: '4', url: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=400&fit=crop', type: 'image', caption: 'Препарати' }
        ],
        certifications: [],
        contactEmail: 'nadejda@cleaning.demo',
        contactPhone: '+359 888 777 888',
        whatsapp: '+359888777888',
        city: 'София',
        neighborhood: 'Младост',
        serviceArea: ['София', 'Околността'],
        workingHours: defaultWorkingHours,
        socialLinks: [
          { platform: 'facebook', url: 'https://facebook.com/cleaningpro' }
        ],
        viewCount: 950,
        contactRequests: 78,
        isPublished: true,
        showPrices: true,
        showPhone: true,
        showEmail: true,
        acceptOnlineBooking: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      'moving-express': {
        username: 'moving-express',
        displayName: 'Транспорт Експрес',
        tagline: 'Хамалски услуги и преместване. Товарен бус, опаковане, монтаж/демонтаж на мебели. Коректност и бързина.',
        profession: 'transport',
        professionTitle: 'Хамалски услуги',
        template: 'bold',
        primaryColor: '#EF4444',
        coverImage: 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=1200&h=400&fit=crop',
        aboutMe: `Здравейте! Ние сме екип "Транспорт Експрес" - професионални хамали с над 10 години опит.

Предлагаме:
• Преместване на апартаменти и офиси
• Транспорт с товарен бус 3.5 тона
• Опаковане и разопаковане
• Монтаж и демонтаж на мебели
• Изхвърляне на стари вещи

Работим бързо, внимателно и на конкурентни цени!`,
        services: [
          { id: '1', name: 'Преместване (до 3 часа)', description: 'Преместване на апартамент в рамките на града', price: 80, priceType: 'fixed', popular: true },
          { id: '2', name: 'Транспорт на час', description: 'Товарен бус с шофьор и 2 хамали', price: 35, priceType: 'hourly' },
          { id: '3', name: 'Опаковане', description: 'Професионално опаковане на вещи', price: 50, priceType: 'fixed' },
          { id: '4', name: 'Изхвърляне на мебели', description: 'Извозване на стари мебели и вещи', price: 60, priceType: 'fixed' }
        ],
        gallery: [
          { id: '1', url: 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=400&h=400&fit=crop', type: 'image', caption: 'Товарен бус' },
          { id: '2', url: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=400&h=400&fit=crop', type: 'image', caption: 'Преместване' },
          { id: '3', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', type: 'image', caption: 'Опаковане' },
          { id: '4', url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop', type: 'image', caption: 'Екип' }
        ],
        certifications: [],
        contactEmail: 'office@transport.demo',
        contactPhone: '+359 888 888 999',
        whatsapp: '+359888888999',
        city: 'София',
        neighborhood: 'Надежда',
        serviceArea: ['София', 'Пловдив', 'Варна', 'Бургас', 'Цяла България'],
        workingHours: defaultWorkingHours,
        socialLinks: [
          { platform: 'facebook', url: 'https://facebook.com/transportexpress' },
          { platform: 'website', url: 'https://transport-express.demo' }
        ],
        viewCount: 1450,
        contactRequests: 134,
        isPublished: true,
        showPrices: true,
        showPhone: true,
        showEmail: true,
        acceptOnlineBooking: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      'dj-alex': {
        username: 'dj-alex',
        displayName: 'DJ Алекс',
        tagline: 'Професионален DJ за сватби, фирмени партита, рождени дни. Собствена техника, светлини, озвучаване.',
        profession: 'music',
        professionTitle: 'DJ & Озвучаване',
        template: 'bold',
        primaryColor: '#8B5CF6',
        coverImage: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=1200&h=400&fit=crop',
        aboutMe: `Здравейте! Аз съм DJ Алекс - професионален диджей с над 12 години опит на българската сцена.

Предлагам:
• DJ услуги за сватби и тържества
• Озвучаване на фирмени събития
• Професионално осветление
• Водещ на програма

Разполагам със собствена техника от висок клас. Правя музикална селекция по вкуса на клиента!`,
        services: [
          { id: '1', name: 'DJ за събитие (4 часа)', description: 'Музикално оформление с професионална техника', price: 200, priceType: 'fixed', popular: true },
          { id: '2', name: 'Сватбен пакет', description: 'Пълен DJ пакет + светлини + водещ', price: 500, priceType: 'fixed' },
          { id: '3', name: 'Корпоративно парти', description: 'Озвучаване и DJ за фирмени събития', price: 350, priceType: 'fixed' },
          { id: '4', name: 'Допълнителен час', description: 'Удължаване на събитието', price: 50, priceType: 'fixed', duration: '60 мин' }
        ],
        gallery: [
          { id: '1', url: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=400&h=400&fit=crop', type: 'image', caption: 'На сцена' },
          { id: '2', url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop', type: 'image', caption: 'Парти' },
          { id: '3', url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop', type: 'image', caption: 'Светлини' },
          { id: '4', url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=400&fit=crop', type: 'image', caption: 'Сватба' }
        ],
        certifications: [],
        contactEmail: 'alex@dj.demo',
        contactPhone: '+359 888 999 000',
        whatsapp: '+359888999000',
        city: 'София',
        neighborhood: 'Център',
        serviceArea: ['София', 'Цяла България'],
        workingHours: defaultWorkingHours,
        socialLinks: [
          { platform: 'instagram', url: 'https://instagram.com/djalex' },
          { platform: 'youtube', url: 'https://youtube.com/@djalex' },
          { platform: 'tiktok', url: 'https://tiktok.com/@djalex' }
        ],
        viewCount: 680,
        contactRequests: 45,
        isPublished: true,
        showPrices: true,
        showPhone: true,
        showEmail: true,
        acceptOnlineBooking: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }

    // Check if we have a specific demo profile for this username
    if (demoProfiles[username]) {
      return demoProfiles[username]
    }

    // Fallback: determine template based on username keywords
    let template: ProfessionalProfile['template'] = 'modern'
    let profession: ProfessionalProfile['profession'] = 'other'
    let professionTitle = 'Професионалист'
    let coverImage = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=400&fit=crop'
    
    const lowerUsername = username.toLowerCase()
    
    if (lowerUsername.includes('fitness') || lowerUsername.includes('gym') || lowerUsername.includes('trainer')) {
      template = 'fitness'
      profession = 'fitness'
      professionTitle = 'Персонален треньор'
      coverImage = 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&h=400&fit=crop'
    } else if (lowerUsername.includes('beauty') || lowerUsername.includes('makeup') || lowerUsername.includes('kozmetik')) {
      template = 'beauty'
      profession = 'beauty'
      professionTitle = 'Козметик'
      coverImage = 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&h=400&fit=crop'
    } else if (lowerUsername.includes('tech') || lowerUsername.includes('dev') || lowerUsername.includes('it')) {
      template = 'tech'
      profession = 'it'
      professionTitle = 'Софтуерен разработчик'
      coverImage = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=400&fit=crop'
    } else if (lowerUsername.includes('electrician') || lowerUsername.includes('repair') || lowerUsername.includes('craft')) {
      template = 'craft'
      profession = 'repairs'
      professionTitle = 'Майстор'
      coverImage = 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&h=400&fit=crop'
    } else if (lowerUsername.includes('photo')) {
      template = 'elegant'
      profession = 'photography'
      professionTitle = 'Фотограф'
      coverImage = 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=1200&h=400&fit=crop'
    } else if (lowerUsername.includes('teacher') || lowerUsername.includes('english')) {
      template = 'classic'
      profession = 'teaching'
      professionTitle = 'Преподавател'
      coverImage = 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1200&h=400&fit=crop'
    } else if (lowerUsername.includes('clean')) {
      template = 'modern'
      profession = 'cleaning'
      professionTitle = 'Почистване'
      coverImage = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&h=400&fit=crop'
    } else if (lowerUsername.includes('transport') || lowerUsername.includes('moving')) {
      template = 'bold'
      profession = 'transport'
      professionTitle = 'Хамалски услуги'
      coverImage = 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=1200&h=400&fit=crop'
    } else if (lowerUsername.includes('dj') || lowerUsername.includes('music')) {
      template = 'bold'
      profession = 'music'
      professionTitle = 'DJ & Музика'
      coverImage = 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=1200&h=400&fit=crop'
    }

    return {
      username,
      displayName: username.charAt(0).toUpperCase() + username.slice(1).replace(/-/g, ' '),
      tagline: 'Професионален изпълнител с богат опит и много доволни клиенти',
      profession,
      professionTitle,
      template,
      primaryColor: profileTemplates.find(t => t.id === template)?.primaryColor,
      coverImage,
      aboutMe: `Здравейте! Аз съм професионалист с богат опит в индустрията.

Специализирам се в предоставянето на качествени услуги на моите клиенти. Работя с индивидуален подход и гарантирам качество.

Свържете се с мен за консултация!`,
      services: [
        { id: '1', name: 'Основна услуга', description: 'Пълен пакет услуги за вашите нужди', price: 50, priceType: 'fixed', duration: '60 мин', popular: true },
        { id: '2', name: 'Консултация', description: 'Професионална консултация и съвети', price: 30, priceType: 'fixed', duration: '45 мин' }
      ],
      gallery: [],
      certifications: [],
      contactEmail: `${username}@rabotim.demo`,
      contactPhone: '+359 888 000 000',
      city: 'София',
      neighborhood: 'Център',
      serviceArea: ['София'],
      workingHours: defaultWorkingHours,
      socialLinks: [],
      viewCount: Math.floor(Math.random() * 500) + 100,
      contactRequests: Math.floor(Math.random() * 50) + 10,
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

  const handleBook = () => {
    if (!profile?.acceptOnlineBooking) {
      toast.error('Този професионалист не приема онлайн резервации')
      return
    }
    setShowBookingModal(true)
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

  const handleOrderArt = () => {
    router.push(`/p/${username}/order`)
  }

  return (
    <>
      {isPreview && (
        <div className="bg-amber-100 dark:bg-amber-900/30 border-b border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-100">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-center gap-2 text-sm font-medium">
            <span>Преглед</span>
            <span className="opacity-75">– профилът не е публичен и не се вижда от други. Активирайте премиум, за да го публикувате.</span>
          </div>
        </div>
      )}
      <TemplateRenderer
        profile={profile}
        onContact={handleContact}
        onShare={handleShare}
        onBook={profile.acceptOnlineBooking ? handleBook : undefined}
        onOrderArt={profile.isArtist ? handleOrderArt : undefined}
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

      {/* Booking Modal */}
      {profile.acceptOnlineBooking && (
        <BookingModal
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          professionalId={professionalId || 'demo-id'}
          professionalUserId={professionalUserId || 'demo-user-id'}
          professionalName={profile.displayName}
          services={profile.services.map(s => ({
            id: s.id,
            name: s.name,
            price: s.price,
            priceType: s.priceType,
            duration: s.duration ? parseInt(s.duration) : 60
          }))}
        />
      )}
    </>
  )
}
