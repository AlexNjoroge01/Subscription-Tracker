'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Bell } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'

interface UnreadCount {
  count: number
}

export function NotificationBell({ className }: { className?: string }) {
  const { data: session } = useSession()
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!session?.user) return

    const fetchUnreadCount = async () => {
      try {
        const res = await fetch('/api/notifications?scope=unread')
        const json = await res.json()
        if (res.ok) {
          // The API returns notifications, count them
          const notifications = json.data ?? json
          setUnreadCount(Array.isArray(notifications) ? notifications.length : 0)
        }
      } catch (error) {
        console.error('Failed to fetch unread count:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUnreadCount()

    // Poll for new notifications every 60 seconds
    const interval = setInterval(fetchUnreadCount, 60000)

    return () => clearInterval(interval)
  }, [session])

  if (!session?.user) return null

  return (
    <Link
      href="/notifications"
      className={cn(
        'relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200',
        className
      )}
      title="Notifications"
    >
      <Bell className="w-5 h-5" />
      {!isLoading && unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-emerald-500 text-white text-[10px] font-bold rounded-full animate-pulse">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </Link>
  )
}
