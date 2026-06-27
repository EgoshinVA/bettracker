'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, BarChart2, Receipt, BookOpen, Settings, Plus } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Analytics', href: '/analytics', icon: BarChart2 },
  { label: 'Bets', href: '/bets', icon: Receipt },
  { label: 'Bookmakers', href: '/bookmakers', icon: BookOpen },
  { label: 'Settings', href: '/settings', icon: Settings },
]

interface SidebarProps {
  onAddBet?: () => void
}

export function Sidebar({ onAddBet }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-56 flex-col border-r border-slate-100 bg-white">
      {/* Logo */}
      <div className="px-5 py-6">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600">
            <BarChart2 className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-base font-bold leading-none text-slate-900">BetTracker</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-3">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-violet-50 text-violet-600'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4">
        <button
          onClick={onAddBet}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700"
        >
          <Plus className="h-4 w-4" />
          Add Bet
        </button>
      </div>
    </aside>
  )
}
