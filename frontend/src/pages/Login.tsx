import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email, password)
      navigate('/chat')
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <div className="text-center mb-8">
            <img src="/logo.svg" alt="Veritas" className="h-8 mx-auto mb-4" />
            <h1 className="text-h3 text-brand-black mb-1">Welcome back</h1>
            <p className="text-sm text-brand-muted font-sans">Sign in to continue your study.</p>
          </div>

          {error && (
            <div className="bg-brand-red/5 border border-brand-red/20 text-brand-red px-4 py-3 rounded-lg text-sm font-sans mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-brand-black mb-1.5 font-sans">Email</label>
              <input type="email" className="input-field" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-black mb-1.5 font-sans">Password</label>
              <input type="password" className="input-field" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Your password" />
            </div>
            <button type="submit" disabled={submitting} className="btn-primary w-full justify-center">
              {submitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-brand-muted mt-6 font-sans">
            Don't have an account?{' '}
            <Link to="/signup" className="text-brand-blue hover:text-brand-gold font-medium transition-colors">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}