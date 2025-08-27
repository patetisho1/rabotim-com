'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Users, 
  Star, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  Heart,
  Shield,
  Globe,
  Award,
  TrendingUp,
  MessageCircle,
  DollarSign,
  MapPin,
  Calendar,
  Briefcase,
  Zap,
  Coffee,
  Home,
  Smartphone
} from 'lucide-react'

export default function CareersPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'Всички позиции' },
    { id: 'engineering', name: 'Инженеринг' },
    { id: 'marketing', name: 'Маркетинг' },
    { id: 'operations', name: 'Операции' },
    { id: 'design', name: 'Дизайн' }
  ]

  const benefits = [
    {
      title: 'Гъвкаво работно време',
      description: 'Работете когато и където ви е удобно',
      icon: <Clock size={32} className="text-blue-600" />
    },
    {
      title: 'Отдалечена работа',
      description: 'Възможност за работа от вкъщи',
      icon: <Home size={32} className="text-green-600" />
    },
    {
      title: 'Конкурентни заплати',
      description: 'Възнаграждение според пазарните стандарти',
      icon: <DollarSign size={32} className="text-yellow-600" />
    },
    {
      title: 'Професионално развитие',
      description: 'Курсове, обучения и възможности за растеж',
      icon: <TrendingUp size={32} className="text-purple-600" />
    },
    {
      title: 'Здравна застраховка',
      description: 'Пълна здравна застраховка за вас и семейството',
      icon: <Heart size={32} className="text-red-600" />
    },
    {
      title: 'Модерна техника',
      description: 'Най-новите устройства за работа',
      icon: <Smartphone size={32} className="text-indigo-600" />
    }
  ]

  const jobs = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      category: 'engineering',
      location: 'София / Отдалечено',
      type: 'Пълен работен ден',
      experience: '3+ години',
      description: 'Търсим опитен Frontend разработчик за да ни помогне да изградим най-добрата платформа за свързване на хора.',
      requirements: [
        'Дълбоко познаване на React/Next.js',
        'Опит с TypeScript и Tailwind CSS',
        'Разбиране на UX/UI принципи',
        'Опит с REST APIs и GraphQL'
      ],
      responsibilities: [
        'Разработка на нови функционалности',
        'Оптимизация на производителността',
        'Работа в екип с дизайнери и backend разработчици',
        'Code review и менторство'
      ]
    },
    {
      id: 2,
      title: 'Product Manager',
      category: 'operations',
      location: 'София',
      type: 'Пълен работен ден',
      experience: '2+ години',
      description: 'Търсим Product Manager, който да ни помогне да развием продукта и да подобрим потребителското изживяване.',
      requirements: [
        'Опит в product management',
        'Аналитични умения',
        'Опит с Agile методологии',
        'Отлично комуникативни умения'
      ],
      responsibilities: [
        'Дефиниране на product strategy',
        'Работа с cross-functional екипи',
        'Анализ на потребителски данни',
        'Приоритизиране на features'
      ]
    },
    {
      id: 3,
      title: 'UX/UI Designer',
      category: 'design',
      location: 'София / Отдалечено',
      type: 'Пълен работен ден',
      experience: '2+ години',
      description: 'Търсим креативен дизайнер, който да създава интуитивни и красиви интерфейси за нашите потребители.',
      requirements: [
        'Опит с Figma и други дизайн инструменти',
        'Познаване на UX принципи',
        'Портфолио с проекти',
        'Опит с дизайн системи'
      ],
      responsibilities: [
        'Създаване на wireframes и прототипи',
        'Дизайн на нови функционалности',
        'Работа с development екипа',
        'Провеждане на user research'
      ]
    },
    {
      id: 4,
      title: 'Marketing Specialist',
      category: 'marketing',
      location: 'София',
      type: 'Пълен работен ден',
      experience: '1+ година',
      description: 'Търсим маркетинг специалист, който да ни помогне да достигнем до повече хора и да растем.',
      requirements: [
        'Опит в дигитален маркетинг',
        'Познаване на социални мрежи',
        'Опит с Google Ads и Facebook Ads',
        'Аналитични умения'
      ],
      responsibilities: [
        'Управление на рекламни кампании',
        'Създаване на маркетинг съдържание',
        'Анализ на резултатите',
        'Работа с creative екипа'
      ]
    }
  ]

  const filteredJobs = selectedCategory === 'all' 
    ? jobs 
    : jobs.filter(job => job.category === selectedCategory)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Присъединете се към нашия екип
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-4xl mx-auto">
              Помогнете ни да изградим бъдещето на работата и да свържем хората по нов начин
            </p>
            <div className="flex items-center justify-center gap-8 text-blue-100">
              <div className="flex items-center gap-2">
                <Users size={20} />
                <span>50+ служители</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={20} />
                <span>София, България</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap size={20} />
                <span>Бързо растеща компания</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Защо да работите с нас?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Създаваме среда, в която можете да расте и да се развивате
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex justify-center mb-6">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Jobs Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Отворени позиции
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Намерете позицията, която отговаря на вашите умения и амбиции
            </p>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-full font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            {filteredJobs.map((job) => (
              <div key={job.id} className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase size={16} />
                        <span>{job.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>{job.experience} опит</span>
                      </div>
                    </div>
                  </div>
                  <button className="mt-4 lg:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2">
                    Кандидатствайте
                    <ArrowRight size={20} />
                  </button>
                </div>

                <p className="text-gray-600 mb-6">
                  {job.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Изисквания:</h4>
                    <ul className="space-y-2">
                      {job.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle size={16} className="text-green-600 mt-1 flex-shrink-0" />
                          <span className="text-gray-600">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Отговорности:</h4>
                    <ul className="space-y-2">
                      {job.responsibilities.map((resp, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle size={16} className="text-green-600 mt-1 flex-shrink-0" />
                          <span className="text-gray-600">{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase size={48} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Няма отворени позиции в тази категория
              </h3>
              <p className="text-gray-600">
                Проверете отново по-късно или се свържете с нас за спонтанна кандидатура
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Culture Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Нашата култура
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                В Rabotim.com вярваме в създаването на среда, в която всеки може да процъфти. 
                Ценим иновациите, сътрудничеството и постоянния растеж.
              </p>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                Нашият екип е разнообразен, талантлив и страстен за това, което прави. 
                Заедно изграждаме продукт, който променя живота на хората.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Coffee size={20} className="text-blue-600" />
                  <span className="text-gray-600">Неформална среда</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={20} className="text-green-600" />
                  <span className="text-gray-600">Отличен екип</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-green-100 rounded-3xl p-8">
                <div className="text-center">
                  <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart size={48} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Присъединете се към нас
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Бъдете част от екипа, който изгражда бъдещето на работата
                  </p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                    Изпратете CV
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Не намерихте подходяща позиция?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Изпратете спонтанна кандидатура и ще се свържем с вас, когато имаме отворени позиции
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-2">
              Изпратете спонтанна кандидатура
              <ArrowRight size={20} />
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
              Свържете се с нас
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
