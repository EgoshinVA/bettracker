# @design — UI Component Patterns

## Design tokens
```
Accent:    violet-600 / hover:violet-700
Accent bg: violet-50
Success:   green-500 / bg-green-50 / text-green-700
Error:     red-500 / bg-red-50 / text-red-700
Pending:   amber-500 / bg-amber-50 / text-amber-700
Border:    border-slate-100 (cards) / border-slate-200 (inputs)
Text:      slate-900 (primary) / slate-500 (secondary) / slate-400 (caption)
```

## Stat Card
```tsx
<div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
  <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
  <span className="text-sm font-medium text-green-500">{delta}</span>
</div>
```

## Result Badge
```tsx
const variants = {
  WON: 'bg-green-50 text-green-700',
  LOST: 'bg-red-50 text-red-700',
  PENDING: 'bg-amber-50 text-amber-700',
}
<span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${variants[result]}`}>
  {result}
</span>
```

## Sidebar layout
- Width: w-56, fixed, h-screen, border-r border-slate-100
- Logo: text-xl font-bold text-slate-900
- Nav active: rounded-lg bg-violet-50 text-violet-600 font-medium
- Nav default: text-slate-500 hover:bg-slate-50 hover:text-slate-900
- Bottom CTA: w-full bg-violet-600 text-white rounded-lg py-2.5

## Input
```tsx
className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm
  placeholder:text-slate-400 focus:border-violet-500 focus:outline-none
  focus:ring-2 focus:ring-violet-500/20"
```

## Modal
```tsx
// Overlay: fixed inset-0 bg-black/20 backdrop-blur-sm z-50
// Panel: bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg
```

## Primary button
```tsx
className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white
  hover:bg-violet-700 transition-colors focus:ring-2 focus:ring-violet-500/20"
```
