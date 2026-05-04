import { MOCK_AVAILABILITY, BOOKED_SLOTS } from "./constants"

/**
 * Format date to readable string
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

/**
 * Get available time slots for a specific date
 */
export function getAvailableSlots(date: Date): string[] {
  const dateKey = date.toISOString().split("T")[0]
  const available = MOCK_AVAILABILITY[dateKey as keyof typeof MOCK_AVAILABILITY] || []
  const booked = BOOKED_SLOTS[dateKey as keyof typeof BOOKED_SLOTS] || []
  return available.filter((slot) => !booked.includes(slot))
}

/**
 * Check if a time slot is booked
 */
export function isSlotBooked(date: Date, time: string): boolean {
  const dateKey = date.toISOString().split("T")[0]
  const booked = BOOKED_SLOTS[dateKey as keyof typeof BOOKED_SLOTS] || []
  return booked.includes(time)
}

/**
 * Check if a date is in the past
 */
export function isPastDate(date: Date): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate phone number format
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/
  return phoneRegex.test(phone.replace(/\s/g, ""))
}

/**
 * Generate a unique booking ID
 */
export function generateBookingId(): string {
  return `BOOK-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
}

/**
 * Sanitize input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  // Simple client-safe sanitization - encode HTML entities
  const div = document.createElement("div")
  div.textContent = input
  return div.innerHTML
}

/**
 * Server-side sanitization (no DOM access)
 */
export function sanitizeInputServer(input: string): string {
  // HTML entity encoding for server-side use
  const htmlEscapeMap: { [key: string]: string } = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
  }
  return input.replace(/[&<>"'\/]/g, (char) => htmlEscapeMap[char])
}

/**
 * Debounce function for event handlers
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false

  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}
