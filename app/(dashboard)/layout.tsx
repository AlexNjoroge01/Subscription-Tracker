'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  CreditCard,
  FolderKanban,
  BarChart3,
} from 'lucide-react'

function SidebarLink({
  href,
  label,
  icon: Icon,
}: {
  href: string
  label: string
  icon: typeof LayoutDashboard
}) {
  const pathname = usePathname()
  const active = pathname.startsWith(href)

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl px-3 py-3 text-base font-medium transition-colors ${
        active
          ? 'bg-slate-900 text-white shadow-sm'
          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
      }`}
    >
      <Icon className={`w-5 h-5 ${active ? 'text-emerald-400' : 'text-slate-400'}`} />
      <span>{label}</span>
    </Link>
  )
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-slate-100 bg-white px-4 py-6 gap-8">
        <Link href="/dashboard" className="flex items-center gap-3 px-2">
          <div className="w-14 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black">
            MSM
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold tracking-tight text-slate-900">
              MySubMonitor
            </span>
            <span className="text-[14px] uppercase tracking-[0.18em] text-slate-400">
              Control Center
            </span>
          </div>
        </Link>

        <nav className="flex flex-col gap-1">
          <p className="px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 mb-2">
            Overview
          </p>
          <SidebarLink href="/dashboard" label="Dashboard" icon={LayoutDashboard} />
          <SidebarLink href="/subscriptions" label="Subscriptions" icon={CreditCard} />
          <SidebarLink href="/categories" label="Categories" icon={FolderKanban} />
          <SidebarLink href="/notifications" label="Notifications" icon={FolderKanban} />
          <SidebarLink href="/analytics" label="Analytics" icon={BarChart3} />
        </nav>

        
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  )
}