'use client'

import { useSession, signOut } from 'next-auth/react'
import { Search, Bell, HelpCircle, LogOut } from 'lucide-react'

interface HeaderProps {
  placeholder?: string
}

export function Header({ placeholder = 'Search analytics...' }: HeaderProps) {
  const { data: session } = useSession()

  const userName = session?.user?.name ?? '—'
  const initials = userName !== '—' ? userName.charAt(0).toUpperCase() : '?'

  return (
    <header className="flex h-16 items-center gap-4 border-b border-slate-100 bg-white px-6">
      {/* Search */}
      <div className="relative max-w-md flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder={placeholder}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
        />
      </div>

      <div className="ml-auto flex items-center gap-3">
        {/* Icon buttons */}
        <button className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700">
          <Bell className="h-4 w-4" />
        </button>
        <button className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700">
          <HelpCircle className="h-4 w-4" />
        </button>

        <div className="h-6 w-px bg-slate-200" />

        {/* User */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-2.5 rounded-lg px-2 py-1.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-100">
              <span className="text-xs font-bold text-violet-600">{initials}</span>
            </div>
            <span className="text-sm font-semibold text-slate-900">{userName}</span>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            title="Sign out"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
