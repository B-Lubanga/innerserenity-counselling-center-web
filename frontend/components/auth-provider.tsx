"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { User, isAuthenticated, getUser, clearAuth } from "@/lib/auth"
import { toast } from "sonner"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: User, accessToken: string, refreshToken: string) => void
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check authentication status on mount
    const checkAuth = () => {
      if (isAuthenticated()) {
        const currentUser = getUser()
        setUser(currentUser)
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = (user: User, accessToken: string, refreshToken: string) => {
    setUser(user)
    // Save tokens to localStorage
    localStorage.setItem('access_token', accessToken)
    localStorage.setItem('refresh_token', refreshToken)
    localStorage.setItem('user', JSON.stringify(user))
  }

  const logout = () => {
    setUser(null)
    clearAuth()
    toast("See you soon! 👋", {
      description: "You have been logged out successfully.",
      duration: 3000,
    })
  }

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        logout()
        return
      }

      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const updatedUser = await response.json()
        setUser(updatedUser)
        localStorage.setItem('user', JSON.stringify(updatedUser))
      } else {
        logout()
      }
    } catch (error) {
      console.error('Failed to refresh user:', error)
      logout()
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
