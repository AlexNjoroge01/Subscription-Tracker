'use client'

import { CreditCard } from 'lucide-react'
import { PricingPlans } from '@/components/pricing-plans'

export default function PricingPage() {
  return (
    <div className="flex-1 bg-[#070e08] text-white selection:bg-[#a3e635]/15">
      <main className="px-6 py-10 max-w-5xl mx-auto space-y-8">
        <section className="space-y-2 text-center">
          <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-md bg-[#0d1b0f] text-amber-300 text-[10px] font-bold uppercase tracking-widest mx-auto">
            <CreditCard className="w-3 h-3" />
            Pricing
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white leading-none">
            Choose Your Plan
          </h1>
          <p className="text-white/45 font-light text-sm max-w-md mx-auto">
            Start tracking your subscriptions for free. Upgrade anytime to unlock more features.
          </p>
        </section>

        <PricingPlans />

        <section className="text-center text-xs text-white/35 pt-8 border-t border-white/[0.06]">
          <p>
            All plans include a 14-day free trial. No credit card required for the Free plan.
            <br />
            Payments are securely processed via Paystack.
          </p>
        </section>
      </main>
    </div>
  )
}
