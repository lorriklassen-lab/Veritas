import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await signup(email, name, password)
      navigate('/chat')
    } catch (err: any) {
      setError(err.message || 'Signup failed')
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
            <h1 className="text-h3 text-brand-black mb-1">Start your study</h1>
            <p className="text-sm text-brand-muted font-sans">Create a free account to begin asking questions.</p>
          </div>

          {error && (
            <div className="bg-brand-red/5 border border-brand-red/20 text-brand-red px-4 py-3 rounded-lg text-sm font-sans mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-brand-black mb-1.5 font-sans">Name</label>
              <input type="text" className="input-field" value={name} onChange={e => setName(e.target.value)} required placeholder="Your name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-black mb-1.5 font-sans">Email</label>
              <input type="email" className="input-field" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-black mb-1.5 font-sans">Password</label>
              <input type="password" className="input-field" value={password} onChange={e => setPassword(e.target.value)} required placeholder="At least 8 characters" minLength={8} />
            </div>
            <button type="submit" disabled={submitting} className="btn-primary w-full justify-center">
              {submitting ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-brand-muted mt-6 font-sans">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-blue hover:text-brand-gold font-medium transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}