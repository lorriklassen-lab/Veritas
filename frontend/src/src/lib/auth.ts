const API_BASE = '/api'

interface User {
  id: string
  email: string
  name: string
  subscription_tier: string
  queries_remaining: number
  queries_limit: number
}

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
}

let authState: AuthState = {
  user: null,
  token: localStorage.getItem('veritas_token'),
  loading: true,
}

const listeners: Set<() => void> = new Set()

function notify() {
  listeners.forEach(fn => fn())
}

export function subscribe(fn: () => void): () => void {
  listeners.add(fn)
  return () => { listeners.delete(fn); }
}

export function getAuth(): AuthState {
  return { ...authState }
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = authState.token
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  })

  if (res.status === 401) {
    // Token expired or invalid
    localStorage.removeItem('veritas_token')
    authState = { user: null, token: null, loading: false }
    notify()
    throw new Error('Session expired. Please log in again.')
  }

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.detail || 'Request failed')
  }
  return data
}

export async function login(email: string, password: string) {
  const data = await apiRequest<{ access_token: string; user: User }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  localStorage.setItem('veritas_token', data.access_token)
  authState = { user: data.user, token: data.access_token, loading: false }
  notify()
  return data
}

export async function signup(email: string, name: string, password: string) {
  const data = await apiRequest<{ access_token: string; user: User }>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, name, password }),
  })
  localStorage.setItem('veritas_token', data.access_token)
  authState = { user: data.user, token: data.access_token, loading: false }
  notify()
  return data
}

export async function logout() {
  localStorage.removeItem('veritas_token')
  authState = { user: null, token: null, loading: false }
  notify()
}

export async function fetchProfile() {
  const data = await apiRequest<User>('/user/profile')
  authState = { ...authState, user: data, loading: false }
  notify()
  return data
}