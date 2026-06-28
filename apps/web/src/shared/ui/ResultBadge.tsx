'use client'

import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib/cn'
import type { BetResult } from '@/shared/lib/types'

const variants: Record<BetResult, string> = {
  WON: 'bg-green-50 text-green-700 border border-green-100',
  LOST: 'bg-red-50 text-red-700 border border-red-100',
  PENDING: 'bg-amber-50 text-amber-700 border border-amber-100',
}

interface ResultBadgeProps {
  result: BetResult
}

export function ResultBadge({ result }: ResultBadgeProps) {
  const { t } = useTranslation()
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        variants[result]
      )}
    >
      {t(`result.${result}`)}
    </span>
  )
}
