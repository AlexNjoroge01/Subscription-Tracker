'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
  LayoutDashboard,
  CreditCard,
  FolderKanban,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Crown,
  Shield,
} from 'lucide-react'
import { signOut } from 'next-auth/react'

function SidebarLink({
  href,
  label,
  icon: Icon,
  onClick,
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
      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
        active
          ? 'bg-emerald-50 text-emerald-700'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
      }`}
    >
      <Icon className={`w-5 h-5 ${active ? 'text-emerald-500' : 'text-slate-400'}`} />
      <span>{label}</span>
    </Link>
  )
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { data: session } = useSession()

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  const baseNavLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/categories', label: 'Categories', icon: FolderKanban },
    { href: '/subscriptions', label: 'Subscriptions', icon: CreditCard },    
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/notifications', label: 'Notifications', icon: Bell },
    { href: '/pricing', label: 'Upgrade', icon: Crown },
    { href: '/settings', label: 'Settings', icon: Settings },
  ]

  // Add admin link for superusers
  const navLinks = session?.user?.role === 'SUPERUSER'
    ? [...baseNavLinks, { href: '/admin', label: 'Admin', icon: Shield }]
    : baseNavLinks

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between px-5 py-4 bg-white/80 backdrop-blur-lg border-b border-slate-100 sticky top-0 z-50">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-lg font-semibold tracking-tight text-slate-900">
            SubTrack
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMobileMenu}
            className="p-2 text-slate-500 hover:text-slate-900 transition-colors rounded-lg hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar (Desktop & Mobile) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 px-5 py-6 flex flex-col gap-6 transition-transform duration-300 ease-in-out shadow-xl shadow-slate-200/50 md:shadow-none
        md:relative md:translate-x-0 md:flex
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-1">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold tracking-tight text-slate-900">
                SubTrack
              </span>
              <span className="text-xs text-slate-400">
                Subscription Manager
              </span>
            </div>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 flex-1">
          <p className="px-4 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Menu
          </p>
          {navLinks.map((link) => (
            <SidebarLink
              key={link.href}
              {...link}
              onClick={() => setIsMobileMenuOpen(false)}
            />
          ))}
        </nav>

        {/* Logout */}
        <div className="pt-4 border-t border-slate-100">
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200 group"
          >
            <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-500" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>
    </div>
  )
}
