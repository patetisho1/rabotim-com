'use client'

import { useState } from 'react'
import { 
  Share2, 
  Facebook, 
  Copy, 
  Check,
  Linkedin,
  Twitter,
  Mail,
  MessageCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

interface ShareButtonsProps {
  url: string
  title: string
  description?: string
  image?: string
  compact?: boolean
  showLabel?: boolean
  className?: string
}

export default function ShareButtons({
  url,
  title,
  description = '',
  image,
  compact = false,
  showLabel = true,
  className = ''
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const encodedDescription = encodeURIComponent(description)

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    viber: `viber://forward?text=${encodedTitle}%20${url}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${url}`
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success('Линкът е копиран!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Грешка при копиране')
    }
  }

  const handleShare = (platform: string) => {
    const shareUrl = shareLinks[platform as keyof typeof shareLinks]
    if (shareUrl.startsWith('mailto:') || shareUrl.startsWith('viber:')) {
      window.location.href = shareUrl
    } else {
      window.open(shareUrl, '_blank', 'width=600,height=400')
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
      } catch (error) {
        // User cancelled or error
      }
    }
  }

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <button
          onClick={() => handleShare('facebook')}
          className="p-2 bg-[#1877F2] text-white rounded-full hover:bg-[#1864D9] transition-colors"
          title="Сподели във Facebook"
        >
          <Facebook size={16} />
        </button>
        <button
          onClick={() => handleShare('twitter')}
          className="p-2 bg-[#1DA1F2] text-white rounded-full hover:bg-[#1A8CD8] transition-colors"
          title="Сподели в Twitter"
        >
          <Twitter size={16} />
        </button>
        <button
          onClick={() => handleShare('whatsapp')}
          className="p-2 bg-[#25D366] text-white rounded-full hover:bg-[#20BD5A] transition-colors"
          title="Сподели в WhatsApp"
        >
          <MessageCircle size={16} />
        </button>
        <button
          onClick={handleCopyLink}
          className="p-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
          title="Копирай линк"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
    )
  }

  return (
    <div className={className}>
      {showLabel && (
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Сподели профила:
        </p>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {/* Facebook */}
        <button
          onClick={() => handleShare('facebook')}
          className="flex items-center gap-2 px-3 py-2 bg-[#1877F2] text-white rounded-lg hover:bg-[#1864D9] transition-colors text-sm"
        >
          <Facebook size={18} />
          <span>Facebook</span>
        </button>

        {/* Instagram - Copy link (Instagram doesn't support direct sharing) */}
        <button
          onClick={handleCopyLink}
          className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white rounded-lg hover:opacity-90 transition-opacity text-sm"
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
          <span>Instagram</span>
        </button>

        {/* Twitter */}
        <button
          onClick={() => handleShare('twitter')}
          className="flex items-center gap-2 px-3 py-2 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#1A8CD8] transition-colors text-sm"
        >
          <Twitter size={18} />
          <span>Twitter</span>
        </button>

        {/* LinkedIn */}
        <button
          onClick={() => handleShare('linkedin')}
          className="flex items-center gap-2 px-3 py-2 bg-[#0A66C2] text-white rounded-lg hover:bg-[#0958A8] transition-colors text-sm"
        >
          <Linkedin size={18} />
          <span>LinkedIn</span>
        </button>

        {/* WhatsApp */}
        <button
          onClick={() => handleShare('whatsapp')}
          className="flex items-center gap-2 px-3 py-2 bg-[#25D366] text-white rounded-lg hover:bg-[#20BD5A] transition-colors text-sm"
        >
          <MessageCircle size={18} />
          <span>WhatsApp</span>
        </button>

        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
          <span>{copied ? 'Копирано!' : 'Копирай'}</span>
        </button>
      </div>

      {/* Native Share (mobile) */}
      {typeof navigator !== 'undefined' && 'share' in navigator && (
        <button
          onClick={handleNativeShare}
          className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Share2 size={18} />
          <span>Още опции за споделяне</span>
        </button>
      )}
    </div>
  )
}
