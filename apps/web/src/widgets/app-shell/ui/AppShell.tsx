'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { AnimatePresence } from 'framer-motion'
import { Sidebar } from '@/widgets/sidebar/ui/Sidebar'
import { Header } from '@/widgets/header/ui/Header'
import { AddBetModal } from '@/features/add-bet/ui/AddBetModal'
import { PageTransition } from '@/shared/ui/PageTransition'
import { NAV_ORDER } from '@/shared/lib/nav'

interface AppShellProps {
  children: React.ReactNode
  placeholder?: string
}

export function AppShell({ children, placeholder }: AppShellProps) {
  const [isBetModalOpen, setIsBetModalOpen] = useState(false)
  const pathname = usePathname()
  const prevRef = useRef(pathname)

  // Computed during render so framer-motion receives the correct direction
  // before animations start (not deferred via useEffect).
  const direction = useMemo<1 | -1>(() => {
    const prevOrder = NAV_ORDER[prevRef.current] ?? 0
    const currOrder = NAV_ORDER[pathname] ?? 0
    return currOrder >= prevOrder ? 1 : -1
  }, [pathname])

  // Update ref after render — must not run inside useMemo (side-effect).
  useEffect(() => {
    prevRef.current = pathname
  })

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar onAddBet={() => setIsBetModalOpen(true)} />
      <div className="ml-56 flex flex-1 flex-col overflow-hidden">
        <Header placeholder={placeholder} />
        {/* overflow-x-hidden clips the x-axis slide so no scrollbar flashes */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-8">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <PageTransition key={pathname} direction={direction}>
              {children}
            </PageTransition>
          </AnimatePresence>
        </main>
      </div>
      <AddBetModal isOpen={isBetModalOpen} onClose={() => setIsBetModalOpen(false)} />
    </div>
  )
}
