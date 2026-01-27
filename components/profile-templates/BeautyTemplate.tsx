'use client'

import { useState } from 'react'
import { 
  MapPin, Phone, Mail, Clock, Star, Heart, Share2, 
  MessageCircle, Calendar, ChevronRight, Sparkles
} from 'lucide-react'
import { TemplateProps } from './TemplateRenderer'

const dayTranslations: Record<string, string> = {
  monday: 'Понеделник', tuesday: 'Вторник', wednesday: 'Сряда',
  thursday: 'Четвъртък', friday: 'Петък', saturday: 'Събота', sunday: 'Неделя'
}

export default function BeautyTemplate({ 
  profile, templateConfig, professionConfig, isPreview,
  onContact, onShare, onBook, userRating, reviewCount 
}: TemplateProps) {
  const [activeSection, setActiveSection] = useState<'services' | 'gallery' | 'about' | 'contact'>('services')
  const primaryColor = profile.primaryColor || '#F472B6' // Pink

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-rose-50">
      {/* Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-pink-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <div className="relative">
        {/* Cover */}
        <div 
          className="h-64 md:h-80"
          style={{
            backgroundImage: profile.coverImage 
              ? `linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(255,255,255,0.9)), url(${profile.coverImage})`
              : `linear-gradient(135deg, ${primaryColor}30, #fff5f8)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Decorative circles */}
          <div className="absolute top-4 left-4 w-16 h-16 border-2 rounded-full opacity-20" style={{ borderColor: primaryColor }}></div>
          <div className="absolute top-8 left-8 w-8 h-8 border rounded-full opacity-30" style={{ borderColor: primaryColor }}></div>
        </div>

        {/* Profile Card */}
        <div className="max-w-3xl mx-auto px-4 -mt-32 relative z-10">
          <div className="bg-white rounded-3xl shadow-xl p-8 text-center border border-pink-100">
            {/* Avatar with decorative ring */}
            <div className="relative inline-block">
              <div 
                className="w-36 h-36 rounded-full mx-auto flex items-center justify-center text-6xl border-4 shadow-lg -mt-24"
                style={{ 
                  backgroundColor: `${primaryColor}10`,
                  borderColor: 'white'
                }}
              >
                {professionConfig?.icon || '💅'}
              </div>
              <div 
                className="absolute inset-0 -m-2 rounded-full border-2 border-dashed opacity-50 animate-spin-slow"
                style={{ 
                  borderColor: primaryColor,
                  animation: 'spin 20s linear infinite'
                }}
              ></div>
            </div>

            {/* Name & Title */}
            <h1 
              className="text-3xl md:text-4xl font-serif mt-6 mb-2"
              style={{ color: '#1a1a1a' }}
            >
              {profile.displayName}
            </h1>
            <p 
              className="text-lg font-light tracking-wide"
              style={{ color: primaryColor }}
            >
              ✨ {profile.professionTitle} ✨
            </p>
            <p className="text-gray-500 mt-3 max-w-md mx-auto italic">
              "{profile.tagline}"
            </p>

            {/* Rating & Location */}
            <div className="flex items-center justify-center gap-6 mt-6 text-sm">
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      className={i <= Math.round(userRating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <span className="text-gray-600 ml-2">{reviewCount} отзива</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500">
                <MapPin size={14} />
                {profile.city}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={onContact}
                className="flex items-center gap-2 px-8 py-3 rounded-full text-white font-medium shadow-lg shadow-pink-200 transition-all hover:shadow-xl hover:shadow-pink-300 hover:scale-105"
                style={{ backgroundColor: primaryColor }}
              >
                <Calendar size={18} />
                Запази час
              </button>
              <button
                onClick={onShare}
                className="p-3 rounded-full border-2 transition-colors hover:bg-pink-50"
                style={{ borderColor: primaryColor, color: primaryColor }}
              >
                <Share2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-3xl mx-auto px-4 mt-8">
        <div className="flex justify-center gap-2">
          {[
            { id: 'services', label: 'Услуги' },
            { id: 'gallery', label: 'Портфолио' },
            { id: 'about', label: 'За мен' },
            { id: 'contact', label: 'Контакти' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`py-2 px-6 rounded-full text-sm font-medium transition-all ${
                activeSection === tab.id
                  ? 'text-white shadow-md'
                  : 'text-gray-600 hover:text-pink-600 hover:bg-pink-50'
              }`}
              style={activeSection === tab.id ? { backgroundColor: primaryColor } : {}}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-8 relative">
        {/* Services */}
        {activeSection === 'services' && (
          <div className="space-y-4">
            <div className="text-center mb-8">
              <Sparkles size={24} className="inline" style={{ color: primaryColor }} />
              <h2 className="text-2xl font-serif mt-2">Нашите услуги</h2>
            </div>
            {profile.services.length === 0 ? (
              <p className="text-center text-gray-400 py-12">Няма добавени услуги</p>
            ) : (
              profile.services.map((service) => (
                <div 
                  key={service.id}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-pink-50 hover:shadow-md hover:border-pink-100 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-800">{service.name}</h3>
                        {service.popular && (
                          <span 
                            className="px-2 py-0.5 text-xs rounded-full text-white"
                            style={{ backgroundColor: primaryColor }}
                          >
                            💖 Популярна
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 text-sm mt-1">{service.description}</p>
                      {service.duration && (
                        <p className="text-xs text-gray-400 mt-2">
                          <Clock size={12} className="inline mr-1" />
                          {service.duration}
                        </p>
                      )}
                    </div>
                    {profile.showPrices && (
                      <div className="text-right">
                        <p className="text-xl font-light" style={{ color: primaryColor }}>
                          {service.price} €
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Gallery */}
        {activeSection === 'gallery' && (
          <div>
            <div className="text-center mb-8">
              <Heart size={24} className="inline" style={{ color: primaryColor }} />
              <h2 className="text-2xl font-serif mt-2">Портфолио</h2>
            </div>
            {profile.gallery.length === 0 ? (
              <p className="text-center text-gray-400 py-12">Няма добавени снимки</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {profile.gallery.map((item, index) => (
                  <div 
                    key={item.id} 
                    className={`overflow-hidden rounded-2xl shadow-sm hover:shadow-lg transition-all ${
                      index === 0 ? 'md:col-span-2 md:row-span-2' : ''
                    }`}
                  >
                    <img
                      src={item.url}
                      alt={item.caption || ''}
                      className="w-full h-full object-cover aspect-square hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* About */}
        {activeSection === 'about' && (
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-pink-50">
              <h2 className="text-2xl font-serif mb-4 text-center">За мен</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line text-center">
                {profile.aboutMe || 'Няма добавена информация'}
              </p>
            </div>

            {profile.certifications.length > 0 && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-pink-50">
                <h2 className="text-2xl font-serif mb-4 text-center">Квалификации</h2>
                <div className="space-y-3">
                  {profile.certifications.map((cert) => (
                    <div 
                      key={cert.id} 
                      className="flex items-center gap-3 p-3 rounded-xl bg-pink-50/50"
                    >
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${primaryColor}20` }}
                      >
                        ✓
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{cert.name}</p>
                        <p className="text-sm text-gray-500">{cert.issuer} • {cert.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Contact */}
        {activeSection === 'contact' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <MessageCircle size={24} className="inline" style={{ color: primaryColor }} />
              <h2 className="text-2xl font-serif mt-2">Свържете се с мен</h2>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-pink-50 space-y-4">
              {profile.showPhone && profile.contactPhone && (
                <a 
                  href={`tel:${profile.contactPhone}`}
                  className="flex items-center gap-4 p-4 rounded-2xl hover:bg-pink-50 transition-colors"
                >
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${primaryColor}15` }}
                  >
                    <Phone size={20} style={{ color: primaryColor }} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Телефон</p>
                    <p className="font-medium text-gray-800">{profile.contactPhone}</p>
                  </div>
                </a>
              )}

              {profile.whatsapp && (
                <a 
                  href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-green-50 hover:bg-green-100 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                    <span className="text-xl">💬</span>
                  </div>
                  <div>
                    <p className="text-xs text-green-600 uppercase tracking-wide">WhatsApp</p>
                    <p className="font-medium text-gray-800">Пишете ми</p>
                  </div>
                </a>
              )}

              {profile.showEmail && profile.contactEmail && (
                <a 
                  href={`mailto:${profile.contactEmail}`}
                  className="flex items-center gap-4 p-4 rounded-2xl hover:bg-pink-50 transition-colors"
                >
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${primaryColor}15` }}
                  >
                    <Mail size={20} style={{ color: primaryColor }} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Email</p>
                    <p className="font-medium text-gray-800">{profile.contactEmail}</p>
                  </div>
                </a>
              )}
            </div>

            {/* Working Hours */}
            {profile.workingHours.length > 0 && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-pink-50">
                <h3 className="text-lg font-serif mb-4 text-center">Работно време</h3>
                <div className="space-y-2">
                  {profile.workingHours.map((wh) => (
                    <div 
                      key={wh.day}
                      className="flex items-center justify-between py-2 border-b border-pink-50 last:border-0"
                    >
                      <span className="text-gray-600">{dayTranslations[wh.day]}</span>
                      <span className={wh.isOpen ? 'text-gray-800' : 'text-pink-400'}>
                        {wh.isOpen ? `${wh.openTime} - ${wh.closeTime}` : 'Почивен ден'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center py-8 text-sm text-gray-400">
        <p>Профил в <span className="font-medium" style={{ color: primaryColor }}>Rabotim.com</span></p>
      </div>
    </div>
  )
}

