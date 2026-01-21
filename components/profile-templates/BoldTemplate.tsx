'use client'

import { useState } from 'react'
import { 
  MapPin, Phone, Mail, Clock, Star, Share2, 
  MessageCircle, ArrowRight, ChevronDown
} from 'lucide-react'
import { TemplateProps } from './TemplateRenderer'

export default function BoldTemplate({ 
  profile, templateConfig, professionConfig, isPreview,
  onContact, onShare, userRating, reviewCount 
}: TemplateProps) {
  const [activeSection, setActiveSection] = useState<'services' | 'gallery' | 'about' | 'contact'>('services')
  const [expandedService, setExpandedService] = useState<string | null>(null)
  const primaryColor = profile.primaryColor || '#DC2626' // Red

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero - Full Screen Impact */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background with overlay */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: profile.coverImage 
              ? `url(${profile.coverImage})`
              : `linear-gradient(135deg, ${primaryColor}, #000)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-black/70"></div>
        </div>

        {/* Animated geometric shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 rounded-full opacity-30 blur-3xl"
            style={{ backgroundColor: primaryColor }}
          ></div>
          <div 
            className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 rounded-full opacity-20 blur-3xl"
            style={{ backgroundColor: primaryColor }}
          ></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl">
          {/* Badge */}
          <div 
            className="inline-block px-6 py-2 mb-8 text-sm font-bold uppercase tracking-widest"
            style={{ backgroundColor: primaryColor }}
          >
            {professionConfig?.nameBg || 'Професионалист'}
          </div>

          {/* Name - Huge */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-none mb-6">
            {profile.displayName.split(' ').map((word, i) => (
              <span key={i} className="block">{word}</span>
            ))}
          </h1>

          {/* Title */}
          <p className="text-2xl md:text-3xl font-light text-gray-300 mb-8">
            {profile.professionTitle}
          </p>

          {/* Stats Row */}
          <div className="flex items-center justify-center gap-8 mb-12">
            <div>
              <div className="text-4xl font-bold" style={{ color: primaryColor }}>{userRating.toFixed(1)}</div>
              <div className="text-sm text-gray-400">Рейтинг</div>
            </div>
            <div className="w-px h-12 bg-gray-700"></div>
            <div>
              <div className="text-4xl font-bold">{reviewCount}</div>
              <div className="text-sm text-gray-400">Отзива</div>
            </div>
            <div className="w-px h-12 bg-gray-700"></div>
            <div>
              <div className="text-4xl font-bold">{profile.services.length}</div>
              <div className="text-sm text-gray-400">Услуги</div>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={onContact}
            className="group inline-flex items-center gap-3 px-10 py-5 text-xl font-bold uppercase tracking-wide transition-all hover:gap-5"
            style={{ backgroundColor: primaryColor }}
          >
            Свържи се
            <ArrowRight size={24} className="transition-transform group-hover:translate-x-2" />
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown size={32} className="text-gray-500" />
        </div>
      </div>

      {/* Content Section */}
      <div className="relative">
        {/* Section Navigation */}
        <div className="sticky top-0 z-20 bg-black/90 backdrop-blur-lg border-b border-gray-800">
          <div className="max-w-6xl mx-auto flex">
            {[
              { id: 'services', label: 'УСЛУГИ' },
              { id: 'gallery', label: 'ГАЛЕРИЯ' },
              { id: 'about', label: 'ЗА МЕН' },
              { id: 'contact', label: 'КОНТАКТИ' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`flex-1 py-5 font-bold uppercase tracking-widest text-sm transition-all border-b-4 ${
                  activeSection === tab.id
                    ? 'text-white'
                    : 'text-gray-600 hover:text-gray-400 border-transparent'
                }`}
                style={activeSection === tab.id ? { borderColor: primaryColor, color: primaryColor } : {}}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 py-16">
          {/* Services - Accordion Style */}
          {activeSection === 'services' && (
            <div className="space-y-2">
              {profile.services.length === 0 ? (
                <p className="text-center text-gray-500 py-20 text-xl">Няма добавени услуги</p>
              ) : (
                profile.services.map((service, index) => (
                  <div 
                    key={service.id}
                    className="border-b border-gray-800"
                  >
                    <button
                      onClick={() => setExpandedService(expandedService === service.id ? null : service.id)}
                      className="w-full py-6 flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-6">
                        <span className="text-5xl font-black text-gray-800 group-hover:text-gray-700 transition-colors">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <div className="text-left">
                          <h3 className="text-2xl font-bold uppercase tracking-wide group-hover:translate-x-2 transition-transform flex items-center gap-3">
                            {service.name}
                            {service.popular && (
                              <span 
                                className="px-3 py-1 text-xs font-bold uppercase"
                                style={{ backgroundColor: primaryColor }}
                              >
                                Hot
                              </span>
                            )}
                          </h3>
                        </div>
                      </div>
                      {profile.showPrices && (
                        <span className="text-3xl font-bold" style={{ color: primaryColor }}>
                          {service.price} €
                        </span>
                      )}
                    </button>
                    {expandedService === service.id && (
                      <div className="pb-6 pl-20 text-gray-400">
                        <p className="text-lg">{service.description}</p>
                        {service.duration && (
                          <p className="mt-2 text-sm flex items-center gap-2">
                            <Clock size={14} /> {service.duration}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Gallery - Masonry-like */}
          {activeSection === 'gallery' && (
            <div>
              {profile.gallery.length === 0 ? (
                <p className="text-center text-gray-500 py-20 text-xl">Няма добавени снимки</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {profile.gallery.map((item, index) => (
                    <div 
                      key={item.id}
                      className={`relative overflow-hidden group ${
                        index % 5 === 0 ? 'col-span-2 row-span-2' : ''
                      }`}
                    >
                      <img
                        src={item.url}
                        alt={item.caption || ''}
                        className="w-full h-full object-cover aspect-square transition-transform duration-700 group-hover:scale-110"
                      />
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end"
                        style={{ background: `linear-gradient(to top, ${primaryColor}CC, transparent)` }}
                      >
                        <p className="p-4 text-white font-bold uppercase tracking-wide">
                          {item.caption}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* About */}
          {activeSection === 'about' && (
            <div className="max-w-3xl mx-auto">
              <h2 className="text-5xl font-black uppercase mb-8">
                За <span style={{ color: primaryColor }}>мен</span>
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed whitespace-pre-line">
                {profile.aboutMe || 'Няма добавена информация'}
              </p>

              {profile.certifications.length > 0 && (
                <div className="mt-16">
                  <h3 className="text-3xl font-black uppercase mb-8">
                    Сертификати
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {profile.certifications.map((cert) => (
                      <div 
                        key={cert.id}
                        className="p-6 border-l-4"
                        style={{ borderColor: primaryColor, backgroundColor: `${primaryColor}10` }}
                      >
                        <p className="font-bold text-lg">{cert.name}</p>
                        <p className="text-gray-500">{cert.issuer} • {cert.year}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Contact */}
          {activeSection === 'contact' && (
            <div className="max-w-3xl mx-auto">
              <h2 className="text-5xl font-black uppercase mb-12">
                Свържи <span style={{ color: primaryColor }}>се</span>
              </h2>

              <div className="space-y-4">
                {profile.showPhone && profile.contactPhone && (
                  <a 
                    href={`tel:${profile.contactPhone}`}
                    className="flex items-center justify-between p-6 bg-gray-900 hover:bg-gray-800 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-14 h-14 flex items-center justify-center"
                        style={{ backgroundColor: primaryColor }}
                      >
                        <Phone size={24} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 uppercase tracking-wide">Телефон</p>
                        <p className="text-2xl font-bold">{profile.contactPhone}</p>
                      </div>
                    </div>
                    <ArrowRight size={24} className="text-gray-600 group-hover:text-white group-hover:translate-x-2 transition-all" />
                  </a>
                )}

                {profile.showEmail && profile.contactEmail && (
                  <a 
                    href={`mailto:${profile.contactEmail}`}
                    className="flex items-center justify-between p-6 bg-gray-900 hover:bg-gray-800 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-14 h-14 flex items-center justify-center"
                        style={{ backgroundColor: primaryColor }}
                      >
                        <Mail size={24} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 uppercase tracking-wide">Email</p>
                        <p className="text-2xl font-bold">{profile.contactEmail}</p>
                      </div>
                    </div>
                    <ArrowRight size={24} className="text-gray-600 group-hover:text-white group-hover:translate-x-2 transition-all" />
                  </a>
                )}

                {profile.whatsapp && (
                  <a 
                    href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-6 bg-green-900/30 hover:bg-green-900/50 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-green-500 flex items-center justify-center">
                        <span className="text-2xl">💬</span>
                      </div>
                      <div>
                        <p className="text-sm text-green-400 uppercase tracking-wide">WhatsApp</p>
                        <p className="text-2xl font-bold">Пиши ми директно</p>
                      </div>
                    </div>
                    <ArrowRight size={24} className="text-green-600 group-hover:text-green-400 group-hover:translate-x-2 transition-all" />
                  </a>
                )}

                <div className="flex items-center gap-4 p-6 bg-gray-900">
                  <div 
                    className="w-14 h-14 flex items-center justify-center"
                    style={{ backgroundColor: `${primaryColor}30` }}
                  >
                    <MapPin size={24} style={{ color: primaryColor }} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wide">Локация</p>
                    <p className="text-2xl font-bold">
                      {profile.city}{profile.neighborhood ? `, ${profile.neighborhood}` : ''}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8 border-t border-gray-800">
        <button onClick={onShare} className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors">
          <Share2 size={18} />
          Сподели профила
        </button>
        <p className="mt-4 text-gray-600">
          Профил в <span className="font-bold" style={{ color: primaryColor }}>Rabotim.com</span>
        </p>
      </div>
    </div>
  )
}

