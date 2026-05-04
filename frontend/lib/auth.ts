export interface User {
  id: number
  first_name: string
  last_name: string
  email: string
  auth_provider: string
  is_verified: boolean
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
}

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user'
} as const

export function saveAuthTokens(access_token: string, refresh_token: string, user: User): void {
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token)
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh_token)
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
}

export function getAuthToken(): string | null {
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
}

export function getUser(): User | null {
  const userStr = localStorage.getItem(STORAGE_KEYS.USER)
  if (userStr) {
    try {
      return JSON.parse(userStr) as User
    } catch {
      return null
    }
  }
  return null
}

export function clearAuth(): void {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
  localStorage.removeItem(STORAGE_KEYS.USER)
}

export function isAuthenticated(): boolean {
  return !!getAuthToken() && !!getUser()
}

export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) {
    return null
  }

  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })

    if (response.ok) {
      const data = await response.json()
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.access_token)
      return data.access_token
    } else {
      // Refresh token is invalid, clear auth
      clearAuth()
      return null
    }
  } catch (error) {
    console.error('Failed to refresh token:', error)
    clearAuth()
    return null
  }
}

export async function apiCallWithAuth<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  let token = getAuthToken()
  
  // If no token, try to refresh
  if (!token) {
    token = await refreshAccessToken()
    if (!token) {
      throw new Error('Not authenticated')
    }
  }

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    ...options.headers,
  }

  let response = await fetch(url, {
    ...options,
    headers,
  })

  // If unauthorized, try to refresh token once
  if (response.status === 401) {
    token = await refreshAccessToken()
    if (token) {
      response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          'Authorization': `Bearer ${token}`,
        },
      })
    }
  }

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`)
  }

  return response.json() as Promise<T>
}
