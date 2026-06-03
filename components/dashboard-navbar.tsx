'use client'

import { useSession, signOut } from 'next-auth/react'
import { LogOut, Settings } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { NotificationBell } from '@/components/notification-bell'

export function DashboardNavbar() {
  const { data: session } = useSession()
  const userInitial = session?.user?.name?.charAt(0)?.toUpperCase() || 'U'

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-end border-b border-white/[0.06] bg-[#060c08]/90 backdrop-blur-xl px-5 md:px-6">
      <div className="flex items-center gap-2">
        <NotificationBell />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 hover:bg-white/[0.05] transition-colors group">
              <div className="w-7 h-7 rounded-full bg-[#a3e635]/15 border border-[#a3e635]/25 flex items-center justify-center text-[#a3e635] text-[12px] font-bold">
                {userInitial}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-[13px] font-semibold text-white/85 group-hover:text-white transition-colors leading-tight">
                  {session?.user?.name || 'User'}
                </p>
                <p className="text-[11px] text-white/35 leading-tight">
                  {session?.user?.email}
                </p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-[#0d1b0f] border border-white/[0.08] text-white shadow-2xl shadow-black/50 rounded-2xl"
          >
            <DropdownMenuLabel className="px-3 py-2.5">
              <p className="text-[13px] font-semibold text-white">{session?.user?.name || 'User'}</p>
              <p className="text-[11px] text-white/40 mt-0.5">{session?.user?.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/[0.07]" />
            <DropdownMenuItem asChild>
              <a
                href="/settings"
                className="flex items-center gap-2.5 cursor-pointer text-white/60 hover:text-white hover:bg-white/[0.05] rounded-xl mx-1 px-3 py-2 text-[13px] transition-colors"
              >
                <Settings className="w-4 h-4" />
                Settings
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/[0.07]" />
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="flex items-center gap-2.5 cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-500/[0.08] rounded-xl mx-1 px-3 py-2 text-[13px] transition-colors focus:text-red-300 focus:bg-red-500/[0.08]"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
