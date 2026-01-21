'use client'

import { useState } from 'react'
import { 
  MapPin, Phone, Mail, Clock, Star, CheckCircle, Share2, 
  MessageCircle, Calendar, ChevronRight, Zap, Target, Trophy
} from 'lucide-react'
import { TemplateProps } from './TemplateRenderer'

const dayTranslations: Record<string, string> = {
  monday: 'ПОН', tuesday: 'ВТО', wednesday: 'СРЯ',
  thursday: 'ЧЕТ', friday: 'ПЕТ', saturday: 'СЪБ', sunday: 'НЕД'
}

export default function FitnessTemplate({ 
  profile, templateConfig, professionConfig, isPreview,
  onContact, onShare, userRating, reviewCount 
}: TemplateProps) {
  const [activeSection, setActiveSection] = useState<'services' | 'gallery' | 'about' | 'contact'>('services')
  const primaryColor = profile.primaryColor || '#10B981' // Green

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section - Full Impact */}
      <div className="relative min-h-[70vh] overflow-hidden">
        {/* Background */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: profile.coverImage 
              ? `url(${profile.coverImage})`
              : 'url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&h=1080&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black"></div>
        </div>

        {/* Diagonal Lines Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, white 35px, white 36px)',
          }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 pt-20 pb-12">
          <div className="flex flex-col items-center text-center">
            {/* Badge */}
            <div 
              className="px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider mb-6"
              style={{ backgroundColor: primaryColor }}
            >
              {professionConfig?.nameBg || 'Професионалист'}
            </div>

            {/* Name */}
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-4">
              {profile.displayName}
            </h1>

            {/* Title */}
            <p className="text-2xl md:text-3xl font-light text-gray-300 mb-4">
              {profile.professionTitle}
            </p>

            {/* Tagline */}
            <p className="text-lg text-gray-400 max-w-2xl mb-8">
              {profile.tagline}
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Star size={24} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-3xl font-bold">{userRating.toFixed(1)}</span>
                </div>
                <p className="text-sm text-gray-400 mt-1">{reviewCount} отзива</p>
              </div>
              <div className="w-px h-12 bg-gray-700"></div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <MapPin size={20} className="text-gray-400" />
                  <span className="text-xl">{profile.city}</span>
                </div>
                <p className="text-sm text-gray-400 mt-1">{profile.neighborhood || 'Всички райони'}</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4">
              <button
                onClick={onContact}
                className="flex items-center gap-2 px-8 py-4 rounded-none text-black font-bold uppercase tracking-wide transition-transform hover:scale-105"
                style={{ backgroundColor: primaryColor }}
              >
                <Zap size={20} />
                Започни сега
              </button>
              <button
                onClick={onShare}
                className="flex items-center gap-2 px-6 py-4 border-2 border-white/30 text-white font-bold uppercase tracking-wide hover:bg-white/10 transition-colors"
              >
                <Share2 size={20} />
                Сподели
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent"></div>
      </div>

      {/* Navigation - Angular Design */}
      <div className="sticky top-0 z-20 bg-black/95 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex">
            {[
              { id: 'services', label: 'ТРЕНИРОВКИ', icon: Target },
              { id: 'gallery', label: 'ГАЛЕРИЯ', icon: Trophy },
              { id: 'about', label: 'ЗА МЕН', icon: Zap },
              { id: 'contact', label: 'КОНТАКТИ', icon: Phone }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`flex-1 py-4 px-4 font-bold uppercase tracking-wider text-sm transition-all ${
                  activeSection === tab.id
                    ? 'text-black border-b-4'
                    : 'text-gray-500 hover:text-white border-b-4 border-transparent'
                }`}
                style={activeSection === tab.id ? { 
                  backgroundColor: primaryColor,
                  borderColor: primaryColor 
                } : {}}
              >
                <tab.icon size={18} className="inline mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Services */}
        {activeSection === 'services' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-black uppercase tracking-tight mb-8">
              <span style={{ color: primaryColor }}>УСЛУГИ</span> & ПРОГРАМИ
            </h2>
            {profile.services.length === 0 ? (
              <p className="text-center text-gray-500 py-12">Няма добавени услуги</p>
            ) : (
              <div className="grid gap-4">
                {profile.services.map((service, index) => (
                  <div 
                    key={service.id}
                    className="group relative overflow-hidden"
                    style={{ 
                      background: `linear-gradient(90deg, ${primaryColor}10, transparent)`,
                      borderLeft: `4px solid ${primaryColor}`
                    }}
                  >
                    <div className="p-6 flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <span className="text-5xl font-black text-gray-800">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <h3 className="text-xl font-bold uppercase tracking-wide flex items-center gap-2">
                            {service.name}
                            {service.popular && (
                              <span className="px-2 py-0.5 text-xs rounded font-bold text-black" style={{ backgroundColor: primaryColor }}>
                                🔥 ПОПУЛЯРНА
                              </span>
                            )}
                          </h3>
                          <p className="text-gray-400 mt-1">{service.description}</p>
                          {service.duration && (
                            <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                              <Clock size={14} /> {service.duration}
                            </p>
                          )}
                        </div>
                      </div>
                      {profile.showPrices && (
                        <div className="text-right">
                          <p className="text-4xl font-black" style={{ color: primaryColor }}>
                            {service.price}
                            <span className="text-lg text-gray-500 ml-1">лв</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Gallery */}
        {activeSection === 'gallery' && (
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tight mb-8">
              <span style={{ color: primaryColor }}>ГАЛЕРИЯ</span> & РЕЗУЛТАТИ
            </h2>
            {profile.gallery.length === 0 ? (
              <p className="text-center text-gray-500 py-12">Няма добавени снимки</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {profile.gallery.map((item) => (
                  <div key={item.id} className="aspect-square overflow-hidden group relative">
                    <img
                      src={item.url}
                      alt={item.caption || ''}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <p className="text-white font-bold uppercase tracking-wide">{item.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* About */}
        {activeSection === 'about' && (
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tight mb-6">
                <span style={{ color: primaryColor }}>МОЯТА</span> ИСТОРИЯ
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed whitespace-pre-line">
                {profile.aboutMe || 'Няма добавена информация'}
              </p>
            </div>

            {profile.certifications.length > 0 && (
              <div>
                <h2 className="text-3xl font-black uppercase tracking-tight mb-6">
                  <span style={{ color: primaryColor }}>СЕРТИФИКАТИ</span> & КВАЛИФИКАЦИИ
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {profile.certifications.map((cert) => (
                    <div 
                      key={cert.id} 
                      className="p-4 border-l-4 bg-gray-900/50"
                      style={{ borderColor: primaryColor }}
                    >
                      <CheckCircle size={24} style={{ color: primaryColor }} className="mb-2" />
                      <p className="font-bold uppercase">{cert.name}</p>
                      <p className="text-gray-500 text-sm">{cert.issuer} • {cert.year}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Contact */}
        {activeSection === 'contact' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-black uppercase tracking-tight mb-6">
              <span style={{ color: primaryColor }}>СВЪРЖИ</span> СЕ
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {profile.showPhone && profile.contactPhone && (
                <a 
                  href={`tel:${profile.contactPhone}`}
                  className="flex items-center gap-4 p-6 bg-gray-900 hover:bg-gray-800 transition-colors group"
                >
                  <div className="w-14 h-14 flex items-center justify-center" style={{ backgroundColor: primaryColor }}>
                    <Phone size={24} className="text-black" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 uppercase">Телефон</p>
                    <p className="text-xl font-bold">{profile.contactPhone}</p>
                  </div>
                </a>
              )}

              {profile.whatsapp && (
                <a 
                  href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-6 bg-green-900/30 hover:bg-green-900/50 transition-colors"
                >
                  <div className="w-14 h-14 bg-green-500 flex items-center justify-center">
                    <span className="text-2xl">💬</span>
                  </div>
                  <div>
                    <p className="text-sm text-green-400 uppercase">WhatsApp</p>
                    <p className="text-xl font-bold">Пиши ми сега</p>
                  </div>
                </a>
              )}
            </div>

            {/* Working Hours */}
            {profile.workingHours.length > 0 && (
              <div>
                <h3 className="text-xl font-bold uppercase mb-4">Работно време</h3>
                <div className="flex gap-2 flex-wrap">
                  {profile.workingHours.map((wh) => (
                    <div 
                      key={wh.day}
                      className={`px-4 py-3 text-center ${
                        wh.isOpen ? 'bg-gray-900' : 'bg-red-900/30'
                      }`}
                    >
                      <p className="font-bold text-sm">{dayTranslations[wh.day]}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {wh.isOpen ? `${wh.openTime}-${wh.closeTime}` : 'Почивка'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center py-8 border-t border-gray-800">
        <p className="text-gray-500">
          Профил в <span className="font-bold" style={{ color: primaryColor }}>Rabotim.com</span>
        </p>
      </div>
    </div>
  )
}

