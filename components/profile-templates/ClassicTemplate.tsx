'use client'

import { useState } from 'react'
import { 
  MapPin, Phone, Mail, Clock, Star, CheckCircle, Share2, 
  MessageCircle, Briefcase, Award
} from 'lucide-react'
import { TemplateProps } from './TemplateRenderer'

const dayTranslations: Record<string, string> = {
  monday: 'Понеделник', tuesday: 'Вторник', wednesday: 'Сряда',
  thursday: 'Четвъртък', friday: 'Петък', saturday: 'Събота', sunday: 'Неделя'
}

export default function ClassicTemplate({ 
  profile, templateConfig, professionConfig, isPreview,
  onContact, onShare, userRating, reviewCount 
}: TemplateProps) {
  const [activeSection, setActiveSection] = useState<'services' | 'about' | 'contact'>('services')
  const primaryColor = profile.primaryColor || '#1F2937' // Dark gray

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Header Bar */}
      <div 
        className="py-3 text-center text-white text-sm"
        style={{ backgroundColor: primaryColor }}
      >
        <span className="font-medium">{profile.professionTitle}</span>
        <span className="mx-3">•</span>
        <span>{profile.city}{profile.neighborhood ? `, ${profile.neighborhood}` : ''}</span>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Business Card Style Header */}
        <div className="bg-white shadow-lg rounded-sm overflow-hidden">
          <div className="md:flex">
            {/* Left - Photo/Icon */}
            <div 
              className="md:w-1/3 p-8 flex items-center justify-center"
              style={{ backgroundColor: `${primaryColor}08` }}
            >
              {profile.coverImage ? (
                <img 
                  src={profile.coverImage} 
                  alt={profile.displayName}
                  className="w-48 h-48 object-cover rounded-sm shadow-md"
                />
              ) : (
                <div 
                  className="w-48 h-48 flex items-center justify-center text-7xl bg-white shadow-md rounded-sm"
                >
                  {professionConfig?.icon || '👤'}
                </div>
              )}
            </div>

            {/* Right - Info */}
            <div className="md:w-2/3 p-8">
              <div className="border-b pb-4 mb-4" style={{ borderColor: `${primaryColor}20` }}>
                <h1 className="text-3xl font-serif tracking-tight" style={{ color: primaryColor }}>
                  {profile.displayName}
                </h1>
                <p className="text-lg text-gray-600 mt-1">
                  {profile.professionTitle}
                </p>
              </div>

              <p className="text-gray-600 italic mb-6">
                "{profile.tagline}"
              </p>

              {/* Stats */}
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Star size={18} className="text-amber-500 fill-current" />
                  <span className="font-medium">{userRating.toFixed(1)}</span>
                  <span className="text-gray-500 text-sm">({reviewCount} отзива)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={16} />
                  <span>{profile.city}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onContact}
                  className="flex items-center gap-2 px-6 py-3 text-white rounded-sm font-medium hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: primaryColor }}
                >
                  <MessageCircle size={18} />
                  Свържете се
                </button>
                <button
                  onClick={onShare}
                  className="flex items-center gap-2 px-4 py-3 border-2 rounded-sm text-gray-600 hover:bg-gray-50 transition-colors"
                  style={{ borderColor: primaryColor }}
                >
                  <Share2 size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex border-b border-gray-300 mt-8">
          {[
            { id: 'services', label: 'Услуги', icon: Briefcase },
            { id: 'about', label: 'Профил', icon: Award },
            { id: 'contact', label: 'Контакти', icon: Phone }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`flex items-center gap-2 py-4 px-6 font-medium transition-colors border-b-2 -mb-px ${
                activeSection === tab.id
                  ? 'border-current'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              style={activeSection === tab.id ? { color: primaryColor } : {}}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white shadow-md rounded-sm mt-0 p-8">
          {/* Services */}
          {activeSection === 'services' && (
            <div>
              <h2 className="text-xl font-serif mb-6 pb-2 border-b" style={{ color: primaryColor, borderColor: `${primaryColor}20` }}>
                Предлагани услуги
              </h2>
              {profile.services.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Няма добавени услуги</p>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-500 border-b">
                      <th className="py-3 font-medium">Услуга</th>
                      <th className="py-3 font-medium">Продължителност</th>
                      {profile.showPrices && <th className="py-3 font-medium text-right">Цена</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {profile.services.map((service) => (
                      <tr key={service.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{service.name}</span>
                            {service.popular && (
                              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded">
                                Популярна
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                        </td>
                        <td className="py-4 text-gray-600">
                          {service.duration || '-'}
                        </td>
                        {profile.showPrices && (
                          <td className="py-4 text-right font-medium" style={{ color: primaryColor }}>
                            {service.price} €
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* About */}
          {activeSection === 'about' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-serif mb-4 pb-2 border-b" style={{ color: primaryColor, borderColor: `${primaryColor}20` }}>
                  За мен
                </h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {profile.aboutMe || 'Няма добавена информация'}
                </p>
              </div>

              {profile.certifications.length > 0 && (
                <div>
                  <h2 className="text-xl font-serif mb-4 pb-2 border-b" style={{ color: primaryColor, borderColor: `${primaryColor}20` }}>
                    Квалификации и сертификати
                  </h2>
                  <div className="space-y-3">
                    {profile.certifications.map((cert) => (
                      <div key={cert.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-sm">
                        <CheckCircle size={20} style={{ color: primaryColor }} className="mt-0.5" />
                        <div>
                          <p className="font-medium">{cert.name}</p>
                          <p className="text-sm text-gray-500">{cert.issuer} • {cert.year}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gallery */}
              {profile.gallery.length > 0 && (
                <div>
                  <h2 className="text-xl font-serif mb-4 pb-2 border-b" style={{ color: primaryColor, borderColor: `${primaryColor}20` }}>
                    Портфолио
                  </h2>
                  <div className="grid grid-cols-3 gap-3">
                    {profile.gallery.map((item) => (
                      <div key={item.id} className="aspect-square rounded-sm overflow-hidden">
                        <img
                          src={item.url}
                          alt={item.caption || ''}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
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
              <h2 className="text-xl font-serif mb-4 pb-2 border-b" style={{ color: primaryColor, borderColor: `${primaryColor}20` }}>
                Контактна информация
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {profile.showPhone && profile.contactPhone && (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-sm flex items-center justify-center" style={{ backgroundColor: `${primaryColor}10` }}>
                      <Phone size={20} style={{ color: primaryColor }} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Телефон</p>
                      <a href={`tel:${profile.contactPhone}`} className="font-medium hover:underline">
                        {profile.contactPhone}
                      </a>
                    </div>
                  </div>
                )}

                {profile.showEmail && profile.contactEmail && (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-sm flex items-center justify-center" style={{ backgroundColor: `${primaryColor}10` }}>
                      <Mail size={20} style={{ color: primaryColor }} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <a href={`mailto:${profile.contactEmail}`} className="font-medium hover:underline">
                        {profile.contactEmail}
                      </a>
                    </div>
                  </div>
                )}

                {profile.address && (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-sm flex items-center justify-center" style={{ backgroundColor: `${primaryColor}10` }}>
                      <MapPin size={20} style={{ color: primaryColor }} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Адрес</p>
                      <p className="font-medium">{profile.address}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Working Hours Table */}
              {profile.workingHours.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-medium mb-4">Работно време</h3>
                  <table className="w-full text-sm">
                    <tbody>
                      {profile.workingHours.map((wh) => (
                        <tr key={wh.day} className="border-b border-gray-100">
                          <td className="py-2 text-gray-600">{dayTranslations[wh.day]}</td>
                          <td className="py-2 text-right font-medium">
                            {wh.isOpen ? `${wh.openTime} - ${wh.closeTime}` : 'Почивен ден'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8 text-sm text-gray-500 border-t border-gray-300">
        <p>Профил в <span className="font-medium" style={{ color: primaryColor }}>Rabotim.com</span></p>
      </div>
    </div>
  )
}

