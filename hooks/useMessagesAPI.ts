'use client'

import { useState, useEffect, useCallback } from 'react'
import { Message, Conversation, ChatUser } from '@/types/message'

export function useMessagesAPI(userId: string) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Зареждане на разговорите от API
  const loadConversations = useCallback(async () => {
    if (!userId) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/messages?userId=${userId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch conversations')
      }

      const data = await response.json()
      setConversations(data)
    } catch (err) {
      setError('Грешка при зареждане на разговорите')
      console.error('Error loading conversations:', err)
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  // Зареждане на съобщения за конкретен разговор от API
  const loadMessages = useCallback(async (conversationId: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/messages/${conversationId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch messages')
      }

      const data = await response.json()
      setMessages(data)
    } catch (err) {
      setError('Грешка при зареждане на съобщенията')
      console.error('Error loading messages:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Изпращане на съобщение чрез API
  const sendMessage = useCallback(async (content: string, receiverId: string, conversationId?: string) => {
    if (!userId) return

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation_id: conversationId || `conv_${userId}_${receiverId}`,
          sender_id: userId,
          receiver_id: receiverId,
          content,
          attachments: []
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const newMessage = await response.json()
      
      // Добавяне към съобщенията
      setMessages(prev => [...prev, newMessage])

      // Обновяване на разговорите
      setConversations(prev => prev.map(conv => 
        conv.id === (conversationId || `conv_${userId}_${receiverId}`)
          ? {
              ...conv,
              lastMessage: newMessage,
              updatedAt: new Date(),
              unreadCount: 0
            }
          : conv
      ))

      return newMessage
    } catch (err) {
      setError('Грешка при изпращане на съобщението')
      console.error('Error sending message:', err)
      throw err
    }
  }, [userId])

  // Маркиране на съобщения като прочетени
  const markAsRead = useCallback((conversationId: string) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, unreadCount: 0 }
        : conv
    ))
  }, [])

  // Създаване на нов разговор
  const createConversation = useCallback((participantId: string, taskId?: string) => {
    const newConversation: Conversation = {
      id: `conv_${userId}_${participantId}`,
      participants: [userId, participantId],
      unreadCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      taskId
    }

    setConversations(prev => [...prev, newConversation])
    setCurrentConversation(newConversation)
  }, [userId])

  useEffect(() => {
    loadConversations()
  }, [loadConversations])

  return {
    conversations,
    currentConversation,
    messages,
    isLoading,
    error,
    loadMessages,
    sendMessage,
    markAsRead,
    createConversation,
    setCurrentConversation
  }
}
