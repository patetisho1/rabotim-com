'use client'

import { useState } from 'react'
import { 
  MapPin, Phone, Mail, Clock, Star, CheckCircle, Share2, 
  MessageCircle, Calendar, ExternalLink, Crown, Shield, 
  ArrowLeft, ChevronRight 
} from 'lucide-react'
import { TemplateProps } from './TemplateRenderer'

const dayTranslations: Record<string, string> = {
  monday: 'Пон', tuesday: 'Вто', wednesday: 'Сря',
  thursday: 'Чет', friday: 'Пет', saturday: 'Съб', sunday: 'Нед'
}

const socialIcons: Record<string, string> = {
  facebook: '📘', instagram: '📸', youtube: '🎬', tiktok: '🎵',
  linkedin: '💼', website: '🌐', other: '🔗'
}

export default function ModernTemplate({ 
  profile, templateConfig, professionConfig, isPreview,
  onContact, onShare, userRating, reviewCount 
}: TemplateProps) {
  const [activeSection, setActiveSection] = useState<'services' | 'gallery' | 'about' | 'contact'>('services')
  const primaryColor = profile.primaryColor || templateConfig.primaryColor

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative">
        <div 
          className="h-56 md:h-72 bg-gradient-to-br"
          style={{
            backgroundImage: profile.coverImage 
              ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${profile.coverImage})`
              : `linear-gradient(135deg, ${primaryColor}, ${primaryColor}99)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Floating particles effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute w-64 h-64 bg-white/10 rounded-full -top-20 -right-20 blur-3xl"></div>
            <div className="absolute w-48 h-48 bg-white/10 rounded-full -bottom-10 -left-10 blur-2xl"></div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="max-w-4xl mx-auto px-4 -mt-24 relative z-10">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-end gap-6">
              {/* Avatar */}
              <div 
                className="w-32 h-32 rounded-2xl shadow-lg flex items-center justify-center text-5xl -mt-20 md:-mt-16 border-4 border-white dark:border-gray-800"
                style={{ backgroundColor: `${primaryColor}15` }}
              >
                {professionConfig?.icon || '👤'}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {profile.displayName}
                  </h1>
                  <Shield size={20} style={{ color: primaryColor }} />
                </div>
                <p className="text-lg font-medium" style={{ color: primaryColor }}>
                  {profile.professionTitle}
                </p>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  {profile.tagline}
                </p>
                
                {/* Stats Row */}
                <div className="flex items-center gap-6 mt-4 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Star size={18} className="text-amber-500 fill-current" />
                    <span className="font-semibold text-gray-900 dark:text-white">{userRating.toFixed(1)}</span>
                    <span className="text-gray-500 text-sm">({reviewCount} отзива)</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    <MapPin size={16} />
                    <span>{profile.city}{profile.neighborhood ? `, ${profile.neighborhood}` : ''}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onContact}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium transition-all hover:scale-105 shadow-lg"
                  style={{ backgroundColor: primaryColor }}
                >
                  <MessageCircle size={18} />
                  Свържи се
                </button>
                <button
                  onClick={onShare}
                  className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Share2 size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-sm flex gap-2 overflow-x-auto">
          {[
            { id: 'services', label: 'Услуги', count: profile.services.length },
            { id: 'gallery', label: 'Галерия', count: profile.gallery.length },
            { id: 'about', label: 'За мен' },
            { id: 'contact', label: 'Контакти' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all whitespace-nowrap ${
                activeSection === tab.id
                  ? 'text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              style={activeSection === tab.id ? { backgroundColor: primaryColor } : {}}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="ml-1 text-sm opacity-75">({tab.count})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
          {/* Services */}
          {activeSection === 'services' && (
            <div className="space-y-4">
              {profile.services.length === 0 ? (
                <p className="text-center text-gray-500 py-12">Няма добавени услуги</p>
              ) : (
                profile.services.map((service) => (
                  <div 
                    key={service.id}
                    className="flex items-center justify-between p-5 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 hover:shadow-md transition-all group"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                          {service.name}
                        </h3>
                        {service.popular && (
                          <span 
                            className="px-2 py-0.5 text-xs rounded-full font-medium text-white"
                            style={{ backgroundColor: primaryColor }}
                          >
                            Популярна
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">{service.description}</p>
                      {service.duration && (
                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                          <Clock size={14} /> {service.duration}
                        </p>
                      )}
                    </div>
                    {profile.showPrices && (
                      <div className="text-right ml-4">
                        <p className="text-2xl font-bold" style={{ color: primaryColor }}>
                          {service.price} €
                        </p>
                        <p className="text-xs text-gray-500">
                          {service.priceType === 'hourly' && 'на час'}
                          {service.priceType === 'fixed' && 'фиксирана'}
                          {service.priceType === 'starting_from' && 'от'}
                          {service.priceType === 'negotiable' && 'по договаряне'}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Gallery */}
          {activeSection === 'gallery' && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {profile.gallery.length === 0 ? (
                <p className="col-span-full text-center text-gray-500 py-12">Няма добавени снимки</p>
              ) : (
                profile.gallery.map((item) => (
                  <div key={item.id} className="aspect-square rounded-xl overflow-hidden group relative">
                    <img
                      src={item.url}
                      alt={item.caption || ''}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    {item.caption && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                        <p className="text-white text-sm">{item.caption}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* About */}
          {activeSection === 'about' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">За мен</h3>
                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line leading-relaxed">
                  {profile.aboutMe || 'Няма добавена информация'}
                </p>
              </div>

              {profile.certifications.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Сертификати</h3>
                  <div className="space-y-2">
                    {profile.certifications.map((cert) => (
                      <div key={cert.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <CheckCircle size={20} style={{ color: primaryColor }} />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{cert.name}</p>
                          <p className="text-sm text-gray-500">{cert.issuer} • {cert.year}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {profile.serviceArea && profile.serviceArea.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Райони на обслужване</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.serviceArea.map((area, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 rounded-full text-sm font-medium"
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
              <div className="grid gap-4">
                {profile.showPhone && profile.contactPhone && (
                  <a 
                    href={`tel:${profile.contactPhone}`}
                    className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
                      <Phone size={24} style={{ color: primaryColor }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Телефон</p>
                      <p className="font-medium text-gray-900 dark:text-white">{profile.contactPhone}</p>
                    </div>
                    <ChevronRight size={20} className="text-gray-400" />
                  </a>
                )}

                {profile.showEmail && profile.contactEmail && (
                  <a 
                    href={`mailto:${profile.contactEmail}`}
                    className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
                      <Mail size={24} style={{ color: primaryColor }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900 dark:text-white">{profile.contactEmail}</p>
                    </div>
                    <ChevronRight size={20} className="text-gray-400" />
                  </a>
                )}

                {profile.whatsapp && (
                  <a 
                    href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center">
                      <span className="text-2xl">💬</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-green-600 dark:text-green-400">WhatsApp</p>
                      <p className="font-medium text-gray-900 dark:text-white">Пишете ми</p>
                    </div>
                    <ChevronRight size={20} className="text-green-400" />
                  </a>
                )}
              </div>

              {/* Working Hours */}
              {profile.workingHours.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Работно време</h3>
                  <div className="grid grid-cols-7 gap-2">
                    {profile.workingHours.map((wh) => (
                      <div 
                        key={wh.day}
                        className={`text-center p-3 rounded-xl ${
                          wh.isOpen 
                            ? 'bg-gray-50 dark:bg-gray-700/50' 
                            : 'bg-red-50 dark:bg-red-900/20'
                        }`}
                      >
                        <p className="font-medium text-gray-700 dark:text-gray-300 text-sm">
                          {dayTranslations[wh.day]}
                        </p>
                        <p className={`text-xs mt-1 ${wh.isOpen ? 'text-gray-500' : 'text-red-500'}`}>
                          {wh.isOpen ? `${wh.openTime?.slice(0,5)}` : '✕'}
                        </p>
                        {wh.isOpen && (
                          <p className="text-xs text-gray-500">{wh.closeTime?.slice(0,5)}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Links */}
              {profile.socialLinks.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Социални мрежи</h3>
                  <div className="flex flex-wrap gap-3">
                    {profile.socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        <span>{socialIcons[social.platform]}</span>
                        <span className="font-medium text-gray-700 dark:text-gray-300 capitalize">
                          {social.platform}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8 text-sm text-gray-500">
        <p>Профил в <span className="font-medium" style={{ color: primaryColor }}>Rabotim.com</span></p>
      </div>
    </div>
  )
}

