'use client'

import { forwardRef, useState, type InputHTMLAttributes } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
  error?: string
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const [visible, setVisible] = useState(false)
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="space-y-1.5">
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700">
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={visible ? 'text' : 'password'}
            className={cn(
              'w-full rounded-lg border bg-slate-50 px-3 py-2.5 pr-10 text-sm text-slate-900 transition-colors',
              'placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2',
              error
                ? 'border-red-300 focus:border-red-400 focus:ring-red-500/20'
                : 'border-slate-200 focus:border-violet-500 focus:ring-violet-500/20',
              className,
            )}
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded text-slate-400 transition-colors hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
          >
            {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    )
  },
)

PasswordInput.displayName = 'PasswordInput'
