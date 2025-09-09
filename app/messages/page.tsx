'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useMessages } from '@/hooks/useMessages'
import { useAuth } from '@/hooks/useAuth'
import ConversationList from '@/components/ConversationList'
import ChatWindow from '@/components/ChatWindow'
import toast from 'react-hot-toast'

export default function MessagesPage() {
  const router = useRouter()
  const { user: authUser, loading: authLoading } = useAuth()
  const {
    conversations,
    messages,
    currentConversation,
    isLoading,
    error,
    loadMessages,
    sendMessage,
    createConversation,
    markAsRead,
    setCurrentConversation
  } = useMessages()

  const [isMobile, setIsMobile] = useState(false)
  const [showChat, setShowChat] = useState(false)

  useEffect(() => {
    if (authLoading) return
    
    if (!authUser) {
      toast.error('Трябва да сте влезли в акаунта си')
      router.push('/login')
      return
    }
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [authUser, authLoading, router])

  const handleSelectConversation = async (conversation: any) => {
    setCurrentConversation(conversation)
    await loadMessages(conversation.id)
    markAsRead(conversation.id)
    
    if (isMobile) {
      setShowChat(true)
    }
  }

  const handleSendMessage = async (content: string) => {
    if (currentConversation) {
      const receiverId = currentConversation.participants.find((p: string) => p !== 'user1') || ''
      await sendMessage(content, receiverId)
    }
  }

  const handleCreateNew = () => {
    // За демо цели - създаваме разговор с нов потребител
    const newUserId = `user${Date.now()}`
    createConversation(newUserId)
  }

  const handleBack = () => {
    if (isMobile) {
      setShowChat(false)
    }
  }

  const handleCloseChat = () => {
    if (isMobile) {
      setShowChat(false)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Възникна грешка
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {error}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto h-screen">
        {/* Desktop Layout */}
        {!isMobile && (
          <div className="flex h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <ConversationList
              conversations={conversations}
              currentConversation={currentConversation}
              onSelectConversation={handleSelectConversation}
              onCreateNew={handleCreateNew}
            />
            {currentConversation && (
              <ChatWindow
                taskId={currentConversation.id}
                taskTitle={currentConversation.title || 'Разговор'}
                otherUser={{
                  id: currentConversation.participants.find((p: string) => p !== 'user1') || '',
                  name: currentConversation.title || 'Потребител',
                  avatar: '/api/placeholder/40/40',
                  isOnline: true
                }}
                onClose={() => {}}
                isOpen={true}
              />
            )}
          </div>
        )}

        {/* Mobile Layout */}
        {isMobile && (
          <div className="h-full">
            {!showChat ? (
              <ConversationList
                conversations={conversations}
                currentConversation={currentConversation}
                onSelectConversation={handleSelectConversation}
                onCreateNew={handleCreateNew}
              />
            ) : currentConversation && (
              <ChatWindow
                taskId={currentConversation.id}
                taskTitle={currentConversation.title || 'Разговор'}
                otherUser={{
                  id: currentConversation.participants.find((p: string) => p !== 'user1') || '',
                  name: currentConversation.title || 'Потребител',
                  avatar: '/api/placeholder/40/40',
                  isOnline: true
                }}
                onClose={handleCloseChat}
                isOpen={showChat}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
} 