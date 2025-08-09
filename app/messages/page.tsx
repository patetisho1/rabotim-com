'use client'

import { useState, useEffect } from 'react'
import { useMessages } from '@/hooks/useMessages'
import ConversationList from '@/components/ConversationList'
import ChatWindow from '@/components/ChatWindow'

export default function MessagesPage() {
  const {
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
  } = useMessages()

  const [isMobile, setIsMobile] = useState(false)
  const [showChat, setShowChat] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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
            <ChatWindow
              conversation={currentConversation}
              messages={messages}
              onSendMessage={handleSendMessage}
              onBack={() => {}}
              isLoading={isLoading}
            />
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
            ) : (
              <ChatWindow
                conversation={currentConversation}
                messages={messages}
                onSendMessage={handleSendMessage}
                onBack={handleBack}
                isLoading={isLoading}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
} 