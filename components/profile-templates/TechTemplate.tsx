'use client'

import { useState } from 'react'
import { 
  MapPin, Phone, Mail, Clock, Star, CheckCircle, Share2, 
  MessageCircle, Terminal, Code, Cpu, Database, Globe
} from 'lucide-react'
import { TemplateProps } from './TemplateRenderer'

const dayTranslations: Record<string, string> = {
  monday: 'MON', tuesday: 'TUE', wednesday: 'WED',
  thursday: 'THU', friday: 'FRI', saturday: 'SAT', sunday: 'SUN'
}

export default function TechTemplate({ 
  profile, templateConfig, professionConfig, isPreview,
  onContact, onShare, onBook, userRating, reviewCount 
}: TemplateProps) {
  const [activeSection, setActiveSection] = useState<'services' | 'gallery' | 'about' | 'contact'>('services')
  const primaryColor = profile.primaryColor || '#06B6D4' // Cyan

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100 font-mono">
      {/* Matrix-like background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 35px, ${primaryColor} 35px, ${primaryColor} 36px),
                           repeating-linear-gradient(90deg, transparent, transparent 35px, ${primaryColor} 35px, ${primaryColor} 36px)`,
        }}></div>
      </div>

      {/* Header Terminal */}
      <div className="sticky top-0 z-20 bg-[#0a0a0f]/95 backdrop-blur border-b" style={{ borderColor: `${primaryColor}30` }}>
        <div className="max-w-5xl mx-auto px-4 py-2 flex items-center gap-4 text-sm">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="flex-1 text-center">
            <span className="text-gray-500">~/profiles/</span>
            <span style={{ color: primaryColor }}>{profile.username || 'professional'}</span>
          </div>
          <button onClick={onShare} className="text-gray-500 hover:text-white transition-colors">
            <Share2 size={16} />
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left - Terminal Style Info */}
          <div>
            <div className="mb-6">
              <span className="text-gray-500">$</span>
              <span className="ml-2" style={{ color: primaryColor }}>whoami</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gray-500">&gt;</span> {profile.displayName}
            </h1>

            <div className="space-y-2 text-gray-400 mb-8">
              <p>
                <span style={{ color: primaryColor }}>profession:</span> "{profile.professionTitle}"
              </p>
              <p>
                <span style={{ color: primaryColor }}>location:</span> "{profile.city}{profile.neighborhood ? `, ${profile.neighborhood}` : ''}"
              </p>
              <p>
                <span style={{ color: primaryColor }}>rating:</span> {userRating.toFixed(1)} <span className="text-gray-600">// {reviewCount} reviews</span>
              </p>
            </div>

            <p className="text-gray-400 border-l-2 pl-4 mb-8" style={{ borderColor: primaryColor }}>
              {profile.tagline}
            </p>

            <div className="flex gap-4">
              <button
                onClick={onContact}
                className="flex items-center gap-2 px-6 py-3 font-medium transition-all hover:bg-opacity-90"
                style={{ backgroundColor: primaryColor, color: '#0a0a0f' }}
              >
                <Terminal size={18} />
                ./contact --now
              </button>
              <button
                onClick={onShare}
                className="px-4 py-3 border transition-colors hover:bg-white/5"
                style={{ borderColor: primaryColor, color: primaryColor }}
              >
                share
              </button>
            </div>
          </div>

          {/* Right - Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 border rounded-lg" style={{ borderColor: `${primaryColor}30`, backgroundColor: `${primaryColor}05` }}>
              <Code size={24} style={{ color: primaryColor }} className="mb-3" />
              <div className="text-3xl font-bold">{profile.services.length}</div>
              <div className="text-sm text-gray-500">Услуги</div>
            </div>
            <div className="p-6 border rounded-lg" style={{ borderColor: `${primaryColor}30`, backgroundColor: `${primaryColor}05` }}>
              <Star size={24} style={{ color: primaryColor }} className="mb-3" />
              <div className="text-3xl font-bold">{userRating.toFixed(1)}</div>
              <div className="text-sm text-gray-500">Рейтинг</div>
            </div>
            <div className="p-6 border rounded-lg" style={{ borderColor: `${primaryColor}30`, backgroundColor: `${primaryColor}05` }}>
              <Database size={24} style={{ color: primaryColor }} className="mb-3" />
              <div className="text-3xl font-bold">{profile.gallery.length}</div>
              <div className="text-sm text-gray-500">Проекти</div>
            </div>
            <div className="p-6 border rounded-lg" style={{ borderColor: `${primaryColor}30`, backgroundColor: `${primaryColor}05` }}>
              <CheckCircle size={24} style={{ color: primaryColor }} className="mb-3" />
              <div className="text-3xl font-bold">{profile.certifications.length}</div>
              <div className="text-sm text-gray-500">Сертификати</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-y" style={{ borderColor: `${primaryColor}30` }}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex">
            {[
              { id: 'services', label: 'services.json' },
              { id: 'gallery', label: 'portfolio/' },
              { id: 'about', label: 'README.md' },
              { id: 'contact', label: 'contact.config' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`py-4 px-6 text-sm transition-all border-b-2 ${
                  activeSection === tab.id
                    ? 'border-current'
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
                style={activeSection === tab.id ? { color: primaryColor } : {}}
              >
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
          <div>
            <div className="mb-6 text-gray-500">
              <span style={{ color: primaryColor }}>const</span> services = [
            </div>
            {profile.services.length === 0 ? (
              <p className="text-center text-gray-500 py-12">// No services defined</p>
            ) : (
              <div className="space-y-4 pl-4">
                {profile.services.map((service, index) => (
                  <div 
                    key={service.id}
                    className="p-4 border-l-2 hover:bg-white/5 transition-colors"
                    style={{ borderColor: service.popular ? primaryColor : 'transparent' }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-gray-500">{`{`}</span>
                        <div className="pl-4 space-y-1">
                          <p>
                            <span className="text-purple-400">name:</span> 
                            <span className="text-green-400"> "{service.name}"</span>
                            {service.popular && <span className="text-yellow-500 ml-2">// 🔥 popular</span>}
                          </p>
                          <p>
                            <span className="text-purple-400">description:</span> 
                            <span className="text-gray-400"> "{service.description}"</span>
                          </p>
                          {service.duration && (
                            <p>
                              <span className="text-purple-400">duration:</span> 
                              <span className="text-orange-400"> "{service.duration}"</span>
                            </p>
                          )}
                          {profile.showPrices && (
                            <p>
                              <span className="text-purple-400">price:</span> 
                              <span style={{ color: primaryColor }}> {service.price}</span>
                              <span className="text-gray-500"> // €</span>
                            </p>
                          )}
                        </div>
                        <span className="text-gray-500">{`}`}{index < profile.services.length - 1 ? ',' : ''}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="text-gray-500">];</div>
          </div>
        )}

        {/* Gallery */}
        {activeSection === 'gallery' && (
          <div>
            <div className="mb-6 text-gray-500">
              <span style={{ color: primaryColor }}>ls</span> -la portfolio/
            </div>
            {profile.gallery.length === 0 ? (
              <p className="text-center text-gray-500 py-12">// Directory empty</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {profile.gallery.map((item) => (
                  <div key={item.id} className="group relative border" style={{ borderColor: `${primaryColor}30` }}>
                    <img
                      src={item.url}
                      alt={item.caption || ''}
                      className="w-full aspect-square object-cover transition-opacity group-hover:opacity-80"
                    />
                    <div className="absolute inset-0 flex items-end p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-sm text-gray-300">{item.caption || 'project.img'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* About */}
        {activeSection === 'about' && (
          <div className="prose prose-invert max-w-none">
            <div className="text-gray-500 mb-4">
              <span style={{ color: primaryColor }}>cat</span> README.md
            </div>
            <div className="border-l-4 pl-6 space-y-6" style={{ borderColor: primaryColor }}>
              <div>
                <h2 className="text-xl font-bold mb-3" style={{ color: primaryColor }}># За мен</h2>
                <p className="text-gray-300 whitespace-pre-line">{profile.aboutMe || 'No description available.'}</p>
              </div>

              {profile.certifications.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold mb-3" style={{ color: primaryColor }}># Сертификати</h2>
                  <ul className="space-y-2">
                    {profile.certifications.map((cert) => (
                      <li key={cert.id} className="flex items-center gap-2 text-gray-300">
                        <span style={{ color: primaryColor }}>✓</span>
                        {cert.name} <span className="text-gray-500">({cert.issuer}, {cert.year})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {profile.serviceArea && profile.serviceArea.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold mb-3" style={{ color: primaryColor }}># Локации</h2>
                  <div className="flex flex-wrap gap-2">
                    {profile.serviceArea.map((area, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 text-sm border"
                        style={{ borderColor: primaryColor, color: primaryColor }}
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contact */}
        {activeSection === 'contact' && (
          <div>
            <div className="text-gray-500 mb-6">
              <span style={{ color: primaryColor }}>cat</span> contact.config
            </div>
            <div className="space-y-4 font-mono">
              {profile.showPhone && profile.contactPhone && (
                <a 
                  href={`tel:${profile.contactPhone}`}
                  className="flex items-center gap-4 p-4 border hover:bg-white/5 transition-colors"
                  style={{ borderColor: `${primaryColor}30` }}
                >
                  <Phone size={20} style={{ color: primaryColor }} />
                  <div>
                    <span className="text-gray-500">phone = </span>
                    <span className="text-green-400">"{profile.contactPhone}"</span>
                  </div>
                </a>
              )}

              {profile.showEmail && profile.contactEmail && (
                <a 
                  href={`mailto:${profile.contactEmail}`}
                  className="flex items-center gap-4 p-4 border hover:bg-white/5 transition-colors"
                  style={{ borderColor: `${primaryColor}30` }}
                >
                  <Mail size={20} style={{ color: primaryColor }} />
                  <div>
                    <span className="text-gray-500">email = </span>
                    <span className="text-green-400">"{profile.contactEmail}"</span>
                  </div>
                </a>
              )}

              {profile.whatsapp && (
                <a 
                  href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 border border-green-500/30 bg-green-500/10 hover:bg-green-500/20 transition-colors"
                >
                  <Globe size={20} className="text-green-400" />
                  <div>
                    <span className="text-gray-500">whatsapp = </span>
                    <span className="text-green-400">"connected"</span>
                  </div>
                </a>
              )}

              {/* Working Hours */}
              {profile.workingHours.length > 0 && (
                <div className="mt-8 p-4 border" style={{ borderColor: `${primaryColor}30` }}>
                  <div className="text-gray-500 mb-4"># working_hours</div>
                  <div className="grid grid-cols-7 gap-2 text-center text-sm">
                    {profile.workingHours.map((wh) => (
                      <div 
                        key={wh.day}
                        className={`p-2 ${wh.isOpen ? '' : 'opacity-30'}`}
                      >
                        <p style={{ color: primaryColor }}>{dayTranslations[wh.day]}</p>
                        <p className="text-gray-400 text-xs mt-1">
                          {wh.isOpen ? `${wh.openTime?.slice(0,5)}` : 'OFF'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center py-8 border-t text-sm text-gray-500" style={{ borderColor: `${primaryColor}30` }}>
        <p>
          <span className="text-gray-600">//</span> Powered by{' '}
          <span style={{ color: primaryColor }}>Rabotim.com</span>
        </p>
      </div>
    </div>
  )
}

