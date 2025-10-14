/**
 * Utility functions for profile privacy and contact visibility
 */

export interface ProfileUser {
  id: string
  full_name: string
  email?: string
  phone?: string
  avatar_url?: string
  location?: string
  bio?: string
  rating?: number
  total_reviews?: number
  verified?: boolean
  is_premium?: boolean
}

/**
 * Check if the current user can view contact details of a profile
 * Contacts are visible if:
 * 1. The viewer is the profile owner
 * 2. The viewer has applied to one of the profile owner's tasks
 * 3. The profile owner has applied to one of the viewer's tasks
 * 4. The profile is premium (contacts are always visible)
 */
export function canViewContacts(
  profileUserId: string,
  currentUserId: string | null,
  hasAppliedToTask: boolean = false,
  isPremiumProfile: boolean = false
): boolean {
  // Profile owner can always see their own contacts
  if (profileUserId === currentUserId) {
    return true
  }

  // Premium profiles have visible contacts
  if (isPremiumProfile) {
    return true
  }

  // Contacts visible if user has applied to a task or vice versa
  if (hasAppliedToTask) {
    return true
  }

  return false
}

/**
 * Mask phone number for privacy
 * Example: +359888123456 -> +359888***456
 */
export function maskPhoneNumber(phone: string): string {
  if (!phone) return ''
  
  // Keep first 6 and last 3 digits, mask the rest
  if (phone.length > 9) {
    const start = phone.slice(0, 6)
    const end = phone.slice(-3)
    const masked = '*'.repeat(phone.length - 9)
    return `${start}${masked}${end}`
  }
  
  return phone.slice(0, 3) + '***' + phone.slice(-2)
}

/**
 * Mask email for privacy
 * Example: user@example.com -> u***r@example.com
 */
export function maskEmail(email: string): string {
  if (!email) return ''
  
  const [localPart, domain] = email.split('@')
  if (!localPart || !domain) return email
  
  if (localPart.length <= 2) {
    return `${localPart[0]}***@${domain}`
  }
  
  const masked = localPart[0] + '***' + localPart[localPart.length - 1]
  return `${masked}@${domain}`
}

/**
 * Get visible profile data based on permissions
 */
export function getVisibleProfile(
  profile: ProfileUser,
  currentUserId: string | null,
  hasAppliedToTask: boolean = false
): ProfileUser {
  const canView = canViewContacts(
    profile.id,
    currentUserId,
    hasAppliedToTask,
    profile.is_premium || false
  )

  if (canView) {
    return profile
  }

  // Return profile with masked contacts
  return {
    ...profile,
    email: profile.email ? maskEmail(profile.email) : undefined,
    phone: profile.phone ? maskPhoneNumber(profile.phone) : undefined
  }
}

/**
 * Get contact visibility tooltip message
 */
export function getContactVisibilityMessage(
  isPremiumProfile: boolean,
  hasAppliedToTask: boolean
): string {
  if (isPremiumProfile) {
    return 'Контактите са видими - Premium профил'
  }
  
  if (hasAppliedToTask) {
    return 'Контактите са видими след кандидатстване'
  }
  
  return 'Кандидатствайте за обява, за да видите пълните контакти'
}


