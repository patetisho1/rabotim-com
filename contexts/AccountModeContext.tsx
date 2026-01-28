'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from '@/hooks/useAuth'

type AccountMode = 'normal' | 'professional'

interface ProfessionalStatus {
  hasDraft: boolean      // Has started filling professional profile
  isActive: boolean      // Has paid and profile is active
  planType: 'basic' | 'professional' | 'enterprise' | null
  planExpiresAt: string | null
}

interface AccountModeContextType {
  mode: AccountMode
  setMode: (mode: AccountMode) => void
  toggleMode: () => void
  professionalStatus: ProfessionalStatus
  isLoadingStatus: boolean
  refreshStatus: () => Promise<void>
}

const defaultProfessionalStatus: ProfessionalStatus = {
  hasDraft: false,
  isActive: false,
  planType: null,
  planExpiresAt: null
}

const AccountModeContext = createContext<AccountModeContextType | undefined>(undefined)

export function AccountModeProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [mode, setModeState] = useState<AccountMode>('normal')
  const [professionalStatus, setProfessionalStatus] = useState<ProfessionalStatus>(defaultProfessionalStatus)
  const [isLoadingStatus, setIsLoadingStatus] = useState(true)

  // Load saved mode from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('accountMode') as AccountMode
      if (savedMode && (savedMode === 'normal' || savedMode === 'professional')) {
        setModeState(savedMode)
      }
    }
  }, [])

  // Fetch professional profile status when user changes
  useEffect(() => {
    if (user?.id) {
      refreshStatus()
    } else {
      setProfessionalStatus(defaultProfessionalStatus)
      setIsLoadingStatus(false)
    }
  }, [user?.id])

  const refreshStatus = async () => {
    if (!user?.id) return
    
    setIsLoadingStatus(true)
    try {
      const response = await fetch(`/api/professional-profiles/status?userId=${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setProfessionalStatus({
          hasDraft: data.hasDraft || false,
          isActive: data.isActive || false,
          planType: data.planType || null,
          planExpiresAt: data.planExpiresAt || null
        })
      }
    } catch (error) {
      console.error('Error fetching professional status:', error)
    } finally {
      setIsLoadingStatus(false)
    }
  }

  const setMode = (newMode: AccountMode) => {
    setModeState(newMode)
    if (typeof window !== 'undefined') {
      localStorage.setItem('accountMode', newMode)
    }
  }

  const toggleMode = () => {
    const newMode = mode === 'normal' ? 'professional' : 'normal'
    setMode(newMode)
  }

  return (
    <AccountModeContext.Provider 
      value={{ 
        mode, 
        setMode, 
        toggleMode, 
        professionalStatus, 
        isLoadingStatus,
        refreshStatus 
      }}
    >
      {children}
    </AccountModeContext.Provider>
  )
}

export function useAccountMode() {
  const context = useContext(AccountModeContext)
  if (context === undefined) {
    throw new Error('useAccountMode must be used within an AccountModeProvider')
  }
  return context
}


