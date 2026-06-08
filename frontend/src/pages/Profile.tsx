import { useState } from 'react'
import { useAuth } from '../lib/AuthContext'
import { apiRequest } from '../lib/auth'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const { user, refresh } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState(user?.name || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await apiRequest('/user/profile', {
        method: 'PUT',
        body: JSON.stringify({ name }),
      })
      await refresh()
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-h2 text-brand-black mb-8">Profile</h1>

      <div className="card p-6 mb-6">
        <h2 className="text-h4 text-brand-black mb-4">Account Details</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-black mb-1.5 font-sans">Name</label>
            <input type="text" className="input-field" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-black mb-1.5 font-sans">Email</label>
            <input type="email" className="input-field bg-brand-parchment" value={user?.email || ''} disabled />
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            {saved && <span className="text-sm text-brand-green font-sans">Saved!</span>}
          </div>
        </form>
      </div>

      <div className="card p-6">
        <h2 className="text-h4 text-brand-black mb-4">Subscription</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-brand-muted font-sans">Current Plan</p>
            <p className="text-xl font-semibold capitalize text-brand-black">{user?.subscription_tier || 'Free'}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-brand-muted font-sans">Queries Remaining</p>
            <p className="text-xl font-semibold text-brand-black">
              {user?.queries_remaining ?? 0} / {user?.queries_limit === 999999 ? '∞' : user?.queries_limit ?? 5}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <button onClick={() => navigate('/subscription')} className="btn-secondary text-sm">
            Manage Subscription
          </button>
        </div>
      </div>
    </div>
  )
}