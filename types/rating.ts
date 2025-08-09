export interface Rating {
  id: string
  taskId: string
  reviewerId: string // Който дава рейтинга
  reviewedUserId: string // Който получава рейтинга
  rating: number // 1-5 звезди
  comment: string
  category: 'quality' | 'communication' | 'punctuality' | 'overall'
  createdAt: Date
  isVerified: boolean // Дали рейтингът е от завършена задача
}

export interface Review {
  id: string
  taskId: string
  reviewerId: string
  reviewedUserId: string
  rating: number
  title: string
  comment: string
  pros?: string[] // Предимства
  cons?: string[] // Недостатъци
  tags?: string[] // Тагове (напр. "професионален", "бърз", "надежден")
  createdAt: Date
  updatedAt?: Date
  isVerified: boolean
  helpfulCount: number // Колко хора са намерили полезен
  reportedCount: number // Колко пъти е докладван
}

export interface UserRating {
  userId: string
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    '1': number
    '2': number
    '3': number
    '4': number
    '5': number
  }
  categoryRatings: {
    quality: number
    communication: number
    punctuality: number
    overall: number
  }
  recentReviews: Review[]
  badges: string[] // Награди (напр. "Топ изпълнител", "Надежден")
}

export interface RatingFilters {
  minRating?: number
  maxRating?: number
  category?: string
  verifiedOnly?: boolean
  dateRange?: {
    from: Date
    to: Date
  }
  tags?: string[]
} 