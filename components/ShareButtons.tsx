'use client'

import { useState } from 'react'
import { 
  Share2, 
  Facebook, 
  MessageCircle, 
  Copy, 
  Check,
  X,
  Linkedin,
  Mail
} from 'lucide-react'

interface ShareButtonsProps {
  url: string
  title: string
  description?: string
  className?: string
  variant?: 'inline' | 'modal' | 'dropdown'
}

export default function ShareButtons({ 
  url, 
  title, 
  description = '',
  className = '',
  variant = 'inline'
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const encodedDescription = encodeURIComponent(description)

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
    viber: `viber://forward?text=${encodedTitle}%20${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleShare = (platform: keyof typeof shareLinks) => {
    const shareUrl = shareLinks[platform]
    
    // For mobile deep links (viber), try to open directly
    if (platform === 'viber') {
      window.location.href = shareUrl
      return
    }
    
    // For email
    if (platform === 'email') {
      window.location.href = shareUrl
      return
    }
    
    // For web share links, open in popup
    window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes')
  }

  // Native share API for mobile
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url
        })
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err)
        }
      }
    } else {
      setIsOpen(true)
    }
  }

  const buttonBaseClass = "flex items-center justify-center transition-all duration-200 rounded-full"
  const iconSize = 18

  // Inline variant - horizontal buttons
  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {/* Facebook */}
        <button
          onClick={() => handleShare('facebook')}
          className={`${buttonBaseClass} w-10 h-10 bg-[#1877F2] hover:bg-[#166FE5] text-white`}
          title="Сподели във Facebook"
          aria-label="Сподели във Facebook"
        >
          <Facebook size={iconSize} />
        </button>

        {/* Viber */}
        <button
          onClick={() => handleShare('viber')}
          className={`${buttonBaseClass} w-10 h-10 bg-[#7360F2] hover:bg-[#6050E0] text-white`}
          title="Сподели във Viber"
          aria-label="Сподели във Viber"
        >
          <svg viewBox="0 0 24 24" width={iconSize} height={iconSize} fill="currentColor">
            <path d="M11.398 0C9.064.067 5.012.453 2.979 2.378.688 4.545.178 7.893.03 12.11c-.147 4.218-.316 12.132 7.476 14.033l.01.001h.007l-.003 3.193s-.047.805.501.97c.661.198 1.049-.426 1.682-1.108.348-.374.827-.924 1.19-1.345l7.812.662c.475.04 3.67.078 5.088-1.39 1.532-1.59 1.401-4.633 1.227-5.388-.173-.755-1.065-4.51-5.075-7.832l-.006-.005C17.997 5.43 12.91-.067 11.398 0zm.472 2.088c5.31-.133 9.494 4.312 10.98 5.834 3.556 3.023 4.377 6.19 4.52 6.82.143.631.25 3.232-.96 4.484-1.098 1.136-3.642 1.084-4.035 1.05l-8.597-.728c-.296.34-1.508 1.736-1.897 2.142-.312.325-.655.29-.65-.324 0-.4.023-4.957.023-4.957-6.358-1.544-5.952-7.7-5.846-10.765.105-3.066 1.22-5.684 3.024-7.427 1.478-1.43 4.378-1.999 6.438-2.129zm.32 2.013c-.402.006-.8.03-1.194.073-1.577.175-2.818.614-3.692 1.306-1.352 1.07-1.95 2.567-1.95 4.323 0 1.236.406 2.291 1.207 3.136.509.537 1.15.912 1.76 1.168.305.129.602.218.868.267.266.049.399.069.413.07l.047.002a.512.512 0 0 1 .395.606.52.52 0 0 1-.604.396c-.052-.01-.225-.033-.46-.077a6.41 6.41 0 0 1-1.058-.327 6.246 6.246 0 0 1-2.128-1.404c-1.003-1.055-1.51-2.382-1.51-3.837 0-2.033.735-3.813 2.353-5.095 1.055-.836 2.503-1.36 4.312-1.56.464-.052.94-.077 1.423-.072 2.077.023 3.926.557 5.297 1.755 1.562 1.364 2.389 3.252 2.389 5.448 0 .848-.147 1.645-.44 2.372a5.823 5.823 0 0 1-1.224 1.918.515.515 0 0 1-.727.03.514.514 0 0 1-.031-.727 4.82 4.82 0 0 0 1.009-1.58c.24-.596.359-1.253.359-1.96 0-1.886-.702-3.488-2.028-4.645-1.158-1.012-2.752-1.47-4.556-1.492a8.64 8.64 0 0 0-.23-.003zm.225 1.935c.327-.003.658.015.99.054 1.21.143 2.192.543 2.929 1.195.885.783 1.337 1.883 1.337 3.267 0 .617-.1 1.183-.3 1.69a4.032 4.032 0 0 1-.848 1.31.52.52 0 0 1-.735-.013.52.52 0 0 1 .013-.736 3.032 3.032 0 0 0 .634-.977c.152-.383.229-.827.229-1.327 0-1.087-.338-1.923-1.013-2.52-.56-.494-1.338-.81-2.315-.934a5.787 5.787 0 0 0-1.368.009.52.52 0 0 1-.587-.44.52.52 0 0 1 .44-.587c.194-.029.392-.046.594-.055v.064zm.236 1.94a.52.52 0 0 1 .52.52v.001c.003.372.07.614.19.8.119.186.314.358.63.554l.013.008.012.009c.27.195.482.431.615.719.134.288.177.61.177.965v.004a.52.52 0 0 1-1.038.01c0-.262-.028-.427-.09-.559a.944.944 0 0 0-.326-.369c-.368-.23-.663-.476-.883-.82-.221-.347-.336-.74-.34-1.233v-.089a.52.52 0 0 1 .52-.52z"/>
          </svg>
        </button>

        {/* WhatsApp */}
        <button
          onClick={() => handleShare('whatsapp')}
          className={`${buttonBaseClass} w-10 h-10 bg-[#25D366] hover:bg-[#20BD5A] text-white`}
          title="Сподели в WhatsApp"
          aria-label="Сподели в WhatsApp"
        >
          <svg viewBox="0 0 24 24" width={iconSize} height={iconSize} fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </button>

        {/* LinkedIn */}
        <button
          onClick={() => handleShare('linkedin')}
          className={`${buttonBaseClass} w-10 h-10 bg-[#0A66C2] hover:bg-[#004182] text-white`}
          title="Сподели в LinkedIn"
          aria-label="Сподели в LinkedIn"
        >
          <Linkedin size={iconSize} />
        </button>

        {/* Copy Link */}
        <button
          onClick={copyToClipboard}
          className={`${buttonBaseClass} w-10 h-10 ${copied ? 'bg-green-500' : 'bg-gray-600 hover:bg-gray-700'} text-white`}
          title={copied ? 'Копирано!' : 'Копирай линк'}
          aria-label="Копирай линк"
        >
          {copied ? <Check size={iconSize} /> : <Copy size={iconSize} />}
        </button>
      </div>
    )
  }

  // Dropdown variant
  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`${buttonBaseClass} w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200`}
          title="Сподели"
          aria-label="Сподели"
        >
          <Share2 size={iconSize} />
        </button>

        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown menu */}
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
              <div className="p-2">
                <button
                  onClick={() => { handleShare('facebook'); setIsOpen(false) }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#1877F2] flex items-center justify-center text-white">
                    <Facebook size={16} />
                  </div>
                  <span className="text-gray-700 dark:text-gray-200">Facebook</span>
                </button>

                <button
                  onClick={() => { handleShare('viber'); setIsOpen(false) }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#7360F2] flex items-center justify-center text-white">
                    <MessageCircle size={16} />
                  </div>
                  <span className="text-gray-700 dark:text-gray-200">Viber</span>
                </button>

                <button
                  onClick={() => { handleShare('whatsapp'); setIsOpen(false) }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center text-white">
                    <MessageCircle size={16} />
                  </div>
                  <span className="text-gray-700 dark:text-gray-200">WhatsApp</span>
                </button>

                <button
                  onClick={() => { handleShare('telegram'); setIsOpen(false) }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#0088CC] flex items-center justify-center text-white">
                    <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                  </div>
                  <span className="text-gray-700 dark:text-gray-200">Telegram</span>
                </button>

                <button
                  onClick={() => { handleShare('linkedin'); setIsOpen(false) }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#0A66C2] flex items-center justify-center text-white">
                    <Linkedin size={16} />
                  </div>
                  <span className="text-gray-700 dark:text-gray-200">LinkedIn</span>
                </button>

                <button
                  onClick={() => { handleShare('email'); setIsOpen(false) }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white">
                    <Mail size={16} />
                  </div>
                  <span className="text-gray-700 dark:text-gray-200">Имейл</span>
                </button>

                <div className="border-t border-gray-200 dark:border-gray-700 my-2" />

                <button
                  onClick={() => { copyToClipboard(); setIsOpen(false) }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className={`w-8 h-8 rounded-full ${copied ? 'bg-green-500' : 'bg-gray-400'} flex items-center justify-center text-white`}>
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </div>
                  <span className="text-gray-700 dark:text-gray-200">
                    {copied ? 'Копирано!' : 'Копирай линк'}
                  </span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  // Modal variant - single button that opens modal (for mobile)
  return (
    <div className={className}>
      <button
        onClick={handleNativeShare}
        className={`${buttonBaseClass} w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white`}
        title="Сподели"
        aria-label="Сподели"
      >
        <Share2 size={iconSize} />
      </button>

      {/* Modal for non-native share */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50" onClick={() => setIsOpen(false)}>
          <div 
            className="w-full sm:w-96 bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl p-6 animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Сподели</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6">
              <button
                onClick={() => handleShare('facebook')}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-14 h-14 rounded-full bg-[#1877F2] flex items-center justify-center text-white">
                  <Facebook size={24} />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-300">Facebook</span>
              </button>

              <button
                onClick={() => handleShare('viber')}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-14 h-14 rounded-full bg-[#7360F2] flex items-center justify-center text-white">
                  <MessageCircle size={24} />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-300">Viber</span>
              </button>

              <button
                onClick={() => handleShare('whatsapp')}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center text-white">
                  <MessageCircle size={24} />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-300">WhatsApp</span>
              </button>

              <button
                onClick={() => handleShare('telegram')}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-14 h-14 rounded-full bg-[#0088CC] flex items-center justify-center text-white">
                  <svg viewBox="0 0 24 24" width={24} height={24} fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-300">Telegram</span>
              </button>

              <button
                onClick={() => handleShare('linkedin')}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-14 h-14 rounded-full bg-[#0A66C2] flex items-center justify-center text-white">
                  <Linkedin size={24} />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-300">LinkedIn</span>
              </button>

              <button
                onClick={() => handleShare('email')}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-14 h-14 rounded-full bg-gray-500 flex items-center justify-center text-white">
                  <Mail size={24} />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-300">Имейл</span>
              </button>

              <button
                onClick={copyToClipboard}
                className="flex flex-col items-center gap-2"
              >
                <div className={`w-14 h-14 rounded-full ${copied ? 'bg-green-500' : 'bg-gray-400'} flex items-center justify-center text-white`}>
                  {copied ? <Check size={24} /> : <Copy size={24} />}
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-300">
                  {copied ? 'Копирано!' : 'Копирай'}
                </span>
              </button>
            </div>

            {/* URL display */}
            <div className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <span className="flex-1 text-sm text-gray-600 dark:text-gray-300 truncate">{url}</span>
              <button
                onClick={copyToClipboard}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  copied 
                    ? 'bg-green-500 text-white' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {copied ? 'Копирано!' : 'Копирай'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


