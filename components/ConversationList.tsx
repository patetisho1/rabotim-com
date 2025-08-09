'use client'

import { useState } from 'react'
import { Conversation } from '@/types/message'
import { Search, Plus, MoreVertical, Circle } from 'lucide-react'

interface ConversationListProps {
  conversations: Conversation[]
  currentConversation: Conversation | null
  onSelectConversation: (conversation: Conversation) => void
  onCreateNew: () => void
}

export default function ConversationList({
  conversations,
  currentConversation,
  onSelectConversation,
  onCreateNew
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const getParticipantName = (userId: string) => {
    // Демо имена на потребители
    const userNames: { [key: string]: string } = {
      'user2': 'Иван Петров',
      'user3': 'Мария Георгиева',
      'user4': 'Стоян Димитров',
      'user5': 'Елена Василева'
    }
    return userNames[userId] || 'Неизвестен потребител'
  }

  const filteredConversations = conversations.filter(conv => {
    const participantName = getParticipantName(conv.participants[1]) // Вторият участник (не текущият)
    return participantName.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 60) return `${minutes}м`
    if (hours < 24) return `${hours}ч`
    if (days < 7) return `${days}д`
    return date.toLocaleDateString('bg-BG')
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <div className="w-full max-w-sm bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Съобщения
          </h2>
          <button
            onClick={onCreateNew}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Plus size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Търси разговори..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 dark:text-gray-500 mb-2">
              <Circle size={48} className="mx-auto" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery ? 'Няма намерени разговори' : 'Няма разговори'}
            </p>
            {!searchQuery && (
              <button
                onClick={onCreateNew}
                className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
              >
                Започнете първия разговор
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredConversations.map((conversation) => {
              const participantName = getParticipantName(conversation.participants[1])
              const isActive = currentConversation?.id === conversation.id
              
              return (
                <div
                  key={conversation.id}
                  onClick={() => onSelectConversation(conversation)}
                  className={`p-4 cursor-pointer transition-colors ${
                    isActive 
                      ? 'bg-primary-50 dark:bg-primary-900/20 border-r-2 border-primary-500' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm">
                          {getInitials(participantName)}
                        </span>
                      </div>
                      {conversation.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          {conversation.unreadCount}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                          {participantName}
                        </h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {conversation.lastMessage && formatTime(conversation.lastMessage.timestamp)}
                        </span>
                      </div>
                      
                      {conversation.lastMessage && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                          {conversation.lastMessage.content}
                        </p>
                      )}
                    </div>

                    {/* Menu */}
                    <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                      <MoreVertical size={16} className="text-gray-400" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
} 