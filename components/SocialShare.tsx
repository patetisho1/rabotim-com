'use client'

import { useState } from 'react'
import { Share2, Facebook, Twitter, Linkedin, MessageCircle, Copy, Check } from 'lucide-react'
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

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`
        break
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&hashtags=${hashtags.join(',')}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
        break
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`
        break
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`
        break
      case 'viber':
        shareUrl = `viber://forward?text=${encodedTitle}%20${encodedUrl}`
        break
      default:
        return
    }

    if (platform === 'viber') {
      // Viber doesn't work well with window.open, so we'll copy the text instead
      navigator.clipboard.writeText(`${title} ${url}`)
      toast.success('Линкът е копиран в клипборда за Viber')
      return
    }

    window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes')
    setIsOpen(false)
    toast.success(`Споделено в ${platform}`)
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
      color: 'bg-blue-600 hover:bg-blue-700',
      onClick: () => handleShare('facebook')
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-sky-500 hover:bg-sky-600',
      onClick: () => handleShare('twitter')
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-blue-700 hover:bg-blue-800',
      onClick: () => handleShare('linkedin')
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-green-600 hover:bg-green-700',
      onClick: () => handleShare('whatsapp')
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

  if (variant === 'compact') {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Share2 className="h-4 w-4" />
          Сподели
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-50">
            <div className="flex gap-2">
              {socialButtons.map((button) => (
                <button
                  key={button.name}
                  onClick={button.onClick}
                  className={`p-2 rounded-lg text-white transition-colors ${button.color}`}
                  title={button.name}
                >
                  <button.icon className="h-4 w-4" />
                </button>
              ))}
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
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-white text-sm font-medium transition-colors ${button.color}`}
              >
                <button.icon className="h-4 w-4" />
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
