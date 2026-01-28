import React from 'react';
import { 
  ArrowRight, BarChart3, Bell, ShieldCheck, Zap, 
  Search, MousePointerClick, TrendingDown, Layers, 
  CheckCircle2, AlertCircle, Sparkles, XCircle, DollarSign, CreditCard, Banknote, UserCheck, Star, Award
} from 'lucide-react';
import Link from 'next/link';

const EntryPage = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 selection:bg-emerald-100 font-sans">
      {/* 1. Header & Hero */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
          <div className="w-16 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white italic shadow-lg shadow-emerald-500/20">MSM</div>
          MySubMonitor.com
        </div>
        <div className="flex items-center gap-6 text-sm font-medium text-slate-500">
          <button className="hover:text-emerald-600 transition-colors">How it works</button>
          <button className="hover:text-emerald-600 transition-colors">Pricing</button>
          <button className="hover:text-emerald-600 transition-colors">Testimonials</button>
          <Link href="/login">
  <button className="px-5 py-2.5 bg-slate-900 text-white rounded-full hover:bg-emerald-600 transition-all shadow-lg shadow-slate-900/10">
    Sign In
  </button>
</Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6">
        {/* HERO SECTION */}
        <section className="pt-20 pb-32 grid lg:grid-cols-2 gap-16 items-center border-b border-slate-100">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider">
              <Zap className="w-3 h-3 fill-emerald-700" />
              Engineered for Wealth Retention
            </div>
            
            <h1 className="text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.05]">
              Master your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                capital flow.
              </span>
            </h1>

            <p className="text-xl text-slate-500 max-w-lg leading-relaxed font-light">
              Stop the silent bleed of forgotten subscriptions. One dashboard to audit, 
              optimize, and command your digital overhead. 
            </p>

            <div className="flex items-center gap-4">
              <Link href="/dashboard">
  <button className="group px-8 py-4 bg-emerald-600 text-white font-bold rounded-2xl flex items-center gap-3 hover:bg-emerald-700 transition-all hover:translate-y-[-1px] shadow-xl shadow-emerald-600/20">
    Secure Your Dashboard
    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
  </button>
</Link>
              <div className="text-sm font-medium text-slate-400">
                100% Secure <br /> Data Encryption
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-200/40 rounded-full blur-[80px]" />
            <div className="relative bg-white border border-slate-100 rounded-[32px] shadow-2xl p-8 backdrop-blur-xl">
               <div className="flex justify-between items-center mb-8">
                  <div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Monthly Burn</p>
                    <p className="text-3xl font-black text-slate-900">KES 42,450.00</p>
                  </div>
                  <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <BarChart3 className="text-emerald-600 w-6 h-6" />
                  </div>
               </div>
               
               <div className="space-y-4">
                  {[
                    { name: 'Netflix Premium', price: 'KES 1,100', status: 'Due in 2 days', color: 'bg-red-50 text-red-600', alert: true },
                    { name: 'ChatGPT Plus', price: 'KES 2,600', status: 'Active', color: 'bg-emerald-50 text-emerald-600' },
                    { name: 'iCloud+', price: 'KES 1,200', status: 'Active', color: 'bg-blue-50 text-blue-600' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center font-bold`}>{item.name[0]}</div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{item.name}</p>
                          <p className={`text-xs font-medium ${item.alert ? 'text-red-500' : 'text-slate-400'}`}>{item.status}</p>
                        </div>
                      </div>
                      <p className="font-bold text-slate-900">{item.price}</p>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </section>

        {/* TRUSTED BY SECTION */}
        <section className="py-16 border-b border-slate-100">
          <div className="text-center mb-12">
            <p className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Trusted by Savvy Spenders</p>
            <h2 className="text-4xl font-black text-slate-900">Join Over <span className="text-emerald-600">50,000+</span> Paid Users</h2>
          </div>
          <div className="flex justify-center items-center gap-16 flex-wrap">
            <div className="flex items-center gap-3 text-slate-700">
              <UserCheck className="w-8 h-8 text-emerald-500" />
              <span className="text-4xl font-bold">50K+</span>
              <span className="text-slate-500">Users</span>
            </div>
            <div className="flex items-center gap-3 text-slate-700">
              <Award className="w-8 h-8 text-emerald-500" />
              <span className="text-4xl font-bold">98%</span>
              <span className="text-slate-500">Satisfaction</span>
            </div>
            <div className="flex items-center gap-3 text-slate-700">
              <DollarSign className="w-8 h-8 text-emerald-500" />
              <span className="text-4xl font-bold">30%</span>
              <span className="text-slate-500">Average Savings</span>
            </div>
          </div>
        </section>

        {/* 2. HOW IT WORKS: THE PIPELINE */}
        <section className="py-24 border-b border-slate-100">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">The Strategic Audit Workflow</h2>
            <p className="text-slate-500">Three steps to reclaiming your monthly budget.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { 
                icon: <Search className="w-6 h-6" />, 
                title: "Centralize", 
                desc: "Manually log your subscriptions in seconds. We support KES and major global currencies." 
              },
              { 
                icon: <Bell className="w-6 h-6" />, 
                title: "Alert", 
                desc: "Get precision notifications 7 days, 3 days, and 24 hours before any card charge." 
              },
              { 
                icon: <TrendingDown className="w-6 h-6" />, 
                title: "Prune", 
                desc: "Identify 'Dormant Burn'—subscriptions you're paying for but haven't used or are duplicates." 
              },
            ].map((step, i) => (
              <div key={i} className="group p-8 rounded-3xl hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-slate-100">
                <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition-colors">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. WASTAGE MINIMIZATION: THE INTELLIGENCE SECTION */}
        <section className="py-24 bg-slate-900 rounded-[48px] px-12 text-white overflow-hidden relative border-b border-slate-700">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <Sparkles className="w-64 h-64" />
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl font-black leading-tight mb-8">
                Eliminate the <br />
                <span className="text-emerald-400">"Dormant Burn"</span>
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="mt-1 bg-emerald-500/20 p-1 rounded-md">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Duplicate Detection</h4>
                    <p className="text-slate-400">Paying for Netflix and Disney+ but only watching one? We flag category overlaps.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1 bg-emerald-500/20 p-1 rounded-md">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Annual Switch Insights</h4>
                    <p className="text-slate-400">We calculate exactly how much you'd save switching from monthly to annual billing.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1 bg-emerald-500/20 p-1 rounded-md">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Family Sharing Tracking</h4>
                    <p className="text-slate-400">Label who is using what. Stop paying for your ex's Spotify (we see you, Alex).</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mockup of a Warning Alert */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-3xl p-6 backdrop-blur-md">
              <div className="flex items-center gap-3 mb-6 text-amber-400 bg-amber-400/10 w-fit px-4 py-2 rounded-full">
                <AlertCircle className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Potential Saving: KES 14,200/yr</span>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-700 flex justify-between items-center">
                   <div className="flex items-center gap-3">
                     <Layers className="text-emerald-400 w-5 h-5" />
                     <span className="font-medium text-sm">3 Cloud Storage detected</span>
                   </div>
                   <button className="text-xs font-bold text-emerald-400 hover:underline">Review</button>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-700 flex justify-between items-center">
                   <div className="flex items-center gap-3">
                     <TrendingDown className="text-blue-400 w-5 h-5" />
                     <span className="font-medium text-sm">Switch Zoom to Annual</span>
                   </div>
                   <span className="text-xs text-slate-400">- KES 4,500/yr</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BEFORE & AFTER COMPARISON */}
        <section className="py-24 border-b border-slate-100">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Life Before vs. After MySubMonitor.com</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Experience the tangible impact of intelligent subscription management.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            {/* Before Card */}
            <div className="p-10 bg-gradient-to-br from-red-50 to-red-100 rounded-3xl shadow-lg border border-red-200">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center text-3xl font-bold">🚫</div>
                <h3 className="text-3xl font-bold text-red-800">Before MySubMonitor.com</h3>
              </div>
              <ul className="space-y-6 text-red-700 text-lg">
                <li className="flex items-start gap-3">
                  <XCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                  <span>Unexpected charges draining your account.</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                  <span>Dormant subscriptions accumulating unnoticed.</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                  <span>No clear overview of your monthly financial burn.</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                  <span>Struggling to find where your money is actually going.</span>
                </li>
              </ul>
            </div>
            {/* After Card */}
            <div className="p-10 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-3xl shadow-lg border border-emerald-200">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center text-3xl font-bold">✅</div>
                <h3 className="text-3xl font-bold text-emerald-800">After MySubMonitor.com</h3>
              </div>
              <ul className="space-y-6 text-emerald-700 text-lg">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1" />
                  <span>Timely alerts prevent financial surprises.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1" />
                  <span>Save on average 30% by cutting unused services.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1" />
                  <span>Crystal-clear insights into all your recurring expenses.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1" />
                  <span>Confidently manage finances with actionable data.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* PRICING MODEL SECTION */}
        <section className="py-24 bg-white rounded-[48px] px-12 border border-slate-100">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Choose Your Command Tier</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Scalable plans designed for every level of financial mastery.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <div className="p-10 rounded-3xl border border-slate-200 text-center flex flex-col items-center shadow-lg">
              <h3 className="text-2xl font-bold mb-4">Essential</h3>
              <p className="text-slate-500 mb-6">Start your financial audit.</p>
              <div className="text-5xl font-extrabold text-slate-900 mb-2">
                $9<span className="text-lg text-slate-400">/month</span>
              </div>
              <p className="text-sm text-slate-400 mb-8">Billed annually.</p>
              <button className="w-full px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-emerald-600 transition-all">
                Get Started
              </button>
              <ul className="text-left space-y-3 mt-8 text-slate-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Track up to 10 subscriptions</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Basic upcoming renewal alerts</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Monthly spending overview</li>
                <li className="flex items-center gap-2"><XCircle className="w-4 h-4 text-red-400" /> No duplicate detection</li>
              </ul>
            </div>

            {/* Pro Plan (Most Popular) */}
            <div className="p-10 rounded-3xl border border-emerald-400 bg-emerald-50 text-center flex flex-col items-center shadow-2xl shadow-emerald-200/50 relative">
              <div className="absolute -top-4 right-1/2 translate-x-1/2 px-4 py-1 bg-emerald-600 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold mb-4 text-emerald-800">Pro Auditor</h3>
              <p className="text-emerald-700 mb-6">Advanced insights for serious savings.</p>
              <div className="text-5xl font-extrabold text-emerald-900 mb-2">
                $19<span className="text-lg text-emerald-500">/month</span>
              </div>
              <p className="text-sm text-emerald-500 mb-8">Billed annually, save 20%.</p>
              <button className="w-full px-8 py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20">
                Go Pro
              </button>
              <ul className="text-left space-y-3 mt-8 text-emerald-800">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Unlimited subscriptions</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Advanced alert customization</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> **Duplicate & Dormant Burn detection**</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Category & annual savings insights</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Export data (CSV, PDF)</li>
              </ul>
            </div>

            {/* Enterprise Plan */}
            <div className="p-10 rounded-3xl border border-slate-200 text-center flex flex-col items-center shadow-lg">
              <h3 className="text-2xl font-bold mb-4">Enterprise</h3>
              <p className="text-slate-500 mb-6">Tailored for complex financial landscapes.</p>
              <div className="text-5xl font-extrabold text-slate-900 mb-2">
                $29<span className="text-lg text-slate-400">/month</span>
              </div>
              <p className="text-sm text-slate-400 mb-8">Billed annually.</p>
              <button className="w-full px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-emerald-600 transition-all">
                Contact Sales
              </button>
              <ul className="text-left space-y-3 mt-8 text-slate-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> All Pro Auditor features</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Multiple user accounts</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Dedicated account manager</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Custom integrations</li>
              </ul>
            </div>
          </div>
        </section>

        {/* PAYMENT METHODS */}
        <section className="py-24 border-b border-slate-100 text-center">
          <h2 className="text-4xl font-black mb-12">Seamless Payment Options</h2>
          <div className="flex justify-center items-center gap-16 flex-wrap">
            <div className="text-slate-700 flex flex-col items-center gap-3">
              <CreditCard className="w-12 h-12 text-slate-500" />
              <span className="text-lg font-medium">Major Credit Cards</span>
            </div>
            <div className="text-slate-700 flex flex-col items-center gap-3">
              <Banknote className="w-12 h-12 text-slate-500" />
              <span className="text-lg font-medium">M-Pesa (Kenya)</span>
            </div>
            <div className="text-slate-700 flex flex-col items-center gap-3">
              <DollarSign className="w-12 h-12 text-slate-500" />
              <span className="text-lg font-medium">Bank Transfers</span>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section className="py-24 bg-white rounded-[48px] px-12 border border-slate-100">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Hear From Our Satisfied Users</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Real people, real savings, real peace of mind.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col h-full">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-slate-700 italic flex-grow">
                "MySubMonitor.com literally saved me from paying for three streaming services I barely used! The dormant burn detection is a game-changer. My monthly spending has never been clearer."
              </p>
              <div className="mt-6 pt-6 border-t border-slate-200">
                <p className="font-bold text-slate-900">Mercy Wanjiku</p>
                <p className="text-sm text-slate-500">Entrepreneur, Nairobi</p>
              </div>
            </div>
            {/* Testimonial 2 */}
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col h-full">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-slate-700 italic flex-grow">
                "As a freelancer, keeping track of my software subscriptions was a nightmare. MySubMonitor.com gives me a complete overview and the notifications are spot on. Highly recommended!"
              </p>
              <div className="mt-6 pt-6 border-t border-slate-200">
                <p className="font-bold text-slate-900">David Ochieng</p>
                <p className="text-sm text-slate-500">Software Developer, Mombasa</p>
              </div>
            </div>
            {/* Testimonial 3 */}
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col h-full">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-slate-700 italic flex-grow">
                "The family sharing tracking is brilliant. I finally know exactly who's using what and where our money is going. MySubMonitor.com brought sanity back to our household budget."
              </p>
              <div className="mt-6 pt-6 border-t border-slate-200">
                <p className="font-bold text-slate-900">Fatima Hassan</p>
                <p className="text-sm text-slate-500">Marketing Manager, Kisumu</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER CTA & LINKS */}
      <footer className="bg-slate-900 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          {/* Brand & Tagline */}
          <div className="col-span-1 space-y-4">
            <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white italic">MSM</div>
              MySubMonitor.com
            </div>
            <p className="text-slate-400 text-sm">Master your capital flow, effortlessly.</p>
            <div className="flex gap-4 mt-4">
              {/* Social icons could go here */}
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Product</h4>
            <ul className="space-y-3 text-slate-400">
              <li><button className="hover:text-emerald-500 transition-colors">How it Works</button></li>
              <li><button className="hover:text-emerald-500 transition-colors">Pricing</button></li>
              <li><button className="hover:text-emerald-500 transition-colors">Features</button></li>
              <li><button className="hover:text-emerald-500 transition-colors">Security</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Company</h4>
            <ul className="space-y-3 text-slate-400">
              <li><button className="hover:text-emerald-500 transition-colors">About Us</button></li>
              <li><button className="hover:text-emerald-500 transition-colors">Careers</button></li>
              <li><button className="hover:text-emerald-500 transition-colors">Contact</button></li>
              <li><button className="hover:text-emerald-500 transition-colors">Blog</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Legal</h4>
            <ul className="space-y-3 text-slate-400">
              <li><button className="hover:text-emerald-500 transition-colors">Privacy Policy</button></li>
              <li><button className="hover:text-emerald-500 transition-colors">Terms of Service</button></li>
              <li><button className="hover:text-emerald-500 transition-colors">Cookie Policy</button></li>
            </ul>
          </div>
        </div>

        <div className="text-center mt-16 text-slate-500 text-sm border-t border-slate-700 pt-8">
          &copy; {new Date().getFullYear()} MySubMonitor.com. All rights reserved. Made with ❤️ in Kenya.
        </div>
      </footer>
    </div>
  );
};

export default EntryPage;