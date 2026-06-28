'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { loginSchema, type LoginFormData } from '@/shared/lib/validations/auth'
import { FormInput } from '@/shared/ui/FormInput'
import { PasswordInput } from '@/shared/ui/PasswordInput'

interface LoginFormProps {
  onSuccess?: () => void
  onSwitchMode?: () => void
  callbackUrl?: string
  showHeader?: boolean
}

export function LoginForm({
  onSuccess,
  onSwitchMode,
  callbackUrl = '/dashboard',
  showHeader = true,
}: LoginFormProps) {
  const router = useRouter()
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    if (result?.error) {
      toast.error(t('auth.login.invalidCredentials'))
      return
    }

    toast.success(t('auth.login.welcomeBack'))
    onSuccess?.()
    router.push(callbackUrl)
    router.refresh()
  }

  return (
    <>
      {showHeader && (
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">{t('auth.login.title')}</h1>
          <p className="mt-1.5 text-sm text-slate-500">{t('auth.login.subtitle')}</p>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <FormInput
          label={t('auth.login.email')}
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="space-y-1">
          <PasswordInput
            label={t('auth.login.password')}
            autoComplete="current-password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />
          <div className="flex justify-end pt-0.5">
            <Link
              href="/forgot-password"
              className="text-xs text-violet-600 transition-colors hover:text-violet-700 hover:underline"
            >
              {t('auth.login.forgotPassword')}
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
              {t('auth.login.signingIn')}
            </span>
          ) : (
            t('auth.login.signIn')
          )}
        </button>

        <p className="text-center text-sm text-slate-500">
          {t('auth.login.noAccount')}{' '}
          {onSwitchMode ? (
            <button
              type="button"
              onClick={onSwitchMode}
              className="font-medium text-violet-600 transition-colors hover:text-violet-700"
            >
              {t('auth.login.createFree')}
            </button>
          ) : (
            <Link
              href="/register"
              className="font-medium text-violet-600 transition-colors hover:text-violet-700"
            >
              {t('auth.login.createFree')}
            </Link>
          )}
        </p>
      </form>
    </>
  )
}
