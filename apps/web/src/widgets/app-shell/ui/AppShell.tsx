'use client'

import { useState } from 'react'
import { Sidebar } from '@/widgets/sidebar/ui/Sidebar'
import { Header } from '@/widgets/header/ui/Header'
import { AddBetModal } from '@/features/add-bet/ui/AddBetModal'

interface AppShellProps {
  children: React.ReactNode
  headerProps?: React.ComponentProps<typeof Header>
}

export function AppShell({ children, headerProps }: AppShellProps) {
  const [isBetModalOpen, setIsBetModalOpen] = useState(false)

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar onAddBet={() => setIsBetModalOpen(true)} />
      <div className="ml-56 flex flex-1 flex-col overflow-hidden">
        <Header {...headerProps} />
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
      <AddBetModal isOpen={isBetModalOpen} onClose={() => setIsBetModalOpen(false)} />
    </div>
  )
}
