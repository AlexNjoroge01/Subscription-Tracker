'use client'

import React, { useState } from 'react';
import {
  ArrowRight, BarChart3, Bell, ShieldCheck, Zap,
  Search, MousePointerClick, TrendingDown, Layers,
  CheckCircle2, AlertCircle, Sparkles, XCircle, DollarSign, CreditCard, Banknote, UserCheck, Star, Award,
  Menu, X
} from 'lucide-react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";

const EntryPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 selection:bg-emerald-100 font-poppins">
      {/* 1. Header & Hero */}
      <nav className="relative flex justify-between items-center px-6 md:px-8 py-8 max-w-7xl mx-auto z-50">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
          <div className="w-12 md:w-16 h-7 md:h-8 bg-emerald-600 rounded-xl flex items-center justify-center text-white italic shadow-lg shadow-emerald-500/20 text-sm md:text-base">MSM</div>
          <span className="hidden sm:inline">MySubMonitor.com</span>
          <span className="sm:hidden">MSM</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-500">
          <button className="hover:text-emerald-600 transition-colors">How it works</button>
          <button className="hover:text-emerald-600 transition-colors">Pricing</button>
          <button className="hover:text-emerald-600 transition-colors">Testimonials</button>
          <Link href="/login">
            <Button className="rounded-full px-6 shadow-md">
              Sign In
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

        {/* Mobile Navigation Overlay */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-xl p-6 flex flex-col gap-4 md:hidden animate-in slide-in-from-top duration-200 rounded-b-3xl">
            <button className="text-left py-2 text-slate-600 font-medium hover:text-emerald-600 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>How it works</button>
            <button className="text-left py-2 text-slate-600 font-medium hover:text-emerald-600 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Pricing</button>
            <button className="text-left py-2 text-slate-600 font-medium hover:text-emerald-600 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Testimonials</button>
            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
              <Button className="w-full py-6 rounded-2xl font-bold">
                Sign In
              </Button>
            </Link>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-6">
        {/* HERO SECTION */}
        <section className="pt-16 md:pt-24 pb-20 md:pb-32 grid lg:grid-cols-2 gap-16 md:gap-20 items-center border-b border-slate-100">
          <div className="space-y-8 md:space-y-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] md:text-xs font-bold uppercase tracking-wider mx-auto lg:mx-0">
              <Zap className="w-3.5 h-3.5 fill-emerald-700" />
              Engineered for Wealth Retention
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.15] md:leading-[1.1]">
              Master your <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                capital flow.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-500 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
              Stop the silent bleed of forgotten subscriptions. One dashboard to audit,
              optimize, and command your digital overhead.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button size="lg" className="w-full group h-16 px-10 rounded-[2rem] gap-3 text-lg shadow-xl shadow-emerald-600/20">
                  Secure Your Dashboard
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <div className="text-xs md:text-sm font-semibold text-slate-400 text-center sm:text-left">
                100% Secure <br /> Data Encryption
              </div>
            </div>
          </div>

          <div className="relative mt-12 lg:mt-0">
            <div className="absolute -top-10 md:-top-20 -right-10 md:-right-20 w-48 md:w-64 h-48 md:h-64 bg-emerald-200/40 rounded-full blur-[60px] md:blur-[80px]" />
            <div className="relative bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl p-8 md:p-10 backdrop-blur-xl">
              <div className="flex justify-between items-center mb-8 md:mb-10">
                <div>
                  <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1">Monthly Burn</p>
                  <p className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">KES 42,450.00</p>
                </div>
                <div className="h-12 md:h-14 w-12 md:w-14 bg-emerald-100 rounded-2xl flex items-center justify-center">
                  <BarChart3 className="text-emerald-600 w-6 md:w-7 h-6 md:h-7" />
                </div>
              </div>

              <div className="space-y-4 md:space-y-5">
                {[
                  { name: 'Netflix Premium', price: 'KES 1,100', status: 'Due in 2 days', color: 'bg-red-50 text-red-600', alert: true },
                  { name: 'ChatGPT Plus', price: 'KES 2,600', status: 'Active', color: 'bg-emerald-50 text-emerald-600' },
                  { name: 'iCloud+', price: 'KES 1,200', status: 'Active', color: 'bg-blue-50 text-blue-600' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 md:p-5 rounded-2xl bg-slate-50/50 border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4 md:gap-5">
                      <div className={`w-10 md:w-12 h-10 md:h-12 rounded-xl md:rounded-2xl ${item.color} flex items-center justify-center font-bold text-sm md:text-lg group-hover:scale-105 transition-transform`}>{item.name[0]}</div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm md:text-base">{item.name}</p>
                        <p className={`text-[10px] md:text-xs font-semibold ${item.alert ? 'text-red-500' : 'text-slate-400'}`}>{item.status}</p>
                      </div>
                    </div>
                    <p className="font-bold text-slate-900 text-sm md:text-lg">{item.price}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* TRUSTED BY SECTION */}
        <section className="py-20 md:py-24 border-b border-slate-100">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-xs md:text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 md:mb-6">Trusted by Savvy Spenders</p>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Join Over <span className="text-emerald-600">50,000+</span> Paid Users</h2>
          </div>
          <div className="flex justify-center items-center gap-12 md:gap-24 flex-wrap">
            <div className="flex items-center gap-3 md:gap-4 text-slate-700">
              <UserCheck className="w-8 md:w-10 h-8 md:h-10 text-emerald-500" />
              <div>
                <span className="text-3xl md:text-5xl font-black block leading-none">50K+</span>
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400">Users</span>
              </div>
            </div>
            <div className="flex items-center gap-3 md:gap-4 text-slate-700">
              <Award className="w-8 md:w-10 h-8 md:h-10 text-emerald-500" />
              <div>
                <span className="text-3xl md:text-5xl font-black block leading-none">98%</span>
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400">Satisfaction</span>
              </div>
            </div>
            <div className="flex items-center gap-3 md:gap-4 text-slate-700">
              <DollarSign className="w-8 md:w-10 h-8 md:h-10 text-emerald-500" />
              <div>
                <span className="text-3xl md:text-5xl font-black block leading-none">30%</span>
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400">Average Savings</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. HOW IT WORKS: THE PIPELINE */}
        <section className="py-20 md:py-32 border-b border-slate-100">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">The Strategic Audit Workflow</h2>
            <p className="text-slate-500 text-base md:text-lg font-medium">Three steps to reclaiming your monthly budget.</p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10 md:gap-16">
            {[
              {
                icon: <Search className="w-7 h-7" />,
                title: "Centralize",
                desc: "Manually log your subscriptions in seconds. We support KES and major global currencies."
              },
              {
                icon: <Bell className="w-7 h-7" />,
                title: "Alert",
                desc: "Get precision notifications 7 days, 3 days, and 24 hours before any card charge."
              },
              {
                icon: <TrendingDown className="w-7 h-7" />,
                title: "Prune",
                desc: "Identify 'Dormant Burn'—subscriptions you're paying for but haven't used or are duplicates."
              },
            ].map((step, i) => (
              <div key={i} className="group p-8 md:p-10 rounded-[2.5rem] hover:bg-white hover:shadow-2xl transition-all border border-transparent hover:border-slate-100 text-center sm:text-left">
                <div className="w-14 md:w-16 h-14 md:h-16 bg-slate-900 text-white rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:bg-emerald-600 transition-all transition-transform group-hover:-translate-y-2 mx-auto sm:mx-0 shadow-lg">
                  {step.icon}
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. WASTAGE MINIMIZATION: THE INTELLIGENCE SECTION */}
        <section className="py-20 md:py-32 bg-slate-900 rounded-[3rem] md:rounded-[4rem] px-8 md:px-20 text-white overflow-hidden relative border-b border-slate-700">
          <div className="absolute top-0 right-0 p-12 opacity-5 hidden md:block">
            <Sparkles className="w-80 h-80" />
          </div>

          <div className="grid lg:grid-cols-2 gap-16 md:gap-24 items-center">
            <div className="text-center lg:text-left space-y-10">
              <h2 className="text-4xl md:text-6xl font-black leading-tight tracking-tight">
                Eliminate the <br />
                <span className="text-emerald-400">"Dormant Burn"</span>
              </h2>
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
                  <div className="mt-1 bg-emerald-500/20 p-2 rounded-xl">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-xl">Duplicate Detection</h4>
                    <p className="text-slate-400 text-sm md:text-base font-medium">Paying for Netflix and Disney+ but only watching one? We flag category overlaps.</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
                  <div className="mt-1 bg-emerald-500/20 p-2 rounded-xl">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-xl">Annual Switch Insights</h4>
                    <p className="text-slate-400 text-sm md:text-base font-medium">We calculate exactly how much you'd save switching from monthly to annual billing.</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
                  <div className="mt-1 bg-emerald-500/20 p-2 rounded-xl">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-xl">Family Sharing Tracking</h4>
                    <p className="text-slate-400 text-sm md:text-base font-medium">Label who is using what. Stop paying for your ex's Spotify (we see you, Alex).</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mockup of a Warning Alert */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-[2.5rem] p-8 md:p-10 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center gap-3 mb-10 text-amber-300 bg-amber-400/10 w-fit px-5 py-2.5 rounded-full mx-auto lg:mx-0">
                <AlertCircle className="w-5 h-5" />
                <span className="text-[10px] md:text-xs font-extrabold uppercase tracking-widest">Potential Saving: KES 14,200/yr</span>
              </div>
              <div className="space-y-5">
                <div className="p-5 md:p-6 bg-slate-900/60 rounded-2xl md:rounded-3xl border border-slate-700/50 flex justify-between items-center group cursor-pointer hover:border-emerald-500/50 transition-all">
                  <div className="flex items-center gap-4">
                    <Layers className="text-emerald-400 w-5 md:w-6 h-5 md:h-6" />
                    <span className="font-semibold text-sm md:text-base">3 Cloud Storage detected</span>
                  </div>
                  <button className="text-xs font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-4">Review</button>
                </div>
                <div className="p-5 md:p-6 bg-slate-900/60 rounded-2xl md:rounded-3xl border border-slate-700/50 flex justify-between items-center group cursor-pointer hover:border-blue-500/50 transition-all">
                  <div className="flex items-center gap-4">
                    <TrendingDown className="text-blue-400 w-5 md:w-6 h-5 md:h-6" />
                    <span className="font-semibold text-sm md:text-base">Switch Zoom to Annual</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 group-hover:text-blue-300 transition-colors">- KES 4,500/yr</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BEFORE & AFTER COMPARISON */}
        <section className="py-20 md:py-32 border-b border-slate-100">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">Life Before vs. After MySubMonitor.com</h2>
            <p className="text-slate-500 text-base md:text-lg font-medium max-w-2xl mx-auto">Experience the tangible impact of intelligent subscription management.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-10 md:gap-16">
            {/* Before Card */}
            <div className="p-10 md:p-14 bg-gradient-to-br from-red-50 to-red-100/50 rounded-[3rem] shadow-xl border border-red-100">
              <div className="flex items-center gap-6 mb-10">
                <div className="w-16 md:w-20 h-16 md:h-20 rounded-full bg-red-600/90 text-white flex items-center justify-center text-3xl md:text-4xl shadow-lg">🚫</div>
                <h3 className="text-3xl md:text-4xl font-black text-red-900 tracking-tight">Before</h3>
              </div>
              <ul className="space-y-6 md:space-y-8 text-red-800/80 text-lg md:text-xl font-medium">
                <li className="flex items-start gap-4">
                  <XCircle className="w-6 md:w-7 h-6 md:h-7 flex-shrink-0 mt-1 text-red-500" />
                  <span>Unexpected charges draining your account.</span>
                </li>
                <li className="flex items-start gap-4">
                  <XCircle className="w-6 md:w-7 h-6 md:h-7 flex-shrink-0 mt-1 text-red-500" />
                  <span>Dormant subscriptions accumulating unnoticed.</span>
                </li>
                <li className="flex items-start gap-4">
                  <XCircle className="w-6 md:w-7 h-6 md:h-7 flex-shrink-0 mt-1 text-red-500" />
                  <span>No clear overview of your monthly financial burn.</span>
                </li>
              </ul>
            </div>
            {/* After Card */}
            <div className="p-10 md:p-14 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-[3rem] shadow-xl border border-emerald-100">
              <div className="flex items-center gap-6 mb-10">
                <div className="w-16 md:w-20 h-16 md:h-20 rounded-full bg-emerald-600/90 text-white flex items-center justify-center text-3xl md:text-4xl shadow-lg">✅</div>
                <h3 className="text-3xl md:text-4xl font-black text-emerald-900 tracking-tight">After</h3>
              </div>
              <ul className="space-y-6 md:space-y-8 text-emerald-800/80 text-lg md:text-xl font-medium">
                <li className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 md:w-7 h-6 md:h-7 flex-shrink-0 mt-1 text-emerald-500" />
                  <span>Timely alerts prevent financial surprises.</span>
                </li>
                <li className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 md:w-7 h-6 md:h-7 flex-shrink-0 mt-1 text-emerald-500" />
                  <span>Save on average 30% by cutting unused services.</span>
                </li>
                <li className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 md:w-7 h-6 md:h-7 flex-shrink-0 mt-1 text-emerald-500" />
                  <span>Crystal-clear insights into all your recurring expenses.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* PRICING MODEL SECTION */}
        <section id="pricing" className="py-20 md:py-32 bg-white rounded-[3rem] md:rounded-[4rem] px-8 md:px-16 border border-slate-100 shadow-sm mt-12 mb-12">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">Choose Your Command Tier</h2>
            <p className="text-slate-500 text-base md:text-lg font-medium max-w-2xl mx-auto">Scalable plans designed for every level of financial mastery.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10 md:gap-12">
            {/* Basic Plan */}
            <div className="p-10 md:p-12 rounded-[2.5rem] border border-slate-100 text-center flex flex-col items-center shadow-lg hover:shadow-2xl transition-all duration-500 bg-white group">
              <h3 className="text-xl md:text-2xl font-black mb-4 text-slate-800">Essential</h3>
              <p className="text-slate-400 text-sm mb-8 font-bold uppercase tracking-widest">Start your audit</p>
              <div className="text-5xl md:text-6xl font-black text-slate-900 mb-2 tracking-tighter">
                $9<span className="text-lg text-slate-400">/mo</span>
              </div>
              <p className="text-xs font-bold text-slate-400 mb-10">Billed annually</p>
              <Button variant="outline" className="w-full py-8 rounded-2xl font-black text-lg group-hover:bg-slate-900 group-hover:text-white transition-all">
                Get Started
              </Button>
              <ul className="text-left space-y-4 mt-12 text-slate-600 font-medium text-sm md:text-base">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> Track up to 10 subscriptions</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> Basic upcoming renewal alerts</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> Monthly spending overview</li>
              </ul>
            </div>

            {/* Pro Plan (Most Popular) */}
            <div className="p-10 md:p-12 rounded-[2.5rem] border-2 border-emerald-500 bg-emerald-50 text-center flex flex-col items-center shadow-2xl shadow-emerald-200/50 relative scale-105 z-10">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 bg-emerald-600 text-white text-[10px] md:text-xs font-black rounded-full uppercase tracking-widest whitespace-nowrap shadow-xl">
                Most Popular
              </div>
              <h3 className="text-xl md:text-2xl font-black mb-4 text-emerald-900">Pro Auditor</h3>
              <p className="text-emerald-700/80 text-sm mb-8 font-bold uppercase tracking-widest">Serious savings</p>
              <div className="text-5xl md:text-6xl font-black text-emerald-900 mb-2 tracking-tighter">
                $19<span className="text-lg text-emerald-500">/mo</span>
              </div>
              <p className="text-xs font-bold text-emerald-600/60 mb-10">Billed annually, save 20%</p>
              <Button className="w-full py-8 rounded-2xl font-black text-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-600/20 active:scale-[0.98] transition-all">
                Go Pro
              </Button>
              <ul className="text-left space-y-4 mt-12 text-emerald-900/80 font-semibold text-sm md:text-base">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> Unlimited subscriptions</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> Advanced alert customization</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> Duplicate & Dormant detection</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> Priority support</li>
              </ul>
            </div>

            {/* Enterprise Plan */}
            <div className="p-10 md:p-12 rounded-[2.5rem] border border-slate-100 text-center flex flex-col items-center shadow-lg hover:shadow-2xl transition-all duration-500 bg-white group">
              <h3 className="text-xl md:text-2xl font-black mb-4 text-slate-800">Enterprise</h3>
              <p className="text-slate-400 text-sm mb-8 font-bold uppercase tracking-widest">Complex landscapes</p>
              <div className="text-5xl md:text-6xl font-black text-slate-900 mb-2 tracking-tighter">
                $29<span className="text-lg text-slate-400">/mo</span>
              </div>
              <p className="text-xs font-bold text-slate-400 mb-10">Billed annually</p>
              <Button variant="outline" className="w-full py-8 rounded-2xl font-black text-lg group-hover:bg-slate-900 group-hover:text-white transition-all">
                Contact Sales
              </Button>
              <ul className="text-left space-y-4 mt-12 text-slate-600 font-medium text-sm md:text-base">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> All Pro Auditor features</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> Multiple user accounts</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> Dedicated account manager</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> Custom API integrations</li>
              </ul>
            </div>
          </div>
        </section>

        {/* PAYMENT METHODS */}
        <section className="py-20 md:py-32 border-b border-slate-100 text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-16 tracking-tight">Seamless Payment Options</h2>
          <div className="flex justify-center items-center gap-16 md:gap-32 flex-wrap">
            <div className="text-slate-700 flex flex-col items-center gap-4 group cursor-pointer hover:scale-110 transition-transform">
              <div className="w-20 md:w-24 h-20 md:h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center border border-slate-100 group-hover:bg-white group-hover:shadow-xl transition-all">
                <CreditCard className="w-10 md:w-12 h-10 md:h-12 text-slate-500 group-hover:text-emerald-500 transition-colors" />
              </div>
              <span className="text-sm md:text-base font-bold uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-colors">Credit Cards</span>
            </div>
            <div className="text-slate-700 flex flex-col items-center gap-4 group cursor-pointer hover:scale-110 transition-transform">
              <div className="w-20 md:w-24 h-20 md:h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center border border-slate-100 group-hover:bg-white group-hover:shadow-xl transition-all">
                <Banknote className="w-10 md:w-12 h-10 md:h-12 text-slate-500 group-hover:text-emerald-500 transition-colors" />
              </div>
              <span className="text-sm md:text-base font-bold uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-colors">M-Pesa</span>
            </div>
            <div className="text-slate-700 flex flex-col items-center gap-4 group cursor-pointer hover:scale-110 transition-transform">
              <div className="w-20 md:w-24 h-20 md:h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center border border-slate-100 group-hover:bg-white group-hover:shadow-xl transition-all">
                <DollarSign className="w-10 md:w-12 h-10 md:h-12 text-slate-500 group-hover:text-emerald-500 transition-colors" />
              </div>
              <span className="text-sm md:text-base font-bold uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-colors">Bank Transfers</span>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section className="py-24 md:py-32 bg-white rounded-[3rem] md:rounded-[4rem] px-8 md:px-16 border border-slate-100 shadow-sm mt-12 mb-20 bg-gradient-to-br from-white to-slate-50/50">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">Hear From Our Users</h2>
            <p className="text-slate-500 text-base md:text-lg font-medium max-w-2xl mx-auto">Real people, real savings, real peace of mind.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
            {/* Testimonial 1 */}
            <div className="bg-white p-10 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col h-full group">
              <div className="flex items-center mb-8">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 md:w-6 h-5 md:h-6 fill-amber-400 text-amber-400 group-hover:scale-110 transition-transform" />)}
              </div>
              <p className="text-slate-700 italic flex-grow text-base md:text-lg font-medium leading-relaxed">
                "MySubMonitor.com literally saved me from paying for three streaming services I barely used! The dormant burn detection is a game-changer."
              </p>
              <div className="mt-10 pt-10 border-t border-slate-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center font-black text-emerald-700">MW</div>
                <div>
                  <p className="font-bold text-slate-900 text-base md:text-lg">Mercy Wanjiku</p>
                  <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400">Entrepreneur, Nairobi</p>
                </div>
              </div>
            </div>
            {/* Testimonial 2 */}
            <div className="bg-white p-10 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col h-full group">
              <div className="flex items-center mb-8">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 md:w-6 h-5 md:h-6 fill-amber-400 text-amber-400 group-hover:scale-110 transition-transform" />)}
              </div>
              <p className="text-slate-700 italic flex-grow text-base md:text-lg font-medium leading-relaxed">
                "As a freelancer, keeping track of my software subscriptions was a nightmare. MySubMonitor.com gives me a complete overview."
              </p>
              <div className="mt-10 pt-10 border-t border-slate-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-black text-blue-700">DO</div>
                <div>
                  <p className="font-bold text-slate-900 text-base md:text-lg">David Ochieng</p>
                  <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400">Software Developer, Mombasa</p>
                </div>
              </div>
            </div>
            {/* Testimonial 3 */}
            <div className="bg-white p-10 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col h-full group">
              <div className="flex items-center mb-8">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 md:w-6 h-5 md:h-6 fill-amber-400 text-amber-400 group-hover:scale-110 transition-transform" />)}
              </div>
              <p className="text-slate-700 italic flex-grow text-base md:text-lg font-medium leading-relaxed">
                "The family sharing tracking is brilliant. I finally know exactly who's using what and where our money is going."
              </p>
              <div className="mt-10 pt-10 border-t border-slate-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center font-black text-purple-700">FH</div>
                <div>
                  <p className="font-bold text-slate-900 text-base md:text-lg">Fatima Hassan</p>
                  <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400">Marketing Manager, Kisumu</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER CTA & LINKS */}
      <footer className="bg-slate-900 text-white pt-24 pb-12 px-8">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 md:grid-cols-4 gap-16 md:gap-24">
          {/* Brand & Tagline */}
          <div className="col-span-1 space-y-8">
            <div className="flex items-center gap-4 font-black text-2xl tracking-tighter">
              <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white italic shadow-lg shadow-emerald-500/20">M</div>
              MySubMonitor.com
            </div>
            <p className="text-slate-400 text-base font-medium leading-relaxed">Master your capital flow, effortlessly. Reclaim your monthly budget today.</p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="font-black text-sm uppercase tracking-widest text-white/40 mb-8">Product</h4>
            <ul className="space-y-4 text-slate-300 font-semibold">
              <li><button className="hover:text-emerald-400 transition-colors">How it Works</button></li>
              <li><button className="hover:text-emerald-400 transition-colors">Pricing</button></li>
              <li><button className="hover:text-emerald-400 transition-colors">Features</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-sm uppercase tracking-widest text-white/40 mb-8">Company</h4>
            <ul className="space-y-4 text-slate-300 font-semibold">
              <li><button className="hover:text-emerald-400 transition-colors">About Us</button></li>
              <li><button className="hover:text-emerald-400 transition-colors">Careers</button></li>
              <li><button className="hover:text-emerald-400 transition-colors">Contact</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-sm uppercase tracking-widest text-white/40 mb-8">Legal</h4>
            <ul className="space-y-4 text-slate-300 font-semibold">
              <li><button className="hover:text-emerald-400 transition-colors">Privacy Policy</button></li>
              <li><button className="hover:text-emerald-400 transition-colors">Terms of Service</button></li>
            </ul>
          </div>
        </div>

        <div className="text-center mt-24 text-white/20 text-[10px] md:text-xs font-black border-t border-white/5 pt-12 uppercase tracking-[0.2em]">
          &copy; {new Date().getFullYear()} MySubMonitor.com. All rights reserved. Made with ❤️ in Kenya.
        </div>
      </footer>
    </div>
  );
};

export default EntryPage;