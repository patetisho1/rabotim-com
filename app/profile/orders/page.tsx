'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Palette,
  Loader2,
  Image as ImageIcon,
  Mail,
  Phone,
  User,
  FileText,
  ChevronDown
} from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import {
  type ArtistOrder,
  type ArtistOrderStatus,
  artistOrderTypeLabels,
  artistOrderStatusLabels,
  defaultArtistOrderSizes
} from '@/types/artist'

const ALLOWED_FOR_UPDATE: ArtistOrderStatus[] = ['confirmed', 'in_progress', 'completed', 'cancelled']

export default function ArtistOrdersPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState<ArtistOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.push('/login')
      return
    }
    loadOrders()
  }, [user, authLoading])

  const loadOrders = async () => {
    try {
      const res = await fetch('/api/artist-orders')
      if (res.status === 401) {
        router.push('/login')
        return
      }
      const data = await res.json()
      setOrders(Array.isArray(data.orders) ? data.orders : [])
    } catch {
      toast.error('Грешка при зареждане на поръчките')
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (orderId: string, status: ArtistOrderStatus) => {
    setUpdatingId(orderId)
    try {
      const res = await fetch(`/api/artist-orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data?.error || 'Неуспешна промяна')
        return
      }
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status, updated_at: data.order?.updated_at || o.updated_at } : o))
      )
      toast.success('Статусът е обновен')
    } catch {
      toast.error('Възникна грешка')
    } finally {
      setUpdatingId(null)
    }
  }

  const getSizeLabel = (size: string) =>
    defaultArtistOrderSizes.find((s) => s.id === size)?.label || size

  if (authLoading || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/profile"
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                <Palette size={20} className="text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Моите поръчки
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Поръчки за картини и портрети
                </p>
              </div>
            </div>
          </div>
          <Link
            href="/profile/professional"
            className="text-sm text-amber-600 dark:text-amber-400 hover:underline"
          >
            Професионален профил
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={32} className="animate-spin text-amber-500" />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
            <Palette size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Нямате поръчки
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Когато включите „Профил за художник“ в професионалния си профил и получите поръчки за картини или портрети, те ще се показват тук.
            </p>
            <Link
              href="/profile/professional"
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
            >
              Настройки на профила
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    {/* Reference photo */}
                    <div className="flex-shrink-0">
                      <a
                        href={order.reference_photo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                      >
                        <img
                          src={order.reference_photo_url}
                          alt="Референция"
                          className="w-full h-full object-cover"
                        />
                      </a>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded-md text-sm font-medium bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200">
                          {artistOrderTypeLabels[order.order_type]}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {getSizeLabel(order.size)}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          {new Date(order.created_at).toLocaleDateString('bg-BG', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>

                      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        {(order.customer_name || order.customer_email || order.customer_phone) && (
                          <div className="flex flex-wrap gap-x-4 gap-y-1">
                            {order.customer_name && (
                              <span className="flex items-center gap-1">
                                <User size={14} />
                                {order.customer_name}
                              </span>
                            )}
                            {order.customer_email && (
                              <a
                                href={`mailto:${order.customer_email}`}
                                className="flex items-center gap-1 hover:text-amber-600 dark:hover:text-amber-400"
                              >
                                <Mail size={14} />
                                {order.customer_email}
                              </a>
                            )}
                            {order.customer_phone && (
                              <a
                                href={`tel:${order.customer_phone}`}
                                className="flex items-center gap-1 hover:text-amber-600 dark:hover:text-amber-400"
                              >
                                <Phone size={14} />
                                {order.customer_phone}
                              </a>
                            )}
                          </div>
                        )}
                        {order.notes && (
                          <p className="flex items-start gap-1 mt-2">
                            <FileText size={14} className="flex-shrink-0 mt-0.5" />
                            <span>{order.notes}</span>
                          </p>
                        )}
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <label className="flex items-center gap-2 text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Статус:</span>
                          <select
                            value={order.status}
                            onChange={(e) => {
                              const newStatus = e.target.value as ArtistOrderStatus
                              if (newStatus === order.status) return
                              if (!ALLOWED_FOR_UPDATE.includes(newStatus)) return
                              updateStatus(order.id, newStatus)
                            }}
                            disabled={updatingId === order.id}
                            className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
                          >
                            <option value="pending">
                              {artistOrderStatusLabels.pending}
                            </option>
                            {ALLOWED_FOR_UPDATE.map((s) => (
                              <option key={s} value={s}>
                                {artistOrderStatusLabels[s]}
                              </option>
                            ))}
                          </select>
                        </label>
                        {updatingId === order.id && (
                          <Loader2 size={16} className="animate-spin text-amber-500" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status bar color */}
                <div
                  className="h-1"
                  style={{
                    backgroundColor:
                      order.status === 'completed'
                        ? 'var(--green-500, #22c55e)'
                        : order.status === 'cancelled'
                          ? 'var(--gray-400, #9ca3af)'
                          : order.status === 'in_progress'
                            ? 'var(--amber-500, #f59e0b)'
                            : order.status === 'confirmed'
                              ? 'var(--blue-500, #3b82f6)'
                              : 'var(--amber-400, #fbbf24)'
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
