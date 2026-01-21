'use client'

import { useState } from 'react'
import { 
  MapPin, Phone, Mail, Clock, Star, CheckCircle, Share2, 
  MessageCircle, Hammer, Award, Heart
} from 'lucide-react'
import { TemplateProps } from './TemplateRenderer'

const dayTranslations: Record<string, string> = {
  monday: 'Понеделник', tuesday: 'Вторник', wednesday: 'Сряда',
  thursday: 'Четвъртък', friday: 'Петък', saturday: 'Събота', sunday: 'Неделя'
}

export default function CraftTemplate({ 
  profile, templateConfig, professionConfig, isPreview,
  onContact, onShare, userRating, reviewCount 
}: TemplateProps) {
  const [activeSection, setActiveSection] = useState<'services' | 'gallery' | 'about' | 'contact'>('services')
  const primaryColor = profile.primaryColor || '#D97706' // Amber/Orange

  return (
    <div 
      className="min-h-screen"
      style={{ 
        backgroundColor: '#f5f0e8',
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${primaryColor.slice(1)}' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Decorative wood grain pattern */}
        <div 
          className="h-48 md:h-64"
          style={{
            backgroundImage: profile.coverImage 
              ? `linear-gradient(rgba(245,240,232,0.85), rgba(245,240,232,0.95)), url(${profile.coverImage})`
              : `linear-gradient(135deg, ${primaryColor}20, ${primaryColor}05)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Decorative corner ornaments */}
          <div 
            className="absolute top-4 left-4 w-12 h-12 border-l-4 border-t-4 opacity-30"
            style={{ borderColor: primaryColor }}
          ></div>
          <div 
            className="absolute top-4 right-4 w-12 h-12 border-r-4 border-t-4 opacity-30"
            style={{ borderColor: primaryColor }}
          ></div>
        </div>

        {/* Profile Card */}
        <div className="max-w-3xl mx-auto px-4 -mt-24 relative z-10">
          <div 
            className="bg-white rounded-lg shadow-xl p-8 border-t-4"
            style={{ borderTopColor: primaryColor }}
          >
            <div className="text-center">
              {/* Badge */}
              <div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
                style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
              >
                <Hammer size={16} />
                Майстор занаятчия
              </div>

              {/* Icon/Avatar */}
              <div 
                className="w-24 h-24 mx-auto rounded-full flex items-center justify-center text-5xl mb-4 border-4"
                style={{ 
                  backgroundColor: `${primaryColor}10`,
                  borderColor: `${primaryColor}30`
                }}
              >
                {professionConfig?.icon || '🔨'}
              </div>

              {/* Name */}
              <h1 
                className="text-3xl md:text-4xl font-bold mb-2"
                style={{ color: '#3d2c1f', fontFamily: 'Georgia, serif' }}
              >
                {profile.displayName}
              </h1>

              {/* Decorative divider */}
              <div className="flex items-center justify-center gap-4 my-4">
                <div className="h-px w-16" style={{ background: `linear-gradient(to right, transparent, ${primaryColor})` }}></div>
                <span style={{ color: primaryColor }}>✦</span>
                <div className="h-px w-16" style={{ background: `linear-gradient(to left, transparent, ${primaryColor})` }}></div>
              </div>

              {/* Title */}
              <p className="text-xl mb-2" style={{ color: primaryColor }}>
                {profile.professionTitle}
              </p>

              {/* Tagline */}
              <p className="text-gray-600 italic max-w-lg mx-auto mb-6">
                "{profile.tagline}"
              </p>

              {/* Stats */}
              <div className="flex items-center justify-center gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <Star size={18} className="fill-amber-500 text-amber-500" />
                  <span className="font-semibold">{userRating.toFixed(1)}</span>
                  <span className="text-gray-500 text-sm">({reviewCount})</span>
                </div>
                <div className="w-px h-5 bg-gray-300"></div>
                <div className="flex items-center gap-1 text-gray-600">
                  <MapPin size={16} />
                  {profile.city}
                </div>
              </div>

              {/* CTA */}
              <div className="flex justify-center gap-3">
                <button
                  onClick={onContact}
                  className="flex items-center gap-2 px-8 py-3 rounded-lg text-white font-medium transition-all hover:shadow-lg"
                  style={{ backgroundColor: primaryColor }}
                >
                  <MessageCircle size={18} />
                  Поискай оферта
                </button>
                <button
                  onClick={onShare}
                  className="px-4 py-3 rounded-lg border-2 transition-colors hover:bg-gray-50"
                  style={{ borderColor: primaryColor, color: primaryColor }}
                >
                  <Share2 size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-3xl mx-auto px-4 mt-8">
        <div className="flex justify-center">
          <div 
            className="inline-flex rounded-lg p-1 bg-white shadow-sm"
          >
            {[
              { id: 'services', label: 'Услуги' },
              { id: 'gallery', label: 'Работи' },
              { id: 'about', label: 'За мен' },
              { id: 'contact', label: 'Контакти' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`py-2 px-6 rounded-md text-sm font-medium transition-all ${
                  activeSection === tab.id
                    ? 'text-white shadow'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                style={activeSection === tab.id ? { backgroundColor: primaryColor } : {}}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Services */}
          {activeSection === 'services' && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Award size={20} style={{ color: primaryColor }} />
                <h2 className="text-xl font-semibold" style={{ color: '#3d2c1f', fontFamily: 'Georgia, serif' }}>
                  Нашите услуги
                </h2>
              </div>
              {profile.services.length === 0 ? (
                <p className="text-center text-gray-500 py-12">Няма добавени услуги</p>
              ) : (
                <div className="space-y-4">
                  {profile.services.map((service) => (
                    <div 
                      key={service.id}
                      className="p-4 rounded-lg border-l-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                      style={{ borderLeftColor: service.popular ? primaryColor : '#e5e5e5' }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-800">{service.name}</h3>
                            {service.popular && (
                              <span 
                                className="px-2 py-0.5 text-xs rounded-full text-white"
                                style={{ backgroundColor: primaryColor }}
                              >
                                ★ Популярна
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm">{service.description}</p>
                          {service.duration && (
                            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                              <Clock size={12} /> {service.duration}
                            </p>
                          )}
                        </div>
                        {profile.showPrices && (
                          <div className="text-right ml-4">
                            <p className="text-xl font-bold" style={{ color: primaryColor }}>
                              {service.price} лв
                            </p>
                            <p className="text-xs text-gray-500">
                              {service.priceType === 'hourly' && 'на час'}
                              {service.priceType === 'fixed' && 'фиксирана'}
                              {service.priceType === 'starting_from' && 'от'}
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
              <div className="flex items-center gap-2 mb-6">
                <Heart size={20} style={{ color: primaryColor }} />
                <h2 className="text-xl font-semibold" style={{ color: '#3d2c1f', fontFamily: 'Georgia, serif' }}>
                  Извършени работи
                </h2>
              </div>
              {profile.gallery.length === 0 ? (
                <p className="text-center text-gray-500 py-12">Няма добавени снимки</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {profile.gallery.map((item) => (
                    <div 
                      key={item.id} 
                      className="aspect-square rounded-lg overflow-hidden shadow-md group relative"
                    >
                      <img
                        src={item.url}
                        alt={item.caption || ''}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {item.caption && (
                        <div 
                          className="absolute inset-x-0 bottom-0 p-3 text-white text-sm"
                          style={{ background: `linear-gradient(to top, ${primaryColor}CC, transparent)` }}
                        >
                          {item.caption}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* About */}
          {activeSection === 'about' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4" style={{ color: '#3d2c1f', fontFamily: 'Georgia, serif' }}>
                  За мен
                </h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {profile.aboutMe || 'Няма добавена информация'}
                </p>
              </div>

              {profile.certifications.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4" style={{ color: '#3d2c1f', fontFamily: 'Georgia, serif' }}>
                    Квалификации
                  </h2>
                  <div className="space-y-2">
                    {profile.certifications.map((cert) => (
                      <div 
                        key={cert.id} 
                        className="flex items-center gap-3 p-3 rounded-lg bg-gray-50"
                      >
                        <CheckCircle size={18} style={{ color: primaryColor }} />
                        <div>
                          <p className="font-medium text-gray-800">{cert.name}</p>
                          <p className="text-sm text-gray-500">{cert.issuer} • {cert.year}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {profile.serviceArea && profile.serviceArea.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4" style={{ color: '#3d2c1f', fontFamily: 'Georgia, serif' }}>
                    Райони на обслужване
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {profile.serviceArea.map((area, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 rounded-full text-sm"
                        style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Contact */}
          {activeSection === 'contact' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold" style={{ color: '#3d2c1f', fontFamily: 'Georgia, serif' }}>
                Свържете се
              </h2>

              <div className="space-y-3">
                {profile.showPhone && profile.contactPhone && (
                  <a 
                    href={`tel:${profile.contactPhone}`}
                    className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${primaryColor}15` }}
                    >
                      <Phone size={18} style={{ color: primaryColor }} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Телефон</p>
                      <p className="font-medium">{profile.contactPhone}</p>
                    </div>
                  </a>
                )}

                {profile.showEmail && profile.contactEmail && (
                  <a 
                    href={`mailto:${profile.contactEmail}`}
                    className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${primaryColor}15` }}
                    >
                      <Mail size={18} style={{ color: primaryColor }} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-medium">{profile.contactEmail}</p>
                    </div>
                  </a>
                )}

                {profile.whatsapp && (
                  <a 
                    href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                      <span className="text-lg">💬</span>
                    </div>
                    <div>
                      <p className="text-xs text-green-600">WhatsApp</p>
                      <p className="font-medium text-gray-800">Пишете ми</p>
                    </div>
                  </a>
                )}
              </div>

              {/* Working Hours */}
              {profile.workingHours.length > 0 && (
                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-4">Работно време</h3>
                  <div className="space-y-2">
                    {profile.workingHours.map((wh) => (
                      <div 
                        key={wh.day}
                        className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                      >
                        <span className="text-gray-600">{dayTranslations[wh.day]}</span>
                        <span className={wh.isOpen ? 'font-medium' : 'text-gray-400'}>
                          {wh.isOpen ? `${wh.openTime} - ${wh.closeTime}` : 'Почивен'}
                        </span>
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
      <div className="text-center py-8">
        <p className="text-gray-500 text-sm">
          Профил в <span className="font-medium" style={{ color: primaryColor }}>Rabotim.com</span>
        </p>
      </div>
    </div>
  )
}

