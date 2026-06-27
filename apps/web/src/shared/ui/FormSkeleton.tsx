const COLS_CLASS = { 2: 'grid-cols-2', 3: 'grid-cols-3' } as const

interface FormSkeletonProps {
  cols: 2 | 3
  withButton?: boolean
}

export function FormSkeleton({ cols, withButton }: FormSkeletonProps) {
  return (
    <div>
      <div className={`grid ${COLS_CLASS[cols]} gap-4`}>
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-[62px] animate-pulse rounded-lg bg-slate-100" />
        ))}
      </div>
      {withButton && (
        <div className="mt-4 flex justify-end">
          <div className="h-[38px] w-32 animate-pulse rounded-lg bg-slate-100" />
        </div>
      )}
    </div>
  )
}
