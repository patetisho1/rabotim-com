'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { 
  Search, Users, Star, CheckCircle, ArrowRight, MapPin, 
  Briefcase, Home, Wrench, Car, BookOpen, Leaf
} from 'lucide-react'
import OptimizedImage from '@/components/OptimizedImage'
import { LocalBusinessStructuredData, FAQStructuredData } from '@/components/StructuredData'

// Lazy load testimonials
const TestimonialsSection = dynamic(() => import('@/components/TestimonialsSection'), {
  loading: () => (
    <div className="py-12 md:py-20 bg-gray-50 animate-pulse">
      <div className="max-w-6xl mx-auto px-4">
        <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-xl p-6 h-48"></div>
          ))}
        </div>
      </div>
    </div>
  ),
  ssr: false
})

export default function HomePage() {
  const router = useRouter()
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('Всички')
  const [homepageTasks, setHomepageTasks] = useState<any[]>([])
  const [isLoadingTasks, setIsLoadingTasks] = useState(true)
  const [stats, setStats] = useState({ users: 250, completed: 150 })

  // Rotating task text - simplified to 8 items
  const tasks = [
    "да почисти апартамента",
    "да направи ремонт", 
    "да разходи кучето",
    "да достави пратка",
    "да сглоби мебели",
    "да ми направи сайт",
    "да обучи детето",
    "да направи снимки"
  ]

  const categories = [
    { name: 'Всички', icon: Briefcase },
    { name: 'Почистване', icon: Home },
    { name: 'Ремонт', icon: Wrench },
    { name: 'Доставка', icon: Car },
    { name: 'Градинарство', icon: Leaf },
    { name: 'Обучение', icon: BookOpen }
  ]

  // Load stats
  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetch('/api/stats')
        if (response.ok) {
          const result = await response.json()
          if (result.success && result.data) {
            setStats({
              users: Math.max(result.data.users || 0, 250),
              completed: Math.max(result.data.completed || 0, 150)
            })
          }
        }
      } catch (error) {
        // Keep default stats
      }
    }
    loadStats()
  }, [])

  // Load tasks from API
  useEffect(() => {
    const loadTasks = async () => {
      setIsLoadingTasks(true)
      try {
        const response = await fetch('/api/tasks/mixed?limit=12')
        if (response.ok) {
          const data = await response.json()
          setHomepageTasks(data.tasks || [])
        }
      } catch (error) {
        console.error('Error loading tasks:', error)
      } finally {
        setIsLoadingTasks(false)
      }
    }
    loadTasks()
  }, [])

  // Rotate task text
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTaskIndex((prev) => (prev + 1) % tasks.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [tasks.length])

  // Filter tasks by category
  const filteredTasks = useMemo(() => {
    if (selectedCategory === 'Всички') return homepageTasks
    return homepageTasks.filter((task: any) => task.category === selectedCategory)
  }, [selectedCategory, homepageTasks])

  return (
    <div className="min-h-screen bg-white">
      <main>
        {/* Hero Section */}
        <section 
          className="relative text-white py-16 md:py-28 overflow-hidden"
          style={{
            backgroundImage: `url('/hero-image-dark.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
                Търся някой... 🚀
              </h1>
              
              <div className="text-lg sm:text-xl md:text-2xl text-blue-200 mb-4 h-8 flex items-center">
                <span className="transition-all duration-500">
                  {tasks[currentTaskIndex]}
                </span>
              </div>
              
              <p className="text-base md:text-lg text-gray-300 mb-8">
                Намери точния човек за твоята задача.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md sm:max-w-none">
                <button
                  onClick={() => router.push('/post-task')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 sm:py-4 rounded-full font-semibold text-base transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  Публикувай обява безплатно
                  <ArrowRight size={18} />
                </button>
                <button
                  onClick={() => router.push('/register')}
                  className="bg-white hover:bg-gray-100 text-blue-700 px-6 py-3 sm:py-4 rounded-full font-semibold text-base transition-all shadow-lg"
                >
                  Стани изпълнител
                </button>
              </div>
              
              <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm md:text-base">
                <span className="flex items-center gap-2">
                  <Users size={18} />
                  {stats.users}+ клиенти
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle size={18} />
                  {stats.completed}+ задачи
                </span>
                <span className="flex items-center gap-2">
                  <Star size={18} className="fill-current" />
                  4.8★ рейтинг
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works - Simplified */}
        <section className="py-12 md:py-20 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-10">
              Как работи?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Опишете задачата</h3>
                <p className="text-gray-600 text-sm">Какво ви е необходимо, кога и къде</p>
              </div>
              
              <div className="text-center">
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Получете оферти</h3>
                <p className="text-gray-600 text-sm">Изпълнители ще ви изпратят предложения</p>
              </div>
              
              <div className="text-center">
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Изберете най-добрия</h3>
                <p className="text-gray-600 text-sm">Сравнете рейтинги и изберете</p>
              </div>
            </div>
            
            <div className="text-center mt-10">
              <button 
                onClick={() => router.push('/post-task')}
                className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-full hover:bg-blue-700 transition-colors"
              >
                Публикувай обява безплатно
              </button>
            </div>
          </div>
        </section>

        {/* Become a Tasker */}
        <section className="py-12 md:py-20 px-4 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Печели с уменията си
                </h2>
                <p className="text-gray-600 mb-6">
                  Станете изпълнител и печелете пари по свой график.
                </p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Работете когато искате</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Избирайте задачите сами</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Печелете допълнително</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => router.push('/register')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors"
                >
                  Станете изпълнител
                </button>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-bold mb-2">Средна печалба</h3>
                <p className="text-3xl font-bold mb-2">500-2000 €</p>
                <p className="text-blue-100 text-sm">на месец за активни изпълнители</p>
              </div>
            </div>
          </div>
        </section>

        {/* Active Tasks */}
        <section className="py-12 md:py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Активни обяви
              </h2>
              <p className="text-gray-600">
                Намерете задача според вашите умения
              </p>
            </div>
            
            {/* Category Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat.name
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <cat.icon size={16} />
                  {cat.name}
                </button>
              ))}
            </div>
            
            {/* Tasks Grid */}
            {isLoadingTasks ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="bg-gray-100 rounded-xl h-64 animate-pulse"></div>
                ))}
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">Няма задачи в тази категория.</p>
                <button
                  onClick={() => router.push('/post-task')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Публикувай първата
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTasks.slice(0, 6).map((task: any) => (
                  <Link
                    key={task.id}
                    href={task.isDemo ? `/tasks?category=${encodeURIComponent(task.category)}` : `/task/${task.id}`}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group"
                  >
                    <div className="h-32 relative">
                      <OptimizedImage
                        src={task.image}
                        alt={task.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute top-2 right-2">
                        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                          {task.category}
                        </span>
                      </div>
                      {task.isDemo && (
                        <div className="absolute top-2 left-2">
                          <span className="bg-gray-700 text-white text-xs px-2 py-1 rounded-full">
                            Демо
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {task.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {task.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <MapPin size={14} />
                          <span className="truncate max-w-[120px]">{task.location}</span>
                        </div>
                        <div className="font-bold text-green-600">
                          {task.priceType === 'hourly' ? `${task.price} €/час` : `${task.price} €`}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            
            <div className="text-center mt-8">
              <Link 
                href="/tasks" 
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors"
              >
                Вижте всички обяви
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <TestimonialsSection />
      </main>

      {/* Structured Data */}
      <LocalBusinessStructuredData />
      <FAQStructuredData faqs={[
        {
          question: 'Как работи Rabotim.com?',
          answer: 'Rabotim.com е платформа за намиране на почасова работа и изпълнители. Публикувате задача, получавате оферти и избирате най-подходящия.'
        },
        {
          question: 'Колко струва използването на платформата?',
          answer: 'Регистрацията и публикуването на задачи е напълно безплатно.'
        },
        {
          question: 'В кои градове работи Rabotim.com?',
          answer: 'Rabotim.com работи в цяла България - София, Пловдив, Варна, Бургас и всички други градове.'
        }
      ]} />
    </div>
  )
}
