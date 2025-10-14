'use client'

import { useState, useEffect, useCallback } from 'react'
import { Message, Conversation } from '@/types/message'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

export function useMessages() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Зареждане на разговорите
  const loadConversations = useCallback(async () => {
    if (!user) return

    setIsLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          conversation_id,
          sender_id,
          receiver_id,
          content,
          created_at,
          read_at,
          sender:users!sender_id(id, full_name, avatar_url),
          receiver:users!receiver_id(id, full_name, avatar_url)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Group messages by conversation_id
      const conversationMap = new Map<string, Conversation>()
      
      data?.forEach((msg: any) => {
        if (!conversationMap.has(msg.conversation_id)) {
          const otherUser = msg.sender_id === user.id ? msg.receiver : msg.sender
          
          conversationMap.set(msg.conversation_id, {
            id: msg.conversation_id,
            participants: [msg.sender_id, msg.receiver_id],
            unreadCount: 0,
            createdAt: new Date(msg.created_at),
            updatedAt: new Date(msg.created_at),
            lastMessage: {
              id: msg.id,
              conversationId: msg.conversation_id,
              senderId: msg.sender_id,
              receiverId: msg.receiver_id,
              content: msg.content,
              timestamp: new Date(msg.created_at),
              isRead: !!msg.read_at,
              type: 'text'
            },
            title: otherUser.full_name
          })
        }
        
        // Count unread messages
        if (msg.receiver_id === user.id && !msg.read_at) {
          const conv = conversationMap.get(msg.conversation_id)
          if (conv) {
            conv.unreadCount = (conv.unreadCount || 0) + 1
          }
        }
      })

      setConversations(Array.from(conversationMap.values()))
    } catch (err: any) {
      setError('Грешка при зареждане на разговорите')
      console.error('Error loading conversations:', err)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  // Зареждане на съобщения за конкретен разговор
  const loadMessages = useCallback(async (conversationId: string) => {
    if (!user) return

    setIsLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:users!sender_id(full_name, avatar_url)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (error) throw error

      const formattedMessages: Message[] = (data || []).map((msg: any) => ({
        id: msg.id,
        conversationId: msg.conversation_id,
        senderId: msg.sender_id,
        receiverId: msg.receiver_id,
        content: msg.content,
        timestamp: new Date(msg.created_at),
        isRead: !!msg.read_at,
        type: 'text',
        attachments: msg.attachments || []
      }))

      setMessages(formattedMessages)
    } catch (err: any) {
      setError('Грешка при зареждане на съобщенията')
      console.error('Error loading messages:', err)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  // Изпращане на съобщение
  const sendMessage = useCallback(async (content: string, receiverId: string, conversationId?: string) => {
    if (!user) return

    try {
      const newConversationId = conversationId || `${[user.id, receiverId].sort().join('_')}`

      const { data, error } = await supabase
        .from('messages')
        .insert([{
          conversation_id: newConversationId,
          sender_id: user.id,
          receiver_id: receiverId,
          content: content.trim()
        }])
        .select()
        .single()

      if (error) throw error

      const newMessage: Message = {
        id: data.id,
        conversationId: newConversationId,
        senderId: user.id,
        receiverId: receiverId,
        content: content.trim(),
        timestamp: new Date(data.created_at),
        isRead: false,
        type: 'text'
      }

      setMessages(prev => [...prev, newMessage])
      
      // Reload conversations to update last message
      await loadConversations()
    } catch (err: any) {
      console.error('Error sending message:', err)
      setError('Грешка при изпращане на съобщението')
    }
  }, [user, loadConversations])

  // Маркиране на съобщения като прочетени
  const markAsRead = useCallback(async (conversationId: string) => {
    if (!user) return

    try {
      await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .eq('receiver_id', user.id)
        .is('read_at', null)

      setConversations(prev => prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, unreadCount: 0 }
          : conv
      ))
    } catch (err) {
      console.error('Error marking messages as read:', err)
    }
  }, [user])

  // Създаване на нов разговор
  const createConversation = useCallback(async (participantId: string, initialMessage?: string) => {
    if (!user) return

    const conversationId = `${[user.id, participantId].sort().join('_')}`
    
    setCurrentConversation({
      id: conversationId,
      participants: [user.id, participantId],
      unreadCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    if (initialMessage) {
      await sendMessage(initialMessage, participantId, conversationId)
    }
  }, [user, sendMessage])

  // Subscribe to real-time messages
  useEffect(() => {
    if (!user || !currentConversation) return

    const channel = supabase
      .channel(`messages:${currentConversation.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${currentConversation.id}`
        },
        async (payload: any) => {
          const newMsg = payload.new
          
          // Fetch sender info
          const { data: senderData } = await supabase
            .from('users')
            .select('full_name, avatar_url')
            .eq('id', newMsg.sender_id)
            .single()

          const newMessage: Message = {
            id: newMsg.id,
            conversationId: newMsg.conversation_id,
            senderId: newMsg.sender_id,
            receiverId: newMsg.receiver_id,
            content: newMsg.content,
            timestamp: new Date(newMsg.created_at),
            isRead: !!newMsg.read_at,
            type: 'text'
          }

          // Only add if it's from the other user (avoid duplicates)
          if (newMsg.sender_id !== user.id) {
            setMessages(prev => [...prev, newMessage])
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, currentConversation])

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
