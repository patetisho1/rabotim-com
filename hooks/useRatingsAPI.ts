'use client'

import { useState, useEffect, useCallback } from 'react'
import { Rating } from '@/types/rating'

export function useRatingsAPI(userId: string) {
  const [ratings, setRatings] = useState<Rating[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Зареждане на рейтинги за потребител от API
  const loadUserRatings = useCallback(async () => {
    if (!userId) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/ratings?userId=${userId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch ratings')
      }

      const data = await response.json()
      setRatings(data)
    } catch (err) {
      setError('Грешка при зареждане на рейтингите')
      console.error('Error loading ratings:', err)
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  // Добавяне на нов рейтинг чрез API
  const addRating = useCallback(async (ratingData: Omit<Rating, 'id' | 'created_at'>) => {
    try {
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ratingData),
      })

      if (!response.ok) {
        throw new Error('Failed to add rating')
      }

      const newRating = await response.json()
      setRatings(prev => [...prev, newRating])
      return newRating
    } catch (err) {
      setError('Грешка при добавяне на рейтинга')
      console.error('Error adding rating:', err)
      throw err
    }
  }, [])

  // Изчисляване на общ рейтинг за потребител
  const calculateUserRating = useCallback(() => {
    if (ratings.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 },
        categoryRatings: {
          quality: 0,
          communication: 0,
          punctuality: 0,
          overall: 0
        }
      }
    }

    // Общ рейтинг
    const totalRating = ratings.reduce((sum, r) => sum + r.rating, 0)
    const averageRating = totalRating / ratings.length

    // Разпределение на рейтингите
    const ratingDistribution = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 }
    ratings.forEach(r => {
      ratingDistribution[r.rating.toString() as keyof typeof ratingDistribution]++
    })

    // Рейтинги по категории
    const categoryRatings = {
      quality: 0,
      communication: 0,
      punctuality: 0,
      overall: 0
    }

    const qualityRatings = ratings.filter(r => r.category === 'quality')
    const communicationRatings = ratings.filter(r => r.category === 'communication')
    const punctualityRatings = ratings.filter(r => r.category === 'punctuality')

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

    return {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: ratings.length,
      ratingDistribution,
      categoryRatings: {
        quality: Math.round(categoryRatings.quality * 10) / 10,
        communication: Math.round(categoryRatings.communication * 10) / 10,
        punctuality: Math.round(categoryRatings.punctuality * 10) / 10,
        overall: Math.round(categoryRatings.overall * 10) / 10
      }
    }
  }, [ratings])

  useEffect(() => {
    loadUserRatings()
  }, [loadUserRatings])

  return {
    ratings,
    isLoading,
    error,
    refetch: loadUserRatings,
    addRating,
    calculateUserRating
  }
}
