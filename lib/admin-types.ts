// Admin Dashboard Types

export type UserRole = "admin" | "counsellor" | "staff"

export interface AdminUser {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  createdAt: Date
  lastLogin?: Date
}

export interface ClientProfile {
  id: string
  name: string
  email: string
  phone: string
  dateOfBirth?: string
  address?: string
  sessionCount: number
  totalSpent: number
  status: "active" | "inactive" | "paused"
  notes?: string
  createdAt: Date
  lastSessionDate?: Date
}

export interface CounsellingSession {
  id: string
  clientId: string
  counsellorId: string
  dateTime: Date
  duration: number // in minutes
  type: "individual" | "couples" | "family" | "group" | "crisis"
  sessionMode: "in-person" | "virtual"
  status: "scheduled" | "completed" | "cancelled" | "no-show"
  notes?: string
  transcription?: string
  counsellorNotes?: string
  recording?: {
    url: string
    duration: number
  }
  createdAt: Date
  updatedAt: Date
}

export interface SessionNote {
  id: string
  sessionId: string
  counsellorId: string
  content: string
  keyPoints: string[]
  recommendations: string[]
  followUp?: string
  createdAt: Date
  updatedAt: Date
}

export interface DashboardMetrics {
  totalClients: number
  activeClients: number
  totalSessions: number
  completedSessions: number
  noShowCount: number
  totalRevenue: number
  averageSessionRating?: number
  upcomingSessions: number
  thisMonthRevenue: number
  thisMonthSessions: number
  clientSatisfactionRate?: number
}

export interface CounsellorPerformance {
  counsellorId: string
  name: string
  sessionsThisMonth: number
  clientRating: number
  specializations: string[]
  revenueThisMonth: number
  clientRetentionRate: number
  notesCompletionRate: number
}

export interface AdminLog {
  id: string
  userId: string
  action: string
  resource: string
  resourceId: string
  changes?: Record<string, any>
  timestamp: Date
  ipAddress?: string
}

export interface ReportData {
  period: "monthly" | "quarterly" | "yearly"
  startDate: Date
  endDate: Date
  totalRevenue: number
  totalSessions: number
  newClients: number
  clientRetention: number
  topCounsellors: CounsellorPerformance[]
  sessionTypeBreakdown: Record<string, number>
  satisfactionScores: number[]
}
