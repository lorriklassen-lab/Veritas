import React, { createContext, useContext, useEffect, useState } from 'react'
import { getAuth, login as apiLogin, signup as apiSignup, logout as apiLogout, fetchProfile, subscribe } from '../lib/auth'

interface User {
  id: string
  email: string
  name: string
  subscription_tier: string
  queries_remaining: number
  queries_limit: number
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, name: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(getAuth().user)
  const [loading, setLoading] = useState(getAuth().loading)

  useEffect(() => {
    const unsub = subscribe(() => {
      const state = getAuth()
      setUser(state.user)
      setLoading(state.loading)
    })
    const token = localStorage.getItem('veritas_token')
    if (token && !getAuth().user) {
      fetchProfile().catch(() => {
        localStorage.removeItem('veritas_token')
      }).finally(() => {
        setLoading(false)
      })
    } else if (!token) {
      setLoading(false)
    }
    return () => { unsub() }
  }, [])

  const login = async (email: string, password: string) => {
    await apiLogin(email, password)
  }

  const signup = async (email: string, name: string, password: string) => {
    await apiSignup(email, name, password)
  }

  const logout = async () => {
    await apiLogout()
  }

  const refresh = async () => {
    await fetchProfile()
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}