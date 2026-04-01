import { createContext, useContext, useState } from 'react'

export const AuthContext = createContext(null)

const seedUser = null

export function AuthProvider({ children }) {
  const [user, setUser] = useState(seedUser)
  const [authLoading, setAuthLoading] = useState(false)

  const login = async (email, password, role, name) => {
    setAuthLoading(true)

    const nextUser = {
      id: `user-${Date.now()}`,
      name: name || 'Venture Assist User',
      email: email || 'user@ventureassist.app',
      role: role || 'user',
    }

    setUser(nextUser)
    setAuthLoading(false)
    return nextUser
  }

  const logout = async () => {
    setAuthLoading(true)
    setUser(null)
    setAuthLoading(false)
  }

  const value = {
    user,
    setUser,
    isAuthenticated: Boolean(user),
    authLoading,
    login,
    logout,
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
