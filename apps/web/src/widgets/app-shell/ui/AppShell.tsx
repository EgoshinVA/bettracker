'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
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
      <Sidebar onAddBet={() => setIsBetModalOpen(true)} />
      <div className="ml-56 flex flex-1 flex-col overflow-hidden">
        <Header />
        {/* overflow-x-hidden clips residual x during any layout jitter */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-8">
          {/*
            No AnimatePresence — it caused a flash in Next.js App Router because
            React renders the new component before framer can apply `initial` styles.
            Instead we key PageTransition on pathname: React unmounts the old one
            and mounts the fresh one, framer applies initial styles synchronously
            via useLayoutEffect before the first paint, then animates to `animate`.
          */}
          <PageTransition key={pathname} direction={direction}>
            {children}
          </PageTransition>
        </main>
      </div>
      <AddBetModal isOpen={isBetModalOpen} onClose={() => setIsBetModalOpen(false)} />
    </div>
  )
}
