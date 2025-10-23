'use client'

import { useState, useEffect, useCallback } from 'react'
import { Rating, Review, UserRating, RatingFilters } from '@/types/rating'

export function useRatings() {
  const [ratings, setRatings] = useState<Rating[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [userRatings, setUserRatings] = useState<{ [userId: string]: UserRating }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Зареждане на рейтинги за потребител
  const loadUserRatings = useCallback(async (userId: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/ratings?userId=${userId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch ratings')
      }

      const data = await response.json()
      
      // Transform data to match our types
      const transformedRatings: Rating[] = data.ratings?.map((rating: any) => ({
        id: rating.id,
        taskId: rating.task_id,
        reviewerId: rating.reviewer_id,
        reviewedUserId: rating.reviewed_user_id,
        rating: rating.rating,
        comment: rating.comment,
        category: rating.category,
        createdAt: new Date(rating.created_at),
        isVerified: rating.is_verified
      })) || []

      const transformedReviews: Review[] = data.reviews?.map((review: any) => ({
        id: review.id,
        taskId: review.task_id,
        reviewerId: review.reviewer_id,
        reviewedUserId: review.reviewed_user_id,
        rating: review.rating,
        title: review.title,
        comment: review.comment,
        pros: review.pros || [],
        cons: review.cons || [],
        tags: review.tags || [],
        createdAt: new Date(review.created_at),
        updatedAt: review.updated_at ? new Date(review.updated_at) : undefined,
        isVerified: review.is_verified,
        helpfulCount: review.helpful_count || 0,
        reportedCount: review.reported_count || 0
      })) || []

      setRatings(transformedRatings)
      setReviews(transformedReviews)
      
      // Use summary data if available, otherwise calculate
      if (data.summary) {
        const userRating: UserRating = {
          userId,
          averageRating: data.summary.average_rating || 0,
          totalReviews: data.summary.total_reviews || 0,
          ratingDistribution: data.summary.rating_distribution || { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 },
          categoryRatings: data.summary.category_ratings || {
            quality: 0,
            communication: 0,
            punctuality: 0,
            overall: 0
          },
          recentReviews: transformedReviews.slice(0, 5),
          badges: data.summary.badges || []
        }
        setUserRatings(prev => ({ ...prev, [userId]: userRating }))
      } else {
        // Fallback calculation
        const userRating = calculateUserRating(userId, transformedRatings, transformedReviews)
        setUserRatings(prev => ({ ...prev, [userId]: userRating }))
      }
    } catch (err) {
      setError('Грешка при зареждане на рейтингите')
      console.error('Error loading ratings:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Изчисляване на общ рейтинг за потребител
  const calculateUserRating = (userId: string, userRatings: Rating[], userReviews: Review[]): UserRating => {
    const allRatings = [...userRatings, ...userReviews]
    
    if (allRatings.length === 0) {
      return {
        userId,
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 },
        categoryRatings: {
          quality: 0,
          communication: 0,
          punctuality: 0,
          overall: 0
        },
        recentReviews: [],
        badges: []
      }
    }

    // Общ рейтинг
    const totalRating = allRatings.reduce((sum, r) => sum + r.rating, 0)
    const averageRating = totalRating / allRatings.length

    // Разпределение на рейтингите
    const ratingDistribution = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 }
    allRatings.forEach(r => {
      ratingDistribution[r.rating.toString() as keyof typeof ratingDistribution]++
    })

    // Рейтинги по категории
    const categoryRatings = {
      quality: 0,
      communication: 0,
      punctuality: 0,
      overall: 0
    }

    const qualityRatings = userRatings.filter(r => r.category === 'quality')
    const communicationRatings = userRatings.filter(r => r.category === 'communication')
    const punctualityRatings = userRatings.filter(r => r.category === 'punctuality')

    if (qualityRatings.length > 0) {
      categoryRatings.quality = qualityRatings.reduce((sum, r) => sum + r.rating, 0) / qualityRatings.length
    }
    if (communicationRatings.length > 0) {
      categoryRatings.communication = communicationRatings.reduce((sum, r) => sum + r.rating, 0) / communicationRatings.length
    }
    if (punctualityRatings.length > 0) {
      categoryRatings.punctuality = punctualityRatings.reduce((sum, r) => sum + r.rating, 0) / punctualityRatings.length
    }
    categoryRatings.overall = averageRating

    // Награди
    const badges: string[] = []
    if (averageRating >= 4.5 && allRatings.length >= 5) badges.push('Топ изпълнител')
    if (averageRating >= 4.0 && allRatings.length >= 10) badges.push('Надежден')
    if (categoryRatings.punctuality >= 4.5) badges.push('Пунктуален')
    if (categoryRatings.communication >= 4.5) badges.push('Комуникативен')

    return {
      userId,
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: allRatings.length,
      ratingDistribution,
      categoryRatings: {
        quality: Math.round(categoryRatings.quality * 10) / 10,
        communication: Math.round(categoryRatings.communication * 10) / 10,
        punctuality: Math.round(categoryRatings.punctuality * 10) / 10,
        overall: Math.round(categoryRatings.overall * 10) / 10
      },
      recentReviews: userReviews.slice(0, 5), // Последните 5 отзива
      badges
    }
  }

  // Добавяне на нов рейтинг
  const addRating = useCallback(async (rating: Omit<Rating, 'id' | 'createdAt'>) => {
    try {
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task_id: rating.taskId,
          reviewer_id: rating.reviewerId,
          reviewed_user_id: rating.reviewedUserId,
          rating: rating.rating,
          comment: rating.comment,
          category: rating.category,
          is_review: false
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to add rating')
      }

      const newRating = await response.json()
      
      // Transform to our type
      const transformedRating: Rating = {
        id: newRating.id,
        taskId: newRating.task_id,
        reviewerId: newRating.reviewer_id,
        reviewedUserId: newRating.reviewed_user_id,
        rating: newRating.rating,
        comment: newRating.comment,
        category: newRating.category,
        createdAt: new Date(newRating.created_at),
        isVerified: newRating.is_verified
      }

      setRatings(prev => [...prev, transformedRating])
      
      // Reload user ratings to get updated summary
      await loadUserRatings(rating.reviewedUserId)
    } catch (err) {
      setError('Грешка при добавяне на рейтинга')
      console.error('Error adding rating:', err)
      throw err
    }
  }, [loadUserRatings])

  // Добавяне на нов отзив
  const addReview = useCallback(async (review: Omit<Review, 'id' | 'createdAt' | 'helpfulCount' | 'reportedCount'>) => {
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task_id: review.taskId,
          reviewer_id: review.reviewerId,
          reviewed_user_id: review.reviewedUserId,
          rating: review.rating,
          title: review.title,
          comment: review.comment,
          pros: review.pros,
          cons: review.cons,
          tags: review.tags
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to add review')
      }

      const newReview = await response.json()
      
      // Transform to our type
      const transformedReview: Review = {
        id: newReview.id,
        taskId: newReview.task_id,
        reviewerId: newReview.reviewer_id,
        reviewedUserId: newReview.reviewed_user_id,
        rating: newReview.rating,
        title: newReview.title,
        comment: newReview.comment,
        pros: newReview.pros || [],
        cons: newReview.cons || [],
        tags: newReview.tags || [],
        createdAt: new Date(newReview.created_at),
        updatedAt: newReview.updated_at ? new Date(newReview.updated_at) : undefined,
        isVerified: newReview.is_verified,
        helpfulCount: newReview.helpful_count || 0,
        reportedCount: newReview.reported_count || 0
      }

      setReviews(prev => [...prev, transformedReview])
      
      // Reload user ratings to get updated summary
      await loadUserRatings(review.reviewedUserId)
    } catch (err) {
      setError('Грешка при добавяне на отзива')
      console.error('Error adding review:', err)
      throw err
    }
  }, [loadUserRatings])

  // Маркиране на отзив като полезен
  const markReviewHelpful = useCallback(async (reviewId: string) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ increment: true }),
      })

      if (!response.ok) {
        throw new Error('Failed to mark review as helpful')
      }

      // Optimistically update UI
      setReviews(prev => prev.map(review => 
        review.id === reviewId 
          ? { ...review, helpfulCount: review.helpfulCount + 1 }
          : review
      ))
    } catch (err) {
      console.error('Error marking review as helpful:', err)
    }
  }, [])

  // Докладване на отзив
  const reportReview = useCallback(async (reviewId: string) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}/report`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to report review')
      }

      // Optimistically update UI
      setReviews(prev => prev.map(review => 
        review.id === reviewId 
          ? { ...review, reportedCount: review.reportedCount + 1 }
          : review
      ))
    } catch (err) {
      console.error('Error reporting review:', err)
    }
  }, [])

  // Филтриране на рейтинги
  const filterRatings = useCallback((filters: RatingFilters) => {
    let filteredRatings = [...ratings]
    let filteredReviews = [...reviews]

    if (filters.minRating) {
      filteredRatings = filteredRatings.filter(r => r.rating >= filters.minRating!)
      filteredReviews = filteredReviews.filter(r => r.rating >= filters.minRating!)
    }

    if (filters.maxRating) {
      filteredRatings = filteredRatings.filter(r => r.rating <= filters.maxRating!)
      filteredReviews = filteredReviews.filter(r => r.rating <= filters.maxRating!)
    }

    if (filters.verifiedOnly) {
      filteredRatings = filteredRatings.filter(r => r.isVerified)
      filteredReviews = filteredReviews.filter(r => r.isVerified)
    }

    if (filters.category) {
      filteredRatings = filteredRatings.filter(r => r.category === filters.category)
    }

    if (filters.tags && filters.tags.length > 0) {
      filteredReviews = filteredReviews.filter(r => 
        r.tags && filters.tags!.some(tag => r.tags!.includes(tag))
      )
    }

    return { ratings: filteredRatings, reviews: filteredReviews }
  }, [ratings, reviews])

  return {
    ratings,
    reviews,
    userRatings,
    isLoading,
    error,
    loadUserRatings,
    addRating,
    addReview,
    markReviewHelpful,
    reportReview,
    filterRatings
  }
} 