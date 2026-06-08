import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <nav className="bg-white border-b border-brand-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <img src="/logo.svg" alt="Veritas" className="h-8 w-auto" />
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/chat" className="btn-ghost text-sm font-sans">Ask a Question</Link>
              <Link to="/profile" className="btn-ghost text-sm font-sans">{user.name}</Link>
              <Link to="/subscription" className="btn-ghost text-sm font-sans">
                {user.subscription_tier === 'free' ? 'Upgrade' : 'Plan'}
              </Link>
              <button onClick={handleLogout} className="btn-ghost text-sm font-sans text-brand-muted">Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost text-sm font-sans">Log In</Link>
              <Link to="/signup" className="btn-primary text-sm">Start Free</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}