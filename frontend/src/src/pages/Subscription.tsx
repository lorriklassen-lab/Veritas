import { useState } from 'react'
import { useAuth } from '../lib/AuthContext'
import { apiRequest } from '../lib/auth'

const PLANS = {
  individual: {
    name: 'Individual',
    price: '$19/mo',
    tagline: 'For serious students who want to go deeper',
    features: [
      '50 queries per month',
      'Full access to Veritas source library',
      'Original language insights',
      'Cross-references and historical context',
      'Email support',
    ],
  },
  pastor: {
    name: 'Pastor/Teacher',
    price: '$49/mo',
    tagline: 'For those who teach and preach regularly',
    features: [
      'Unlimited queries',
      'Priority source access (commentaries, critical editions)',
      'Sermon outline assistance',
      'Advanced original language tools',
      'Priority email support',
    ],
  },
  church: {
    name: 'Church Plan',
    price: '$149/mo',
    tagline: 'For teams who study and teach together',
    features: [
      'Everything in Pastor/Teacher, plus:',
      'Up to 5 team accounts',
      'Shared workspace for sermon prep',
      'Admin dashboard and usage tracking',
      'Dedicated support',
    ],
  },
} as const

type Tier = keyof typeof PLANS

export default function Subscription() {
  const { user, refresh } = useAuth()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubscribe = async (tier: Tier) => {
    setLoading(tier)
    setError('')
    setSuccess('')
    try {
      await apiRequest('/subscription/create', {
        method: 'POST',
        body: JSON.stringify({ tier }),
      })
      await refresh()
      setSuccess(`Successfully upgraded to ${PLANS[tier].name}!`)
    } catch (err: any) {
      setError(err.message || 'Subscription failed')
    } finally {
      setLoading(null)
    }
  }

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will revert to the free tier.')) return
    setLoading('cancel')
    setError('')
    setSuccess('')
    try {
      await apiRequest('/subscription/cancel', { method: 'POST' })
      await refresh()
      setSuccess('Subscription canceled. You are now on the free tier.')
    } catch (err: any) {
      setError(err.message || 'Cancellation failed')
    } finally {
      setLoading(null)
    }
  }

  const currentTier = user?.subscription_tier || 'free'

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-h2 text-brand-black mb-2">Subscription</h1>
      <p className="text-brand-muted font-sans mb-8">Choose the plan that fits your study needs.</p>

      {error && (
        <div className="bg-brand-red/5 border border-brand-red/20 text-brand-red px-4 py-3 rounded-lg text-sm font-sans mb-6">{error}</div>
      )}
      {success && (
        <div className="bg-brand-green/5 border border-brand-green/20 text-brand-green px-4 py-3 rounded-lg text-sm font-sans mb-6">{success}</div>
      )}

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {(Object.entries(PLANS) as [Tier, typeof PLANS[Tier]][]).map(([tier, plan]) => {
          const isCurrent = currentTier === tier
          const isLoading = loading === tier
          return (
            <div key={tier} className={`${isCurrent ? 'card-featured' : 'card'} p-6 flex flex-col`}>
              {isCurrent && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-gold text-white text-xs font-semibold px-4 py-1 rounded-full">
                  Current Plan
                </span>
              )}
              <div className="mb-1">
                <h3 className="font-serif text-xl font-bold text-brand-black">{plan.name}</h3>
                <p className="text-brand-muted text-sm mt-1 font-sans">{plan.tagline}</p>
              </div>
              <div className="my-4">
                <span className="text-3xl font-bold text-brand-black">{plan.price}</span>
              </div>
              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((f, i) => (
                  <li key={i} className="text-sm text-brand-clay flex items-start gap-2.5 font-sans">
                    <svg className="w-4 h-4 text-brand-gold mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              {isCurrent ? (
                <span className="w-full text-center py-3 rounded-lg bg-brand-highlight text-brand-gold font-semibold text-sm">
                  Active
                </span>
              ) : (
                <button
                  onClick={() => handleSubscribe(tier)}
                  disabled={isLoading}
                  className="w-full py-3 rounded-lg bg-brand-gold hover:bg-brand-gold-dark text-white font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Processing...' : 'Upgrade'}
                </button>
              )}
            </div>
          )
        })}
      </div>

      {currentTier !== 'free' && (
        <div className="card p-6">
          <h3 className="text-h4 text-brand-black mb-2">Cancel Subscription</h3>
          <p className="text-sm text-brand-muted mb-4 font-sans">
            You are currently on the <strong className="capitalize text-brand-black">{currentTier}</strong> plan.
            Canceling will revert you to the free tier with 5 queries per month.
          </p>
          <button
            onClick={handleCancel}
            disabled={loading === 'cancel'}
            className="px-6 py-2.5 rounded-lg border border-brand-red/30 text-brand-red hover:bg-brand-red/5 font-medium text-sm transition-colors disabled:opacity-50 font-sans"
          >
            {loading === 'cancel' ? 'Processing...' : 'Cancel Subscription'}
          </button>
        </div>
      )}
    </div>
  )
}