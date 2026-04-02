import { createContext, useContext, useState, useEffect } from 'react'
import * as authService from '../services/authService'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [authError, setAuthError] = useState(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Restore session on mount
  useEffect(() => {
    const storedToken = authService.getStoredToken()
    const storedUser = authService.getStoredUser()

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(storedUser)
    }

    setIsInitialized(true)
    setAuthLoading(false)
  }, [])

  const login = async (email, password) => {
    setAuthLoading(true)
    setAuthError(null)

    try {
      const data = await authService.loginUser(email, password)
      const { user: userData, token: authToken } = data

      authService.storeAuth(authToken, userData)
      setToken(authToken)
      setUser(userData)
      setAuthError(null)

      return userData
    } catch (error) {
      const errorMsg = error.message || 'Login failed'
      setAuthError(errorMsg)
      throw error
    } finally {
      setAuthLoading(false)
    }
  }

  const register = async (name, email, password) => {
    setAuthLoading(true)
    setAuthError(null)

    try {
      const data = await authService.registerUser(name, email, password)
      const { user: userData, token: authToken } = data

      authService.storeAuth(authToken, userData)
      setToken(authToken)
      setUser(userData)
      setAuthError(null)

      return userData
    } catch (error) {
      const errorMsg = error.message || 'Registration failed'
      setAuthError(errorMsg)
      throw error
    } finally {
      setAuthLoading(false)
    }
  }

  const logout = () => {
    setAuthLoading(true)
    authService.logout()
    setUser(null)
    setToken(null)
    setAuthError(null)
    setAuthLoading(false)
  }

  const value = {
    user,
    token,
    setUser,
    isAuthenticated: Boolean(user && token),
    authLoading,
    authError,
    login,
    register,
    logout,
    isInitialized,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
