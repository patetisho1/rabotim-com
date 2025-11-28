// Haptic feedback utilities for mobile
// Uses the Vibration API when available

export const haptics = {
  // Light tap feedback
  light: () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(10)
    }
  },

  // Medium feedback for selections
  medium: () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(20)
    }
  },

  // Heavy feedback for important actions
  heavy: () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(30)
    }
  },

  // Success pattern
  success: () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([10, 50, 20])
    }
  },

  // Error pattern
  error: () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([30, 50, 30, 50, 30])
    }
  },

  // Warning pattern
  warning: () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([20, 40, 20])
    }
  },

  // Selection changed
  selection: () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(5)
    }
  }
}

// Hook for using haptics in components
export function useHaptics() {
  return haptics
}

