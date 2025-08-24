export interface Message {
  id: string
  conversationId: string
  senderId: string
  receiverId: string
  content: string
  timestamp: Date
  isRead: boolean
  type: 'text' | 'image' | 'file'
  attachments?: string[]
}

export interface Conversation {
  id: string
  participants: string[]
  title?: string
  lastMessage?: Message
  unreadCount: number
  createdAt: Date
  updatedAt: Date
  taskId?: string // Ако съобщението е свързано с задача
}

export interface ChatUser {
  id: string
  name: string
  avatar?: string
  isOnline: boolean
  lastSeen?: Date
}

export interface MessageState {
  conversations: Conversation[]
  currentConversation: Conversation | null
  messages: Message[]
  isLoading: boolean
  error: string | null
} 