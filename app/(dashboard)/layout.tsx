'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  CreditCard,
  FolderKanban,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
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
  const active = pathname.startsWith(href)

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl px-3 py-3 text-base font-medium transition-colors ${active
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/subscriptions', label: 'Subscriptions', icon: CreditCard },
    { href: '/categories', label: 'Categories', icon: FolderKanban },
    { href: '/notifications', label: 'Notifications', icon: FolderKanban },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-4 bg-white border-b border-slate-100 sticky top-0 z-50">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-10 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-white font-black text-xs">
            MSM
          </div>
          <span className="text-lg font-semibold tracking-tight text-slate-900">
            MySubMonitor
          </span>
        </Link>
        <button
          onClick={toggleMobileMenu}
          className="p-2 text-slate-500 hover:text-slate-900 transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar (Desktop & Mobile) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-100 px-4 py-6 flex flex-col gap-8 transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:flex
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between md:justify-start gap-3 px-2">
          <Link href="/dashboard" className="flex items-center gap-3">
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
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden p-2 text-slate-500 hover:text-slate-900"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          <p className="px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 mb-2">
            Overview
          </p>
          {navLinks.map((link) => (
            <SidebarLink
              key={link.href}
              {...link}
              onClick={() => setIsMobileMenuOpen(false)}
            />
          ))}
        </nav>

        <div className="pt-0.5 pl-2 mt-auto border-t border-slate-100 bg-slate-900 rounded-xl">
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-base font-medium transition-colors text-slate-500 group"
          >
            <LogOut className="w-5 h-5 text-white group-hover:text-red-500" />
            <span className='text-white'>Logout</span>
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