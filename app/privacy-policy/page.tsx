'use client'

import { Shield, Eye, Lock, Database, Mail, Trash2, Globe, FileText } from 'lucide-react'
import Link from 'next/link'

export default function PrivacyPolicyPage() {
  const lastUpdated = '27 ноември 2024'

  const sections = [
    {
      id: 'collection',
      title: '1. Събиране на информация',
      icon: <Database size={24} className="text-blue-600" />,
      content: `
        Събираме следните видове информация:
        
        **Лична информация при регистрация:**
        - Име и фамилия
        - Имейл адрес
        - Телефонен номер
        - Профилна снимка (по избор)
        - Локация (град)
        
        **Информация за използване:**
        - IP адрес
        - Тип браузър и устройство
        - Страници, които посещавате
        - Време на посещение
        - Действия в платформата
        
        **Информация от трети страни:**
        - При вход чрез Facebook или Google, получаваме базова профилна информация
      `
    },
    {
      id: 'use',
      title: '2. Използване на информацията',
      icon: <Eye size={24} className="text-green-600" />,
      content: `
        Използваме вашата информация за:
        
        - **Предоставяне на услугите** - създаване и управление на акаунти, обработка на задачи и кандидатури
        - **Комуникация** - изпращане на известия, отговори на запитвания, маркетингови съобщения (с ваше съгласие)
        - **Подобряване на платформата** - анализ на използването, отстраняване на проблеми, разработка на нови функции
        - **Сигурност** - предотвратяване на измами и злоупотреби
        - **Правни задължения** - спазване на законови изисквания
      `
    },
    {
      id: 'sharing',
      title: '3. Споделяне на информация',
      icon: <Globe size={24} className="text-purple-600" />,
      content: `
        **Споделяме информация с:**
        
        - **Други потребители** - при кандидатстване за задача, публикуващият вижда вашето име, рейтинг и профил
        - **Доставчици на услуги** - хостинг (Vercel), база данни (Supabase), плащания (Stripe)
        - **Правоприлагащи органи** - при законово изискване
        
        **НЕ продаваме** вашата лична информация на трети страни за маркетингови цели.
      `
    },
    {
      id: 'cookies',
      title: '4. Бисквитки (Cookies)',
      icon: <FileText size={24} className="text-orange-600" />,
      content: `
        Използваме бисквитки за:
        
        - **Необходими** - за вход и сесии
        - **Функционални** - запомняне на предпочитания
        - **Аналитични** - разбиране как използвате сайта
        - **Маркетингови** - персонализирани реклами (с ваше съгласие)
        
        Можете да управлявате бисквитките чрез настройките на браузъра си.
      `
    },
    {
      id: 'security',
      title: '5. Сигурност на данните',
      icon: <Lock size={24} className="text-red-600" />,
      content: `
        Прилагаме следните мерки за сигурност:
        
        - **Криптиране** - SSL/TLS за всички комуникации
        - **Хеширане на пароли** - паролите се съхраняват криптирани
        - **Контрол на достъпа** - само оторизиран персонал има достъп
        - **Редовни одити** - проверки за уязвимости
        - **Row Level Security** - защита на ниво база данни
        
        Въпреки мерките, никоя система не е 100% сигурна. Моля, пазете паролата си.
      `
    },
    {
      id: 'rights',
      title: '6. Вашите права (GDPR)',
      icon: <Shield size={24} className="text-indigo-600" />,
      content: `
        Имате право на:
        
        - **Достъп** - да получите копие на вашите данни
        - **Коригиране** - да поправите неточна информация
        - **Изтриване** - да поискате изтриване на данните ("право да бъдеш забравен")
        - **Преносимост** - да получите данните в машинночетим формат
        - **Възражение** - да възразите срещу обработката за маркетингови цели
        - **Оттегляне на съгласие** - по всяко време
        
        За упражняване на тези права, свържете се с нас на privacy@rabotim.com
      `
    },
    {
      id: 'retention',
      title: '7. Съхранение на данни',
      icon: <Database size={24} className="text-teal-600" />,
      content: `
        Съхраняваме данните:
        
        - **Активни акаунти** - докато акаунтът е активен
        - **Неактивни акаунти** - 2 години след последната активност
        - **След изтриване** - до 30 дни в резервни копия
        - **Правни задължения** - според законовите изисквания (напр. счетоводни документи - 10 години)
      `
    },
    {
      id: 'contact',
      title: '8. Контакт',
      icon: <Mail size={24} className="text-pink-600" />,
      content: `
        За въпроси относно поверителността:
        
        **Rabotim.com**
        Email: privacy@rabotim.com
        Адрес: София, България
        
        **Длъжностно лице по защита на данните (DPO):**
        Email: dpo@rabotim.com
      `
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-6">
              <Shield size={32} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Политика за поверителност
            </h1>
            <p className="text-xl text-blue-100 mb-4">
              Вашата поверителност е важна за нас
            </p>
            <p className="text-sm text-blue-200">
              Последна актуализация: {lastUpdated}
            </p>
          </div>
        </div>
      </div>

      {/* Introduction */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 mb-8">
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
            Rabotim.com ("ние", "нас", "наш") се ангажира да защитава вашата поверителност. 
            Тази политика обяснява как събираме, използваме и защитаваме вашата лична информация 
            когато използвате нашата платформа.
          </p>
        </div>

        {/* Table of Contents */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Съдържание</h2>
          <nav className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1"
              >
                {section.icon}
                <span>{section.title}</span>
              </a>
            ))}
          </nav>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section) => (
            <div
              key={section.id}
              id={section.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 scroll-mt-24"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  {section.icon}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {section.title}
                </h2>
              </div>
              <div className="prose dark:prose-invert max-w-none">
                {section.content.split('\n').map((paragraph, idx) => {
                  if (paragraph.trim().startsWith('**') && paragraph.trim().endsWith('**')) {
                    return (
                      <h3 key={idx} className="text-lg font-semibold text-gray-900 dark:text-white mt-4 mb-2">
                        {paragraph.replace(/\*\*/g, '')}
                      </h3>
                    )
                  }
                  if (paragraph.trim().startsWith('-')) {
                    return (
                      <li key={idx} className="text-gray-700 dark:text-gray-300 ml-4">
                        {paragraph.replace(/^-\s*/, '').replace(/\*\*/g, '')}
                      </li>
                    )
                  }
                  if (paragraph.trim()) {
                    return (
                      <p key={idx} className="text-gray-700 dark:text-gray-300 mb-2">
                        {paragraph.replace(/\*\*/g, '')}
                      </p>
                    )
                  }
                  return null
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Links */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Имате въпроси? Свържете се с нас.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Свържете се с нас
            </Link>
            <Link
              href="/terms-of-service"
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Условия за ползване
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

