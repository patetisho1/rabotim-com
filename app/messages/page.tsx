'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Send, User, Search, MoreVertical, MessageSquare, Phone, Video, Image, Paperclip, Smile, Check, CheckCheck, Clock, Archive, Trash2, Flag, Bell, BellOff, Circle } from 'lucide-react'
import toast from 'react-hot-toast'

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: string
  isRead: boolean
  type: 'text' | 'image' | 'file'
  attachments?: string[]
}

interface Conversation {
  id: string
  participantId: string
  participantName: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  avatar: string
  isOnline: boolean
  lastSeen?: string
  isArchived: boolean
  isBlocked: boolean
  taskId?: string
  taskTitle?: string
}

export default function MessagesPage() {
  const router = useRouter()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showArchived, setShowArchived] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  useEffect(() => {
    checkLoginStatus()
    loadConversations()
    setupNotifications()
  }, [])

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id)
      markConversationAsRead(selectedConversation.id)
    }
  }, [selectedConversation])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    filterConversations()
  }, [conversations, searchQuery, showArchived])

  const checkLoginStatus = () => {
    const loginStatus = localStorage.getItem('isLoggedIn')
    const userData = localStorage.getItem('user')
    
    if (loginStatus !== 'true' || !userData) {
      toast.error('Трябва да сте влезли в акаунта си')
      router.push('/login')
      return
    }

    setIsLoggedIn(true)
    const user = JSON.parse(userData)
    setCurrentUserId(user.id.toString())
  }

  const setupNotifications = () => {
    if ('Notification' in window) {
      Notification.requestPermission()
    }
  }

  const loadConversations = () => {
    // Зареждане на реални разговори от localStorage
    const allConversations = JSON.parse(localStorage.getItem('conversations') || '[]')
    const userConversations = allConversations.filter((conv: any) => 
      conv.participant1Id === currentUserId || conv.participant2Id === currentUserId
    )

    if (userConversations.length === 0) {
      // Създаване на демо разговори ако няма такива
      const demoConversations: Conversation[] = [
        {
          id: '1',
          participantId: '2',
          participantName: 'Иван Петров',
          lastMessage: 'Здравейте! Интересувам се от вашата задача за преместване.',
          lastMessageTime: '2024-01-15T10:30:00Z',
          unreadCount: 2,
          avatar: '/api/placeholder/40/40',
          isOnline: true,
          lastSeen: '2024-01-15T10:30:00Z',
          isArchived: false,
          isBlocked: false,
          taskId: '1',
          taskTitle: 'Преместване на мебели'
        },
        {
          id: '2',
          participantId: '3',
          participantName: 'Мария Георгиева',
          lastMessage: 'Благодаря за кандидатурата! Ще се свържа скоро.',
          lastMessageTime: '2024-01-14T16:45:00Z',
          unreadCount: 0,
          avatar: '/api/placeholder/40/40',
          isOnline: false,
          lastSeen: '2024-01-14T16:45:00Z',
          isArchived: false,
          isBlocked: false,
          taskId: '2',
          taskTitle: 'Почистване на апартамент'
        },
        {
          id: '3',
          participantId: '4',
          participantName: 'Стоян Димитров',
          lastMessage: 'Кога можем да се срещнем за обсъждане на детайлите?',
          lastMessageTime: '2024-01-13T09:15:00Z',
          unreadCount: 1,
          avatar: '/api/placeholder/40/40',
          isOnline: true,
          lastSeen: '2024-01-15T11:20:00Z',
          isArchived: false,
          isBlocked: false,
          taskId: '3',
          taskTitle: 'Ремонт на водопровод'
        },
        {
          id: '4',
          participantId: '5',
          participantName: 'Елена Василева',
          lastMessage: 'Работата е завършена успешно!',
          lastMessageTime: '2024-01-12T14:30:00Z',
          unreadCount: 0,
          avatar: '/api/placeholder/40/40',
          isOnline: false,
          lastSeen: '2024-01-12T14:30:00Z',
          isArchived: true,
          isBlocked: false,
          taskId: '4',
          taskTitle: 'Ремонт на врата'
        }
      ]
      setConversations(demoConversations)
    } else {
      // Конвертиране на реални разговори
      const formattedConversations = userConversations.map((conv: any) => {
        const otherParticipantId = conv.participant1Id === currentUserId ? conv.participant2Id : conv.participant1Id
        const otherParticipant = JSON.parse(localStorage.getItem('users') || '[]')
          .find((user: any) => user.id.toString() === otherParticipantId)
        
        return {
          id: conv.id,
          participantId: otherParticipantId,
          participantName: otherParticipant ? `${otherParticipant.firstName} ${otherParticipant.lastName}` : 'Неизвестен потребител',
          lastMessage: conv.lastMessage || 'Нов разговор',
          lastMessageTime: conv.lastMessageTime || conv.createdAt,
          unreadCount: conv.unreadCount || 0,
          avatar: otherParticipant?.avatar || '/api/placeholder/40/40',
          isOnline: Math.random() > 0.5, // Симулиране на онлайн статус
          lastSeen: conv.lastSeen,
          isArchived: conv.isArchived || false,
          isBlocked: conv.isBlocked || false,
          taskId: conv.taskId,
          taskTitle: conv.taskTitle
        }
      })
      setConversations(formattedConversations)
    }
  }

  const filterConversations = () => {
    let filtered = conversations.filter(conv => {
      const matchesSearch = conv.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesArchived = showArchived ? conv.isArchived : !conv.isArchived
      return matchesSearch && matchesArchived && !conv.isBlocked
    })
    
    // Сортиране: непрочетени първо, след това по време
    filtered.sort((a, b) => {
      if (a.unreadCount > 0 && b.unreadCount === 0) return -1
      if (a.unreadCount === 0 && b.unreadCount > 0) return 1
      return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
    })
    
    setFilteredConversations(filtered)
  }

  const loadMessages = (conversationId: string) => {
    // Симулация на зареждане на съобщения
    const sampleMessages: Message[] = [
      {
        id: '1',
        senderId: '2',
        receiverId: currentUserId,
        content: 'Здравейте! Интересувам се от вашата задача за преместване.',
        timestamp: '2024-01-15T10:30:00Z',
        isRead: false,
        type: 'text'
      },
      {
        id: '2',
        senderId: currentUserId,
        receiverId: '2',
        content: 'Здравейте! Да, задачата все още е активна. Кога бихте могли да започнете?',
        timestamp: '2024-01-15T10:35:00Z',
        isRead: true,
        type: 'text'
      },
      {
        id: '3',
        senderId: '2',
        receiverId: currentUserId,
        content: 'Мога да започна утре сутринта. Каква е точната адреса?',
        timestamp: '2024-01-15T10:40:00Z',
        isRead: false,
        type: 'text'
      },
      {
        id: '4',
        senderId: currentUserId,
        receiverId: '2',
        content: 'Отлично! Адресът е ул. "Граф Игнатиев" 15, София. Ще ви очаквам в 9:00.',
        timestamp: '2024-01-15T10:42:00Z',
        isRead: true,
        type: 'text'
      }
    ]
    setMessages(sampleMessages)
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return

    const message: Message = {
      id: Date.now().toString(),
      senderId: currentUserId,
      receiverId: selectedConversation.participantId,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      isRead: false,
      type: 'text'
    }

    // Запазване на съобщението в localStorage
    const allMessages = JSON.parse(localStorage.getItem('messages') || '[]')
    allMessages.push(message)
    localStorage.setItem('messages', JSON.stringify(allMessages))

    // Добавяне на новото съобщение към текущия разговор
    setMessages(prev => [...prev, message])
    setNewMessage('')

    // Обновяване на последното съобщение в разговора
    setConversations(prev => 
      prev.map(conv => 
        conv.id === selectedConversation.id 
          ? { ...conv, lastMessage: message.content, lastMessageTime: message.timestamp, unreadCount: 0 }
          : conv
      )
    )

    // Обновяване на разговора в localStorage
    const allConversations = JSON.parse(localStorage.getItem('conversations') || '[]')
    const updatedConversations = allConversations.map((conv: any) => {
      if (conv.id === selectedConversation.id) {
        return {
          ...conv,
          lastMessage: message.content,
          lastMessageTime: message.timestamp,
          unreadCount: 0
        }
      }
      return conv
    })
    localStorage.setItem('conversations', JSON.stringify(updatedConversations))

    // Показване на уведомление
    if (notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('Ново съобщение', {
        body: `От ${selectedConversation.participantName}: ${message.content}`,
        icon: '/favicon.ico'
      })
    }

    toast.success('Съобщението е изпратено')
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('Файлът е твърде голям. Максималният размер е 10MB.')
      return
    }

    const message: Message = {
      id: Date.now().toString(),
      senderId: currentUserId,
      receiverId: selectedConversation!.participantId,
      content: `Прикачен файл: ${file.name}`,
      timestamp: new Date().toISOString(),
      isRead: false,
      type: file.type.startsWith('image/') ? 'image' : 'file',
      attachments: [URL.createObjectURL(file)]
    }

    setMessages(prev => [...prev, message])
    toast.success('Файлът е прикачен')
  }

  const markConversationAsRead = (conversationId: string) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    )
  }

  const archiveConversation = (conversationId: string) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, isArchived: !conv.isArchived }
          : conv
      )
    )
    toast.success('Разговорът е архивиран')
  }

  const blockUser = (conversationId: string) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, isBlocked: true }
          : conv
      )
    )
    toast.success('Потребителят е блокиран')
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString('bg-BG', { hour: '2-digit', minute: '2-digit' })
    } else if (diffInHours < 48) {
      return 'Вчера'
    } else {
      return date.toLocaleDateString('bg-BG', { day: '2-digit', month: '2-digit' })
    }
  }

  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('bg-BG', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const formatLastSeen = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'сега'
    if (diffInMinutes < 60) return `преди ${diffInMinutes} мин`
    if (diffInMinutes < 1440) return `преди ${Math.floor(diffInMinutes / 60)} ч`
    return date.toLocaleDateString('bg-BG', { day: '2-digit', month: '2-digit' })
  }

  if (!isLoggedIn) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Съобщения
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`p-2 rounded-lg transition-colors ${
                  notificationsEnabled 
                    ? 'text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900' 
                    : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {notificationsEnabled ? <Bell size={20} /> : <BellOff size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto h-[calc(100vh-80px)]">
        <div className="grid grid-cols-1 md:grid-cols-3 h-full">
          {/* Conversations List */}
          <div className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 md:col-span-1">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Търси съобщения..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowArchived(false)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    !showArchived 
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  Активни
                </button>
                <button
                  onClick={() => setShowArchived(true)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    showArchived 
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  Архивирани
                </button>
              </div>
            </div>

            <div className="overflow-y-auto h-[calc(100vh-280px)]">
              {filteredConversations.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    {showArchived ? 'Няма Архивирани разговори' : 'Няма активни разговори'}
                  </p>
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`p-4 border-b border-gray-100 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      selectedConversation?.id === conversation.id ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-700' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                          <User size={20} className="text-primary-600 dark:text-primary-400" />
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${
                          conversation.isOnline ? 'bg-success-500' : 'bg-gray-400'
                        }`}></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                            {conversation.participantName}
                          </h3>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatTime(conversation.lastMessageTime)}
                          </span>
                        </div>
                        {conversation.taskTitle && (
                          <p className="text-xs text-primary-600 dark:text-primary-400 truncate">
                            {conversation.taskTitle}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                          {conversation.lastMessage}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          {conversation.unreadCount > 0 && (
                            <span className="inline-flex items-center justify-center w-5 h-5 bg-primary-600 text-white text-xs rounded-full">
                              {conversation.unreadCount}
                            </span>
                          )}
                          {!conversation.isOnline && conversation.lastSeen && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatLastSeen(conversation.lastSeen)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="bg-white dark:bg-gray-800 md:col-span-2 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                        <User size={16} className="text-primary-600 dark:text-primary-400" />
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${
                        selectedConversation.isOnline ? 'bg-success-500' : 'bg-gray-400'
                      }`}></div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">
                        {selectedConversation.participantName}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                 {selectedConversation.isOnline ? (
                           <>
                             <Circle size={12} className="text-success-500 fill-current" />
                             Онлайн
                           </>
                         ) : (
                           <>
                             <Circle size={12} className="text-gray-400" />
                             {selectedConversation.lastSeen ? `Последно ${formatLastSeen(selectedConversation.lastSeen)}` : 'Офлайн'}
                           </>
                         )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <Phone size={16} />
                    </button>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <Video size={16} />
                    </button>
                    <div className="relative">
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <MoreVertical size={16} />
                      </button>
                      {/* Dropdown menu would go here */}
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.senderId === currentUserId
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                        }`}
                      >
                        {message.type === 'image' && message.attachments && (
                          <img 
                            src={message.attachments[0]} 
                            alt="Attachment" 
                            className="w-full rounded mb-2"
                          />
                        )}
                        {message.type === 'file' && message.attachments && (
                          <div className="flex items-center gap-2 mb-2 p-2 bg-white/10 rounded">
                            <Paperclip size={16} />
                            <span className="text-sm">Прикачен файл</span>
                          </div>
                        )}
                        <p className="text-sm">{message.content}</p>
                        <div className={`flex items-center justify-between mt-1 ${
                          message.senderId === currentUserId ? 'text-primary-100' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          <span className="text-xs">
                            {formatMessageTime(message.timestamp)}
                          </span>
                          {message.senderId === currentUserId && (
                            <div className="flex items-center gap-1">
                              {message.isRead ? (
                                <CheckCheck size={12} />
                              ) : (
                                <Check size={12} />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex gap-3">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      <Paperclip size={20} />
                    </button>
                    <button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      <Smile size={20} />
                    </button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Напишете съобщение..."
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="btn btn-primary px-4 py-2 disabled:opacity-50"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx"
                  />
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Изберете разговор
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Изберете разговор от списъка, за да започнете да чатите
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 