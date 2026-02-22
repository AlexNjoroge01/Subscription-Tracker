'use client'

import React, { useState } from 'react';
import {
  ArrowRight, BarChart3, Bell, ShieldCheck, Zap,
  Search, TrendingDown, CheckCircle2, AlertCircle,
  Menu, X
} from 'lucide-react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";

const EntryPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white text-slate-900">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-100/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* Header */}
      <nav className="relative flex justify-between items-center px-6 md:px-12 py-6 max-w-7xl mx-auto z-50">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-xl font-semibold tracking-tight text-slate-900">SubTrack</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Features</a>
          <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Pricing</a>
          <Link href="/login">
            <Button variant="ghost" className="text-sm font-medium">
              Sign in
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-6">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-xl p-6 flex flex-col gap-4 md:hidden rounded-b-3xl">
            <a href="#features" className="text-left py-2 text-slate-600 font-medium hover:text-emerald-600 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Features</a>
            <a href="#pricing" className="text-left py-2 text-slate-600 font-medium hover:text-emerald-600 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Pricing</a>
            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full rounded-xl">Sign in</Button>
            </Link>
            <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
              <Button className="w-full bg-slate-900 hover:bg-slate-800 rounded-xl">Get Started</Button>
            </Link>
          </div>
        )}
      </nav>

      <main className="relative max-w-7xl mx-auto px-6 md:px-12">
        {/* Hero Section */}
        <section className="pt-16 md:pt-24 pb-20 md:pb-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium mx-auto lg:mx-0">
                <Zap className="w-4 h-4" />
                <span>Track every subscription in one place</span>
              </div>

              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold text-slate-900 leading-tight">
                Stop losing money to forgotten subscriptions
              </h1>

              <p className="text-lg text-slate-600 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Track all your recurring payments, get timely reminders, and save money by identifying unused services.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link href="/register">
                  <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-8 h-12 group">
                    Start Free Trial
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <span className="text-sm text-slate-500">No credit card required</span>
              </div>
            </div>

            {/* Hero Card */}
            <div className="relative">
              <div className="bg-white border border-slate-200 rounded-3xl shadow-xl p-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Monthly Spending</p>
                    <p className="text-3xl font-semibold text-slate-900">$127.50</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { name: 'Netflix', price: '$15.99', status: 'Due in 3 days', alert: true },
                    { name: 'Spotify', price: '$9.99', status: 'Active' },
                    { name: 'iCloud+', price: '$2.99', status: 'Active' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center font-semibold text-slate-600">
                          {item.name[0]}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{item.name}</p>
                          <p className={`text-xs ${item.alert ? 'text-amber-600' : 'text-slate-400'}`}>
                            {item.status}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold text-slate-900">{item.price}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 md:py-32">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-semibold text-slate-900 mb-4">
              Everything you need to manage subscriptions
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Simple tools to track, analyze, and optimize your recurring expenses.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Search className="w-6 h-6" />,
                title: "Track Everything",
                desc: "Add all your subscriptions in one place. Support for 100+ popular services with auto-logo detection."
              },
              {
                icon: <Bell className="w-6 h-6" />,
                title: "Smart Reminders",
                desc: "Get notified before your subscriptions renew. Never miss a payment or get caught off guard."
              },
              {
                icon: <TrendingDown className="w-6 h-6" />,
                title: "Save Money",
                desc: "Identify unused subscriptions and find opportunities to save by switching to annual plans."
              },
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Intelligence Section */}
        <section className="py-20 md:py-32 bg-slate-900 rounded-3xl px-8 md:px-16 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
          
          <div className="relative grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="font-heading text-3xl md:text-4xl font-semibold leading-tight">
                Eliminate wasteful spending
              </h2>
              <div className="space-y-6">
                {[
                  { title: "Duplicate Detection", desc: "Find overlapping services you're paying for twice." },
                  { title: "Usage Insights", desc: "See which subscriptions you actually use." },
                  { title: "Annual Savings", desc: "Calculate savings by switching to annual billing." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                      <p className="text-slate-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6 text-amber-400 bg-amber-400/10 w-fit px-4 py-2 rounded-full">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Potential Savings: $156/year</span>
              </div>
              <div className="space-y-3">
                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700 flex justify-between items-center">
                  <span className="text-sm">3 streaming services detected</span>
                  <span className="text-xs text-emerald-400 font-medium">Review</span>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700 flex justify-between items-center">
                  <span className="text-sm">Switch to annual billing</span>
                  <span className="text-xs text-emerald-400 font-medium">Save $48/yr</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 md:py-32">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-semibold text-slate-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-slate-600">Start free, upgrade when you need more.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="p-8 rounded-2xl border border-slate-200 bg-white">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Free</h3>
              <p className="text-slate-500 text-sm mb-6">For personal use</p>
              <div className="text-4xl font-semibold text-slate-900 mb-6">
                $0<span className="text-lg text-slate-400 font-normal">/mo</span>
              </div>
              <Link href="/register">
                <Button variant="outline" className="w-full rounded-xl">Get Started</Button>
              </Link>
              <ul className="mt-8 space-y-3 text-sm text-slate-600">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Up to 10 subscriptions</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Email reminders</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Basic analytics</li>
              </ul>
            </div>

            {/* Pro Plan */}
            <div className="p-8 rounded-2xl border-2 border-emerald-500 bg-emerald-50/50 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-emerald-500 text-white text-xs font-medium rounded-full">
                Popular
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Pro</h3>
              <p className="text-slate-500 text-sm mb-6">For power users</p>
              <div className="text-4xl font-semibold text-slate-900 mb-6">
                $9<span className="text-lg text-slate-400 font-normal">/mo</span>
              </div>
              <Link href="/register">
                <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl">Get Started</Button>
              </Link>
              <ul className="mt-8 space-y-3 text-sm text-slate-600">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Unlimited subscriptions</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Smart insights</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Priority support</li>
              </ul>
            </div>

            {/* Enterprise Plan */}
            <div className="p-8 rounded-2xl border border-slate-200 bg-white">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Enterprise</h3>
              <p className="text-slate-500 text-sm mb-6">For teams</p>
              <div className="text-4xl font-semibold text-slate-900 mb-6">
                $29<span className="text-lg text-slate-400 font-normal">/mo</span>
              </div>
              <Button variant="outline" className="w-full rounded-xl">Contact Sales</Button>
              <ul className="mt-8 space-y-3 text-sm text-slate-600">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Everything in Pro</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Team accounts</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> API access</li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-32 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-heading text-3xl md:text-4xl font-semibold text-slate-900 mb-4">
              Ready to take control?
            </h2>
            <p className="text-slate-600 mb-8">
              Join thousands of users saving money on their subscriptions.
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-8 group">
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-semibold text-slate-900">SubTrack</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <span>© 2024 SubTrack. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EntryPage;
