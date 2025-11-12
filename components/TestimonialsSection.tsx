'use client'

import { useState, useEffect } from 'react'
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import OptimizedImage from './OptimizedImage'

interface Testimonial {
  id: string
  name: string
  avatar: string | null
  role: 'task_giver' | 'task_executor'
  rating: number
  text: string
  task: string
  taskCategory?: string | null
  taskLocation?: string | null
  earnings?: string
  timeframe?: string
  verified: boolean
}

// Fallback testimonials if no real data
const fallbackTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Мария Иванова',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    role: 'task_giver',
    rating: 5,
    text: 'Намерих перфектния човек за почистване на апартамента за 10 минути! Платформата е изключително лесна за използване и качеството на работата беше отлично.',
    task: 'Почистване на апартамент',
    timeframe: '10 минути',
    verified: true
  },
  {
    id: '2',
    name: 'Иван Петров',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    role: 'task_executor',
    rating: 5,
    text: 'За няколко часа изкарах 150 лв! Rabotim.com ми помогна да си осигуря допълнителен доход по удобен начин. Препоръчвам на всички!',
    task: 'Ремонт на кухня',
    earnings: '150 лв',
    timeframe: 'няколко часа',
    verified: true
  },
  {
    id: '3',
    name: 'Елена Георгиева',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    role: 'task_executor',
    rating: 5,
    text: 'Като студентка, Rabotim ми дава възможност да работя гъвкаво и да си изкарвам джобни пари. Намирам задачи всеки ден!',
    task: 'Обучение по английски',
    earnings: '200+ лв/седмица',
    timeframe: 'гъвкаво',
    verified: true
  },
  {
    id: '4',
    name: 'Георги Димитров',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    role: 'task_giver',
    rating: 5,
    text: 'Спешно ми трябваше водопроводчик и намерих професионалист за 20 минути. Цените са справедливи и комуникацията е лесна.',
    task: 'Ремонт на течащ кран',
    timeframe: '20 минути',
    verified: true
  },
]

export default function TestimonialsSection() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials)
  const [isLoading, setIsLoading] = useState(true)

  // Load real testimonials from API
  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const response = await fetch('/api/testimonials?limit=6&minRating=4')
        if (response.ok) {
          const result = await response.json()
          if (result.success && result.data && result.data.length > 0) {
            // Transform API data to Testimonial format
            const transformedTestimonials: Testimonial[] = result.data.map((item: any) => ({
              id: item.id,
              name: item.name,
              avatar: item.avatar || null,
              role: 'task_giver' as const, // Default to task_giver, can be determined from context if needed
              rating: item.rating,
              text: item.testimonialText || item.comment || item.title,
              task: item.taskCategory || item.taskLocation || 'Задача',
              taskCategory: item.taskCategory,
              taskLocation: item.taskLocation,
              verified: true
            }))
            setTestimonials(transformedTestimonials)
          } else {
            // Use fallback if no real data
            setTestimonials(fallbackTestimonials)
          }
        } else {
          // Use fallback if API fails
          setTestimonials(fallbackTestimonials)
        }
      } catch (error) {
        console.error('Error loading testimonials:', error)
        // Use fallback on error
        setTestimonials(fallbackTestimonials)
      } finally {
        setIsLoading(false)
      }
    }

    loadTestimonials()
  }, [])

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying || testimonials.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, testimonials.length])

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  const getRoleLabel = (role: 'task_giver' | 'task_executor') => {
    return role === 'task_giver' ? 'Работодател' : 'Изпълнител'
  }

  const getRoleBadgeColor = (role: 'task_giver' | 'task_executor') => {
    return role === 'task_giver' 
      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
      : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
  }

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Какво казват нашите потребители
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Хиляди доволни потребители вече използват Rabotim.com за намиране на работа и изпълнители
          </p>
        </div>

        {/* Carousel */}
        <div className="relative max-w-4xl mx-auto mb-12">
          {/* Main testimonial */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 sm:p-12 relative overflow-hidden">
            {/* Quote icon */}
            <div className="absolute top-6 right-6 opacity-10">
              <Quote size={80} className="text-blue-600" />
            </div>

            {/* Content */}
            <div className="relative z-10">
              {/* User info */}
              <div className="flex items-center gap-4 mb-6">
                {testimonials[currentIndex].avatar ? (
                  <OptimizedImage
                    src={testimonials[currentIndex].avatar}
                    alt={testimonials[currentIndex].name}
                    width={80}
                    height={80}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-blue-100 dark:border-blue-900"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-300 dark:bg-gray-600 border-4 border-blue-100 dark:border-blue-900 flex items-center justify-center text-2xl font-bold text-gray-600 dark:text-gray-300">
                    {testimonials[currentIndex].name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {testimonials[currentIndex].name}
                    </h3>
                    {testimonials[currentIndex].verified && (
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(testimonials[currentIndex].role)}`}>
                      {getRoleLabel(testimonials[currentIndex].role)}
                    </span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={`${
                            i < testimonials[currentIndex].rating
                              ? 'text-yellow-500 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonial text */}
              <blockquote className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                "{testimonials[currentIndex].text}"
              </blockquote>

              {/* Task info */}
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 flex-wrap">
                <span className="font-medium">Задача: {testimonials[currentIndex].task}</span>
                {testimonials[currentIndex].earnings && (
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full font-semibold">
                    💰 {testimonials[currentIndex].earnings}
                  </span>
                )}
                {testimonials[currentIndex].timeframe && (
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full">
                    ⏱️ {testimonials[currentIndex].timeframe}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={goToPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-6 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors z-20"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-6 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors z-20"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          </button>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all ${
                  index === currentIndex
                    ? 'w-8 h-2 bg-blue-600'
                    : 'w-2 h-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                } rounded-full`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
            <div className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              10,000+
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Завършени задачи
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
            <div className="text-3xl sm:text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
              5,000+
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Активни потребители
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
            <div className="text-3xl sm:text-4xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
              4.8
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Среден рейтинг
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
            <div className="text-3xl sm:text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              98%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Удовлетворени клиенти
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => router.push('/post-task')}
            className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
          >
            📝 Публикувай обява безплатно
          </button>
          <button
            onClick={() => router.push('/tasks')}
            className="w-full sm:w-auto px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
          >
            💰 Започни да печелиш днес
          </button>
        </div>

        {/* Trust badges */}
        <div className="mt-12 flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span>100% Безплатна регистрация</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span>Без скрити такси</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span>Верифицирани потребители</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span>Сигурна платформа</span>
          </div>
        </div>
      </div>
    </section>
  )
}


