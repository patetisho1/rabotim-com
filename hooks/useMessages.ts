'use client'

import { useState, useEffect, useCallback } from 'react'
import { Message, Conversation, ChatUser } from '@/types/message'

export function useMessages() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Зареждане на разговорите
  const loadConversations = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Зареждане от localStorage (засега)
      const storedConversations = localStorage.getItem('conversations')
      if (storedConversations) {
        const parsed = JSON.parse(storedConversations)
        setConversations(parsed.map((conv: any) => ({
          ...conv,
          createdAt: new Date(conv.createdAt),
          updatedAt: new Date(conv.updatedAt),
          lastMessage: conv.lastMessage ? {
            ...conv.lastMessage,
            timestamp: new Date(conv.lastMessage.timestamp)
          } : undefined
        })))
      } else {
        // Демо данни
        const demoConversations: Conversation[] = [
          {
            id: '1',
            participants: ['user1', 'user2'],
            unreadCount: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
            lastMessage: {
              id: 'msg1',
              conversationId: '1',
              senderId: 'user2',
              receiverId: 'user1',
              content: 'Здравейте! Интересувам се от вашата задача за почистване.',
              timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 минути назад
              isRead: false,
              type: 'text'
            }
          },
          {
            id: '2',
            participants: ['user1', 'user3'],
            unreadCount: 0,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 ден назад
            updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 часа назад
            lastMessage: {
              id: 'msg2',
              conversationId: '2',
              senderId: 'user1',
              receiverId: 'user3',
              content: 'Благодаря за работата! Много доволен съм.',
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
              isRead: true,
              type: 'text'
            }
          }
        ]
        setConversations(demoConversations)
        localStorage.setItem('conversations', JSON.stringify(demoConversations))
      }
    } catch (err) {
      setError('Грешка при зареждане на разговорите')
      console.error('Error loading conversations:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Зареждане на съобщения за конкретен разговор
  const loadMessages = useCallback(async (conversationId: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Зареждане от localStorage
      const storedMessages = localStorage.getItem(`messages_${conversationId}`)
      if (storedMessages) {
        const parsed = JSON.parse(storedMessages)
        setMessages(parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })))
      } else {
        // Демо съобщения
        const demoMessages: Message[] = [
          {
            id: '1',
            conversationId,
            senderId: 'user2',
            receiverId: 'user1',
            content: 'Здравейте! Видях вашата обява за почистване.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 час назад
            isRead: true,
            type: 'text'
          },
          {
            id: '2',
            conversationId,
            senderId: 'user1',
            receiverId: 'user2',
            content: 'Здравейте! Да, задачата е все още активна.',
            timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 минути назад
            isRead: true,
            type: 'text'
          },
          {
            id: '3',
            conversationId,
            senderId: 'user2',
            receiverId: 'user1',
            content: 'Отлично! Кога бихте искали да се срещнем?',
            timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 минути назад
            isRead: false,
            type: 'text'
          }
        ]
        setMessages(demoMessages)
        localStorage.setItem(`messages_${conversationId}`, JSON.stringify(demoMessages))
      }
    } catch (err) {
      setError('Грешка при зареждане на съобщенията')
      console.error('Error loading messages:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Изпращане на съобщение
  const sendMessage = useCallback(async (content: string, receiverId: string) => {
    if (!currentConversation) return

    const newMessage: Message = {
      id: Date.now().toString(),
      conversationId: currentConversation.id,
      senderId: 'user1', // Текущият потребител
      receiverId,
      content,
      timestamp: new Date(),
      isRead: false,
      type: 'text'
    }

    // Добавяне към съобщенията
    setMessages(prev => [...prev, newMessage])

    // Обновяване на разговора
    setConversations(prev => prev.map(conv => 
      conv.id === currentConversation.id 
        ? {
            ...conv,
            lastMessage: newMessage,
            updatedAt: new Date(),
            unreadCount: 0
          }
        : conv
    ))

    // Запазване в localStorage
    const updatedMessages = [...messages, newMessage]
    localStorage.setItem(`messages_${currentConversation.id}`, JSON.stringify(updatedMessages))
    localStorage.setItem('conversations', JSON.stringify(conversations))

    // Симулация на отговор (за демо цели)
    setTimeout(() => {
      const replyMessage: Message = {
        id: (Date.now() + 1).toString(),
        conversationId: currentConversation.id,
        senderId: receiverId,
        receiverId: 'user1',
        content: 'Получих вашето съобщение! Ще отговоря скоро.',
        timestamp: new Date(),
        isRead: false,
        type: 'text'
      }

      setMessages(prev => [...prev, replyMessage])
      setConversations(prev => prev.map(conv => 
        conv.id === currentConversation.id 
          ? {
              ...conv,
              lastMessage: replyMessage,
              updatedAt: new Date(),
              unreadCount: conv.unreadCount + 1
            }
          : conv
      ))
    }, 2000)
  }, [currentConversation, messages, conversations])

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
      id: Date.now().toString(),
      participants: ['user1', participantId],
      unreadCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      taskId
    }

    setConversations(prev => [...prev, newConversation])
    setCurrentConversation(newConversation)
    
    // Запазване в localStorage
    const updatedConversations = [...conversations, newConversation]
    localStorage.setItem('conversations', JSON.stringify(updatedConversations))
  }, [conversations])

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