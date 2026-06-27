'use client'

import { Toaster, toast } from 'react-hot-toast'
import type { Toast } from 'react-hot-toast'
import { CheckCircle2, XCircle, AlertCircle, Loader2, X } from 'lucide-react'

function ToastIcon({ type }: { type: Toast['type'] }) {
  switch (type) {
    case 'success':
      return <CheckCircle2 className="h-[18px] w-[18px] shrink-0 text-green-500" />
    case 'error':
      return <XCircle className="h-[18px] w-[18px] shrink-0 text-red-500" />
    case 'loading':
      return <Loader2 className="h-[18px] w-[18px] shrink-0 animate-spin text-violet-600" />
    default:
      return <AlertCircle className="h-[18px] w-[18px] shrink-0 text-slate-400" />
  }
}

export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      gutter={8}
      containerStyle={{ top: 24, right: 24 }}
      toastOptions={{
        duration: 4000,
        success: { duration: 3000 },
        error: { duration: 5000 },
      }}
    >
      {(t) => (
        <div
          role={t.type === 'error' ? 'alert' : 'status'}
          aria-live={t.type === 'error' ? 'assertive' : 'polite'}
          className={[
            'flex min-w-[300px] max-w-sm items-start gap-3',
            'rounded-xl border border-slate-100 bg-white px-4 py-3.5',
            'shadow-[0_4px_24px_-4px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.04)]',
            t.visible ? 'animate-toast-in' : 'animate-toast-out',
          ].join(' ')}
        >
          {/* Coloured icon */}
          <span className="mt-px">
            <ToastIcon type={t.type} />
          </span>

          {/* Message */}
          <p className="flex-1 text-sm font-medium leading-5 text-slate-900">
            {typeof t.message === 'function' ? t.message(t) : t.message}
          </p>

          {/* Dismiss */}
          <button
            onClick={() => toast.dismiss(t.id)}
            aria-label="Dismiss notification"
            className="-mr-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </Toaster>
  )
}
