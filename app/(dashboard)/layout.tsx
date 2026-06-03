'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import {
  LayoutDashboard, CreditCard, FolderKanban, BarChart3,
  Settings, LogOut, Menu, X, Bell, Crown, Shield,
  TrendingDown, Receipt,
} from 'lucide-react'
import { DashboardNavbar } from '@/components/dashboard-navbar'

const BASE_NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/categories', label: 'Categories', icon: FolderKanban },
  { href: '/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/optimize', label: 'Optimize', icon: TrendingDown },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/pricing', label: 'Upgrade', icon: Crown },
  { href: '/payments', label: 'Payments', icon: Receipt },
  { href: '/settings', label: 'Settings', icon: Settings },
]

function NavLink({
  href, label, icon: Icon, onClick,
}: {
  href: string
  label: string
  icon: typeof LayoutDashboard
  onClick?: () => void
}) {
  const pathname = usePathname()
  const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-medium transition-all duration-200 group ${
        active
          ? 'bg-[#a3e635]/10 text-[#a3e635] border border-[#a3e635]/20'
          : 'text-white/45 hover:text-white/80 hover:bg-white/[0.05] border border-transparent'
      }`}
    >
      <Icon className={`w-4 h-4 shrink-0 transition-colors ${active ? 'text-[#a3e635]' : 'text-white/30 group-hover:text-white/60'}`} />
      <span>{label}</span>
      {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#a3e635]" />}
    </Link>
  )
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { data: session } = useSession()

  const navLinks = session?.user?.role === 'SUPERUSER'
    ? [...BASE_NAV, { href: '/admin', label: 'Admin', icon: Shield }]
    : BASE_NAV

  const userInitial = session?.user?.name?.charAt(0)?.toUpperCase() || 'U'

  return (
    <div className="min-h-screen bg-[#070e08] flex flex-col md:flex-row">

      {/* ── Mobile top bar ── */}
      <header className="md:hidden flex items-center justify-between px-5 py-3.5 bg-[#060c08] border-b border-white/[0.06] sticky top-0 z-50">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#a3e635] rounded-[9px] flex items-center justify-center shadow-[0_0_12px_rgba(163,230,53,0.45)]">
            <svg className="w-[17px] h-[17px] text-[#060c08]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-[16px] font-semibold text-white tracking-tight">SubTrack</span>
        </Link>
        <button
          onClick={() => setMobileOpen(v => !v)}
          className="p-2 text-white/50 hover:text-white/80 transition-colors rounded-lg hover:bg-white/[0.05]"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#060c08] border-r border-white/[0.06]
        flex flex-col transition-transform duration-300 ease-in-out
        md:sticky md:top-0 md:h-screen md:translate-x-0 md:flex
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/[0.06]">
          <Link href="/dashboard" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
            <div className="w-8 h-8 bg-[#a3e635] rounded-[9px] flex items-center justify-center shadow-[0_0_14px_rgba(163,230,53,0.5)]">
              <svg className="w-[17px] h-[17px] text-[#060c08]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-[15px] font-bold text-white leading-tight">SubTrack</p>
              <p className="text-[10px] text-white/30 font-medium leading-tight">Subscription Manager</p>
            </div>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1.5 text-white/40 hover:text-white/70 rounded-lg hover:bg-white/[0.05] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
          <p className="px-3.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/20 mb-3">
            Navigation
          </p>
          {navLinks.map(link => (
            <NavLink key={link.href} {...link} onClick={() => setMobileOpen(false)} />
          ))}
        </nav>

        {/* User + logout */}
        <div className="px-3 py-4 border-t border-white/[0.06] space-y-1">
          {session?.user && (
            <div className="flex items-center gap-3 px-3.5 py-3 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-[#a3e635]/15 border border-[#a3e635]/25 flex items-center justify-center text-[#a3e635] text-[13px] font-bold shrink-0">
                {userInitial}
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-white truncate">{session.user.name || 'User'}</p>
                <p className="text-[11px] text-white/35 truncate">{session.user.email}</p>
              </div>
            </div>
          )}
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-medium text-white/40 hover:text-red-400 hover:bg-red-500/[0.08] transition-all duration-200 group"
          >
            <LogOut className="w-4 h-4 text-white/25 group-hover:text-red-400 transition-colors" />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <DashboardNavbar />
        <main className="flex-1 bg-[#070e08]">
          {children}
        </main>
      </div>
    </div>
  )
}
