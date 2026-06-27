'use client'

import { motion } from 'framer-motion'

const variants = {
  hidden: (d: number) => ({ opacity: 0, x: d * 36 }),
  enter: { opacity: 1, x: 0 },
  exit: (d: number) => ({ opacity: 0, x: d * -36 }),
}

const transition = { duration: 0.22, ease: [0.4, 0, 0.2, 1] }

interface PageTransitionProps {
  children: React.ReactNode
  direction: 1 | -1
}

export function PageTransition({ children, direction }: PageTransitionProps) {
  return (
    <motion.div
      custom={direction}
      variants={variants}
      initial="hidden"
      animate="enter"
      exit="exit"
      transition={transition}
      className="h-full"
    >
      {children}
    </motion.div>
  )
}
