'use client'

import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="space-y-1.5">
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700">
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-lg border bg-slate-50 px-3 py-2.5 text-sm text-slate-900 transition-colors',
            'placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2',
            error
              ? 'border-red-300 focus:border-red-400 focus:ring-red-500/20'
              : 'border-slate-200 focus:border-violet-500 focus:ring-violet-500/20',
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    )
  },
)

FormInput.displayName = 'FormInput'
