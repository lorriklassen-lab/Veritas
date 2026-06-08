import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../lib/AuthContext'
import { apiRequest } from '../lib/auth'

interface Source {
  id: string
  text: string
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: Source[]
  createdAt?: string
}

export default function Chat() {
  const { user, refresh } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [translation, setTranslation] = useState('NASB')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Load query history on mount
  useEffect(() => {
    apiRequest<any[]>('/user/queries').then(queries => {
      const history: Message[] = []
      for (const q of queries.reverse()) {
        history.push({ id: q.id + '-q', role: 'user', content: q.question })
        history.push({
          id: q.id + '-a',
          role: 'assistant',
          content: q.answer,
          sources: (q.sources_cited || []).map((s: string, i: number) => ({ id: String(i), text: s })),
          createdAt: q.created_at,
        })
      }
      if (history.length > 0) setMessages(history)
    }).catch(() => {})
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const question = input.trim()
    setInput('')
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: question }])
    setLoading(true)

    try {
      const data = await apiRequest<{ id: string; answer: string; sources_cited: string[]; created_at: string }>('/query', {
        method: 'POST',
        body: JSON.stringify({ question, translation_preference: translation }),
      })

      // Refresh user to update query count
      refresh()

      const sources: Source[] = (data.sources_cited || []).map((s, i) => ({ id: String(i), text: s }))
      setMessages(prev => [...prev, {
        id: data.id,
        role: 'assistant',
        content: data.answer,
        sources,
        createdAt: data.created_at,
      }])
    } catch (err: any) {
      const msg = err.message || 'Something went wrong. Please try again.'
      if (msg.includes('402') || msg.includes('limit')) {
        setMessages(prev => [...prev, {
          id: 'err-' + Date.now(),
          role: 'assistant' as const,
          content: `**Query limit reached.** You've used all your queries for this period. Please upgrade your plan to continue studying.`,
        }])
      } else {
        setMessages(prev => [...prev, {
          id: 'err-' + Date.now(),
          role: 'assistant' as const,
          content: `**Error:** ${msg}`,
        }])
      }
    } finally {
      setLoading(false)
    }
  }

  const renderAnswer = (content: string) => {
    // Simple markdown-like rendering for the answer
    const parts = content.split(/(\*\*[^*]+\*\*)/g)
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-brand-black">{part.slice(2, -2)}</strong>
      }
      return <span key={i}>{part}</span>
    })
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Translation Selector */}
        <div className="bg-white border-b border-brand-border px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm text-brand-muted font-sans">Default translation:</span>
            <select
              value={translation}
              onChange={e => setTranslation(e.target.value)}
              className="text-sm border border-brand-border rounded-md px-3 py-1.5 bg-white font-sans focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
            >
              <option value="NASB">NASB (New American Standard)</option>
              <option value="ESV">ESV (English Standard)</option>
              <option value="CSB">CSB (Christian Standard)</option>
              <option value="NIV">NIV (New International)</option>
            </select>
          </div>
          <div className="text-sm font-sans text-brand-muted">
            {user?.queries_remaining !== undefined && user?.queries_limit !== undefined && (
              <span>
                <span className="font-medium text-brand-black">{user.queries_remaining}</span>
                {' '} / {user.queries_limit === 999999 ? '∞' : user.queries_limit} queries remaining
              </span>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-16 h-16 bg-brand-highlight rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h2 className="text-h3 text-brand-black mb-2">Ask a biblical question</h2>
              <p className="text-brand-muted max-w-md text-sm leading-relaxed font-sans mb-6">
                Ask about passage meaning, original language insights, historical background, or theological topics. Every answer includes citations from credible sources.
              </p>
              <div className="grid sm:grid-cols-2 gap-3 max-w-lg">
                {[
                  'What does "faith" mean in Hebrews 11:1?',
                  'What is the cultural background of the Good Samaritan?',
                  'How does the Bible describe the Trinity?',
                  'What does Romans 8:28 mean for believers?',
                ].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(suggestion)}
                    className="text-left text-sm p-3 bg-white hover:bg-brand-highlight border border-brand-border rounded-lg text-brand-clay transition-colors font-sans"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'user' ? (
                <div className="chat-bubble-user">
                  <p className="text-sm font-sans">{msg.content}</p>
                </div>
              ) : (
                <div className="chat-bubble-veritas">
                  <div className="text-sm font-sans leading-relaxed whitespace-pre-wrap">
                    {renderAnswer(msg.content)}
                  </div>

                  {/* Sources */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-brand-border">
                      <div className="flex items-center gap-1.5 mb-2">
                        <div className="w-1.5 h-1.5 bg-brand-gold rounded-full" />
                        <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider font-sans">Sources</p>
                      </div>
                      <div className="space-y-1">
                        {msg.sources.map((source) => (
                          <p key={source.id} className="source-citation">{source.text}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-brand-parchment border border-brand-border rounded-[16px_16px_16px_4px] px-5 py-4">
                <div className="flex items-center gap-2">
                  <div className="loading-dot" />
                  <div className="loading-dot" />
                  <div className="loading-dot" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="chat-input-bar">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask a biblical research question..."
                className="w-full bg-brand-parchment border-2 border-brand-border rounded-xl px-5 py-4 pr-12
                         font-sans text-base text-brand-black placeholder:text-brand-muted
                         focus:outline-none focus:border-brand-gold focus:ring-0
                         shadow-sm transition-colors duration-150"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-12 h-12 bg-brand-gold hover:bg-brand-gold-dark disabled:bg-brand-border
                       text-white rounded-full flex items-center justify-center
                       transition-colors duration-150 disabled:cursor-not-allowed shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}