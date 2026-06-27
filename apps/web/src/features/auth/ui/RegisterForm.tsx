'use client'

import Link from 'next/link'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, type RegisterFormData } from '@/shared/lib/validations/auth'
import { FormInput } from '@/shared/ui/FormInput'
import { PasswordInput } from '@/shared/ui/PasswordInput'
import { PasswordStrengthBar } from '@/shared/ui/PasswordStrengthBar'

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const password = useWatch({ control, name: 'password', defaultValue: '' })

  const onSubmit = async (_data: RegisterFormData) => {
    // TODO: connect to API when backend is ready
    // await authApi.register({ name: _data.name, email: _data.email, password: _data.password })
    // router.push('/dashboard')
    await new Promise((r) => setTimeout(r, 800)) // simulate network
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <FormInput
        label="Full name"
        autoComplete="name"
        placeholder="Alex Thorne"
        error={errors.name?.message}
        {...register('name')}
      />

      <FormInput
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <div>
        <PasswordInput
          label="Password"
          autoComplete="new-password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />
        <PasswordStrengthBar password={password} />
      </div>

      <PasswordInput
        label="Confirm password"
        autoComplete="new-password"
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-violet-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500/30 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Creating account…
          </span>
        ) : (
          'Create account'
        )}
      </button>

      <p className="text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-medium text-violet-600 hover:text-violet-700 transition-colors"
        >
          Sign in
        </Link>
      </p>
    </form>
  )
}
