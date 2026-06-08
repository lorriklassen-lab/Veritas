import { Link } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

const plans = [
  {
    tier: 'individual',
    name: 'Individual',
    price: '$19',
    period: '/month',
    tagline: 'For serious students who want to go deeper',
    features: [
      '50 queries per month',
      'Full access to Veritas source library',
      'Original language insights',
      'Cross-references and historical context',
      'Email support',
    ],
    cta: 'Start your free trial',
    highlighted: false,
  },
  {
    tier: 'pastor',
    name: 'Pastor/Teacher',
    price: '$49',
    period: '/month',
    tagline: 'For those who teach and preach regularly',
    features: [
      'Unlimited queries',
      'Priority source access (commentaries, critical editions)',
      'Sermon outline assistance',
      'Advanced original language tools',
      'Priority email support',
    ],
    cta: 'Start your free trial',
    highlighted: true,
  },
  {
    tier: 'church',
    name: 'Church Plan',
    price: '$149',
    period: '/month',
    tagline: 'For teams who study and teach together',
    features: [
      'Everything in Pastor/Teacher, plus:',
      'Up to 5 team accounts',
      'Shared workspace for sermon prep',
      'Admin dashboard and usage tracking',
      'Dedicated support',
    ],
    cta: 'Contact sales',
    highlighted: false,
  },
]

const features = [
  {
    headline: 'Answers grounded in the best sources',
    body: 'Every Veritas answer draws from a curated library of respected biblical scholarship — original language lexicons, critical commentaries, historical background works, and systematic theologies. No speculative theology, no prosperity-gospel fluff.',
    detail: 'When Veritas tells you what a Greek word means, it cites the lexical source. When it presents an interpretation, it tells you which scholars hold it. You\'re not taking our word for it — you\'re tracing the chain back to the source.',
  },
  {
    headline: 'Go deeper into the original text',
    body: 'Whether you\'re fluent in Greek and Hebrew or just getting started, Veritas brings original language analysis into your study. Lexical ranges, grammatical nuances, textual variants — presented clearly, with the technical detail you want and the plain English you need.',
    detail: 'Ask "What does <em>logos</em> really mean in John 1?" and get the full semantic range, how it\'s used in the Septuagint, and how the church fathers understood it. All sourced. All clear.',
  },
  {
    headline: 'See the passage in its world',
    body: 'Scripture was written in a specific time, place, and culture. Veritas surfaces historical background, literary context, and canonical connections — so you understand not just what the text says, but why it said it that way to that audience.',
    detail: 'From first-century Jewish customs to Greco-Roman rhetoric, from covenant context to redemptive-historical arc — Veritas connects the dots without oversimplifying.',
  },
  {
    headline: 'Handle tough passages with integrity',
    body: 'Controversial passages don\'t get one-sided answers. Veritas presents the range of credible interpretations, identifies the weight of evidence, and clearly distinguishes between what the text says, what scholars debate, and what traditions have concluded.',
    detail: 'Whether it\'s a difficult Old Testament text, a disputed Pauline passage, or a pastoral question about application, you get the full picture — fairly, honestly, sourced.',
  },
]

const faq = [
  {
    q: 'How is Veritas different from ChatGPT or other AI tools?',
    a: 'Veritas is purpose-built for biblical research. Every answer is curated against a source library of credible biblical scholarship. We don\'t generate speculative theology — we cite what scholars actually say, and we tell you when there\'s debate.',
  },
  {
    q: 'Can I trust the sources Veritas uses?',
    a: 'Yes. Veritas sources are curated by a team with theological training. We prioritize peer-reviewed scholarship, standard reference works, and respected commentaries from across the theological spectrum. Every source is cited so you can verify.',
  },
  {
    q: 'Is Veritas aligned with a specific denomination?',
    a: 'Veritas is designed to serve Christians across traditions. We present multiple scholarly perspectives fairly, with the weight of evidence clearly identified. The tools serve your study — they don\'t push an agenda.',
  },
  {
    q: 'Do I need to know Greek and Hebrew?',
    a: 'Not at all. Original language insights are presented clearly, with plain English explanations. If you do know the languages, you\'ll find the depth you want. If you don\'t, you\'ll learn as you go.',
  },
]

export default function Landing() {
  const { user } = useAuth()

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-brand-indigo text-white">
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="font-serif text-4xl md:text-6xl font-bold leading-tight text-balance mb-6">
              Study the Word with clarity and confidence.
            </h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-10 max-w-2xl">
              Veritas is an AI biblical research assistant that gives you clear, sourced answers 
              rooted in scripture and credible scholarship. No fluff. No speculation. Just what 
              you need to teach and study truthfully.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to={user ? '/chat' : '/signup'}
                className="btn-cta"
              >
                {user ? 'Go to Dashboard' : 'Start your free trial'}
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center px-8 py-4 border-2 border-white/30 hover:border-white/50 text-white font-sans font-medium rounded-xl transition-colors"
              >
                See how it works
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Point Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-h2 mb-4">You have questions. Finding trustworthy answers takes too long.</h2>
          <p className="text-brand-clay text-lg leading-relaxed">
            You're preparing a sermon, leading a study, or wrestling with a difficult passage. 
            The internet is full of opinions. Commentaries are deep but time-consuming. And you 
            don't want to preach something that isn't sound.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            'Quick access to original language insights',
            'Historical and cultural context you can trust',
            'Multiple scholarly perspectives, fairly presented',
            'Answers that cite their sources — so you can verify',
          ].map((need, i) => (
            <div key={i} className="card-interactive p-6 text-center">
              <div className="w-10 h-10 bg-brand-highlight rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-brand-gold font-bold">{i + 1}</span>
              </div>
              <p className="text-sm text-brand-clay">{need}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Sections */}
      {features.map((feature, i) => (
        <section key={i} className={`py-16 ${i % 2 === 0 ? 'bg-white' : ''}`}>
          <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div className={i % 2 === 1 ? 'md:order-2' : ''}>
              <span className="text-brand-gold text-sm font-semibold uppercase tracking-wider font-sans">
                {['Scholarship', 'Languages', 'Context', 'Integrity'][i]}
              </span>
              <h2 className="text-h2 mt-2 mb-4">{feature.headline}</h2>
              <p className="text-brand-clay text-lg leading-relaxed mb-4">{feature.body}</p>
              <p className="text-sm text-brand-muted leading-relaxed" dangerouslySetInnerHTML={{ __html: feature.detail }} />
            </div>
            <div className={`${i % 2 === 1 ? 'md:order-1' : ''}`}>
              <div className="card p-8 md:p-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 bg-brand-gold rounded-full" />
                  <span className="text-xs font-mono text-brand-muted">Sample Answer</span>
                </div>
                {i === 0 && (
                  <div className="space-y-3 text-sm">
                    <p className="text-brand-black font-medium">The Greek word for "love" in John 3:16 is <em className="font-serif">agapē</em> (ἀγάπη), which BDAG defines as "the quality of warm regard for and interest in another" <span className="source-citation">(BDAG, s.v. "ἀγάπη," def. 1a)</span>.</p>
                    <p className="text-brand-clay">This term is distinct from <em className="font-serif">phileō</em> (φιλέω, brotherly love) and <em className="font-serif">erōs</em> (ἔρως, romantic love). In the Gospel of John, <em className="font-serif">agapē</em> consistently denotes self-giving, covenantal love modeled by the Father and the Son <span className="source-citation">(Carson, <em>John</em> [PNTC], 204)</span>.</p>
                  </div>
                )}
                {i === 1 && (
                  <div className="space-y-3 text-sm">
                    <p className="text-brand-black font-medium">The term <em className="font-serif">logos</em> (λόγος) in John 1:1 carries a rich semantic range: "word, speech, message, account, reason, or principle" <span className="source-citation">(BDAG, s.v. "λόγος," def. 1b)</span>.</p>
                    <p className="text-brand-clay">John's use deliberately echoes the Genesis creation account ("God said...") and the Hebrew concept of <em className="font-serif">dabar</em> (דָּבָר) — God's powerful, creative word. Philo of Alexandria similarly used <em className="font-serif">Logos</em> as a mediating principle between God and creation <span className="source-citation">(Keener, <em>IVP Background: NT</em>, 240)</span>.</p>
                  </div>
                )}
                {i === 2 && (
                  <div className="space-y-3 text-sm">
                    <p className="text-brand-black font-medium">The Parable of the Good Samaritan (Luke 10:25–37) would have shocked Jesus' original audience.</p>
                    <p className="text-brand-clay">Samaritans and Jews in the first century had deep ethnic and religious hostility. By making a Samaritan — not a priest or Levite — the hero of the story, Jesus redefines "neighbor" beyond ethnic and religious boundaries <span className="source-citation">(Keener, <em>IVP Background: NT</em>, 210–211)</span>.</p>
                  </div>
                )}
                {i === 3 && (
                  <div className="space-y-3 text-sm">
                    <p className="text-brand-black font-medium">Most commentators understand Romans 7:14–25 as describing the struggle of a believer under the law, not an unbeliever <span className="source-citation">(Moo, <em>Romans</em> [NICNT], 445–450)</span>.</p>
                    <p className="text-brand-clay">However, some scholars argue Paul is describing his pre-conversion experience under conviction of the law <span className="source-citation">(Dunn, <em>Romans</em> [WBC], 387–389)</span>. The key issue is whether the "wretched man" of v. 24 is in Christ or outside Christ — and the broader context of Romans 8 (life in the Spirit) suggests the former.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-brand-parchment">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-h2 text-center mb-12">Study smarter, not harder</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Ask your question', desc: 'Type any biblical question in plain English. From "What does hesed mean?" to "How should I preach the Parable of the Prodigal Son?"' },
              { step: '2', title: 'Get a clear, structured answer', desc: 'Veritas returns a sourced answer with biblical context, original language insights, scholarly perspectives, and practical significance.' },
              { step: '3', title: 'Go deeper', desc: 'Follow the citations, explore cross-references, ask follow-ups. Your study builds naturally, passage by passage.' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-brand-gold text-white rounded-full flex items-center justify-center mx-auto mb-4 font-serif text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-h4 mb-2">{item.title}</h3>
                <p className="text-sm text-brand-clay leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-white" id="pricing">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-h2 mb-3">Choose the plan that fits your study</h2>
            <p className="text-brand-clay">All plans include a 14-day free trial. No credit card required to start.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div key={plan.tier} className={`${plan.highlighted ? 'card-featured' : 'card'} p-6 flex flex-col`}>
                {plan.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-gold text-white text-xs font-semibold px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
                <div className="mb-1">
                  <h3 className="font-serif text-xl font-bold">{plan.name}</h3>
                  <p className="text-brand-muted text-sm mt-1">{plan.tagline}</p>
                </div>
                <div className="my-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-brand-muted">{plan.period}</span>
                </div>
                <ul className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="text-sm text-brand-clay flex items-start gap-2.5">
                      <svg className="w-4 h-4 text-brand-gold mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to={user ? '/subscription' : '/signup'}
                  className={`w-full text-center py-3 rounded-lg font-semibold text-base transition-colors ${
                    plan.highlighted
                      ? 'bg-brand-gold hover:bg-brand-gold-dark text-white'
                      : 'border-2 border-brand-gold text-brand-gold hover:bg-brand-highlight'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-brand-parchment">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-h2 text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faq.map((item, i) => (
              <details key={i} className="card p-5 group">
                <summary className="font-semibold text-brand-black cursor-pointer list-none flex items-center justify-between">
                  {item.q}
                  <svg className="w-5 h-5 text-brand-gold group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-3 text-sm text-brand-clay leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-brand-indigo text-white text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-h2 mb-4">Ready to study the Word with clarity?</h2>
          <p className="text-white/70 mb-8">Start your free trial. No credit card required.</p>
          <Link to={user ? '/chat' : '/signup'} className="btn-cta">
            {user ? 'Go to Dashboard' : 'Start your free trial'}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-black text-brand-muted py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="font-serif text-lg text-white mb-1">Veritas</p>
              <p className="text-xs">Truth from the Word — rooted, sourced, clear</p>
            </div>
            <div className="flex gap-6 text-xs">
              <span>Features</span>
              <span>Pricing</span>
              <span>About</span>
              <span>Privacy</span>
              <span>Terms</span>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-xs">
            &copy; 2024 Veritas. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}