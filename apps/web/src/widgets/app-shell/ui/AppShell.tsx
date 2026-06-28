'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Sidebar } from '@/widgets/sidebar/ui/Sidebar'
import { Header } from '@/widgets/header/ui/Header'
import { AddBetModal } from '@/features/add-bet/ui/AddBetModal'
import { PageTransition } from '@/shared/ui/PageTransition'
import { NAV_ORDER } from '@/shared/lib/nav'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const [isBetModalOpen, setIsBetModalOpen] = useState(false)
  const pathname = usePathname()
  const prevRef = useRef(pathname)
  const { status } = useSession()
  const isAuthenticated = status === 'authenticated'

  // Computed synchronously during render so framer receives the correct
  // direction before the new PageTransition mounts and paints.
  const direction = useMemo<1 | -1>(() => {
    const prevOrder = NAV_ORDER[prevRef.current] ?? 0
    const currOrder = NAV_ORDER[pathname] ?? 0
    return currOrder >= prevOrder ? 1 : -1
  }, [pathname])

  useEffect(() => {
    prevRef.current = pathname
  })

  return (
    <div className="flex h-screen bg-slate-50">
      {isAuthenticated && <Sidebar onAddBet={() => setIsBetModalOpen(true)} />}
      <div className={`flex flex-1 flex-col overflow-hidden${isAuthenticated ? ' ml-56' : ''}`}>
        {isAuthenticated && <Header />}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-8">
          <PageTransition key={pathname} direction={direction}>
            {children}
          </PageTransition>
        </main>
      </div>
      {isAuthenticated && <AddBetModal isOpen={isBetModalOpen} onClose={() => setIsBetModalOpen(false)} />}
    </div>
  )
}
