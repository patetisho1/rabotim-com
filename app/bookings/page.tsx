'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Filter,
  ChevronDown,
  MessageSquare,
  Loader2
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'

interface Booking {
  id: string
  professional_id: string
  professional_user_id: string
  client_user_id: string | null
  client_name: string
  client_email: string
  client_phone: string | null
  service_name: string | null
  booking_date: string
  start_time: string
  end_time: string | null
  duration_minutes: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'
  client_notes: string | null
  professional_notes: string | null
  estimated_price: number | null
  created_at: string
  professional?: {
    display_name: string
    username: string
    profession_title: string
  }
}

const statusConfig = {
  pending: { 
    label: 'Чакаща', 
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    icon: AlertCircle
  },
  confirmed: { 
    label: 'Потвърдена', 
    color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    icon: CheckCircle
  },
  cancelled: { 
    label: 'Отказана', 
    color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    icon: XCircle
  },
  completed: { 
    label: 'Завършена', 
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    icon: CheckCircle
  },
  no_show: { 
    label: 'Неявяване', 
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400',
    icon: XCircle
  }
}

export default function BookingsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'past'>('all')
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return
    
    if (!user) {
      router.push('/login?redirect=/bookings')
      return
    }

    loadBookings()
  }, [user, authLoading, filter])

  const loadBookings = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('professionalUserId', user.id)
      
      if (filter === 'pending') {
        params.set('status', 'pending')
      } else if (filter === 'confirmed') {
        params.set('status', 'confirmed')
      }

      const response = await fetch(`/api/bookings?${params}`)
      const data = await response.json()
      
      if (response.ok) {
        let filteredBookings = data.bookings || []
        
        // Filter past bookings
        if (filter === 'past') {
          const today = new Date().toISOString().split('T')[0]
          filteredBookings = filteredBookings.filter((b: Booking) => 
            b.booking_date < today || b.status === 'completed' || b.status === 'cancelled'
          )
        } else if (filter !== 'all') {
          // Already filtered by API
        } else {
          // Show only future bookings by default
          const today = new Date().toISOString().split('T')[0]
          filteredBookings = filteredBookings.filter((b: Booking) => 
            b.booking_date >= today && b.status !== 'cancelled' && b.status !== 'completed'
          )
        }
        
        setBookings(filteredBookings)
      }
    } catch (error) {
      console.error('Error loading bookings:', error)
      toast.error('Грешка при зареждане на резервациите')
    } finally {
      setLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    setUpdating(bookingId)
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        toast.success(
          newStatus === 'confirmed' 
            ? 'Резервацията е потвърдена!' 
            : 'Резервацията е отказана'
        )
        loadBookings()
      } else {
        throw new Error('Failed to update')
      }
    } catch (error) {
      toast.error('Грешка при обновяване на резервацията')
    } finally {
      setUpdating(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('bg-BG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Моите резервации
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Управлявайте заявките за резервации от клиенти
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { key: 'all', label: 'Предстоящи' },
            { key: 'pending', label: 'Чакащи' },
            { key: 'confirmed', label: 'Потвърдени' },
            { key: 'past', label: 'Минали' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key as typeof filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Няма резервации
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {filter === 'pending' 
                ? 'Нямате чакащи резервации за потвърждение.'
                : filter === 'confirmed'
                ? 'Нямате потвърдени резервации.'
                : filter === 'past'
                ? 'Нямате минали резервации.'
                : 'Когато клиент запази час, ще видите резервацията тук.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const StatusIcon = statusConfig[booking.status].icon
              return (
                <div 
                  key={booking.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
                >
                  {/* Header */}
                  <div className="px-4 sm:px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[booking.status].color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig[booking.status].label}
                      </span>
                      {booking.service_name && (
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {booking.service_name}
                        </span>
                      )}
                    </div>
                    {booking.estimated_price && (
                      <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {booking.estimated_price} €
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="px-4 sm:px-6 py-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Date & Time */}
                      <div>
                        <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100 font-medium mb-1">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          {formatDate(booking.booking_date)}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Clock className="w-4 h-4" />
                          {booking.start_time}
                          {booking.duration_minutes && (
                            <span className="text-sm">
                              ({booking.duration_minutes} мин.)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Client Info */}
                      <div>
                        <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100 font-medium mb-1">
                          <User className="w-4 h-4 text-blue-600" />
                          {booking.client_name}
                        </div>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400">
                          <a 
                            href={`mailto:${booking.client_email}`}
                            className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                          >
                            <Mail className="w-4 h-4" />
                            {booking.client_email}
                          </a>
                          {booking.client_phone && (
                            <a 
                              href={`tel:${booking.client_phone}`}
                              className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                            >
                              <Phone className="w-4 h-4" />
                              {booking.client_phone}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Client Notes */}
                    {booking.client_notes && (
                      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          <MessageSquare className="w-4 h-4" />
                          Бележка от клиента:
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {booking.client_notes}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {booking.status === 'pending' && (
                    <div className="px-4 sm:px-6 py-3 bg-gray-50 dark:bg-gray-700/30 flex flex-wrap gap-2">
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                        disabled={updating === booking.id}
                        className="flex-1 sm:flex-none px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {updating === booking.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        Потвърди
                      </button>
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                        disabled={updating === booking.id}
                        className="flex-1 sm:flex-none px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Откажи
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

