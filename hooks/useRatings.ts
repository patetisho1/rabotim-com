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
      // Зареждане от localStorage
      const storedRatings = localStorage.getItem(`ratings_${userId}`)
      const storedReviews = localStorage.getItem(`reviews_${userId}`)
      
      if (storedRatings && storedReviews) {
        const parsedRatings = JSON.parse(storedRatings).map((rating: any) => ({
          ...rating,
          createdAt: new Date(rating.createdAt)
        }))
        const parsedReviews = JSON.parse(storedReviews).map((review: any) => ({
          ...review,
          createdAt: new Date(review.createdAt),
          updatedAt: review.updatedAt ? new Date(review.updatedAt) : undefined
        }))
        
        setRatings(parsedRatings)
        setReviews(parsedReviews)
        
        // Изчисляване на общия рейтинг
        const userRating = calculateUserRating(userId, parsedRatings, parsedReviews)
        setUserRatings(prev => ({ ...prev, [userId]: userRating }))
      } else {
        // Демо данни
        const demoRatings: Rating[] = [
          {
            id: '1',
            taskId: 'task1',
            reviewerId: 'user2',
            reviewedUserId: userId,
            rating: 5,
            comment: 'Отлично качество на работата!',
            category: 'quality',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 дни назад
            isVerified: true
          },
          {
            id: '2',
            taskId: 'task2',
            reviewerId: 'user3',
            reviewedUserId: userId,
            rating: 4,
            comment: 'Добър изпълнител, но малко закъсня.',
            category: 'punctuality',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14), // 14 дни назад
            isVerified: true
          },
          {
            id: '3',
            taskId: 'task3',
            reviewerId: 'user4',
            reviewedUserId: userId,
            rating: 5,
            comment: 'Професионален подход и отлично общуване.',
            category: 'communication',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21), // 21 дни назад
            isVerified: true
          }
        ]
        
        const demoReviews: Review[] = [
          {
            id: '1',
            taskId: 'task1',
            reviewerId: 'user2',
            reviewedUserId: userId,
            rating: 5,
            title: 'Отлично качество на работата!',
            comment: 'Много доволен от работата. Изпълнителят е професионален и внимателен към детайлите. Определено ще го препоръчам!',
            pros: ['Професионален', 'Качествена работа', 'Навреме'],
            cons: [],
            tags: ['професионален', 'качествен', 'надежден'],
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
            isVerified: true,
            helpfulCount: 3,
            reportedCount: 0
          },
          {
            id: '2',
            taskId: 'task2',
            reviewerId: 'user3',
            reviewedUserId: userId,
            rating: 4,
            title: 'Добър изпълнител',
            comment: 'Работата е добре свършена, но имаше малко закъснение. Въпреки това, качеството е отлично.',
            pros: ['Качествена работа', 'Добро общуване'],
            cons: ['Малко закъснение'],
            tags: ['качествен', 'комуникативен'],
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
            isVerified: true,
            helpfulCount: 1,
            reportedCount: 0
          }
        ]
        
        setRatings(demoRatings)
        setReviews(demoReviews)
        
        // Запазване в localStorage
        localStorage.setItem(`ratings_${userId}`, JSON.stringify(demoRatings))
        localStorage.setItem(`reviews_${userId}`, JSON.stringify(demoReviews))
        
        // Изчисляване на общия рейтинг
        const userRating = calculateUserRating(userId, demoRatings, demoReviews)
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
      ratingDistribution[r.rating as keyof typeof ratingDistribution]++
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
    const newRating: Rating = {
      ...rating,
      id: Date.now().toString(),
      createdAt: new Date()
    }

    setRatings(prev => [...prev, newRating])
    
    // Запазване в localStorage
    const existingRatings = JSON.parse(localStorage.getItem(`ratings_${rating.reviewedUserId}`) || '[]')
    localStorage.setItem(`ratings_${rating.reviewedUserId}`, JSON.stringify([...existingRatings, newRating]))
    
    // Обновяване на общия рейтинг
    const updatedRatings = [...ratings, newRating]
    const userRating = calculateUserRating(rating.reviewedUserId, updatedRatings, reviews)
    setUserRatings(prev => ({ ...prev, [rating.reviewedUserId]: userRating }))
  }, [ratings, reviews])

  // Добавяне на нов отзив
  const addReview = useCallback(async (review: Omit<Review, 'id' | 'createdAt' | 'helpfulCount' | 'reportedCount'>) => {
    const newReview: Review = {
      ...review,
      id: Date.now().toString(),
      createdAt: new Date(),
      helpfulCount: 0,
      reportedCount: 0
    }

    setReviews(prev => [...prev, newReview])
    
    // Запазване в localStorage
    const existingReviews = JSON.parse(localStorage.getItem(`reviews_${review.reviewedUserId}`) || '[]')
    localStorage.setItem(`reviews_${review.reviewedUserId}`, JSON.stringify([...existingReviews, newReview]))
    
    // Обновяване на общия рейтинг
    const updatedReviews = [...reviews, newReview]
    const userRating = calculateUserRating(review.reviewedUserId, ratings, updatedReviews)
    setUserRatings(prev => ({ ...prev, [review.reviewedUserId]: userRating }))
  }, [ratings, reviews])

  // Маркиране на отзив като полезен
  const markReviewHelpful = useCallback((reviewId: string) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, helpfulCount: review.helpfulCount + 1 }
        : review
    ))
  }, [])

  // Докладване на отзив
  const reportReview = useCallback((reviewId: string) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, reportedCount: review.reportedCount + 1 }
        : review
    ))
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