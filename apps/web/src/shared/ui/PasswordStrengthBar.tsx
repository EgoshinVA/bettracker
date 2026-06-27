'use client'

const requirements = [
  { re: /.{8,}/, label: '8+ characters' },
  { re: /[A-Z]/, label: 'uppercase letter' },
  { re: /[a-z]/, label: 'lowercase letter' },
  { re: /[0-9]/, label: 'number' },
  { re: /[^A-Za-z0-9]/, label: 'special character' },
]

const STRENGTH_META: Record<number, { label: string; color: string; bar: string }> = {
  0: { label: '', color: '', bar: 'bg-slate-200' },
  1: { label: 'Very weak', color: 'text-red-500', bar: 'bg-red-500' },
  2: { label: 'Weak', color: 'text-orange-500', bar: 'bg-orange-500' },
  3: { label: 'Fair', color: 'text-amber-500', bar: 'bg-amber-500' },
  4: { label: 'Strong', color: 'text-green-600', bar: 'bg-green-500' },
  5: { label: 'Very strong', color: 'text-green-700', bar: 'bg-green-600' },
}

interface PasswordStrengthBarProps {
  password: string
}

export function PasswordStrengthBar({ password }: PasswordStrengthBarProps) {
  if (!password) return null

  const met = requirements.filter((r) => r.re.test(password))
  const strength = met.length
  const meta = STRENGTH_META[strength]

  const missing = requirements
    .filter((r) => !r.re.test(password))
    .map((r) => r.label)

  return (
    <div className="space-y-2 pt-1">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i < strength ? meta.bar : 'bg-slate-200'
            }`}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400">
          {missing.length > 0 && `Missing: ${missing.slice(0, 3).join(', ')}${missing.length > 3 ? '…' : ''}`}
        </p>
        {strength > 0 && (
          <p className={`text-xs font-medium ${meta.color}`}>{meta.label}</p>
        )}
      </div>
    </div>
  )
}
