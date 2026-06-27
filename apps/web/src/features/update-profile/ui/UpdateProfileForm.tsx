'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { useUpdateProfileMutation } from '../api/update-profile.api'
import { FormSkeleton } from '@/shared/ui/FormSkeleton'

const schema = z.object({
  name: z.string().min(2, 'Min 2 characters').max(50, 'Max 50 characters').trim(),
  email: z.string().email('Invalid email address').toLowerCase(),
})

type FormData = z.infer<typeof schema>

function extractErrorMessage(err: unknown, fallback: string): string {
  if (err && typeof err === 'object' && 'data' in err) {
    const msg = (err as { data?: { message?: string | string[] } }).data?.message
    if (Array.isArray(msg)) return msg[0]
    if (typeof msg === 'string') return msg
  }
  return fallback
}

export function UpdateProfileForm() {
  const { data: session, update, status } = useSession()
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: {
      name: session?.user?.name ?? '',
      email: session?.user?.email ?? '',
    },
  })

  const onSubmit = async (data: FormData) => {
    try {
      await updateProfile(data).unwrap()
      await update({ user: { name: data.name, email: data.email } })
      reset(data)
      toast.success('Profile updated')
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Failed to update profile'))
    }
  }

  if (status === 'loading') return <FormSkeleton cols={2} withButton />

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-400">
            Full Name
          </label>
          <input
            {...register('name')}
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-400">
            Email Address
          </label>
          <input
            {...register('email')}
            type="email"
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          disabled={!isDirty || isSaving}
          className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}
