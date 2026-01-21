'use client'

import { useState } from 'react'
import { 
  MapPin, Phone, Mail, Clock, Star, CheckCircle, Share2, 
  MessageCircle, Calendar, Crown, Gem
} from 'lucide-react'
import { TemplateProps } from './TemplateRenderer'

const dayTranslations: Record<string, string> = {
  monday: 'Пон', tuesday: 'Вто', wednesday: 'Сря',
  thursday: 'Чет', friday: 'Пет', saturday: 'Съб', sunday: 'Нед'
}

export default function ElegantTemplate({ 
  profile, templateConfig, professionConfig, isPreview,
  onContact, onShare, userRating, reviewCount 
}: TemplateProps) {
  const [activeSection, setActiveSection] = useState<'services' | 'gallery' | 'about' | 'contact'>('services')
  const primaryColor = profile.primaryColor || '#7C3AED' // Purple

  return (
    <div 
      className="min-h-screen"
      style={{ 
        background: `linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)`
      }}
    >
      {/* Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 opacity-30">
          <div 
            className="absolute top-20 right-20 w-96 h-96 rounded-full blur-[100px]"
            style={{ backgroundColor: primaryColor }}
          ></div>
        </div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 opacity-20">
          <div 
            className="absolute bottom-20 left-20 w-64 h-64 rounded-full blur-[80px]"
            style={{ backgroundColor: primaryColor }}
          ></div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative pt-20 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Crown Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 border" 
            style={{ 
              backgroundColor: `${primaryColor}20`,
              borderColor: `${primaryColor}40`
            }}
          >
            <Crown size={16} style={{ color: primaryColor }} />
            <span className="text-sm font-medium text-gray-300">Premium Professional</span>
          </div>

          {/* Avatar with glow */}
          <div className="relative inline-block mb-8">
            <div 
              className="w-40 h-40 rounded-full flex items-center justify-center text-6xl border-2"
              style={{ 
                backgroundColor: `${primaryColor}15`,
                borderColor: `${primaryColor}50`,
                boxShadow: `0 0 60px ${primaryColor}40`
              }}
            >
              {professionConfig?.icon || '✨'}
            </div>
            <div className="absolute -bottom-2 -right-2">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-gray-800"
                style={{ backgroundColor: primaryColor }}
              >
                <CheckCircle size={20} className="text-white" />
              </div>
            </div>
          </div>

          {/* Name */}
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-3 tracking-wide">
            {profile.displayName}
          </h1>

          {/* Title with decorative lines */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-16" style={{ background: `linear-gradient(to right, transparent, ${primaryColor})` }}></div>
            <p className="text-xl font-light tracking-widest uppercase" style={{ color: primaryColor }}>
              {profile.professionTitle}
            </p>
            <div className="h-px w-16" style={{ background: `linear-gradient(to left, transparent, ${primaryColor})` }}></div>
          </div>

          {/* Tagline */}
          <p className="text-gray-400 text-lg max-w-2xl mx-auto italic mb-8">
            "{profile.tagline}"
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mb-10">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star size={18} className="fill-amber-400 text-amber-400" />
                <span className="text-2xl font-light text-white">{userRating.toFixed(1)}</span>
              </div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Рейтинг</p>
            </div>
            <div className="w-px h-12 bg-gray-700"></div>
            <div className="text-center">
              <span className="text-2xl font-light text-white">{reviewCount}</span>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Отзива</p>
            </div>
            <div className="w-px h-12 bg-gray-700"></div>
            <div className="text-center flex items-center gap-2">
              <MapPin size={16} className="text-gray-500" />
              <span className="text-white">{profile.city}</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex justify-center gap-4">
            <button
              onClick={onContact}
              className="flex items-center gap-2 px-8 py-4 rounded-full text-white font-medium transition-all hover:scale-105"
              style={{ 
                backgroundColor: primaryColor,
                boxShadow: `0 10px 40px ${primaryColor}40`
              }}
            >
              <MessageCircle size={18} />
              Запазете час
            </button>
            <button
              onClick={onShare}
              className="p-4 rounded-full border transition-colors hover:bg-white/5"
              style={{ borderColor: `${primaryColor}50`, color: primaryColor }}
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-4xl mx-auto px-4 mb-8">
        <div 
          className="flex rounded-full p-1 border"
          style={{ 
            backgroundColor: 'rgba(255,255,255,0.03)',
            borderColor: 'rgba(255,255,255,0.1)'
          }}
        >
          {[
            { id: 'services', label: 'Услуги' },
            { id: 'gallery', label: 'Галерия' },
            { id: 'about', label: 'За мен' },
            { id: 'contact', label: 'Контакти' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`flex-1 py-3 px-4 rounded-full text-sm font-medium transition-all ${
                activeSection === tab.id
                  ? 'text-white'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
              style={activeSection === tab.id ? { 
                backgroundColor: primaryColor,
                boxShadow: `0 4px 20px ${primaryColor}40`
              } : {}}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div 
          className="rounded-3xl p-8 border backdrop-blur-sm"
          style={{ 
            backgroundColor: 'rgba(255,255,255,0.02)',
            borderColor: 'rgba(255,255,255,0.08)'
          }}
        >
          {/* Services */}
          {activeSection === 'services' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-6">
                <Gem size={20} style={{ color: primaryColor }} />
                <h2 className="text-xl font-serif text-white">Премиум услуги</h2>
              </div>
              {profile.services.length === 0 ? (
                <p className="text-center text-gray-500 py-12">Няма добавени услуги</p>
              ) : (
                profile.services.map((service) => (
                  <div 
                    key={service.id}
                    className="p-5 rounded-2xl border transition-all hover:border-opacity-50 group"
                    style={{ 
                      backgroundColor: 'rgba(255,255,255,0.02)',
                      borderColor: `${primaryColor}20`
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-medium text-white group-hover:translate-x-1 transition-transform">
                            {service.name}
                          </h3>
                          {service.popular && (
                            <span 
                              className="px-2 py-0.5 text-xs rounded-full text-white"
                              style={{ backgroundColor: primaryColor }}
                            >
                              ★ Препоръчана
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm">{service.description}</p>
                        {service.duration && (
                          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                            <Clock size={12} /> {service.duration}
                          </p>
                        )}
                      </div>
                      {profile.showPrices && (
                        <div className="text-right">
                          <p className="text-2xl font-light" style={{ color: primaryColor }}>
                            {service.price}
                            <span className="text-sm text-gray-500 ml-1">€</span>
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
              {profile.gallery.length === 0 ? (
                <p className="text-center text-gray-500 py-12">Няма добавени снимки</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {profile.gallery.map((item) => (
                    <div 
                      key={item.id} 
                      className="aspect-square rounded-2xl overflow-hidden group relative"
                      style={{ border: `1px solid ${primaryColor}20` }}
                    >
                      <img
                        src={item.url}
                        alt={item.caption || ''}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end"
                        style={{ background: `linear-gradient(to top, ${primaryColor}90, transparent)` }}
                      >
                        <p className="p-4 text-white text-sm">{item.caption}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* About */}
          {activeSection === 'about' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-serif text-white mb-4">За мен</h2>
                <p className="text-gray-400 leading-relaxed whitespace-pre-line">
                  {profile.aboutMe || 'Няма добавена информация'}
                </p>
              </div>

              {profile.certifications.length > 0 && (
                <div>
                  <h2 className="text-xl font-serif text-white mb-4">Квалификации</h2>
                  <div className="space-y-3">
                    {profile.certifications.map((cert) => (
                      <div 
                        key={cert.id} 
                        className="flex items-center gap-4 p-4 rounded-xl"
                        style={{ backgroundColor: `${primaryColor}10` }}
                      >
                        <CheckCircle size={20} style={{ color: primaryColor }} />
                        <div>
                          <p className="text-white">{cert.name}</p>
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
              <div className="grid gap-4">
                {profile.showPhone && profile.contactPhone && (
                  <a 
                    href={`tel:${profile.contactPhone}`}
                    className="flex items-center gap-4 p-5 rounded-2xl border transition-all hover:bg-white/5"
                    style={{ borderColor: `${primaryColor}30` }}
                  >
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${primaryColor}20` }}
                    >
                      <Phone size={20} style={{ color: primaryColor }} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Телефон</p>
                      <p className="text-white font-medium">{profile.contactPhone}</p>
                    </div>
                  </a>
                )}

                {profile.showEmail && profile.contactEmail && (
                  <a 
                    href={`mailto:${profile.contactEmail}`}
                    className="flex items-center gap-4 p-5 rounded-2xl border transition-all hover:bg-white/5"
                    style={{ borderColor: `${primaryColor}30` }}
                  >
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${primaryColor}20` }}
                    >
                      <Mail size={20} style={{ color: primaryColor }} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Email</p>
                      <p className="text-white font-medium">{profile.contactEmail}</p>
                    </div>
                  </a>
                )}

                {profile.whatsapp && (
                  <a 
                    href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-5 rounded-2xl border border-green-500/30 bg-green-500/10 transition-all hover:bg-green-500/20"
                  >
                    <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                      <span className="text-xl">💬</span>
                    </div>
                    <div>
                      <p className="text-xs text-green-400 uppercase tracking-wider">WhatsApp</p>
                      <p className="text-white font-medium">Пишете ми</p>
                    </div>
                  </a>
                )}
              </div>

              {/* Working Hours */}
              {profile.workingHours.length > 0 && (
                <div className="pt-6 border-t" style={{ borderColor: `${primaryColor}20` }}>
                  <h3 className="text-lg text-white mb-4 font-serif">Работно време</h3>
                  <div className="flex justify-between gap-2">
                    {profile.workingHours.map((wh) => (
                      <div 
                        key={wh.day}
                        className={`flex-1 text-center p-3 rounded-xl ${
                          wh.isOpen ? '' : 'opacity-50'
                        }`}
                        style={{ backgroundColor: wh.isOpen ? `${primaryColor}15` : 'transparent' }}
                      >
                        <p className="text-xs text-gray-400 mb-1">{dayTranslations[wh.day]}</p>
                        <p className="text-sm text-white">
                          {wh.isOpen ? wh.openTime?.slice(0,5) : '—'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <p className="text-gray-500">
          Профил в <span className="font-medium" style={{ color: primaryColor }}>Rabotim.com</span>
        </p>
      </div>
    </div>
  )
}

