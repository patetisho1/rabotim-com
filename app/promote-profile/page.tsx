'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Megaphone, 
  TrendingUp, 
  Users, 
  Target, 
  DollarSign, 
  CheckCircle, 
  ArrowRight,
  Copy,
  Check,
  ExternalLink,
  Lightbulb,
  BarChart3,
  Globe,
  Facebook,
  Search
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'
import ShareButtons from '@/components/ShareButtons'

export default function PromoteProfilePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'google' | 'facebook' | 'tips'>('google')

  const profileUrl = user 
    ? `${typeof window !== 'undefined' ? window.location.origin : 'https://rabotim.com'}/user/${user.id}`
    : ''

  const utmProfileUrl = user
    ? `${profileUrl}?utm_source=ad&utm_medium=paid&utm_campaign=profile`
    : ''

  const handleCopyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success('Линкът е копиран!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Грешка при копиране')
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <Megaphone className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Рекламирай профила си
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Влезте в акаунта си, за да получите персонализиран линк за реклама.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Вход в акаунта
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => router.back()}
              className="text-white/80 hover:text-white transition-colors"
            >
              ← Назад
            </button>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 rounded-full p-3">
              <Megaphone size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Рекламирай профила си</h1>
              <p className="text-white/80">Достигнете до повече клиенти с платена реклама</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Your Profile Link */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Globe className="text-blue-600" />
            Вашият линк за реклама
          </h2>
          
          <div className="space-y-4">
            {/* Standard link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Стандартен линк към профила:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={profileUrl}
                  className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-mono"
                />
                <button
                  onClick={() => handleCopyLink(profileUrl)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  Копирай
                </button>
              </div>
            </div>

            {/* UTM link for tracking */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Линк с проследяване (препоръчително за реклами):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={utmProfileUrl}
                  className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-mono"
                />
                <button
                  onClick={() => handleCopyLink(utmProfileUrl)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  Копирай
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                UTM параметрите позволяват проследяване на посещенията от рекламите
              </p>
            </div>
          </div>

          {/* Quick share */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <ShareButtons
              url={profileUrl}
              title={`Професионален изпълнител в Rabotim.com - ${user.user_metadata?.full_name || 'Вижте профила ми'}`}
              description="Търсите надежден изпълнител? Свържете се с мен!"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('google')}
                className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 ${
                  activeTab === 'google'
                    ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <Search size={18} />
                Google Ads
              </button>
              <button
                onClick={() => setActiveTab('facebook')}
                className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 ${
                  activeTab === 'facebook'
                    ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <Facebook size={18} />
                Facebook Ads
              </button>
              <button
                onClick={() => setActiveTab('tips')}
                className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 ${
                  activeTab === 'tips'
                    ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <Lightbulb size={18} />
                Съвети
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Google Ads Tab */}
            {activeTab === 'google' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Как да рекламирате в Google Ads
                  </h3>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                        1
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">Създайте Google Ads акаунт</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Отидете на <a href="https://ads.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">ads.google.com <ExternalLink size={12} /></a> и създайте безплатен акаунт.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                        2
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">Създайте нова кампания</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Изберете цел "Трафик към уебсайт" и въведете вашия профилен линк.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                        3
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">Изберете ключови думи</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Добавете ключови думи като: "майстор София", "почистване апартамент", "ремонт дома" и др.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                        4
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">Задайте бюджет</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Започнете с малък дневен бюджет от 5-10 € и увеличете при добри резултати.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 dark:text-green-200 mb-2 flex items-center gap-2">
                    <Target size={18} />
                    Препоръчителни ключови думи
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {['майстор', 'почистване', 'ремонт', 'градинар', 'монтаж', 'пренасяне', 'доставка'].map(keyword => (
                      <span key={keyword} className="px-3 py-1 bg-green-100 dark:bg-green-800/30 text-green-800 dark:text-green-200 text-sm rounded-full">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Facebook Ads Tab */}
            {activeTab === 'facebook' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Как да рекламирате във Facebook и Instagram
                  </h3>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                        1
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">Отворете Meta Business Suite</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Отидете на <a href="https://business.facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">business.facebook.com <ExternalLink size={12} /></a> и създайте бизнес акаунт.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                        2
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">Създайте реклама</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Изберете цел "Трафик" и въведете вашия профилен линк като дестинация.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                        3
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">Насочете аудиторията</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Таргетирайте по локация (вашия град), възраст (25-55) и интереси (собственици на имоти, ремонти).
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                        4
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">Създайте атрактивна реклама</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Използвайте снимки от вашата работа и опишете услугите си накратко.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                  <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2 flex items-center gap-2">
                    <Users size={18} />
                    Препоръчителна аудитория
                  </h4>
                  <ul className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
                    <li>• Възраст: 25-55 години</li>
                    <li>• Локация: Вашият град + 20 км</li>
                    <li>• Интереси: Дом и градина, Ремонти, Недвижими имоти</li>
                    <li>• Поведение: Собственици на имоти</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Tips Tab */}
            {activeTab === 'tips' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Съвети за успешна реклама
                </h3>

                <div className="grid gap-4">
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2 flex items-center gap-2">
                      <CheckCircle size={18} />
                      Попълнете профила изцяло
                    </h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      Добавете снимка, описание, умения и портфолио. Пълният профил привлича повече клиенти.
                    </p>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
                      <BarChart3 size={18} />
                      Започнете с малък бюджет
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Започнете с 5-10 € на ден и увеличете при добри резултати. Тествайте различни аудитории.
                    </p>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <h4 className="font-medium text-green-800 dark:text-green-200 mb-2 flex items-center gap-2">
                      <TrendingUp size={18} />
                      Събирайте отзиви
                    </h4>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Помолете доволните клиенти за отзиви. Профилите с добър рейтинг конвертират по-добре.
                    </p>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                    <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2 flex items-center gap-2">
                      <Target size={18} />
                      Таргетирайте локално
                    </h4>
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      Насочете рекламите към вашия град или район. Локалните клиенти са най-вероятни да ви наемат.
                    </p>
                  </div>
                </div>

                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                    📊 Очаквани резултати
                  </h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">100-500</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">показвания/ден</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">5-20</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">клика/ден</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-purple-600">1-5</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">запитвания/ден</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">* При бюджет от 10 €/ден. Резултатите може да варират.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Искате да подобрите профила си преди да рекламирате?
          </p>
          <button
            onClick={() => router.push('/profile')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            Редактирай профила
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}


