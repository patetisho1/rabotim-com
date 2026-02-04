'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Image as ImageIcon, Loader2, Palette } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import {
  artistOrderTypeLabels,
  defaultArtistOrderSizes,
  type ArtistOrderType
} from '@/types/artist'

export default function ArtistOrderPage() {
  const params = useParams()
  const router = useRouter()
  const username = params.username as string

  const [profile, setProfile] = useState<{
    id: string
    displayName: string
    isArtist: boolean
    revolutEnabled: boolean
    revolutBarcodeUrl: string | null
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [orderType, setOrderType] = useState<ArtistOrderType>('portrait')
  const [size, setSize] = useState('30x40')
  const [referencePhotoUrl, setReferencePhotoUrl] = useState('')
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/professional-profiles/${username}`)
        if (!res.ok) {
          if (res.status === 404) {
            setProfile(null)
            return
          }
          throw new Error('Failed to load profile')
        }
        const data = await res.json()
        const p = data.profile
        if (!p?.isArtist || !p?.id) {
          setProfile(null)
          return
        }
        setProfile({
          id: p.id,
          displayName: p.displayName || p.display_name || username,
          isArtist: p.isArtist ?? p.is_artist,
          revolutEnabled: p.revolutEnabled ?? p.revolut_enabled,
          revolutBarcodeUrl: p.revolutBarcodeUrl ?? p.revolut_barcode_url ?? null
        })
      } catch {
        setProfile(null)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [username])

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingPhoto(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'artist-orders')
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data?.file?.url) {
        setReferencePhotoUrl(data.file.url)
        toast.success('Снимката е качена')
      } else {
        toast.error(data?.error || 'Грешка при качване')
      }
    } catch {
      toast.error('Грешка при качване')
    } finally {
      setUploadingPhoto(false)
      e.target.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return
    if (!referencePhotoUrl) {
      toast.error('Моля, качете референтна снимка')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/artist-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          professional_profile_id: profile.id,
          order_type: orderType,
          size,
          reference_photo_url: referencePhotoUrl,
          customer_name: customerName || undefined,
          customer_email: customerEmail || undefined,
          customer_phone: customerPhone || undefined,
          notes: notes || undefined
        })
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data?.error || 'Неуспешна поръчка')
        return
      }
      toast.success('Поръчката е изпратена! Художникът ще се свърже с вас.')
      router.push(`/p/${username}`)
    } catch {
      toast.error('Възникна грешка')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-amber-500" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Профилът не приема поръчки или не е намерен.</p>
          <Link href={`/p/${username}`} className="text-amber-600 hover:underline">
            Назад към профила
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-xl mx-auto px-4 py-8">
        <Link
          href={`/p/${username}`}
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6"
        >
          <ArrowLeft size={18} />
          Назад към профила
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
            <Palette size={24} className="text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Поръчай картина
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              при {profile.displayName}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Тип *
            </label>
            <select
              value={orderType}
              onChange={(e) => setOrderType(e.target.value as ArtistOrderType)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              required
            >
              {(Object.entries(artistOrderTypeLabels) as [ArtistOrderType, string][]).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Размер *
            </label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              required
            >
              {defaultArtistOrderSizes.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Референтна снимка *
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Качете снимката, по която да бъде изработена картината/портретът (от телефон или компютър).
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <label className="flex-1 flex items-center justify-center gap-2 px-4 py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                  disabled={uploadingPhoto}
                />
                {uploadingPhoto ? (
                  <Loader2 size={24} className="animate-spin text-amber-500" />
                ) : (
                  <ImageIcon size={24} className="text-gray-400" />
                )}
                <span className="text-gray-600 dark:text-gray-400">
                  {referencePhotoUrl ? 'Снимката е качена' : 'Изберете или плъзнете снимка'}
                </span>
              </label>
            </div>
            {referencePhotoUrl && (
              <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 max-w-[200px]">
                <img src={referencePhotoUrl} alt="Референция" className="w-full h-auto object-cover" />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Име
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Вашето име"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Телефон
            </label>
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="+359 888 123 456"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Бележки
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Допълнителни указания за художника..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none"
            />
          </div>

          {profile.revolutEnabled && profile.revolutBarcodeUrl && (
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
              <p className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                Плащане с Revolut
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                След изпращане на поръчката можете да платите чрез Revolut, като сканирате баркода по-долу или използвате линка в приложението.
              </p>
              <div className="flex justify-center p-2 bg-white dark:bg-gray-800 rounded-lg inline-block">
                <img
                  src={profile.revolutBarcodeUrl}
                  alt="Revolut баркод за плащане"
                  className="max-h-32 w-auto object-contain"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !referencePhotoUrl}
            className="w-full py-3 px-4 rounded-xl font-medium bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors flex items-center justify-center gap-2"
          >
            {submitting ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                <Palette size={20} />
                Изпрати поръчка
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
