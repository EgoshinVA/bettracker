'use client'

import { motion } from 'framer-motion'

interface PageTransitionProps {
  children: React.ReactNode
  direction: 1 | -1
}

// direction = 1  → going DOWN the nav (e.g. Dashboard → Settings):
//   new page slides UP from below  (y: +offset → 0)
// direction = -1 → going UP the nav (e.g. Settings → Dashboard):
//   new page slides DOWN from above (y: -offset → 0)
const OFFSET = 32

export function PageTransition({ children, direction }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: direction * OFFSET }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
      className="h-full"
    >
      {children}
    </motion.div>
  )
}
