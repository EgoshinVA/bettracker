'use client'

import { Search, Bell, HelpCircle, ChevronDown } from 'lucide-react'

interface HeaderProps {
  placeholder?: string
  balance?: string
  userName?: string
  userTier?: string
  showBalance?: boolean
  showAvatar?: boolean
}

export function Header({
  placeholder = 'Search analytics...',
  balance,
  userName = 'Alex Thorne',
  userTier = 'Pro Tier',
  showBalance = false,
  showAvatar = false,
}: HeaderProps) {
  return (
    <header className="flex h-16 items-center gap-4 border-b border-slate-100 bg-white px-6">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder={placeholder}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
        />
      </div>

      <div className="ml-auto flex items-center gap-3">
        {/* Balance */}
        {showBalance && balance && (
          <div className="text-right">
            <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400">Balance</p>
            <p className="text-sm font-bold text-slate-900">{balance}</p>
          </div>
        )}

        {/* Icons */}
        <button className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
          <Bell className="h-4 w-4" />
        </button>
        <button className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
          <HelpCircle className="h-4 w-4" />
        </button>

        <div className="h-6 w-px bg-slate-200" />

        {/* User */}
        {showAvatar ? (
          <button className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-slate-100 transition-colors">
            <div className="h-7 w-7 rounded-full bg-slate-300" />
            <div className="text-left">
              <p className="text-sm font-semibold text-slate-900">{userName}</p>
              <p className="text-xs text-slate-400">{userTier}</p>
            </div>
          </button>
        ) : (
          <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors">
            {userName}
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>
        )}
      </div>
    </header>
  )
}
