import { createClient } from '@supabase/supabase-js'
import { Review, Rating } from '@/types/rating'

console.log('Environment variables:', {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET'
})

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wwbxzkbilklullziiogr.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3Ynh6a2JpbGtsdWxsemlpb2dyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNzQwMjMsImV4cCI6MjA3MjY1MDAyM30.o1GA7hqkhIn9wH3HzdpkmUEkjz13HJGixfZ9ggVCvu0'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database Types (ще се генерират от Supabase)
export interface User {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  phone?: string
  location?: string
  bio?: string
  rating: number
  total_reviews: number
  verified: boolean
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  title: string
  description: string
  category: string
  location: string
  price: number
  price_type: 'hourly' | 'fixed'
  urgent: boolean
  user_id: string
  status: 'active' | 'in_progress' | 'completed' | 'cancelled'
  applications_count: number
  views_count: number
  created_at: string
  updated_at: string
  deadline?: string
  attachments?: string[]
}


export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  receiver_id: string
  content: string
  created_at: string
  read_at?: string
  attachments?: string[]
}

export interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  message: string
  read: boolean
  created_at: string
  data?: any
  isPinned?: boolean
}

// Database functions
export const db = {
  // Users
  async getUser(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async updateUser(id: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Tasks
  async getTasks(filters?: { category?: string; location?: string; search?: string }) {
    let query = supabase
      .from('tasks')
      .select(`
        *,
        user:users(full_name, rating, avatar_url)
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (filters?.category) {
      query = query.eq('category', filters.category)
    }
    
    if (filters?.location) {
      query = query.ilike('location', `%${filters.location}%`)
    }
    
    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },

  async createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('tasks')
      .insert(task)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getTask(id: string) {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        user:users(full_name, rating, avatar_url, phone),
        applications:task_applications(
          id,
          user:users(full_name, rating, avatar_url),
          created_at,
          message
        )
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Ratings
  async getUserRatings(userId: string) {
    const { data, error } = await supabase
      .from('ratings')
      .select(`
        *,
        reviewer:profiles!reviewer_id(full_name, avatar_url),
        task:tasks(title)
      `)
      .eq('reviewed_user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async addRating(rating: Omit<Rating, 'id' | 'createdAt'>) {
    const payload = {
      task_id: rating.taskId,
      reviewer_id: rating.reviewerId,
      reviewed_user_id: rating.reviewedUserId,
      rating: rating.rating,
      comment: rating.comment,
      category: rating.category,
      is_verified: rating.isVerified ?? false
    }

    const { data, error } = await supabase
      .from('ratings')
      .insert(payload)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Reviews
  async getReviews(userId: string, filters?: { verifiedOnly?: boolean; limit?: number }) {
    let query = supabase
      .from('reviews')
      .select(`
        *,
        reviewer:profiles!reviewer_id(full_name, avatar_url),
        task:tasks(title, amount)
      `)
      .eq('reviewed_user_id', userId)
      .order('created_at', { ascending: false })

    if (filters?.verifiedOnly) {
      query = query.eq('is_verified', true)
    }

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },

  async addReview(review: Omit<Review, 'id' | 'createdAt' | 'helpfulCount' | 'reportedCount'>) {
    const payload = {
      task_id: review.taskId,
      reviewer_id: review.reviewerId,
      reviewed_user_id: review.reviewedUserId,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      pros: review.pros ?? [],
      cons: review.cons ?? [],
      tags: review.tags ?? [],
      is_verified: review.isVerified ?? false
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert(payload)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateReviewHelpful(reviewId: string, increment: boolean = true) {
    const { data, error } = await supabase
      .from('reviews')
      .update({ 
        helpful_count: increment ? supabase.rpc('increment', { table_name: 'reviews', column_name: 'helpful_count', id: reviewId }) : supabase.rpc('decrement', { table_name: 'reviews', column_name: 'helpful_count', id: reviewId })
      })
      .eq('id', reviewId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async reportReview(reviewId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .update({ 
        reported_count: supabase.rpc('increment', { table_name: 'reviews', column_name: 'reported_count', id: reviewId })
      })
      .eq('id', reviewId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // User Rating Summary
  async getUserRatingSummary(userId: string) {
    const { data, error } = await supabase
      .from('user_ratings_summary')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error) {
      if ((error as any).code === 'PGRST116') {
        return null
      }
      throw error
    }
    return data
  },

  async canUserRate(userId: string, taskId: string): Promise<{ canRate: boolean; reason: 'not_completed' | 'already_rated' | 'allowed' }> {
    // Task must be completed before ratings/reviews are allowed
    const { data: taskData, error: taskError } = await supabase
      .from('tasks')
      .select('status')
      .eq('id', taskId)
      .single()

    if (taskError) {
      console.error('canUserRate task lookup error:', taskError)
      return { canRate: false, reason: 'not_completed' }
    }

    if (!taskData || taskData.status !== 'completed') {
      return { canRate: false, reason: 'not_completed' }
    }

    // Check for existing review
    const { data: existingReview, error: reviewError } = await supabase
      .from('reviews')
      .select('id')
      .eq('task_id', taskId)
      .eq('reviewer_id', userId)
      .single()

    if (reviewError && (reviewError as any).code !== 'PGRST116') {
      throw reviewError
    }

    if (existingReview) {
      return { canRate: false, reason: 'already_rated' }
    }

    // Check for existing rating entry
    const { data: existingRating, error: ratingError } = await supabase
      .from('ratings')
      .select('id')
      .eq('task_id', taskId)
      .eq('reviewer_id', userId)
      .single()

    if (ratingError && (ratingError as any).code !== 'PGRST116') {
      throw ratingError
    }

    if (existingRating) {
      return { canRate: false, reason: 'already_rated' }
    }

    return { canRate: true, reason: 'allowed' }
  },

  async getTaskRatings(taskId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        reviewer:profiles!reviewer_id(full_name, avatar_url)
      `)
      .eq('task_id', taskId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Messages
  async getConversations(userId: string) {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        conversation_id,
        sender:users!sender_id(id, full_name, avatar_url),
        receiver:users!receiver_id(id, full_name, avatar_url),
        content,
        created_at
      `)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    // Group by conversation
    const conversations = new Map()
    data.forEach(msg => {
      if (!conversations.has(msg.conversation_id)) {
        conversations.set(msg.conversation_id, {
          id: msg.conversation_id,
          lastMessage: msg,
          participant: (msg.sender as any).id === userId ? msg.receiver : msg.sender
        })
      }
    })
    
    return Array.from(conversations.values())
  },

  async getMessages(conversationId: string) {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:users!sender_id(full_name, avatar_url)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
    
    if (error) throw error
    return data
  },

  async sendMessage(message: Omit<Message, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('messages')
      .insert(message)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Notifications
  async getNotifications(userId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50)
    
    if (error) throw error
    return data
  },

  async markNotificationRead(id: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id)
    
    if (error) throw error
  },

  async createNotification(notification: Omit<Notification, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notification)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}
