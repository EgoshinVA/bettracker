import { AppShell } from '@/widgets/app-shell/ui/AppShell'

export default function PagesLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>
}
