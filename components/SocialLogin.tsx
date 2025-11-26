'use client'

import { useState } from 'react'
import { Facebook, Twitter, Github, Mail, ArrowRight } from 'lucide-react'
import { signIn } from 'next-auth/react'
import toast from 'react-hot-toast'

interface SocialLoginProps {
  className?: string
  variant?: 'default' | 'compact' | 'minimal'
  onSuccess?: () => void
  onError?: (error: string) => void
}

export default function SocialLogin({
  className = '',
  variant = 'default',
  onSuccess,
  onError
}: SocialLoginProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(provider)
    try {
      // OAuth providers require redirect: true
      await signIn(provider, {
        callbackUrl: '/'
      })
      // Note: This code won't execute because signIn redirects to OAuth provider
    } catch (error: any) {
      console.error(`Error with ${provider} login:`, error)
      toast.error(`Грешка при влизане с ${provider}`)
      onError?.(error.message)
      setIsLoading(null)
    }
  }

  const socialProviders = [
    {
      name: 'Google',
      icon: Mail,
      color: 'bg-red-600 hover:bg-red-700',
      provider: 'google'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600 hover:bg-blue-700',
      provider: 'facebook'
    },
    {
      name: 'GitHub',
      icon: Github,
      color: 'bg-gray-800 hover:bg-gray-900',
      provider: 'github'
    }
  ]

  if (variant === 'minimal') {
    return (
      <div className={`flex gap-2 ${className}`}>
        {socialProviders.map((provider) => (
          <button
            key={provider.provider}
            onClick={() => handleSocialLogin(provider.provider)}
            disabled={isLoading === provider.provider}
            className={`p-2 rounded-lg text-white transition-colors disabled:opacity-50 ${provider.color}`}
            title={`Влизане с ${provider.name}`}
          >
            <provider.icon className="h-4 w-4" />
          </button>
        ))}
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className={`space-y-2 ${className}`}>
        {socialProviders.map((provider) => (
          <button
            key={provider.provider}
            onClick={() => handleSocialLogin(provider.provider)}
            disabled={isLoading === provider.provider}
            className={`w-full flex items-center justify-center gap-3 px-4 py-2 rounded-lg text-white font-medium transition-colors disabled:opacity-50 ${provider.color}`}
          >
            {isLoading === provider.provider ? (
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <provider.icon className="h-4 w-4" />
            )}
            {isLoading === provider.provider ? 'Влизане...' : `Продължи с ${provider.name}`}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-600" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
            Или влезте с
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {socialProviders.map((provider) => (
          <button
            key={provider.provider}
            onClick={() => handleSocialLogin(provider.provider)}
            disabled={isLoading === provider.provider}
            className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg text-white font-medium transition-all duration-200 disabled:opacity-50 hover:scale-[1.02] ${provider.color}`}
          >
            {isLoading === provider.provider ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <provider.icon className="h-5 w-5" />
            )}
            <span>
              {isLoading === provider.provider ? 'Влизане...' : `Продължи с ${provider.name}`}
            </span>
            <ArrowRight className="h-4 w-4 ml-auto" />
          </button>
        ))}
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
        Като се регистрирате, вие се съгласявате с нашите{' '}
        <a href="/terms" className="text-blue-600 hover:underline">
          Условия за ползване
        </a>{' '}
        и{' '}
        <a href="/privacy" className="text-blue-600 hover:underline">
          Политика за поверителност
        </a>
      </div>
    </div>
  )
}

// Additional component for social profile linking
export function SocialProfileLinker() {
  const [isLinking, setIsLinking] = useState<string | null>(null)

  const handleLinkAccount = async (provider: string) => {
    setIsLinking(provider)
    try {
      // OAuth providers require redirect
      await signIn(provider, {
        callbackUrl: '/profile'
      })
    } catch (error: any) {
      console.error(`Error linking ${provider}:`, error)
      toast.error(`Грешка при свързване с ${provider}`)
      setIsLinking(null)
    }
  }

  const linkedAccounts = [
    { provider: 'google', name: 'Google', icon: Mail, linked: false },
    { provider: 'facebook', name: 'Facebook', icon: Facebook, linked: false },
    { provider: 'github', name: 'GitHub', icon: Github, linked: false }
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
        Свързани акаунти
      </h3>
      <div className="space-y-2">
        {linkedAccounts.map((account) => (
          <div
            key={account.provider}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <account.icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {account.name}
              </span>
            </div>
            <button
              onClick={() => handleLinkAccount(account.provider)}
              disabled={isLinking === account.provider || account.linked}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                account.linked
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isLinking === account.provider ? (
                'Свързване...'
              ) : account.linked ? (
                'Свързано'
              ) : (
                'Свържи'
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}


