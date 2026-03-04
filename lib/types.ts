// Booking related types
export interface BookingFormData {
  name: string
  email: string
  phone: string
  sessionType: "in-person" | "virtual"
  counsellorPreference: string
  concerns: string
  date?: Date
  time?: string
}

export interface BookingConfirmation {
  id: string
  name: string
  email: string
  date: string
  time: string
  sessionType: "in-person" | "virtual"
  createdAt: Date
}

// Chat related types
export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  createdAt: Date
}

// Self-assessment types
export interface AssessmentResult {
  score: number
  level: "low" | "moderate" | "high"
  recommendations: string[]
  suggestedServices: string[]
}

// Mood tracker types
export interface MoodEntry {
  date: string
  mood: number // 1-10
  notes: string
}

// Service types
export interface Service {
  id: string
  name: string
  description: string
  icon: string
  details?: string
  benefits?: string[]
  price?: number
}

// Testimonial types
export interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  avatar?: string
  rating: number
}

// Email types
export interface EmailPayload {
  to: string
  subject: string
  html: string
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: string
}
