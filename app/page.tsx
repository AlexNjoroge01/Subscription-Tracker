'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  ArrowRight, BarChart3, Bell, TrendingDown,
  CheckCircle2, Menu, X, Shield, Zap
} from 'lucide-react'

const SERVICES = [
  'Netflix', 'Spotify', 'AWS', 'Adobe CC', 'GitHub',
  'Notion', 'Figma', 'Slack', 'Zoom', 'Dropbox',
  'Apple One', 'Disney+', 'YouTube Premium', 'LinkedIn',
]

const SUBS = [
  { name: 'Netflix', price: '$15.99', label: 'Due in 3 days', urgent: true },
  { name: 'Spotify', price: '$9.99', label: 'Active', urgent: false },
  { name: 'Adobe CC', price: '$59.99', label: 'Due in 12 days', urgent: false },
]

const FEATURES = [
  {
    icon: <Bell className="w-6 h-6 text-[#a3e635]" />,
    title: 'Never Miss a Renewal',
    desc: 'Personalized email alerts before every subscription renews. Set custom reminder windows — 1 day, 3 days, or a week ahead.',
    span: 'md:col-span-2',
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-[#a3e635]" />,
    title: 'Spending Analytics',
    desc: 'Visualize where your money goes with clear charts and category breakdowns.',
    span: '',
  },
  {
    icon: <TrendingDown className="w-6 h-6 text-[#a3e635]" />,
    title: 'Smart Optimization',
    desc: 'Detect duplicate services, flag annual billing switches, and surface subscriptions you haven\'t used recently.',
    span: 'md:col-span-2',
  },
  {
    icon: <Shield className="w-6 h-6 text-[#a3e635]" />,
    title: 'Secure by Default',
    desc: 'Bank-grade encryption keeps your data private.',
    span: '',
  },
]

export default function EntryPage() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#060c08] text-white overflow-x-hidden">

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[#a3e635]/[0.04] rounded-full blur-[140px]" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-[#a3e635]/[0.03] rounded-full blur-[100px]" />
      </div>

      {/* ── Navigation ── */}
      <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#060c08]/90 backdrop-blur-xl border-b border-white/[0.06]' : ''}`}>
        <div className="max-w-7xl mx-auto px-5 md:px-10 h-16 md:h-[72px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 bg-[#a3e635] rounded-[10px] flex items-center justify-center shadow-[0_0_16px_rgba(163,230,53,0.5)]">
              <svg className="w-[18px] h-[18px] text-[#060c08]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-[17px] font-semibold tracking-tight">SubTrack</span>
          </Link>

          <div className="hidden md:flex items-center gap-7">
            {['#features', '#pricing'].map((href, i) => (
              <a key={i} href={href} className="text-sm text-white/55 hover:text-white transition-colors">
                {href === '#features' ? 'Features' : 'Pricing'}
              </a>
            ))}
            <Link href="/login" className="text-sm text-white/55 hover:text-white transition-colors">Sign in</Link>
            <Link href="/register">
              <Button className="bg-[#a3e635] hover:bg-[#b5f542] text-[#060c08] font-bold rounded-xl h-9 px-5 text-[13px] lime-glow transition-all">
                Get started
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
            onClick={() => setMobileOpen(v => !v)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-[#0a1209] border-t border-white/[0.06] px-6 py-6 flex flex-col gap-5">
            <a href="#features" className="text-white/70 font-medium py-1" onClick={() => setMobileOpen(false)}>Features</a>
            <a href="#pricing" className="text-white/70 font-medium py-1" onClick={() => setMobileOpen(false)}>Pricing</a>
            <Link href="/login" className="text-white/70 font-medium py-1" onClick={() => setMobileOpen(false)}>Sign in</Link>
            <Link href="/register" onClick={() => setMobileOpen(false)}>
              <Button className="w-full bg-[#a3e635] hover:bg-[#b5f542] text-[#060c08] font-bold rounded-xl h-11 lime-glow">Get started</Button>
            </Link>
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-32 md:pt-44 pb-16 md:pb-28 px-5 md:px-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#a3e635]/25 bg-[#a3e635]/10 text-[#a3e635] text-[11px] font-semibold uppercase tracking-widest mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#a3e635] animate-pulse-dot" />
              Smart subscription management
            </div>

            <h1 className="text-[52px] md:text-[68px] lg:text-[72px] font-extrabold leading-[1.02] tracking-tight mb-6">
              Stop paying for{' '}
              <br className="hidden sm:block" />
              <em className="font-heading font-light italic not-italic text-[#a3e635] text-[60px] md:text-[80px] lg:text-[88px] leading-none">
                things you<br />don&apos;t use
              </em>
            </h1>

            <p className="text-white/55 text-[17px] leading-relaxed mb-10 max-w-md">
              Track every subscription, get renewal alerts before they hit, and find wasteful spending — all in one clean dashboard.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-[#a3e635] hover:bg-[#b5f542] text-[#060c08] font-bold rounded-xl px-8 h-14 text-[15px] group lime-glow transition-all">
                  Start for free
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <p className="text-sm text-white/35">No credit card required</p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-10 mt-14 pt-8 border-t border-white/[0.08]">
              {[
                { value: '28M+', label: 'Users worldwide' },
                { value: '$156', label: 'Avg. saved / year' },
                { value: '100+', label: 'Services tracked' },
              ].map((s, i) => (
                <div key={i}>
                  <div className="text-2xl font-bold text-white">{s.value}</div>
                  <div className="text-[11px] text-white/35 mt-0.5 font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — floating cards */}
          <div className="relative h-[520px] hidden lg:block select-none">
            {/* Main dashboard card */}
            <div className="absolute inset-x-4 top-6 bg-[#0d1b0f] border border-white/[0.08] rounded-3xl p-6 shadow-2xl animate-float-slow" style={{ '--float-rotate': '0deg' } as React.CSSProperties}>
              <div className="flex justify-between items-start mb-5">
                <div>
                  <p className="text-white/35 text-[11px] uppercase tracking-widest mb-1">Monthly Total</p>
                  <p className="text-[42px] font-extrabold text-white leading-none">
                    $127<span className="text-2xl text-white/45">.50</span>
                  </p>
                </div>
                <div className="w-11 h-11 bg-[#a3e635]/15 rounded-2xl flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-[#a3e635]" />
                </div>
              </div>

              {/* Mini bar chart */}
              <div className="flex items-end gap-1.5 h-14 mb-5">
                {[35, 55, 42, 70, 58, 85, 100].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-[3px] transition-all"
                    style={{
                      height: `${h}%`,
                      background: i === 6
                        ? '#a3e635'
                        : `rgba(163,230,53,${0.12 + i * 0.06})`,
                    }}
                  />
                ))}
              </div>

              <div className="space-y-2">
                {SUBS.map((sub, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/[0.05]">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${sub.urgent ? 'bg-red-500/20 text-red-400' : 'bg-[#a3e635]/15 text-[#a3e635]'}`}>
                        {sub.name[0]}
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-white">{sub.name}</p>
                        <p className={`text-[11px] ${sub.urgent ? 'text-red-400' : 'text-white/35'}`}>{sub.label}</p>
                      </div>
                    </div>
                    <p className="text-[13px] font-bold text-white">{sub.price}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Savings accent card */}
            <div className="absolute -right-2 top-2 w-44 bg-[#a3e635] rounded-2xl p-4 shadow-xl shadow-[#a3e635]/25 animate-float-medium" style={{ '--float-rotate': '4deg' } as React.CSSProperties}>
              <p className="text-[#060c08]/60 text-[11px] font-semibold uppercase tracking-wide mb-2">Potential savings</p>
              <p className="text-[#060c08] text-3xl font-extrabold leading-none">$156</p>
              <p className="text-[#060c08]/55 text-[11px] mt-1 font-medium">per year</p>
            </div>

            {/* Alert card */}
            <div className="absolute -left-2 bottom-10 w-48 bg-[#0d1b0f] border border-white/[0.08] rounded-2xl p-4 shadow-xl animate-float-medium" style={{ animationDelay: '1s', '--float-rotate': '-3deg' } as React.CSSProperties}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-lg bg-[#a3e635]/15 flex items-center justify-center">
                  <Bell className="w-3.5 h-3.5 text-[#a3e635]" />
                </div>
                <p className="text-white text-[12px] font-semibold">Renewal Alert</p>
              </div>
              <p className="text-white/45 text-[11px] leading-relaxed">Netflix renews in <span className="text-red-400 font-semibold">3 days</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Marquee ── */}
      <div className="border-y border-white/[0.05] py-4 overflow-hidden">
        <div className="flex gap-14 animate-marquee whitespace-nowrap">
          {[...SERVICES, ...SERVICES].map((s, i) => (
            <span key={i} className="text-white/25 text-[13px] font-medium tracking-wide">{s}</span>
          ))}
        </div>
      </div>

      {/* ── Features Bento ── */}
      <section id="features" className="py-24 md:py-36 px-5 md:px-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#a3e635] text-[11px] font-bold uppercase tracking-[0.2em] mb-5">Features</p>
          <h2 className="text-4xl md:text-[54px] font-extrabold leading-[1.08] tracking-tight">
            Everything you need to{' '}
            <em className="font-heading font-light italic not-italic text-[#a3e635]">stay in control</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className={`${f.span} bg-[#0d1b0f] border border-white/[0.07] rounded-3xl p-8 bento-card card-hover transition-all duration-300 group`}
            >
              <div className="w-12 h-12 bg-[#a3e635]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#a3e635]/20 transition-colors">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-white/45 leading-relaxed text-[15px]">{f.desc}</p>
            </div>
          ))}

          {/* Stat card */}
          <div className="bg-[#a3e635] rounded-3xl p-8">
            <Zap className="w-7 h-7 text-[#060c08] mb-5" />
            <p className="text-[#060c08]/60 text-sm font-semibold mb-2">Users save on average</p>
            <p className="text-[#060c08] text-5xl font-extrabold leading-none mb-1">$156</p>
            <p className="text-[#060c08]/50 text-sm font-medium">per year</p>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-24 md:py-36 px-5 md:px-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#a3e635] text-[11px] font-bold uppercase tracking-[0.2em] mb-5">Pricing</p>
          <h2 className="text-4xl md:text-[54px] font-extrabold leading-[1.08] tracking-tight">
            Simple,{' '}
            <em className="font-heading font-light italic not-italic text-[#a3e635]">transparent</em>
            {' '}pricing
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Free */}
          <div className="bg-[#0d1b0f] border border-white/[0.07] rounded-3xl p-8 card-hover transition-all">
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-1">Free</h3>
              <p className="text-white/40 text-[13px]">For personal use</p>
            </div>
            <div className="text-[42px] font-extrabold leading-none mb-8">
              $9<span className="text-lg text-white/35 font-normal">/mo</span>
            </div>
            <Link href="/register">
              <Button variant="outline" className="w-full rounded-xl h-11 border-white/15 hover:border-[#a3e635]/50 hover:bg-[#a3e635]/5 hover:text-[#a3e635] transition-all">
                Get started
              </Button>
            </Link>
            <ul className="mt-8 space-y-3.5">
              {['Up to 10 subscriptions', 'Email reminders', 'Basic analytics'].map((feat, i) => (
                <li key={i} className="flex items-center gap-3 text-[13px] text-white/55">
                  <CheckCircle2 className="w-4 h-4 text-[#a3e635] shrink-0" />
                  {feat}
                </li>
              ))}
            </ul>
          </div>

          {/* Pro — featured */}
          <div className="bg-[#a3e635] rounded-3xl p-8 relative shadow-xl shadow-[#a3e635]/15">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#060c08] text-[#a3e635] text-[11px] font-bold rounded-full tracking-wide">
              Most Popular
            </div>
            <div className="mb-8">
              <h3 className="text-xl font-bold text-[#060c08] mb-1">Pro</h3>
              <p className="text-[#060c08]/55 text-[13px]">For power users</p>
            </div>
            <div className="text-[42px] font-extrabold leading-none text-[#060c08] mb-8">
              $19<span className="text-lg text-[#060c08]/50 font-normal">/mo</span>
            </div>
            <Link href="/register">
              <button className="w-full h-11 bg-[#060c08] text-white font-bold rounded-xl hover:bg-[#0d1b0f] transition-colors text-[14px]">
                Get started
              </button>
            </Link>
            <ul className="mt-8 space-y-3.5">
              {['Unlimited subscriptions', 'Smart insights', 'Priority support'].map((feat, i) => (
                <li key={i} className="flex items-center gap-3 text-[13px] text-[#060c08]/70">
                  <CheckCircle2 className="w-4 h-4 text-[#060c08] shrink-0" />
                  {feat}
                </li>
              ))}
            </ul>
          </div>

          {/* Enterprise */}
          <div className="bg-[#0d1b0f] border border-white/[0.07] rounded-3xl p-8 card-hover transition-all">
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-1">Enterprise</h3>
              <p className="text-white/40 text-[13px]">For teams</p>
            </div>
            <div className="text-[42px] font-extrabold leading-none mb-8">
              $39<span className="text-lg text-white/35 font-normal">/mo</span>
            </div>
            <Button variant="outline" className="w-full rounded-xl h-11 border-white/15 hover:border-[#a3e635]/50 hover:bg-[#a3e635]/5 hover:text-[#a3e635] transition-all">
              Contact sales
            </Button>
            <ul className="mt-8 space-y-3.5">
              {['Everything in Pro', 'Team accounts', 'API access'].map((feat, i) => (
                <li key={i} className="flex items-center gap-3 text-[13px] text-white/55">
                  <CheckCircle2 className="w-4 h-4 text-[#a3e635] shrink-0" />
                  {feat}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 md:py-36 px-5 md:px-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-[64px] font-extrabold leading-[1.04] tracking-tight mb-6">
            Ready to{' '}
            <em className="font-heading font-light italic not-italic text-[#a3e635] text-[50px] md:text-[80px]">
              take control?
            </em>
          </h2>
          <p className="text-white/45 text-[17px] mb-10 max-w-md mx-auto leading-relaxed">
            Join thousands of users saving money on their subscriptions every month.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-[#a3e635] hover:bg-[#b5f542] text-[#060c08] font-bold rounded-xl px-10 h-14 text-[15px] group lime-glow transition-all">
              Get started for free
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.05] py-10 px-5 md:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-[#a3e635] rounded-[8px] flex items-center justify-center">
              <svg className="w-[15px] h-[15px] text-[#060c08]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-semibold text-[15px]">SubTrack</span>
          </Link>
          <p className="text-white/25 text-[13px]">© 2024 SubTrack. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
