'use client'

import { useState, useEffect, useRef } from 'react'
import { Share2, Facebook, Twitter, Linkedin, MessageCircle, Copy, Check, MessageSquare, Send } from 'lucide-react'
import toast from 'react-hot-toast'

interface SocialShareProps {
  url?: string
  title?: string
  description?: string
  hashtags?: string[]
  className?: string
  variant?: 'default' | 'compact' | 'minimal'
}

export default function SocialShare({
  url = typeof window !== 'undefined' ? window.location.href : '',
  title = 'Rabotim.com - Намери работа и изпълнители в България',
  description = 'Водещата платформа за намиране на почасова работа и професионални изпълнители в България',
  hashtags = ['rabotim', 'работа', 'българия', 'freelance'],
  className = '',
  variant = 'default'
}: SocialShareProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareData = {
    url,
    title,
    description,
    hashtags: hashtags.join(',')
  }

  const handleShare = (platform: string) => {
    let shareUrl = ''
    const encodedUrl = encodeURIComponent(url)
    const encodedTitle = encodeURIComponent(title)
    const encodedDescription = encodeURIComponent(description)
    const encodedHashtags = hashtags.map(tag => tag.replace(/#/g, '')).join(',')

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`
        break
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&hashtags=${encodedHashtags}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&summary=${encodedDescription}`
        break
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedTitle}%0A%0A${encodedDescription}%0A%0A${encodedUrl}`
        break
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`
        break
      case 'viber':
        // Viber mobile app uses viber:// protocol, web uses different approach
        if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
          shareUrl = `viber://forward?text=${encodedTitle}%20${encodedUrl}`
        } else {
          // For desktop, copy to clipboard with Viber format
          navigator.clipboard.writeText(`${title}\n\n${description}\n\n${url}`)
          toast.success('Линкът е копиран в клипборда за Viber')
          setIsOpen(false)
          return
        }
        break
      default:
        return
    }

    if (platform === 'viber' && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      // Try to open Viber app, if it fails, copy to clipboard
      window.location.href = shareUrl
      setTimeout(() => {
        navigator.clipboard.writeText(`${title}\n\n${description}\n\n${url}`)
        toast.success('Ако Viber не се отвори, линкът е копиран в клипборда')
      }, 500)
      setIsOpen(false)
      return
    }

    window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes')
    setIsOpen(false)
    
    const platformNames: Record<string, string> = {
      'facebook': 'Facebook',
      'twitter': 'Twitter/X',
      'linkedin': 'LinkedIn',
      'whatsapp': 'WhatsApp',
      'telegram': 'Telegram',
      'viber': 'Viber'
    }
    toast.success(`Отваряне на ${platformNames[platform] || platform}...`)
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success('Линкът е копиран в клипборда!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Грешка при копиране на линка')
    }
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url
        })
        toast.success('Споделено успешно!')
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      setIsOpen(!isOpen)
    }
  }

  const socialButtons = [
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-[#1877F2] hover:bg-[#166FE5]',
      onClick: () => handleShare('facebook')
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-[#0A66C2] hover:bg-[#095195]',
      onClick: () => handleShare('linkedin')
    },
    {
      name: 'Twitter/X',
      icon: Twitter,
      color: 'bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200',
      iconColor: 'text-white dark:text-black',
      onClick: () => handleShare('twitter')
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-[#25D366] hover:bg-[#20BA5A]',
      onClick: () => handleShare('whatsapp')
    },
    {
      name: 'Telegram',
      icon: Send,
      color: 'bg-[#0088cc] hover:bg-[#0077b5]',
      onClick: () => handleShare('telegram')
    },
    {
      name: 'Viber',
      icon: MessageSquare,
      color: 'bg-[#665CAC] hover:bg-[#5A5099]',
      onClick: () => handleShare('viber')
    }
  ]

  if (variant === 'minimal') {
    return (
      <button
        onClick={handleNativeShare}
        className={`flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors ${className}`}
      >
        <Share2 className="h-4 w-4" />
        Сподели
      </button>
    )
  }

  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  if (variant === 'compact') {
    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Сподели задачата"
        >
          <Share2 className="h-4 w-4" />
          Сподели
        </button>

        {isOpen && (
          <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-3 z-50 min-w-[200px]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Сподели в:
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm"
                aria-label="Затвори"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {socialButtons.map((button) => (
                <button
                  key={button.name}
                  onClick={button.onClick}
                  className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg text-white transition-colors ${button.color} ${button.iconColor || ''}`}
                  title={button.name}
                  aria-label={`Сподели в ${button.name}`}
                >
                  <button.icon className={`h-4 w-4 ${button.iconColor || ''}`} />
                  <span className="text-[10px] font-medium">{button.name}</span>
                </button>
              ))}
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
              <button
                onClick={handleCopyLink}
                className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  copied
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Копирано!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Копирай линк
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={handleNativeShare}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <Share2 className="h-4 w-4" />
        Сподели
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-50 min-w-[280px]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Сподели в социалните мрежи
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            {socialButtons.map((button) => (
              <button
                key={button.name}
                onClick={button.onClick}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-white text-sm font-medium transition-colors ${button.color} ${button.iconColor || ''}`}
              >
                <button.icon className={`h-4 w-4 ${button.iconColor || ''}`} />
                {button.name}
              </button>
            ))}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={url}
                readOnly
                className="flex-1 px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300"
              />
              <button
                onClick={handleCopyLink}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  copied
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 inline mr-1" />
                    Копирано
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 inline mr-1" />
                    Копирай
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            Сподели {title}
          </div>
        </div>
      )}
    </div>
  )
}


