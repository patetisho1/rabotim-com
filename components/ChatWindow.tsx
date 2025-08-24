'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Send, 
  Paperclip, 
  Image as ImageIcon, 
  File, 
  X,
  MoreVertical,
  Phone,
  Video,
  Search,
  Smile
} from 'lucide-react'

interface Message {
  id: string
  senderId: string
  senderName: string
  senderAvatar: string
  content: string
  timestamp: string
  type: 'text' | 'image' | 'file'
  attachments?: string[]
  isRead: boolean
}

interface ChatWindowProps {
  taskId: string
  taskTitle: string
  otherUser: {
    id: string
    name: string
    avatar: string
    isOnline: boolean
  }
  onClose: () => void
  isOpen: boolean
}

export default function ChatWindow({ 
  taskId, 
  taskTitle, 
  otherUser, 
  onClose, 
  isOpen 
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Симулираме зареждане на съобщения
    const mockMessages: Message[] = [
      {
        id: '1',
        senderId: otherUser.id,
        senderName: otherUser.name,
        senderAvatar: otherUser.avatar,
        content: 'Здравейте! Видях вашата задача за ремонт на баня. Имам голям опит в тази област.',
        timestamp: '2024-03-18T10:00:00Z',
        type: 'text',
        isRead: true
      },
      {
        id: '2',
        senderId: 'current-user',
        senderName: 'Вие',
        senderAvatar: '/api/placeholder/40/40',
        content: 'Здравейте! Благодаря за интереса. Кога бихте могли да започнете работа?',
        timestamp: '2024-03-18T10:05:00Z',
        type: 'text',
        isRead: true
      },
      {
        id: '3',
        senderId: otherUser.id,
        senderName: otherUser.name,
        senderAvatar: otherUser.avatar,
        content: 'Мога да започна утре сутринта. Имате ли снимки на текущото състояние?',
        timestamp: '2024-03-18T10:10:00Z',
        type: 'text',
        isRead: true
      },
      {
        id: '4',
        senderId: 'current-user',
        senderName: 'Вие',
        senderAvatar: '/api/placeholder/40/40',
        content: 'Да, ще ги прикача сега.',
        timestamp: '2024-03-18T10:15:00Z',
        type: 'text',
        isRead: false
      }
    ]
    setMessages(mockMessages)
  }, [otherUser.id, otherUser.name, otherUser.avatar])

  useEffect(() => {
    // Скролиране към най-новите съобщения
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      senderId: 'current-user',
      senderName: 'Вие',
      senderAvatar: '/api/placeholder/40/40',
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: 'text',
      isRead: false
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')

    // Симулираме отговор
    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        senderId: otherUser.id,
        senderName: otherUser.name,
        senderAvatar: otherUser.avatar,
        content: 'Получих вашето съобщение. Ще отговоря скоро!',
        timestamp: new Date().toISOString(),
        type: 'text',
        isRead: false
      }
      setMessages(prev => [...prev, reply])
    }, 2000)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    files.forEach(file => {
      const message: Message = {
        id: Date.now().toString(),
        senderId: 'current-user',
        senderName: 'Вие',
        senderAvatar: '/api/placeholder/40/40',
        content: `Прикачен файл: ${file.name}`,
        timestamp: new Date().toISOString(),
        type: file.type.startsWith('image/') ? 'image' : 'file',
        attachments: [URL.createObjectURL(file)],
        isRead: false
      }
      setMessages(prev => [...prev, message])
    })
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('bg-BG', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredMessages = messages.filter(message =>
    message.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!isOpen) return null

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={otherUser.avatar}
              alt={otherUser.name}
              className="w-10 h-10 rounded-full"
            />
            {otherUser.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {otherUser.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {taskTitle}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Phone size={16} className="text-gray-600 dark:text-gray-400" />
          </button>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Video size={16} className="text-gray-600 dark:text-gray-400" />
          </button>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <MoreVertical size={16} className="text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={16} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Търси в съобщенията..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
          />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredMessages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.senderId === 'current-user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs lg:max-w-md ${message.senderId === 'current-user' ? 'order-2' : 'order-1'}`}>
              {message.senderId !== 'current-user' && (
                <div className="flex items-center gap-2 mb-1">
                  <img
                    src={message.senderAvatar}
                    alt={message.senderName}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {message.senderName}
                  </span>
                </div>
              )}
              
              <div
                className={`p-3 rounded-lg ${
                  message.senderId === 'current-user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                {message.type === 'image' && message.attachments && (
                  <div className="mb-2">
                    <img
                      src={message.attachments[0]}
                      alt="Attached image"
                      className="max-w-full rounded"
                    />
                  </div>
                )}
                
                {message.type === 'file' && message.attachments && (
                  <div className="mb-2 flex items-center gap-2 p-2 bg-white dark:bg-gray-600 rounded">
                    <File size={16} />
                    <span className="text-sm">{message.content}</span>
                  </div>
                )}
                
                <p className="text-sm">{message.content}</p>
                
                <div className={`text-xs mt-1 ${
                  message.senderId === 'current-user' 
                    ? 'text-blue-100' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {formatTime(message.timestamp)}
                  {message.senderId === 'current-user' && (
                    <span className="ml-2">
                      {message.isRead ? '✓✓' : '✓'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
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

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSendMessage} className="flex items-end gap-2">
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Напишете съобщение..."
              rows={1}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage(e)
                }
              }}
            />
          </div>
          
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Paperclip size={16} className="text-gray-600 dark:text-gray-400" />
            </button>
            
            <button
              type="button"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Smile size={16} className="text-gray-600 dark:text-gray-400" />
            </button>
            
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={16} />
            </button>
          </div>
        </form>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileUpload}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx"
        />
      </div>
    </div>
  )
} 