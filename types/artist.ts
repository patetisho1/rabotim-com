// Artist premium: orders for paintings (portrait/painting by photo), sizes, Revolut

export type ArtistOrderType = 'portrait' | 'painting'

export const artistOrderTypeLabels: Record<ArtistOrderType, string> = {
  portrait: 'Портрет',
  painting: 'Картина'
}

// Размери в см (ширина x височина) – може да се разшири по-късно от профила
export const defaultArtistOrderSizes = [
  { id: '30x40', label: '30 × 40 cm' },
  { id: '40x50', label: '40 × 50 cm' },
  { id: '50x70', label: '50 × 70 cm' },
  { id: '60x80', label: '60 × 80 cm' },
  { id: 'custom', label: 'Друг размер (по уговорка)' }
] as const

export type ArtistOrderStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'

export const artistOrderStatusLabels: Record<ArtistOrderStatus, string> = {
  pending: 'Чака потвърждение',
  confirmed: 'Потвърдена',
  in_progress: 'В работа',
  completed: 'Завършена',
  cancelled: 'Отменена'
}

export interface ArtistOrder {
  id: string
  professional_profile_id: string
  customer_name: string | null
  customer_email: string | null
  customer_phone: string | null
  order_type: ArtistOrderType
  size: string
  reference_photo_url: string
  notes: string | null
  status: ArtistOrderStatus
  created_at: string
  updated_at: string
}

export interface ArtistOrderCreate {
  professional_profile_id: string
  customer_name?: string
  customer_email?: string
  customer_phone?: string
  order_type: ArtistOrderType
  size: string
  reference_photo_url: string
  notes?: string
}

export interface ArtistProfileSettings {
  is_artist: boolean
  revolut_enabled: boolean
  revolut_barcode_url: string | null
}
