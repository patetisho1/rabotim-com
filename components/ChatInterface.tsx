'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, Paperclip, Image, Smile, MoreVertical, Phone, Video, User, Clock, Check, CheckCheck, Mic, MicOff, Volume2, VolumeX } from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'other'
  timestamp: Date
  status: 'sending' | 'sent' | 'delivered' | 'read'
  attachments?: Array<{
    id: string
    type: 'image' | 'file' | 'audio'
    url: string
    name: string
    size?: number
  }>
}

interface ChatInterfaceProps {
  recipient: {
    id: string
    name: string
    avatar: string
    online: boolean
    lastSeen?: Date
  }
  onSendMessage: (message: string, attachments?: File[]) => Promise<void>
  onCall?: () => void
  onVideoCall?: () => void
  className?: string
}

export default function ChatInterface({
  recipient,
  onSendMessage,
  onCall,
  onVideoCall,
  className = ''
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showAttachments, setShowAttachments] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Simulate typing indicator
  useEffect(() => {
    if (isTyping) {
      const timer = setTimeout(() => setIsTyping(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isTyping])

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !showAttachments) return

    setIsLoading(true)
    try {
      const messageText = newMessage.trim()
      if (messageText) {
        await onSendMessage(messageText)
        setNewMessage('')
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileUpload = useCallback((files: File[]) => {
    // Handle file upload logic here
    console.log('Files to upload:', files)
    setShowAttachments(false)
  }, [])

  const startRecording = () => {
    setIsRecording(true)
    // Implement audio recording logic
  }

  const stopRecording = () => {
    setIsRecording(false)
    // Stop recording and send audio
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('bg-BG', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sending':
        return <Clock size={12} className="text-gray-400" />
      case 'sent':
        return <Check size={12} className="text-gray-400" />
      case 'delivered':
        return <CheckCheck size={12} className="text-gray-400" />
      case 'read':
        return <CheckCheck size={12} className="text-blue-500" />
      default:
        return null
    }
  }

  const emojis = ['😊', '👍', '❤️', '😂', '😍', '🎉', '🔥', '💯', '👏', '🙏']

  return (
    <div className={`flex flex-col h-full bg-white dark:bg-gray-800 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={recipient.avatar}
              alt={recipient.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            {recipient.online && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {recipient.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {recipient.online ? 'Онлайн' : recipient.lastSeen ? `Последно ${formatTime(recipient.lastSeen)}` : 'Офлайн'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {onCall && (
            <button
              onClick={onCall}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
            >
              <Phone size={20} />
            </button>
          )}
          {onVideoCall && (
            <button
              onClick={onVideoCall}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
            >
              <Video size={20} />
            </button>
          )}
          <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <User size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              Започнете разговор с {recipient.name}
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                <div
                  className={`p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="space-y-2 mb-2">
                      {message.attachments.map((attachment) => (
                        <div key={attachment.id} className="flex items-center gap-2">
                          {attachment.type === 'image' ? (
                            <img
                              src={attachment.url}
                              alt={attachment.name}
                              className="w-20 h-20 object-cover rounded"
                            />
                          ) : (
                            <div className="flex items-center gap-2 p-2 bg-white/10 rounded">
                              <Paperclip size={16} />
                              <span className="text-sm">{attachment.name}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-sm">{message.text}</p>
                </div>
                <div className={`flex items-center gap-1 mt-1 text-xs text-gray-500 dark:text-gray-400 ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}>
                  <span>{formatTime(message.timestamp)}</span>
                  {message.sender === 'user' && getStatusIcon(message.status)}
                </div>
              </div>
            </div>
          ))
        )}
        
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

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="grid grid-cols-8 gap-2">
            {emojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => {
                  setNewMessage(prev => prev + emoji)
                  setShowEmojiPicker(false)
                }}
                className="p-2 text-2xl hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-end gap-2">
          {/* Attachment Button */}
          <button
            onClick={() => setShowAttachments(!showAttachments)}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
          >
            <Paperclip size={20} />
          </button>

          {/* Message Input */}
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Напишете съобщение..."
              rows={1}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none max-h-32"
              style={{
                minHeight: '44px',
                maxHeight: '120px'
              }}
            />
            
            {/* Emoji Button */}
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute right-2 bottom-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <Smile size={20} />
            </button>
          </div>

          {/* Voice/Record Button */}
          {!newMessage.trim() ? (
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`p-3 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation ${
                isRecording
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
          ) : (
            <button
              onClick={handleSendMessage}
              disabled={isLoading}
              className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
            >
              <Send size={20} />
            </button>
          )}
        </div>

                 {/* Attachment Options */}
         {showAttachments && (
           <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
             <div className="grid grid-cols-3 gap-3">
               <button
                 onClick={() => fileInputRef.current?.click()}
                 className="flex flex-col items-center gap-2 p-3 bg-white dark:bg-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors"
               >
                 <Image size={24} className="text-blue-600" />
                 <span className="text-xs text-gray-600 dark:text-gray-300">Снимка</span>
               </button>
               <button
                 onClick={() => fileInputRef.current?.click()}
                 className="flex flex-col items-center gap-2 p-3 bg-white dark:bg-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors"
               >
                 <Paperclip size={24} className="text-green-600" />
                 <span className="text-xs text-gray-600 dark:text-gray-300">Файл</span>
               </button>
               <button
                 onClick={startRecording}
                 className="flex flex-col items-center gap-2 p-3 bg-white dark:bg-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors"
               >
                 <Mic size={24} className="text-purple-600" />
                 <span className="text-xs text-gray-600 dark:text-gray-300">Аудио</span>
               </button>
             </div>
           </div>
         )}

        {/* Audio Controls */}
        {isRecording && (
          <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-red-600 dark:text-red-400">Записване...</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="p-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
                <button
                  onClick={stopRecording}
                  className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
                >
                  Спри
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

             {/* Hidden File Input */}
       <input
         ref={fileInputRef}
         type="file"
         multiple
         accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
         onChange={(e) => {
           const files = Array.from(e.target.files || [])
           if (files.length > 0) {
             handleFileUpload(files)
           }
         }}
         className="hidden"
       />
    </div>
  )
}
