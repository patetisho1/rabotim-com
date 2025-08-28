'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageCircle,
  ArrowRight,
  Send,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

export default function ContactPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitStatus('success')
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      })
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle')
      }, 5000)
    }, 2000)
  }

  const contactInfo = [
    {
      title: 'Имейл',
      value: 'info@rabotim.com',
      icon: <Mail size={24} className="text-blue-600" />,
      description: 'Отговоряме в рамките на 24 часа'
    },
    {
      title: 'Телефон',
      value: '+359 888 123 456',
      icon: <Phone size={24} className="text-green-600" />,
      description: 'Понеделник - Петък, 9:00 - 18:00'
    },
    {
      title: 'Адрес',
      value: 'София, ул. "Граф Игнатиев" 15',
      icon: <MapPin size={24} className="text-purple-600" />,
      description: 'Централна София, близо до НДК'
    }
  ]

  const faqs = [
    {
      question: 'Как мога да публикувам задача?',
      answer: 'Просто се регистрирайте и следвайте стъпките в нашия wizard. Процесът отнема само няколко минути.'
    },
    {
      question: 'Колко струва да използвам платформата?',
      answer: 'Публикуването на задачи е напълно безплатно. Ние не удържаме никакви такси от транзакциите.'
    },
    {
      question: 'Как се гарантира качеството на работата?',
      answer: 'Всички изпълнители са проверени и имат рейтинги от предишни клиенти. Препоръчваме ви да прегледате профилите преди да изберете.'
    },
    {
      question: 'Мога ли да отменя задачата?',
      answer: 'Да, можете да отменяте задачата преди да изберете изпълнител без никакви такси.'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Свържете се с нас
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-4xl mx-auto">
              Имате въпроси или нужда от помощ? Ние сме тук, за да ви помогнем
            </p>
            <div className="flex items-center justify-center gap-8 text-blue-100">
              <div className="flex items-center gap-2">
                <Clock size={20} />
                <span>24/7 поддръжка</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle size={20} />
                <span>Бърз отговор</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={20} />
                <span>Професионална помощ</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Как да се свържете с нас
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Изберете най-удобния за вас начин за връзка
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactInfo.map((info, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex justify-center mb-6">
                  {info.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {info.title}
                </h3>
                <p className="text-lg text-blue-600 font-semibold mb-3">
                  {info.value}
                </p>
                <p className="text-gray-600">
                  {info.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Изпратете ни съобщение
              </h2>
              <p className="text-gray-600 mb-8">
                Попълнете формата по-долу и ние ще се свържем с вас възможно най-скоро
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Вашето име *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Въведете вашето име"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Имейл адрес *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Тема *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Изберете тема</option>
                    <option value="general">Общ въпрос</option>
                    <option value="support">Техническа поддръжка</option>
                    <option value="billing">Въпроси за плащания</option>
                    <option value="partnership">Партньорство</option>
                    <option value="feedback">Обратна връзка</option>
                    <option value="other">Друго</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Съобщение *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Опишете вашия въпрос или проблем..."
                  />
                </div>

                {submitStatus === 'success' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                    <CheckCircle size={20} className="text-green-600" />
                    <p className="text-green-800">Съобщението е изпратено успешно! Ще се свържем с вас скоро.</p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                    <AlertCircle size={20} className="text-red-600" />
                    <p className="text-red-800">Възникна грешка при изпращането. Моля, опитайте отново.</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Изпращане...
                    </>
                  ) : (
                    <>
                      Изпрати съобщение
                      <Send size={20} />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Info */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Често задавани въпроси
              </h3>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 pb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {faq.question}
                    </h4>
                    <p className="text-gray-600">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-6">
                <h4 className="font-semibold text-gray-900 mb-4">
                  Нужна ви е спешна помощ?
                </h4>
                <p className="text-gray-600 mb-4">
                  За спешни въпроси можете да се обадите директно на нашия телефон
                </p>
                <div className="flex items-center gap-2 text-blue-600 font-semibold">
                  <Phone size={20} />
                  <span>+359 888 123 456</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Намерете ни
            </h2>
            <p className="text-gray-600">
              Нашето офис се намира в центъра на София
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="h-96 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
              <div className="text-center">
                <MapPin size={64} className="text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Rabotim.com
                </h3>
                <p className="text-gray-600">
                  ул. "Граф Игнатиев" 15<br />
                  София 1000, България
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Готови сте да започнете?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Присъединете се към нашата общност и започнете да използвате платформата
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/post-task')}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-2"
            >
              Публикувайте първата си задача
              <ArrowRight size={20} />
            </button>
            <button
              onClick={() => router.push('/register')}
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Станете изпълнител
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

