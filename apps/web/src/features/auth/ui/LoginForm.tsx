'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormData } from '@/shared/lib/validations/auth'
import { FormInput } from '@/shared/ui/FormInput'
import { PasswordInput } from '@/shared/ui/PasswordInput'

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (_data: LoginFormData) => {
    // TODO: connect to API when backend is ready
    // const { accessToken } = await authApi.login(_data)
    // router.push('/dashboard')
    await new Promise((r) => setTimeout(r, 800)) // simulate network
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <FormInput
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <div className="space-y-1">
        <PasswordInput
          label="Password"
          autoComplete="current-password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />
        <div className="flex justify-end pt-0.5">
          <Link
            href="/forgot-password"
            className="text-xs text-violet-600 hover:text-violet-700 hover:underline transition-colors"
          >
            Forgot password?
          </Link>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-violet-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500/30 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Signing in…
          </span>
        ) : (
          'Sign in'
        )}
      </button>

      <p className="text-center text-sm text-slate-500">
        Don&apos;t have an account?{' '}
        <Link
          href="/register"
          className="font-medium text-violet-600 hover:text-violet-700 transition-colors"
        >
          Create one free
        </Link>
      </p>
    </form>
  )
}
